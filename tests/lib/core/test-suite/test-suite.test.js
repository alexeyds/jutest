import { jutest } from "jutest";
import { TestContext, TestSuite } from "core";

function describe(name, block) {
  let context = new TestContext();
  return new TestSuite(name, block, { context });
}

jutest("TestSuite", s => {
  s.describe("#constructor", s => {
    s.test("sets initial attributes", (t) => {
      let context = new TestContext();
      let suite = new TestSuite('suite', () => {}, { context });

      t.assert(suite.sourceLocator);
      t.equal(suite.isComposed, false);
      t.equal(suite.isASuite, true);
      t.equal(suite.ownName, 'suite');
      t.assert(suite.contextId);
      t.same(suite.parentContextIds, [context.id]);
    });
  });

  s.describe("#name", s => {
    s.test("returns suite name", t => {
      let suite = describe('suite', () => {});
      t.equal(suite.name, 'suite');
    });

    s.test("adds name on top of the previous context", t => {
      let context = new TestContext();
      context.addName('foobar');
      let suite = new TestSuite('suite', () => {}, { context });

      t.equal(suite.name, 'foobar suite');
    });

    s.test("doesn't mutate previous context", t => {
      let context = new TestContext();
      context.addName('foobar');
      new TestSuite('suite', () => {}, { context });

      t.equal(context.name, 'foobar');
    });
  });

  s.describe("#composeSpecs", s => {
    s.test("composes specs defined in the suite's body", async t => {
      let suite = describe('test', s => {
        s.test('foo', () => {});
      });
      let specs = await suite.composeSpecs();

      t.equal(suite.isComposed, true);
      t.equal(specs.length, 1);
      t.equal(specs[0].name, 'test foo');
    });

    s.test("utilizes single-use job", t => {
      let suite = describe('test', () => {});
      let promise1 = suite.composeSpecs();
      let promise2 = suite.composeSpecs(); 

      t.equal(promise1, promise2);
    });
  });
});
