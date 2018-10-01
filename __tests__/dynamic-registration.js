import ShamUI, { DI, Widget } from '../src/shamUI';
import { onEvent } from './helpers';

beforeEach( () => {
    document.querySelector( 'body' ).innerHTML = [
        '<span id="label-1"></span>',
        '<span id="label-2"></span>'
    ].join( '\n' );
} );

afterEach( () => {
    document.querySelector( 'body' ).innerHTML = '';
} );

function onWidgetRenderComplete( widgetId, callback ) {
    return new Promise( resolve => {
        DI.resolve( 'sham-ui' ).render.one( `RenderComplete[${widgetId}]`, () => {
            callback();
            resolve();
        } );
    } );
}

function expectLabelText( selector, expected ) {
    expect( document.querySelector( selector ).textContent ).toBe( expected );
}

class Label extends Widget {
    html() {
        return this.ID;
    }
}

it( 'dynamic widget rendered', async() => {
    expect.assertions( 2 );
    DI.bind( 'widget-binder', () => {
        new Label( '#label-1', 'label-1' );
        setTimeout( () => {
            new Label( '#label-2', 'label-2', {
                afterRegister() {
                    this.UI.render.ONLY_IDS( this.ID );
                }
            } );
        }, 20 );
    } );
    await onEvent( 'RenderComplete[label-2]' );
    expectLabelText( '#label-1', 'label-1' );
    expectLabelText( '#label-2', 'label-2' );
} );

it( 'registration on rendering', async() => {
    expect.assertions( 4 );
    DI.bind( 'widget-binder', () => {
        class Container extends Widget {
            html() {
                new Label( '#label-2', 'label-2', {
                    afterRegister() {
                        this.UI.render.ONLY_IDS( this.ID );
                    }
                } );
                return this.ID;
            }
        }
        new Container( '#label-1', 'label-1' );
    } );
    const UI = new ShamUI();
    const label1Rendered = onWidgetRenderComplete( 'label-1', () => {
        expectLabelText( '#label-2', 'label-2' );
        expectLabelText( '#label-1', 'label-1' );
    } );
    const label2Rendered = onWidgetRenderComplete( 'label-2', () => {
        expectLabelText( '#label-2', 'label-2' );
        expectLabelText( '#label-1', '' );
    } );
    UI.render.ALL();
    await Promise.all( [ label1Rendered, label2Rendered ] );
} );
