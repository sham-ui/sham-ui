/**
 * Main custom tags processor.
 */
export default function insert( parent, node, child/*.ref*/, template, data, owner ) {
    if ( child.ref ) { // If view was already inserted, update or remove it.
        child.ref.update( data );
    } else {

        // Render new view.
        const view = new template( {
            parent,
            owner,
            context: parent.context,
            filters: parent.filters,
            directives: parent.directives,
            container: node
        } );
        view.UI.render.ONLY_IDS( view.ID );

        // Set view hierarchy.
        parent.nested.push( view );

        // Remember to remove child ref on remove of view.
        child.ref = view;
        view.unbind = function() {
            child.ref = null;
        };

        // Set view data (note what it must be after adding nodes to DOM).
        view.update( data );
    }
}
