/**
 * Работа с конечным автоматом
 * @module shamUI/fsm
 */
define( [
    "lodash",
    "Class",
    "Q"
], function( _, Class, Q ) {
    var Fsm,
        UninitializedState,
        ReadyState,
        RegistrationState,
        RenderingState,
        states = {};

    UninitializedState = Class(
        /** @lends UninitializedState.prototype */
        {
            /**
             * @constructs
             * @classdesc Класс для первоначального состояния
             */
            constructor: function() {},
            /**
             * Установить биндинг
             * @param {Function} widgetBinding Функция биндинга виджетов
             */
            setBinding: function( widgetBinding ) {
                this.widgetBinding = widgetBinding;
                this.transition( "ready" );
            }
        }
    );
    states.uninitialized = UninitializedState;

    ReadyState = Class(
        /** @lends ReadyState.prototype */
        {
            /**
             * @constructs
             * @classdesc Класс для состояния "Готов к работе"
             */
            constructor: function() {},
            /**
             * Вызывается при входе в состояние
             */
            _onEnter: function() {
                this.emit( "Ready" );
            },
            /**
             * Удалить все виджеты
             */
            clear: function() {
                for ( var i = 0; i < this.widgets.length; i++ ) {
                    if ( this.widgets[ i ].destroy ) {
                        if ( this.widgets[ i ].options.beforeDestroy ) {
                            this.widgets[ i ].options.beforeDestroy.call( this.widgets[ i ] );
                        }
                        this.widgets[ i ].destroy();
                        if ( this.widgets[ i ].options.afterDestroy ) {
                            this.widgets[ i ].options.afterDestroy.call( this.widgets[ i ] );
                        }
                    }
                    this.widgets[ i ].isBinded = false;
                }
                this.widgets = [];
                this.idArray = [];
                this.byType = {};
                this.byId = {};
            },
            /**
             * Установить биндинг. При уставновке биндинга все зарегистрированные виджеты очищаются
             * @param {Function} widgetBinding Функция биндинга виджетов
             */
            setBinding: function( widgetBinding ) {
                this.handle( "clear" );
                this.transition( "uninitialized" );
                this.handle( "setBinding", widgetBinding );
            },
            /**
             * Отрисовать все виджеты. Просто отрисовывает, не вызывает destroy
             */
            all: function() {
                this.changeWidgets = this.idArray.slice( 0 );
                this.transition( "rendering" );
            },
            /**
             * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает destroy
             * @param {Array} needRenderingWidgets Список виджетов, которые нужно отрисовать
             */
            only: function( needRenderingWidgets ) {
                this.changeWidgets = needRenderingWidgets.slice( 0 );
                this.transition( "rendering" );
            },
            /**
             * Отрисовать все виджеты. Вызывает destroy, очищает список известных виджетов,
             * переходит к регистрации
             */
            forceAll: function() {
                this.handle( "clear" );
                this.transition( "registration" );
            },
            /**
             * Отрисовать указанные виджеты. Помимо перерисовки еще и польностье перерегистриует
             * указанные виджеты
             * @param {Array} needRenderingWidgets Список виджетов, которые нужно
             *                                     перерегистривароть и отрисовать
             */
            forceOnly: function( needRenderingWidgets ) {
                var index,
                    widget,
                    i;
                for ( i = 0; i < this.widgets.length; i++ ) {
                    widget = this.widgets[ i ];
                    index = needRenderingWidgets.indexOf( widget );
                    if ( index > -1 ) {
                        if ( widget.destroy  ) {
                            if ( widget.options.beforeDestroy ) {
                                widget.options.beforeDestroy.call( widget );
                            }
                            widget.destroy();
                            if ( widget.options.afterDestroy ) {
                                widget.options.afterDestroy.call( widget );
                            }
                        }
                        if ( widget.bindEvents ) {
                            if ( widget.options.beforeBindEvents ) {
                                widget.options.beforeBindEvents.call( widget );
                            }
                            widget.bind();
                            if ( widget.options.afterBindEvents ) {
                                widget.options.afterBindEvents.call( widget );
                            }
                        }
                        widget.isBinded = false;
                    }
                }
                this.changeWidgets = needRenderingWidgets.slice( 0 );
                this.transition( "rendering" );
            },
            /**
             * Отрисовать виджеты с указанным типом
             * @param {Array} needRenderingWidgetsWithType Список типов, которые нужно отрисовать
             */
            onlyType: function( needRenderingWidgetsWithType ) {
                var argsTypes = needRenderingWidgetsWithType.slice( 0 ),
                    widgetID,
                    widgetsWithType,
                    i;
                for ( i = 0; i < argsTypes.length; i++ ) {
                    widgetsWithType = this.byType[ argsTypes[ i ] ];
                    if ( widgetsWithType ) {
                        for ( var j = 0, l = widgetsWithType.length; j < l; j++ ) {
                            widgetID = widgetsWithType[ j ];
                            if ( this.changeWidgets.indexOf( widgetID ) === -1 ) {
                                this.changeWidgets.push( widgetID );
                            }
                        }
                    }
                }
                this.transition( "rendering" );
            },
            /**
             * Зарегистрировать виджет (не из файла биндинга и конструкторов виджетов)
             * @see {@link RegistrationState#register}
             * @see Widget
             * @see Widget#defaultOptions
             */
            register: function( widget ) {

                // Регистрируем виджет
                this.states.registration.register.call( this, widget );

                // Если сначала биндим обработчики событий, а потом отрисовываем виджет
                if ( "bindEvents" === widget.options.actionSequence[ 0 ] &&
                    widget.bindEvents ) {
                    if ( widget.options.beforeBindEvents ) {
                        widget.options.beforeBindEvents.call( widget );
                    }
                    widget.bindEvents();
                    if ( widget.options.afterBindEvents ) {
                        widget.options.afterBindEvents.call( widget );
                    }
                }
            },

            /**
             * Разрегистрировать виджет
             * @param {String} widgetId Идентификатор виджета, который нужно разрегистрировать
             */
            unregister: function( widgetId ) {
                var widget,
                    types,
                    index,
                    i;

                if ( this.idArray.indexOf( widgetId ) === -1 ) {
                    return;
                }

                widget = this.byId[ widgetId ];

                if ( widget.destroy  ) {
                    if ( widget.options.beforeDestroy ) {
                        widget.options.beforeDestroy.call( widget );
                    }
                    widget.destroy();
                    if ( widget.options.afterDestroy ) {
                        widget.options.afterDestroy.call( widget );
                    }
                }

                // Если есть типы, то удаляем ссылки на этот виджет
                if ( widget.options.types ) {
                    types = widget.options.types;
                    for ( i = 0; i < types.length; i++ ) {
                        this.byType[ types[ i ] ].splice(
                            this.byType[ types[ i ] ].indexOf( widgetId ),
                            1
                        )
                    }
                }

                // Удаляем запись из массива виджетов
                for ( i = 0; i < this.widgets.length; i++ ) {
                    if ( this.widgets[ i ].ID === widgetId ) {
                        index = i;
                        break;
                    }
                }
                this.widgets.splice( index, 1 );

                // Удаляем из массива ID
                this.idArray.splice( this.idArray.indexOf( widgetId ), 1 );

                // И из объекта доступа по id
                delete this.byId[ widgetId ];
            }
        }
    );
    states.ready = ReadyState;

    RegistrationState = Class(
        /** @lends RegistrationState.prototype */
        {
            /**
             * @constructs
             * @classdesc Класс для состояния "Регистрация виджетов"
             */
            constructor: function() {},
            /**
             * Что делать с необрабатываемыми в этом состояния хэндлеры
             */
            "*": function() {
                this.deferUntilTransition();
            },
            /**
             * Вызывается при входе в состояние
             */
            _onEnter: function() {
                this.widgetBinding( this );
            },
            /**
             * Зарегистрировать виджет
             * @param {*}         widget.ID                      Идентификатор
             * @param {Function} [widget.bind]                   Функция навешивающая обработчики
             * @param {Function} [widget.render]                 Функция отрисовки.
             * @param {Function} [widget.destroy]                Функция отвязывающая обработчики
             * @param {Object}   [widget.options]                Опции виджета
             * @param {Array}    [widget.options.types]          Массив типов
             * @param {Function} [widget.options.beforeRegister] До регистрации
             * @param {Function} [widget.options.afterRegister]  После регистрации
             * @param {Function} [widget.options.beforeBind]     До навешивания обработчиков
             * @param {Function} [widget.options.afterBind]      После навешивания обработчиков
             * @param {Function} [widget.options.beforeRender]   До отрисовки этого элемента
             * @param {Function} [widget.options.afterRender]    После отрисовки этого элемента
             * @param {Function} [widget.options.beforeDestroy]  До отвязки обработчиков
             * @param {Function} [widget.options.afterDestroy]   После отвязки обработчиков
             * @see Widget
             * @see Widget#defaultOptions
             */
            register: function( widget ) {

                // Добавляем только те, которых еще нет
                if ( this.idArray.indexOf( widget.ID ) === -1 ) {
                    if ( widget.options.beforeRegister ) {
                        widget.options.beforeRegister.call( widget );
                    }
                    this.idArray.push( widget.ID );
                    this.byId[ widget.ID ] = widget;

                    // Если есть типы
                    if ( widget.options.types ) {
                        for ( var i = 0; i < widget.options.types.length; i++ ) {
                            if ( this.byType[ widget.options.types[ i ] ] === undefined ) {
                                this.byType[ widget.options.types[ i ] ] = [];
                            }
                            this.byType[ widget.options.types[ i ] ].push( widget.ID );
                        }
                    }

                    this.widgets.push( widget );
                    if ( widget.options.afterRegister ) {
                        widget.options.afterRegister.call( widget );
                    }
                }
            },
            /**
             * Все виджеты зарегисрированы
             * Если нужно, то сначала биндим обработчики событий, а потом отрисовываем
             */
            registrationComplete: function() {
                var widget;
                this.emit( "registrationComplete" );
                for ( var i = 0; i < this.widgets.length; i++ ) {
                    widget = this.widgets[ i ];

                    // Если сначала биндим обработчики событий, а потом отрисовываем виджет
                    if ( "bindEvents" === widget.options.actionSequence[ 0 ] &&
                        widget.bindEvents ) {
                        if ( widget.options.beforeBindEvents ) {
                            widget.options.beforeBindEvents.call( widget );
                        }
                        widget.bindEvents();
                        if ( widget.options.afterBindEvents ) {
                            widget.options.afterBindEvents.call( widget );
                        }
                    }
                }
                this.changeWidgets = this.idArray.slice( 0 );
                this.transition( "rendering" );
            }
        }
    );
    states.registration = RegistrationState;

    RenderingState = Class(
        /** @lends RenderingState.prototype */
        {
            /**
             * @constructs
             * @classdesc Класс для состояния "Отрисовываем виджеты"
             */
            constructor: function() {},
            /**
             * Что делать с необрабатываемыми в этом состояния хэндлеры
             */
            "*": function() {
                this.deferUntilTransition();
            },
            /**
             * Вызывается при входе в это состояние
             */
            _onEnter: function() {
                var self = this,
                    current,
                    i,
                    j,
                    deferred,
                    promises = [],
                    promiseById = {},
                    widgetDependencePromise;

                // Сортируем по renderDependence
                this.changeWidgets.sort( function( a, b ) {
                    var widgetARD = self.byId[ a ].options.renderDependence,
                        widgetBRD = self.byId[ b ].options.renderDependence;
                    if ( !widgetARD || !widgetARD.length ) {
                        if ( !widgetBRD || !widgetBRD.length ) {

                            // У обоих виджетов нет зависимостей
                            return 0;
                        } else {

                            // Зависит ли виджет B от виджета A
                            return widgetBRD.indexOf( a ) !== -1 ? -1 : 0;
                        }
                    } else {
                        if ( !widgetBRD || !widgetBRD.length ) {

                            // Зависит ли виджет A от виджета B
                            return widgetARD.indexOf( b ) !== -1 ? 1 : 0;
                        } else {

                            // У обоих виджетов есть зависимости
                            if ( widgetARD.indexOf( b ) !== -1 ) {

                                // Виджет A зависит от виджета B
                                return 1;
                            } else if ( widgetBRD.indexOf( a ) !== -1 ) {

                                // Виджет B зависит от виджета A
                                return -1;
                            } else {

                                // Виджеты не зависят друг от друга
                                return 0;
                            }
                        }
                    }
                } );

                this.rendered = [];

                for ( i = 0; i < this.changeWidgets.length; i++ ) {
                    current = this.byId[ this.changeWidgets[ i ] ];
                    if ( current.render ) {
                        if ( !current.options.conditionRender ||
                            current.options.conditionRender() ) {
                            deferred = Q.defer();
                            promises.push( deferred.promise );
                            promiseById[ this.changeWidgets[ i ] ] = deferred.promise;

                            if ( current.options.renderDependence &&
                                current.options.renderDependence.length ) {
                                widgetDependencePromise = new Array(
                                    current.options.renderDependence.length
                                );
                                for ( j = 0; j < current.options.renderDependence.length; j++ ) {
                                    widgetDependencePromise[ j ] = promiseById[
                                        current.options.renderDependence[ j ]
                                    ];
                                }
                            } else {
                                widgetDependencePromise = [];
                            }

                            ( function( widget, widgetDependencePromise, deferred ) {

                                // Отрисовываем этот виджет только после того, как
                                // все зависимости отрисовались
                                Q.allSettled( widgetDependencePromise )
                                    .then( function() {
                                        if ( widget.options.renderAsync ) {
                                            widget.options.renderAsyncWrapper(
                                                function() {
                                                    self.handle( "renderWidget", widget, deferred );
                                                }
                                            );
                                        } else {
                                            self.handle( "renderWidget", widget, deferred );
                                        }
                                    } )
                            } )( current, widgetDependencePromise, deferred );
                        }
                    }
                }

                Q.allSettled( promises )
                    .then( function() {
                        var i;

                        // Все области отрисовались
                        promiseById = null;

                        // Так же обрабатываем по отдельности
                        for ( i = 0; i < self.rendered.length; i++ ) {
                            self.emit( [
                                "RenderComplete[", self.rendered[ i], "]"
                            ].join( "" ) );
                        }

                        // И все сразу
                        self.emit( "RenderComplete", self.rendered );
                        self.transition( "ready" );
                    } );
            },
            /**
             * Вызывается при выходе из этого состояни
             */
            _onExit: function() {
                this.rendered = [];
                this.changeWidgets = [];
            },
            /**
             * Отрисовать один виджет
             * @param {Object} widget   Виджет
             * @param {Object} deferred Отложенный объект для этого виджета
             * @see Widget
             */
            renderWidget: function( widget, deferred ) {
                var obj,
                    newEl;
                if ( widget.options.beforeRender ) {
                    widget.options.beforeRender.call( widget );
                }
                this.rendered.push( widget.ID );
                obj = widget.render();
                if ( obj ) {
                    newEl = obj.container.cloneNode( false );
                    newEl.innerHTML = obj.html;
                    obj.container.parentNode.replaceChild( newEl, obj.container );
                    widget.container = newEl;
                    newEl = null;
                }
                if ( widget.options.afterRender ) {
                    widget.options.afterRender.call( widget );
                }
                if ( widget.options.actionSequence[ 0 ] === "render" &&
                    widget.bindEvents && !widget.isBinded ) {

                    // Если после отрисовки нужно биндить обработчики событий вижета или нет
                    if ( widget.options.beforeBindEvents ) {
                        widget.options.beforeBindEvents.call( widget );
                    }
                    widget.bindEvents();
                    if ( widget.options.afterBindEvents ) {
                        widget.options.afterBindEvents.call( widget );
                    }
                    if ( widget.options.bindOnce ) {
                        widget.isBinded = true;
                    }
                }
                deferred.resolve();
            }
        }
    );
    states.rendering = RenderingState;

    Fsm = Class(
        /** @lends Fsm.prototype */
        {
        /**
         * @constructs
         * @classdesc Класс основного конечного атомата
         * @param {Object} statesOptions Состояния конечного атомата
         */
        constructor: function( statesOptions ) {
            var fsmStates = statesOptions || states,
                state;
            for ( state in  fsmStates ) {
                if ( fsmStates.hasOwnProperty( state ) ) {
                    this.states[ state ] = ( new fsmStates[ state ] ).__proto__;
                }
            }
        },
        widgets: [],
        idArray: [],
        byType: {},
        byId: {},
        states: {},

        initialState: "uninitialized",

        /**
         * Установить биндинг. При уставновке биндинга все зарегистрированные виджеты очищаются
         * @param {Function} widgetBinding Функция биндинга виджетов
         * @see {@link UninitializedState#setBinding}
         * @see {@link ReadyState#setBinding}
         */
        setBinding: function( widgetBinding ) {
            this.handle( "setBinding", widgetBinding );
        },
        /**
         * Перерисовать все
         * @see {@link ReadyState#all}
         */
        ALL: function() {
            this.handle( "all" );
        },
        /**
         * Перерисовать только те, ID которых переданны в аргументах
         * @see {@link ReadyState#only}
         * @param {...String} args Список ID виджетов, которые нужно отрисовать
         */
        ONLY: function( args ) {
            this.handle( "only", Array.prototype.slice.call( arguments, 0 ) );
        },
        /**
         * Перерисовать все и переинициализировать
         * @see {@link ReadyState#forceAll}
         */
        FORCE_ALL: function() {
            this.handle( "forceAll" );
        },
        /**
         * Отрисовать указанные виджеты. Помимо перерисовки еще и польностье перерегистриует
         * указанные виджеты
         * @see {@link ReadyState#forceOnly}
         * @param {...String} args Список ID виджетов, которые нужно отрисовать
         */
        FORCE_ONLY: function( args ) {
            this.handle( "forceOnly", Array.prototype.slice.call( arguments, 0 ) );
        },
        /**
         * Перерисовать только с указанными типами
         * @param {...String} args Список типов виджетов, которые нужно отрисовать
         * @see {@link ReadyState#onlyType}
         */
        ONLY_TYPE: function( args ) {
            this.handle( "onlyType", Array.prototype.slice.call( arguments, 0 ) );
        },
        /**
         * Зарегистрировать виджет
         * @param {*}         widget.ID                     Идентификатор
         * @param {Function} [widget.bind]                   Функция навешивающая обработчики
         * @param {Function} [widget.render]                 Функция отрисовки.
         * @param {Function} [widget.destroy]                Функция отвязывающая обработчики
         * @param {Object}   [widget.options]                Опции виджета
         * @param {Array}    [widget.options.types]          Массив типов
         * @param {Function} [widget.options.beforeRegister] До регистрации
         * @param {Function} [widget.options.afterRegister]  После регистрации
         * @param {Function} [widget.options.beforeBind]     До навешивания обработчиков
         * @param {Function} [widget.options.afterBind]      После навешивания обработчиков
         * @param {Function} [widget.options.beforeRender]   До отрисовки этого элемента
         * @param {Function} [widget.options.afterRender]    После отрисовки этого элемента
         * @param {Function} [widget.options.beforeDestroy]  До отвязки обработчиков
         * @param {Function} [widget.options.afterDestroy]   После отвязки обработчиков
         * @see {@link RegistrationState#register}
         */
        register: function( widget ) {
            this.handle( "register", widget );
        },
        /**
         * Разрегистрировать виджет
         * @param {String} widgetId Идентификатор виджета
         */
        unregister: function( widgetId ) {
            this.handle( "unregister", widgetId );
        }
    } );

    return {
        /**
         * Конечный автомат
         * @see Fsm
         */
        Fsm: Fsm,
        /**
         * Состояния конечного атомата
         * @see UninitializedState
         * @see ReadyState
         * @see RegistrationState
         * @see RenderingState
         */
        states: states
    };
} );