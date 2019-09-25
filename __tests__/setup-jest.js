import { DI } from '../src/index';

global.afterEach( () => {
    DI.resolve( 'sham-ui:store' ).clear();
    document.querySelector( 'body' ).innerHTML = '';
    jest.restoreAllMocks();
} );
