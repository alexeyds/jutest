import jutest from 'jutest';
import TestSetup from "test-setup";

jutest('TestSetup', s => {
  s.describe('#runSetups', s => {
    s.test('returns empty object if no setups are provided', async t => {
      let setup = new TestSetup();
      let result = await setup.runSetups();

      t.same(result, {});
    });

    s.test("returns added setup's return value", async t => {
      let setup = new TestSetup();
      setup.setup(() => ({ a: 1 }));
      let result = await setup.runSetups();

      t.same(result, {a: 1});
    });

    s.test('merges setup results together', async t => {
      let setup = new TestSetup();
      setup.setup(() => ({ a: 1 }));
      setup.setup(() => ({ b: 2 }));
      let result = await setup.runSetups();

      t.same(result, {a: 1, b: 2});
    });

    s.test('resolves async setups in order', async t => {
      let setup = new TestSetup();
      setup.setup(async () => Promise.resolve({ a: 1 }));
      setup.setup(async () => ({ a: 2 }));
      let result = await setup.runSetups();

      t.same(result, {a: 2});
    });

    s.test('passes previous assigns to the next setup', async t => {
      let setup = new TestSetup();
      setup.setup(() => ({ a: 1 }));
      setup.setup((setups) => ({ b: setups.a + 5 }));
      let result = await setup.runSetups();

      t.same(result, {a: 1, b: 6});
    });
  });

  s.describe("#runTeardowns", s => {
    s.test("does nothing if there are no teardown functions", async () => {
      let setup = new TestSetup();
      await setup.runTeardowns();
    });

    s.test("runs added teardown function", async t => {
      let wasRun = false;
      let setup = new TestSetup();

      setup.teardown(() => wasRun = true);
      await setup.runTeardowns();

      t.equal(wasRun, true);
    });

    s.test("runs teardown functions in order", async t => {
      let teardowns = [];
      let setup = new TestSetup();

      setup.teardown(async () => {
        await Promise.resolve();
        teardowns.push('slow');
      });
      setup.teardown(async () => teardowns.push('fast'));

      await setup.runTeardowns();

      t.same(teardowns, ['slow', 'fast']);
    });

    s.test("passes provided arguments to teardown functions", async t => {
      let calledWith;
      let setup = new TestSetup();

      setup.teardown(arg => calledWith = arg);
      await setup.runTeardowns('foobar');

      t.equal(calledWith, 'foobar');
    });
  });

  s.describe("#runBeforeTestEndCallbacks", s => {
    s.test("behaves like other callbacks", async t => {
      let setup = new TestSetup();
      await setup.runBeforeTestEndCallbacks();

      let calledWith;
      setup.beforeTestEnd(arg => calledWith = arg);
      await setup.runBeforeTestEndCallbacks('foobar');

      t.equal(calledWith, 'foobar');
    });
  });

  s.describe("#clone", s => {
    s.test("clones all defined callbacks into a new object", async t => {
      let setup = new TestSetup();
      setup.setup(() => ({ a: 1 }));
      setup = setup.clone();

      let result = await setup.runSetups();
      t.same(result, {a: 1});
    });

    s.test("callbacks are not shared between cloned instances", async t => {
      let oldSetup = new TestSetup();
      oldSetup.setup(() => ({ a: 1 }));
      let newSetup = oldSetup.clone();
      oldSetup.setup(() => ({ b: 2 }));

      let oldResult = await oldSetup.runSetups();
      t.same(oldResult, {a: 1, b: 2});
      let newResult = await newSetup.runSetups();
      t.same(newResult, {a: 1});
    });
  });
});
