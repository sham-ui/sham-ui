import { Widget, DI } from '../src/shamUI';
import { renderWidget, renderApp } from './helpers';

it( 'remove', async() => {
    expect.assertions( 4 );
    const beforeRemove = jest.fn();
    const afterRemove = jest.fn();
    await renderWidget( Widget, {
        types: [ 'label' ],
        beforeRemove,
        afterRemove,
        afterRender() {
            this.UI.render.unregister( this.ID );
        }
    } );
    expect( beforeRemove ).toHaveBeenCalled();
    expect( afterRemove ).toHaveBeenCalled();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBe( undefined );
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
} );

it( 'remove one', async() => {
    expect.assertions( 8 );
    const beforeRemoveFirst = jest.fn();
    const beforeRemoveSecond = jest.fn();
    const afterRemoveFirst = jest.fn();
    const afterRemoveSecond = jest.fn();
    DI.bind( 'widget-binder', () => {
        new Widget( {
            ID: 'first',
            containerSelector: 'body',
            types: [ 'label' ],
            beforeRemove: beforeRemoveFirst,
            afterRemove: afterRemoveFirst,
            afterRender() {
                this.UI.render.unregister( this.ID );
            }
        } );
        new Widget( {
            ID: 'second',
            containerSelector: 'body',
            types: [ 'link', 'label' ],
            beforeRemove: beforeRemoveSecond,
            afterRemove: afterRemoveSecond
        } );
    } );
    await renderApp();
    expect( beforeRemoveFirst ).toHaveBeenCalled();
    expect( afterRemoveFirst ).toHaveBeenCalled();
    expect( beforeRemoveSecond ).toHaveBeenCalledTimes( 0 );
    expect( afterRemoveSecond ).toHaveBeenCalledTimes( 0 );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'first' ) ).toBeUndefined();
    expect( store.findById( 'second' ).ID ).toBe( 'second' );
    expect( store.filterByType( 'label' ) ).toHaveLength( 1 );
    expect( store.filterByType( 'link' ) ).toHaveLength( 1 );
} );

it( 'remove after Registry', async() => {
    expect.assertions( 4 );
    const beforeRemove = jest.fn();
    const afterRemove = jest.fn();
    await renderWidget( Widget, {
        types: [ 'label' ],
        beforeRemove,
        afterRemove,
        afterRegister() {
            this.UI.render.unregister( this.ID );
        }
    } );
    expect( beforeRemove ).toHaveBeenCalled();
    expect( afterRemove ).toHaveBeenCalled();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBe( undefined );
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
} );

it( 'remove non exists widget', async() => {
    expect.assertions( 1 );
    await renderWidget( Widget );
    DI.resolve( 'sham-ui' ).render.unregister( 'non-exists' );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBeInstanceOf( Widget );
} );


it( 'modify type after registry', async() => {
    expect.assertions( 3 );
    const typesMock = jest.fn()
        .mockReturnValueOnce( [ 'label' ] )
        .mockReturnValueOnce( [ 'link' ] );
    await renderWidget( Widget, {
        get types() {
            return typesMock();
        },
        afterRegister() {
            this.UI.render.unregister( this.ID );
        }
    } );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBeUndefined();
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
    expect( store.filterByType( 'link' ) ).toHaveLength( 0 );
} );
