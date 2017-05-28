import shamUI from '../../src/shamUI';
import { DI } from '../../src/shamUI'
import bindings from './bindings';

DI.bind( 'widget-binder', bindings );

const $ = ( selector ) => document.querySelector( selector );

function click( selector ) {
    const node = $( selector );
    if ( document.createEvent ) {
        const evt = document.createEvent( 'MouseEvents' );
        evt.initEvent( 'click', true, false );
        node.dispatchEvent( evt );
    } else if ( document.createEventObject ) {
        node.fireEvent( 'onclick' );
    } else if ( typeof node.onclick === 'function' ) {
        node.onclick();
    }
}

window.onload = function() {
    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
        asyncOnly: true
    } );

    const expect = chai.expect;

    const UI = new shamUI();

    describe( 'Widget event handlers decorator', () => {
        it( 'Handler defined in widget', ( done ) => {
            const ID = 'widget-defined-handler';
            UI.render.one( `RenderComplete[${ID}]`, () => {
                click( `#${ID}` );
                const widget = DI.resolve( ID );
                expect( widget.labelClicked ).to.be.equal( true );
                widget.labelClicked = false;
                UI.render.one( `RenderComplete[${ID}]`, () => {
                    click( `#${ID}` );
                    expect( widget.labelClicked ).to.be.equal( true );
                    done();
                } );
                UI.render.ONLY( ID );
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Overriden handler defined in widget', ( done ) => {
            const ID = 'widget-with-override';
            UI.render.one( `RenderComplete[${ID}]`, () => {
                click( `#${ID}` );
                const widget = DI.resolve( ID );
                expect( widget.labelClicked ).to.be.equal( true );
                expect( widget.overrideHandlerClicked ).to.be.equal( true );
                widget.labelClicked = false;
                widget.overrideHandlerClicked = false;

                UI.render.one( `RenderComplete[${ID}]`, () => {
                    click( `#${ID}` );
                    expect( widget.labelClicked ).to.be.equal( true );
                    expect( widget.overrideHandlerClicked ).to.be.equal( true );
                    done();
                } );
                UI.render.ONLY( ID );
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Handler defined in widget default option', ( done ) => {
            const ID = 'widget-with-handler-in-option';
            UI.render.one( `RenderComplete[${ID}]`, () => {
                click( `#${ID}` );
                const widget = DI.resolve( ID );
                expect( widget.labelClicked ).to.be.equal( true );
                expect( widget.handlerWithOptionClicked ).to.be.equal( true );
                widget.labelClicked = false;
                widget.handlerWithOptionClicked = false;

                UI.render.one( `RenderComplete[${ID}]`, () => {
                    click( `#${ID}` );
                    expect( widget.labelClicked ).to.be.equal( true );
                    expect( widget.handlerWithOptionClicked ).to.be.equal( true );
                    done();
                } );
                UI.render.ONLY( ID );
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Handler defined in widget default option and passed on init', ( done ) => {
            const ID = 'widget-with-handler-in-option-passed-from-option';
            UI.render.one( `RenderComplete[${ID}]`, () => {
                click( `#${ID}` );
                const widget = DI.resolve( ID );
                expect( widget.handlerWithOptionFromInitializeClicked ).to.be.equal( true );
                widget.handlerWithOptionFromInitializeClicked = false;

                UI.render.one( `RenderComplete[${ID}]`, () => {
                    click( `#${ID}` );
                    expect( widget.handlerWithOptionFromInitializeClicked ).to.be.equal( true );
                    done();
                } );
                UI.render.ONLY( ID );
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Handler with sub-selector', ( done ) => {
            const ID = 'widget-sub-selector';
            UI.render.one( `RenderComplete[${ID}]`, () => {
                click( `#${ID}` );
                const widget = DI.resolve( ID );
                expect( widget.subElementClicked ).to.be.equal( true );
                widget.subElementClicked = false;

                UI.render.one( `RenderComplete[${ID}]`, () => {
                    click( `#${ID}` );
                    expect( widget.subElementClicked ).to.be.equal( true );
                    done();
                } );
                UI.render.ONLY( ID );
            } );
            UI.render.FORCE_ALL();
        } );
    } );

    if ( window.mochaPhantomJS ) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
};