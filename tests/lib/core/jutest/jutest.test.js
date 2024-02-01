import { jutest } from "jutest";
import { TestsContainer } from "core/tests-container";
import { Jutest } from "core/jutest";

jutest("Jutest", s => {
  s.setup(() => {
    let testsContainer = new TestsContainer();
    let jutest = new Jutest({ testsContainer }).toPublicAPI();

    return { testsContainer, jutest };
  })

  s.describe("#test", s => {
    s.test("adds test to the container", (t, { testsContainer, jutest }) => {
      jutest.test('foobar', () => {});
      let test = testsContainer.testsAndSuites[0];

      t.equal(test.name, 'foobar');
    });
  });

  s.describe("#describe", s => {
    s.test("adds test to the container", (t, { testsContainer, jutest }) => {
      jutest.describe('foobar', () => {});
      let suite = testsContainer.testsAndSuites[0];

      t.equal(suite.name, 'foobar');
      t.equal(suite.isASuite, true);
    });

    s.test("has a shorthand definition", (t, { testsContainer, jutest }) => {
      jutest('foobar', () => {});
      let suite = testsContainer.testsAndSuites[0];

      t.equal(suite.name, 'foobar');
      t.equal(suite.isASuite, true);
    });
  });

  s.describe("#configureNewInstance", s => {
    s.test("returns the public API of the new instance", (t, { testsContainer, jutest }) => {
      let jutest2 = jutest.configureNewInstance();
      jutest2('foobar', () => {})
      let suite = testsContainer.testsAndSuites[0];

      t.notEqual(jutest, jutest2);
      t.equal(suite.name, 'foobar');
    });

    s.test("exposes context's configuration API", (t, { testsContainer, jutest }) => {
      let jutest2 = jutest.configureNewInstance(c => c.name('jutest2'));
      jutest2.test('test', () => {})

      let test = testsContainer.testsAndSuites[0];

      t.equal(test.name, 'jutest2 test');
    });

    s.test("creates separate context", (t, { testsContainer, jutest }) => {
      let jutest2 = jutest.configureNewInstance(c => c.name('jutest2'));

      jutest.test('test', () => {});
      jutest2.test('test', () => {});

      let [test1, test2] = testsContainer.testsAndSuites;

      t.equal(test1.name, 'test');
      t.equal(test2.name, 'jutest2 test');
    });

    s.test("extends existing context", (t, { testsContainer, jutest }) => {
      let setupsRan = 0;
      let jutest3 = jutest
        .configureNewInstance(c => c.name('jutest2'))
        .configureNewInstance(c => c.name('jutest3'));

      jutest3.test('test', () => {});

      let test = testsContainer.testsAndSuites[0];

      t.equal(test.name, 'jutest2 jutest3 test');
    });

    s.test("locks context after first configuration", (t, { testsContainer, jutest }) => {
      let config;
      let jutest3 = jutest.configureNewInstance(c => config = c);

      t.throws(() => config.name('test'), /locked/)
    });
  });
});
