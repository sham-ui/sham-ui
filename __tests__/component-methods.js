import { Component, DI } from '../src/shamUI';
import { renderComponent } from './helpers';

it( 'querySelector', async() => {
    expect.assertions( 1 );
    class Dummy extends Component {
        render() {
            this.container.innerHTML = '<span class="inner-label">test</span>';
        }
    }
    await renderComponent( Dummy );
    const component = DI.resolve( 'sham-ui:store' ).findById( 'dummy' );
    expect( component.querySelector( '.inner-label' ).textContent ).toBe( 'test' );
} );
