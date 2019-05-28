import { DI, Component } from '../src/shamUI';
import { onEvent } from './helpers';

beforeEach( () => {
    DI.bind( 'component-binder', () => {
        new Component( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
    } );
} );

afterEach( () => {
    DI.bind( 'component-binder', () => {} );
} );

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

