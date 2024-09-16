import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import TerserPlugin from 'terser-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

interface Configuration extends webpack.Configuration {
  devServer?: webpackDevServer.Configuration;
}

const config = (env: Object, argv: {mode: string}): Configuration => {

  const isProduction = argv.mode === 'production';
  console.log(`mode = ${argv.mode}`);

  // webpack-dev-serverの設定
  const devServerConfig: webpackDevServer.Configuration = {
    // host: 'localhost', // macだとこれ指定すると繋がらなくなる
    open: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'build'),
    },
  };

  const config: Configuration = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
    devServer: devServerConfig,
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000
    },

    entry: path.resolve('./js/index.tsx'),
    output: {
      path: path.resolve(`./build/`),
      filename: 'main.js',
    },
    module: {
      rules: [
        // TypeScript
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        // CSS
        {
          test: /\.css/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
          ],
        },
        // 画像ファイル
        {
          test: /\.png/,
          use: ['url-loader'],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // ecma: 6,
            // warnings: false,
            parse: {},
            compress: {},
            mangle: true,
            module: false,
            // output: null,
            toplevel: false,
            // nameCache: null,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: true,          
          }
        })
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: './static',
            to: '',
          },
        ]
      }),
    ],
  }

  const workbox = new WorkboxWebpackPlugin.GenerateSW({
    maximumFileSizeToCacheInBytes: 500 * 1024 * 1024,
    runtimeCaching: [],
  });

  if(isProduction) {
    config.plugins?.push(workbox);
  }
 
  return config;
};


export default (env: any, argv: any) => config(env, argv);
