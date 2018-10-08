/**
 * @param {Object} descriptor
 * @param {String} name
 * @param {Object} context
 */
function bindProperty( descriptor, name, context ) {
    if ( !descriptor.hasOwnProperty( name ) ) {
        return;
    }
    if ( 'function' === typeof descriptor[ name ] ) {
        descriptor[ name ] = descriptor[ name ].bind( context );
    }
}

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
        bindProperty( descriptor, 'get', widgetContext );
        bindProperty( descriptor, 'set', widgetContext );
        bindProperty( descriptor, 'value', widgetContext );
    }
    return descriptors;
}
