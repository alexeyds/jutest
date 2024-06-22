let { nodeExternalsPlugin } = require('esbuild-node-externals');
let { copy } = require('esbuild-plugin-copy');
let { clean } = require('esbuild-plugin-clean');
let { esmSplitCodeToCjs } = require('./plugins');
let { sharedConfig } = require("./esbuild.shared");

let outdir = 'dist';

let config = {
  ...sharedConfig,
  entryPoints: ['./lib/jutest.js', './lib/runtime.js', './lib/reporters.js'],
  bundle: true,
  plugins: [
    nodeExternalsPlugin(),
    esmSplitCodeToCjs,
    copy({
      assets: {
        from: ['./lib/types/*'],
        to: ['./types'],
      }
    }),
    clean({
      patterns: [`./${outdir}/*`]
    }),
  ],
  outdir,
  splitting: true,
  sourcemap: true,
  metafile: true,
  format: 'esm',
};

module.exports = {
  config
};
