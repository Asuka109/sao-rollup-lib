import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

<% const useTS = language === 'ts' -%>

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.<%= useTS ? "ts" : "js" %>',
		output: {
      name: '<%= name %>',
      file: pkg.browser,
      format: 'umd'
    },
		plugins: [
			resolve({
				extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx']
			}),
			commonjs(), // so Rollup can convert `ms` to an ES module
			babel({
				exclude: ['node_modules/**'],
				extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
			})
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.<%= useTS ? "ts" : "js" %>',
		external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			resolve({
				extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx']
			}),
			babel({
				exclude: ['node_modules/**'],
				extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
			})
		]
	}
];
