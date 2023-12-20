const path = require('path');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /@emurgo[/\\]cardano-serialization-lib-browser/,
        path.resolve(__dirname, 'src'),
        {}
      )
    );

    return config;
  },
};

module.exports = nextConfig;
