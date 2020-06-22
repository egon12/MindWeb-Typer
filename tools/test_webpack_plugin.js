const webpack = require('webpack'); //to access webpack runtime
const configuration = require('../webpack.config.js');
const HooksLogPlugin = require('./webpack_plugin')

let compiler = webpack(configuration);

new HooksLogPlugin().apply(compiler);

compiler.run(function(err, stats) {
	console.error(err)
});

