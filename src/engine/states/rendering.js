import BaseRegistrationState from './base-registration';
import callWithHook from '../utils/call-with-hooks';

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
        store.changedWidgets.forEach( this._bindAndRender.bind( this ) );

        // Все области отрисовались
        this.emit( 'RenderComplete', store.renderedIds.slice( 0 ) );
        this.transition( 'ready' );
    }

    /**
     * @param {Widget} widget
     * @private
     */
    _bindAndRender( widget ) {
        this.renderWidget( widget );
        this.emit( `RenderComplete[${widget.ID}]`, widget.ID );
    }

    /**
     * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает destroy
     * @param {Array.<String>} needRenderingWidgets Список виджетов, которые нужно отрисовать
     */
    onlyIds( needRenderingWidgets ) {
        this.store.forEachId( needRenderingWidgets, this._bindAndRender.bind( this ) );
    }

    /**
     * Отрисовать один виджет
     * @param {Object} widget   Виджет
     * @see Widget
     */
    renderWidget( widget ) {
        try {
            widget.resolveContainer();
            callWithHook( widget, 'Render', () => {
                const obj = widget.render();
                if ( obj ) {
                    const newEl = obj.container.cloneNode( false );
                    newEl.innerHTML = obj.html;
                    obj.container.parentNode.replaceChild( newEl, obj.container );
                    widget.container = newEl;
                }
                this.store.renderedIds.push( widget.ID );
            } );

            // Default widget always has bindEvents method
            callWithHook( widget, 'BindEvents', widget.bindEvents.bind( widget ) );
        } catch ( e ) {
            this.handleException( e );
        }
    }
}
