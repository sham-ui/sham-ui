import nanoid from 'nanoid';
import options from './options/decorator';
import bindOptionsDescriptors from './options/bind-descriptors';
import { inject } from './DI';
import { assertError } from './utils/assert';

/**
 * Base component class
 */
export default class Component {
    @inject( 'sham-ui' ) UI; // inject shamUI instance as this.UI

    /**
     * @type {String[]}
     */
    @options types = [];

    /**
     * @param {Object} [options] Options
     */
    constructor( options ) {
        /**
         * @type {null|Node} Container of this component
         */
        this.container = null;
        this.constructorOptions = options;
        this.configureOptions();
        this.resolveID();
        this.nested = [];
        this.nodes = [];
        this.unbind = null;
        this.onRender = null;
        this.onUpdate = null;
        this.onRemove = null;
        this.filters = this.options.filters || null;
        this.parent = this.options.parent || null;
        this.owner = this.options.owner || null;
        this.directives = this.options.directives || null;
        this.needUpdateAfterRender = 'needUpdateAfterRender' in this.options ?
            this.options.needUpdateAfterRender :
            true;
        this.UI.render.register( this );
    }

    resolveID() {
        const ID = this.options.ID;
        this.ID = 'string' === typeof ID ? ID : nanoid();
    }

    configureOptions() {
        const descriptors = Object.assign(
            {},

            // this._options always set, because base Component class has `types` option
            bindOptionsDescriptors( this, this._options ),
            Object.getOwnPropertyDescriptors( this.constructorOptions )
        );
        this.options = Object.create( null, descriptors );
    }

    /**
     * Query current container by this.containerSelector and save node as this.container
     */
    resolveContainer() {
        if ( undefined === this.options.container ) {
            this.container = document.querySelector( this.options.containerSelector );
        } else {
            this.container = this.options.container;
        }
        assertError(
            `Component ${this.ID} doesn't resolve container. Check container selector`,
            null === this.container || undefined === this.container
        );
    }

    /**
     * @param {String} selector
     * @return {Element|null}
     */
    querySelector( selector ) {
        for ( let i = 0; i < this.nodes.length; i++ ) {
            if ( this.nodes[ i ].matches && this.nodes[ i ].matches( selector ) ) {
                return this.nodes[ i ];
            }
            assertError(
                'Can not use querySelector with non-element nodes on first level.',
                this.nodes[ i ].nodeType === 8 // COMMENT_NODE
            );
            if ( this.nodes[ i ].querySelector ) {
                const element = this.nodes[ i ].querySelector( selector );
                if ( element ) {
                    return element;
                }
            }
        }
        return this.container.querySelector( selector );
    }

    /**
     * Добавить обработчики событий
     */
    bindEvents() {}


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
     * Render component to container
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
        if ( this.needUpdateAfterRender ) {
            this.update();
        } else {
            this.needUpdateAfterRender = true;
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
        assertError(
            'Can not insert child view into parent node. ' +
            'You need append your view first and then update.',
            null === parentNode
        );
        for ( let i = 0, len = this.nodes.length; i < len; i++ ) {
            parentNode.insertBefore( this.nodes[ i ], toNode );
        }
    }

    remove() {

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
            this.UI.render.unregister( this.nested[ i ].ID );
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
