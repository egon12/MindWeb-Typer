const path = require('path');

module.exports = {
  entry: {
    'dag': ['./src/dag_presenter.js'],
    'text' : ['./src/text_presenter.js'],
    'mindmap' : ['./src/mindmap_presenter.js'],
    'dag_explorer': ['./src/dag_explorer_presenter.js'],
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  }
};

