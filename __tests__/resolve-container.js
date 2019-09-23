import { DI, Component } from '../src/shamUI';
import { renderComponent, renderApp } from './helpers';

it( 'bindEvents', async() => {
    expect.assertions( 1 );
    class Dummy extends Component {
        bindEvents() {
            expect( this.container ).toBeInstanceOf( Element );
        }
    }
    await renderComponent( Dummy );
} );

it( 'render', async() => {
    expect.assertions( 1 );
    class Dummy extends Component {
        render() {
            expect( this.container ).toBeInstanceOf( Element );
        }
    }
    await renderComponent( Dummy );
} );

it( 'empty component', async() => {
    expect.assertions( 1 );
    class Dummy extends Component {}
    let component;
    DI.bind( 'component-binder', () => {
        component = new Dummy( {
            ID: 'dummy',
            container: document.querySelector( 'body' )
        } );
    } );
    await renderApp();
    expect( component.container ).toBeInstanceOf( Element );
} );
