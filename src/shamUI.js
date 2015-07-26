/**
 * Основной модуль
 * @module shamUI
 */
define( [
  "Class",
  "machina",
  "./fsm",
  "./binding",
  "./widget",
  "./widgets/label/main"
], function( Class, machina, fsm, binding, widget, LibraryLabel ) {
    var ShamUI = Class(
        /** @lends ShamUI.prototype */
        {
            /**
             * @constructs
             * @classdesc Фабрика для создания инстанцов библиотеки
             * @param {Object=} optionsArgs Опции
             * @param {Object=} optionsArgs.Fsm    Конструктор для FSM. По-умолчнию используется
             *                                     {@link module:shamUI/fsm~Fsm}
             * @param {Object=} optionsArgs.states Состояния FSM. По-умолчнию используется
             *                                    {@link module:shamUI/fsm~states}
             */
            constructor: function( optionsArgs ) {
                var options = optionsArgs || {},
                    FsmConstructor = options.Fsm || fsm.Fsm,
                    FsmStates = options.fsmStates || fsm.states;

                this.render = new machina.Fsm(
                    ( new FsmConstructor( FsmStates ) ).__proto__
                );
            },
            /**
             * Доступ к конечному автомату
             * type {Object}
             * @see {@link module:shamUI/fsm}
             */
            render: null,
            /**
             * Установить биндинг
             * @param {Function} fn Фукнция создающая виджеты
             */
            setBinding: function( fn ) {
                var args = [ fn, this ].concat(
                    Array.prototype.slice.call( arguments, 1 )
                );
                this.render.setBinding( binding.apply( this, args ) );
            }
        }
    );
    return {
        /** Функционал для работы с классами */
        Class: Class,
        /**
         * Основной класс для создания инстансов библиотеки
         * @see ShamUI
         */
        main: ShamUI,
        /**
         * Функционал для работы с конечным атоматом рендера
         * @see {@link module:shamUI/fsm}
         */
        fsm: fsm,
        /**
         * Базовый класс виджета
         * @see {@link module:shamUI/widget}
         */
        Widget: widget,
        /**
         * Библиотека встроенных виджетов
         */
        Library: {
            Label: LibraryLabel
        }
    };
} );
