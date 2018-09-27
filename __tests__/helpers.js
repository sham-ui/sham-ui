import ShamUI, { DI } from '../src/shamUI';

export function renderApp() {
    return new Promise( resolve => {
        const UI = new ShamUI();
        UI.render.one( 'RenderComplete', resolve );
        UI.render.ALL();
    } );
}

export function onRenderComplete( callback ) {
    return new Promise( resolve => {
        const UI = DI.resolve( 'sham-ui' );
        UI.render.one( 'RenderComplete', resolve );
        callback( UI );
    } );
}

export function onEvent( eventName ) {
    return new Promise( resolve => {
        const UI = new ShamUI();
        UI.render.one( eventName, function() {
            resolve( arguments );
        } );
        UI.render.ALL();
    } );
}

export function renderWidget( widgetConstructor, options = {} ) {
    DI.bind( 'widget-binder', function() {
        new widgetConstructor( 'body', 'dummy', options );
    } );
    return renderApp();
}

export function expectRenderedText( expected ) {
    expect( document.querySelector( 'body' ).textContent ).toBe( expected );
}
