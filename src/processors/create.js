/**
 * @inner
 * @param {Object} context Context
 * @param {Class<Component>} template Component class for insert, if test true
 * @param {Function} afterInstance
 * @param {Object} [data]
 */
export function createComponent( context, template, afterInstance, data ) {

    // Render new view.
    const view = new template( context );

    // Resolve owner
    if ( !context.owner ) {
        context.owner = view.isRoot ?
            view :
            context.parent.ctx.owner
        ;
    }

    view.render();

    // Set view hierarchy.
    context.parent.nested.push( view );

    // Process extra after instance handler
    afterInstance( view, context );

    // Rehydrate component
    view.hooks.rehydrate();

    if ( data ) {

        // Set view data (note what it must be after adding nodes to DOM).
        view.updateState( data );
    }

    // Call hook
    view.didMount();
}

/**
 * @inner
 * @param {Component} view
 * @param {Object} context
 */
export function saveRef( view, context ) {

    // Remember to remove child ref on remove of view.
    context.ref = view;
    view.onRemove.push( () => context.ref = null );
}
