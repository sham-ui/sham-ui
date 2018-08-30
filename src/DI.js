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
 */
export function inject() {
    if ( 1 === arguments.length ) {
        const name = arguments[ 0 ];
        return function() {
            return _inject( ...arguments, name );
        };
    } else {
        return _inject( ...arguments );
    }

}

/**
 * @param target
 * @param {String} key
 * @param descriptor
 * @param name
 * @private
 */
function _inject( target, key, descriptor, name ) {
    if ( undefined === name ) {
        if ( typeof descriptor.initializer === 'function' ) {
            name = descriptor.initializer();
        } else {
            name = key;
        }
    }
    return {
        enumerable: true,
        configurable: true,
        get() {
            return DI.resolve( name );
        }
    };
}
