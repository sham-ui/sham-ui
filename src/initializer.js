import insert from './processors/insert';
import cond from './processors/cond';
import loop, { Map } from './processors/loop';
import Component from './component';
import DI from './di';
import Store from './store';

// Lazy registry Store
DI.bindLazy( 'sham-ui:store', Store );

// Save template processors in window
const exportKey = '__UI__';

if ( !window.hasOwnProperty( exportKey ) ) {
    window[ exportKey ] = {
        insert,
        cond,
        loop,
        Map,
        Component
    };
}
