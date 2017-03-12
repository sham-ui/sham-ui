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

    describe( 'FSM events', function() {
        let callTrace = [];

        DI.bind( 'widget-binder', binding );

        const UI = new shamUI();

        it( 'RenderComplete', ( done ) => {
            UI.render.one( 'RenderComplete', () => {
                callTrace.push( 'RenderComplete' );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Ready', ( done ) => {
            UI.render.one( 'Ready', () => {
                expect( callTrace ).to.eql( [
                                                'RenderComplete'
                                            ] );
                callTrace.push( 'Ready' );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'RegistrationComplete', ( done ) => {
            UI.render.one( 'RegistrationComplete', () => {
                expect( callTrace ).to.eql( [
                                                'RenderComplete',
                                                'Ready'
                                            ] );
                callTrace.push( 'RegistrationComplete' );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'RenderComplete (only once widget)', ( done ) => {
            UI.render.one( 'RenderComplete[widget-text]', () => {
                expect( callTrace ).to.eql( [
                                                'RenderComplete',
                                                'Ready',
                                                'RegistrationComplete'
                                            ] );
                callTrace.push( 'RenderComplete' );
                done();
            } );
            UI.render.ALL();
        } );
    } );

    if ( window.mochaPhantomJS ) {
        mochaPhantomJS.run();
    } else {
        mocha.run();
    }
};