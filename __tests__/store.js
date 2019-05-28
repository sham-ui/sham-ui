import { DI, Component } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'find', async() => {
    expect.assertions( 2 );
    let foo;
    DI.bind( 'component-binder', () => {
        foo = new Component( {
            ID: 'foo',
            containerSelector: 'body'
        } );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.find( component => component.ID === 'foo' ) ).toEqual( foo );
    expect( store.find( component => component.ID === 'bar' ) ).toBe( null );
} );

it( 'filter', async() => {
    expect.assertions( 2 );
    let foo;
    DI.bind( 'component-binder', () => {
        foo = new Component( {
            ID: 'foo',
            containerSelector: 'body'
        } );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    const components = store.filter( component => component.ID === 'foo' );
    expect( components ).toHaveLength( 1 );
    expect( components[ 0 ] ).toEqual( foo );
} );

it( 'filterByType', async() => {
    expect.assertions( 6 );
    let foo, bar;
    DI.bind( 'component-binder', () => {
        foo = new Component( {
            ID: 'foo',
            containerSelector: 'body',
            types: [ 'label' ]
        } );
        bar = new Component( {
            ID: 'bar',
            containerSelector: 'body',
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
    DI.bind( 'component-binder', () => {
        new Component( {
            ID: 'foo',
            containerSelector: 'body'
        } );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    const ids = store.map( component => component.ID );
    expect( ids ).toHaveLength( 1 );
    expect( ids[ 0 ] ).toEqual( 'foo' );
} );

it( 'forEachId', async() => {
    expect.assertions( 6 );
    let foo, bar;
    DI.bind( 'component-binder', () => {
        foo = new Component( {
            ID: 'foo',
            containerSelector: 'body'
        } );
        bar = new Component( {
            ID: 'bar',
            containerSelector: 'body'
        } );
    } );
    await renderApp();
    const allComponents = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachId( [ 'foo', 'bar' ], allComponents );
    expect( allComponents ).toHaveBeenCalledTimes( 2 );
    expect( allComponents ).toHaveBeenNthCalledWith( 1, foo );
    expect( allComponents ).toHaveBeenNthCalledWith( 2, bar );
    const fooComponents = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachId( [ 'foo' ], fooComponents );
    expect( fooComponents ).toHaveBeenCalledTimes( 1 );
    expect( fooComponents ).toHaveBeenNthCalledWith( 1, foo );
    const dummyComponents = jest.fn();
    DI.resolve( 'sham-ui:store' ).forEachId( [ 'dummy' ], dummyComponents );
    expect( dummyComponents ).toHaveBeenCalledTimes( 0 );
} );

it( 'forEachType', async() => {
    expect.assertions( 10 );
    let foo, bar;
    DI.bind( 'component-binder', () => {
        foo = new Component( {
            ID: 'foo',
            containerSelector: 'body',
            types: [ 'label' ]
        } );
        bar = new Component( {
            ID: 'bar',
            containerSelector: 'body',
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
