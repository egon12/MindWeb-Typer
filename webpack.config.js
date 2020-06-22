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

	plugins: [
		new DagExplorerWebpackPlugin(),
	]
};

module.exports = jsconfig
