import { Component, insert, createChildContext } from '../src/index';
import { renderComponent, expectRenderedText } from './helpers';

it( 'didReceive', () => {
    expect.assertions( 5 );
    const didReceiveFn = jest.fn();

    const Dummy = Component( function Template() {
        this.isRoot = true;
        const text0 = this.dom.text( '' );
        this.addSpots(
            [
                'content',
                ( content ) => text0.textContent = content
            ]
        );
        this.nodes = [ text0 ];
    }, function( options, didMount, didReceive ) {
        const state = options( {
            content: 'default'
        } );
        didReceive( () => didReceiveFn( state.content ) );
    } );


    let state;
    const DymmyUsage = Component( function Template() {
        this.isRoot = true;
        const custom0 = this.dom.comment( '0' );
        const child0 = createChildContext( this, custom0 );
        this.addSpots(
            [
                'content',
                ( content ) => insert( child0, Dummy, { content } )
            ]
        );
        this.nodes = [ custom0 ];
    }, function( options ) {
        state = options( {
            content: ''
        } );
    } );

    renderComponent( DymmyUsage );
    expectRenderedText( '' );

    state.content = 'new';
    expectRenderedText( 'new' );
    expect( didReceiveFn ).toHaveBeenCalledTimes( 1 );
    expect( didReceiveFn.mock.calls[ 0 ].length ).toBe( 1 );
    expect( didReceiveFn.mock.calls[ 0 ][ 0 ] ).toBe( 'new' );
} );


it( 'didReceive don\'t call from state update', () => {
    expect.assertions( 3 );
    const didReceiveFn = jest.fn();

    let state;
    const Dummy = Component( function Template() {
        this.isRoot = true;
        const text0 = this.dom.text( '' );
        this.addSpots(
            [
                'content',
                ( content ) => text0.textContent = content
            ]
        );
        this.nodes = [ text0 ];
    }, function( options, didMount, didReceive ) {
        state = options( {
            content: 'default'
        } );
        didReceive( () => didReceiveFn( state.content ) );
    } );

    renderComponent( Dummy );
    expectRenderedText( 'default' );

    state.content = 'new';
    expectRenderedText( 'new' );
    expect( didReceiveFn ).toHaveBeenCalledTimes( 0 );
} );
