import ShamUI, { DI } from '../src/shamUI';

it( 'nohanlder', () => {
    expect.assertions( 3 );
    const nohandler = jest.fn();
    const UI = new ShamUI();
    UI.render.one( 'nohandler', nohandler );
    const args = [ 1, 'first', 'second' ];
    UI.render.handle( 'notExistHanlder', ...args );
    expect( nohandler ).toHaveBeenCalled();
    const firstCallArgs = nohandler.mock.calls[ 0 ];
    expect( firstCallArgs ).toHaveLength( 1 );
    expect( firstCallArgs[ 0 ] ).toEqual( {
        inputType: 'notExistHanlder',
        args: [ 'notExistHanlder', ...args ]
    } );
} );

it( 'invalidState', () => {
    expect.assertions( 3 );
    const invalidState = jest.fn();
    const UI = new ShamUI();
    UI.render.one( 'invalidstate', invalidState );
    UI.render.transition( 'notExistState' );
    expect( invalidState ).toHaveBeenCalled();
    const firstCallArgs = invalidState.mock.calls[ 0 ];
    expect( firstCallArgs ).toHaveLength( 1 );
    expect( firstCallArgs[ 0 ] ).toEqual( {
        attemptedState: 'notExistState',
        state: 'ready'
    } );
} );

it( 'transition emit', () => {
    expect.assertions( 3 );
    const transition = jest.fn();
    DI.bind( 'widget-binder', () => {} );
    const UI = new ShamUI();
    UI.render.one( 'transition', transition );
    UI.render.ALL();
    expect( transition ).toHaveBeenCalled();
    const firstCallArgs = transition.mock.calls[ 0 ];
    expect( firstCallArgs ).toHaveLength( 1 );
    expect( firstCallArgs[ 0 ] ).toEqual( {
        action: '',
        fromState: 'ready',
        toState: 'registration'
    } );
} );

it( 'transition to current state', () => {
    expect.assertions( 1 );
    const transition = jest.fn();
    const UI = new ShamUI();
    UI.render.one( 'transition', transition );
    UI.render.transition( 'ready' );
    expect( transition ).toHaveBeenCalledTimes( 0 );
} );

it( 'on/off (with callback)', () => {
    expect.assertions( 1 );
    const transition = jest.fn();
    DI.bind( 'widget-binder', () => {} );
    const UI = new ShamUI();
    UI.render.on( 'transition', transition );
    UI.render.off( 'transition', transition );
    UI.render.ALL();
    expect( transition ).toHaveBeenCalledTimes( 0 );
} );


it( 'on/off (without callback)', () => {
    expect.assertions( 1 );
    const transition = jest.fn();
    DI.bind( 'widget-binder', () => {} );
    const UI = new ShamUI();
    UI.render.on( 'transition', transition );
    UI.render.off( 'transition' );
    UI.render.ALL();
    expect( transition ).toHaveBeenCalledTimes( 0 );
} );

it( 'on/off (non exist event)', () => {
    expect.assertions( 1 );
    const transition = jest.fn();
    DI.bind( 'widget-binder', () => {} );
    const UI = new ShamUI();
    UI.render.on( 'transition', transition );
    UI.render.off( 'transition-non-exist-event' );
    UI.render.ALL();
    expect( transition ).toHaveBeenCalledTimes( 3 );
} );


it( 'on/off (another callback)', () => {
    expect.assertions( 1 );
    const transition = jest.fn();
    DI.bind( 'widget-binder', () => {} );
    const UI = new ShamUI();
    UI.render.on( 'transition', transition );
    UI.render.off( 'transition', () => {} );
    UI.render.ALL();
    expect( transition ).toHaveBeenCalledTimes( 3 );
} );
