import DIContainer from './DI';
import { FSM, states } from './engine';

export { inject } from './DI';
export { default as Widget } from './widget';
export { default as options } from './options/decorator';
export { Fsm as FsmDefault } from './fsm';
export { default as FsmState } from './fsm/state';
export * from './utils/assert';

export const DI = DIContainer;
export const Fsm = FSM;
export const FsmStates = states;

// Default fsm binding
DI.bind( 'fsm', Fsm );

// Default state binding
DI.bind( 'state:ready', states.ready );
DI.bind( 'state:registration', states.registration );
DI.bind( 'state:rendering', states.rendering );

// Default logger
DI.bind( 'logger', console );

/**
 * Фабрика для создания экземляров библиотеки
 *
 * @property {Object} render Доступ к конечному автомату {@link module:shamUI/fsm}
 */
export default class ShamUI {

    /**
     * Создать экземпляр
     * @param {Boolean} autoStart
     */
    constructor( autoStart = false ) {
        DI.bind( 'sham-ui', this );
        const Fsm = DI.resolve( 'fsm' );
        this.render = new Fsm();
        this.render.run();
        if ( autoStart ) {
            this.render.ALL();
        }
    }
}
