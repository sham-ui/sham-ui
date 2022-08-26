import { renderComponent, expectRenderedText } from '../helpers';
import { Component, cond, createChildContext } from '../../src/index';

/**
 * Component for
 * {% if test %}
 *    then
 * {% else %}
 *    else
 * {% endif %}
 */
const condition = Component( function() {

    this.isRoot = true;

    const dom = this.dom;

    // Create elements
    const for0 = dom.comment( 'if' );

    const child0 = createChildContext( this, for0 );
    const child1 = createChildContext( this, for0 );


    // Update spot functions
    this.addSpots(
        [
            'test',
            ( test ) => {
                let result;
                result = cond( child0, cond_if0, test );
                cond( child1, cond_else1, !result );
            }
        ]
    );

    // On update actions
    this.onUpdate = ( __data__ ) => {
        child0.onUpdate( __data__ );
        child1.onUpdate( __data__ );
    };


    // Set root nodes
    this.nodes = [ for0 ];
} );

// eslint-disable-next-line camelcase
const cond_if0 = Component( function() {

    // Set root nodes
    this.nodes = [ this.dom.text( ' then ' ) ];
} );

// eslint-disable-next-line camelcase
const cond_else1 = Component( function() {

    // Set root nodes
    this.nodes = [ this.dom.text( ' else ' ) ];
} );

it( 'render', () => {
    renderComponent( condition, {
        test: true
    } );
    expectRenderedText( ' then ' );
} );

it( 'update', () => {
    const DI = renderComponent( condition, {
        test: true
    }, {
        ID: 'cond'
    } );
    expectRenderedText( ' then ' );
    const component = DI.resolve( 'sham-ui:store' ).byId.get( 'cond' );
    component.update( { test: false } );
    expectRenderedText( ' else ' );
    component.update( { test: true } );
    expectRenderedText( ' then ' );
    component.update( { test: true } );
    expectRenderedText( ' then ' );
} );

it( 'render (default false)', () => {
    renderComponent( condition, {
        test: false
    } );
    expectRenderedText( ' else ' );
} );
