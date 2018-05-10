const path = require('path');

module.exports = {
  entry: './src/dag_presenter.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dag.js',
    library: 'debug',
    libraryTarget: 'var'


  }
};

