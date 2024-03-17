import { jutest } from "jutest";
import { SpecsContainer } from "core";
import { composeTestSuite } from "core/test-suite/compose-test-suite";

function composeSuite(name, body) {
  let specsContainer = new SpecsContainer();
  specsContainer.context.addName(name);
  return composeTestSuite(body, specsContainer);
}

jutest("composeTestSuite()", s => {
  s.test("composes empty array if no tests are registered", async t => {
    let { specs } = await composeSuite('test', () => {});
    t.same(specs, []);
  });

  s.test("adds tests from suite body", async t => {
    let { specs } = await composeSuite('test', s => {
      s.test('foo', () => {});
    });

    t.equal(specs.length, 1);
    t.equal(specs[0].name, 'test foo');
  });

  s.test("composes nested suites", async t => {
    let { specs } = await composeSuite('test', s => {
      s.describe('nested', s => {
        s.test('foo', () => {});
      });
    });

    t.equal(specs.length, 1);
    t.equal(specs[0].isComposed, true);
    t.equal(specs[0].name, 'test nested');
  });

  s.test("provides access to context API", async () => {
    await composeSuite('test', s => {
      s.setup(() => ({ a: 1 }));
    });
  });

  s.test("returns testsCount", async t => {
    let { testsCount } = await composeSuite('test', () => {});
    t.equal(testsCount, 0);
  });

  s.test("includes tests in testsCount", async t => {
    let { testsCount } = await composeSuite('test', s => {
      s.test('foo');
      s.test('bar');
    });

    t.equal(testsCount, 2);
  });

  s.test("includes nested suites' tests in testsCount", async t => {
    let { testsCount } = await composeSuite('test', s => {
      s.describe('suite2', s => {
        s.test('foo');
        s.test('bar');
      });
    });

    t.equal(testsCount, 2);
  });

  s.test("locks test context outside of the suite body", async t => {
    let compositionPromise = composeSuite('suite', s => {
      s.describe('suite2', () => {
        s.setup(() => {});
      });
    });

    await t.async.rejects(compositionPromise, 'locked');
  });

  s.test("locks specs container outside of the suite body", async t => {
    let compositionPromise = composeSuite('suite', s => {
      s.describe('suite2', () => {
        s.test(() => {});
      });
    });

    await t.async.rejects(compositionPromise, 'locked');
  });

  s.test("does nothing if suite body is not a function", async t => {
    let { specs } = await composeSuite('test');
    t.same(specs, []);
  });
});
