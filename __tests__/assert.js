import { DI, assertError, assertWarn, assertDeprecate } from '../src/shamUI';

afterEach( () => {
    jest.restoreAllMocks();
} );

function spyLogger( methodName ) {
    return jest
        .spyOn( DI.resolve( 'logger' ), methodName )
        .mockImplementation( () => {} );
}

it( 'assertError (throw)', () => {
    const spy = spyLogger( 'error' );
    assertError( 'Test message', true );
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( spy.mock.calls[ 0 ] ).toMatchInlineSnapshot( `
Array [
  [AssertError: sham-ui: Test message],
]
` );
    expect( typeof spy.mock.calls[ 0 ][ 0 ].stack ).toBe( 'string' );
} );

it( 'assertError (don\'t throw)', () => {
    const spy = spyLogger( 'error' );
    assertError( 'Test message', false );
    expect( spy ).toHaveBeenCalledTimes( 0 );
} );

it( 'assertWarn (throw)', () => {
    const spy = spyLogger( 'warn' );
    assertWarn( 'Test message', true );
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( spy.mock.calls[ 0 ] ).toMatchInlineSnapshot( `
Array [
  [AssertError: sham-ui: Test message],
]
` );
    expect( typeof spy.mock.calls[ 0 ][ 0 ].stack ).toBe( 'string' );
} );

it( 'assertWarn (don\'t throw)', () => {
    const spy = spyLogger( 'warn' );
    assertWarn( 'Test message', false );
    expect( spy ).toHaveBeenCalledTimes( 0 );
} );

it( 'assertDeprecate (throw)', () => {
    const spy = spyLogger( 'warn' );
    assertDeprecate( 'Test message', true );
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( spy.mock.calls[ 0 ] ).toMatchInlineSnapshot( `
Array [
  [AssertError: sham-ui: [DEPRECATION]: Test message],
]
` );
    expect( typeof spy.mock.calls[ 0 ][ 0 ].stack ).toBe( 'string' );
} );

it( 'assertDeprecate (don\'t throw)', () => {
    const spy = spyLogger( 'warn' );
    assertDeprecate( 'Test message', false );
    expect( spy ).toHaveBeenCalledTimes( 0 );
} );
