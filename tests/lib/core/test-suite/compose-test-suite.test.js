import { jutest } from "jutest";
import { TestContext } from "core";
import { composeTestSuite } from "core/test-suite/compose-test-suite";

function composeSuite(name, body) {
  let context = new TestContext();
  context.addName(name);
  return composeTestSuite(body, { context });
}

jutest("composeTestSuite()", s => {
  s.test("composes empty array if no tests are registered", async t => {
    let specs = await composeSuite('test', () => {});
    t.same(specs, []);
  });

  s.test("adds tests from suite body", async t => {
    let specs = await composeSuite('test', s => {
      s.test('foo', () => {});
    });

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test foo');
  });

  s.test("composes nested suites", async t => {
    let specs = await composeSuite('test', s => {
      s.describe('nested', s => {
        s.test('foo', () => {});
      });
    });

    t.equal(specs.length, 1);

    let nestedSuite = specs[0];
    t.equal(nestedSuite.isComposed, true);

    let nestedSuiteSpecs = await nestedSuite.composeSpecs();
    t.equal(nestedSuite.name, 'test nested');
    t.equal(nestedSuiteSpecs[0].name, 'test nested foo');
  });

  s.test("allows modifying context setups", async t => {
    let assigns;

    let [test] = await composeSuite('test', s => {
      s.setup(() => ({ a: 1 }));
      s.test('foo', (t, a) => assigns = a);
    });

    await test.run();

    t.same(assigns, { a: 1 });
  });

  s.test("returns tests and suites in order they were defined", async t => {
    let specs = await composeSuite('suite', s => {
      s.test('test1', () => {});
      s.describe('nested', s => {
        s.test('test', () => {});
      });
      s.test('test2', () => {});
    });

    t.match(specs[0].name, 'suite test1');
    t.match(specs[1].name, 'suite nested');
    t.match(specs[2].name, 'suite test2');
  });

  s.test("locks test context outside suite body", async t => {
    let compositionPromise = composeSuite('suite', s => {
      s.describe('suite2', () => {
        s.setup(() => {});
      });
    });

    await t.async.rejects(compositionPromise, 'locked');
  });

  s.test("locks test/suites addition outside of suite body", async t => {
    let compositionPromise = composeSuite('suite', s => {
      s.describe('suite2', () => {
        s.test(() => {});
      });
    });

    await t.async.rejects(compositionPromise, 'locked');
  });
});
