import { Component, start } from 'sham-ui';

it( 'dummy label', () => {
    class Label extends Component {
        render() {
            this.container.textContent = this.ID;
        }
    }
    new Label( {
        ID: 'dummy',
        container: document.querySelector( 'body' )
    } );
    start();
    expect( document.querySelector( 'body' ).textContent ).toBe( 'dummy' );
} );
