// https://github.com/evanw/esbuild/issues/16#issuecomment-1817213133
let esbuild = require('esbuild');

let esmSplitCodeToCjs = {
  name: 'esmSplitCodeToCjs',
  setup(build) {
    build.onEnd(async (result) => {
      const outFiles = Object.keys(result.metafile?.outputs ?? {})
      const jsFiles = outFiles.filter((f) => f.endsWith('js'))

      await esbuild.build({
        outdir: build.initialOptions.outdir,
        entryPoints: jsFiles,
        allowOverwrite: true,
        format: 'cjs',
        logLevel: 'error',
      })
    })
  },
}

module.exports = { esmSplitCodeToCjs };
