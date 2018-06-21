
'use strict';

/* eslint filenames/match-regex: 0 */

const webpack = require(`webpack`);
const path = require(`path`);
const $ = require(`jquery`);
const autoprefixer = require(`autoprefixer`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);





const extractSass = new ExtractTextPlugin({
	filename: `./app/frontend/build/styles/style.css`,
	disable: process.env.NODE_ENV === `development`,
});

module.exports = {
	entry: [`babel-polyfill`, `./app/frontend/source/app.js`],
	output: {
		path: path.resolve(__dirname),
		// publicPath: `./app/frontend/build/`,
		filename: `./app/frontend/build/bundle.js`,
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: `babel-loader`,
				options: {
					presets: [
						[
							`env`,
							{
								targets: {
									browsers: [
										`last 3 versions`,
										`>0.5%`,

									],
								},
								modules: false,
							},
						],
					],
				},
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [{
						loader: `css-loader`,
					}, {
						loader: `sass-loader`,
					}],
					// use style-loader in development
					fallback: `style-loader`,
				}),
			},
			{
				test: /\.(jpe?g|gif|png|svg)$/,
				exclude: /node_modules/,
				loader: `file-loader?emitFile=false&useRelativePath=true&name=[name].[ext]`,
			},
			// {
			//
			// 	test: /\.(jpg|jpeg|gif|png)$/,
			// 	exclude: /node_modules/,
			// 	loader:`url-loader?limit=1024&name=[name].[ext]`,
			// },
			// {
			// 	test: /\.(woff|woff2|eot|ttf|svg)$/,
			// 	exclude: /node_modules/,
			// 	loader: `url-loader?limit=1024&name=[name].[ext]`,
			// },
		],
		unknownContextCritical: false,
		unknownContextRegExp: /^.\/.*$/,
	},
	plugins: [
		new ExtractTextPlugin(`style.css`),
		extractSass,
		new webpack.ProvidePlugin({
			$: `jquery`,
			jQuery: `jquery`,
		}),
		new CopyWebpackPlugin([
			{ from: `./app/frontend/source/images/`,
				to: `./app/frontend/build/images/`,
			},
		]),
	],
};
