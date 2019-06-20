const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { NODE_ENV, API_HOST, API_PORT, API_VERSION, APP_PREFIX, isPROD, paths } = require('../config');
const envVariables = { NODE_ENV, API_HOST, API_VERSION, APP_PREFIX };
const echoEnvVariables = Object.keys(envVariables).map((variable, index) => (
  `\n ${JSON.stringify(`${variable} = ${envVariables[Object.keys(envVariables)[index]]}`)}`
  + (Object.keys(envVariables).length - 1 === index ? '\n' : '')
));

console.info(`Environment variables: ${echoEnvVariables}`);

module.exports = {
  entry: {
    app: paths.appIndexJs
  },
  output: {
    filename: `[name]-[hash]${isPROD ? '.min' : ''}.js`,
    path: paths.appBuild
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        API_HOST: JSON.stringify(API_HOST),
        API_PORT: JSON.stringify(API_PORT),
        API_VERSION: JSON.stringify(API_VERSION),
        APP_PREFIX: JSON.stringify(APP_PREFIX),
      },
    }),
    new ProgressBarPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // Set only one chunk for current App iteration
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: paths.appSrc,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|png|jpg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/',
          }
        }]
      }
    ]
  },
  resolve: {
    alias: {
      // '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../src/components/AntIcons/index.js'),
      'assets': paths.resolveApp('src/assets/'),
      'pages': paths.resolveApp('src/pages/'),
      'components': paths.resolveApp('src/components/'),
      'routes': paths.resolveApp('src/routes/'),
      'config': paths.resolveApp('src/config/'),
      'utils': paths.resolveApp('src/utils/'),
      'styles': paths.resolveApp('src/styles/'),
    },
  }
};
