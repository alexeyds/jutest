import babel from 'rollup-plugin-babel';
import pkg from './package.json' assert { type: "json" };
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'lib/jutest.js',
    output: { file: pkg.main, format: 'cjs', indent: false, exports: 'default' },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'path',
      'util'
    ],
    plugins: [babel(), resolve({preferBuiltins: true})]
  }
];