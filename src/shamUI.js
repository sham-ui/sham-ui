import { default as DIContainer, inject as DIInject } from './DI';
import { FSM, states } from './fsm/fsm';
import BaseWidget from './widget';

import decoratorOptions from './decorators/options';
import { Fsm as DefaultFsm, State } from './utils/fsm';
export { default as assert } from './utils/assert';

export const DI = DIContainer;
export const inject = DIInject;

/** @link {Widget} */
export const Widget = BaseWidget;

export const FsmDefault = DefaultFsm;
export const FsmState = State;

export const Fsm = FSM;
export const FsmStates = states;

export const options = decoratorOptions;

// Default fsm binding
DI.bind( 'fsm', FSM );

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
     */
    constructor() {
        DI.bind( 'sham-ui', this );
        const Fsm = DI.resolve( 'fsm' );
        this.render = new Fsm();
        this.render.run();
    }
}
