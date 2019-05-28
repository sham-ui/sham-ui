import { inject } from '../../DI';
import BaseRegistrationState from './base-registration';


export default class RegistrationState extends BaseRegistrationState {
    @inject( 'component-binder' ) componentBinder;

    _anyEvents() {
        this.deferUntilTransition();
    }

    _onEnter() {
        this.componentBinder();
        this.registrationComplete();
    }

    /**
     * @param {Array.<String>} needRenderingComponents
     */
    onlyIds( needRenderingComponents ) {
        this.store.forEachId(
            needRenderingComponents,
            component => this.store.changedComponents.add( component )
        );
    }

    /**
     * @param {String[]} needRenderingComponentsWithType
     */
    onlyTypes( needRenderingComponentsWithType ) {
        this.store.forEachType(
            needRenderingComponentsWithType,
            component => this.store.changedComponents.add( component )
        );
    }

    registrationComplete() {
        this.emit( 'RegistrationComplete' );
        this.store.forEach(
            component => this.store.changedComponents.add( component )
        );
        this.transition( 'rendering' );
    }
}
