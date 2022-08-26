import { Component, start, createDI, createRootContext } from 'sham-ui';

it( 'dummy label', () => {
    const DI = createDI();
    const ctx = createRootContext( {
        DI,
        ID: 'dummy',
        container: document.querySelector( 'body' )
    } );
    class Label extends Component() {
        render() {
            this.ctx.container.textContent = this.ID;
        }
    }
    new Label( ctx );
    start( DI );
    expect( document.querySelector( 'body' ).textContent ).toBe( 'dummy' );
} );
