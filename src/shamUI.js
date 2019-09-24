import './initializer';

import Render from './engine';
import Store from './engine/store';
export { default as DI } from './DI';
export { default as Component } from './component';
export { default as options } from './options/decorator';
export { default as configureOptions } from './options/helper';

import DI from './DI';

/**
 * @property {Object} render
 */
export default class ShamUI {

    /**
     * Создать экземпляр
     */
    constructor() {
        DI.bind( 'sham-ui', this );
        this.store = new Store();
        this.render = new Render();
    }
}
