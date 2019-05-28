import { Component, options } from '../src/shamUI';
import { renderComponent, expectRenderedText, onRenderComplete } from './helpers';

afterEach( () => {
    document.querySelector( 'body' ).innerHTML = '';
} );

class Label extends Component {
    @options types = [ 'label' ];

    render() {
        this.container.innerHTML = this.options.text();
    }
}

it( 'first render (ALL)', async() => {
    expect.assertions( 1 );
    await renderComponent( Label, {
        text() {
            return 'dummy (all)';
        }
    } );
    expectRenderedText( 'dummy (all)' );
} );

it( 'render (ONLY_IDS)', async() => {
    expect.assertions( 1 );
    const mock = jest
        .fn()
        .mockReturnValueOnce( 'dummy (first render)' )
        .mockReturnValueOnce( 'dummy (second render)' );
    await renderComponent( Label, {
        text: mock
    } );
    await onRenderComplete( UI => UI.render.ONLY_IDS( 'dummy' ) );
    expectRenderedText( 'dummy (second render)' );
} );

it( 'first render (ONLY_TYPES)', async() => {
    expect.assertions( 2 );
    const mock = jest
        .fn()
        .mockReturnValueOnce( 'dummy (first render)' )
        .mockReturnValueOnce( 'dummy (second render)' );
    await renderComponent( Label, {
        text: mock
    } );
    expectRenderedText( 'dummy (first render)' );
    await onRenderComplete( UI => UI.render.ONLY_TYPES( 'label' ) );
    expectRenderedText( 'dummy (second render)' );
} );

it( 'render (not exists type)', async() => {
    expect.assertions( 2 );
    const mock = jest
        .fn()
        .mockReturnValueOnce( 'dummy (first render)' )
        .mockReturnValueOnce( 'dummy (second render)' );
    await renderComponent( Label, {
        text: mock
    } );
    expectRenderedText( 'dummy (first render)' );
    await onRenderComplete( UI => UI.render.ONLY_TYPES( 'non-exits' ) );
    expectRenderedText( 'dummy (first render)' );
} );

it( 'render (not exists id)', async() => {
    expect.assertions( 2 );
    const mock = jest
        .fn()
        .mockReturnValueOnce( 'dummy (first render)' )
        .mockReturnValueOnce( 'dummy (second render)' );
    await renderComponent( Label, {
        text: mock
    } );
    expectRenderedText( 'dummy (first render)' );
    await onRenderComplete( UI => UI.render.ONLY_IDS( 'non-exits' ) );
    expectRenderedText( 'dummy (first render)' );
} );
