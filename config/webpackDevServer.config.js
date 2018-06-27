// webpack-dev-server 实现热更新
const webpack = require('webpack');
const path = require('path');
const webpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.dev.js');

const options = {
    historyApiFallback: true,
    open: true,
    hot: true,
    host: 'localhost',
    port: '8000',
    inline: true,
    progress: true,
    contentBase: path.resolve(__dirname, "../src"),
    stats: { colors: true },
    publicPath: config.output.publicPath
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

// config.entry.unshift("webpack-dev-server/client?http://localhost:8000", "webpack/hot/dev-server");

server.listen(8000, "localhost", function(err) {
    if (err) {
        console.log(err);
    }
    console.log('Listening at localhost:8000...');
});






















