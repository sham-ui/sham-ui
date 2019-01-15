import BaseRegistrationState from './base-registration';

/**
 * Класс для состояния "Отрисовываем виджеты"
 */
export default class RenderingState extends BaseRegistrationState {

    /**
     * Что делать с необрабатываемыми в этом состояния хэндлеры
     */
    _anyEvents() {
        this.deferUntilTransition();
    }

    /**
     * Вызывается при входе в это состояние
     */
    _onEnter() {
        this.handle( 'renderChangedWidgets' );
    }

    /**
     * Вызывается при выходе из этого состояни
     */
    _onExit() {
        const { store } = this;
        store.renderedIds = [];
        store.changedWidgets.clear();
    }

    renderChangedWidgets() {
        const { store } = this;
        store.renderedIds = [];
        store.changedWidgets.forEach( this.renderWidget.bind( this ) );
        this.emit( 'RenderComplete', store.renderedIds.slice( 0 ) );
        this.transition( 'ready' );
    }

    /**
     * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает remove
     * @param {Array.<String>} needRenderingWidgets Список виджетов, которые нужно отрисовать
     */
    onlyIds( needRenderingWidgets ) {
        this.store.forEachId( needRenderingWidgets, this.renderWidget.bind( this ) );
    }

    /**
     * Отрисовать виджеты с указанным типом
     * @param {Array} needRenderingWidgetsWithType Список типов, которые нужно отрисовать
     */
    onlyTypes( needRenderingWidgetsWithType ) {
        this.store.forEachType( needRenderingWidgetsWithType, this.renderWidget.bind( this ) );
    }

    /**
     * Отрисовать один виджет
     * @param {Object} widget   Виджет
     * @see Widget
     */
    renderWidget( widget ) {
        try {
            widget.resolveContainer();
            widget.render();
            this.store.renderedIds.push( widget.ID );

            // Default widget always has bindEvents method
            widget.bindEvents();
        } catch ( e ) {
            this.handleException( e );
        }
    }
}
