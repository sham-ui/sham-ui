import { DI, Component } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'registration two components with same id', async() => {
    expect.assertions( 2 );
    let first, second;
    DI.bind( 'component-binder', () => {
        first = new Component( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
        second = new Component( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
    } );
    await renderApp();
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).toEqual( first );
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).not.toEqual( second );
} );
