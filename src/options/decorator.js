/**
 * Decorator for mark property as default value of options
 * @param target
 * @param name
 * @param descriptor
 * @return {*}
 */
export default function( target, name, descriptor ) {
    if ( 'function' === typeof target ) {
        throw new Error( `static options don't allow. Name: ${name}, target: ${target}` );
    }
    if ( !target.hasOwnProperty( '_options' ) ) {
        Object.defineProperty( target, '_options', {
            value: Object.create( target._options || null, {} ),
            enumerable: false,
            configurable: true
        } );
    }
    if ( descriptor.hasOwnProperty( 'initializer' ) ) {
        descriptor.value = descriptor.initializer();
        delete descriptor.initializer;
    }
    Object.defineProperty( target._options, name, descriptor );
}
