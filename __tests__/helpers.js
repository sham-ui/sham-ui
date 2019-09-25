import { start } from '../src/index';

export function renderComponent( componentConstructor, options = {} ) {
    new componentConstructor( {
        ID: 'dummy',
        container: document.querySelector( 'body' ),
        ...options
    } );
    start();
}

export function expectRenderedText( expected ) {
    expect( document.querySelector( 'body' ).textContent ).toBe( expected );
}


export function expectRenderedHTML( expected ) {
    expect( document.querySelector( 'body' ).innerHTML ).toBe( expected );
}
