import { Component, start, createDI } from '../src/index';
import { renderComponent } from './helpers';

it( 'remove', () => {
    const DI = renderComponent( Component() );
    const store = DI.resolve( 'sham-ui:store' );
    store.byId.get( 'dummy' ).remove();
    expect( store.byId.get( 'dummy' ) ).toBe( undefined );
} );

it( 'remove one', () => {
    const DI = createDI();

    class SelfDestroyedComponent extends Component() {
        render() {
            super.render( ...arguments );
            this.remove();
        }
    }

    new SelfDestroyedComponent( {
        DI,
        ID: 'first',
        container: document.querySelector( 'body' )
    } );
    new( Component() )( {
        DI,
        ID: 'second',
        container: document.querySelector( 'body' )
    } );
    start( DI );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.byId.get( 'first' ) ).toBeUndefined();
    expect( store.byId.get( 'second' ).ID ).toBe( 'second' );
} );
