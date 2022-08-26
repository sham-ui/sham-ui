/**
 * @inner
 * @param {Object} object
 * @param {String} name
 * @param {*} value
 * @return {Object}
 */
function setupDescriptor( object, name, value ) {
    // eslint-disable-next-line no-nested-ternary
    const descriptor = 'object' === typeof value && null !== value ? (

        // Value is valid descriptor?
        'get' in value || 'set' in value ?

            // Then, use value as descriptor
            value :

            // Else, wrap value to get
            {
                get() {
                    return value;
                }
            }
    ) : (

        // Value is not object, wrap it
        { value }
    );
    Object.defineProperty(
        object,
        name,
        Object.assign(
            {},
            descriptor,
            {
                configurable: true,
                enumerable: true
            }
        )
    );
}

/**
 * @param {Object} current
 * @param {Object} newOptions
 * @param {Function} proxy
 * @return {Object}
 */
export default function setDefaultOptions( current, newOptions, proxy ) {
    for ( const name in newOptions ) {
        if ( !( name in current ) ) {
            setupDescriptor( current, name, newOptions[ name ] );

            // Set property getter/setter in proxy
            setupDescriptor( proxy, name, {
                get: () => current[ name ],
                set: value => proxy( {
                    [ name ]: value
                } )
            } );
        }
    }
    return current;
}
