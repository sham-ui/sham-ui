import ShamUI, { DI, Widget } from '../src/shamUI';
import { expectRenderedText } from './helpers';

it( 'autostart', async() => {
    expect.assertions( 2 );
    DI.bind( 'widget-binder', () => {
        class Dummy extends Widget {
            render() {
                this.container.textContent = this.ID;
            }
        }
        new Dummy( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
    } );
    expectRenderedText( '' );
    new ShamUI( true );
    await new Promise( resolve => setImmediate( resolve ) );
    expectRenderedText( 'dummy' );
} );
