import { jutest } from "jutest";
import { parseSpecArgs } from "core/specs-container/parse-spec-args";

jutest("parseSpecArgs", s => {
  s.test("parses (name) args", t => {
    let { name, body, tags } = parseSpecArgs(['foo']);

    t.equal(name, 'foo');
    t.equal(body, undefined);
    t.equal(tags, undefined);
  });

  s.test("parses (name, body) args", t => {
    let func = () => {};
    let { name, body, tags } = parseSpecArgs(['foo', func]);

    t.equal(name, 'foo');
    t.equal(body, func);
    t.equal(tags, undefined);
  });

  s.test("parses (name, tags) args", t => {
    let { name, body, tags } = parseSpecArgs(['foo', { a: 1 }]);

    t.equal(name, 'foo');
    t.equal(body, undefined);
    t.same(tags, { a: 1 });
  });


  s.test("parses (name, tags, body) args", t => {
    let func = () => {};
    let { name, body, tags } = parseSpecArgs(['foo', { a: 1 }, func]);

    t.equal(name, 'foo');
    t.equal(body, func);
    t.same(tags, { a: 1 });
  });
});
