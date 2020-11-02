import createTest from 'create_test';
import { strict as assert } from 'assert';

let wasRun = false;
let test = createTest({
  runner: () => { wasRun = true; },
  name: 'my test'
});

assert.equal(test.name, 'my test');
test.run();
assert.equal(wasRun, true);
