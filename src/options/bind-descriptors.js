/**
 * @param {Object} descriptor
 * @param {string} name
 * @param {Object} context
 * @inner
 */
function bindProperty( descriptor, name, context ) {
    if ( !descriptor.hasOwnProperty( name ) ) {
        return;
    }
    const property = descriptor[ name ];
    if ( 'function' === typeof property ) {
        descriptor[ name ] = property.bind( context );
    }
}

/**
 *
 * @param {Object} componentContext
 * @param {Object} options
 * @return {Object}
 * @inner
 */
export default function bindDescriptors( componentContext, options ) {
    const descriptors = Object.getOwnPropertyDescriptors( options );
    for ( let name in descriptors ) {
        const descriptor = descriptors[ name ];
        [
            'get',
            'set',
            'value'
        ].forEach(
            item => bindProperty( descriptor, item, componentContext )
        );
    }
    return descriptors;
}
