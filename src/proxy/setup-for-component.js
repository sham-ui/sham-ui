import createProxy from './create';

/**
 * Create proxy methods for pass current component
 * @param {Component} component
 * @inner
 */
export default function setupForComponet( component ) {
    component.dom = createProxy(
        'sham-ui:dom',
        [
            'build',
            'el',
            'text',
            'comment',
            'unsafe'
        ],
        component
    );
    component.hooks = createProxy(
        'sham-ui:hooks',
        [
            'create',
            'hydrate',
            'rehydrate',
            'resolveID'
        ],
        component
    );
}
