import { renderComponent, expectRenderedHTML } from '../helpers';
import { DI } from '../../src/shamUI';

/**
 * Component for
 * <h1>{{ title }}</h1>
 * <div>
 *   {{ content }}
 * </div>
 * @class
 */
function CustomPanel() {
    __UI__.Component.apply( this, arguments );
    this.__data__ = {};

    // Create elements
    var h10 = document.createElement( 'h1' );
    var text1 = document.createTextNode( '' );
    var div2 = document.createElement( 'div' );
    var text3 = document.createTextNode( '' );

    // Construct dom
    h10.appendChild( text1 );
    div2.appendChild( text3 );

    // Update functions
    this.__update__ = {
        title: function( title ) {
            text1.textContent = title;
        },
        content: function( content ) {
            text3.textContent = content;
        }
    };

    // Set root nodes
    this.nodes = [ h10, div2 ];
}
CustomPanel.prototype = Object.create( __UI__.Component.prototype );
CustomPanel.prototype.constructor = CustomPanel;
CustomPanel.prototype.updateSpots = function( __data__ ) {
    if ( __data__.title !== undefined ) {
        this.__update__.title( __data__.title );
    }
    if ( __data__.content !== undefined ) {
        this.__update__.content( __data__.content );
    }
};


/**
 * Component for <CustomPanel title="string" content="text"/>
 * @class
 */
function custom() {
    __UI__.Component.apply( this, arguments );
    this.__data__ = {};
    var _this = this;

    // Create elements
    var custom0 = document.createComment( 'CustomPanel' );
    var child0 = {};

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
custom.prototype = Object.create( __UI__.Component.prototype );
custom.prototype.constructor = custom;


it( 'render', async() => {
    expect.assertions( 1 );
    await renderComponent( custom );
    expectRenderedHTML( '<h1>string</h1><div>text</div><!--CustomPanel-->' );
} );

it( 're-render', async() => {
    expect.assertions( 1 );
    await renderComponent( custom, {
        ID: 'custom'
    } );
    DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'custom' );
    expectRenderedHTML( '<h1>string</h1><div>text</div><!--CustomPanel-->' );
} );

it( 'destroy', async() => {
    expect.assertions( 1 );
    await renderComponent( custom, {
        ID: 'custom'
    } );
    DI.resolve( 'sham-ui' ).render.unregister( 'custom' );
    expectRenderedHTML( '' );
} );
