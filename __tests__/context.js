import { createRootContext, createChildContext } from '../src/index';

it( 'append directives', () => {
    const root = createRootContext( {
        directives: {
            first: 1
        }
    } );
    const ctx = createChildContext( { ctx: root } );
    ctx.appendDirectives( {
        second: 2
    } );
    expect( ctx.directives ).toEqual( {
        first: 1,
        second: 2
    } );
    expect( root.directives ).toEqual( {
        first: 1
    } );
} );

it( 'append filters', () => {
    const root = createRootContext( {
        filters: {
            first: 1
        }
    } );
    const ctx = createChildContext( { ctx: root } );
    ctx.appendFilters( {
        second: 2
    } );
    expect( ctx.filters ).toEqual( {
        first: 1,
        second: 2
    } );
    expect( root.filters ).toEqual( {
        first: 1
    } );
} );

