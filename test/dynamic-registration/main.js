import shamUI from '../../src/shamUI';
import { DI } from '../../src/shamUI';
import binding from './bindings';


window.onload = function() {
    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
                     asyncOnly: true
                 } );

    const expect = chai.expect;

    describe( 'Dynamic widget registration', function() {
        it( 'Dynamic widget rendered', ( done ) => {
            DI.bind( 'widget-binder', binding );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete[label-2]', () => {
                expect( document.querySelector( '#label-2' ).innerHTML ).to.be.equal(
                    'label-2'
                );
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