'use strict';

const path = require('path');
const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const cssFilename = 'static/css/[name].[hash:8].css';

const extractTextPluginOptions = {
    publicPath: Array(cssFilename.split('/').length).join('../')
};

const config = {
    // 入口
    // entry: {
    //     app: path.join(__dirname, '../src/index')
    // },
    entry: [
        // Set up an ES6-ish enviroment
        'babel-polyfill',

        // Add your application's scripts below
        path.join(__dirname, '../src/index')
    ],
    // 输出目录
    output: {
        pathinfo: true,
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: 'static/js/[name].[hash:8].chunk.js',
        path: path.join(__dirname, '../dist'),
        publicPath: './'
    },
    // 解析
    resolve: {
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', '.less', '.css']
    },
    // 加载
    module: {
        strictExportPresence: true, // 缺少到处exports直接报错
        rules: [
            {
                oneOf: [
                    // "url" loader works like "file" loader except that it embeds assets
                    // smaller than specified limit in bytes as data URLs to avoid requests.
                    // A missing `test` is equivalent to a match.
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    // Process JS with Babel.
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: path.join(__dirname, "../src"),
                        loader: require.resolve('babel-loader'),
                        options: {
                            // load antd-mobile style
                            // plugins: [
                            //   ["import", { "libraryName": "antd-mobile", "style": "css" }] // `style: true` for less
                            // ],

                            compact: true,
                        },
                    },
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader turns CSS into JS modules that inject <style> tags.
                    // In production, we use a plugin to extract that CSS to a file, but
                    // in development "style" loader enables hot editing of CSS.
                    {
                      test: /\.(css|less)$/,
                      loader: ExtractTextPlugin.extract(
                        Object.assign(
                          {
                            fallback: {
                              loader: require.resolve('style-loader'),
                              options: {
                                hmr: false,
                              },
                            },
                            use: [
                              {
                                loader: require.resolve('css-loader'),
                                options: {
                                  importLoaders: 1,
                                  minimize: true,
                                  sourceMap: true,
                                },
                              },
                              {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                  // Necessary for external CSS imports to work
                                  // https://github.com/facebookincubator/create-react-app/issues/2677
                                  ident: 'postcss',
                                  plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                      browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                      ],
                                      flexbox: 'no-2009',
                                    }),
                                  ],
                                },
                              },
                              {
                                loader: require.resolve('less-loader')
                              },
                            ],
                          },
                          extractTextPluginOptions
                        )
                      ),
                      // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                    },
                    // "file" loader makes sure those assets get served by WebpackDevServer.
                    // When you `import` an asset, you get its (virtual) filename.
                    // In production, they would get copied to the `build` folder.
                    // This loader doesn't use a "test" so it will catch all modules
                    // that fall through the other loaders.
                    {
                        // Exclude `js` files to keep "css" loader working as it injects
                        // its runtime that would otherwise processed through "file" loader.
                        // Also exclude `html` and `json` extensions so they get processed
                        // by webpacks internal loaders.
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.(css|less)$/, /\.json$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: Infinity
                }
            }
        }
    },
    // 插件
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 移除没有使用到的Moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CleanWebpackPlugin(['../dist']),
        new HTMLPlugin({
            inject: 'body',
            chunks: ['vendor', 'main'],
            template: path.join(__dirname, '../public/index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                warning: "verbose",
                ecma: 6,
                beautify: false,
                compress: false,
                comments: false,
                mangle: false,
                toplevel: false,
                keep_classnames: true,
                keep_fnames: true
            },
            sourceMap: true
        }),
        new ExtractTextPlugin({
            filename: cssFilename,
        }),
    ],
    stats: {
        // Examine all modules
        maxModules: Infinity,
        // Display bailout reasons
        optimizationBailout: true
    },
    devtool: 'inline-source-map',
    mode: 'development',
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    performance: {
        hints: false,
    }
};

module.exports = config;
