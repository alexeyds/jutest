import { jutest } from "jutest";
import { buildTextSection } from "utils/text-section";

jutest("buildTextSection", s => {
  s.test("returns empty string if builder is empty", t => {
    let section = buildTextSection(() => {});
    t.equal(section, '');
  });

  s.describe("{ padding } option", s => {
    s.test("adds spaces to all added lines", t => {
      let string = buildTextSection(s => s.addLine('testing'), { padding: 2 });
      t.equal(string, '  testing\n');
    });

    s.test("does not add spaces to empty lines", t => {
      let string = buildTextSection(s => s.addLine(), { padding: 2 });
      t.equal(string, '\n');
    });
  });

  s.describe("builder#addLine", s => {
    s.test("adds line to the result", t => {
      let string = buildTextSection(s => s.addLine('testing'));
      t.equal(string, 'testing\n');
    });

    s.test("allows adding multiple lines", t => {
      let string = buildTextSection(s => {
        s.addLine('testing');
        s.addLine('123');
      });

      t.equal(string, 'testing\n123\n');
    });

    s.test("adds empty line if no content is provided", t => {
      let string = buildTextSection(s => s.addLine());
      t.equal(string, '\n');
    });

    s.test("allows adding multi-line text", t => {
      let string = buildTextSection(s => s.addLine('testing'));
      t.equal(string, 'testing\n');
    });
  });

  s.describe("builder#addSection", s => {
    s.test("creates nested section", t => {
      let string = buildTextSection(s => {
        s.addSection(s => {
          s.addLine('testing');
        });
      });

      t.equal(string, 'testing\n');
    });

    s.test("combines paddings correctly", t => {
      let string = buildTextSection(s => {
        s.addSection(s => {
          s.addLine('testing');
        }, { padding: 2 });
      }, { padding: 2 });

      t.equal(string, '    testing\n');
    });
  });
});
