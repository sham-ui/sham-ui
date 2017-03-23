import shamUI from '../../src/shamUI';
import { DI, Widget } from '../../src/shamUI';




window.onload = function() {
    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
                     asyncOnly: true
                 } );

    const expect = chai.expect;

    describe( 'Resolve container', function() {
        it( 'Non rendered', ( done ) => {
            class NonRendered extends Widget {
                bindEvents() {
                    expect( this.container.textContent ).to.be.equal( 'Non rendered' );
                    done()
                }
            }
            DI.bind( 'widget-binder', () => {
                new NonRendered( '#non-rendered', 'non-rendered' );
            } );
            const UI = new shamUI();
            UI.render.FORCE_ALL();
        } );

        it( 'Non bind', ( done ) => {
            class NonBind extends Widget {
                render() {
                    expect( this.container.textContent ).to.be.equal( 'On render' );
                    done()
                }
            }
            DI.bind( 'widget-binder', () => {
                new NonBind( '#non-bind', 'non-bind' );
            } );
            const UI = new shamUI();
            UI.render.FORCE_ALL();
        } );

        it( 'Empty widget', ( done ) => {
            class Empty extends Widget {

            }
            let widget;
            DI.bind( 'widget-binder', () => {
                widget = new Empty( '#empty', 'empty' );
            } );
            const UI = new shamUI();
            UI.render.one( 'RenderComplete', () => {
                expect( widget.container.textContent ).to.be.equal( 'Empty widget' );
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