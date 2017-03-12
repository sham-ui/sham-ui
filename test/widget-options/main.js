import shamUI from '../../src/shamUI';
import { DI } from '../../src/shamUI'
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

    const itRendered = ( selector, text ) => expect( $( selector ).innerHTML ).to.be
        .equal( text );

    const UI = new shamUI();

    describe( 'Widget options', function() {
        it( 'Override default widget options in class', function( done ) {
            UI.render.one( 'RenderComplete[label-with-override-default-options]', function() {
                itRendered( '#label-1', 'override' );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Override widget options in params', function( done ) {
            UI.render.one( 'RenderComplete[label-pass-options-as-params]', function() {
                itRendered( '#label-2', 'override-from-constructor-args' );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Extend widget without override options', function( done ) {
            UI.render.one( 'RenderComplete[extend-without-override]', function() {
                itRendered( '#label-3', 'extend-without-override' );
                done();
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