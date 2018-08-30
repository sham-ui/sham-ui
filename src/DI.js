/**
 * Bindings map
 * @type {Map}
 */
const bindings = new Map();

/**
 * Simple DI implementation
 */
class DIContainer {

    /**
     * Bind item by name
     * @param {String} name
     * @param {*} item
     */
    static bind( name, item ) {
        bindings.set( name, item );
    }

    /**
     * Get item from container by name
     * @param {String} name
     * @return {*}
     */
    static resolve( name ) {
        if ( bindings.has( name ) ) {
            return bindings.get( name );
        }
    }
}

// Cross lib support
const DI = window.DI || DIContainer;
window.DI = DI;

export default DI;

/**
 * Inject item by name
 * @param target
 * @param {String} key
 * @param descriptor
 */
export function inject( target, key, descriptor ) {
    const name = descriptor.initializer();
    descriptor.initializer = function() {
        return DI.resolve( name );
    };
}
