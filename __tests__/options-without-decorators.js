import { Component, configureOptions, DI } from '../src/shamUI';
import { renderComponent, expectRenderedText } from './helpers';

class Label extends Component {
    configureOptions() {
        super.configureOptions( ...arguments );
        configureOptions( Label.prototype, this, {
            text() {
                return this.ID;
            }
        } );
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
    configureOptions() {
        super.configureOptions( ...arguments );
        configureOptions( OverrideDefaultOptions.prototype, this, {
            text() {
                return 'override';
            }
        } );
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
        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( ExtendTwoLevel.prototype, this, {
                text() {
                    return 'two level';
                }
            } );
        }
    }
    renderComponent( ExtendTwoLevel );
    expectRenderedText( 'two level' );
} );

it( 'call super (two level)', () => {
    class ExtendTwoLevel extends OverrideDefaultOptions {
        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( ExtendTwoLevel.prototype, this, {
                text() {
                    return OverrideDefaultOptions.prototype.text.apply( this ) + ' and extend';
                }
            } );
        }
    }
    renderComponent( ExtendTwoLevel );
    expectRenderedText( 'override and extend' );
} );


it( 'ovveride method with instance prop', () => {
    class Dummy extends Label {
        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                text: 'instance text'
            } );
        }
    }
    renderComponent( Dummy );
    expectRenderedText( 'instance text' );
} );

it( 'context is a component (getter)', () => {
    class Dummy extends Component {
        get age() {
            return 27;
        }

        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                firstName: 'John',
                lastName: 'Smith',
                fullName: {
                    get() {
                        return `${this.options.firstName} ${this.options.lastName} (${this.age})`;
                    }
                }
            } );
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

        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                firstName: 'John',
                lastName: 'Smith',
                fullName() {
                    return `${this.options.firstName} ${this.options.lastName} (${this.age()})`;
                }
            } );
        }

        render() {
            this.container.textContent = this.options.fullName();
        }
    }
    renderComponent( Dummy );
    expectRenderedText( 'John Smith (27)' );
} );

it( 'context is a not component (pass as constructor argument)', () => {
    class Dummy extends Component {

        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                firstName: 'John',
                lastName: 'Smith',
                fullName() {}
            } );
        }

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
        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                text: {
                    get() {
                        return this._text;
                    },
                    set( value ) {
                        this._text = value;
                    }
                }
            } );
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
    DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'dummy' );
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

it( 'wrap array to getter', () => {
    class Dummy extends Component {
        configureOptions() {
            super.configureOptions( ...arguments );
            configureOptions( Dummy.prototype, this, {
                errors: []
            } );
        }
        render() {
            this.container.textContent = this.options.errors;
        }
    }
    renderComponent( Dummy );
    expectRenderedText( '' );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'dummy' );
    component.options.errors.push( '1' );
    renderComponent( Dummy );
    expectRenderedText( '' );
} );
