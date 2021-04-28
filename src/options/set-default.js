import createDescriptor from './create-descriptor';

/**
 * @param {Object} current
 * @param {Object} newOptions
 * @return {Object}
 */
export default function setDefaultOptions( current, newOptions ) {
    for ( const name in newOptions ) {
        if ( !( name in current ) ) {
            Object.defineProperty(
                current,
                name,
                createDescriptor( newOptions[ name ] )
            );
        }
    }
    return current;
}
