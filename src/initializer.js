import Store from './services/store';
import Dom from './services/dom';
import Hooks from './services/hooks';

/**
 * @inner
 * @param {DI} DI
 * @return {DI}
 */
export default function bindServices( DI ) {
    return DI
        .bindLazy( 'sham-ui:store', Store )
        .bindLazy( 'sham-ui:dom', Dom )
        .bindLazy( 'sham-ui:hooks', Hooks )
    ;
}
