/**
 * @inner
 * @param value
 * @return {Object*}
 */
export default function createDescriptor( value ) {
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
    return Object.assign(
        {},
        descriptor,
        {
            configurable: true,
            enumerable: true
        }
    );
}
