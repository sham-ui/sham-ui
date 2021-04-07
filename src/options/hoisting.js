/**
 * Hoisting options in prototype chain
 * @param {Object} target
 * @inner
 */
export default function hoistingOptions( target ) {
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
