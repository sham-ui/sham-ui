import { Component, DI } from '../src/shamUI';
import { renderComponent, expectRenderedText } from './helpers';

afterEach( () => {
    document.querySelector( 'body' ).innerHTML = '';
} );

class Label extends Component {
    render() {
        this.container.innerHTML = this.options.text();
    }
}

it( 'first render (ALL)', () => {
    renderComponent( Label, {
        text() {
            return 'dummy (all)';
        }
    } );
    expectRenderedText( 'dummy (all)' );
} );

it( 'render (ONLY_IDS)', () => {
    const mock = jest
        .fn()
        .mockReturnValueOnce( 'dummy (first render)' )
        .mockReturnValueOnce( 'dummy (second render)' );
    renderComponent( Label, {
        text: mock
    } );
    DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'dummy' );
    expectRenderedText( 'dummy (second render)' );
} );

it( 'render (not exists id)', () => {
    const mock = jest
        .fn()
        .mockReturnValueOnce( 'dummy (first render)' )
        .mockReturnValueOnce( 'dummy (second render)' );
    renderComponent( Label, {
        text: mock
    } );
    expectRenderedText( 'dummy (first render)' );
    DI.resolve( 'sham-ui' ).render.ONLY_IDS( 'non-exits' );
    expectRenderedText( 'dummy (first render)' );
} );
