import { DI, Widget, options } from '../src/shamUI';
import { onEvent } from './helpers';

it( 'exceptions', async() => {
    expect.assertions( 9 );
    const errorMock = jest.fn();
    class Dummy extends Widget {
        @options
        afterRender() {
            throw new Error( 'Test error' );
        }
    }
    DI.bind( 'logger', { error: errorMock } );
    DI.bind( 'widget-binder', () => {
        new Dummy( {
            ID: 'dummy',
            containerSelector: 'body'
        } );
    } );
    const args = await onEvent( 'error' );
    expect( args ).toHaveLength( 1 );
    const error = args[ 0 ];
    expect( Object.keys( error ) ).toEqual( [
        'exception',
        'state',
        'priorState',
        '_currentAction',
        '_priorAction',
        'currentActionArgs'
    ] );
    expect( error.exception.message ).toBe( 'Test error' );
    expect( error.state ).toBe( 'rendering' );
    expect( error.priorState ).toBe( 'registration' );
    expect( error._currentAction ).toBe( 'rendering.renderChangedWidgets' );
    expect( error._priorAction ).toBe( 'ready.all' );
    expect( error.currentActionArgs ).toHaveLength( 1 );
    expect( error.currentActionArgs[ 0 ] ).toEqual( 'renderChangedWidgets' );
} );
