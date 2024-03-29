import { renderComponent, expectRenderedHTML } from '../helpers';
import { Component } from '../../src/index';

/**
 * Component for template
 * <h1>{{ title }}</h1>
 * <div>{{ content }}</div>
 */
const custom  = Component( function() {
    this.isRoot = true;

    const dom = this.dom;

    // Create elements
    const h10 = dom.el( 'h1' );
    const text1 = dom.text( '' );
    const div2 = dom.el( 'div' );
    const text3 = dom.text( '' );

    if ( dom.build() ) {

        // Construct dom
        h10.appendChild( text1 );
        div2.appendChild( text3 );
    }

    // Update spot functions
    this.addSpots(
        [
            'title',
            ( title ) => {
                text1.textContent = title;
            }
        ],
        [
            'content',
            ( content ) => {
                text3.textContent = content;
            }
        ]
    );

    // Set root nodes
    this.nodes = [ h10, div2 ];
} );

it( 'render', () => {
    renderComponent( custom, {
        title: 'Text for title',
        content: 'Text for content'
    } );
    expectRenderedHTML( '<h1>Text for title</h1><div>Text for content</div>' );
} );

it( 'querySelector', () => {
    const DI = renderComponent( custom, {
        title: 'Text for title',
        content: 'Text for content'
    }, {
        ID: 'custom'
    } );
    const component = DI.resolve( 'sham-ui:store' ).byId.get( 'custom' );
    expect( component.ctx.container.querySelector( 'h1' ).textContent ).toBe( 'Text for title' );
    expect( component.ctx.container.querySelector( '.not-exists' ) ).toBe( null );
} );
