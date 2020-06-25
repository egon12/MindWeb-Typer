const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const DagExplorerWebpackPlugin = require('./tools/dag_explorer_webpack_plugin');

const jsconfig = {
	entry: {
		dag: ["./src/dag_presenter.js"],
		text: ["./src/text_presenter.js"],
		mindmap: ["./src/mindmap_presenter.js"],
		dag_explorer: ["./src/dag_explorer_presenter.js"],
	},
	mode: "production",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js"
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	},

	plugins: [
		new HtmlWebpackPlugin({
			chunks: ['dag_explorer'],
			template: 'src/dag_explorer.ejs',
		}),
		new DagExplorerWebpackPlugin(),
	]
};

module.exports = jsconfig
