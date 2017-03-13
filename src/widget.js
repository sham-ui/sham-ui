import options from './decorators/options';
import { inject } from './DI';

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
     * @member {Boolean}
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
            const defaultStaticOptionProps = owner[ 'defaultOptionProps' ] || [];
            for ( let name of defaultStaticOptionProps ) {
                if ( !this._options.hasOwnProperty( name ) ) {
                    this._options[ name ] = owner[ name ];
                }
            }
        }
    }

    /**
     * Функция возвращающая html для отрисовки
     * @return {String}
     */
    html() {};

    /**
     * Добавить обработчики событий
     */
    bindEvents() {};

    /**
     * Функция вызывающая при уничтожениии виджета
     */
    destroy() {};

    /**
     * Отрисовать виджет в контейнер
     * @returns {{container: *, html: *}}
     */
    render() {
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
}
