/**
 * @param {Object} descriptor
 * @param {String} name
 * @param {Object} context
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
 */
export default function bindDescriptors( componentContext, options ) {
    const descriptors = Object.getOwnPropertyDescriptors( options );
    for ( let name in descriptors ) {
        const descriptor = descriptors[ name ];
        bindProperty( descriptor, 'get', componentContext );
        bindProperty( descriptor, 'set', componentContext );
        bindProperty( descriptor, 'value', componentContext );
    }
    return descriptors;
}
