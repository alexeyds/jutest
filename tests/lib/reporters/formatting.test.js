import { jutest } from "jutest";
import { addPadding, joinLines, presentStackTrace } from "reporters/formatting";

jutest("reporting/formatting", s => {
  s.describe("addPadding()", s => {
    s.test("prepends spaces to text", t => {
      let result = addPadding('testing', 2);
      t.equal(result, '  testing');
    });

    s.test("prepends spaces to each line", t => {
      let result = addPadding('testing\nfoo bar', 2);
      t.equal(result, '  testing\n  foo bar');
    });

    s.test("does not prepend spaces to empty lines", t => {
      let result = addPadding('testing\n\n  ', 2);
      t.equal(result, '  testing\n\n  ');
    });
  });

  s.describe("joinLines()", s => {
    s.test("joins lines", t => {
      let result = joinLines('testing', 'things', 'foobar');
      t.equal(result, 'testing\nthings\nfoobar');
    });
  });

  s.describe("presentStackTrace()", s => {
    let firstLine = t => t.split('\n')[0];
    let currentFileRegexp = /formatting.test/;

    s.test("presents stack trace", t => {
      let result = presentStackTrace(new Error('foobar'));
      t.match(firstLine(result), currentFileRegexp);
    });

    s.test("returns default message if target is not an Error", t => {
      let result = presentStackTrace('testing');
      t.equal(result, '(no stack trace)');
    });
  });
});
