import { Component, start, createDI, createRootContext } from '../src/index';
import { renderComponent } from './helpers';

it( 'render', () => {
    class Dummy extends Component( function() {
        this.isRoot = true;
    } ) {
        render() {
            expect( this.ctx.container ).toBeInstanceOf( Element );
        }
    }
    renderComponent( Dummy );
} );

it( 'empty component', () => {
    const DI = createDI();
    class Dummy extends Component( function() {
        this.isRoot = true;
    } ) {}
    const component = new Dummy( createRootContext( {
        DI,
        ID: 'dummy',
        container: document.querySelector( 'body' )
    } ) );
    start( DI );
    expect( component.ctx.container ).toBeInstanceOf( Element );
} );
