import { DI, Widget } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'find', async() => {
    expect.assertions( 2 );
    let foo;
    DI.bind( 'widget-binder', () => {
        foo = new Widget( 'body', 'foo' );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.find( widget => widget.ID === 'foo' ) ).toEqual( foo );
    expect( store.find( widget => widget.ID === 'bar' ) ).toBe( null );
} );

it( 'filter', async() => {
    expect.assertions( 2 );
    let foo;
    DI.bind( 'widget-binder', () => {
        foo = new Widget( 'body', 'foo' );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    const widgets = store.filter( widget => widget.ID === 'foo' );
    expect( widgets ).toHaveLength( 1 );
    expect( widgets[ 0 ] ).toEqual( foo );
} );

it( 'filterByType', async() => {
    expect.assertions( 6 );
    let foo, bar;
    DI.bind( 'widget-binder', () => {
        foo = new Widget( 'body', 'foo', {
            types: [ 'label' ]
        } );
        bar = new Widget( 'body', 'bar', {
            types: [ 'label', 'link' ]
        } );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    const labels = store.filterByType( 'label' );
    expect( labels ).toHaveLength( 2 );
    expect( labels[ 0 ] ).toEqual( foo );
    expect( labels[ 1 ] ).toEqual( bar );
    const links = store.filterByType( 'link' );
    expect( links ).toHaveLength( 1 );
    expect( links[ 0 ] ).toEqual( bar );
    expect( store.filterByType( 'non-exist-type' ) ).toHaveLength( 0 );
} );

it( 'map', async() => {
    expect.assertions( 2 );
    DI.bind( 'widget-binder', () => {
        new Widget( 'body', 'foo' );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    const ids = store.map( widget => widget.ID );
    expect( ids ).toHaveLength( 1 );
    expect( ids[ 0 ] ).toEqual( 'foo' );
} );

it( 'forEachId', async() => {
    expect.assertions( 6 );
    let foo, bar;
    DI.bind( 'widget-binder', () => {
        foo = new Widget( 'body', 'foo' );
        bar = new Widget( 'body', 'bar' );
    } );
    await renderApp();
    const allWidgets = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachId( [ 'foo', 'bar' ], allWidgets );
    expect( allWidgets ).toHaveBeenCalledTimes( 2 );
    expect( allWidgets ).toHaveBeenNthCalledWith( 1, foo );
    expect( allWidgets ).toHaveBeenNthCalledWith( 2, bar );
    const fooWidgets = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachId( [ 'foo' ], fooWidgets );
    expect( fooWidgets ).toHaveBeenCalledTimes( 1 );
    expect( fooWidgets ).toHaveBeenNthCalledWith( 1, foo );
    const dummyWidgets = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachId( [ 'dummy' ], dummyWidgets );
    expect( dummyWidgets ).toHaveBeenCalledTimes( 0 );
} );

it( 'forEachType', async() => {
    expect.assertions( 10 );
    let foo, bar;
    DI.bind( 'widget-binder', () => {
        foo = new Widget( 'body', 'foo', {
            types: [ 'label' ]
        } );
        bar = new Widget( 'body', 'bar', {
            types: [ 'label', 'link' ]
        } );
    } );
    await renderApp();
    const allTypes = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachType( [ 'label', 'link' ], allTypes );
    expect( allTypes ).toHaveBeenCalledTimes( 3 );
    expect( allTypes.mock.calls[ 0 ][ 0 ] ).toEqual( foo );
    expect( allTypes.mock.calls[ 1 ][ 0 ] ).toEqual( bar );
    expect( allTypes.mock.calls[ 2 ][ 0 ] ).toEqual( bar );
    const labelCallback = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachType( [ 'label' ], labelCallback );
    expect( labelCallback ).toHaveBeenCalledTimes( 2 );
    expect( allTypes.mock.calls[ 0 ][ 0 ] ).toEqual( foo );
    expect( allTypes.mock.calls[ 2 ][ 0 ] ).toEqual( bar );
    const linkCallback = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachType( [ 'link' ], linkCallback );
    expect( linkCallback ).toHaveBeenCalledTimes( 1 );
    expect( linkCallback.mock.calls[ 0 ][ 0 ] ).toEqual( bar );
    const nonExistsCallback = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachType( [ 'non-exists' ], nonExistsCallback );
    expect( nonExistsCallback ).toHaveBeenCalledTimes( 0 );
} );
