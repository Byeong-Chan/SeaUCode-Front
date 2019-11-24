const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    entry: './index.js',
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new MonacoWebpackPlugin()
    ]
};