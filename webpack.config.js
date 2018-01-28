var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
          { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
      },
    stats: {
        colors: true
    },
    devtool: 'source-map'
}