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
      t.same(specsContainer.specsByFile, {});
      t.assert(specsContainer.context);
      t.equal(specsContainer.skip, false);
      t.equal(specsContainer.sourceFilePath, null);
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

  s.describe("#copyWithSharedSpecs", s => {
    s.test("copies original context", (t, { specsContainer }) => {
      let copy = specsContainer.copyWithSharedSpecs();

      t.notEqual(copy, specsContainer);
      t.assert(copy.context);
    });

    s.test("shares specs between two versions", (t, { specsContainer }) => {
      let copy = specsContainer.copyWithSharedSpecs();
      copy.test('foo');

      t.equal(specsContainer.specs.length, 1);
      t.equal(copy.specs, specsContainer.specs);
    });

    s.test("delegates attrs to copy method", (t, { specsContainer }) => {
      let copy = specsContainer.copyWithSharedSpecs({ skip: true });
      t.equal(copy.skip, true);
    });

    s.test("copies sourceFilePath by reference", t => {
      let specsContainer = new SpecsContainer({ sourceFilePath: 'foo.test.js' });
      let copy = specsContainer.copyWithSharedSpecs();
      specsContainer.sourceFilePath = 'bar.test.js';

      t.equal(copy.sourceFilePath, 'bar.test.js');
    });
  });

  s.describe("#test", s => {
    s.test("adds test to the container", (t, { specsContainer }) => {
      let test = specsContainer.test('foo', () => {});

      t.equal(test.name, 'foo');
      t.equal(test.skipped, false);
    });

    s.test("passes all necessary info to the test", t => {
      let specsContainer = new SpecsContainer({
        context: createNamedContext('foo'),
        skip: true,
        sourceFilePath: 'foo.test',
      });
      let test = specsContainer.test('bar', () => {});

      t.equal(test.name, 'foo bar');
      t.equal(test.skipped, true);
      t.equal(test.sourceLocator.sourceFilePath, 'foo.test');
    });

    s.test("saves test within the current file", t => {
      let specsContainer = new SpecsContainer({ sourceFilePath: 'foo.test' });
      let test = specsContainer.test('bar', () => {});

      t.same(specsContainer.specsByFile['foo.test'], [test]);
    });

    s.test("supports tags", (t, { specsContainer }) => {
      let test = specsContainer.test('foo', { a: 1 }, () => {});

      t.equal(test.name, 'foo');
      t.equal(test.tags.a, 1);
      t.equal(test.skipped, false);
    });
  });

  s.describe("#xtest", s => {
    s.test("adds skipped test to the container", (t, { specsContainer }) => {
      let test = specsContainer.xtest('foo', () => {});

      t.equal(test.name, 'foo');
      t.equal(test.skipped, true);
    });
  });

  s.describe("#describe", s => {
    s.test("adds suite to the container", (t, { specsContainer }) => {
      let suite = specsContainer.describe('foo', () => {});

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

      let suite = specsContainer.describe('bar', () => {});

      t.equal(suite.name, 'foo bar');
      t.equal(suite.skipped, true);
      t.equal(suite.sourceLocator.sourceFilePath, 'foo.test');
    });

    s.test("saves spec within the current file", t => {
      let specsContainer = new SpecsContainer({ sourceFilePath: 'foo.test' });
      let suite = specsContainer.describe('bar', () => {});

      t.same(specsContainer.specsByFile['foo.test'], [suite]);
    });

    s.test("supports tags", (t, { specsContainer }) => {
      let suite = specsContainer.describe('foo', { a: 1 }, () => {});

      t.equal(suite.name, 'foo');
      t.equal(suite.tags.a, 1);
      t.equal(suite.skipped, false);
    });
  });

  s.describe("#xdescribe", s => {
    s.test("adds skipped suite to the container", (t, { specsContainer }) => {
      let suite = specsContainer.xdescribe('foo', () => {});

      t.equal(suite.name, 'foo');
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

    s.test("makes sure wrapped functions dont expose specs", (t, { specsContainer }) => {
      let api = specsContainer.toBuilderAPI();
      let test = api.test('foo');

      t.equal(test, undefined);
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
      t.same(specsContainer.specsByFile['specs-container.test.js'], [test]);
    });

    s.test("resets current path after", async (t, { specsContainer }) => {
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {});
      specsContainer.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.refute(test.sourceLocator.sourceFilePath);
    });

    s.test("resets current path even if an error had occured", async (t, { specsContainer }) => {
      let promise = specsContainer.withSourceFilePath('specs-container.test.js', () => { throw '123'; });
      await t.async.rejects(promise, '123');

      specsContainer.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.refute(test.sourceLocator.sourceFilePath);
    });

    s.test("resets source path to its original value", async t => {
      let specsContainer = new SpecsContainer({ sourceFilePath: 'foo.test.js' });
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {});
      specsContainer.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.sourceLocator.sourceFilePath, 'foo.test.js');
    });

    s.test("restores sourceFilePath in containers copied inside the function", async t => {
      let specsContainer1 = new SpecsContainer({ sourceFilePath: 'foo.test.js' });
      let specsContainer2;
      let specsContainer3;

      await specsContainer1.withSourceFilePath('specs-container.test.js', () => {
        specsContainer2 = specsContainer1.copyWithSharedSpecs();
        specsContainer3 = specsContainer2.copyWithSharedSpecs();
      });

      t.equal(specsContainer2.sourceFilePath, 'foo.test.js');
      t.equal(specsContainer3.sourceFilePath, 'foo.test.js');
    });
  });
});
