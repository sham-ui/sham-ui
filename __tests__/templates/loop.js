import { renderComponent, expectRenderedHTML } from '../helpers';
import { Component, Map, loop } from '../../src/index';

/**
 * Component for
 * <ul>
 *   {% for key, value of list %}
 *     <li>{{ key }}:{{ value }}</li>
 *   {% endfor %}
 * </ul>
 */
class LoopComponent extends Component {
    constructor( options ) {
        super( options );

        this.isRoot = true;

        const _this = this;

        const dom = this.dom;

        // Create elements
        const ul0 = dom.el( 'ul' );
        const children0 = new Map();

        // Update spot functions
        this.spots = [
            [
                0,
                'list',
                ( list ) => {
                    loop(
                        _this,
                        ul0,
                        children0,
                        loop_for0,
                        list,
                        { 'key': 'key', 'value': 'value' },
                        _this
                    );
                }
            ]
        ];

        // On update actions
        this.onUpdate = ( __data__ ) => {
            children0.forEach(
                ( view ) => view.update( Object.assign( {}, __data__, view.__state__ ) )
            );
        };

        // Set root nodes
        this.nodes = [ ul0 ];
    }
}

// eslint-disable-next-line camelcase
class loop_for0 extends Component {
    constructor( options ) {
        super( options );

        const dom = this.dom;

        // Create elements
        const li0 = dom.el( 'li' );
        const text1 = dom.text( '' );
        const text2 = dom.text( ':' );
        const text3 = dom.text( '' );

        if ( dom.build() ) {

            // Construct dom
            li0.appendChild( text1 );
            li0.appendChild( text2 );
            li0.appendChild( text3 );
        }

        // Update spot functions
        this.spots = [
            [
                2, // LOOP
                'key',
                ( key ) => {
                    text1.textContent = key;
                }
            ],
            [
                2, // LOOP
                'value',
                ( value ) => {
                    text3.textContent = value;
                }
            ]
        ];

        // Set root nodes
        this.nodes = [ li0 ];
    }
}

it( 'render (array)', () => {
    renderComponent( LoopComponent, {
        list: [ 'one', 'two', 'three' ]
    } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li></ul>' );
} );

it( 'render (object)', () => {
    renderComponent( LoopComponent, {
        list: {
            one: 'I',
            two: 'II',
            three: 'III'
        }
    } );
    expectRenderedHTML( '<ul><li>one:I</li><li>two:II</li><li>three:III</li></ul>' );
} );

it( 'update', () => {
    const list = [ 'one', 'two', 'three' ];
    const DI = renderComponent( LoopComponent, {
        list,
        ID: 'loop'
    } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li></ul>' );
    const component = DI.resolve( 'sham-ui:store' ).byId.get( 'loop' );
    component.update( { list: [ ...list, 'four' ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li><li>3:four</li></ul>' );
    component.update( { list: [ 'one', 'two' ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li></ul>' );
    component.update( { list: [ ...list ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:two</li><li>2:three</li></ul>' );
    component.update( { list: [ 'one', 'three' ] } );
    expectRenderedHTML( '<ul><li>0:one</li><li>1:three</li></ul>' );
} );
