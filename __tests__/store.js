import { Component, start, createDI, createRootContext } from '../src/index';

const components = ( DI ) => Array.from(
    DI.resolve( 'sham-ui:store' ).byId.values()
);

it( 'find', () => {
    const DI = createDI();
    let foo = new( Component( function() {
        this.isRoot = true;
    } ) )( createRootContext( {
        DI,
        ID: 'foo',
        container: document.querySelector( 'body' )
    } ) );
    start( DI );
    const all = components( DI );
    expect( all.find( component => component.ID === 'foo' ) ).toEqual( foo );
    expect( all.find( component => component.ID === 'bar' ) ).toBe( undefined );
} );

it( 'filter', () => {
    const DI = createDI();
    let foo = new( Component( function() {
        this.isRoot = true;
    } ) )( createRootContext( {
        DI,
        ID: 'foo',
        container: document.querySelector( 'body' )
    } ) );
    start( DI );
    const all = components( DI ).filter( component => component.ID === 'foo' );
    expect( all ).toHaveLength( 1 );
    expect( all[ 0 ] ).toEqual( foo );
} );

it( 'map', () => {
    const DI = createDI();
    new( Component( function() {
        this.isRoot = true;
    } ) )( createRootContext( {
        DI,
        ID: 'foo',
        container: document.querySelector( 'body' )
    } ) );
    start( DI );
    const ids = components( DI ).map( component => component.ID );
    expect( ids ).toHaveLength( 1 );
    expect( ids[ 0 ] ).toEqual( 'foo' );
} );

