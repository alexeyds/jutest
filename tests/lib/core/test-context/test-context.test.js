import { jutest } from "jutest";
import { TestContext } from "core/test-context";

jutest("TestContext", s => {
  s.setup(() => {
    return { context: new TestContext() };
  });

  s.describe('addName', s => {
    s.test('adds name to context', (t, { context }) => {
      context.addName('testing');
      t.same(context.names, ['testing']);
    });
  });

  s.describe("copy", s => {
    s.test("copies current context", (t, { context }) => {
      context.addName('test');
      let newContext = context.copy();

      t.same(newContext.names, ['test']);
    });

    s.test("keeps context states separate", (t, { context }) => {
      context.addName('foo');
      let newContext = context.copy();
      newContext.addName('bar');

      t.same(context.names, ['foo']);
    });
  });

  s.describe("runSetups", s => {
    s.test("runs added setups", async (t, { context }) => {
      let result;
      context.setup(() => result = 1);
      await context.runSetups();

      t.equal(result, 1);
    });

    s.test('merges all setup results together', async (t, { context }) => {
      context.setup(() => ({ a: 1, b: 2 }));
      context.setup(() => ({ b: 3, c: 4 }));
      let result = await context.runSetups();

      t.same(result, { a: 1, b: 3, c: 4 });
    });

    s.test('passes previous setup result to the next', async (t, { context }) => {
      let multiplier = ({ result }) => {
        return { result: result*2 };
      };

      context.setup(() => ({ result: 5 }));
      context.setup(multiplier);
      context.setup(multiplier);
      let { result } = await context.runSetups();

      t.equal(result, 20);
    });

    s.test("works even if setup returns non-mergeable value", async (t, { context }) => {
      context.setup(() => 'asd');
      let result = await context.runSetups();

      t.same(result, {});
    });
  });

  s.describe("runTeardowns", s => {
    s.test("runs added teardowns", async (t, { context }) => {
      let result;
      context.teardown(() => result = 1);
      await context.runTeardowns();

      t.equal(result, 1);
    });

    s.test("runs teardowns in order", async (t, { context }) => {
      let results = [];
      context.teardown(() => Promise.resolve().then(() => results.push(1)));
      context.teardown(() => results.push(2));
      await context.runTeardowns();

      t.same(results, [1, 2]);
    });

    s.test("passes provided arguments to teardowns", async (t, { context }) => {
      let result;
      context.teardown((a, b) => result = a - b);
      await context.runTeardowns(10, 5);

      t.same(result, 5);
    });
  });

  s.describe('runAfterTestAssertions', s => {
    s.test("runs added assertions", async (t, { context }) => {
      let result;
      context.assertAfterTest((a, b) => result = a - b);
      await context.runAfterTestAssertions(10, 5);

      t.same(result, 5);
    });
  });

  s.describe('runBeforeTestAssertions', s => {
    s.test("runs added assertions", async (t, { context }) => {
      let result;
      context.assertBeforeTest((a, b) => result = a - b);
      await context.runBeforeTestAssertions(10, 5);

      t.same(result, 5);
    });
  });

  s.describe("name", s => {
    s.test("returns context name", (t, { context }) => {
      context.addName("Foobar");
      context.addName("Test");

      t.equal(context.name, 'Foobar Test');
    });
  });

  s.describe("lock", s => {
    s.test("prevents modifying locked context", (t, { context }) => {
      context.lock('locked');
      t.throws(() => context.addName('Foobar'), /locked/);
    });
  });

  s.describe("toConfigurationAPI", s => {
    s.test("exposes setup methods", (t, { context }) => {
      let config = context.toConfigurationAPI();

      t.assert(config.setup);
      t.assert(config.teardown);
      t.assert(config.assertBeforeTest);
      t.assert(config.assertAfterTest);
      t.assert(config.addName);
    });
  });

  s.describe("ids", s => {
    s.test("has own id", (t, { context }) => {
      t.assert(context.id);
      t.same(context.parentIds, []);
    });

    s.test("includes parent ids on copied contexts", (t, { context }) => {
      let context2 = context.copy();

      t.same(context2.parentIds, [context.id]);
      t.notEqual(context2.id, context.id);
    });

    s.test("supports deeper nesting", (t, { context }) => {
      let context2 = context.copy();
      let context3 = context2.copy();

      t.same(context3.parentIds, [context.id, context2.id]);
    });
  });
});
