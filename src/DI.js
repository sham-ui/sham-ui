/**
 * Bindings map
 * @type {Map}
 */
const bindings = new Map();

/**
 * Simple DI implementation
 */
const DIContainer = {

    /**
     * Bind item by name
     * @param {String} name
     * @param {*} item
     */
    bind( name, item ) {
        bindings.set( name, item );
    },

    /**
     * Get item from container by name
     * @param {String} name
     * @return {*}
     */
    resolve( name ) {
        if ( bindings.has( name ) ) {
            return bindings.get( name );
        }
    }
};

// Cross lib support
const DI = window.DI || DIContainer;
window.DI = DI;

export default DI;

/**
 * Inject item by name
 */
export function inject() {
    if ( 1 === arguments.length ) {
        const name = arguments[ 0 ];
        return function() {
            return _inject( name );
        };
    } else {
        return _inject( arguments[ 1 ] );
    }

}

/**
 * @param {String} name
 * @private
 */
function _inject( name ) {
    return {
        enumerable: true,
        configurable: true,
        get() {
            return DI.resolve( name );
        }
    };
}
