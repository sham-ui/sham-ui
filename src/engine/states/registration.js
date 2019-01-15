import { inject } from '../../DI';
import BaseRegistrationState from './base-registration';


/**
 * Класс для состояния "Регистрация виджетов"
 */
export default class RegistrationState extends BaseRegistrationState {
    @inject( 'widget-binder' ) widgetBinder;

    /**
     * Что делать с необрабатываемыми в этом состояния хэндлерами
     */
    _anyEvents() {
        this.deferUntilTransition();
    }

    /**
     * Вызывается при входе в состояние
     */
    _onEnter() {
        this.widgetBinder();
        this.registrationComplete();
    }

    /**
     * Отрисовать только указанные виджеты. Просто отрисовывает, не вызывает remove
     * @param {Array.<String>} needRenderingWidgets Список виджетов, которые нужно отрисовать
     */
    onlyIds( needRenderingWidgets ) {
        this.store.forEachId(
            needRenderingWidgets,
            widget => this.store.changedWidgets.add( widget )
        );
    }

    /**
     * Отрисовать виджеты с указанным типом
     * @param {Array} needRenderingWidgetsWithType Список типов, которые нужно отрисовать
     */
    onlyTypes( needRenderingWidgetsWithType ) {
        this.store.forEachType(
            needRenderingWidgetsWithType,
            widget => this.store.changedWidgets.add( widget )
        );
    }

    /**
     * Все виджеты зарегисрированы
     * Если нужно, то сначала биндим обработчики событий, а потом отрисовываем
     */
    registrationComplete() {
        this.emit( 'RegistrationComplete' );
        this.store.forEach(
            widget => this.store.changedWidgets.add( widget )
        );
        this.transition( 'rendering' );
    }
}
