const path = require('path');

module.exports = {
  entry: {
    'dag': ['./src/dag_presenter.js'],
    'text' : ['./src/text_presenter.js'],
    //'painter': ['./src/painter.new.js'],
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  }
};

