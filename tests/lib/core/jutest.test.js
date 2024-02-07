import { jutest } from "jutest";
import { SpecsContainer, Jutest } from "core";

jutest("Jutest", s => {
  s.setup(() => {
    let container = new SpecsContainer();
    let jutest = new Jutest({ specsContainer: container }).toPublicAPI();

    return { container, jutest };
  });

  s.describe("#test", s => {
    s.test("adds test to the container", (t, { container, jutest }) => {
      jutest.test('foobar', () => {});
      let test = container.testsAndSuites[0];

      t.equal(test.name, 'foobar');
    });
  });

  s.describe("#describe", s => {
    s.test("adds test to the container", (t, { container, jutest }) => {
      jutest.describe('foobar', () => {});
      let suite = container.testsAndSuites[0];

      t.equal(suite.name, 'foobar');
      t.equal(suite.isASuite, true);
    });

    s.test("has a shorthand definition", (t, { container, jutest }) => {
      jutest('foobar', () => {});
      let suite = container.testsAndSuites[0];

      t.equal(suite.name, 'foobar');
      t.equal(suite.isASuite, true);
    });
  });

  s.describe("#configureNewInstance", s => {
    s.test("returns the public API of the new instance", (t, { container, jutest }) => {
      let jutest2 = jutest.configureNewInstance();
      jutest2('foobar', () => {});
      let suite = container.testsAndSuites[0];

      t.notEqual(jutest, jutest2);
      t.equal(suite.name, 'foobar');
    });

    s.test("exposes context's configuration API", (t, { container, jutest }) => {
      let jutest2 = jutest.configureNewInstance(c => c.name('jutest2'));
      jutest2.test('test', () => {});

      let test = container.testsAndSuites[0];

      t.equal(test.name, 'jutest2 test');
    });

    s.test("creates separate context", (t, { container, jutest }) => {
      let jutest2 = jutest.configureNewInstance(c => c.name('jutest2'));

      jutest.test('test', () => {});
      jutest2.test('test', () => {});

      let [test1, test2] = container.testsAndSuites;

      t.equal(test1.name, 'test');
      t.equal(test2.name, 'jutest2 test');
    });

    s.test("extends existing context", (t, { container, jutest }) => {
      let jutest3 = jutest
        .configureNewInstance(c => c.name('jutest2'))
        .configureNewInstance(c => c.name('jutest3'));

      jutest3.test('test', () => {});

      let test = container.testsAndSuites[0];

      t.equal(test.name, 'jutest2 jutest3 test');
    });

    s.test("locks context after first configuration", (t, { jutest }) => {
      let config;
      jutest.configureNewInstance(c => config = c);

      t.throws(() => config.name('test'), /locked/);
    });
  });
});
