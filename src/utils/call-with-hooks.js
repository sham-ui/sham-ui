import { assertError } from './assert';

/**
 * @param {Function|undefined} hook
 * @param {Object} widget
 */
function callHook( hook, widget ) {
    if ( undefined !== hook ) {
        assertError( 'Hook must be function or undefined', 'function' !== typeof hook, {
            hook,
            widget
        } );
        hook.call( widget );
    }
}

/**
 * @param {Object} widget
 * @param {String} method
 * @param {Function} callback
 */
export default function callWithHooks( widget, method, callback ) {
    callHook( widget.options[ `before${method}` ], widget );
    callback();
    callHook( widget.options[ `after${method}` ], widget );
}
