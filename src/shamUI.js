import { default as DIContainer, inject as DIInject } from './DI';
import { FSM, states } from './fsm/fsm';
import BaseWidget from './widget';

import _OptionsConflictResolverManager from './options-conflict-resolver/manager';
export const OptionsConflictResolverManager = _OptionsConflictResolverManager;
export { default as OptionsConflictResolver } from './options-conflict-resolver/base';
import BindOnceConflict from './options-conflict-resolver/resolvers/bind-once';
import ActionSequenceConflict from './options-conflict-resolver/resolvers/action-sequence';

import decoratorOptions from './decorators/options';
import decoratorHandler from './decorators/handler';
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
export const handler = decoratorHandler;

// Default fsm binding
DI.bind( 'fsm', FSM );

// Options conflict resolver manager
DI.bind( 'options-conflict-resolver:manager', new OptionsConflictResolverManager() );

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

        // Registry options conflict resolver
        const resolverManager = DI.resolve( 'options-conflict-resolver:manager' );
        resolverManager
            .registry( new ActionSequenceConflict() )
            .registry( new BindOnceConflict() )
        ;

        const Fsm = DI.resolve( 'fsm' );
        this.render = new Fsm();
        this.render.run();
    }
}
