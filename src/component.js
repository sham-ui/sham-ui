import nanoid from 'nanoid';
import { hoistingOptions } from './options/decorator';
import bindOptionsDescriptors from './options/bind-descriptors';
import DI from './di';


/**
 * Spot definition from template compiler
 * Spot it's dynamic part of template: {{a}}, {{a + b}}, variables in {% if %}, {% for %} etc
 * @inner
 * @typedef {Function|ComplexSpot} Spot
 */

/**
 * Complex spot with options
 * @inner
 * @typedef {Object} ComplexSpot
 * @property {Boolean|undefined} loop Spot dependent on data.__index__
 * @property {Boolean|undefined} cache Add variable to cache
 * @property {Boolean|undefined} multiple Spot dependent ov several variables. If undefined, then
 *                                        spot dependent on once variable with same name as this spot
 * @property {Function|undefined} op Operation for update spot
 */


/**
 * Base component class
 * @param {Object} [options] Options
 * @property {string} ID Component unique ID
 */
export default class Component {

    /**
     * @return {Store}
     */
    get UI() {
        return DI.resolve( 'sham-ui:store' );
    }

    constructor( options ) {
        this.configureOptions();
        this.applyOptions( options );
        this.resolveID();
        this.copyFromConstructorArgument( options );

        // Set inner props:
        this.__cache__ = {};
        this.__data__ = {};

        /**
         * @type {Array<Component>} Array of child components
         */
        this.nested = [];

        /**
         * @type {Array<Element>} Component elements
         */
        this.nodes = [];

        /**
         * @type {Element} Container of this component
         */
        this.container = options.container;
        this.UI.registry( this );
    }

    /**
     *  Hook for configure options without decorator
     */
    configureOptions() {}

    /**
     * @private
     * @param options
     */
    applyOptions( options ) {
        hoistingOptions( this );

        const descriptors = Object.assign(
            {},
            bindOptionsDescriptors( this, this._options ),
            Object.getOwnPropertyDescriptors( options )
        );
        this.options = Object.create( null, descriptors );
    }

    /**
     * @private
     */
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

            // Just copy from options
            [
                'parent',
                'owner'
            ].forEach(
                key => this[ key ] = options[ key ]
            );

            // Copy from options or set default
            [
                'directives',
                'filters'
            ].forEach( key => this[ key ] = options[ key ] || {} );

            // Copy from options or parent or default
            this.blocks = options.blocks || (
                this.parent ? this.parent.blocks : {}
            );
        } else {
            this.directives = {};
            this.filters = {};
            this.blocks = {};
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
        const data = Object.assign( {}, this.options, currentData );
        this.__data__ = data;

        const spots = this.spots;
        if ( spots ) {

            // Template compliler provide spots, process
            for ( let name in spots ) {
                this._updateSpot( name, spots[ name ], data );
            }
        }

        // Call on update callback.
        if ( this.onUpdate ) {
            this.onUpdate( data );
        }

        if ( currentData ) {
            Object.defineProperties(
                this.options,
                Object.getOwnPropertyDescriptors( currentData )
            );
        }
        delete this.__data__;
    }

    /**
     * Update one spot
     * @param {string} name
     * @param {Spot} spot
     * @param {Object} data
     * @private
     */
    _updateSpot( name, spot, data ) {
        if ( 'function' === typeof spot ) {

            // Simple spot with function as update function and without any extra params.
            // Transform to ComplexSpot
            spot = { op: spot };
        }
        this._updateComplexSpot( name, spot, data );
    }

    /**
     * Update complex spot: with cache or loop etc
     * @param {string} name
     * @param {ComplexSpot} spot
     * @param {Object} data
     * @private
     */
    _updateComplexSpot( name, spot, data ) {
        if ( spot.multiple ) {

            // Spot dependents on several variables: {{a + b}} for example
            const vars = name.split( '_' );
            const params = [];
            for ( let variableName of vars ) {
                const variableValue = this.__cache__[ variableName ];
                if ( undefined === variableValue ) {

                    // Some variables not in cache, stop iterations and ignore other
                    return;
                }
                params.push( variableValue );
            }

            // All variable in cache, call update spot operation
            spot.op.apply( this, params );
        } else {

            // Spot dependent on once variable: {{foo}} for example
            const value = data[ name ];
            if (
                undefined === value || // Data hasn't value
                ( spot.loop && undefined === data.__index__ ) // Variable from loop, but loop not created
            ) {
                return;
            }

            if ( spot.cache ) {

                // Caching variable
                this.__cache__[ name ] = value;
            }

            if ( spot.op ) {
                spot.op.call( this, value );
            }
        }
    }

    /**
     * Helpers for blocks.
     * Use because this.__data__ can be undefined (after update finished)
     * @return {any}
     * @private
     */
    dataForBlock() {
        return this.__data__ || Object.assign( {}, this._options );
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

        // Call on render callback.
        if ( this.onRender ) {
            this.onRender();
        }
    }

    /**
     * @param {Element} toNode
     * @private
     */
    appendTo( toNode ) {
        for ( let i = 0, len = this.nodes.length; i < len; i++ ) {
            toNode.appendChild( this.nodes[ i ] );
        }
    }

    /**
     * @param {Element} toNode
     * @private
     */
    insertBefore( toNode ) {
        const parentNode = toNode.parentNode;
        for ( let i = 0, len = this.nodes.length; i < len; i++ ) {
            parentNode.insertBefore( this.nodes[ i ], toNode );
        }
    }

    /**
     * Remove & destroy component
     */
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
