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

    describe( 'Options conflict resolver', () => {
        it( 'bindOnce & actionSequence options conflict with @handler', ( done ) => {
            const ID = 'widget-action-sequence-and-bind-once';
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
    } );

    if ( window.mochaPhantomJS ) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
};