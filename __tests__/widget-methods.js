import { Widget, DI } from '../src/shamUI';
import { renderWidget } from './helpers';

it( 'querySelector', async() => {
    expect.assertions( 1 );
    class Dummy extends Widget {
        html = '<span class="inner-label">test</span>';
    }
    await renderWidget( Dummy );
    const widget = DI.resolve( 'sham-ui:store' ).findById( 'dummy' );
    expect( widget.querySelector( '.inner-label' ).textContent ).toBe( 'test' );
} );
