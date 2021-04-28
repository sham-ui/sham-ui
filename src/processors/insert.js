/**
 * Custom tags processor.
 * @param {Component|null} parent Parent component
 * @param {Element} container Container node
 * @param {Object} child Reference to this component
 * @param {Class<Component>} template Component class for insert, if test true
 * @param {Object} data Options for component
 * @param {Component} owner Owner of inserting component
 * @param {Object} [blocks] Object with block mountings map
 */
export default function insert( parent, container, child/*.ref*/, template, data, owner, blocks ) {
    if ( child.ref ) { // If view was already inserted, update or remove it.
        child.ref.update( data );
    } else {

        // Render new view.
        const view = new template( {
            parent,
            owner,
            blocks,
            container
        } );
        view.render();

        // Set view hierarchy.
        parent.nested.push( view );

        // Remember to remove child ref on remove of view.
        child.ref = view;
        view.unbind = function() {
            child.ref = null;
        };

        // Rehydrate component
        view.hooks.rehydrate();

        // Set view data (note what it must be after adding nodes to DOM).
        view.update( data );

        // Call hook
        view.didMount();

        // Hydrate component
        view.hooks.hydrate();
    }
}
