import insert from './processors/insert';
import cond from './processors/cond';
import loop, { Map } from './processors/loop';
import Component from './component';

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
