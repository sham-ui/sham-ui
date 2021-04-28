import { Component, start, createDI } from '../src/index';
import { renderComponent } from './helpers';

it( 'render', () => {
    class Dummy extends Component() {
        render() {
            expect( this.container ).toBeInstanceOf( Element );
        }
    }
    renderComponent( Dummy );
} );

it( 'empty component', () => {
    const DI = createDI();
    class Dummy extends Component() {}
    const component = new Dummy( {
        DI,
        ID: 'dummy',
        container: document.querySelector( 'body' )
    } );
    start( DI );
    expect( component.container ).toBeInstanceOf( Element );
} );
