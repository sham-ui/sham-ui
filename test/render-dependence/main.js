import shamUI from '../../src/shamUI';
import { FsmStates, DI, Fsm } from '../../src/shamUI';
import binding from './bindings';


window.onload = function() {
    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
                     asyncOnly: true
                 } );

    const expect = chai.expect;

    describe( 'Render dependence', function() {
        it( 'Order of rendering', ( done ) => {
            let rendered = [];
            DI.bind( 'widget-binder', binding );
            const UI = new shamUI();

            UI.render.one( 'RenderComplete[label-1]', () => {
                rendered.push( 'label-1' );
            } );
            UI.render.one( 'RenderComplete[label-2]', () => {
                rendered.push( 'label-2' );
            } );
            UI.render.one( 'RenderComplete[label-3]', () => {
                rendered.push( 'label-3' );
            } );
            UI.render.one( 'RenderComplete', () => {
                expect( rendered ).to.eql( [
                                                'label-3',
                                                'label-2',
                                                'label-1'
                                          ] );
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