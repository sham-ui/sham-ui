export { createDI } from './di';
export { default as Component } from './component';
export { default as insert } from './processors/insert';
export { default as cond } from './processors/cond';
export { default as loop, Map } from './processors/loop';

/**
 * Render root components
 * @param {DI} DI
 */
export function start( DI ) {
    const components = DI.resolve( 'sham-ui:store' ).byId.values();
    const hooks = DI.resolve( 'sham-ui:hooks' );
    Array.from( components ).forEach( component => {

        // Mount to dom
        component.render();

        // Rehydrate component
        component.hooks.rehydrate();

        // Call update (for inner call onUpdate)
        component.update();

        // Call hook
        component.didMount();

        // Hydrate root component
        hooks.hydrate( component );
    } );
}
