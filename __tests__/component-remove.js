import { Component, DI } from '../src/shamUI';
import { renderComponent, renderApp } from './helpers';

it( 'remove', async() => {
    expect.assertions( 1 );
    await renderComponent( Component );
    DI.resolve( 'sham-ui' ).render.unregister( 'dummy' );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBe( undefined );
} );

it( 'remove one', async() => {
    expect.assertions( 2 );
    DI.bind( 'component-binder', () => {
        class SelfDestroyedComponent extends Component {
            render() {
                super.render( ...arguments );
                this.UI.render.unregister( this.ID );
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
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'first' ) ).toBeUndefined();
    expect( store.findById( 'second' ).ID ).toBe( 'second' );
} );

it( 'remove non exists component', async() => {
    expect.assertions( 1 );
    await renderComponent( Component );
    DI.resolve( 'sham-ui' ).render.unregister( 'non-exists' );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBeInstanceOf( Component );
} );
