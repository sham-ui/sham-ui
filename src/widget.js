import options from './decorators/options';
import { inject } from './DI';
import assert from './utils/assert';
import inline from './utils/single-line-string';

/**
 * Базовый класс для виджетов
 */
export default class Widget {
    @inject UI = 'sham-ui'; // inject shamUI instance as this.UI

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
     * Сначала биндим обработчики событий, потом отрисовываем
     * @type {Array}
     * @default [ "bindEvents", "render" ]
     */
    @options
    static actionSequence = [ 'bindEvents', 'render' ];

    /**
     * Тип виджета
     * @type {Array}
     */
    @options
    types = [];

    /**
     * Если биндим обработчики событий после отрисовки, то нужно ли перебиндиивать их
     * после каждой отрисовки
     * @type {Boolean}
     * @default true
     */
    @options
    static bindOnce = true;

    /**
     * Нужно ли кэшировать родительский элемент для контейнера
     * @type {Boolean}
     * @default false
     */
    @options
    static cacheParentContainer = false;

    /**
     * Виджет отрисовывается ассинхронно
     * @deprecated
     * @type {Boolean}
     * @default false,
     */
    @options
    renderAsync = false;

    /**
     * Обертка для ассинхроной отрисовки
     * @deprecated
     * @param {Function} renderCallback callback для рендера
     */
    @options
    static renderAsyncWrapper( renderCallback ) {
        window.requestAnimationFrame( renderCallback );
    }

    /**
     * Массив виджетов, которые нужно отрисовать перед тем, как отрисовывать этот виджет
     * @type {Array}
     */
    @options
    renderDependence = [];

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
    bindEvents() {
        const handlers = this.handlerProps;
        if ( handlers ) {
            this._bindHandlers = [];
            for ( let item of handlers ) {
                let element = this.container;
                if ( item.selector ) {
                    element = this.querySelector( item.selector );
                    assert.error(
                        inline`Widget "${this.ID}" hasn't sub-element "${item.selector}"
                        for bind event "${item.handlerName}."`,
                        !element
                    );
                }

                let handler;
                if ( ( this.defaultOptionProps || [] ).includes( item.handlerName ) ) {
                    handler = this.options[ item.handlerName ].bind( this );
                } else {
                    handler = this[ item.handlerName ].bind( this );
                }

                this._bindHandlers.push( {
                    handler,
                    element,
                    eventType: item.eventType
                } );
                element.addEventListener( item.eventType, handler );
            }
        }
    }

    /**
     * Функция вызывающая при уничтожениии виджета
     */
    destroy() {
        const handlers = this._bindHandlers;
        if ( handlers ) {

            // Remove event listener bind from @handler decorator
            handlers.forEach(
                ( { handler, element, eventType } ) => {
                    element.removeEventListener( eventType, handler );
                }
            );
        }
    }

    /**
     * Query current container by this.containerSelector and save node as this.container
     */
    resolveContainer() {
        if ( this.options.cacheParentContainer ) {
            if ( !this.containerParentNode ) {
                this.containerParentNode = document.querySelector(
                    this.containerSelector
                ).parentNode;
            }
            this.container = this.containerParentNode.querySelector(
                this.containerSelector
            );
        } else {
            this.container = document.querySelector( this.containerSelector );
        }

        assert.error(
            inline`Widget ${this.ID} doesn't resolve container. Check container selector`,
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
