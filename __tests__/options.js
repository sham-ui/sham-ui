import { Component } from '../src/index';
import { renderComponent, expectRenderedText } from './helpers';


it( 'state', () => {
    const Dummy = Component( function( options ) {
        const age = 27;
        const state = options( {
            firstName: 'John',
            lastName: 'Smith',
            fullName() {
                return `${state.firstName} ${state.lastName} (${age})`;
            }
        } );
    } );
    renderComponent( class extends Dummy {
        render() {
            this.container.textContent = this.options.fullName();
        }
    } );
    expectRenderedText( 'John Smith (27)' );
} );

it( 'context is a not component (pass as constructor argument)', () => {
    const Dummy = Component( function( options ) {
        const age = 27;
        const state = options( {
            firstName: 'John',
            lastName: 'Smith',
            fullName() {
                return `${state.firstName} ${state.lastName} (${age})`;
            }
        } );
    } );
    renderComponent( class extends Dummy {
        render() {
            this.container.textContent = this.options.fullName();
        }
    }, {
        fullName() {
            expect( this instanceof Dummy ).toBe( false );
            return 'Test';
        }
    } );
    expectRenderedText( 'Test' );
} );

it( 'getter & setter together', () => {
    const Dummy = Component( function( options ) {
        let text = '';
        options( {
            text: {
                get() {
                    return text;
                },
                set( value ) {
                    text = value;
                }
            }
        } );
    } );

    const DI = renderComponent( class extends Dummy {
        render() {
            this.container.textContent = this.options.text;
        }
    } );
    expectRenderedText( '' );
    const component = DI.resolve( 'sham-ui:store' ).byId.get( 'dummy' );
    component.options.text = 'test text';
    expect( component.options.text ).toBe( 'test text' );
    DI.resolve( 'sham-ui:store' ).byId.get( 'dummy' ).render();
    expect( document.querySelector( 'body' ).textContent ).toBe( 'test text' );
} );

it( 'wrap array to getter', () => {
    const Dummy = Component( function( options ) {
        options( {
            errors: []
        } );
    } );
    class DummyWithRender extends Dummy {
        render() {
            this.container.textContent = this.options.errors;
        }
    }
    const DI = renderComponent( DummyWithRender );
    expectRenderedText( '' );
    const component = DI.resolve( 'sham-ui:store' ).byId.get( 'dummy' );
    component.options.errors.push( '1' );
    renderComponent( DummyWithRender );
    expectRenderedText( '' );
} );

it( 'options is null', () => {
    const Dummy = Component( function( options ) {
        options( {
            form: null
        } );
    } );
    renderComponent( class extends Dummy {
        render() {
            this.container.textContent = `form: ${this.options.form}`;
        }
    } );
    expectRenderedText( 'form: null' );
} );
