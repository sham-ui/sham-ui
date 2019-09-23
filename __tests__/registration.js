import { DI, Component } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'registration two components with same id', async() => {
    expect.assertions( 2 );
    let first, second;
    DI.bind( 'component-binder', () => {
        first = new Component( {
            ID: 'dummy',
            container: document.querySelector( 'body' )
        } );
        second = new Component( {
            ID: 'dummy',
            container: document.querySelector( 'body' )
        } );
    } );
    await renderApp();
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).toBe( first );
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).not.toBe( second );
} );
