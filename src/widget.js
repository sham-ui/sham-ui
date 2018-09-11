import options from './decorators/options';
import { inject } from './DI';
import assert from './utils/assert';

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
    @options
    types = [];

    configureOptions() {

        // Выставляем опции по-умолчанию
        this.options = {};
        const options = this.constructorOptions || {};
        for ( let name in options ) {
            if ( !options.hasOwnProperty( name ) ) {
                continue;
            }
            this.options[ name ] = options[ name ];
        }

        const optionsOwners = [
            this.constructor, // Static options
            this              // Instance options
        ];
        for ( let owner of optionsOwners ) {
            const defaultOptions = owner.defaultOptionProps || [];
            for ( let name of defaultOptions ) {
                if ( !this.options.hasOwnProperty( name ) ) {
                    this.options[ name ] = owner[ name ];
                }
            }
        }
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
        this.container = document.querySelector( this.containerSelector );
        assert.error(
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
