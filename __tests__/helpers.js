import ShamUI from '../src/shamUI';

export function renderApp( initializer ) {
    const UI = new ShamUI();
    initializer();
    UI.render.ALL();
}

export function renderComponent( componentConstructor, options = {} ) {
    return renderApp( () => {
        new componentConstructor( {
            ID: 'dummy',
            container: document.querySelector( 'body' ),
            ...options
        } );
    } );
}

export function expectRenderedText( expected ) {
    expect( document.querySelector( 'body' ).textContent ).toBe( expected );
}


export function expectRenderedHTML( expected ) {
    expect( document.querySelector( 'body' ).innerHTML ).toBe( expected );
}
