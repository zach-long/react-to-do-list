const path = require('path');

const outputDir = `./public`;
const sourceJs = `./src/app.jsx`;
const outputJsName = `app.js`;

module.exports = {
  mode: 'production',
  entry: sourceJs,
  output: {
    filename: outputJsName,
    path: path.resolve(__dirname, outputDir)
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/transform-runtime']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js']
  }
};