import { jutest } from "jutest";
import { Container } from "core/specs-container/container";

jutest("Container", s => {
  s.setup(() => {
    let container = new Container();
    return { container };
  });

  s.describe("constructor", s => {
    s.test("sets default attributes", (t, { container }) => {
      t.same(container.itemsByKey, {});
      t.same(container.items, []);
    });
  });

  s.describe("#addItem", s => {
    s.test("adds item to the list", (t, { container }) => {
      container.addItem('foo', 'bar');

      t.same(container.itemsByKey, { foo: ['bar'] });
      t.same(container.items, ['bar']);
    });

    s.test("works with multiple items", (t, { container }) => {
      container.addItem('foo', 'bar');
      container.addItem('foo', 'baz');

      t.same(container.itemsByKey, { foo: ['bar', 'baz'] });
      t.same(container.items, ['bar', 'baz']);
    });

    s.test("supports multiple keys", (t, { container }) => {
      container.addItem('foo', 'bar');
      container.addItem('bar', 'baz');

      t.same(container.itemsByKey, { foo: ['bar'], bar: ['baz'] });
      t.same(container.items, ['bar', 'baz']);
    });

    s.test("returns added item", (t, { container }) => {
      let item = container.addItem('foo', 'bar');
      t.equal(item, 'bar');
    });
  });

  s.describe("#lock", s => {
    s.test("locks container", (t, { container }) => {
      container.lock('foobar test');
      t.throws(() => container.addItem('foo', 'bar'), /foobar test/);
    });
  });
});
