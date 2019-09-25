import './initializer';

export { default as DI } from './di';
export { default as Component } from './component';
export { default as options } from './options/decorator';
export { default as configureOptions } from './options/helper';

import DI from './di';

/**
 * Render root components
 */
export function start() {
    DI.resolve( 'sham-ui:store' ).toArray().forEach( component => {

        // Mount to dom
        component.render();

        // Call update (for inner call onUpdate)
        component.update();

        // Call hook
        component.didMount();
    } );
}
