import State from '../../fsm/state';
import callWithHook from '../utils/call-with-hooks';
import { inject } from '../../DI';

export default class BaseRegistrationState extends State {
    /** @type Store */
    @inject( 'sham-ui:store' ) store;

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
        const { store } = this;
        if ( store.byId.has( widget.ID ) ) {
            return;
        }
        callWithHook( widget, 'Register', () => store.registry( widget ) );
    }
}
