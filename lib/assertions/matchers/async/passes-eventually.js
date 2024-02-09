import { inspect } from 'util';
import { success, failure, AssertionFailedError } from 'assertions/shared';

export async function passesEventually(func, { timeout=500, interval=0 }={}) {
  let resolve;
  let promise = new Promise(r => resolve = r);
  let startTime = Date.now();
  
  let intervalID = setInterval(async () => {
    let lastErrorState;

    try {
      await func();
      lastErrorState = emptyLastErrorState();
    } catch(e) {
      lastErrorState = presentLastErrorState(e);
    }

    if (!lastErrorState.wasThrown || Date.now() - startTime >= timeout) {
      clearInterval(intervalID);
      resolve(lastErrorState);
    }
  }, interval);

  let lastErrorState = await promise;

  if (lastErrorState.wasThrown) {
    return failure(failureMessage({ timeout, lastError: lastErrorState.error }));
  } else {
    return success();
  }
}

function failureMessage({ timeout, lastError }) {
  let expectationText = `Expected the function to resolve without errors after ${timeout}ms`;

  if (lastError instanceof AssertionFailedError) {
    return (
      `${expectationText}. Last failing assertion was:` +
      '\n' +
      '\n' +
      lastError.message
    );
  } else {  
    return (
      `${expectationText}. Last thrown error was ${inspect(lastError)}` +
      `\n` +
      `\n` +
      `(operator: passesEventually)`
    );
  }
}

function emptyLastErrorState() {
  return { wasThrown: false, error: undefined };
}

function presentLastErrorState(error) {
  return { wasThrown: true, error };
}
