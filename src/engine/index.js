import { inject } from '../DI';
import { Fsm } from '../fsm';
import ReadyState from './states/ready';
import RegistrationState from './states/registration';
import RenderingState from './states/rendering';

/**
 * Default states
 * @type {
 *  {
 *    ready:         ReadyState,
 *    registration:  RegistrationState,
 *    rendering:     RenderingState
 *  }
 * }
 */
export const states = {
    ready:         ReadyState,
    registration:  RegistrationState,
    rendering:     RenderingState
};

/**
 * Класс основного конечного атомата
 */
export class FSM extends Fsm {
    @inject( 'state:ready' ) ready;
    @inject( 'state:registration' ) registration;
    @inject( 'state:rendering' ) rendering ;
    @inject logger;

    static initialState = 'ready';

    /**
     * Перерисовать только те, ID которых переданны в аргументах
     * @see {@link ReadyState#onlyIds}
     * @param {...String} args Список ID виджетов, которые нужно отрисовать
     */
    ONLY_IDS( ...args ) {
        this.handle( 'onlyIds', args );
    }

    /**
     * Перерисовать все
     * @see {@link ReadyState#all}
     */
    ALL() {
        this.handle( 'all' );
    }

    /**
     * Перерисовать только с указанными типами
     * @param {...String} args Список типов виджетов, которые нужно отрисовать
     * @see {@link ReadyState#onlyTypes}
     */
    ONLY_TYPES( ...args ) {
        this.handle( 'onlyTypes', args );
    }

    /**
     * Зарегистрировать виджет
     * @param {*}         widget.ID                     Идентификатор
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
     * @see {@link RegistrationState#register}
     */
    register( widget ) {
        this.handle( 'register', widget );
    }

    /**
     * Разрегистрировать виджет
     * @param {String} widgetId Идентификатор виджета
     */
    unregister( widgetId ) {
        this.handle( 'unregister', widgetId );
    }

    /**
     * Hook for handle exception
     * @param {Object} exception
     * @private
     */
    handleException( exception ) {
        this.logger.error( exception );
        super.handleException( ...arguments );
    }
}
