let { nodeExternalsPlugin } = require('esbuild-node-externals');
let { sharedConfig } = require("./esbuild.shared");

let config = {
  ...sharedConfig,
  entryPoints: ['./lib/jutest.js'],
  bundle: true,
  plugins: [nodeExternalsPlugin()],
  outdir: 'dist',
  sourcemap: true,
};

module.exports = {
  config
};
