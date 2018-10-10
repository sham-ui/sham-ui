import BaseRegistrationState from './base-registration';
import callWithHook from '../../utils/call-with-hooks';

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
        this.rendered = [];

        this._fsm.changeWidgets.forEach( this._bindAndRender.bind( this ) );

        // Все области отрисовались
        this.emit( 'RenderComplete', this.rendered.slice( 0 ) );
        this.transition( 'ready' );
    }

    /**
     * Вызывается при выходе из этого состояни
     */
    _onExit() {
        this.rendered = [];
        this._fsm.changeWidgets = [];
    }

    /**
     * @param {String} ID
     * @private
     */
    _bindAndRender( ID ) {
        const widget = this._fsm.byId[ ID ];
        if ( widget && widget.render ) {
            this.handle( 'renderWidget', widget );
            this.emit( `RenderComplete[${ID}]`, ID );
        }
    }

    /**
     * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает destroy
     * @param {Array} needRenderingWidgets Список виджетов, которые нужно отрисовать
     */
    onlyIds( ...needRenderingWidgets ) {
        needRenderingWidgets.forEach( this._bindAndRender.bind( this ) );
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
                this.rendered.push( widget.ID );
            } );
            if ( widget.bindEvents ) {
                callWithHook( widget, 'BindEvents', widget.bindEvents.bind( widget ) );
            }
        } catch ( e ) {
            this.handleException( e );
        }
    }
}
