const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'To-do List',
            hash: true,
            template: './src/template.html',
            filename: './index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(css|scss)$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpeg|jpg|svg|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                        name: "[name].[hash].[ext]",
                        outputPath: "imgs"
                    }
                }
            },
        ],
    },
};