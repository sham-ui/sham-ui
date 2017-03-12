var fs = require( 'fs' );
var webpack = require( 'webpack' );
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV;

var libraryName = 'shamUI';
var plugins = [], outputFile;

if ( env === 'build' ) {
    plugins.push( new UglifyJsPlugin( { minimize: true } ) );
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

var libraryConfig = {
    entry: __dirname + '/src/shamUI.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    resolve: {
        extensions: [ '.js' ]
    },
    plugins: plugins
};

function buildTestName( testName ) {
    var entry = {};
    entry[ testName ] = __dirname + '/test/' + testName + '/main.js';
    return {
        entry: entry,
        devtool: 'source-map',
        output: {
            path:  __dirname + '/test/' + testName + '/assets',
            filename: 'bundle.js',
            umdNamedDefine: true
        },
        module: {
            loaders: [
                {
                    test: /(\.js)$/,
                    loader: 'babel-loader',
                    exclude: /(node_modules|bower_components)/
                }
            ]
        },
        resolve: {
            extensions: [ '.js' ]
        },
        plugins: plugins
    };
}

var exports = [ libraryConfig ];
var files = fs.readdirSync( './test/' );
files.forEach( function( file ) {
    exports.push( buildTestName( file ) );
} );

module.exports = exports;