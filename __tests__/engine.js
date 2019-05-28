import { renderComponent, expectRenderedText } from './helpers';
import { DI, Component, options } from '../src/shamUI';
import RenderingState from '../src/engine/states/rendering';

it( 'raf for rendering', async() => {
    expect.assertions( 5 );
    const stackWatcher = jest.fn();
    class RAFRenderingState extends RenderingState {
        renderChangedComponents() {
            stackWatcher( 'before' );
            window.requestAnimationFrame( super.renderChangedComponents.bind( this ) );
            stackWatcher( 'after' );
        }
    }
    DI.bind( 'state:rendering', RAFRenderingState );
    class Label extends Component {
        @options text = '';

        render() {
            stackWatcher( 'render' );
            this.container.innerHTML = this.options.text;
        }
    }
    await renderComponent( Label, { text: 'label text' } );
    expectRenderedText( 'label text' );
    expect( stackWatcher ).toHaveBeenCalledTimes( 3 );
    expect( stackWatcher ).toHaveBeenNthCalledWith( 1, 'before' );
    expect( stackWatcher ).toHaveBeenNthCalledWith( 2, 'after' );
    expect( stackWatcher ).toHaveBeenNthCalledWith( 3, 'render' );
} );
