import { inject } from '../../DI';
import { State } from '../../utils/fsm';

/**
 * Класс для состояния "Регистрация виджетов"
 */
export default class RegistrationState extends State {
    @inject widgetBinder = 'widget-binder';

    /**
     * Что делать с необрабатываемыми в этом состояния хэндлерами
     */
    _anyEvents() {
        this.deferUntilTransition();
    }

    /**
     * Вызывается при входе в состояние
     */
    _onEnter() {
        this.widgetBinder();
        this.handle( "registrationComplete" )
    }

    /**
     * Зарегистрировать виджет
     * @param {*}         widget.ID                      Идентификатор
     * @param {Function} [widget.bind]                   Функция навешивающая обработчики
     * @param {Function} [widget.render]                 Функция отрисовки.
     * @param {Function} [widget.destroy]                Функция отвязывающая обработчики
     * @param {Object}   [widget.options]                Опции виджета
     * @param {Array}    [widget.options.types]          Массив типов
     * @param {Function} [widget.options.beforeRegister] До регистрации
     * @param {Function} [widget.options.afterRegister]  После регистрации
     * @param {Function} [widget.options.beforeBind]     До навешивания обработчиков
     * @param {Function} [widget.options.afterBind]      После навешивания обработчиков
     * @param {Function} [widget.options.beforeRender]   До отрисовки этого элемента
     * @param {Function} [widget.options.afterRender]    После отрисовки этого элемента
     * @param {Function} [widget.options.beforeDestroy]  До отвязки обработчиков
     * @param {Function} [widget.options.afterDestroy]   После отвязки обработчиков
     * @see Widget
     * @see Widget#defaultOptions
     */
    register( widget ) {

        // Добавляем только те, которых еще нет
        if ( this._fsm.idArray.indexOf( widget.ID ) === -1 ) {
            if ( widget.options.beforeRegister ) {
                widget.options.beforeRegister.call( widget );
            }
            this._fsm.idArray.push( widget.ID );
            this._fsm.byId[ widget.ID ] = widget;

            // Если есть типы
            if ( widget.options.types ) {
                for ( let i = 0; i < widget.options.types.length; i++ ) {
                    if ( this.byType[ widget.options.types[ i ] ] === undefined ) {
                        this.byType[ widget.options.types[ i ] ] = [];
                    }
                    this.byType[ widget.options.types[ i ] ].push( widget.ID );
                }
            }

            this._fsm.widgets.push( widget );
            if ( widget.options.afterRegister ) {
                widget.options.afterRegister.call( widget );
            }
        }
    }

    /**
     * Все виджеты зарегисрированы
     * Если нужно, то сначала биндим обработчики событий, а потом отрисовываем
     */
    registrationComplete() {
        let widget;
        this.emit( "RegistrationComplete" );
        for ( let i = 0; i < this._fsm.widgets.length; i++ ) {
            widget = this._fsm.widgets[ i ];

            // Если сначала биндим обработчики событий, а потом отрисовываем виджет
            if ( "bindEvents" === widget.options.actionSequence[ 0 ] &&
                widget.bindEvents ) {
                if ( widget.options.beforeBindEvents ) {
                    widget.options.beforeBindEvents.call( widget );
                }
                widget.bindEvents();
                if ( widget.options.afterBindEvents ) {
                    widget.options.afterBindEvents.call( widget );
                }
            }
        }
        this._fsm.changeWidgets = this._fsm.idArray.slice( 0 );
        this.transition( "rendering" );
    }
}
