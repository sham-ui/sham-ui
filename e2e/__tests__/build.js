import ShamUI, { DI, Component } from 'sham-ui';

it( 'dummy label', async() => {
    expect.assertions( 1 );
    class Label extends Component {
        render() {
            this.container.textContent = this.ID;
        }
    }
    DI.bind( 'component-binder', function() {
        new Label( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
    } );
    await new Promise( resolve => {
        const UI = new ShamUI();
        UI.render.one( 'RenderComplete', resolve );
        UI.render.ALL();
    } );
    expect( document.querySelector( 'body' ).textContent ).toBe( 'dummy' );
} );
