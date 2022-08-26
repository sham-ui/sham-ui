import { createComponent, saveRef } from './create';

/**
 * If condition processor.
 * @param {Object} context Context
 * @param {Class<Component>} template Component class for insert, if test true
 * @param {boolean} test Condition test
 * @return {boolean} test result
 */
export default function cond( context, template, test ) {
    if ( context.ref ) { // If view was already inserted, update or remove it.
        if ( !test ) {
            context.ref.remove();
        }
    } else if ( test ) {
        createComponent(
            context,
            template,
            saveRef
        );
    }
    return test;
}
