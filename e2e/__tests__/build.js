import { Component, start, createDI } from 'sham-ui';

it( 'dummy label', () => {
    const DI = createDI();
    class Label extends Component {
        render() {
            this.container.textContent = this.ID;
        }
    }
    new Label( {
        DI,
        ID: 'dummy',
        container: document.querySelector( 'body' )
    } );
    start( DI );
    expect( document.querySelector( 'body' ).textContent ).toBe( 'dummy' );
} );
