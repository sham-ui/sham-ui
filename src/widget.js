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
        this.options = options;
        this.UI.render.register( this )
    }

    /**
     * Сначала биндим обработчики событий, потом отрисовываем
     * @type {Array}
     * @default [ "bindEvents", "render" ]
     */
    @options
    actionSequence = [ "bindEvents", "render" ];

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
    bindOnce = true;

    /**
     * Нужно ли кэшировать родительский элемент для контейнера
     * @type {Boolean}
     * @default false
     */
    @options
    cacheParentContainer = false;

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

    /**
     * Опции виджета. Переопределяют опции по-умолчанию
     * @see #Widget
     * @return {Object}
     */
    get options() {
        return this._options;
    }

    /**
     * @param {Object} options
     */
    set options( options ) {

        // Выставляем опции по-умолчанию
        this._options = {};
        const _options = options || {};
        for ( let name in _options ) {
            if ( !_options.hasOwnProperty( name ) ) {
                continue;
            }
            this._options[ name ] = _options[ name ];
        }

        const optionsOwners = [
            this.constructor, // Static options
            this              // Instance options
        ];
        for ( let owner of optionsOwners ) {
            const defaultOptions = owner[ 'defaultOptionProps' ] || [];
            for ( let name of defaultOptions ) {
                if ( !this._options.hasOwnProperty( name ) ) {
                    this._options[ name ] = owner[ name ];
                }
            }
        }
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
                    element = this.container.querySelector( item.selector );
                    assert.error(
                        inline`Widget "${this.ID}" hasn't sub-element "${item.selector}" 
                        for bind event "${item.handlerName}."`,
                        !element
                    );
                }
                assert.error(
                    inline`Widget "${this.ID}" use @handler decorator, but in actionSequence 
                    first action is "bindEvents". With decorator @handler with Widget.html() method 
                    you must use "render" as first action in actionSequence`,
                    'bindEvents' === this.options.actionSequence[ 0 ] &&
                    undefined !== this.html
                );

                assert.error(
                    inline`Widget "${this.ID}" use @handler decorator with Widget.html() method
                    & "render" as first action in actionSequence, but widget options "bindOnce" 
                    is true.`,
                    'render' === this.options.actionSequence[ 0 ] &&
                    undefined !== this.html &&
                    this.options.bindOnce
                );

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
                    element.removeEventListener( eventType, handler )
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
        }
    }
}
