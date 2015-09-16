/**
 * Базовый класс для виджета
 * @module shamUI/widget
 * @see Widget
 */
define( [
    "lodash",
    "Class"
], function( _,  Class ) {
    var Widget = Class(
        /** @lends Widget.prototype */
        {
            /**
             * @constructs
             * @classdesc Базовый класс для виджетов
             * @param {String}  containerSelector CSS-селектор элемента, в который будет
             *                                    происходить отрисовка
             * @param {String}  ID                Уникальный идентификтор
             * @param {Object} [options]          Опции
             */
            constructor: function( containerSelector, ID, options ) {
                this.ID = ID;
                this.containerSelector = containerSelector;
                this.options = options || {};
                this.UI.render.register( this )
            },

            /**
             * Элемент-контейнер для виджета
             * @member {Node}
             */
            container: null,

            /**
             * Опции по-умолчанию
             * @member {Object}
             * @namespace
             */
            defaultOptions: {

                /**
                * Тип виджета
                * @member {Array}
                */
                types: [],

                /**
                 * Сначала биндим обработчики событий, потом отрисовываем
                 * @member {Array}
                 * @default [ "bindEvents", "render" ]
                 */
                actionSequence: [ "bindEvents", "render" ],

                /**
                 * Если биндим обработчики собыйти после отрисовки, то нужно ли перебиндиивать их
                 * после каждой отрисовки
                 * @member {Boolean}
                 * @default true
                 */
                bindOnce: true,

                /**
                 * Нужно ли кэшировать родительский элемент для контейнера
                 * @member {Boolean}
                 * @default false
                 */
                cacheParentContainer: false,

                /**
                 * Виджет отрисовывается ассинхронно
                 * @member {Boolean}
                 * @default false,
                 */
                renderAsync: false,

                /**
                 * Обертка для ассинхроной отрисовки
                 * @param {Function} renderCallback callback для рендера
                 */
                renderAsyncWrapper: function( renderCallback ) {
                    window.requestAnimationFrame( renderCallback );
                },

                /**
                 * Массив виджетов, которые нужно отрисовать перед тем, как отрисовывать этот виджет
                 * @member {Array}
                 */
                renderDependence: []
            },
            $ready: function( clazz, parent, api ) {
                var i;
                if ( this !== clazz ) {

                    // Наследуем опции по-умолчнанию
                    for ( i = 0; i < parent.length; i++ ) {
                        clazz.prototype.defaultOptions = _.defaultsDeep(
                            clazz.prototype.defaultOptions,
                            parent[ i ].prototype.defaultOptions
                        );
                    }
                }
            },
            /**
             * Опции виджета. Переопределяют опции по-умолчанию
             * @name Widget#options
             * @type Object
             * @see Widget#defaultOptions
             */
            options: {
                get: function() {
                    return this._options;
                },
                set: function( options ) {

                    // Выставляем опции по-умолчанию
                    this._options = _.defaultsDeep( options || {}, this.defaultOptions );
                }
            },
            /**
             * Добавить обработчики собыйти
             * @type {Function|null}
             */
            bindEvents: null,
            /**
             * Отрисовать виджет в контейнер
             * @returns {{container: *, html: *}}
             */
            render: function() {
                if ( this.html ) {
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
                    return {
                        container: this.container,
                        html: this.html()
                    }
                }
            },
            /**
             * Функция возвращающая html для отрисовки
             * @type {Function|null}
             */
            html: null,
            /**
             * Функция вызывающая при уничтожениии виджета
             * @type {Function|null}
             */
            destroy: null
        }
    );
    /**
     * Базовый класс виджета
     * @see Widget
     */
    return Widget;
} );
