import jutest from "jutest";
import { TestContext } from "core/test-context";
import { TestSuite } from "core/test-suite";

function describe(name, block) {
  let context = new TestContext();
  return new TestSuite(name, block, { context });
}

jutest("TestSuite", s => {
  s.describe("name", s => {
    s.test("returns suite name", t => {
      let suite = describe('suite', () => {});
      t.equal(suite.name, 'suite');
    });
  });

  s.describe("#tests", s => {
    s.test("returns defined tests", async t => {
      let suite = describe('suite', s => {
        s.test('test', () => {});
      });

      let tests = await suite.tests;

      t.equal(tests.length, 1);
      t.equal(tests[0].name, 'suite test');
    });

    s.test("returns tests from nested suites", async t => {
      let suite = describe('suite1', s => {
        s.describe('suite2', s => {
          s.test('test', () => {});
        });
      });

      let tests = await suite.tests;

      t.equal(tests.length, 1);
      t.equal(tests[0].name, 'suite1 suite2 test');
    });

    s.test("support async suite body", async t => {
      let suite = describe('suite', async s => {
        await Promise.resolve();
        s.test('test', () => {});
      });

      let tests = await suite.tests;

      t.equal(tests.length, 1);
      t.equal(tests[0].name, 'suite test');
    });
  });

  s.describe("composing tests", s => {
    s.test("creates separate context for different suites", async t => {
      let suite = describe('suite1', s => {
        s.describe('suite2', () => {});
        s.test('test', () => {});
      });

      let tests = await suite.tests;

      t.equal(tests[0].name, 'suite1 test');
    });

    s.test("includes context helpers", async t => {
      let assigns;

      let suite = describe('suite', s => {
        s.assertBeforeTest(() => {});
        s.assertAfterTest(() => {});
        s.setup(() => ({ a: 1}));
        s.teardown(() => {});

        s.test('test', (t, a) => assigns = a);
      });

      let tests = await suite.tests;
      await tests[0].run();

      t.same(assigns, { a: 1 });
    });
  });
});
