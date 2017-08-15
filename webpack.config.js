let webpack = require('webpack');

module.exports = {
  devServer: {
    hot: false,
    inline: false,
  },
  entry: {
    app: './src/main.ts',
  },
  module: {
    loaders: [
      {
        test: /\.ts$|\.tsx$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  output: {filename: "app.js"},
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};
