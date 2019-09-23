import { DI, Component } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'find', async() => {
    expect.assertions( 2 );
    let foo;
    DI.bind( 'component-binder', () => {
        foo = new Component( {
            ID: 'foo',
            container: document.querySelector( 'body' )
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
            container: document.querySelector( 'body' )
        } );
    } );
    await renderApp();
    const store = DI.resolve( 'sham-ui:store' );
    const components = store.filter( component => component.ID === 'foo' );
    expect( components ).toHaveLength( 1 );
    expect( components[ 0 ] ).toEqual( foo );
} );

it( 'map', async() => {
    expect.assertions( 2 );
    DI.bind( 'component-binder', () => {
        new Component( {
            ID: 'foo',
            container: document.querySelector( 'body' )
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
            container: document.querySelector( 'body' )
        } );
        bar = new Component( {
            ID: 'bar',
            container: document.querySelector( 'body' )
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
