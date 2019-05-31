import { renderComponent, expectRenderedHTML } from '../helpers';
import { DI } from '../../src/shamUI';

/**
 * Component for template
 * <h1>{{ title }}</h1>
 * <div>{{ content }}</div>
 * @class
 */
function custom() {
    __UI__.Component.apply( this, arguments );

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
custom.prototype = Object.create( __UI__.Component.prototype );
custom.prototype.constructor = custom;
custom.prototype.updateSpots = function( __data__ ) {
    if ( __data__.title !== undefined ) {
        this.__update__.title( __data__.title );
    }
    if ( __data__.content !== undefined ) {
        this.__update__.content( __data__.content );
    }
};


it( 'render', async() => {
    expect.assertions( 1 );
    await renderComponent( custom, {
        title: 'Text for title',
        content: 'Text for content'
    } );
    expectRenderedHTML( '<h1>Text for title</h1><div>Text for content</div>' );
} );

it( 'querySelector', async() => {
    expect.assertions( 2 );
    await renderComponent( custom, {
        ID: 'custom',
        title: 'Text for title',
        content: 'Text for content'
    } );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'custom' );
    expect( component.querySelector( 'h1' ).textContent ).toBe( 'Text for title' );
    expect( component.querySelector( '.not-exists' ) ).toBe( null );
} );
