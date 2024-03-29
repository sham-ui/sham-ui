import createProxy from './create';

/**
 * Create proxy methods for pass current component
 * @param {Component} component
 * @inner
 */
export default function setupForComponent( component ) {
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
            'rehydrate',
            'resolveID'
        ],
        component
    );
}
