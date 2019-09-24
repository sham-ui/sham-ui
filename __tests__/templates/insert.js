import { renderComponent, expectRenderedHTML } from '../helpers';
import { DI } from '../../src/shamUI';

/**
 * Component for
 * <h1>{{ title }}</h1>
 * <div>
 *   {{ content }}
 * </div>
 */
class CustomPanel extends __UI__.Component {
    constructor() {
        super( ...arguments );

        this.__data__ = {};

        // Create elements
        const h10 = document.createElement( 'h1' );
        const text1 = document.createTextNode( '' );
        const div2 = document.createElement( 'div' );
        const text3 = document.createTextNode( '' );

        // Construct dom
        h10.appendChild( text1 );
        div2.appendChild( text3 );

        // Update functions
        this.__update__ = {
            title( title ) {
                text1.textContent = title;
            },
            content( content ) {
                text3.textContent = content;
            }
        };

        // Set root nodes
        this.nodes = [ h10, div2 ];
    }

    updateSpots( __data__ ) {
        if ( __data__.title !== undefined ) {
            this.__update__.title( __data__.title );
        }
        if ( __data__.content !== undefined ) {
            this.__update__.content( __data__.content );
        }
    }
}


/**
 * Component for <CustomPanel title="string" content="text"/>
 * @class
 */
class custom extends __UI__.Component {
    constructor() {
        super( ...arguments );

        this.__data__ = {};
        const _this = this;

        // Create elements
        const custom0 = document.createComment( 'CustomPanel' );
        const child0 = {};

        // Extra render actions
        this.onRender = function() {
            __UI__.insert( _this,
                custom0,
                child0,
                CustomPanel,
                { 'title': 'string', 'content': 'text' } );
        };

        // Set root nodes
        this.nodes = [ custom0 ];
    }
}

it( 'render', () => {
    renderComponent( custom );
    expectRenderedHTML( '<h1>string</h1><div>text</div><!--CustomPanel-->' );
} );

it( 're-render', () => {
    renderComponent( custom, {
        ID: 'custom'
    } );
    DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'custom' );
    expectRenderedHTML( '<h1>string</h1><div>text</div><!--CustomPanel-->' );
} );

it( 'destroy', () => {
    renderComponent( custom, {
        ID: 'custom'
    } );
    const { store } = DI.resolve( 'sham-ui' );
    store.findById( 'custom' ).remove();
    expectRenderedHTML( '' );
} );

it( 'needUpdateAfterRender (issue #42)', () => {
    const originalUpdateSpots = CustomPanel.prototype.updateSpots;
    const updateFn = jest.fn();
    CustomPanel.prototype.updateSpots = function() {
        updateFn();
        originalUpdateSpots.apply( this, arguments );
    };
    renderComponent( custom, {
        ID: 'custom'
    } );
    expect( updateFn ).toHaveBeenCalledTimes( 1 );
    DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'custom' );
    expect( updateFn ).toHaveBeenCalledTimes( 2 );
    CustomPanel.prototype.updateSpots = originalUpdateSpots;
} );


it( 'needUpdateAfterRender work with UI.render', () => {
    const originalUpdateSpots = CustomPanel.prototype.updateSpots;
    const updateFn = jest.fn();
    CustomPanel.prototype.updateSpots = function() {
        updateFn( this.ID );
        originalUpdateSpots.apply( this, arguments );
    };
    renderComponent( custom, {
        ID: 'custom'
    } );
    const customPanelID = updateFn.mock.calls[ 0 ][ 0 ];
    expect( updateFn ).toHaveBeenCalledTimes( 1 );
    DI.resolve( 'sham-ui' ).render.ONLY_IDS( customPanelID );
    expect( updateFn ).toHaveBeenCalledTimes( 2 );
    CustomPanel.prototype.updateSpots = originalUpdateSpots;
} );
