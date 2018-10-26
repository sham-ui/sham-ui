import ShamUI, { DI, Widget, options } from '../src/shamUI';
import { onEvent } from './helpers';

beforeEach( () => {
    document.querySelector( 'body' ).innerHTML = [
        '<span id="label-1"></span>',
        '<span id="label-2"></span>'
    ].join( '\n' );
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
        new Label( {
            ID: 'label-1',
            containerSelector: '#label-1'
        } );
        setTimeout( () => {
            new Label( {
                ID: 'label-2',
                containerSelector: '#label-2',
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
                new Label( {
                    ID: 'label-2',
                    containerSelector: '#label-2',
                    afterRegister() {
                        this.UI.render.ONLY_IDS( this.ID );
                    }
                } );
                return this.ID;
            }
        }
        new Container( {
            ID: 'label-1',
            containerSelector: '#label-1'
        } );
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

it( 'registration on rendering (render text from options)', async() => {
    expect.assertions( 4 );
    DI.bind( 'widget-binder', () => {
        class InnerLabel extends Widget {
            @options parentWidgetId = null;
            html() {
                return `${this.options.parentWidgetId} => ${this.ID}`;
            }
        }
        class Container extends Widget {
            @options get widgetID() {
                return this.options.uniqID;
            }
            html() {
                new InnerLabel( {
                    ID: 'label-2',
                    containerSelector: '#label-2',
                    parentWidgetId: this.options.widgetID,
                    afterRegister() {
                        this.UI.render.ONLY_IDS( this.ID );
                    }
                } );
                return this.ID;
            }
        }
        new Container( {
            ID: 'label-1',
            containerSelector: '#label-1',
            uniqID: 'label-1'
        } );
    } );
    const UI = new ShamUI();
    const label1Rendered = onWidgetRenderComplete( 'label-1', () => {
        expectLabelText( '#label-2', 'label-1 => label-2' );
        expectLabelText( '#label-1', 'label-1' );
    } );
    const label2Rendered = onWidgetRenderComplete( 'label-2', () => {
        expectLabelText( '#label-2', 'label-1 => label-2' );
        expectLabelText( '#label-1', '' );
    } );
    UI.render.ALL();
    await Promise.all( [ label1Rendered, label2Rendered ] );
} );
