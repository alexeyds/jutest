import { TestRunnerEventEmitter } from "./event-emitter";
import { fileLocation } from "utils/file-location";
import { RunSummary } from "./run-summary";
import { isEmpty } from "utils/object";

export class TestRunnerContext {
  constructor({ fileLocations=[], requireFunc, randomizeOrder=false, onlyIncludeTags={}, excludeTags={}, seed }={}) {
    Object.assign(this, {
      fileLocations,
      requireFunc,
      eventEmitter: new TestRunnerEventEmitter(),
      runSummary: new RunSummary(),
      randomizeOrder,
      seed,
      onlyIncludeTags,
      excludeTags,
    });

    this._locationsWithLineNumber = fileLocations.filter(l => l.lineNumbers.length);
  }

  static forSingleLocation(file, lineNumbers) {
    return new TestRunnerContext({
      fileLocations: [fileLocation(file, lineNumbers)]
    });
  }

  static forSingleFile(file, config) {
    return new TestRunnerContext({
      ...config,
      fileLocations: [fileLocation(file)]
    });
  }

  get hasNoLocationFilters() {
    return this._locationsWithLineNumber.length === 0;
  }

  isLocationRunnable(file, lineNumbers=[]) {
    if (this.hasNoLocationFilters) {
      return true;
    }

    let locations = this._locationsWithLineNumber.filter(l => l.file === file);

    if (locations.length > 0) {
      return locations.some(l => lineNumbers.some(n => l.lineNumbers.includes(n)));
    } else {
      return true;
    }
  }

  get hasNoTagFilters() {
    return this.hasNoOnlyIncludeTagFilters && this.hasNoExcludeTagFilters;
  }

  get hasNoOnlyIncludeTagFilters() {
    return isEmpty(this.onlyIncludeTags);
  }

  get hasNoExcludeTagFilters() {
    return isEmpty(this.excludeTags);
  }

  get hasExcludeTagFilters() {
    return !this.hasNoExcludeTagFilters;
  }

  areTagsRunnable(tags) {
    if (this.hasNoOnlyIncludeTagFilters) {
      return !doSomeTagsMatch(this.excludeTags, tags);
    } else {
      return doSomeTagsMatch(this.onlyIncludeTags, tags);
    }
  }
}

function doSomeTagsMatch(expectedTags, actualTags) {
  for (let tag in expectedTags) {
    if (expectedTags[tag] === actualTags[tag]) {
      return true;
    }
  }

  return false;
}
