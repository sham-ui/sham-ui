import { extend } from './methods';

/**
 * @param {Object} $0
 * @param {DI} $0.DI
 * @param {string} [$0.ID]
 * @param {Element} $0.container
 * @param {Object} [$0.directives={}]
 * @param {Object} [$0.filters=[]]
 * @return {Object}
 */
export function createRootContext( { DI, ID, container, directives = {}, filters = {} } ) {
    return extend.call(
        {
            DI,
            directives,
            filters
        },
        {
            ID,
            container
        }
    );
}
