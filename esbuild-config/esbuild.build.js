let { esmSplitCodeToCjs } = require('./plugins');
let { nodeExternalsPlugin } = require('esbuild-node-externals');
let { sharedConfig } = require("./esbuild.shared");

let config = {
  ...sharedConfig,
  entryPoints: ['./lib/jutest.js', './lib/runtime.js', './lib/reporters.js'],
  bundle: true,
  plugins: [nodeExternalsPlugin(), esmSplitCodeToCjs],
  outdir: 'dist',
  splitting: true,
  sourcemap: true,
  metafile: true,
  format: 'esm',
};

module.exports = {
  config
};
