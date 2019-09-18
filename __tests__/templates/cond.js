import { renderComponent, expectRenderedText } from '../helpers';
import { DI } from '../../src/shamUI';

/**
 * Component for
 * {% if test %}
 *    then
 * {% else %}
 *    else
 * {% endif %}
 */
class cond extends __UI__.Component {
    constructor() {
        super( ...arguments );

        const _this = this;

        // Create elements
        const for0 = document.createComment( 'if' );
        const child0 = {};
        const child1 = {};

        // Update functions
        this.__update__ = {
            test( test ) {
                let result;
                result = __UI__.cond( _this, for0, child0, cond_if0, test );
                __UI__.cond( _this, for0, child1, cond_else1, !result );
            }
        };

        // On update actions
        this.onUpdate = function( __data__ ) {
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

    updateSpots( __data__ ) {
        if ( __data__.test !== undefined ) {
            this.__update__.test( __data__.test );
        }
        this.onUpdate( __data__ );
    }
}

// eslint-disable-next-line camelcase
class cond_if0 extends __UI__.Component {
    constructor() {
        super( ...arguments );

        // Set root nodes
        this.nodes = [ document.createTextNode( ' then ' ) ];
    }
}

// eslint-disable-next-line camelcase
class cond_else1 extends __UI__.Component {
    constructor() {
        super( ...arguments );

        // Set root nodes
        this.nodes = [ document.createTextNode( ' else ' ) ];
    }
}

it( 'render', async() => {
    expect.assertions( 1 );
    await renderComponent( cond, {
        test: true
    } );
    expectRenderedText( ' then ' );
} );

it( 'update', async() => {
    expect.assertions( 4 );
    await renderComponent( cond, {
        ID: 'cond',
        test: true
    } );
    expectRenderedText( ' then ' );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'cond' );
    component.update( { test: false } );
    expectRenderedText( ' else ' );
    component.update( { test: true } );
    expectRenderedText( ' then ' );
    component.update( { test: true } );
    expectRenderedText( ' then ' );
} );

it( 'render (default false)', async() => {
    expect.assertions( 1 );
    await renderComponent( cond, {
        test: false
    } );
    expectRenderedText( ' else ' );
} );
