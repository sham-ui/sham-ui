import shamUI from '../../src/shamUI';
import { DI } from '../../src/shamUI';
import bindings from './bindings';

DI.bind( 'widget-binder', bindings );

const $ = ( selector ) => document.querySelector( selector );

window.onload = function() {
    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
        asyncOnly: true
    } );

    const expect = chai.expect;

    const itRendered = () => expect( $( '#label-container' ).innerHTML ).to.be
        .equal( 'simple-label-widget-text' );

    const UI = new shamUI();

    describe( 'Label widget', function() {

        it( 'First render (ALL)', function( done ) {
            UI.render.one( 'RenderComplete', function() {
                itRendered();
                done();
            } );
            UI.render.ALL();
        } );

        it( 'Render ONLY_IDS', function( done ) {
            UI.render.one( 'RenderComplete[simple-label-widget-text]', function() {
                itRendered();
                done();
            } );
            UI.render.ONLY_IDS( 'simple-label-widget-text' );
        } );
    } );

    if ( window.mochaPhantomJS ) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
};