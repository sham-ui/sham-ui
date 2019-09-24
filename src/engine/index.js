import DI from '../DI';

export default class Render {

    /**
     * @type {Store}
     */
    get store() {
        return DI.resolve( 'sham-ui:store' );
    }

    /**
     * Перерисовать только те, ID которых переданны в аргументах
     * @see {@link ReadyState#onlyIds}
     * @param {...String} args Список ID виджетов, которые нужно отрисовать
     */
    ONLY_IDS( ...needRenderingComponents ) {
        this.store.forEachId( needRenderingComponents, this.renderComponent.bind( this ) );
    }

    /**
     * Перерисовать все
     * @see {@link ReadyState#all}
     */
    ALL() {
        const { store } = this;

        // TODO: remove componentsForRendering
        const componentsForRendering = new Set();
        store.forEach(
            component => componentsForRendering.add( component )
        );
        componentsForRendering.forEach( this.renderComponent.bind( this ) );
    }

    /**
     * @param {Component} component
     */
    renderComponent( component ) {
        component.render();

        // Default component always has bindEvents method
        component.bindEvents();
    }
}
