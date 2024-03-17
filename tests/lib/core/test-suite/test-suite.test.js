import { jutest } from "jutest";
import { spy } from "sinon";
import { TestSuite, SpecsContainer } from "core";

jutest("TestSuite", s => {
  s.setup(() => {
    let specsContainer = new SpecsContainer();
    return { specsContainer };
  });

  s.describe("constructor", s => {
    s.test("sets initial attributes", (t, { specsContainer }) => {
      let suite = new TestSuite('suite', () => {}, { specsContainer });

      t.assert(suite.sourceLocator);
      t.equal(suite.isComposed, false);
      t.equal(suite.isASuite, true);
      t.equal(suite.ownName, 'suite');
      t.equal(suite.skipped, false);
      t.equal(suite.testsCount, 0);
      t.assert(suite.contextId);
      t.same(suite.parentContextIds, [specsContainer.context.id]);
    });

    s.test("accepts skip attribute", async (t, { specsContainer }) => {
      let suite = new TestSuite('foobar', (s) => {
        s.test('foo', () => {});
      }, { specsContainer, skip: true });

      t.equal(suite.skipped, true);
      let [test] = await suite.composeSpecs();
      t.equal(test.skipped, true);
    });
  });

  s.describe("#name", s => {
    s.test("returns suite name", (t, { specsContainer }) => {
      let suite = new TestSuite('suite', () => {}, { specsContainer });
      t.equal(suite.name, 'suite');
    });

    s.test("adds name on top of the previous context", (t, { specsContainer }) => {
      specsContainer.context.addName('foobar');
      let suite = new TestSuite('suite', () => {}, { specsContainer });

      t.equal(suite.name, 'foobar suite');
    });

    s.test("doesn't mutate previous context", (t, { specsContainer }) => {
      let { context } = specsContainer;
      context.addName('foobar');
      new TestSuite('suite', () => {}, { specsContainer });

      t.equal(context.name, 'foobar');
    });
  });

  s.describe("#sourceLocator", s => {
    s.test("includes file path from the specs container", t => {
      let specsContainer = new SpecsContainer({ sourceFilePath: 'foo.js' });
      let suite = new TestSuite('', () => {}, { specsContainer });

      t.equal(suite.sourceLocator.sourceFilePath, 'foo.js');
    });
  });

  s.describe("#composeSpecs", s => {
    s.test("composes specs defined in the suite's body", async (t, { specsContainer }) => {
      let suite = new TestSuite('test', s => {
        s.test('foo', () => {});
      }, { specsContainer });
      let specs = await suite.composeSpecs();

      t.equal(suite.isComposed, true);
      t.equal(specs.length, 1);
      t.equal(specs[0].name, 'test foo');
    });

    s.test("utilizes single-use job", async (t, { specsContainer }) => {
      let body = spy();
      let suite = new TestSuite('test', body, { specsContainer });
      await suite.composeSpecs();
      await suite.composeSpecs(); 

      t.equal(body.callCount, 1);
    });
  });

  s.describe("#testsCount", s => {
    s.test("returns loaded tests count", async (t, { specsContainer }) => {
      let suite = new TestSuite('test', s => {
        s.test('foo', () => {});
      }, { specsContainer });

      await suite.composeSpecs();

      t.equal(suite.testsCount, 1);
    });
  });
});
