import shamUI from '../../src/shamUI';
import { DI } from '../../src/shamUI';
import { options } from '../../src/shamUI';
import { Widget } from '../../src/shamUI';

class Label extends Widget {
    html() {
        return this.ID;
    }

    @options
    static afterRender() {
        throw new Error( 'Test error' );
    }
}


window.onload = function() {
    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
        asyncOnly: true
    } );


    const expect = chai.expect;

    // Dummy logger for run test from mocha-phantomjs
    DI.bind( 'logger', { error() {} } );

    DI.bind( 'widget-binder', () => {
        new Label( '#label-container', 'simple-label-widget-text' );
    } );

    const UI = new shamUI();

    describe( 'Exceptions', () => {
        it( 'Catch exception', ( done ) => {
            UI.render.on( 'error', ( eventType, error ) => {
                expect( error.state ).to.be.equal( 'rendering' );
                expect( error.priorState ).to.be.equal( 'registration' );
                expect( error._currentAction ).to.be.equal( '' );
                expect( error._priorAction ).to.be.equal( 'rendering.renderWidget' );
                expect( error.currentActionArgs ).to.be.equal( undefined );
                expect( error.exception.message ).to.be.equal( 'Test error' );
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