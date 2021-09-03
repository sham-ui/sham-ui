/**
 * If condition processor.
 * @param {Component|null} parent Parent component
 * @param {Element} container Container node
 * @param {Object} child Reference to this component
 * @param {Class<Component>} template Component class for insert, if test true
 * @param {boolean} test Condition test
 * @param {Component} owner Owner of inserting component
 * @return {boolean} test result
 */
export default function cond( parent, container, child/*.ref*/, template, test, owner ) {
    if ( child.ref ) { // If view was already inserted, update or remove it.
        if ( !test ) {
            child.ref.remove();
        }
    } else if ( test ) {

        // Render new view.
        const view = new template( {
            parent,
            owner,
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

        // Call hook
        view.didMount();
    }
    return test;
}
