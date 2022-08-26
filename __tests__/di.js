import { Component, start, createDI, createRootContext } from '../src/index';

it( 'without component-binder', () => {
    const render = jest.fn();
    class Label extends Component( function() {
        this.isRoot = true;
    } ) {
        render() {
            render();
            this.ctx.container.innerHTML = 'label text';
        }
    }
    const DI = createDI();
    new Label( createRootContext( {
        DI,
        ID: 'simple-label-component-text',
        container: document.querySelector( 'body' )
    } ) );
    start( DI );
    expect( document.querySelector( 'body' ).innerHTML ).toBe( 'label text' );
    expect( render ).toHaveBeenCalledTimes( 1 );
} );

it( 'container hasn\t item', () => {
    expect( createDI().resolve( 'foo' ) ).toBeUndefined();
} );
