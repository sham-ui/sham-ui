const path = require( 'path' );
const webpack = require( 'webpack' );

const plugins = [
    new webpack.NoEmitOnErrorsPlugin()
];

module.exports = {
    entry: {
        'sham-ui': './src/shamUI.js'
    },
    output: {
        path: path.join( __dirname, 'lib' ),
        filename: '[name].js',
        publicPath: '/',
        library: [ 'sham-ui', 'sham-ui/[name]' ],
        libraryTarget: 'umd'
    },
    externals: [
        'sham-ui'
    ],
    plugins: plugins,
    module: {
        rules: [ {
            test: /(\.js)$/,
            loader: 'babel-loader',
            exclude: /(node_modules)/,
            include: __dirname
        } ]
    }
};
