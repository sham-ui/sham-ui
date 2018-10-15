export default class State {
    constructor( fsmInstance ) {
        this._fsm = fsmInstance;
    }

    /**
     * Call handler in state
     * @param {String} inputType
     */
    handle( inputType, ...rest ) {
        this._fsm.handle( inputType, ...rest );
    }

    /**
     * Transition to state
     * @param {String} newState
     */
    transition( newState, ...rest ) {
        this._fsm.transition( newState, ...rest );
    }

    deferUntilTransition() {
        this._fsm.deferUntilTransition( ...arguments );
    }

    emit() {
        this._fsm.emit( ...arguments );
    }

    /**
     * Hook for process errors
     */
    handleException() {
        this._fsm.handleException( ...arguments );
    }
}
