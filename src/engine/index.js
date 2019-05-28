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
     * @param {Component} component
     * @see {@link RegistrationState#register}
     */
    register( component ) {
        this.handle( 'register', component );
    }

    /**
     * @param {String} componentId
     */
    unregister( componentId ) {
        this.handle( 'unregister', componentId );
    }

    /**
     * Handle exception
     * @param {Object} exception
     * @private
     */
    handleException( exception ) {
        this.logger.error( exception );
        super.handleException( ...arguments );
    }
}
