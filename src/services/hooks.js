import nanoid from 'nanoid';

/**
 * Inner service for hydrate/rehydrate hooks
 */
export default class Hooks {

    /**
     * Hook for extra processing after component created
     * @param {Component} component
     */
    //eslint-disable-next-line no-unused-vars
    create( component ) {

    }

    /**
     * Hook for mark root component as ready for hydrating
     * @param {Component} component
     */
    //eslint-disable-next-line no-unused-vars
    hydrate( component ) {

    }

    /**
     * Hook for mark rehydrating component
     * @param {Component} component
     */
    //eslint-disable-next-line no-unused-vars
    rehydrate( component ) {

    }

    /**
     * Hook for resolve ID for component
     * @param {Component} component
     * @return {string}
     */
    resolveID( component ) {
        const ID = component.ctx.ID;
        return 'string' === typeof ID ?
            ID :
            nanoid()
        ;
    }
}
