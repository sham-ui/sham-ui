import { Component } from '../src/index';
import { renderComponent } from './helpers';

it( 'didMount', () => {
    expect.assertions( 3 );
    const Dummy = Component( function( options, didMount ) {
        this.isRoot = true;
        const state = options( {
            name: 'default'
        } );
        didMount( () => {
            expect( this.ctx.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'default' );
            expect( state.name ).toBe( 'default' );
        } );
    } );
    renderComponent( Dummy );
} );

it( 'didMount call after resolve options', () => {
    expect.assertions( 3 );
    const Dummy = Component( function( options, didMount ) {
        this.isRoot = true;
        const state = options( {
            name: 'default'
        } );
        didMount( () => {
            expect( this.ctx.container ).toBeInstanceOf( Element );
            expect( this.options.name ).toBe( 'overriden' );
            expect( state.name ).toBe( 'overriden' );
        } );
    } );
    renderComponent( Dummy, {
        name: 'overriden'
    } );
} );


it( 'didMount return onRemove hooks', () => {
    expect.assertions( 3 );
    const onRemove = jest.fn();

    const Dummy = Component( function( options, didMount ) {
        this.isRoot = true;
        const state = options( {
            name: 'default'
        } );
        didMount( () => {
            return () => onRemove( state.name );
        } );
    } );
    const DI = renderComponent( Dummy, {
        name: 'overriden'
    } );
    DI.resolve( 'sham-ui:store' ).byId.get( 'dummy' ).remove();

    expect( onRemove ).toHaveBeenCalledTimes( 1 );
    expect( onRemove.mock.calls[ 0 ].length ).toBe( 1 );
    expect( onRemove.mock.calls[ 0 ][ 0 ] ).toBe( 'overriden' );
} );
