import { jutest } from "jutest";
import { RuntimeConfig } from "runtime/config";
import { discoverTestLocations } from "runtime/init-runtime/discover-test-locations";

let fixturesPath = 'tests/lib/runtime/fixtures';

function fixtureLocation(filePath) {
  return `${fixturesPath}/${filePath}`;
}

function discoverLocations(params) {
  let config = new RuntimeConfig(params);
  return discoverTestLocations(config);
}

jutest("discoverTestLocations", s => {
  s.test("returns empty array if no locations are provided", t => {
    let locations = discoverLocations({ locationsToRun: [] });
    t.same(locations, []);
  });

  s.test("supports file locations", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixtureLocation('test-file.test.js') ]
    });
    let [location] = locations;

    t.equal(locations.length, 1);
    t.match(location.file, '/jutest/');
    t.match(location.file, 'test-file.test.js');
    t.same(location.lineNumbers, []);
  });

  s.test("recursively discovers test files within provided directories", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixturesPath ]
    });

    t.equal(locations.length, 2);
    t.match(locations[0].file, 'test-file-2.test.js');
    t.match(locations[1].file, 'test-file.test.js');
  });

  s.test("only includes files that match inclusion pattern", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixturesPath ],
      includeTestFilePatterns: [ 'test-file.test.*' ],
    });

    t.equal(locations.length, 1);
    t.match(locations[0].file, 'test-file.test.js');
  });

  s.test("excludes files that match exlusion pattern", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixturesPath ],
      excludeTestFilePatterns: [ 'test-file.test.*' ],
    });

    t.equal(locations.length, 1);
    t.match(locations[0].file, 'test-file-2.test.js');
  });

  s.test("excludes directories that match exclusion pattern", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixturesPath ],
      excludeTestDirectoryPatterns: [ '/test-dir' ],
    });

    t.equal(locations.length, 1);
    t.match(locations[0].file, 'test-file.test.js');
  });

  s.test("does not subject directly specified file location to file exclusion/inclusion rules", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixtureLocation('test-file.test.js') ],
      excludeTestFilePatterns: [ 'test-file.test.*' ],
    });

    t.equal(locations.length, 1);
    t.match(locations[0].file, 'test-file.test.js');
  });

  s.test("does not subject directly specified directory locations to dir exlusion rule", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixtureLocation('test-dir') ],
      excludeTestDirectoryPatterns: [ 'test-dir' ],
    });

    t.equal(locations.length, 1);
    t.match(locations[0].file, 'test-file-2.test.js');
  });

  s.test("applies dir exclusion rule within provided locations and not globally", t => {
    let locations = discoverLocations({
      locationsToRun: [ fixturesPath ],
      excludeTestDirectoryPatterns: [ '/fixtures' ],
    });

    t.equal(locations.length, 2);
    t.match(locations[0].file, 'test-file-2.test.js');
    t.match(locations[1].file, 'test-file.test.js');
  });
});
