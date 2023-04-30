import jutest from "jutest";
import { TestContext } from "core/test-context";
import { SuiteBuilder } from "core/test-suite/suite-builder";
import { TestSuite } from "core/test-suite";

jutest("SuiteBuilder", s => {
  s.setup(() => {
    let context = new TestContext();
    let suite = new TestSuite('test', () => {}, { context });
    let builder = new SuiteBuilder(suite);

    return { builder };
  });

  s.describe("#composeTests", s => {
    s.test("returns empty array by default", async (t, { builder }) => {
      let tests = await builder.composeTests();
      t.same(tests, []);
    });

    s.test("returns tests in order they were defined", async (t, { builder }) => {
      builder.addTest('regular test1', () => {});
      builder.addSuite('suite', (s) => {
        s.test('test', () => {});
      });
      builder.addTest('regular test2', () => {});

      let tests = await builder.composeTests();

      t.match(tests[0].name, 'regular test1');
      t.match(tests[1].name, 'suite test');
      t.match(tests[2].name, 'regular test2');
    });
  });

  s.describe("#addTest", s => {
    s.test("adds test to resulting array", async (t, { builder }) => {
      builder.addTest('foobar', () => {});
      let tests = await builder.composeTests();

      t.equal(tests.length, 1);
      t.match(tests[0].name, 'foobar');
    });
  });

  s.describe("#addSuite", s => {
    s.test("adds nested suite tests to resulting array", async (t, { builder }) => {
      builder.addSuite('foo', s => {
        s.test('bar', () => {});
      });
      let tests = await builder.composeTests();

      t.equal(tests.length, 1);
      t.match(tests[0].name, 'foo bar');
    });
  });

  s.describe("#toPublicAPI", s => {
    s.test("defines delegators for adding tests and suites", (t, { builder }) => {
      let api = builder.toPublicAPI();
      api.test('foo', () => {});
      api.describe('suite', () => {});
    });

    s.test("defines delegators for suite's context", (t, { builder }) => {
      let api = builder.toPublicAPI();
      api.setup(() => {});
      api.assertBeforeTest(() => {});
      api.assertAfterTest(() => {});
      api.teardown(() => {});
    });
  });
});
