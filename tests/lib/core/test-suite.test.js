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

      t.equal(suite.specs, undefined);
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

  s.describe("#compose", s => {
    s.test("composes empty array if no tests are registered", async t => {
      let suite = describe('test', () => {});
      let result = await suite.compose();

      t.same(suite.specs, []);
      t.equal(result, suite.specs);
      t.equal(suite.isReady, true);
    });

    s.test("uses single-use job", t => {
      let suite = describe('test', () => {});
      let promise1 = suite.compose();
      let promise2 = suite.compose(); 

      t.equal(promise1, promise2);
    });

    s.test("adds tests from suite body", async t => {
      let suite = describe('test', s => {
        s.test('foo', () => {});
      });
      await suite.compose();

      t.equal(suite.specs.length, 1);
      t.equal(suite.specs[0].name, 'test foo');
    });

    s.test("adds nested suites from suite body", async t => {
      let suite = describe('test', s => {
        s.describe('nested', s => {
          s.test('foo', () => {});
        });
      });
      await suite.compose();

      t.equal(suite.specs.length, 1);
      let nestedSuite = suite.specs[0];
      t.equal(nestedSuite.name, 'test nested');
      t.equal(nestedSuite.specs[0].name, 'test nested foo');
    });

    s.test("allows modifying context setups", async t => {
      let assigns;

      let suite = describe('test', s => {
        s.setup(() => ({ a: 1 }));
        s.test('foo', (t, a) => assigns = a);
      });

      await suite.compose();
      await suite.specs[0].run();

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

      let specs = await suite.compose();

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

      await t.async.rejects(suite.compose(), 'locked');
    });

    s.test("locks test/suites addition outside of suite body", async t => {
      let suite = describe('suite', s => {
        s.describe('suite2', () => {
          s.test(() => {});
        });
      });

      await t.async.rejects(suite.compose(), 'locked');
    });
  });
});
