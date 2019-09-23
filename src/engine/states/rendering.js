import BaseRegistrationState from './base-registration';

export default class RenderingState extends BaseRegistrationState {

    _anyEvents() {
        this.deferUntilTransition();
    }

    _onEnter() {
        this.handle( 'renderChangedComponents' );
    }

    _onExit() {
        const { store } = this;
        store.renderedIds = [];
        store.changedComponents.clear();
    }

    renderChangedComponents() {
        const { store } = this;
        store.renderedIds = [];
        store.changedComponents.forEach( this.renderComponent.bind( this ) );
        this.emit( 'RenderComplete', store.renderedIds.slice( 0 ) );
        this.transition( 'ready' );
    }

    onlyIds( needRenderingComponents ) {
        this.store.forEachId( needRenderingComponents, this.renderComponent.bind( this ) );
    }

    /**
     * @param {Component} component
     */
    renderComponent( component ) {
        try {
            component.render();
            this.store.renderedIds.push( component.ID );

            // Default component always has bindEvents method
            component.bindEvents();
        } catch ( e ) {
            this.handleException( e );
        }
    }
}
