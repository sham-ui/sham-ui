import hoistingOptions from './hoisting';
import bindOptionsDescriptors from './bind-descriptors';

/**
 * Setup options in component
 * @param {Component} component
 * @param {Object} options
 * @inner
 */
export default function setupOptions( component, options ) {
    hoistingOptions( component );

    const descriptors = Object.assign(
        {},
        bindOptionsDescriptors( component, component._options ),
        Object.getOwnPropertyDescriptors( options )
    );
    component.options = Object.create( null, descriptors );

    // Just copy from options
    [
        'parent',
        'owner',
        'container'
    ].forEach(
        key => component[ key ] = options[ key ]
    );

    // Copy from options or parent or default
    const parent = options.parent || {};
    [
        'directives',
        'filters',
        'DI',
        'blocks'
    ].forEach(
        key => component[ key ] = options[ key ] || parent[ key ] || {}
    );
}
