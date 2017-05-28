import DI from '../DI';

const PREFIX = 'sham-ui';

function AssertError( msg ) {
    const err = Error.apply( this, arguments );
    err.name = 'AssertError';
    return err;
}
AssertError.prototype = Object.create( Error.prototype, {
    constructor: { value: AssertError }
} );

class Assert {
    static getStack( message ) {
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
    static error( message, condition ) {
        if ( condition ) {
            DI.resolve( 'logger' ).error( Assert.getStack( `${PREFIX}: ${message}` ) );
        }
    }

    /**
     * Warning assertion
     * @param {String} message
     * @param {Boolean} condition
     */
    static warn( message, condition ) {
        if ( condition ) {
            DI.resolve( 'logger' ).warn( Assert.getStack( `${PREFIX}: ${message}` ) );
        }
    }
}

export default {
    /**
     * Error assertion
     * @param {String} message
     * @param {Boolean} condition
     */
    error: Assert.error,

    /**
     * Warning assertion
     * @param {String} message
     * @param {Boolean} condition
     */
    warn: Assert.warn
}