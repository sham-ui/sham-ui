var gulp = require( "gulp" );
var rjs = require( "requirejs" );
var duration = require( "gulp-duration" );
var jscpd = require( "gulp-jscpd" );
var jscs = require( "gulp-jscs" );
var shell = require( "gulp-shell" );
var complexity = require( "gulp-complexity" );

gulp.task( "requirejs", function() {
    rjs.optimize( {

	    // All paths will be relative to this baseUrl.
        baseUrl: "src",

        // Tells r.js that you want everything in one file.
        out: "dist/shamUI.js",

        // Set paths for modules (shortcut alias for "include").
        paths: {
            machina: "lib/machina",
            lodash: "lib/lodash",
            Q: "lib/q",
            "Class": "lib/jsface",
            almond: "../bower_components/almond/almond"
        },
        packages: [
            {
              location: "widgets/label"
            }
        ],

        // Include "almond" and "shamUI" into the final file
        // specified in "out" property.
        include: [ "almond", "shamUI" ],

        // Wrapper for AMD, CommonJS and Browser compatibility.
        wrap: {
            startFile: "src/_start.js",
            endFile: "src/_end.js"
        },
        shim: {
            "Class": {
              exports: "Class"
            }
        },

        // Minify the file.
        optimize: "uglify2",

        // Strip comments.
        preserveLicenseComments: false,

        // Add source maps for the original modules.
        generateSourceMaps: true
    } );
} );

gulp.task( "watch", function() {
    gulp.watch(
        [ "src/**/*.js", "demo/**/*.js" ],
        [ "requirejs", "doc" ]
    );
} );

gulp.task( "doc", shell.task( [
    "node ./node_modules/jsdoc/jsdoc.js -P ./package.json -c ./conf.json -R ./README.md"
] ) );

gulp.task( "complexity", function() {
    return gulp.src( [ "src/**/*.js", "!src/lib/*", "!src/_start.js", "!src/_end.js" ] )
	    .pipe( complexity( { breakOnErrors: false } ) );
} );

gulp.task( "cp-detector", function() {
    return gulp.src( [ "src/**/*.js", "!src/lib/*", "!src/_start.js", "!src/_end.js" ] )
	    .pipe( jscpd( {
            verbose: true
	    } ) );
} );

gulp.task( "code-style", function() {
    return gulp.src( [
        "src/**/*.js", "!src/lib/*", "!src/_start.js", "!src/_end.js", "gulpfile.js", "demo/**/*.js"
    ] ).pipe( jscs( {
        preset: "jquery"
    } ) );
} );

gulp.task( "default", [ "requirejs", "watch" ] );
