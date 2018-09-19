/**
 *
 * @param {Object} widgetContext
 * @param {Object} options
 * @return {Object}
 */
export default function bindOptionsDescriptors( widgetContext, options ) {
    const descriptors = Object.getOwnPropertyDescriptors( options );
    for ( let name in descriptors ) {
        const descriptor = descriptors[ name ];
        if ( descriptor.hasOwnProperty( 'get' ) ) {
            descriptor.get = descriptor.get.bind( widgetContext );
        } else if ( descriptor.hasOwnProperty( 'set' ) ) {
            descriptor.set = descriptor.set.bind( widgetContext );
        } else if (
            descriptor.hasOwnProperty( 'value' ) &&
            'function' === typeof descriptor.value
        ) {
            descriptor.value = descriptor.value.bind( widgetContext );
        }

    }
    return descriptors;
}
