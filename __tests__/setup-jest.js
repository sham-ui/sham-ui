global.afterEach( () => {
    document.querySelector( 'body' ).innerHTML = '';
    jest.restoreAllMocks();
} );
