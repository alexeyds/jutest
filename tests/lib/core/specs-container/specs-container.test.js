import { jutest } from "jutest";
import { SpecsContainer, TestContext } from "core";

function createSetups(...args) {
  let context = new TestContext();
  let specsContainer = new SpecsContainer(...args);
  let builderAPI = specsContainer.toBuilderAPI({ context });

  return { 
    specsContainer,
    context,
    builderAPI,
  };
}

jutest("SpecsContainer", s => {
  s.setup(() => createSetups());

  s.describe("#constructor", s => {
    s.test("sets default attributes", (t, { specsContainer }) => {
      let specs = specsContainer.specs;
      t.same(specs, []);
    });
  });

  s.describe("toBuilderAPI", s => {
    s.test("provides #test method", (t, { specsContainer, builderAPI }) => {
      builderAPI.test('some test', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.name, 'some test');
    });

    s.test("provides #describe method", (t, { specsContainer, builderAPI }) => {
      builderAPI.describe('some suite', () => {});
      let [suite] = specsContainer.specs;

      t.equal(suite.name, 'some suite');
      t.equal(suite.isASuite, true);
    });

    s.test("provides #xtest method", (t, { specsContainer, builderAPI }) => {
      builderAPI.xtest('some test', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.name, 'some test');
      t.equal(test.skipped, true);
    });

    s.test("provides #xdescribe method", async (t, { specsContainer, builderAPI }) => {
      builderAPI.xdescribe('some suite', (t) => {
        t.test('test', () => {});
      });
      let [suite] = specsContainer.specs;
      let [test] = await suite.composeSpecs();

      t.equal(suite.name, 'some suite');
      t.equal(test.skipped, true);
    });
  });

  s.describe("#lock", s => {
    s.test("prevents adding more tests to the container", (t, { specsContainer, builderAPI }) => {
      specsContainer.lock('my error');

      t.throws(() => {
        builderAPI.test('some test', () => {});
      }, /my error/);
    });

    s.test("prevents adding more suites to the container", (t, { specsContainer, builderAPI }) => {
      specsContainer.lock('my error');

      t.throws(() => {
        builderAPI.describe('some suite', () => {});
      }, /my error/);
    });
  });

  s.describe("skip: true", s => {
    s.setup(() => createSetups({ skip: true }));

    s.test("marks all tests as skipped", (t, { specsContainer, builderAPI }) => {
      builderAPI.test('test', () => {});
      t.equal(specsContainer.specs[0].skipped, true);
    });

    s.test("works with suites", async (t, { specsContainer, builderAPI }) => {
      builderAPI.describe('suite', s => {
        s.test('test', () => {});
      });

      let [test] = await specsContainer.specs[0].composeSpecs();
      t.equal(test.skipped, true);
    });
  });

  s.describe("#setSourceFilePath", s => {
    s.test("passes file path to tests", (t, { specsContainer, builderAPI }) => {
      specsContainer.setSourceFilePath('specs-container.test.js');
      builderAPI.test('foobar', () => {});
      let [test] = specsContainer.specs;

      t.assert(test.sourceLocator.sourceFilePath);
    });

    s.test("passes file path to suites", async (t, { specsContainer, builderAPI }) => {
      specsContainer.setSourceFilePath('specs-container.test.js');
      builderAPI.describe('foobar', s => {
        s.test('baz', () => {});
      });
      let [suite] = specsContainer.specs;
      let [test] = await suite.composeSpecs();

      t.assert(suite.sourceLocator.sourceFilePath);
      t.assert(test.sourceLocator.sourceFilePath);
    });
  });

  s.describe("#withSourceFilePath", s => {
    s.test("passes file path to tests defined within the given function", async (t, { specsContainer, builderAPI }) => {
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {
        builderAPI.test('foobar', () => {});
      });
      let [test] = specsContainer.specs;

      t.assert(test.sourceLocator.sourceFilePath);
    });

    s.test("resets current path after", async (t, { specsContainer, builderAPI }) => {
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {});
      builderAPI.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.sourceLocator.sourceFilePath, undefined);
    });

    s.test("resets current path even if an error had occured", async (t, { specsContainer, builderAPI }) => {
      let promise = specsContainer.withSourceFilePath('specs-container.test.js', () => { throw '123'; });
      await t.async.rejects(promise, '123');

      builderAPI.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.sourceLocator.sourceFilePath, undefined);
    });

    s.test("resets source path to its original value", async (t, { specsContainer, builderAPI }) => {
      specsContainer.setSourceFilePath('foo.test.js');
      await specsContainer.withSourceFilePath('specs-container.test.js', () => {});
      builderAPI.test('foo', () => {});
      let [test] = specsContainer.specs;

      t.equal(test.sourceLocator.sourceFilePath, 'foo.test.js');
    });
  });
});
