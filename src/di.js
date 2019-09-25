/**
 * Bindings map
 * @type {Map}
 */
const bindings = new Map();

/**
 * Factories
 * @type {Map}
 */
const factories = new Map();

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
     * Lazy bind item factory by name
     * @param {String} name
     * @param {*} factory
     */
    bindLazy( name, factory ) {
        factories.set( name, factory );
    },

    /**
     * Get item from container by name
     * @param {String} name
     * @return {*}
     */
    resolve( name ) {

        // If name already resolved
        if ( bindings.has( name ) ) {
            return bindings.get( name );
        }

        // Lazy resolve
        if ( factories.has( name ) ) {

            // Create
            const item = new( factories.get( name ) );

            // Save
            bindings.set( name, item );

            // Remove from lazy factories mapping
            factories.delete( name );
            return item;
        }
    }
};

// Cross lib support
const DI = window.DI || DIContainer;

export default DI;
