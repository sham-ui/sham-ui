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
     * @param {String}  containerSelector CSS-селектор элемента, в который будет
     *                                    происходить отрисовка
     * @param {String}  ID                Уникальный идентификтор
     * @param {Object} [options]          Опции
     */
    constructor( containerSelector, ID, options ) {

        this.ID = ID;
        /**
         * @type {null|Node} Container of this widget
         */
        this.container = null;
        this.containerSelector = containerSelector;
        this.constructorOptions = options;
        this.configureOptions();
        this.UI.render.register( this );
    }

    /**
     * Тип виджета
     * @type {Array}
     */
    @options types = [];

    configureOptions() {
        const defaultOptions = Object.create(
            null,

            // this._options always set, because base Widget class has `types` option
            bindOptionsDescriptors( this, this._options )
        );
        this.options = Object.create(
            defaultOptions,
            Object.getOwnPropertyDescriptors( this.constructorOptions || {} )
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
    destroy() {
        this.UI.render.unregister( this.ID );
    }

    /**
     * Query current container by this.containerSelector and save node as this.container
     */
    resolveContainer() {
        this.container = document.querySelector( this.containerSelector );
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
