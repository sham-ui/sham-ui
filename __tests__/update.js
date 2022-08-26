import { Component } from '../src/index';
import { renderComponent, expectRenderedText } from './helpers';

it( 'once field', () => {
    expect.assertions( 3 );

    let state;
    const Dummy = Component( function Template() {
        this.isRoot = true;
        const text0 = this.dom.text( '' );
        this.addSpots(
            [
                'firstName',
                1 // CACHE
            ],
            [
                'lastName',
                1 // CACHE
            ],
            [
                [  'firstName', 'lastName' ],
                ( firstName, lastName ) => text0.textContent = firstName + ' ' + lastName
            ]
        );
        this.nodes = [ text0 ];
    }, function( options ) {
        state = options( {
            firstName: 'Default first name',
            lastName: 'Default last name'
        } );
    } );

    renderComponent( Dummy );
    expectRenderedText( 'Default first name Default last name' );
    state.firstName = 'John';
    expectRenderedText( 'John Default last name' );
    state.lastName = 'Smith';
    expectRenderedText( 'John Smith' );
} );

it( 'multiple field', () => {
    expect.assertions( 2 );

    let state;
    const Dummy = Component( function Template() {
        this.isRoot = true;
        const text0 = this.dom.text( '' );
        this.addSpots(
            [
                'firstName',
                1 // CACHE
            ],
            [
                'lastName',
                1 // CACHE
            ],
            [
                [  'firstName', 'lastName' ],
                ( firstName, lastName ) => text0.textContent = firstName + ' ' + lastName
            ]
        );
        this.nodes = [ text0 ];
    }, function( options ) {
        state = options( {
            firstName: 'Default first name',
            lastName: 'Default last name'
        } );
    } );

    renderComponent( Dummy );
    expectRenderedText( 'Default first name Default last name' );
    state( {
        firstName: 'John',
        lastName: 'Smith'
    } );
    expectRenderedText( 'John Smith' );
} );
