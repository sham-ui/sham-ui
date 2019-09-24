import { DI, Fsm } from '../src/shamUI';

global.afterEach( () => {
    DI.bind( 'fsm', Fsm );
    DI.bind( 'logger', console );
    DI.resolve( 'sham-ui:store' ).clear();
    document.querySelector( 'body' ).innerHTML = '';
    jest.restoreAllMocks();
} );
