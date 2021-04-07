import { renderComponent, expectRenderedHTML } from '../helpers';
import { Component, insert } from '../../src/index';

/**
 * Component for
 * <h1>{{ title }}</h1>
 * <div>
 *   {{ content }}
 * </div>
 */
class CustomPanel extends Component {
    constructor( options ) {
        super( options );

        this.isRoot = true;

        const dom = this.dom;

        // Create elements
        const h10 = dom.el( 'h1' );
        const text1 = dom.text( '' );
        const div2 = dom.el( 'div' );
        const text3 = dom.text( '' );

        if ( dom.build() ) {

            // Construct dom
            h10.appendChild( text1 );
            div2.appendChild( text3 );
        }

        // Update spot functions
        this.spots = [
            [
                0,
                'title',
                ( title ) => {
                    text1.textContent = title;
                }
            ],
            [
                0,
                'content',
                ( content ) => {
                    text3.textContent = content;
                }
            ]
        ];

        // Set root nodes
        this.nodes = [ h10, div2 ];
    }

    onUpdate() {}
}


/**
 * Component for <CustomPanel title="string" content="text"/>
 * @class
 */
class custom extends Component {
    constructor( options ) {
        super( options );

        this.isRoot = true;

        const _this = this;

        const dom = this.dom;

        // Create elements
        const custom0 = dom.comment( 'CustomPanel' );
        const child0 = {};

        // Blocks
        const child0Blocks = {};

        // Extra render actions
        this.onRender = () => {
            insert(
                _this,
                custom0,
                child0,
                CustomPanel,
                { 'title': 'string', 'content': 'text' },
                _this,
                child0Blocks
            );
        };

        // Set root nodes
        this.nodes = [ custom0 ];
    }
}

it( 'render', () => {
    renderComponent( custom );
    expectRenderedHTML( '<h1>string</h1><div>text</div><!--CustomPanel-->' );
} );

it( 're-render', () => {
    const DI = renderComponent( custom, {
        ID: 'custom'
    } );
    DI.resolve( 'sham-ui:store' ).byId.get( 'custom' ).render();
    expectRenderedHTML( '<h1>string</h1><div>text</div><!--CustomPanel-->' );
} );

it( 'destroy', () => {
    const DI = renderComponent( custom, {
        ID: 'custom'
    } );
    DI.resolve( 'sham-ui:store' ).byId.get( 'custom' ).remove();
    expectRenderedHTML( '' );
} );

it( 'needUpdateAfterRender (issue #42)', () => {
    const originalOnUpdate = CustomPanel.prototype.onUpdate;
    const updateFn = jest.fn();
    CustomPanel.prototype.onUpdate = function() {
        updateFn();
        originalOnUpdate.apply( this, arguments );
    };
    const DI = renderComponent( custom, {
        ID: 'custom'
    } );
    expect( updateFn ).toHaveBeenCalledTimes( 1 );
    DI.resolve( 'sham-ui:store' ).byId.get( 'custom' ).update();
    expect( updateFn ).toHaveBeenCalledTimes( 1 );
    CustomPanel.prototype.onUpdate = originalOnUpdate;
} );


it( 'needUpdateAfterRender work with UI', () => {
    const originalOnUpdate = CustomPanel.prototype.onUpdate;
    const updateFn = jest.fn();
    CustomPanel.prototype.onUpdate = function() {
        updateFn( this.ID );
        originalOnUpdate.apply( this, arguments );
    };
    const DI = renderComponent( custom, {
        ID: 'custom'
    } );
    const customPanelID = updateFn.mock.calls[ 0 ][ 0 ];
    expect( updateFn ).toHaveBeenCalledTimes( 1 );
    DI.resolve( 'sham-ui:store' ).byId.get( customPanelID ).update();
    expect( updateFn ).toHaveBeenCalledTimes( 2 );
    CustomPanel.prototype.onUpdate = originalOnUpdate;
} );
