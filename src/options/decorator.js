/**
 * Hoisting options in prototype chain
 * @param {Object} target
 * @inner
 */
export function hoistingOptions( target ) {
    if ( !target.hasOwnProperty( '_options' ) ) {
        let options;
        if ( undefined === target._options ) {
            options = {};
        } else {

            // Create copy with descriptors
            options = Object.create(
                null,
                Object.getOwnPropertyDescriptors( target._options )
            );
        }
        Object.defineProperty( target, '_options', {
            value: options,
            enumerable: false,
            configurable: true
        } );
    }
}

/**
 * Decorator for mark property as default value of options
 * @param {Component} target
 * @param {string} name
 * @param {Object} descriptor
 * @return {Object}
 */
export default function( target, name, descriptor ) {
    if ( 'function' === typeof target ) {
        throw new Error( `static options don't allow. Name: ${name}, target: ${target}` );
    }
    hoistingOptions( target );
    if ( descriptor.hasOwnProperty( 'initializer' ) ) {
        descriptor.value = descriptor.initializer();
        delete descriptor.initializer;
    }
    descriptor.enumerable = true;
    descriptor.configurable = true;
    Object.defineProperty( target._options, name, descriptor );
    return descriptor;
}
