import DI from '../DI';

/**
 * @property {Map<String, Widget>} byId
 * @property {Map<String, Set<Widget>>} byType
 * @property {Set<Widget>} changedWidgets
 * @property {Array<String>} renderedIds
 */
export default class Store {
    constructor() {
        DI.bind( 'sham-ui:store', this );
        this.clear();
    }

    /**
     * @param {Widget} widget
     */
    registry( widget ) {
        this.byId.set( widget.ID, widget );
        widget.options.types.forEach( type => {
            if ( !this.byType.has( type ) ) {
                this.byType.set( type, new Set() );
            }
            this.byType.get( type ).add( widget );
        } );
    }

    /**
     * @param {Widget} widget
     */
    unregistry( widget ) {
        widget.options.types.forEach( type => {
            if ( this.byType.has( type ) ) {
                this.byType.get( type ).delete( widget );
            }
        } );
        this.byId.delete( widget.ID );
    }

    /**
     * @param {String} widgetId
     * @return {Widget}
     */
    findById( widgetId ) {
        return this.byId.get( widgetId );
    }

    /**
     * @param {Function} callback
     * @return {Widget}
     */
    find( callback ) {
        for ( let widget of this.byId.values() ) {
            if ( callback( widget ) ) {
                return widget;
            }
        }
        return null;
    }

    /**
     * @param {Function} callback
     * @return {Array.<Widget>}
     */
    filter( callback ) {
        return Array.from( this.byId.values() ).filter( callback );
    }

    /**
     * @param {String} type
     * @return {Set.<Widget>}
     */
    filterByType( type ) {
        return this.byType.get( type ) || new Set();
    }

    /**
     * @param {Function} callback
     */
    forEach( callback ) {
        this.byId.forEach( callback );
    }

    /**
     * @param {Array<String>} ids
     * @param {Function} callback
     */
    forEachId( ids, callback ) {
        ids.forEach( id => {
            if ( this.byId.has( id ) ) {
                callback( this.byId.get( id ) );
            }
        } );
    }

    /**
     * @param {Array<String>} types
     * @param {Function} callback
     */
    forEachType( types, callback ) {
        types.forEach( type => {
            if ( this.byType.has( type ) ) {
                this.byType.get( type ).forEach( callback );
            }
        } );
    }

    /**
     * @param {Function} callback
     * @return {Array}
     */
    map( callback ) {
        return Array.from( this.byId.values() ).map( callback );
    }

    clear() {
        this.byId = new Map();
        this.byType = new Map();
        this.changedWidgets = new Set();
        this.renderedIds = [];
    }
}

