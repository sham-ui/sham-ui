import { renderComponent, expectRenderedHTML } from '../helpers';
import { DI } from '../../src/index';

/**
 * Component for template
 * <h1>{{ title }}</h1>
 * <div>{{ content }}</div>
 */
class custom extends __UI__.Component {
    constructor() {
        super( ...arguments );

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

it( 'render', () => {
    renderComponent( custom, {
        title: 'Text for title',
        content: 'Text for content'
    } );
    expectRenderedHTML( '<h1>Text for title</h1><div>Text for content</div>' );
} );

it( 'querySelector', () => {
    renderComponent( custom, {
        ID: 'custom',
        title: 'Text for title',
        content: 'Text for content'
    } );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'custom' );
    expect( component.container.querySelector( 'h1' ).textContent ).toBe( 'Text for title' );
    expect( component.container.querySelector( '.not-exists' ) ).toBe( null );
} );
