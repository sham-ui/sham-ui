/**
 * Main if processor.
 */
export default function cond( parent, node, child/*.ref*/, template, test, owner ) {
    if ( child.ref ) { // If view was already inserted, update or remove it.
        if ( !test ) {
            child.ref.remove();
        }
    } else if ( test ) {

        // Render new view.
        const view = new template( {
            parent,
            owner,
            filters: parent.filters,
            directives: parent.directives,
            container: node
        } );
        view.render();

        // Set view hierarchy.
        parent.nested.push( view );

        // Remember to remove child ref on remove of view.
        child.ref = view;
        view.unbind = function() {
            child.ref = null;
        };

        // Call hook
        view.didMount();
    }
    return test;
}
