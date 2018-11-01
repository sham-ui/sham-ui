/**
 * Main if processor.
 */
export default function cond( parent, node, child/*.ref*/, template, test ) {
    if ( child.ref ) { // If view was already inserted, update or remove it.
        if ( !test ) {
            child.ref.remove();
        }
    } else if ( test ) {

        // Render new view.
        const view = new template( {
            parent,
            context: parent.context,
            filters: parent.filters,
            directives: parent.directives,
            container: node
        } );
        view.UI.render.ONLY( view.ID );

        // Set view hierarchy.
        parent.nested.push( view );

        // Remember to remove child ref on remove of view.
        child.ref = view;
        view.unbind = function() {
            child.ref = null;
        };
    }
    return test;
}
