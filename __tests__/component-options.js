import { Component, options, DI } from '../src/index';
import { renderComponent, expectRenderedText } from './helpers';

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

it( 'override default options', () => {
    renderComponent( OverrideDefaultOptions );
    expectRenderedText( 'override' );
} );

it( 'override component options in params', () => {
    renderComponent( OverrideDefaultOptions, {
        text() {
            return 'override-from-constructor-args';
        }
    } );
    expectRenderedText( 'override-from-constructor-args' );
} );


it( 'extend component without override options', () => {
    class ExtendWithoutOverride extends Label {}
    renderComponent( ExtendWithoutOverride );
    expectRenderedText( 'dummy' );
} );


it( 'extend component (two level)', () => {
    class ExtendTwoLevel extends OverrideDefaultOptions {
        @options
        text() {
            return 'two level';
        }
    }
    renderComponent( ExtendTwoLevel );
    expectRenderedText( 'two level' );
} );

it( 'call super (two level)', () => {
    class ExtendTwoLevel extends OverrideDefaultOptions {
        @options
        text() {
            return super.text() + ' and extend';
        }
    }
    renderComponent( ExtendTwoLevel );
    expectRenderedText( 'override and extend' );
} );

it( 'throw error on static', () => {
    try {
        class ThrowError extends Component {
            @options
            static text() {
                return 'text';
            }
        }
        renderComponent( ThrowError );
    } catch ( e ) {
        expect( e.message ).toEqual(
            expect.stringContaining( 'static options don\'t allow. Name: text, target:' )
        );
    }
} );

it( 'ovveride method with instance prop', () => {
    class Dummy extends Label {
        @options text = 'instance text';
    }
    renderComponent( Dummy );
    expectRenderedText( 'instance text' );
} );

it( 'context is a component (getter)', () => {
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
    renderComponent( Dummy );
    expectRenderedText( 'John Smith (27)' );
} );

it( 'context is a component (method)', () => {
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
    renderComponent( Dummy );
    expectRenderedText( 'John Smith (27)' );
} );


it( 'context is a not component (pass as constructor argument)', () => {
    expect.assertions( 2 );
    class Dummy extends Component {
        @options firstName = 'John';
        @options lastName ='Smith';
        @options fullName() {}

        render() {
            this.container.textContent = this.options.fullName();
        }
    }
    renderComponent( Dummy, {
        fullName() {
            expect( this instanceof Dummy ).toBe( false );
            return 'Test';
        }
    } );
    expectRenderedText( 'Test' );
} );

it( 'getter & setter together', () => {
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
    renderComponent( Dummy );
    expectRenderedText( '' );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'dummy' );
    component.options.text = 'test text';
    expect( component._text ).toBe( 'test text' );
    expect( component.options.text ).toBe( 'test text' );
    component.render();
    expect( document.querySelector( 'body' ).textContent ).toBe( 'test text' );
} );


it( 'container', () => {
    renderComponent( Label, {
        container: document.querySelector( 'body' ),
        text: 'text for container'
    } );
    expectRenderedText( 'text for container' );
} );

it( 'generated id', () => {
    renderComponent( Label, {
        ID: null
    } );
    const ID = DI.resolve( 'sham-ui:store' ).find( () => true ).ID;
    expect( typeof ID ).toBe( 'string' );
    expectRenderedText( ID );
} );
