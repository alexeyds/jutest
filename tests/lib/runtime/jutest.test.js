import { jutest } from "jutest";
import { Runtime } from "runtime";

jutest("Jutest", s => {
  s.setup(() => {
    let { specsContainer, jutest } = new Runtime();

    return { specsContainer, jutest };
  });

  s.describe("#test", s => {
    s.test("adds test to the container", (t, { specsContainer, jutest }) => {
      jutest.test('foobar', () => {});
      let test = specsContainer.specs[0];

      t.equal(test.name, 'foobar');
    });
  });

  s.describe("#describe", s => {
    s.test("adds test to the specsContainer", (t, { specsContainer, jutest }) => {
      jutest.describe('foobar', () => {});
      let suite = specsContainer.specs[0];

      t.equal(suite.name, 'foobar');
      t.equal(suite.isASuite, true);
    });

    s.test("has a shorthand definition", (t, { specsContainer, jutest }) => {
      jutest('foobar', () => {});
      let suite = specsContainer.specs[0];

      t.equal(suite.name, 'foobar');
      t.equal(suite.isASuite, true);
    });
  });

  s.describe("#configureNewInstance", s => {
    s.test("returns the public API of the new instance", (t, { specsContainer, jutest }) => {
      let jutest2 = jutest.configureNewInstance();
      jutest2('foobar', () => {});
      let suite = specsContainer.specs[0];

      t.notEqual(jutest, jutest2);
      t.equal(suite.name, 'foobar');
    });

    s.test("exposes context's configuration API", (t, { specsContainer, jutest }) => {
      let jutest2 = jutest.configureNewInstance(c => c.addName('jutest2'));
      jutest2.test('test', () => {});

      let test = specsContainer.specs[0];

      t.equal(test.name, 'jutest2 test');
    });

    s.test("creates separate context", (t, { specsContainer, jutest }) => {
      let jutest2 = jutest.configureNewInstance(c => c.addName('jutest2'));

      jutest.test('test', () => {});
      jutest2.test('test', () => {});

      let [test1, test2] = specsContainer.specs;

      t.equal(test1.name, 'test');
      t.equal(test2.name, 'jutest2 test');
    });

    s.test("extends existing context", (t, { specsContainer, jutest }) => {
      let jutest3 = jutest
        .configureNewInstance(c => c.addName('jutest2'))
        .configureNewInstance(c => c.addName('jutest3'));

      jutest3.test('test', () => {});

      let test = specsContainer.specs[0];

      t.equal(test.name, 'jutest2 jutest3 test');
    });

    s.test("locks context after first configuration", (t, { jutest }) => {
      let config;
      jutest.configureNewInstance(c => config = c);

      t.throws(() => config.addName('test'), /configure/);
    });
  });
});
