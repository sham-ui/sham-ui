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
    expect( ctx.directives.first ).toEqual( 1 );
    expect( ctx.directives.second ).toEqual( 2 );

    expect( root.directives.first ).toEqual( 1 );
    expect( root.directives.second ).toEqual( undefined );
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
    expect( ctx.filters.first ).toEqual( 1 );
    expect( ctx.filters.second ).toEqual( 2 );

    expect( root.filters.first ).toEqual( 1 );
    expect( root.filters.second ).toEqual( undefined );
} );

it( 'append filters 2 level', () => {
    const root = createRootContext( {
        filters: {
            first: 1
        }
    } );
    const ctx = createChildContext( { ctx: root } );
    ctx.appendFilters( {
        second: 2
    } );
    const nestedCtx = createChildContext( { ctx } );
    expect( nestedCtx.filters.first ).toEqual( 1 );
    expect( nestedCtx.filters.second ).toEqual( 2 );

    expect( ctx.filters.first ).toEqual( 1 );
    expect( ctx.filters.second ).toEqual( 2 );

    expect( root.filters.first ).toEqual( 1 );
    expect( root.filters.second ).toEqual( undefined );
} );


it( 'append filters to parent after create child', () => {
    const root = createRootContext( {
        filters: {
            first: 1
        }
    } );
    const ctx = createChildContext( { ctx: root } );
    root.appendFilters( {
        second: 2
    } );

    expect( ctx.filters.first ).toEqual( 1 );
    expect( ctx.filters.second ).toEqual( undefined );

    expect( root.filters.first ).toEqual( 1 );
    expect( root.filters.second ).toEqual( 2 );
} );

it( 'append filters to parent after create child2 level', () => {
    const root = createRootContext( {
        filters: {
            first: 1
        }
    } );
    const ctx = createChildContext( { ctx: root } );
    const nestedCtx = createChildContext( { ctx } );
    root.appendFilters( {
        second: 2
    } );

    expect( nestedCtx.filters.first ).toEqual( 1 );
    expect( nestedCtx.filters.second ).toEqual( undefined );

    expect( ctx.filters.first ).toEqual( 1 );
    expect( ctx.filters.second ).toEqual( undefined );

    expect( root.filters.first ).toEqual( 1 );
    expect( root.filters.second ).toEqual( 2 );
} );
