import DI from '../DI';

/**
 * @property {Map<String, Component>} byId
 * @property {Map<String, Set<Component>>} byType
 * @property {Set<Component>} changedComponents
 * @property {Array<String>} renderedIds
 */
export default class Store {
    constructor() {
        DI.bind( 'sham-ui:store', this );
        this.clear();
    }

    /**
     * @param {Component} component
     */
    registry( component ) {
        this.byId.set( component.ID, component );
        component.options.types.forEach( type => {
            if ( !this.byType.has( type ) ) {
                this.byType.set( type, new Set() );
            }
            this.byType.get( type ).add( component );
        } );
    }

    /**
     * @param {Component} component
     */
    unregister( component ) {
        this.byType.forEach( components => {
            components.delete( component );
        } );
        this.byId.delete( component.ID );
    }

    /**
     * @param {String} componentId
     * @return {Component}
     */
    findById( componentId ) {
        return this.byId.get( componentId );
    }

    /**
     * @param {Function} callback
     * @return {Component}
     */
    find( callback ) {
        for ( let component of this.byId.values() ) {
            if ( callback( component ) ) {
                return component;
            }
        }
        return null;
    }

    /**
     * @param {Function} callback
     * @return {Array.<Component>}
     */
    filter( callback ) {
        return Array.from( this.byId.values() ).filter( callback );
    }

    /**
     * @param {String} type
     * @return {Array.<Component>}
     */
    filterByType( type ) {
        if ( this.byType.has( type ) ) {
            return Array.from( this.byType.get( type ) );
        }
        return [];
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
        this.changedComponents = new Set();
        this.renderedIds = [];
    }
}

