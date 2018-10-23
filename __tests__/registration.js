import { DI, Widget } from '../src/shamUI';
import { renderApp } from './helpers';

it( 'registration two widgets with same id', async() => {
    expect.assertions( 4 );
    const afterRegisterFirst = jest.fn();
    const afterRegisterSecond = jest.fn();
    let first, second;
    DI.bind( 'widget-binder', () => {
        first = new Widget( 'body', 'dummy', {
            afterRegister: afterRegisterFirst
        } );
        second = new Widget( 'body', 'dummy', {
            afterRegister: afterRegisterSecond
        } );
    } );
    await renderApp();
    expect( afterRegisterFirst ).toHaveBeenCalled();
    expect( afterRegisterSecond ).toHaveBeenCalledTimes( 0 );
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).toEqual( first );
    expect( DI.resolve( 'sham-ui:store' ).findById( 'dummy' ) ).not.toEqual( second );
} );
