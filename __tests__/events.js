import ShamUI, { DI, Widget } from '../src/shamUI';

beforeEach( () => {
    DI.bind( 'widget-binder', () => {
        new Widget( 'body', 'dummy' );
    } );
} );

afterEach( () => {
    DI.bind( 'widget-binder', () => {} );
} );

function onEvent( eventName ) {
    return new Promise( resolve => {
        const UI = new ShamUI();
        UI.render.one( eventName, function() {
            resolve( arguments );
        } );
        UI.render.ALL();
    } );
}

it( 'RenderComplete', async() => {
    expect.assertions( 2 );
    const args = await onEvent( 'RenderComplete' );
    expect( args ).toHaveLength( 1 );
    expect( args[ 0 ] ).toEqual( [ 'dummy' ] );
} );

it( 'Ready', async() => {
    expect.assertions( 1 );
    const args = await onEvent( 'Ready' );
    expect( args ).toHaveLength( 0 );
} );

it( 'RegistrationComplete', async() => {
    expect.assertions( 1 );
    const args = await onEvent( 'RegistrationComplete' );
    expect( args ).toHaveLength( 0 );
} );

it( 'RenderComplete (only once widget)', async() => {
    expect.assertions( 2 );
    const args = await onEvent( 'RenderComplete[dummy]' );
    expect( args ).toHaveLength( 1 );
    expect( args[ 0 ] ).toBe( 'dummy' );
} );
