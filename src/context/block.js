/**
 * @param {Component} owner
 * @return {Object}
 */
export function createBlockContext( owner ) {
    return owner.ctx.extend( {
        owner: owner.isRoot ?
            owner :
            owner.ctx.owner,
        resetOwner() {},
        setup( parent, container ) {
            return Object.assign( this, { parent, container } );
        }
    } );
}
