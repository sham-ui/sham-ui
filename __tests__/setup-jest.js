import { DI, FsmStates, Fsm } from '../src/shamUI';

global.afterEach( () => {
    DI.bind( 'state:ready', FsmStates.ready );
    DI.bind( 'state:registration', FsmStates.registration );
    DI.bind( 'state:rendering', FsmStates.rendering );
    DI.bind( 'fsm', Fsm );
    DI.bind( 'logger', console );
    DI.resolve( 'sham-ui:store' ).clear();
    document.querySelector( 'body' ).innerHTML = '';
    jest.restoreAllMocks();
} );
