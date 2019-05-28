import ShamUI, { DI, Component, options, FsmStates } from '../src/shamUI';
import { onEvent } from './helpers';

beforeEach( () => {
    document.querySelector( 'body' ).innerHTML = [
        '<span id="label-1"></span>',
        '<span id="label-2"></span>'
    ].join( '\n' );
    DI.bind( 'state:rendering', class extends FsmStates.rendering {
        renderComponent( component ) {
            super.renderComponent( ...arguments );
            this.emit( `RenderComplete[${component.ID}]`, component.ID );
        }
    } );
} );

function onComponentRenderComplete( componentId, callback ) {
    return new Promise( resolve => {
        DI.resolve( 'sham-ui' ).render.one( `RenderComplete[${componentId}]`, () => {
            callback();
            resolve();
        } );
    } );
}

function expectLabelText( selector, expected ) {
    expect( document.querySelector( selector ).textContent ).toBe( expected );
}

class Label extends Component {
    render() {
        this.container.innerHTML = this.ID;
    }
}

it( 'dynamic component rendered', async() => {
    expect.assertions( 2 );
    DI.bind( 'component-binder', () => {
        new Label( {
            ID: 'label-1',
            containerSelector: '#label-1'
        } );
        setTimeout( () => {
            new Label( {
                ID: 'label-2',
                containerSelector: '#label-2'
            } );
            DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'label-2' );
        }, 20 );
    } );
    await onEvent( 'RenderComplete[label-2]' );
    expectLabelText( '#label-1', 'label-1' );
    expectLabelText( '#label-2', 'label-2' );
} );

it( 'registration on rendering', async() => {
    expect.assertions( 4 );
    DI.bind( 'component-binder', () => {
        class Container extends Component {
            render() {
                new Label( {
                    ID: 'label-2',
                    containerSelector: '#label-2'
                } );
                DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'label-2' );
                this.container.innerHTML = this.ID;
            }
        }
        new Container( {
            ID: 'label-1',
            containerSelector: '#label-1'
        } );
    } );
    const UI = new ShamUI();
    const label1Rendered = onComponentRenderComplete( 'label-1', () => {
        expectLabelText( '#label-2', 'label-2' );
        expectLabelText( '#label-1', 'label-1' );
    } );
    const label2Rendered = onComponentRenderComplete( 'label-2', () => {
        expectLabelText( '#label-2', 'label-2' );
        expectLabelText( '#label-1', '' );
    } );
    UI.render.ALL();
    await Promise.all( [ label1Rendered, label2Rendered ] );
} );

it( 'registration on rendering (render text from options)', async() => {
    expect.assertions( 4 );
    DI.bind( 'component-binder', () => {
        class InnerLabel extends Component {
            @options parentComponentId = null;
            render() {
                this.container.innerHTML = `${this.options.parentComponentId} => ${this.ID}`;
            }
        }
        class Container extends Component {
            @options get componentID() {
                return this.options.uniqID;
            }
            render() {
                new InnerLabel( {
                    ID: 'label-2',
                    containerSelector: '#label-2',
                    parentComponentId: this.options.componentID
                } );
                DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'label-2' );
                this.container.innerHTML = this.ID;
            }
        }
        new Container( {
            ID: 'label-1',
            containerSelector: '#label-1',
            uniqID: 'label-1'
        } );
    } );
    const UI = new ShamUI();
    const label1Rendered = onComponentRenderComplete( 'label-1', () => {
        expectLabelText( '#label-2', 'label-1 => label-2' );
        expectLabelText( '#label-1', 'label-1' );
    } );
    const label2Rendered = onComponentRenderComplete( 'label-2', () => {
        expectLabelText( '#label-2', 'label-1 => label-2' );
        expectLabelText( '#label-1', '' );
    } );
    UI.render.ALL();
    await Promise.all( [ label1Rendered, label2Rendered ] );
} );
