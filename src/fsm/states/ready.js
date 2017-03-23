import { State } from '../../utils/fsm';

/**
 * Класс для состояния "Готов к работе"
 */
export default class ReadyState extends State {
    /**
     * Вызывается при входе в состояние
     */
    _onEnter() {
        this.emit( "Ready" );
    }

    /**
     * Удалить все виджеты
     */
    clear() {
        for ( let i = 0; i < this._fsm.widgets.length; i++ ) {
            if ( this._fsm.widgets[ i ].destroy ) {
                if ( this._fsm.widgets[ i ].options.beforeDestroy ) {
                    this._fsm.widgets[ i ].options.beforeDestroy.call( this._fsm.widgets[ i ] );
                }
                this._fsm.widgets[ i ].destroy();
                if ( this._fsm.widgets[ i ].options.afterDestroy ) {
                    this._fsm.widgets[ i ].options.afterDestroy.call( this._fsm.widgets[ i ] );
                }
            }
            this._fsm.widgets[ i ].isBinded = false;
        }
        this._fsm.widgets = [];
        this._fsm.idArray = [];
        this._fsm.byType = {};
        this._fsm.byId = {};
        this._fsm.renderCache = {};
    }

    /**
     * Отрисовать все виджеты. Просто отрисовывает, не вызывает destroy
     */
    all() {
        this._fsm.changeWidgets = this._fsm.idArray.slice( 0 );
        this.transition( "rendering" );
    }

    /**
     * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает destroy
     * @param {Array} needRenderingWidgets Список виджетов, которые нужно отрисовать
     */
    only( needRenderingWidgets ) {
        this._fsm.changeWidgets = needRenderingWidgets.slice( 0 );
        this.transition( "rendering" );
    }

    /**
     * Отрисовать все виджеты. Вызывает destroy, очищает список известных виджетов,
     * переходит к регистрации
     */
    forceAll() {
        this.handle( "clear" );
        this.transition( "registration" );
    }

    /**
     * Отрисовать указанные виджеты. Помимо перерисовки еще и польностье перерегистриует
     * указанные виджеты
     * @param {Array} needRenderingWidgets Список виджетов, которые нужно
     *                                     перерегистривароть и отрисовать
     */
    forceOnly( needRenderingWidgets ) {
        let index,
            widget,
            i;
        for ( i = 0; i < this._fsm.widgets.length; i++ ) {
            widget = this._fsm.widgets[ i ];
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
                widget.resolveContainer();
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
        this._fsm.changeWidgets = needRenderingWidgets.slice( 0 );
        this.transition( "rendering" );
    }

    /**
     * Отрисовать виджеты с указанным типом
     * @param {Array} needRenderingWidgetsWithType Список типов, которые нужно отрисовать
     */
    onlyType( needRenderingWidgetsWithType ) {
        let argsTypes = needRenderingWidgetsWithType.slice( 0 ),
            widgetID,
            widgetsWithType,
            i;
        for ( i = 0; i < argsTypes.length; i++ ) {
            widgetsWithType = this._fsm.byType[ argsTypes[ i ] ];
            if ( widgetsWithType ) {
                for ( let j = 0, l = widgetsWithType.length; j < l; j++ ) {
                    widgetID = widgetsWithType[ j ];
                    if ( this._fsm.changeWidgets.indexOf( widgetID ) === -1 ) {
                        this._fsm.changeWidgets.push( widgetID );
                    }
                }
            }
        }
        this.transition( "rendering" );
    }

    /**
     * Зарегистрировать виджет (не из файла биндинга и конструкторов виджетов)
     * @see {@link RegistrationState#register}
     * @see Widget
     * @see Widget#defaultOptions
     */
    register( widget ) {

        // Регистрируем виджет
        this._fsm._states.registration.register( widget );

        // Если сначала биндим обработчики событий, а потом отрисовываем виджет
        if ( "bindEvents" === widget.options.actionSequence[ 0 ] ) {
            widget.resolveContainer();
            if ( widget.bindEvents ){
                if ( widget.options.beforeBindEvents ) {
                    widget.options.beforeBindEvents.call( widget );
                }
                widget.bindEvents();
                if ( widget.options.afterBindEvents ) {
                    widget.options.afterBindEvents.call( widget );
                }
            }
        }
    }

    /**
     * Разрегистрировать виджет
     * @param {String} widgetId Идентификатор виджета, который нужно разрегистрировать
     */
    unregister( widgetId ) {
        let widget,
            types,
            index,
            i;

        if ( this._fsm.idArray.indexOf( widgetId ) === -1 ) {
            return;
        }

        widget = this._fsm.byId[ widgetId ];

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
                this._fsm.byType[ types[ i ] ].splice(
                    this._fsm.byType[ types[ i ] ].indexOf( widgetId ),
                    1
                )
            }
        }

        // Удаляем запись из массива виджетов
        for ( i = 0; i < this._fsm.widgets.length; i++ ) {
            if ( this._fsm.widgets[ i ].ID === widgetId ) {
                index = i;
                break;
            }
        }
        this._fsm.widgets.splice( index, 1 );

        // Удаляем из массива ID
        this._fsm.idArray.splice( this._fsm.idArray.indexOf( widgetId ), 1 );

        // И из объекта доступа по id
        delete this._fsm.byId[ widgetId ];

        delete this._fsm.renderCache[ widgetId ];
    }
}