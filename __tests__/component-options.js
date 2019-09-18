import { Component, options, DI } from '../src/shamUI';
import { renderComponent, expectRenderedText, onRenderComplete } from './helpers';

class Label extends Component {
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
    await renderComponent( OverrideDefaultOptions );
    expectRenderedText( 'override' );
} );

it( 'override component options in params', async() => {
    expect.assertions( 1 );
    await renderComponent( OverrideDefaultOptions, {
        text() {
            return 'override-from-constructor-args';
        }
    } );
    expectRenderedText( 'override-from-constructor-args' );
} );


it( 'extend component without override options', async() => {
    expect.assertions( 1 );
    class ExtendWithoutOverride extends Label {}
    await renderComponent( ExtendWithoutOverride );
    expectRenderedText( 'dummy' );
} );


it( 'extend component (two level)', async() => {
    expect.assertions( 1 );
    class ExtendTwoLevel extends OverrideDefaultOptions {
        @options
        text() {
            return 'two level';
        }
    }
    await renderComponent( ExtendTwoLevel );
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
    await renderComponent( ExtendTwoLevel );
    expectRenderedText( 'override and extend' );
} );

it( 'throw error on static', async() => {
    expect.assertions( 1 );
    try {
        class ThrowError extends Component {
            @options
            static text() {
                return 'text';
            }
        }
        await renderComponent( ThrowError );
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
    await renderComponent( Dummy );
    expectRenderedText( 'instance text' );
} );

it( 'context is a component (getter)', async() => {
    expect.assertions( 1 );
    class Dummy extends Component {
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
    await renderComponent( Dummy );
    expectRenderedText( 'John Smith (27)' );
} );

it( 'context is a component (method)', async() => {
    expect.assertions( 1 );
    class Dummy extends Component {
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
    await renderComponent( Dummy );
    expectRenderedText( 'John Smith (27)' );
} );


it( 'context is a not component (pass as constructor argument)', async() => {
    expect.assertions( 2 );
    class Dummy extends Component {
        @options firstName = 'John';
        @options lastName ='Smith';
        @options fullName() {}

        render() {
            this.container.textContent = this.options.fullName();
        }
    }
    await renderComponent( Dummy, {
        fullName() {
            expect( this instanceof Dummy ).toBe( false );
            return 'Test';
        }
    } );
    expectRenderedText( 'Test' );
} );

it( 'getter & setter together', async() => {
    expect.assertions( 4 );
    class Dummy extends Component {
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
    await renderComponent( Dummy );
    expectRenderedText( '' );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'dummy' );
    component.options.text = 'test text';
    expect( component._text ).toBe( 'test text' );
    expect( component.options.text ).toBe( 'test text' );
    await onRenderComplete( UI => UI.render.ONLY_IDS( 'dummy' ) );
    expect( document.querySelector( 'body' ).textContent ).toBe( 'test text' );
} );


it( 'container', async() => {
    expect.assertions( 1 );
    await renderComponent( Label, {
        container: document.querySelector( 'body' ),
        text: 'text for container'
    } );
    expectRenderedText( 'text for container' );
} );

it( 'generated id', async() => {
    expect.assertions( 2 );
    await renderComponent( Label, {
        types: [ 'label' ],
        ID: null
    } );
    const ID = DI.resolve( 'sham-ui:store' ).filterByType( 'label' )[ 0 ].ID;
    expect( typeof ID ).toBe( 'string' );
    expectRenderedText( ID );
} );