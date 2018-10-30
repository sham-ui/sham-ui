import nanoid from 'nanoid';
import options from './options/decorator';
import bindOptionsDescriptors from './options/bind-descriptors';
import { inject } from './DI';
import { assertError } from './utils/assert';

/**
 * Базовый класс для виджетов
 */
export default class Widget {
    @inject( 'sham-ui' ) UI; // inject shamUI instance as this.UI

    /**
     * Тип виджета
     * @type {Array}
     */
    @options types = [];

    /**
     * @param {Object} [options] Options
     */
    constructor( options ) {
        /**
         * @type {null|Node} Container of this widget
         */
        this.container = null;
        this.constructorOptions = options;
        this.configureOptions();
        this.resolveID();
        this.UI.render.register( this );
    }

    resolveID() {
        const ID = this.options.ID;
        this.ID = 'string' === typeof ID ? ID : nanoid();
    }

    configureOptions() {
        const defaultOptions = Object.create(
            null,

            // this._options always set, because base Widget class has `types` option
            bindOptionsDescriptors( this, this._options )
        );
        this.options = Object.create(
            defaultOptions,
            Object.getOwnPropertyDescriptors( this.constructorOptions )
        );
    }

    querySelector( selector ) {
        return this.container.querySelector( selector );
    }

    /**
     * Добавить обработчики событий
     */
    bindEvents() {}

    /**
     * Функция вызывающая при уничтожениии виджета
     */
    destroy() {}

    /**
     * Query current container by this.containerSelector and save node as this.container
     */
    resolveContainer() {
        if ( undefined === this.options.container ) {
            this.container = document.querySelector( this.options.containerSelector );
        } else {
            this.container = this.options.container;
        }
        assertError(
            `Widget ${this.ID} doesn't resolve container. Check container selector`,
            undefined === this.container
        );
    }

    /**
     * Отрисовать виджет в контейнер
     * @returns {{container: *, html: *}}
     */
    render() {
        if ( undefined === this.html ) {
            return null;
        }
        let html = this.html;
        if ( typeof html === 'function' ) {
            html = this.html();
        }
        return {
            container: this.container,
            html
        };
    }
}
