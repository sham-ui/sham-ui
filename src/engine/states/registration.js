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
        this.handle( 'registrationComplete' );
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
        if ( this.store.changedWidgets.size > 0 ) {
            this.transition( 'rendering' );
        }
    }
}
