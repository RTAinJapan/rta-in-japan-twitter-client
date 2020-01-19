import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
import webpackBase from './webpack.config';

interface Configuration extends webpack.Configuration {
  devServer?: webpackDevServer.Configuration;
}

const newConfig = webpackBase.map(config => {
  return {
    ...config,
    plugins: [...(config.plugins as webpack.Plugin[]), new BundleAnalyzerPlugin()],
  };
});

export default newConfig;
