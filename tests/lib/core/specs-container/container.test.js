import { jutest } from "jutest";
import { Container } from "core/specs-container/container";

jutest("Container", s => {
  s.setup(() => {
    let container = new Container();
    return { container };
  });

  s.describe("constructor", s => {
    s.test("sets default attributes", (t, { container }) => {
      t.same(container.items, []);
    });
  });

  s.describe("#push", s => {
    s.test("adds item to the list", (t, { container }) => {
      container.push('test');
      t.same(container.items, ['test']);
    });

    s.test("behaves like Array#push", (t, { container }) => {
      let result = container.push(1, 2);

      t.equal(result, 2);
      t.same(container.items, [1, 2]);
    });
  });

  s.describe("#lock", s => {
    s.test("locks container", (t, { container }) => {
      container.lock('foobar test');
      t.throws(() => container.push(1), /foobar test/);
    });
  });
});
