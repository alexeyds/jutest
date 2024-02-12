import { jutest } from "jutest";
import { TestContext, TestSuite } from "core";

function describe(name, block) {
  let context = new TestContext();
  return new TestSuite(name, block, { context });
}

jutest("TestSuite", s => {
  s.describe("#constructor", s => {
    s.test("sets initial attributes", t => {
      let suite = describe('suite', () => {});

      t.equal(suite.isComposed, false);
      t.equal(suite.isASuite, true);
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
    s.test("composes empty array if no tests are registered", async t => {
      let suite = describe('test', () => {});

      t.same(await suite.composeSpecs(), []);
      t.equal(suite.isComposed, true);
    });

    s.test("uses single-use job", t => {
      let suite = describe('test', () => {});
      let promise1 = suite.composeSpecs();
      let promise2 = suite.composeSpecs(); 

      t.equal(promise1, promise2);
    });

    s.test("adds tests from suite body", async t => {
      let suite = describe('test', s => {
        s.test('foo', () => {});
      });
      let specs = await suite.composeSpecs();

      t.equal(specs.length, 1);
      t.equal(specs[0].name, 'test foo');
    });

    s.test("adds nested suites from suite body", async t => {
      let suite = describe('test', s => {
        s.describe('nested', s => {
          s.test('foo', () => {});
        });
      });
      let specs = await suite.composeSpecs();

      t.equal(specs.length, 1);
      let nestedSuite = specs[0];
      let nestedSuiteSpecs = await nestedSuite.composeSpecs();
      t.equal(nestedSuite.name, 'test nested');
      t.equal(nestedSuiteSpecs[0].name, 'test nested foo');
    });

    s.test("allows modifying context setups", async t => {
      let assigns;

      let suite = describe('test', s => {
        s.setup(() => ({ a: 1 }));
        s.test('foo', (t, a) => assigns = a);
      });

      let [test] = await suite.composeSpecs();
      await test.run();

      t.same(assigns, { a: 1 });
    });

    s.test("returns tests and suites in order they were defined", async t => {
      let suite = describe('suite', s => {
        s.test('test1', () => {});
        s.describe('nested', s => {
          s.test('test', () => {});
        });
        s.test('test2', () => {});
      });

      let specs = await suite.composeSpecs();

      t.match(specs[0].name, 'suite test1');
      t.match(specs[1].name, 'suite nested');
      t.match(specs[2].name, 'suite test2');
    });

    s.test("locks test context outside suite body", async t => {
      let suite = describe('suite', s => {
        s.describe('suite2', () => {
          s.setup(() => {});
        });
      });

      await t.async.rejects(suite.composeSpecs(), 'locked');
    });

    s.test("locks test/suites addition outside of suite body", async t => {
      let suite = describe('suite', s => {
        s.describe('suite2', () => {
          s.test(() => {});
        });
      });

      await t.async.rejects(suite.composeSpecs(), 'locked');
    });
  });
});
