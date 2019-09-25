import { Component, start } from '../src/index';
import { renderComponent } from './helpers';

it( 'render', () => {
    class Dummy extends Component {
        render() {
            expect( this.container ).toBeInstanceOf( Element );
        }
    }
    renderComponent( Dummy );
} );

it( 'empty component', () => {
    class Dummy extends Component {}
    let component = new Dummy( {
        ID: 'dummy',
        container: document.querySelector( 'body' )
    } );
    start();
    expect( component.container ).toBeInstanceOf( Element );
} );
