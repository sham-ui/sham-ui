import './initializer';

export { FSM as Fsm, states as FsmStates } from './engine';
export { default as WidgetStore } from './engine/store';
export { default as DI, inject } from './DI';
export { default as Widget } from './widget';
export { default as options } from './options/decorator';
export { Fsm as FsmDefault } from './fsm';
export { default as FsmState } from './fsm/state';
export * from './utils/assert';

import DI from './DI';

/**
 * @property {Object} render
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
