import setDefaultOptions from './set-default';

/**
 * Setup options in component
 * @param {Component} component
 * @param {Object} options
 * @inner
 */
export default function setupOptions( component, options ) {
    component.options = setDefaultOptions( {}, options );

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
