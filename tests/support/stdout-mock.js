export function createStdoutMock() {
  let outputData = [];
  let stdoutMock = (data) => outputData.push(data);
  stdoutMock.outputData = outputData;

  return stdoutMock;
}
