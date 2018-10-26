import { DI, Widget } from '../src/shamUI';
import { renderWidget, renderApp } from './helpers';

it( 'bindEvents', async() => {
    expect.assertions( 1 );
    class Dummy extends Widget {
        bindEvents() {
            expect( this.container ).toBeInstanceOf( Element );
        }
    }
    await renderWidget( Dummy );
} );

it( 'render', async() => {
    expect.assertions( 1 );
    class Dummy extends Widget {
        render() {
            expect( this.container ).toBeInstanceOf( Element );
        }
    }
    await renderWidget( Dummy );
} );

it( 'empty widget', async() => {
    expect.assertions( 1 );
    class Dummy extends Widget {}
    let widget;
    DI.bind( 'widget-binder', () => {
        widget = new Dummy( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
    } );
    await renderApp();
    expect( widget.container ).toBeInstanceOf( Element );
} );
