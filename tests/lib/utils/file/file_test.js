import jutest from "jutest";
import nodePath from "path";
import { readLine } from "utils/file";

jutest("utils/file", s => {
  s.describe("readLine()", s => {
    let fixturePath = f => nodePath.join(process.cwd(), 'tests/lib/utils/file/fixtures', f);

    s.test("returns read line", async t => {
      let result = await readLine(fixturePath('five_lines_file.txt'), 3); 

      t.equal(result.success, true);
      t.equal(result.error, null);
      t.equal(result.line, 'line 3');
    });

    s.test("returns error if file not found", async t => {
      let result = await readLine(fixturePath('no_such_file.txt'), 3); 

      t.equal(result.success, false);
      t.match(result.error, /no_such_file/);
      t.equal(result.line, null);
    });

    s.test("returns error if line not found", async t => {
      let result = await readLine(fixturePath('five_lines_file.txt'), 10); 

      t.equal(result.success, false);
      t.match(result.error, /10/);
      t.equal(result.line, null);
    });

    s.test("returns success if line is empty string", async t => {
      let result = await readLine(fixturePath('five_lines_file.txt'), 6);

      t.equal(result.success, true);
      t.equal(result.error, null);
      t.equal(result.line, '');
    });
  });
});
