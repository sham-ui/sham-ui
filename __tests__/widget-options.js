import { Widget, options, DI } from '../src/shamUI';
import { renderWidget, expectRenderedText, onRenderComplete } from './helpers';

class Label extends Widget {
    @options
    text() {
        return this.ID;
    }
    render() {
        let text = this.options.text;
        if ( 'function' === typeof text ) {
            text = text.call( this );
        }
        this.container.textContent = text;
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

it( 'throw error on static', async() => {
    expect.assertions( 1 );
    try {
        class ThrowError extends Widget {
            @options
            static text() {
                return 'text';
            }
        }
        await renderWidget( ThrowError );
    } catch ( e ) {
        expect( e.message ).toEqual(
            expect.stringContaining( 'static options don\'t allow. Name: text, target:' )
        );
    }
} );

it( 'ovveride method with instance prop', async() => {
    expect.assertions( 1 );
    class Dummy extends Label {
        @options text = 'instance text';
    }
    await renderWidget( Dummy );
    expectRenderedText( 'instance text' );
} );

it( 'context is a widget (getter)', async() => {
    expect.assertions( 1 );
    class Dummy extends Widget {
        get age() {
            return 27;
        }

        @options firstName = 'John';
        @options lastName ='Smith';
        @options
        get fullName() {
            return `${this.options.firstName} ${this.options.lastName} (${this.age})`;
        }
        render() {
            this.container.textContent = this.options.fullName;
        }
    }
    await renderWidget( Dummy );
    expectRenderedText( 'John Smith (27)' );
} );

it( 'context is a widget (method)', async() => {
    expect.assertions( 1 );
    class Dummy extends Widget {
        age() {
            return 27;
        }

        @options firstName = 'John';
        @options lastName ='Smith';
        @options
        fullName() {
            return `${this.options.firstName} ${this.options.lastName} (${this.age()})`;
        }
        render() {
            this.container.textContent = this.options.fullName();
        }
    }
    await renderWidget( Dummy );
    expectRenderedText( 'John Smith (27)' );
} );


it( 'context is a not widget (pass as constructor argument)', async() => {
    expect.assertions( 2 );
    class Dummy extends Widget {
        @options firstName = 'John';
        @options lastName ='Smith';
        @options fullName() {}

        render() {
            this.container.textContent = this.options.fullName();
        }
    }
    await renderWidget( Dummy, {
        fullName() {
            expect( this instanceof Dummy ).toBe( false );
            return 'Test';
        }
    } );
    expectRenderedText( 'Test' );
} );

it( 'getter & setter together', async() => {
    expect.assertions( 4 );
    class Dummy extends Widget {
        @options
        get text() {
            return this._text;
        }

        @options
        set text( value ) {
            this._text = value;
        }

        render() {
            this.container.textContent = this.options.text;
        }
    }
    await renderWidget( Dummy );
    expectRenderedText( '' );
    const widget = DI.resolve( 'sham-ui:store' ).findById( 'dummy' );
    widget.options.text = 'test text';
    expect( widget._text ).toBe( 'test text' );
    expect( widget.options.text ).toBe( 'test text' );
    await onRenderComplete( UI => UI.render.ONLY_IDS( 'dummy' ) );
    expect( document.querySelector( 'body' ).textContent ).toBe( 'test text' );
} );
