import { start, createDI } from '../src/index';

export function renderComponent( componentConstructor, options = {} ) {
    const DI = 'DI' in options ?
        options.DI :
        createDI();
    new componentConstructor( {
        ID: 'dummy',
        container: document.querySelector( 'body' ),
        DI,
        ...options
    } );
    start( DI );
    return DI;
}

export function expectRenderedText( expected ) {
    expect( document.querySelector( 'body' ).textContent ).toBe( expected );
}


export function expectRenderedHTML( expected ) {
    expect( document.querySelector( 'body' ).innerHTML ).toBe( expected );
}
