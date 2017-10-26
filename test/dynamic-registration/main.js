import shamUI from '../../src/shamUI';
import { DI } from '../../src/shamUI';
import { Widget } from '../../src/shamUI';

class Label extends Widget {
    html() {
        return this.ID;
    }
}

mocha.ui( 'bdd' );
mocha.reporter( 'html' );
mocha.setup( {
                 asyncOnly: true
             } );

const expect = chai.expect;

describe( 'Dynamic widget registration', function() {
    beforeEach( () => {
        [
            '#label-1',
            '#label-2'
        ].forEach( selector => {
            document.querySelector( selector ).innerHTML = '';
        } )
    } );


    it( 'Dynamic widget rendered', ( done ) => {
        DI.bind( 'widget-binder', () => {
            new Label( "#label-1", "label-1" );

            setTimeout( () => {
                new Label( "#label-2", "label-2", {
                    afterRegister() {
                        this.UI.render.ONLY( this.ID );
                    }
                } );
            }, 20 );
        } );
        const UI = new shamUI();
        UI.render.one( 'RenderComplete[label-2]', () => {
            expect( document.querySelector( '#label-2' ).innerHTML ).to.be.equal(
                'label-2'
            );
            done();
        } );

        UI.render.FORCE_ALL();
    } );

    it( 'Registration on rendering', ( done ) => {
        DI.bind( 'widget-binder', () => {
            class Container extends Widget {
                html() {
                    new Label( '#label-2', 'label-2', {
                        afterRegister() {
                            this.UI.render.ONLY( this.ID );
                        }
                    } );
                    return this.ID;
                }
            }

            new Container( '#label-1', 'label-1' );
        } );

        const UI = new shamUI();

        UI.render.one( 'RenderComplete[label-2]', () => {
            expect( document.querySelector( '#label-2' ).innerHTML ).to.be.equal(
                'label-2'
            );
            expect( document.querySelector( '#label-1' ).innerHTML ).to.be.equal(
                ''
            );
            done();
        } );

        UI.render.one( 'RenderComplete[label-1]', () => {
            expect( document.querySelector( '#label-2' ).innerHTML ).to.be.equal(
                ''
            );
            expect( document.querySelector( '#label-1' ).innerHTML ).to.be.equal(
                'label-1'
            );
        } );

        UI.render.FORCE_ALL();
    } );
} );

if ( window.mochaPhantomJS ) {
    mochaPhantomJS.run();
} else {
    mocha.run();
}
