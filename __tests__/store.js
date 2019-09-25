import { DI, Component, start } from '../src/index';

it( 'find', () => {
    let foo = new Component( {
        ID: 'foo',
        container: document.querySelector( 'body' )
    } );
    start();
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.find( component => component.ID === 'foo' ) ).toEqual( foo );
    expect( store.find( component => component.ID === 'bar' ) ).toBe( undefined );
} );

it( 'filter', () => {
    let foo = new Component( {
        ID: 'foo',
        container: document.querySelector( 'body' )
    } );
    start();
    const store = DI.resolve( 'sham-ui:store' );
    const components = store.filter( component => component.ID === 'foo' );
    expect( components ).toHaveLength( 1 );
    expect( components[ 0 ] ).toEqual( foo );
} );

it( 'map', () => {
    new Component( {
        ID: 'foo',
        container: document.querySelector( 'body' )
    } );
    start();
    const store = DI.resolve( 'sham-ui:store' );
    const ids = store.map( component => component.ID );
    expect( ids ).toHaveLength( 1 );
    expect( ids[ 0 ] ).toEqual( 'foo' );
} );

it( 'forEachId', () => {
    const foo = new Component( {
        ID: 'foo',
        container: document.querySelector( 'body' )
    } );
    const bar = new Component( {
        ID: 'bar',
        container: document.querySelector( 'body' )
    } );
    start();
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
