import nanoid from 'nanoid';
import { hoistingOptions } from './options/decorator';
import bindOptionsDescriptors from './options/bind-descriptors';
import DI from './di';

/**
 * Base component class
 */
export default class Component {

    /**
     * @return {Store}
     */
    get UI() {
        return DI.resolve( 'sham-ui:store' );
    }

    /**
     * @param {Object} [options] Options
     */
    constructor( options ) {
        this.configureOptions();
        this.applyOptions( options );
        this.resolveID();
        this.copyFromConstructorArgument( options );
        this.nested = [];
        this.nodes = [];

        /**
         * @type {null|Element} Container of this component
         */
        this.container = options.container;
        this.UI.registry( this );
    }

    /**
     *  Hook for configure options without decorator
     */
    configureOptions() {}

    applyOptions( options ) {
        hoistingOptions( this );

        const descriptors = Object.assign(
            {},
            bindOptionsDescriptors( this, this._options ),
            Object.getOwnPropertyDescriptors( options )
        );
        this.options = Object.create( null, descriptors );
    }

    resolveID() {
        const ID = this.options.ID;
        this.ID = 'string' === typeof ID ? ID : nanoid();
    }

    /**
     * Copy some keys from constructor argument to instance
     * @param [options]
     */
    copyFromConstructorArgument( options ) {
        if ( options ) {
            [
                'filters',
                'parent',
                'owner',
                'directives'
            ].forEach(
                key => this[ key ] = options[ key ]
            );
        }
    }

    /**
     * Hook for extra data after render & update
     */
    didMount() {}


    /**
     * Update component state
     * @param {Object}  currentData
     */
    update( currentData ) {
        const data = this.buildDataForUpdate( currentData );
        this.updateSpots( data );
        this.refineOptions( currentData );
        delete this.__data__;
    }

    /**
     * Build & save internal state
     * @protected
     * @param {*} currentData
     * @return {Object}
     */
    buildDataForUpdate( currentData ) {
        this.__data__ = Object.assign( {}, this.options, currentData );
        return this.__data__;
    }

    /**
     * Update spots & call onUpdate. Generate in sham-ui-templates
     * @protected
     * @param {Object} data
     */
    updateSpots() {}

    /**
     * Update options with data
     * @protected
     * @param {*} currentData
     */
    refineOptions( currentData ) {
        if ( currentData ) {
            Object.defineProperties(
                this.options,
                Object.getOwnPropertyDescriptors( currentData )
            );
        }
    }

    /**
     * Mount component to container element
     */
    render() {
        const node = this.container;

        // COMMENT_NODE
        if ( node.nodeType === 8 ) {
            this.insertBefore( node );
        } else {
            this.appendTo( node );
        }

        if ( this.onRender ) {
            this.onRender();
        }
    }

    /**
     * @param {Element} toNode
     */
    appendTo( toNode ) {
        for ( let i = 0, len = this.nodes.length; i < len; i++ ) {
            toNode.appendChild( this.nodes[ i ] );
        }
    }

    /**
     * @param {Element} toNode
     */
    insertBefore( toNode ) {
        const parentNode = toNode.parentNode;
        if ( null === parentNode ) {
            throw new Error(
                'Can not insert child view into parent node. ' +
                'You need append your view first and then update.'
            );
        }
        for ( let i = 0, len = this.nodes.length; i < len; i++ ) {
            parentNode.insertBefore( this.nodes[ i ], toNode );
        }
    }

    remove() {
        this.UI.unregistry( this );

        // Remove appended nodes.
        let i = this.nodes.length;
        while ( i-- ) {
            this.nodes[ i ].parentNode.removeChild( this.nodes[ i ] );
        }

        // Remove self from parent's children map or child ref.
        if ( this.unbind ) {
            this.unbind();
        }

        // Remove all nested views.
        i = this.nested.length;
        while ( i-- ) {
            this.nested[ i ].remove();
        }

        // Remove this view from parent's nested views.
        if ( this.parent ) {
            i = this.parent.nested.indexOf( this );
            this.parent.nested.splice( i, 1 );
            this.parent = null;
        }

        // Call on remove callback.
        if ( this.onRemove ) {
            this.onRemove();
        }
    }
}
