import jutest from "jutest";
import { createDelegator, createDelegatorFunction } from "utils/delegator";
import { spy } from "sinon";

jutest("utils/delegator", s => {
  s.describe("createDelegator()", s => {
    s.setup(() => {
      let source = { foo: spy() };
      return { source };
    });

    s.test("creates an empty wrapper", (t, { source }) => {
      let delegator = createDelegator(source, {});
      t.same(delegator, {});
    });

    s.test("delegates specified methods", (t, { source }) => {
      let delegator = createDelegator(source, { foo: true });
      delegator.foo();

      t.equal(source.foo.called, true);
    });

    s.test("creates a wrapper for each method", (t, { source }) => {
      let delegator = createDelegator(source, { foo: true });
      t.notEqual(source.foo, delegator.foo);
    });

    s.test("delegates all arguments", (t, { source }) => {
      let delegator = createDelegator(source, { foo: true });
      delegator.foo(1, 2);
      let call = source.foo.firstCall;

      t.same(call.args, [1, 2]);
    });

    s.test("allows changing function name", (t, { source }) => {
      let delegator = createDelegator(source, { foo: 'bar' });
      delegator.bar();

      t.equal(source.foo.called, true);
    });

    s.test("ignores methods marked with falsy values", (t, { source }) => {
      let delegator = createDelegator(source, { foo: '' });
      t.same(delegator, {});
    });

    s.test("works with multiple values", (t, { source }) => {
      source.bar = () => {};
      let delegator = createDelegator(source, { foo: '', bar: true });

      t.refute(delegator.foo);
      t.assert(delegator.bar);
    });

    s.test("binds delegated functions to the sources", t => {
      let source = {
        foo: function() { this.bar = 1; }

      };
      let delegator = createDelegator(source, { foo: true });
      delegator.foo();

      t.equal(source.bar, 1);
    });

    s.test("warns about missing functions", (t, { source }) => {
      t.throws(() => createDelegator(source, { bar: true }), /missing/);
    });
  });

  s.describe("createDelegatorFunction", s => {
    s.setup(() => {
      return { soruceFunction: spy() };
    });

    s.test("returns wrapper function", (t, { soruceFunction }) => {
      let delegator = createDelegatorFunction(soruceFunction);
      delegator();

      t.notEqual(delegator, soruceFunction);
      t.equal(soruceFunction.called, true);
    });

    s.test("delegates all arguments", (t, { soruceFunction }) => {
      let delegator = createDelegatorFunction(soruceFunction);
      delegator(1, 2);

      t.same(soruceFunction.firstCall.args, [1, 2]);
    });
  });
});
