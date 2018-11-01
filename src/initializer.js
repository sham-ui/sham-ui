import DI from './DI';
import { FSM } from './engine';
import { states } from './engine';
import Store from './engine/store';
import insert from './processors/insert';
import cond from './processors/cond';
import loop, { Map } from './processors/loop';

window.DI = DI;

// Default widget store
new Store();

// Default fsm binding
DI.bind( 'fsm', FSM );

// Default state binding
DI.bind( 'state:ready', states.ready );
DI.bind( 'state:registration', states.registration );
DI.bind( 'state:rendering', states.rendering );

// Default logger
DI.bind( 'logger', console );

// Save template processors in window
const exportKey = '__UI__';

if ( !window.hasOwnProperty( exportKey ) ) {
    window[ exportKey ] = {
        insert,
        cond,
        loop,
        Map
    };
}
