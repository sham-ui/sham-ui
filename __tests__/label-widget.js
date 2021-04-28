import { Component } from '../src/index';
import { renderComponent, expectRenderedText } from './helpers';

afterEach( () => {
    document.querySelector( 'body' ).innerHTML = '';
} );

class Label extends Component() {
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

it( 'render after already rendered', () => {
    const mock = jest
        .fn()
        .mockReturnValueOnce( 'dummy (first render)' )
        .mockReturnValueOnce( 'dummy (second render)' );
    const DI = renderComponent( Label, {
        text: mock
    } );
    DI.resolve( 'sham-ui:store' ).byId.get( 'dummy' ).render();
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
} );
