import { jutest } from "jutest";
import { TestContext, SpecsContainer } from "core";

function createNamedContext(name) {
  let context = new TestContext();
  context.addName(name);
  return context;
}

jutest("SpecsContainer", s => {
  s.setup(() => {
    let specsContainer = new SpecsContainer();
    return { specsContainer };
  });

  s.describe("constructor", s => {
    s.test("sets default attributes", (t, { specsContainer }) => {
      t.same(specsContainer.specs, []);
      t.assert(specsContainer.context);
      t.equal(specsContainer.skip, false);
      t.equal(specsContainer.sourceFilePath, undefined);
    });

    s.test("allows setting attributes", t => {
      let context = new TestContext();
      let specsContainer = new SpecsContainer({
        context,
        skip: true,
        sourceFilePath: 'foo.test'
      });

      t.equal(specsContainer.context, context);
      t.equal(specsContainer.skip, true);
      t.equal(specsContainer.sourceFilePath, 'foo.test');
    });
  });

  s.describe("#copy", s => {
    s.test("copies attributes from original context", t => {
      let original = new SpecsContainer({
        context: createNamedContext('test'),
        skip: true,
        sourceFilePath: 'foo.test'
      });
      let copy = original.copy();

      t.notEqual(copy, original);
      t.equal(copy.context.name, 'test');
      t.equal(copy.skip, original.skip);
      t.equal(copy.sourceFilePath, original.sourceFilePath);
    });

    s.test("copies the context", (t, { specsContainer }) => {
      let copy = specsContainer.copy();
      t.notEqual(copy.context, specsContainer.context);
    });

    s.test("allows overwriting 'skip' attribute", t => {
      let specsContainer = new SpecsContainer({ skip: true });
      let copy = specsContainer.copy({ skip: false });

      t.equal(copy.skip, false);
    });
  });

  s.describe("#extend", s => {
    s.test("copies original context", (t, { specsContainer }) => {
      let copy = specsContainer.extend();

      t.notEqual(copy, specsContainer);
      t.assert(copy.context);
    });

    s.test("shares specs between two versions", (t, { specsContainer }) => {
      let copy = specsContainer.extend();
      copy.test('foo');

      t.equal(specsContainer.specs.length, 1);
      t.equal(copy.specs, specsContainer.specs);
    });
  });

  s.describe("#test", s => {
    s.test("adds test to the container", (t, { specsContainer }) => {
      specsContainer.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.name, 'foo');
      t.equal(test.skipped, false);
    });

    s.test("passes all necessary info to the test", t => {
      let specsContainer = new SpecsContainer({
        context: createNamedContext('foo'),
        skip: true,
        sourceFilePath: 'foo.test',
      });

      specsContainer.test('bar', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.name, 'foo bar');
      t.equal(test.skipped, true);
      t.equal(test.sourceLocator.sourceFilePath, 'foo.test');
    });
  });

  s.describe("#xtest", s => {
    s.test("adds skipped test to the container", (t, { specsContainer }) => {
      specsContainer.xtest('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.name, 'foo');
      t.equal(test.skipped, true);
    });

    s.test("prevents overwriting of meta attributes", (t, { specsContainer }) => {
      specsContainer.xtest('foo', () => {}, { skip: false });
      let [test] = specsContainer.specs;

      t.equal(test.skipped, true);
    });
  });

  s.describe("#describe", s => {
    s.test("adds suite to the container", (t, { specsContainer }) => {
      specsContainer.describe('foo', () => {});
      let [suite] = specsContainer.specs;

      t.equal(suite.name, 'foo');
      t.equal(suite.skipped, false);
      t.equal(suite.isASuite, true);
    });

    s.test("passes all necessary info to the suite", t => {
      let specsContainer = new SpecsContainer({
        context: createNamedContext('foo'),
        skip: true,
        sourceFilePath: 'foo.test',
      });

      specsContainer.describe('bar', () => {});
      let [spec] = specsContainer.specs;

      t.equal(spec.name, 'foo bar');
      t.equal(spec.skipped, true);
      t.equal(spec.sourceLocator.sourceFilePath, 'foo.test');
    });
  });

  s.describe("#xdescribe", s => {
    s.test("adds skipped suite to the container", (t, { specsContainer }) => {
      specsContainer.xdescribe('foo', () => {});
      let [suite] = specsContainer.specs;

      t.equal(suite.name, 'foo');
      t.equal(suite.skipped, true);
    });

    s.test("prevents overwriting skip attribute", (t, { specsContainer }) => {
      specsContainer.xdescribe('foo', () => {}, { skip: false });
      let [suite] = specsContainer.specs;

      t.equal(suite.skipped, true);
    });
  });

  s.describe("#toBuilderAPI", s => {
    s.test("returns builder functions", (t, { specsContainer }) => {
      let api = specsContainer.toBuilderAPI();
      api.test('foo');

      t.equal(specsContainer.specs.length, 1);
      t.assert(api.test);
      t.assert(api.xtest);
      t.assert(api.describe);
      t.assert(api.xdescribe);
    });
  });

  s.describe("#toContextAPI", s => {
    s.test("returns context configuration functions", (t, { specsContainer }) => {
      let api = specsContainer.toContextAPI();
      api.addName('foo');

      t.equal(specsContainer.context.name, 'foo');
    });
  });

  s.describe("#toSuiteAPI", s => {
    s.test("combines builder and configuration APIs", (t, { specsContainer }) => {
      let api = specsContainer.toSuiteAPI();

      t.assert(api.test);
      t.assert(api.addName);
    });
  });

  s.describe("#lockContainer", s => {
    s.test("prevents adding more specs to the container", (t, { specsContainer }) => {
      specsContainer.lockContainer('foobar');
      t.throws(() => specsContainer.test('test'), /foobar/);
    });
  });


  s.describe("#lockContext", s => {
    s.test("locks context", (t, { specsContainer }) => {
      specsContainer.lockContext('foobar');
      t.throws(() => specsContainer.context.addName('foobar'), /foobar/);
    });
  });

  s.describe("#withSourceFilePath", s => {
    s.test("passes file path to tests defined within the given function", async (t, { specsContainer }) => {
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {
        specsContainer.test('foobar', () => {});
      });
      let [test] = specsContainer.specs;

      t.assert(test.sourceLocator.sourceFilePath);
    });

    s.test("resets current path after", async (t, { specsContainer }) => {
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {});
      specsContainer.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.sourceLocator.sourceFilePath, undefined);
    });

    s.test("resets current path even if an error had occured", async (t, { specsContainer }) => {
      let promise = specsContainer.withSourceFilePath('specs-container.test.js', () => { throw '123'; });
      await t.async.rejects(promise, '123');

      specsContainer.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.sourceLocator.sourceFilePath, undefined);
    });

    s.test("resets source path to its original value", async t => {
      let specsContainer = new SpecsContainer({ sourceFilePath: 'foo.test.js' });
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {});
      specsContainer.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.sourceLocator.sourceFilePath, 'foo.test.js');
    });
  });
});
