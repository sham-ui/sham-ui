import { createComponent, saveRef } from './create';

/**
 * Custom tags processor.
 * @param {Object} context Context
 * @param {Class<Component>} template Component class for insert, if test true
 * @param {Object} data Options for component
 */
export default function insert( context, template, data ) {
    if ( context.ref ) { // If view was already inserted, update or remove it.
        context.ref.update( data );
    } else {
        createComponent(
            context,
            template,
            saveRef,
            data
        );
    }
}
