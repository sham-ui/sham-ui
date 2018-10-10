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
 * @param {Object} [context]
 */
export function assertError( message, condition, context = {} ) {
    if ( condition ) {
        DI.resolve( 'logger' ).error( getStack( `${PREFIX}: ${message}` ), context );
    }
}

/**
 * Warning assertion
 * @param {String} message
 * @param {Boolean} condition
 * @param {Object} [context]
 */
export function assertWarn( message, condition, context = {} ) {
    if ( condition ) {
        DI.resolve( 'logger' ).warn( getStack( `${PREFIX}: ${message}` ), context );
    }
}

/**
 * Deprecation assertion
 * @param {String} message
 * @param {Boolean} condition
 * @param {Object} [context]
 */
export function assertDeprecate( message, condition, context = {} ) {
    if ( condition ) {
        DI.resolve( 'logger' ).warn( getStack( `${PREFIX}: [DEPRECATION]: ${message}` ), context );
    }
}
