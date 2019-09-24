function transformArray( array, keys, i, options ) {
    if ( options ) {
        const t = { __index__: i };
        t[ options.value ] = array[ i ];

        if ( options.key ) {
            t[ options.key ] = i;
        }

        return t;
    } else {
        return array[ i ];
    }
}

function transformObject( array, keys, i, options ) {
    if ( options ) {
        const t = { __index__: i };
        t[ options.value ] = array[ keys[ i ] ];

        if ( options.key ) {
            t[ options.key ] = keys[ i ];
        }

        return t;
    } else {
        return array[ keys[ i ] ];
    }
}


/**
 * Simple Map implementation with length property.
 */
export class Map {
    constructor() {
        this.items = Object.create( null );
        this.length = 0;
        this.next = 0;
    }

    push( element ) {
        this.items[ this.next ] = element;
        this.length += 1;
        this.next += 1;
        return this.next - 1;
    }

    remove( i ) {
        if ( i in this.items ) {
            delete this.items[ i ];
            this.length -= 1;
        } else {
            throw new Error( `You are trying to delete not existing element "${i}" form map.` );
        }
    }

    forEach( callback ) {
        for ( var i in this.items ) {
            callback( this.items[ i ] );
        }
    }
}

/**
 * Main loops processor.
 */
export default function loop( parent, node, map, template, array, options, owner ) {
    let i, j, len, keys, transform, arrayLength, childrenSize = map.length;

    // Get array length, and convert object to array if needed.
    if ( Array.isArray( array ) ) {
        transform = transformArray;
        arrayLength = array.length;
    } else {
        transform = transformObject;
        keys = Object.keys( array );
        arrayLength = keys.length;
    }

    // If new array contains less items what before, remove surpluses.
    len = childrenSize - arrayLength;
    for ( i in map.items ) {
        if ( len-- > 0 ) {
            map.items[ i ].remove();
        } else {
            break;
        }
    }

    // If there is already some views, update there loop state.
    j = 0;
    for ( i in map.items ) {
        map.items[ i ].__state__ = transform( array, keys, j, options );
        j++;
    }

    // If new array contains more items when previous, render new views and append them.
    for ( j = childrenSize, len = arrayLength; j < len; j++ ) {

        // Render new view.
        const view = new template( {
            parent,
            owner,
            filters: parent.filters,
            directives: parent.directives,
            container: node,
            needUpdateAfterRender: false
        } );
        view.UI.render.ONLY_IDS( view.ID );

        // Set view hierarchy.
        parent.nested.push( view );

        // Remember to remove from children map on view remove.
        i = map.push( view );
        view.unbind = (
            function( i ) {
                return function() {
                    map.remove( i );
                };
            }
        )( i );

        // Set view state for later update in onUpdate.
        view.__state__ = transform( array, keys, j, options );
    }
}
