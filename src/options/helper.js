import options from './decorator';

/**
 * Helper for configure options without decorators syntax
 * @param {Object} prototype
 * @param {Object} instance
 * @param {Object} props
 */
export default function configureOptions( prototype, instance, props ) {
    const propsWithDescriptors = {};
    for ( let name in props ) {
        const value = props[ name ];

        // eslint-disable-next-line no-nested-ternary
        const descriptor = 'object' === typeof value ? (

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

        // Apply option decorator & push to propsWithDescriptors
        propsWithDescriptors[ name ] = options( instance, name, descriptor );
    }

    // Apply to prototype;
    Object.defineProperties( prototype, propsWithDescriptors );
}
