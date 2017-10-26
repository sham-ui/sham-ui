import { inject } from '../../DI';
import BaseRegistrationState from './base-registration';

/**
 * Класс для состояния "Регистрация виджетов"
 */
export default class RegistrationState extends BaseRegistrationState {
    @inject widgetBinder = 'widget-binder';

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
        this.handle( "registrationComplete" )
    }

    /**
     * Все виджеты зарегисрированы
     * Если нужно, то сначала биндим обработчики событий, а потом отрисовываем
     */
    registrationComplete() {
        this.emit( "RegistrationComplete" );
        this._fsm.changeWidgets = this._fsm.idArray.slice( 0 );
        this.transition( "rendering" );
    }
}
