import BaseRegistrationState from './base-registration';

export default class ReadyState extends BaseRegistrationState {

    _onEnter() {
        this.emit( 'Ready' );
    }

    clear() {
        const { store } = this;
        store.forEach( component => component.remove() );
        store.clear();
    }

    all() {
        this.clear();
        this.transition( 'registration' );
    }

    /**
     * @param {Array} needRenderingComponents
     */
    onlyIds( needRenderingComponents ) {
        this.store.forEachId(
            needRenderingComponents,
            this.store.changedComponents.add.bind( this.store.changedComponents )
        );
        this.transition( 'rendering' );
    }
}
