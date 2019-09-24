import { DI, Component } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'find', () => {
    let foo;
    renderApp( () => {
        foo = new Component( {
            ID: 'foo',
            container: document.querySelector( 'body' )
        } );
    } );
    const store = DI.resolve( 'sham-ui:store' );
    expect( store.find( component => component.ID === 'foo' ) ).toEqual( foo );
    expect( store.find( component => component.ID === 'bar' ) ).toBe( null );
} );

it( 'filter', () => {
    let foo;
    renderApp( () => {
        foo = new Component( {
            ID: 'foo',
            container: document.querySelector( 'body' )
        } );
    } );
    const store = DI.resolve( 'sham-ui:store' );
    const components = store.filter( component => component.ID === 'foo' );
    expect( components ).toHaveLength( 1 );
    expect( components[ 0 ] ).toEqual( foo );
} );

it( 'map', () => {
    renderApp( () => {
        new Component( {
            ID: 'foo',
            container: document.querySelector( 'body' )
        } );
    } );
    const store = DI.resolve( 'sham-ui:store' );
    const ids = store.map( component => component.ID );
    expect( ids ).toHaveLength( 1 );
    expect( ids[ 0 ] ).toEqual( 'foo' );
} );

it( 'forEachId', () => {
    let foo, bar;
    renderApp( () => {
        foo = new Component( {
            ID: 'foo',
            container: document.querySelector( 'body' )
        } );
        bar = new Component( {
            ID: 'bar',
            container: document.querySelector( 'body' )
        } );
    } );
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
