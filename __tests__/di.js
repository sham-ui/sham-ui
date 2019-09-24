import { DI, Component } from '../src/shamUI';
import { renderApp } from './helpers';

afterEach( () => {
    DI.bind( 'service', undefined );
} );

function makeBinding( onRender ) {
    return function() {
        class Label extends Component {
            render() {
                if ( undefined !== onRender ) {
                    onRender();
                }
                this.container.innerHTML = 'label text';
            }
        }
        new Label( {
            ID: 'simple-label-component-text',
            container: document.querySelector( 'body' )
        } );
    };
}

it( 'without component-binder', () => {
    const render = jest.fn();
    renderApp( makeBinding( render ) );
    expect( document.querySelector( 'body' ).innerHTML ).toBe( 'label text' );
    expect( render ).toHaveBeenCalledTimes( 1 );
} );

it( 'container hasn\t item', () => {
    expect( DI.resolve( 'foo' ) ).toBeUndefined();
} );
