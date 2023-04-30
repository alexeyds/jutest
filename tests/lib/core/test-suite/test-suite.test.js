import jutest from "jutest";
import { TestContext } from "core/test-context";
import { TestSuite } from "core/test-suite";

function describe(name, block) {
  let context = new TestContext();
  return new TestSuite(name, block, { context });
}

jutest("TestSuite", s => {
  s.describe("#constructor", s => {
    s.test("sets initial attributes", t => {
      let suite = describe('test', () => {});

      t.equal(suite.tests, undefined);
      t.equal(suite.isReady, false);
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

  s.describe("#createTest", s => {
    s.test("creates test with suite's context", t => {
      let suite = describe('test', () => {});
      let test = suite.createTest('foo', () => {});

      t.equal(test.name, 'test foo');
    });
  });

  s.describe("#createSuite", s => {
    s.test("creates nested suite", t => {
      let suite = describe('test', () => {});
      let nestedSuite = suite.createSuite('foo', () => {});
      let test = nestedSuite.createTest('bar', () => {});

      t.equal(nestedSuite.name, 'test foo');
      t.equal(test.name, 'test foo bar');
    });
  });

  s.describe("#composeTests", s => {
    s.test("composes empty array if no tests are registered", async t => {
      let suite = describe('test', () => {});
      let result = await suite.composeTests();

      t.same(suite.tests, []);
      t.equal(result, suite.tests);
      t.equal(suite.isReady, true);
    });

    s.test("uses single-use job", t => {
      let suite = describe('test', () => {});
      let promise1 = suite.composeTests();
      let promise2 = suite.composeTests(); 

      t.equal(promise1, promise2);
    });

    s.test("allows adding tests from suite body", async t => {
      let suite = describe('test', s => {
        s.test('foo', () => {});
      });
      await suite.composeTests();

      t.equal(suite.tests.length, 1);
      t.equal(suite.tests[0].name, 'test foo');
    });

    s.test("allows adding nested suites from suite body", async t => {
      let suite = describe('test', s => {
        s.describe('nested', s => {
          s.test('foo', () => {});
        });
      });
      await suite.composeTests();

      t.equal(suite.tests.length, 1);
      t.equal(suite.tests[0].name, 'test nested foo');
    });

    s.test("allows modifying setups setups", async t => {
      let assigns;

      let suite = describe('test', s => {
        s.setup(() => ({ a: 1 }));
        s.test('foo', (t, a) => assigns = a);
      });

      await suite.composeTests();
      await suite.tests[0].run();

      t.same(assigns, { a: 1 });
    });
  });
});
