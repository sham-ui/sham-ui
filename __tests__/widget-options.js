import { Widget, options } from '../src/shamUI';
import { renderWidget, expectRenderedText } from './helpers';

class Label extends Widget {
    @options
    text() {
        return this.ID;
    }
    render() {
        this.container.textContent = this.options.text.call( this );
    }
}

class OverrideDefaultOptions extends Label {
    @options
    text() {
        return 'override';
    }
}

it( 'override default options', async() => {
    expect.assertions( 1 );
    await renderWidget( OverrideDefaultOptions );
    expectRenderedText( 'override' );
} );

it( 'override widget options in params', async() => {
    expect.assertions( 1 );
    await renderWidget( OverrideDefaultOptions, {
        text() {
            return 'override-from-constructor-args';
        }
    } );
    expectRenderedText( 'override-from-constructor-args' );
} );


it( 'extend widget without override options', async() => {
    expect.assertions( 1 );
    class ExtendWithoutOverride extends Label {}
    await renderWidget( ExtendWithoutOverride );
    expectRenderedText( 'dummy' );
} );


it( 'extend widget (two level)', async() => {
    expect.assertions( 1 );
    class ExtendTwoLevel extends OverrideDefaultOptions {
        @options
        text() {
            return 'two level';
        }
    }
    await renderWidget( ExtendTwoLevel );
    expectRenderedText( 'two level' );
} );

it( 'call super (two level)', async() => {
    expect.assertions( 1 );
    class ExtendTwoLevel extends OverrideDefaultOptions {
        @options
        text() {
            return super.text() + ' and extend';
        }
    }
    await renderWidget( ExtendTwoLevel );
    expectRenderedText( 'override and extend' );
} );
