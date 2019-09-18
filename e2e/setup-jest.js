const path = require( 'path' );
const childProcess = require( 'child_process' );

childProcess.execSync( 'yarn build:silent', {
    cwd: path.resolve( __dirname, '..' )
} );

