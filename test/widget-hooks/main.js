import shamUI from '../../src/shamUI';
import { DI } from '../../src/shamUI';
import { Widget } from '../../src/shamUI';

class Label extends Widget {
    html() {
        return this.ID;
    }
    bindEvents() {

    }
    destroy() {

    }
}

window.onload = function() {
    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
        asyncOnly: true
    } );

    const expect = chai.expect;

    describe( 'Widget hooks', function() {
        let callTrace = [];

        DI.bind( 'widget-binder', function() {
            new Label( '#label-container', 'widget-with-hooks', {
                beforeRegister() {
                    callTrace.push( 'beforeRegister' );
                },
                afterRegister() {
                    callTrace.push( 'afterRegister' );
                },
                beforeRender() {
                    callTrace.push( 'beforeRender' );
                },
                afterRender() {
                    callTrace.push( 'afterRender' );
                },
                beforeBindEvents() {
                    callTrace.push( 'beforeBindEvents' );
                },
                afterBindEvents() {
                    callTrace.push( 'afterBindEvents' );
                },
                beforeDestroy() {
                    callTrace.push( 'beforeDestroy' );
                },
                afterDestroy() {
                    callTrace.push( 'afterDestroy' );
                }
            } );
        } );

        const UI = new shamUI();

        it( 'First render', function( done ) {
            UI.render.one( 'RenderComplete', () => {
                expect( callTrace ).to.eql( [
                                                'beforeRegister',
                                                'afterRegister',
                                                'beforeBindEvents',
                                                'afterBindEvents',
                                                'beforeRender',
                                                'afterRender'
                                            ] );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Re-render', function( done ) {
            UI.render.one( 'RenderComplete', () => {
                expect( callTrace ).to.eql( [
                                                'beforeRegister',
                                                'afterRegister',
                                                'beforeBindEvents',
                                                'afterBindEvents',
                                                'beforeRender',
                                                'afterRender',
                                                'beforeRender',
                                                'afterRender'
                                            ] );
                done();
            } );
            UI.render.ALL();
        } );

        it( 'Re-register', function( done ) {
            UI.render.one( 'RenderComplete', () => {
                expect( callTrace ).to.eql( [
                                                'beforeRegister',
                                                'afterRegister',
                                                'beforeBindEvents',
                                                'afterBindEvents',
                                                'beforeRender',
                                                'afterRender',
                                                'beforeRender',
                                                'afterRender',
                                                'beforeDestroy',
                                                'afterDestroy',
                                                'beforeRegister',
                                                'afterRegister',
                                                'beforeBindEvents',
                                                'afterBindEvents',
                                                'beforeRender',
                                                'afterRender'
                                            ] );
                done();
            } );
            UI.render.FORCE_ALL();
        } );

        it( 'Re-render after second register', function( done ) {
            UI.render.one( 'RenderComplete', () => {
                expect( callTrace ).to.eql( [
                                                'beforeRegister',
                                                'afterRegister',
                                                'beforeBindEvents',
                                                'afterBindEvents',
                                                'beforeRender',
                                                'afterRender',
                                                'beforeRender',
                                                'afterRender',
                                                'beforeDestroy',
                                                'afterDestroy',
                                                'beforeRegister',
                                                'afterRegister',
                                                'beforeBindEvents',
                                                'afterBindEvents',
                                                'beforeRender',
                                                'afterRender',
                                                'beforeRender',
                                                'afterRender'
                                            ] );
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