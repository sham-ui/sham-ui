import { State } from '../../utils/fsm';

/**
 * Класс для состояния "Отрисовываем виджеты"
 */
export default class RenderingState extends State {
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

        for ( let i = 0; i < this._fsm.changeWidgets.length; i++ ) {
            const ID = this._fsm.changeWidgets[ i ];
            const widget = this._fsm.byId[ ID ];
            if ( widget && widget.render ) {
                this.handle( "renderWidget", widget );
                this.emit( `RenderComplete[${ID}]` );
            }
        }

        // Все области отрисовались
        this.emit( "RenderComplete", this.rendered );
        this.transition( "ready" );
    }

    /**
     * Вызывается при выходе из этого состояни
     */
    _onExit() {
        this.rendered = [];
        this._fsm.changeWidgets = [];
    }

    /**
     * Отрисовать один виджет
     * @param {Object} widget   Виджет
     * @see Widget
     */
    renderWidget( widget ) {
        if ( widget.options.actionSequence[ 0 ] === "render" ) {
            widget.resolveContainer();
        }

        if ( widget.options.beforeRender ) {
            widget.options.beforeRender.call( widget );
        }

        try {
            const obj = widget.render();
            if ( !obj ) {
                this.rendered.push( widget.ID );
                return;
            }

            const newEl = obj.container.cloneNode( false );
            newEl.innerHTML = obj.html;
            obj.container.parentNode.replaceChild( newEl, obj.container );
            widget.container = newEl;

            this.rendered.push( widget.ID );

            if ( widget.options.afterRender ) {
                widget.options.afterRender.call( widget );
            }

            if ( widget.options.actionSequence[ 0 ] === "render" &&
                widget.bindEvents && !widget.isBinded ) {

                // Если после отрисовки нужно биндить обработчики событий виджета или нет
                if ( widget.options.beforeBindEvents ) {
                    widget.options.beforeBindEvents.call( widget );
                }
                widget.bindEvents();
                if ( widget.options.afterBindEvents ) {
                    widget.options.afterBindEvents.call( widget );
                }
                if ( widget.options.bindOnce ) {
                    widget.isBinded = true;
                }
            }
        } catch ( e ) {
            this.handleException( e );
        }
    }
}