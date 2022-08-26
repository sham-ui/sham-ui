import { Component } from '../src/index';
import { renderComponent } from './helpers';

it( 'remove', () => {
    const DI = renderComponent( Component( function() {
        this.isRoot = true;
    } ) );
    const store = DI.resolve( 'sham-ui:store' );
    store.byId.get( 'dummy' ).remove();
    expect( store.byId.get( 'dummy' ) ).toBe( undefined );
} );
