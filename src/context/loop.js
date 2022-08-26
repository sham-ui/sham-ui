/**
 * @param {Component} parent
 * @param {Element} container
 * @return {*}
 */
export function createLoopContext( parent, container ) {
    return parent.ctx.extend( {
        parent,
        container,
        ref: loopItems()
    } );
}

/**
 * Simple Map implementation with length property.
 * @inner
 */
function loopItems( ) {
    const items = Object.create( null );
    let next = 0;

    return {
        items,
        length: 0,
        push( element ) {
            items[ next ] = element;
            this.length += 1;
            next += 1;
            return next - 1;
        },
        remove( i ) {
            if ( i in items ) {
                delete items[ i ];
                this.length -= 1;
            }
        },
        updateState( data ) {
            for ( let i in items ) {
                const item = items[ i ];
                item.updateState(
                    Object.assign( {}, data, item.__state__ )
                );
            }
        }
    };
}
