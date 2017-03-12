const NEXT_TRANSITION = "transition";
const NEXT_HANDLER = "handler";
const HANDLING = "handling";
const HANDLED = "handled";
const NO_HANDLER = "nohandler";
const TRANSITION = "transition";
const INVALID_STATE = "invalidstate";
const DEFERRED = "deferred";
const ERROR = "error";


/**
 * Finite State Machine
 */
export class Fsm {
    constructor() {
        this.targetReplayState = "";
        this.state = undefined;
        this.priorState = undefined;
        this._priorAction = "";
        this._currentAction = "";
        this.eventListeners = {
            _anyEvents: []
        };
        this.eventQueue = [];
    }

    /**
     * Initial states
     * @type {string}
     */
    static initialState = "uninitialized";

    /**
     * Initialize states
     * Default resolve from injected
     */
    initStates() {
        this._states = {};
        for ( let key in this ) {
            if ( this[ key ] && this[ key ].prototype instanceof State ) {
                this._states[ key ] = new this[ key ]( this );
            }
        }
    };

    /**
     * Transition FSM to initialState
     */
    run() {
        this.initStates();
        this.transition( this.constructor.initialState );
    }

    /**
     * Fire event
     * @param {string} eventName
     */
    emit( eventName ) {
        if ( this.eventListeners._anyEvents ) {
            this.eventListeners._anyEvents.forEach( callback => {
                callback( ...arguments );
            } );
        }

        if ( this.eventListeners[ eventName ] ) {
            this.eventListeners[ eventName ].forEach( callback => {
                callback( ...arguments );
            } );
        }
    }

    /**
     * Call handler in state
     * @param {string} inputType
     */
    handle( inputType ) {
        if ( !this.inExitHandler ) {
            const states = this._states,
                current = this.state;

            const args = Array.prototype.slice.call( arguments, 0 );
            this.currentActionArgs = args;

            if ( states[ current ][ inputType ] ||
                states[ current ]._anyEvents ||
                this._anyEvents ) {
                const handlerName = states[ current ][ inputType ] ? inputType : "_anyEvents";
                const catchAll = "_anyEvents" === handlerName;

                let handler, action;
                if ( states[ current ][ handlerName ] ) {
                    handler = states[ current ][ handlerName ];
                    action = `${current}.${handlerName}`;
                } else {
                    handler = this._anyEvents;
                    action = "_anyEvents";
                }
                if ( !this._currentAction ) {
                    this._currentAction = action;
                }

                this.emit( HANDLING, {
                    inputType,
                    args
                } );
                handler.apply( states[ current ], catchAll ? args : args.slice( 1 ) );
                this.emit( HANDLED, {
                    inputType,
                    args
                } );

                this._priorAction = this._currentAction;
                this._currentAction = "";
                this.processQueue( NEXT_HANDLER );
            } else {
                this.emit( NO_HANDLER, {
                    inputType,
                    args
                } );
            }

            this.currentActionArgs = undefined;
        }
    }

    /**
     * Transition to state
     * @param {String} newState
     */
    transition( newState ) {
        if ( !this.inExitHandler && newState !== this.state ) {
            const curState = this.state;
            if ( this._states[ newState ] ) {
                if ( curState && this._states[ curState ] && this._states[ curState ]._onExit ) {
                    this.inExitHandler = true;
                    this._states[ curState ]._onExit();
                    this.inExitHandler = false;
                }
                this.targetReplayState = newState;
                this.priorState = curState;
                this.state = newState;
                this.emit( TRANSITION, {
                    fromState: this.priorState,
                    action: this._currentAction,
                    toState: newState
                } );
                if ( this._states[ newState ]._onEnter ) {
                    this._states[ newState ]._onEnter();
                }
                if ( this.targetReplayState === newState ) {
                    this.processQueue( NEXT_TRANSITION );
                }
                return;
            }
            this.emit( INVALID_STATE, {
                state: this.state,
                attemptedState: newState
            } );
        }
    }

    /**
     * Process events queue by type
     * @param {String} type
     */
    processQueue( type ) {
        const filterFn = NEXT_TRANSITION === type ?
            item => NEXT_TRANSITION === item.type && (
                (
                    !item.untilState
                ) || (
                item.untilState === this.state
                )
            ) : item => NEXT_HANDLER === item.type;

        let toProcess = [];

        let counter = -1,
            length = this.eventQueue.length,
            index = 0,
            item;
        while ( ++counter < length ) {
            item = this.eventQueue[ counter - index ];
            if ( filterFn( item ) ) {
                toProcess.push( this.eventQueue.splice( counter - index++ )[ 0 ] );
            }
        }

        toProcess.forEach( item => {
            this.handle( ...item.args );
        } );
    }

    /**
     * Defer current action from current state to destination state
     * @param {string} stateName Destination state
     */
    deferUntilTransition( stateName ) {
        if ( this.currentActionArgs ) {
            const queued = {
                type: NEXT_TRANSITION,
                untilState: stateName,
                args: this.currentActionArgs
            };
            this.eventQueue.push( queued );
            this.emit.call( this, DEFERRED, {
                state: this.state,
                queuedArgs: queued
            } );
        }
    }

    /**
     * Subscribe listener to event
     * @param {String}   eventName
     * @param {Function} callback
     * @return {{eventName: string, callback: Function, off: Function}}
     */
    on( eventName, callback ) {
        if ( !this.eventListeners[ eventName ] ) {
            this.eventListeners[ eventName ] = [];
        }
        this.eventListeners[ eventName ].push( callback );
        return {
            eventName,
            callback,
            off: () => {
                this.off( eventName, callback );
            }
        };
    }

    /**
     * Un-subscribe listener
     * @param {=string}   eventName
     * @param {=Function} callback
     */
    off( eventName, callback ) {
        if ( !eventName ) {
            this.eventListeners = {};
        } else {
            if ( this.eventListeners[ eventName ] ) {
                if ( callback ) {
                    let index = 0,
                        counter = -1,
                        length = this.eventListeners[ eventName ].length,
                        item;
                    while ( ++counter < length ) {
                        item = this.eventListeners[ eventName ][ counter - index ];
                        if ( callback === item ) {
                            this.eventListeners[ eventName ].splice( counter - index++ );
                        }
                    }
                } else {
                    this.eventListeners[ eventName ] = [];
                }
            }
        }
    }

    /**
     * Subscribe once event listener
     * @param {String}   eventName
     * @param {Function} callback
     */
    one( eventName, callback ) {
        const off = this.on( eventName, () => {
            callback( ...arguments );
            off();
        } ).off;
    }

    /**
     * Hook for process error
     * @param {Object} exception
     */
    handleException( exception ) {
        this.emit( ERROR, {
            exception,
            state: this.state,
            priorState: this.priorState,
            _currentAction: this._currentAction,
            _priorAction: this._priorAction,
            currentActionArgs: this.currentActionArgs,
        } );
    }
}

export class State {
    constructor( fsmInstance ) {
        this._fsm = fsmInstance;
    }

    /**
     * Call handler in state
     * @param {String} inputType
     */
    handle( inputType ) {
        this._fsm.handle( ...arguments );
    }

    /**
     * Transition to state
     * @param {String} newState
     */
    transition( newState ) {
        this._fsm.transition( ...arguments );
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
        this._fsm.handleException( ...arguments )
    }
}
