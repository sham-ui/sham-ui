import { DI, Widget } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'registration two widgets with same id', async() => {
    expect.assertions( 2 );
    let first, second;
    DI.bind( 'widget-binder', () => {
        first = new Widget( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
        second = new Widget( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
    } );
    await renderApp();
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).toEqual( first );
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).not.toEqual( second );
} );
