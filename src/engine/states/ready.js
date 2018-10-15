import State from '../../fsm/state';
import callWithHook from '../utils/call-with-hooks';

/**
 * Класс для состояния "Готов к работе"
 */
export default class ReadyState extends State {

    /**
     * Вызывается при входе в состояние
     */
    _onEnter() {
        this.emit( 'Ready' );
    }

    /**
     * Удалить все виджеты
     */
    clear() {
        for ( let i = 0; i < this._fsm.widgets.length; i++ ) {
            const widget = this._fsm.widgets[ i ];
            const destroy = widget.destroy;
            if ( 'function' === typeof destroy ) {
                callWithHook( widget, 'Destroy', widget.destroy.bind( widget ) );
            }
        }
        this._fsm.widgets = [];
        this._fsm.idArray = [];
        this._fsm.byType = {};
        this._fsm.byId = {};
    }

    /**
     * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает destroy
     * @param {Array} needRenderingWidgets Список виджетов, которые нужно отрисовать
     */
    onlyIds( needRenderingWidgets ) {
        this._fsm.changeWidgets = needRenderingWidgets.slice( 0 );
        this.transition( 'rendering' );
    }

    /**
     * Отрисовать все виджеты. Вызывает destroy, очищает список известных виджетов,
     * переходит к регистрации
     */
    all() {
        this.handle( 'clear' );
        this.transition( 'registration' );
    }

    /**
     * Отрисовать виджеты с указанным типом
     * @param {Array} needRenderingWidgetsWithType Список типов, которые нужно отрисовать
     */
    onlyTypes( needRenderingWidgetsWithType ) {
        this._fsm.changeWidgets = [];
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
        if ( this._fsm.changeWidgets.length > 0 ) {
            this.transition( 'rendering' );
        }
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
            callWithHook( widget, 'Destroy', widget.destroy.bind( widget ) );
        }

        // Если есть типы, то удаляем ссылки на этот виджет
        if ( widget.options.types ) {
            types = widget.options.types;
            for ( i = 0; i < types.length; i++ ) {
                this._fsm.byType[ types[ i ] ].splice(
                    this._fsm.byType[ types[ i ] ].indexOf( widgetId ),
                    1
                );
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
    }
}
