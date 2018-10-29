import DI from './DI';
import { FSM } from './engine';
import { states } from './engine';
import Store from './engine/store';

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
