import { jutest } from "jutest";
import { SectionBuilder } from "reporters/shared";

jutest("SectionBuilder", s => {
  s.describe("#toString", s => {
    s.test("returns empty string by default", t => {
      let builder = new SectionBuilder();
      t.equal(builder.toString(), '');
    });
  });

  s.describe("#addLine", s => {
    s.test("adds line to the result", t => {
      let builder = new SectionBuilder();
      builder.addLine('testing');

      t.equal(builder.toString(), 'testing\n');
    });

    s.test("allows adding multiple lines", t => {
      let builder = new SectionBuilder();
      builder.addLine('testing');
      builder.addLine('123');

      t.equal(builder.toString(), 'testing\n123\n');
    });

    s.test("adds empty line if no content is provided", t => {
      let builder = new SectionBuilder();
      builder.addLine();

      t.equal(builder.toString(), '\n');
    });

    s.test("adds padding to each line if it was set up", t => {
      let builder = new SectionBuilder({ padding: 2 });
      builder.addLine('foo');

      t.equal(builder.toString(), '  foo\n');
    });

    s.test("does not add padding to empty lines", t => {
      let builder = new SectionBuilder({ padding: 2 });
      builder.addLine('');

      t.equal(builder.toString(), '\n');
    });

    s.test("allows adding multi-line text", t => {
      let builder = new SectionBuilder({ padding: 2 });
      builder.addLine('test\ntest');

      t.equal(builder.toString(), '  test\n  test\n');
    });
  });

  s.describe("#addSection", s => {
    s.test("allows adding extra padded section", t => {
      let builder = new SectionBuilder();
      builder.addSection({ padding: 2 }, s => {
        s.addLine('test');
      });

      t.equal(builder.toString(), '  test\n');
    });

    s.test("combines paddings correctly", t => {
      let builder = new SectionBuilder({ padding: 2 });
      builder.addSection({ padding: 2 }, s => {
        s.addLine('test');
      });

      t.equal(builder.toString(), '    test\n');
    });

    s.test("preserves order between added sections and lines", t => {
      let builder = new SectionBuilder();
      builder.addLine('foobar');
      builder.addSection({ padding: 2 }, s => {
        s.addLine('test');
      });
      builder.addLine('baz');

      t.equal(builder.toString(), 'foobar\n  test\nbaz\n');
    });

    s.test("works with multi-line sections", t => {
      let builder = new SectionBuilder({ padding: 2 });
      builder.addSection({ padding: 2 }, s => {
        s.addLine('test\ntest');
      });

      t.equal(builder.toString(), '    test\n    test\n');
    });
  });
});
