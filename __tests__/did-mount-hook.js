import { Component } from '../src/index';
import { renderComponent } from './helpers';

it( 'didMount', () => {
    expect.assertions( 3 );
    const Dummy = Component( function( options, update, didMount ) {
        const state = options( {
            name: 'default'
        } );
        didMount( () => {
            expect( this.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'default' );
            expect( state.name ).toBe( 'default' );
        } );
    } );
    renderComponent( Dummy );
} );

it( 'didMount call after resolve options', () => {
    expect.assertions( 3 );
    const Dummy = Component( function( options, update, didMount ) {
        const state = options( {
            name: 'default'
        } );
        didMount( () => {
            expect( this.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'overriden' );
            expect( state.name ).toBe( 'overriden' );
        } );
    } );
    renderComponent( Dummy, {
        name: 'overriden'
    } );
} );
