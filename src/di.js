import bindServices from './initializer';


/**
 * Create new instance of DI
 * @return {DI}
 */
export function createDI() {

    /**
     * Bindings map
     * @type {Map}
     * @inner
     */
    const bindings = new Map();

    /**
     * Factories
     * @type {Map}
     * @inner
     */
    const factories = new Map();

    return bindServices(

        /**
         * @class DI
         */
        {

            /**
             * Bind item by name
             * @memberof DI
             * @param {string} name
             * @param {*} item
             * @return {DI}
             */
            bind( name, item ) {
                bindings.set( name, item );
                return this;
            },

            /**
             * Lazy bind item factory by name
             * @memberof DI
             * @param {string} name
             * @param {*} factory
             * @return {DI}
             */
            bindLazy( name, factory ) {
                factories.set( name, factory );
                return this;
            },

            /**
             * Get item from container by name
             * @memberof DI
             * @param {string} name
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
        }
    );
}
