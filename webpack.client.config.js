const config = require('sapper/webpack/config.js');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
	entry: config.client.entry(),
	output: config.client.output(),
	resolve: {
		extensions: ['.js', '.html']
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						hydratable: true,
						emitCss: !config.dev,
						cascade: false,
						store: true
					}
				}
			},
			config.dev && {
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" }
				]
			},
			!config.dev && {
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [{ loader: 'css-loader', options: { sourceMap: config.dev } }]
				})
			}
		].filter(Boolean)
	},
	plugins: [
		config.dev && new webpack.HotModuleReplacementPlugin(),
		!config.dev && new ExtractTextPlugin('main.css'),
		!config.dev && new webpack.optimize.ModuleConcatenationPlugin(),
		!config.dev && new UglifyJSPlugin(),
		!config.dev && new BrotliPlugin({
			asset: '[fileWithoutExt].br.[ext][query]',
			test: /\.(js|css)$/,
			threshold: 10240,
			minRatio: 0.8
	})
	].filter(Boolean),
	devtool: config.dev ? 'inline-source-map' : false
};