import { renderComponent, expectRenderedHTML } from '../helpers';
import { DI } from '../../src/shamUI';

/**
 * Component for
 * <ul>
 *   {% for key, value of list %}
 *     <li>{{ key }}:{{ value }}</li>
 *   {% endfor %}
 * </ul>
 */
class loop extends __UI__.Component {
    constructor() {
        super( ...arguments );

        this.__data__ = {};
        const _this = this;

        // Create elements
        const ul0 = document.createElement( 'ul' );
        const children0 = new __UI__.Map();

        // Update functions
        this.__update__ = {
            list( list ) {
                __UI__.loop( _this,
                    ul0,
                    children0,
                    loop_for0,
                    list,
                    { 'key': 'key', 'value': 'value' } );
            }
        };

        // On update actions
        this.onUpdate = function( __data__ ) {
            children0.forEach( function( view ) {
                view.update( view.__state__ );
                view.update( __data__ );
                view.update( view.__state__ );
            } );
        };

        // Set root nodes
        this.nodes = [ ul0 ];
    }

    updateSpots( __data__ ) {
        if ( __data__.list !== undefined ) {
            this.__update__.list( __data__.list );
        }
        this.onUpdate( __data__ );
    }
}

// eslint-disable-next-line camelcase
class loop_for0 extends __UI__.Component {
    constructor() {
        super( ...arguments );

        this.__data__ = {};
        this.__state__ = {};

        // Create elements
        var li0 = document.createElement( 'li' );
        var text1 = document.createTextNode( '' );
        var text2 = document.createTextNode( '' );

        // Construct dom
        li0.appendChild( text1 );
        li0.appendChild( document.createTextNode( ':' ) );
        li0.appendChild( text2 );

        // Update functions
        this.__update__ = {
            key: function( key ) {
                text1.textContent = key;
            },
            value: function( value ) {
                text2.textContent = value;
            }
        };

        // Set root nodes
        this.nodes = [ li0 ];
    }

    updateSpots( __data__ ) {
        if ( __data__.key !== undefined && __data__.__index__ !== undefined ) {
            this.__update__.key( __data__.key );
        }
        if ( __data__.value !== undefined && __data__.__index__ !== undefined ) {
            this.__update__.value( __data__.value );
        }
    }
}

it( 'render (array)', async() => {
    expect.assertions( 1 );
    await renderComponent( loop, {
        list: [ 'one', 'two', 'three' ]
    } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li></ul>' );
} );

it( 'render (object)', async() => {
    expect.assertions( 1 );
    await renderComponent( loop, {
        list: {
            one: 'I',
            two: 'II',
            three: 'III'
        }
    } );
    expectRenderedHTML( '<ul><li>one:I</li><li>two:II</li><li>three:III</li></ul>' );
} );

it( 'update', async() => {
    expect.assertions( 5 );
    const list = [ 'one', 'two', 'three' ];
    await renderComponent( loop, {
        list,
        ID: 'loop'
    } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li></ul>' );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'loop' );
    component.update( { list: [ ...list, 'four' ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li><li>3:four</li></ul>' );
    component.update( { list: [ 'one', 'two' ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li></ul>' );
    component.update( { list: [ ...list ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li></ul>' );
    component.update( { list: [ 'one', 'three' ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:three</li></ul>' );
} );
