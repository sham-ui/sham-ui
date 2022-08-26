/**
 * @param {Component} parent
 * @param {Element} container
 * @param {Object} blocks
 * @return {Object}
 */
export function createChildContext( parent, container, blocks ) {
    const extra = {
        parent,
        container
    };
    if ( blocks ) {
        extra.blocks = blocks;
    }
    return parent.ctx.extend( extra );
}
