import BaseRegistrationState from './base-registration';

/**
 * Класс для состояния "Готов к работе"
 */
export default class ReadyState extends BaseRegistrationState {

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
        const { store } = this;
        store.forEach( widget => widget.remove() );
        store.clear();
    }

    /**
     * Отрисовать все виджеты. Вызывает remove, очищает список известных виджетов,
     * переходит к регистрации
     */
    all() {
        this.clear();
        this.transition( 'registration' );
    }

    /**
     * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает remove
     * @param {Array} needRenderingWidgets Список виджетов, которые нужно отрисовать
     */
    onlyIds( needRenderingWidgets ) {
        this.store.forEachId(
            needRenderingWidgets,
            this.store.changedWidgets.add.bind( this.store.changedWidgets )
        );
        this.transition( 'rendering' );
    }

    /**
     * Отрисовать виджеты с указанным типом
     * @param {Array} needRenderingWidgetsWithType Список типов, которые нужно отрисовать
     */
    onlyTypes( needRenderingWidgetsWithType ) {
        this.store.forEachType(
            needRenderingWidgetsWithType,
            this.store.changedWidgets.add.bind( this.store.changedWidgets )
        );
        this.transition( 'rendering' );
    }

    /**
     * Разрегистрировать виджет
     * @param {String} widgetId Идентификатор виджета, который нужно разрегистрировать
     */
    unregister( widgetId ) {
        const { store } = this;
        const widget = store.findById( widgetId );
        if ( undefined !== widget ) {
            widget.remove();
            store.unregister( widget );
        }
    }
}
