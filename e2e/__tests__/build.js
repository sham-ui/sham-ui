import ShamUI, { Component } from 'sham-ui';

it( 'dummy label', () => {
    class Label extends Component {
        render() {
            this.container.textContent = this.ID;
        }
    }
    const UI = new ShamUI();
    new Label( {
        ID: 'dummy',
        container: document.querySelector( 'body' )
    } );
    UI.render.ALL();
    expect( document.querySelector( 'body' ).textContent ).toBe( 'dummy' );
} );
