import setDefaultOptions from './options/set-default';
import setupProxy from './proxy/setup-for-component';

/**
 * Bit mask for spot
 * @inner
 * @typedef {number} SpotBitMask
 */

/**
 * Add variable to cache
 * @inner
 * @type {SpotBitMask}
 */
const SPOT_CACHE = 1 << 0;

/**
 * Spot dependent on data.__index__
 * @inner
 * @type {SpotBitMask}
 */
const SPOT_LOOP = 1 << 1;

/**
 * Spot definition from template compiler
 * Spot it's dynamic part of template: {{a}}, {{a + b}}, variables in {% if %}, {% for %} etc
 * @inner
 * @typedef {Array} Spot
 * @property {SpotBitMask} 0 Spot options
 * @property {Array<string>|string} 1 Variables for spots
 * @property {Function|undefined} 2 Operation for update spot
 */


/**
 * Setup default component state
 * Return reference to component state
 * @callback optionsCallback
 * @param {Object.<string, *>} defaultState
 * @return {Object.<string, *>}
 */

/**
 * Registry function on component didMount hook.
 * Param callback will call after component render & update
 * @callback didMountCallback
 * @param {Function} callback
 * @return {onRemoveCallback|undefined}
 */

/**
 * Registry function on component onRemove hook
 * Param callback will call after component remove
 * @callback onRemoveCallback
 * @param {Function} callback
 */

/**
 * Registry function on component didReceive hook.
 * Param callback will call after component receive new state update from outer components
 * @callback didReceiveCallback
 * @param {Function} callback
 */


/**
 * Constructor function for component
 * @callback componentConstructor
 * @param {optionsCallback} options
 * @param {didMountCallback} didMount
 * @param {didReceiveCallback} didReceive
 * @this {Component}
 */


/**
 * Factory for create new component
 * @param {...componentConstructor} [constructors]
 * @return {Component.constructor}
 */
export default function ComponentFactory( ...constructors ) {

    /**
     * Base component class
     * @param {Object} context Context
     * @param {Object} [options] Default options
     * @property {Object} ctx Context
     * @property {string} ID Component unique ID
     * @property {Dom} dom
     * @property {Store} UI
     * @property {Hooks} hooks
     */
    return class Component {
        constructor( context, options = {} ) {
            this.ctx = context;

            setupProxy( this );

            // Create proxy function
            const stateProxy = newState => this.updateState( newState );

            this.options = setDefaultOptions( {}, options, stateProxy );

            this.UI = this.ctx.DI.resolve( 'sham-ui:store' );

            this.ID = this.hooks.resolveID();

            /**
             * @inner
             * @type {Array<Spot>}
             */
            this.spots = [];

            /**
             * @type {Array<Component>} Array of child components
             */
            this.nested = [];

            /**
             * @type {Array<Element>} Component elements
             */
            this.nodes = [];

            /**
             * @inner
             * @type {Array<Function>}
             */
            this.onMount = [];

            /**
             * @inner
             * @type {Array<Function>}
             */
            this.onRemove = [];

            /**
             * @inner
             * @type {Array<Function>}
             */
            this.onReceive = [];

            // Set inner props:
            this.__cache__ = {};
            this.isRoot = false;

            this.UI.byId.set( this.ID, this );


            // Call all constructors passed to factory
            constructors.forEach(
                constructor => constructor.call(
                    this,

                    // Callback "options" for pass to constructor
                    options => {
                        setDefaultOptions( this.options, options || {}, stateProxy );
                        return stateProxy;
                    },

                    // Callback "didMount" for pass to constructor
                    callback => this.onMount.push( callback ),

                    // Callback "didReceive" for pass to constructor
                    callback => this.onReceive.push( callback )
                )
            );

            // Call hook for extra processing
            this.hooks.create();
        }

        /**
         * Hook for extra processing after render & update
         */
        didMount() {

            // Call callbacks from factory
            this.onMount.forEach( callback => {
                const onRemove = callback();

                // If didMount return function, then registry that as onRemove callback
                if ( onRemove ) {
                    this.onRemove.push( onRemove );
                }
            } );
        }

        /**
         * Add new spot
         * @inner
         * @param {...Spot} spots
         */
        addSpots( ...spots ) {
            this.spots.push( ...spots );
        }

        /**
         * Update component state & call hooks
         * @param {Object}  currentData
         */
        update( currentData ) {
            this.updateState( currentData );

            // Call callbacks from factory
            this.onReceive.forEach( callback => callback() );
        }

        /**
         * Update component state
         * @inner
         * @param {Object}  currentData
         */
        updateState( currentData ) {
            const data = Object.assign( {}, this.options, currentData );
            this.__data__ = data;

            // Process spots provided by compiler or manual added
            for ( let spot of this.spots ) {

                // bitMask must be last
                const last = spot[ spot.length - 1 ];
                this._updateSpot(
                    data,
                    [].concat( spot[ 0 ] ),
                    spot[ 1 ],
                    'number' === typeof last ?
                        last :
                        0
                );
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
         * @param {Object} data
         * @param {Array<string>} variables
         * @param {*} operation
         * @param {SpotBitMask} bitMask
         * @private
         */
        _updateSpot( data, variables, operation, bitMask ) {
            let params = [];
            if ( variables.length > 1 ) {

                // Spot dependents on several variables: {{a + b}} for example
                params = variables.map(
                    variableName => this.__cache__[ variableName ]
                );
            } else {

                // Spot dependent on one or zero variable: {{foo}} for example
                const name = variables[ 0 ];
                const value = variables.length === 1 ?
                    data[ name ] :
                    null
                ;
                if (
                    undefined === value || // Data hasn't value
                    ( ( bitMask & SPOT_LOOP ) && undefined === data.__index__ ) // Variable from loop, but loop not created
                ) {
                    return;
                }

                if ( bitMask & SPOT_CACHE ) {

                    // Caching variable
                    this.__cache__[ name ] = value;
                }
                params = [ value ];
            }

            if ( operation && operation.apply ) {
                operation.apply( this, params );
            }
        }

        /**
         * Helpers for blocks.
         * Use because this.__data__ can be undefined (before update or after update finished)
         * @param {Object} blockData
         * @return {any}
         * @private
         */
        _dataForBlock( blockData ) {
            const ownerData = this.__data__ || Object.assign( {}, this.options );
            return Object.assign( blockData, ownerData );
        }

        /**
         * Mount component to container element
         */
        render() {
            if ( this.dom.build() ) {
                const node = this.ctx.container;

                // COMMENT_NODE
                if ( node.nodeType === 8 ) {
                    const parentNode = node.parentNode;
                    for ( let i = 0, len = this.nodes.length; i < len; i++ ) {
                        parentNode.insertBefore( this.nodes[ i ], node );
                    }
                } else {
                    for ( let i = 0, len = this.nodes.length; i < len; i++ ) {
                        node.appendChild( this.nodes[ i ] );
                    }
                }
            }

            // Call on render callback.
            if ( this.onRender ) {
                this.onRender();
            }
        }

        /**
         * Remove & destroy component
         */
        remove() {
            this.UI.byId.delete( this.ID );

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
            const parent = this.ctx.parent;
            if ( parent ) {
                parent.nested.splice(
                    parent.nested.indexOf( this ),
                    1
                );
            }

            // Call callbacks from factory
            this.onRemove.forEach( callback => callback() );

            this.ctx.resetOwner();
            this.ctx = null;
        }
    };
}
