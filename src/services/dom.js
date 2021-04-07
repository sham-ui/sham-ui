/**
 * Inner service for wrap document's methods (create elements, text nodes & comments)
 */
export default class Dom {

    /**
     * Construct dom enabled
     * @param {Component} component
     * @return {boolean}
     */
    //eslint-disable-next-line no-unused-vars
    build( component ) {
        return true;
    }

    /**
     * Create element
     * @param {Component} component
     * @param {string} tagName
     * @return {HTMLElement}
     */
    el( component, tagName ) {
        return document.createElement( tagName );
    }

    /**
     * Create a text node
     * @param {Component} component
     * @param {string} data
     * @return {Text}
     */
    text( component, data ) {
        return document.createTextNode( data );
    }

    /**
     * Create comment node
     * @param {Component} component
     * @param {string} data
     * @return {Comment}
     */
    comment( component, data ) {
        return document.createComment( data );
    }


    /**
     * This function is being used for unsafe `innerHTML` insertion of HTML into DOM.
     * Code looks strange. I know. But it is possible minimalistic implementation of.
     *
     * @param {Comment} component
     * @param root {Element} Node there to insert unsafe html.
     * @param nodes {Array} List of already inserted html nodes for remove.
     * @param html {string} Unsafe html to insert.
     */
    // eslint-disable-next-line no-unused-vars
    unsafe( component, root, nodes, html ) {

    }
}
