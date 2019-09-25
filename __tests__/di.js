import { DI, Component, start } from '../src/index';

it( 'without component-binder', () => {
    const render = jest.fn();
    class Label extends Component {
        render() {
            render();
            this.container.innerHTML = 'label text';
        }
    }
    new Label( {
        ID: 'simple-label-component-text',
        container: document.querySelector( 'body' )
    } );
    start();
    expect( document.querySelector( 'body' ).innerHTML ).toBe( 'label text' );
    expect( render ).toHaveBeenCalledTimes( 1 );
} );

it( 'container hasn\t item', () => {
    expect( DI.resolve( 'foo' ) ).toBeUndefined();
} );
