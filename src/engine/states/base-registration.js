import State from '../../fsm/state';
import callWithHook from '../utils/call-with-hooks';

export default class BaseRegistrationState extends State {
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
        if ( this._fsm.idArray.includes( widget.ID ) ) {
            return;
        }
        callWithHook( widget, 'Register', () => {
            this._fsm.idArray.push( widget.ID );
            this._fsm.byId[ widget.ID ] = widget;

            // Если есть типы
            if ( widget.options.types ) {
                for ( let i = 0; i < widget.options.types.length; i++ ) {
                    const type = widget.options.types[ i ];
                    if ( this._fsm.byType[ type ] === undefined ) {
                        this._fsm.byType[ type ] = [];
                    }
                    this._fsm.byType[ type ].push( widget.ID );
                }
            }

            this._fsm.widgets.push( widget );
        } );
    }
}
