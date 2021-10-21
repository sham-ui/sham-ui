import setupOptions from './options/setup-for-component';
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
 * Update component state
 * @callback updateCallback
 * @param {Object.<string, *>} data
 */

/**
 * Registry function on component didMount hook.
 * Param callback will call after component render & update
 * @callback didMountCallback
 * @param {Function} callback
 */

/**
 * Registry function on component onRemove hook
 * Param callback will call after component remove
 * @callback onRemoveCallback
 * @param {Function} callback
 */

/**
 * Constructor function for component
 * @callback componentConstructor
 * @param {optionsCallback} options
 * @param {updateCallback} update
 * @param {didMountCallback} didMount
 * @param {onRemoveCallback} onRemove
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
     * @param {Object} options Options
     * @property {string} ID Component unique ID
     * @property {Element} container Container for component
     * @property {DI} DI
     * @property {Dom} dom
     * @property {Store} UI
     * @property {Hooks} hooks
     */
    return class Component {
        constructor( options ) {
            setupOptions( this, options );
            setupProxy( this );

            this.UI = this.DI.resolve( 'sham-ui:store' );

            this.ID = this.hooks.resolveID();

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

            // Set inner props:
            this.__cache__ = {};
            this.__data__ = {};
            this.isRoot = false;

            this.UI.byId.set( this.ID, this );

            // Callback "options" for pass to constructor
            const optionsCallback = options => setDefaultOptions( this.options, options || {} );

            // Callback "update" for pass to constructor
            const updateCallback = this.update.bind( this );

            // Callback "didMount" for pass to constructor
            const didMountCallback = callback => this.onMount.push( callback );

            // Callback "onRemove" for pass to constructor
            const onRemoveCallback = callback => this.onRemove.push( callback );

            // Call all constructors passed to factory
            constructors.forEach(
                constructor => constructor.call(
                    this,
                    optionsCallback,
                    updateCallback,
                    didMountCallback,
                    onRemoveCallback
                )
            );

            // Call hook for extra processing
            this.hooks.create();
        }

        /**
         * Hook for extra data after render & update
         */
        didMount() {

            // Call callbacks from factory
            this.onMount.forEach( callback => callback() );
        }

        /**
         * Update component state
         * @param {Object}  currentData
         */
        update( currentData ) {
            const data = Object.assign( {}, this.options, currentData );
            this.__data__ = data;

            const spots = this.spots;
            if ( spots ) {

                // Template compiler provide spots, process
                for ( let spot of spots ) {

                    // bitMask must be last
                    const last = spot[ spot.length - 1 ];
                    this._updateSpot(
                        data,
                        [].concat( spot[ 0 ] ),
                        spot[ 1 ],
                        'number' === typeof  last ?
                            last :
                            0
                    );
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
         * Use because this.__data__ can be undefined (after update finished)
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
                const node = this.container;

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
            if ( this.parent ) {
                this.parent.nested.splice(
                    this.parent.nested.indexOf( this ),
                    1
                );
                this.parent = null;
            }

            // Call callbacks from factory
            this.onRemove.forEach( callback => callback() );
        }
    };
}
