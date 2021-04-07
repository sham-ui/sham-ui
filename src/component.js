import setupOptions from './options/setup-for-component';

/**
 * Wrap service methods for pass component as first argument
 * @param {string} serviceName
 * @param {string[]}methods
 * @param {Component} component
 * @inner
 */
function createProxy( serviceName, methods, component ) {
    const proxy = {};
    methods.forEach(
        name => proxy[ name ] = function() {
            const service = component.DI.resolve( serviceName );
            return service[ name ].apply(
                service,

                // Pass component to service method as first argument
                [].concat( component, Array.from( arguments ) )
            );
        }
    );
    return proxy;
}

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
 * Base component class
 * @param {Object} options Options
 * @property {string} ID Component unique ID
 * @property {Element} container Container for component
 * @property {DI} DI
 * @property {Dom} dom
 * @property {Store} UI
 * @property {Hooks} hooks
 */
export default class Component {
    constructor( options ) {
        this.configureOptions();

        setupOptions( this, options );

        // Create proxy methods for pass current component
        this.dom = createProxy(
            'sham-ui:dom',
            [
                'build',
                'el',
                'text',
                'comment',
                'unsafe'
            ],
            this
        );
        this.hooks = createProxy(
            'sham-ui:hooks',
            [
                'hydrate',
                'rehydrate',
                'resolveID'
            ],
            this
        );
        this.UI = this.DI.resolve( 'sham-ui:store' );

        this.ID = this.hooks.resolveID();

        // Set inner props:
        this.__cache__ = {};
        this.__data__ = {};
        this.isRoot = false;

        /**
         * @type {Array<Component>} Array of child components
         */
        this.nested = [];

        /**
         * @type {Array<Element>} Component elements
         */
        this.nodes = [];

        this.UI.byId.set( this.ID, this );
    }

    /**
     *  Hook for configure options without decorator
     */
    configureOptions() {}

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

            // Template compiler provide spots, process
            for ( let spot of spots ) {
                const args = 'number' == typeof spot[ 0 ] ?

                    // Compiler generate bitMask
                    [
                        data,
                        spot[ 0 ],
                        [].concat( spot[ 1 ] ),
                        spot[ 2 ]
                    ] :

                    // Spot without bitMask
                    [
                        data,
                        0,
                        [].concat( spot[ 0 ] ),
                        spot[ 1 ]
                    ];
                this._updateSpot.apply( this, args );
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
     * @param {SpotBitMask} bitMask
     * @param {Array<string>} variables
     * @param {Function|undefined} operation
     * @private
     */
    _updateSpot( data, bitMask, variables, operation ) {
        let params = [];
        if ( variables.length > 1 ) {

            // Spot dependents on several variables: {{a + b}} for example
            params = variables.map(
                variableName => this.__cache__[ variableName ]
            );
        } else {

            // Spot dependent on one or zero variable: {{foo}} for example
            const name = variables[ 0 ];
            const value = variables.length > 0 ?
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

        if ( operation ) {
            operation.apply( this, params );
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

        // Call on remove callback.
        if ( this.onRemove ) {
            this.onRemove();
        }
    }
}
