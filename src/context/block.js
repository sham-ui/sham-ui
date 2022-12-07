/**
 * @param {Component} owner
 * @return {Object}
 */
export function createBlockContext( owner ) {
    return owner.ctx.extend( {
        resetOwner() {},
        setup( parent, container ) {
            return Object.assign( this, {
                parent,
                container,

                // Resolve owner before insert block component, because in call from
                // component constructor owner may be no resolved
                owner: owner.isRoot ?
                    owner :
                    owner.ctx.owner
            } );
        }
    } );
}
