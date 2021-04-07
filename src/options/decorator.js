import hoistingOptions from './hoisting';

/**
 * Decorator for mark property as default value of options
 * @param {Component} target
 * @param {string} name
 * @param {Object} descriptor
 * @return {Object}
 */
export default function( target, name, descriptor ) {
    if ( 'function' === typeof target ) {
        throw new Error( 'Static options don\'t allow' );
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
