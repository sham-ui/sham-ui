import { renderWidget, expectRenderedText } from './helpers';
import { DI, Widget, options } from '../src/shamUI';
import RenderingState from '../src/engine/states/rendering';

it( 'raf for rendering', async() => {
    expect.assertions( 5 );
    const stackWatcher = jest.fn();
    class RAFRenderingState extends RenderingState {
        renderChangedWidgets() {
            stackWatcher( 'before' );
            window.requestAnimationFrame( super.renderChangedWidgets.bind( this ) );
            stackWatcher( 'after' );
        }
    }
    DI.bind( 'state:rendering', RAFRenderingState );
    class Label extends Widget {
        @options text = '';

        html() {
            stackWatcher( 'html' );
            return this.options.text;
        }
    }
    await renderWidget( Label, { text: 'label text' } );
    expectRenderedText( 'label text' );
    expect( stackWatcher ).toHaveBeenCalledTimes( 3 );
    expect( stackWatcher ).toHaveBeenNthCalledWith( 1, 'before' );
    expect( stackWatcher ).toHaveBeenNthCalledWith( 2, 'after' );
    expect( stackWatcher ).toHaveBeenNthCalledWith( 3, 'html' );
} );
