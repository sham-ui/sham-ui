import { Component } from '../src/shamUI';
import { renderComponent, renderApp } from './helpers';

it( 'bindEvents', () => {
    class Dummy extends Component {
        bindEvents() {
            expect( this.container ).toBeInstanceOf( Element );
        }
    }
    renderComponent( Dummy );
} );

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
    let component;
    renderApp( () => {
        component = new Dummy( {
            ID: 'dummy',
            container: document.querySelector( 'body' )
        } );
    } );
    expect( component.container ).toBeInstanceOf( Element );
} );
