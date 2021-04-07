import { renderComponent, expectRenderedText } from '../helpers';
import { Component, cond } from '../../src/index';

/**
 * Component for
 * {% if test %}
 *    then
 * {% else %}
 *    else
 * {% endif %}
 */
class condition extends Component {
    constructor( options ) {
        super( options );

        this.isRoot = true;

        const _this = this;

        const dom = this.dom;

        // Create elements
        const for0 = dom.comment( 'if' );
        const child0 = {};
        const child1 = {};


        // Update spot functions
        this.spots = [
            [
                'test',
                ( test ) => {
                    let result;
                    result = cond( _this, for0, child0, cond_if0, test, _this );
                    cond( _this, for0, child1, cond_else1, !result, _this );
                }
            ]
        ];


        // On update actions
        this.onUpdate = ( __data__ ) => {
            if ( child0.ref ) {
                child0.ref.update( __data__ );
            }
            if ( child1.ref ) {
                child1.ref.update( __data__ );
            }
        };


        // Set root nodes
        this.nodes = [ for0 ];
    }
}

// eslint-disable-next-line camelcase
class cond_if0 extends Component {
    constructor() {
        super( ...arguments );

        // Set root nodes
        this.nodes = [ this.dom.text( ' then ' ) ];
    }
}

// eslint-disable-next-line camelcase
class cond_else1 extends Component {
    constructor() {
        super( ...arguments );

        // Set root nodes
        this.nodes = [ this.dom.text( ' else ' ) ];
    }
}

it( 'render', () => {
    renderComponent( condition, {
        test: true
    } );
    expectRenderedText( ' then ' );
} );

it( 'update', () => {
    const DI = renderComponent( condition, {
        ID: 'cond',
        test: true
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
