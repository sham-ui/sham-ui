import { Component, createDI } from '../src/index';
import { renderComponent } from './helpers';

it( 'hydrate', () => {
    expect.assertions( 5 );
    const hydrate = jest.fn();
    const DI = createDI();
    DI.resolve( 'sham-ui:hooks' ).hydrate = hydrate;

    const Dummy = Component( function( options ) {
        options( {
            name: 'default'
        } );
    } );
    renderComponent( Dummy, { DI } );
    expect( hydrate ).toHaveBeenCalledTimes( 1 );
    expect( hydrate.mock.calls[ 0 ].length ).toBe( 1 );
    expect( hydrate.mock.calls[ 0 ][ 0 ] ).toBeInstanceOf( Dummy );
    expect( hydrate.mock.calls[ 0 ][ 0 ].container ).toBeInstanceOf( Element );
    expect( hydrate.mock.calls[ 0 ][ 0 ].options.name ).toBe( 'default' );

} );

it( 'hydrate call after resolve options', () => {
    expect.assertions( 5 );
    const hydrate = jest.fn();
    const DI = createDI();
    DI.resolve( 'sham-ui:hooks' ).hydrate = hydrate;
    const Dummy = Component( function( options ) {
        options( {
            name: 'default'
        } );
    } );
    renderComponent( Dummy, {
        DI,
        name: 'overriden'
    } );
    expect( hydrate ).toHaveBeenCalledTimes( 1 );
    expect( hydrate.mock.calls[ 0 ].length ).toBe( 1 );
    expect( hydrate.mock.calls[ 0 ][ 0 ] ).toBeInstanceOf( Dummy );
    expect( hydrate.mock.calls[ 0 ][ 0 ].container ).toBeInstanceOf( Element );
    expect( hydrate.mock.calls[ 0 ][ 0 ].options.name ).toBe( 'overriden' );
} );
