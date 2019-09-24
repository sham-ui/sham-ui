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

export default DI;
