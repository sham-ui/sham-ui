import { createRootContext, start, createDI } from '../src/index';

export function renderComponent( componentConstructor, options = {}, extraContext = {} ) {
    const DI = 'DI' in extraContext ?
        extraContext.DI :
        createDI();
    const context = createRootContext( {
        DI,
        ID: 'dummy',
        container: document.querySelector( 'body' ),
        ...extraContext
    } );
    new componentConstructor( context, options );
    start( DI );
    return DI;
}

export function expectRenderedText( expected ) {
    expect( document.querySelector( 'body' ).textContent ).toBe( expected );
}


export function expectRenderedHTML( expected ) {
    expect( document.querySelector( 'body' ).innerHTML ).toBe( expected );
}
