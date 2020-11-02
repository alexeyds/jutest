export default function createTest({name, runner}) {
  return {
    name,
    run: runner
  };
}