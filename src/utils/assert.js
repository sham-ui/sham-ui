import DI from '../DI';

const PREFIX = 'sham-ui';

function AssertError() {
    const err = Error.apply( this, arguments );
    err.name = 'AssertError';
    return err;
}
AssertError.prototype = Object.create( Error.prototype, {
    constructor: { value: AssertError }
} );

function getStack( message ) {
    try {
        throw new AssertError( message );
    } catch ( e ) {
        return e;
    }
}

/**
 * Error assertion
 * @param {String} message
 * @param {Boolean} condition
 */
export function assertError( message, condition ) {
    if ( condition ) {
        DI.resolve( 'logger' ).error( getStack( `${PREFIX}: ${message}` ) );
    }
}

/**
 * Warning assertion
 * @param {String} message
 * @param {Boolean} condition
 */
export function assertWarn( message, condition ) {
    if ( condition ) {
        DI.resolve( 'logger' ).warn( getStack( `${PREFIX}: ${message}` ) );
    }
}

/**
 * Deprecation assertion
 * @param {String} message
 * @param {Boolean} condition
 */
export function assertDeprecate( message, condition ) {
    if ( condition ) {
        DI.resolve( 'logger' ).warn( getStack( `${PREFIX}: [DEPRECATION]: ${message}` ) );
    }
}
