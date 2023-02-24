import jutest from "jutest";
import { createTestContext, addToContext, runSetups } from "test-context";

jutest("test-context", s => {
  s.describe("createTestContext", s => {
    s.test("returns basic context", t => {
      let context = createTestContext();

      t.same(context.names, []);
      t.same(context.setups, []);
      t.same(context.teardowns, []);
      t.same(context.beforeTestAssertions, []);
      t.same(context.afterTestAssertions, []);
    });
  });

  s.describe('addToContext', s => {
    s.test("adds items to specified array", t => {
      let context = createTestContext();
      let newContext = addToContext(context, 'names', 'test');

      t.same(newContext.names, ['test']);
    });

    s.test("creates different context object", t => {
      let context = createTestContext();
      let newContext = addToContext(context, 'names', 'test');

      t.notEqual(context, newContext);
    });
  });

  s.describe('runSetups', s => {
    s.test("does nothing if there are no setups", async () => {
      let context = createTestContext();
      await runSetups(context);
    });

    s.test('runs added setups', async t => {
      let a;

      let context = contextWithSetups(
        () => a = 1
      );

      await runSetups(context);

      t.equal(a, 1);
    });

    s.test('merges all setups in order and returns the result', async t => {
      let context = contextWithSetups(
        () => ({ a: 1, b: 2 }),
        () => ({ b: 3, c: 4 })
      );
      let result = await runSetups(context);

      t.same(result, { a: 1, b: 3, c: 4 });
    });

    s.test('works if setups return non-mergeable values', async t => {
      let context = contextWithSetups(
        () => 'foo',
        () => 'bar'
      );
      let result = await runSetups(context);

      t.same(result, {});
    });

    s.test("passes assigns to next setup", async t => {
      let passedAssigns;

      let context = contextWithSetups(
        () => ({ a: 1 }),
        (assigns) => passedAssigns = assigns
      );
      await runSetups(context);

      t.same(passedAssigns, {a: 1});
    });
  });
});

function contextWithSetups(...setups) {
  let context = createTestContext();

  setups.forEach(setup => {
    context = addToContext(context, 'setups', setup);
  });

  return context;
}
