import { createComponent } from './create';
/**
 * @inner
 * @typedef {Object} LoopOptions
 * @property {String} value
 * @property {String} key
 */

/**
 * @inner
 * @param {number} index
 * @return {number}
 */
const transformArrayKey = index => index;

/**
 * @inner
 * @param {string[]} keys
 * @return {function(number): string}
 */
const transformObjectKey = ( keys ) => ( index ) => keys[ index ];

/**
 * Build loopItem state
 * @inner
 * @param {Object|Array}array
 * @param {String|Number} key
 * @param {number} index
 * @param {LoopOptions|null} options
 * @return {*}
 */
function buildState( array, key, index, options ) {
    if ( options ) {
        const item = { __index__: index };
        item[ options.value ] = array[ key ];
        if ( options.key ) {
            item[ options.key ] = key;
        }
        return item;
    }
    return array[ key ];
}

/**
 * Loops processor
 * @param {Object} context Context
 * @param {Class<Component>} template Component class for insert, if test true
 * @param {Array|Object} array Iterated object or array
 * @param {LoopOptions|null} options Options for component
 */
export default function loop( context, template, array, options ) {
    let transformKey, arrayLength;

    // Get array length, and convert object to array if needed.
    if ( Array.isArray( array ) ) {
        transformKey = transformArrayKey;
        arrayLength = array.length;
    } else {
        const keys = Object.keys( array );
        transformKey = transformObjectKey( keys );
        arrayLength = keys.length;
    }

    const loopItems = context.ref;

    const childrenSize = loopItems.length;

    // If new array contains less items what before, remove surpluses.
    let len = childrenSize - arrayLength;
    for ( let i in loopItems.items ) {
        if ( len-- > 0 ) {
            loopItems.items[ i ].remove();
        } else {
            break;
        }
    }

    // If there is already some views, update there loop state.
    let j = 0;
    for ( let i in loopItems.items ) {
        loopItems.items[ i ].__state__ = buildState( array, transformKey( j ), j, options );
        j++;
    }

    // If new array contains more items when previous, render new views and append them.
    for ( let j = childrenSize; j < arrayLength; j++ ) {
        createComponent(
            context.extend( {
                parent: context.parent,
                container: context.container
            } ),
            template,
            view => {

                // Remember to remove from children loopItems on view remove.
                const i = loopItems.push( view );
                view.onRemove.push(
                    () => loopItems.remove( i )
                );

                // Set view state for later update in onUpdate.
                view.__state__ = buildState( array, transformKey( j ), j, options );
            }
        );
    }
}
