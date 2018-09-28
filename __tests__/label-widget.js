import ShamUI, { DI, Widget } from '../src/shamUI';
import { renderWidget, expectRenderedText } from './helpers';

class Label extends Widget {
    html() {
        return this.ID;
    }
}

it( 'first render (ALL)', async() => {
    expect.assertions( 1 );
    await renderWidget( Label );
    expectRenderedText( 'dummy' );
} );

it( 'first render (ONLY_IDS)', async() => {
    expect.assertions( 1 );
    DI.bind( 'widget-binder', function() {
        new Label( 'body', 'dummy' );
    } );
    await new Promise( resolve => {
        const UI = new ShamUI();
        UI.render.one( 'RenderComplete', resolve );
        UI.render.ONLY_IDS( 'dummy' );
    } );
    expectRenderedText( 'dummy' );
} );
