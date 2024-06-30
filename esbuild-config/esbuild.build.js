let esbuild = require('esbuild');
let { nodeExternalsPlugin } = require('esbuild-node-externals');
let { copy } = require('esbuild-plugin-copy');
let { clean } = require('esbuild-plugin-clean');
let { sharedConfig } = require("./esbuild.shared");

let outdir = 'dist';

let sharedPlugins = [ nodeExternalsPlugin() ];

let config = {
  ...sharedConfig,
  entryPoints: ['./lib/jutest.js', './lib/runtime.js', './lib/reporters.js'],
  bundle: true,
  splitting: true,
  format: 'esm',
}

let esmConfig = {
  ...config,
  plugins: [
    ...sharedPlugins,
    copy({
      assets: {
        from: ['./lib/types/*'],
        to: ['../types'],
      }
    }),
    clean({
      patterns: [`./${outdir}/*`]
    }),
  ],
  outdir: `${outdir}/esm`,
  outExtension: { '.js': '.mjs' },
  sourcemap: true,
};

let cjsConfig = {
  ...config,
  plugins: [ ...sharedPlugins, esmSplitCodeToCjs() ],
  supported: {
    'dynamic-import': false,
  },
  outdir,
  metafile: true,
};

// https://github.com/evanw/esbuild/issues/16#issuecomment-1817213133
function esmSplitCodeToCjs() {
  return {
    name: 'esmSplitCodeToCjs',
    setup(build) {
      build.onEnd(async (result) => {
        const outFiles = Object.keys(result.metafile?.outputs ?? {});
        const jsFiles = outFiles.filter((f) => f.endsWith('js'));

        await esbuild.build({
          outdir: build.initialOptions.outdir,
          entryPoints: jsFiles,
          allowOverwrite: true,
          format: 'cjs',
          logLevel: 'error',
        });
      });
    },
  }
}

module.exports = {
  configs: [ esmConfig, cjsConfig ],
};
