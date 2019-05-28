import State from '../../fsm/state';
import { inject } from '../../DI';

export default class BaseRegistrationState extends State {
    /** @type Store */
    @inject( 'sham-ui:store' ) store;

    /**
     * @param {Component} component
     */
    register( component ) {
        const { store } = this;
        if ( store.byId.has( component.ID ) ) {
            return;
        }
        store.registry( component );
    }

    /**
     * @param {String} componentId
     */
    unregister( componentId ) {
        const { store } = this;
        const component = store.findById( componentId );
        if ( undefined !== component ) {
            component.remove();
            store.unregister( component );
        }
    }
}
