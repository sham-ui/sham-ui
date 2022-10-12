export { createDI } from './di';
export { default as Component } from './component';
export { default as insert } from './processors/insert';
export { default as cond } from './processors/cond';
export { default as loop } from './processors/loop';
export { createRootContext } from './context/root';
export { createChildContext } from './context/child';
export { createLoopContext } from './context/loop';
export { createBlockContext } from './context/block';

/**
 * Render root components
 * @param {DI} DI
 */
export function start( DI ) {
    const hooks = DI.resolve( 'sham-ui:hooks' );
    Array.from(

        // Get root components
        DI.resolve( 'sham-ui:store' ).byId.values()
    ).forEach( component => {

        // Save owner of root component in context
        component.ctx.owner = component;

        // Mount to dom
        component.render();

        // Rehydrate component
        component.hooks.rehydrate();

        // Call updateState (for inner call onUpdate)
        component.updateState();

        // Call hook
        component.didMount();

        // Hydrate root component
        hooks.hydrate( component );
    } );
}
