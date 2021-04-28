import { Component, start, createDI } from '../src/index';

it( 'without component-binder', () => {
    const render = jest.fn();
    class Label extends Component() {
        render() {
            render();
            this.container.innerHTML = 'label text';
        }
    }
    const DI = createDI();
    new Label( {
        DI,
        ID: 'simple-label-component-text',
        container: document.querySelector( 'body' )
    } );
    start( DI );
    expect( document.querySelector( 'body' ).innerHTML ).toBe( 'label text' );
    expect( render ).toHaveBeenCalledTimes( 1 );
} );

it( 'container hasn\t item', () => {
    expect( createDI().resolve( 'foo' ) ).toBeUndefined();
} );
