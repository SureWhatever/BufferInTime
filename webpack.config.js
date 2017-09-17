const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

const isProduction = process.env.npm_lifecycle_event === 'build'

let htmlConfig = {
  filename: 'index.html',
  template: 'src/index.html'
};

if(isProduction) {
  htmlConfig.inlineSource = '.(js|css)$'
}

module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname,
		filename: "./bin/buffer-in-time.js"
	},
	module: {
		loaders: [
		{ test: /\.css$/, loader: "style!css" }
		]
	},
	plugins: [
		new HtmlWebpackPlugin(htmlConfig),
		new HtmlWebpackInlineSourcePlugin()
	]
};

