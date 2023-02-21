let { nodeExternalsPlugin } = require('esbuild-node-externals');

module.exports = {
  entryPoints: ['./lib/jutest.js'],
  bundle: true,
  target: 'node12',
  platform: 'node',
  outdir: `dist`,
  sourcemap: true,
  plugins: [nodeExternalsPlugin()]
};
