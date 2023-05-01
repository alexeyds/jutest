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
      let suite = describe('suite', () => {});

      t.equal(suite.tests, undefined);
      t.equal(suite.isReady, false);
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

    s.test("adds tests from suite body", async t => {
      let suite = describe('test', s => {
        s.test('foo', () => {});
      });
      await suite.composeTests();

      t.equal(suite.tests.length, 1);
      t.equal(suite.tests[0].name, 'test foo');
    });

    s.test("adds nested suites from suite body", async t => {
      let suite = describe('test', s => {
        s.describe('nested', s => {
          s.test('foo', () => {});
        });
      });
      await suite.composeTests();

      t.equal(suite.tests.length, 1);
      t.equal(suite.tests[0].name, 'test nested foo');
    });

    s.test("allows modifying context setups", async t => {
      let assigns;

      let suite = describe('test', s => {
        s.setup(() => ({ a: 1 }));
        s.test('foo', (t, a) => assigns = a);
      });

      await suite.composeTests();
      await suite.tests[0].run();

      t.same(assigns, { a: 1 });
    });

    s.test("returns tests in order they were defined", async t => {
      let suite = describe('suite', s => {
        s.test('test1', () => {});
        s.describe('nested', s => {
          s.test('test', () => {});
        });
        s.test('test2', () => {});
      });

      let tests = await suite.composeTests();

      t.match(tests[0].name, 'suite test1');
      t.match(tests[1].name, 'suite nested test');
      t.match(tests[2].name, 'suite test2');
    });
  });
});
