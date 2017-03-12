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

    describe( 'Dependency injection', function() {
        DI.bind( 'logger', {
            log() {}
        } );

        it( 'widget-binder', ( done ) => {
            DI.bind( 'widget-binder', binding );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete', () => {
                expect( document.querySelector( '#label-container' ).innerHTML ).to.be.equal(
                    'simple-label-widget-text'
                );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'state:ready', ( done ) => {
            DI.bind( 'widget-binder', binding );
            let processed = false;
            class ExtendedReadyState extends FsmStates.ready {
                _onEnter() {
                    super._onEnter( ...arguments );
                    processed = true;
                }
            }
            DI.bind( 'state:ready', ExtendedReadyState );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete', () => {
                expect( processed ).to.be.equal( true );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'state:registration', ( done ) => {
            DI.bind( 'widget-binder', binding );
            class ExtendedRegistrationState extends FsmStates.registration {
                register( widget ) {
                    expect( widget.ID ).to.be.equal( 'simple-label-widget-text' );
                    super.register( ...arguments );
                }
            }
            DI.bind( 'state:registration', ExtendedRegistrationState );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete', () => {
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'state:rendering', ( done ) => {
            DI.bind( 'widget-binder', binding );
            class ExtendedRenderingState extends FsmStates.rendering {
                renderWidget( widget ) {
                    expect( widget.ID ).to.be.equal( 'simple-label-widget-text' );
                    super.renderWidget( ...arguments );
                }
            }
            DI.bind( 'state:rendering', ExtendedRenderingState );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete', () => {
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'fsm', ( done ) => {
            DI.bind( 'widget-binder', binding );
            let processed = false;
            class ExtendedFSM extends Fsm {
                FORCE_ALL() {
                    processed = true;
                    super.FORCE_ALL( ...arguments );
                }
            }
            DI.bind( 'fsm', ExtendedFSM );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete', () => {
                expect( processed ).to.be.equal( true );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'logger', ( done ) => {
            DI.bind( 'widget-binder', binding );
            DI.bind( 'logger', {
                log( message ) {
                    expect( message ).to.be.equal( 'Logged message' );
                }
            } );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete', () => {
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