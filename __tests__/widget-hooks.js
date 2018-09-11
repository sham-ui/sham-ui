import { DI, Widget } from '../src/shamUI';
import { renderApp, onRenderComplete } from './helpers';

function makeBinding( calledHooks ) {
    return function() {
        class Dummy extends Widget {
            render() {}
            bindEvents() {}
            destroy() {}
        }
        const options = {};
        [
            'Register',
            'Render',
            'BindEvents',
            'Destroy'
        ].forEach(
            action => [ 'before', 'after' ].forEach( moment => {
                const key = `${moment}${action}`;
                options[ key ] = () => calledHooks.push( key );
            } )
        );
        new Dummy( 'body', 'dummy', options );
    };
}

it( 'first render', async() => {
    expect.assertions( 1 );
    const calledHooks = [];
    DI.bind( 'widget-binder', makeBinding( calledHooks ) );
    await renderApp();
    expect( calledHooks ).toEqual( [
        'beforeRegister',
        'afterRegister',
        'beforeRender',
        'afterRender',
        'beforeBindEvents',
        'afterBindEvents'
    ] );
} );

it( 're-render', async() => {
    expect.assertions( 1 );
    const calledHooks = [];
    DI.bind( 'widget-binder', makeBinding( calledHooks ) );
    await renderApp();
    await onRenderComplete( UI => UI.render.ALL() );
    expect( calledHooks ).toEqual( [
        'beforeRegister',
        'afterRegister',
        'beforeRender',
        'afterRender',
        'beforeBindEvents',
        'afterBindEvents',
        'beforeRender',
        'afterRender',
        'beforeBindEvents',
        'afterBindEvents'
    ] );
} );

it( 're-registry', async() => {
    expect.assertions( 1 );
    const calledHooks = [];
    DI.bind( 'widget-binder', makeBinding( calledHooks ) );
    await renderApp();
    await onRenderComplete( UI => UI.render.FORCE_ALL() );
    expect( calledHooks ).toEqual( [
        'beforeRegister',
        'afterRegister',
        'beforeRender',
        'afterRender',
        'beforeBindEvents',
        'afterBindEvents',
        'beforeDestroy',
        'afterDestroy',
        'beforeRegister',
        'afterRegister',
        'beforeRender',
        'afterRender',
        'beforeBindEvents',
        'afterBindEvents'
    ] );
} );
