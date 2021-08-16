import path from 'path';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname;

export default {
	mode: 'production',
	entry: {
		SeaPort: './webpack/seaport.ts',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './static/assets/'),
		library: '[name]',
		libraryTarget: 'window',
		libraryExport: 'default',
		umdNamedDefine: true,
	},
	plugins: [new NodePolyfillPlugin()],
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			'crypto-browserify': require.resolve('crypto-browserify'),
		},
	},
	module: {},
	devServer: {
		writeToDisk: true,
	},
};
