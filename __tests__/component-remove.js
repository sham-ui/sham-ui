import { Component, DI } from '../src/shamUI';
import { renderComponent, renderApp } from './helpers';

it( 'remove', async() => {
    expect.assertions( 2 );
    await renderComponent( Component, {
        types: [ 'label' ]
    } );
    DI.resolve( 'sham-ui' ).render.unregister( 'dummy' );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBe( undefined );
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
} );

it( 'remove one', async() => {
    expect.assertions( 4 );
    DI.bind( 'component-binder', () => {
        class SelfDestroyedComponent extends Component {
            render() {
                super.render( ...arguments );
                this.UI.render.unregister( this.ID );
            }
        }
        new SelfDestroyedComponent( {
            ID: 'first',
            containerSelector: 'body',
            types: [ 'label' ]
        } );
        new Component( {
            ID: 'second',
            containerSelector: 'body',
            types: [ 'link', 'label' ]
        } );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'first' ) ).toBeUndefined();
    expect( store.findById( 'second' ).ID ).toBe( 'second' );
    expect( store.filterByType( 'label' ) ).toHaveLength( 1 );
    expect( store.filterByType( 'link' ) ).toHaveLength( 1 );
} );

it( 'remove non exists component', async() => {
    expect.assertions( 1 );
    await renderComponent( Component );
    DI.resolve( 'sham-ui' ).render.unregister( 'non-exists' );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBeInstanceOf( Component );
} );

it( 'modify type after registry', async() => {
    expect.assertions( 3 );
    const typesMock = jest.fn()
        .mockReturnValueOnce( [ 'label' ] )
        .mockReturnValueOnce( [ 'link' ] );
    await renderComponent( Component, {
        get types() {
            return typesMock();
        }
    } );
    DI.resolve( 'sham-ui' ).render.unregister( 'dummy' );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBeUndefined();
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
    expect( store.filterByType( 'link' ) ).toHaveLength( 0 );
} );
