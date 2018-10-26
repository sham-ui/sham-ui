import { Widget, DI } from '../src/shamUI';
import { renderWidget, renderApp } from './helpers';

it( 'destroy', async() => {
    expect.assertions( 4 );
    const beforeDestroy = jest.fn();
    const afterDestroy = jest.fn();
    await renderWidget( Widget, {
        types: [ 'label' ],
        beforeDestroy,
        afterDestroy,
        afterRender() {
            this.destroy();
        }
    } );
    expect( beforeDestroy ).toHaveBeenCalled();
    expect( afterDestroy ).toHaveBeenCalled();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBe( undefined );
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
} );

it( 'destroy one', async() => {
    expect.assertions( 8 );
    const beforeDestroyFirst = jest.fn();
    const beforeDestroySecond = jest.fn();
    const afterDestroyFirst = jest.fn();
    const afterDestroySecond = jest.fn();
    DI.bind( 'widget-binder', () => {
        new Widget( {
            ID: 'first',
            containerSelector: 'body',
            types: [ 'label' ],
            beforeDestroy: beforeDestroyFirst,
            afterDestroy: afterDestroyFirst,
            afterRender() {
                this.destroy();
            }
        } );
        new Widget( {
            ID: 'second',
            containerSelector: 'body',
            types: [ 'link', 'label' ],
            beforeDestroy: beforeDestroySecond,
            afterDestroy: afterDestroySecond
        } );
    } );
    await renderApp();
    expect( beforeDestroyFirst ).toHaveBeenCalled();
    expect( afterDestroyFirst ).toHaveBeenCalled();
    expect( beforeDestroySecond ).toHaveBeenCalledTimes( 0 );
    expect( afterDestroySecond ).toHaveBeenCalledTimes( 0 );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'first' ) ).toBeUndefined();
    expect( store.findById( 'second' ).ID ).toBe( 'second' );
    expect( store.filterByType( 'label' ) ).toHaveLength( 1 );
    expect( store.filterByType( 'link' ) ).toHaveLength( 1 );
} );

it( 'destroy after Registry', async() => {
    expect.assertions( 4 );
    const beforeDestroy = jest.fn();
    const afterDestroy = jest.fn();
    await renderWidget( Widget, {
        types: [ 'label' ],
        beforeDestroy,
        afterDestroy,
        afterRegister() {
            this.destroy();
        }
    } );
    expect( beforeDestroy ).toHaveBeenCalled();
    expect( afterDestroy ).toHaveBeenCalled();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBe( undefined );
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
} );

it( 'destroy non exists widget', async() => {
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
            this.destroy();
        }
    } );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.findById( 'dummy' ) ).toBeUndefined();
    expect( store.filterByType( 'label' ) ).toHaveLength( 0 );
    expect( store.filterByType( 'link' ) ).toHaveLength( 0 );
} );
