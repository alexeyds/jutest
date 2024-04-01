import { jutest } from "jutest";
import { parseStack } from "utils/error-formatter/parse-stack";

function parseStackArray(lines) {
  let stack = lines.join('\n');
  return parseStack(stack);
}

function parseStackFrame(line) {
  return parseStack(line)[0];
}

jutest("parseStack", s => {
  s.describe("stackFrame parser", s => {
    function rawFrames(parsedStack) {
      return parsedStack.map(s => s.stackFrame);
    }

    s.test("parses simple stacks", t => {
      let stackArray = ['at baz (filename.js:10:15)', 'at bar (filename.js:15:15)'];
      let parsedStack = parseStackArray(stackArray);

      t.same(rawFrames(parsedStack), ['at baz (filename.js:10:15)', 'at bar (filename.js:15:15)']);
    });

    s.test("trims stack lines", t => {
      let parsedStack = parseStackArray(['  at baz (filename.js:10:15)   ']);
      t.same(rawFrames(parsedStack), ['at baz (filename.js:10:15)']);
    });

    s.test("filters out empty lines", t => {
      let parsedStack = parseStackArray(['', ' ', 'at bar', 'at baz', '  ', '']);
      t.same(rawFrames(parsedStack), ['at bar', 'at baz']);
    });
  });

  s.describe("file location", s => {
    s.test("extracts file and line number from stack line", t => {
      let { file, lineNumber } = parseStackFrame('at baz (filename.js:10:15)');

      t.equal(file, 'filename.js');
      t.equal(lineNumber, 10);
    });

    s.test("works with anonymous eval stack frames", t => {
      let { file, lineNumber } = parseStackFrame('at eval (eval at <anonymous> (filename.js:1:13), <anonymous>:1:8)');

      t.equal(file, 'filename.js');
      t.equal(lineNumber, 1);
    });

    s.test("works with simple stack frames", t => {
      let { file, lineNumber } = parseStackFrame('at filename.js:10:15');

      t.equal(file, 'filename.js');
      t.equal(lineNumber, 10);
    });

    s.test("works with anonymous stack frames", t => {
      let { file, lineNumber } = parseStackFrame('at eval <anonymous>:1:8)');

      t.equal(file, undefined);
      t.equal(lineNumber, undefined);
    });
  });

  s.describe("internal frames detection", s => {
    s.test("returns false for normal frames", t => {
      let { isInternal } = parseStackFrame('at baz (filename.js:10:15)');
      t.equal(isInternal, false);
    });

    s.test("returns true for internal node frames", t => {
      let { isInternal } = parseStackFrame('at addChunk (node:internal/streams/readable:324:12)');
      t.equal(isInternal, true);
    });
  });
});
