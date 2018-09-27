import { DI, Widget, options } from '../src/shamUI';
import { onEvent } from './helpers';

afterEach( () => {
    DI.bind( 'logger', console );
} );

it( 'exceptions', async() => {
    expect.assertions( 10 );
    const errorMock = jest.fn();
    class Dummy extends Widget {
        @options
        afterRender() {
            throw new Error( 'Test error' );
        }
    }
    DI.bind( 'logger', { error: errorMock } );
    DI.bind( 'widget-binder', () => {
        new Dummy( 'body', 'dummy' );
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
    expect( error._currentAction ).toBe( 'registration.registrationComplete' );
    expect( error._priorAction ).toBe( 'registration.register' );
    expect( error.currentActionArgs ).toHaveLength( 2 );
    expect( error.currentActionArgs[ 0 ] ).toEqual( 'renderWidget' );
    expect( error.currentActionArgs[ 1 ] ).toBeInstanceOf( Dummy );
} );
