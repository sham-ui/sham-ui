import { Component, DI, start } from '../src/index';
import { renderComponent } from './helpers';

it( 'remove', () => {
    renderComponent( Component );
    const store = DI.resolve( 'sham-ui:store' );
    store.findById( 'dummy' ).remove();
    expect( store.findById( 'dummy' ) ).toBe( undefined );
} );

it( 'remove one', () => {
    class SelfDestroyedComponent extends Component {
        render() {
            super.render( ...arguments );
            this.remove();
        }
    }
    new SelfDestroyedComponent( {
        ID: 'first',
        container: document.querySelector( 'body' )
    } );
    new Component( {
        ID: 'second',
        container: document.querySelector( 'body' )
    } );
    start();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'first' ) ).toBeUndefined();
    expect( store.findById( 'second' ).ID ).toBe( 'second' );
} );
