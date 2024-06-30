let esbuild = require('esbuild');
let { nodeExternalsPlugin } = require('esbuild-node-externals');
let { copy } = require('esbuild-plugin-copy');
let { clean } = require('esbuild-plugin-clean');
let { sharedConfig } = require("./esbuild.shared");

let outdir = 'dist';

let config = {
  ...sharedConfig,
  entryPoints: ['./lib/jutest.js', './lib/runtime.js', './lib/reporters.js'],
  bundle: true,
  plugins: [
    nodeExternalsPlugin(),
    esmSplitCodeToCjs(),
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
  metafile: true,
  splitting: true,
  format: 'esm',
};

// https://github.com/evanw/esbuild/issues/16#issuecomment-1817213133
function esmSplitCodeToCjs() {
  return {
    name: 'esmSplitCodeToCjs',
    setup(build) {
      build.onEnd(async (result) => {
        const outFiles = Object.keys(result.metafile?.outputs ?? {})
        const jsFiles = outFiles.filter((f) => f.endsWith('js'))

        await esbuild.build({
          outdir: build.initialOptions.outdir,
          entryPoints: jsFiles,
          allowOverwrite: true,
          sourcemap: true,
          format: 'cjs',
          logLevel: 'error',
        })
      })
    },
  }
}

module.exports = {
  config
};
