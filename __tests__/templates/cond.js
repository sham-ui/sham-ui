import { renderComponent, expectRenderedText } from '../helpers';
import { DI } from '../../src/shamUI';

/**
 * Component for
 * {% if test %}
 *    then
 * {% else %}
 *    else
 * {% endif %}
 * @class
 */
function cond() {
    __UI__.Component.apply( this, arguments );
    var _this = this;

    // Create elements
    var for0 = document.createComment( 'if' );
    var child0 = {};
    var child1 = {};

    // Update functions
    this.__update__ = {
        test: function( test ) {
            var result;
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
cond.prototype = Object.create( __UI__.Component.prototype );
cond.prototype.constructor = cond;
cond.prototype.name = 'cond';
cond.prototype.update = function( __currentData__ ) {
    var __data__ = Object.assign( {}, this.options, __currentData__ );
    if ( __data__.test !== undefined ) {
        this.__update__.test( __data__.test );
    }
    this.onUpdate( __data__ );
    this.options = __data__;
};

/**
 * @class
 */
// eslint-disable-next-line camelcase
function cond_if0() {
    __UI__.Component.apply( this, arguments );

    // Set root nodes
    this.nodes = [ document.createTextNode( ' then ' ) ];
}
cond_if0.prototype = Object.create( __UI__.Component.prototype );
// eslint-disable-next-line camelcase
cond_if0.prototype.constructor = cond_if0;
cond_if0.prototype.name = 'cond_if0';
cond_if0.prototype.update = function( __currentData__ ) {
    var __data__ = Object.assign( {}, this.options, __currentData__ );
    this.options = __data__;
};

/**
 * @class
 */
// eslint-disable-next-line camelcase
function cond_else1() {
    __UI__.Component.apply( this, arguments );

    // Set root nodes
    this.nodes = [ document.createTextNode( ' else ' ) ];
}
cond_else1.prototype = Object.create( __UI__.Component.prototype );
// eslint-disable-next-line camelcase
cond_else1.prototype.constructor = cond_else1;
cond_else1.prototype.name = 'cond_else1';
cond_else1.prototype.update = function( __currentData__ ) {
    var __data__ = Object.assign( {}, this.options, __currentData__ );
    this.options = __data__;
};

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
