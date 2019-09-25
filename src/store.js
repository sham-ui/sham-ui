/**
 * @property {Map<String, Component>} byId
 * @property {Array<String>} renderedIds
 */
export default class Store {
    constructor() {
        this.clear();
    }

    /**
     * @param {Component} component
     */
    registry( component ) {
        this.byId.set( component.ID, component );
    }

    /**
     * @param {Component} component
     */
    unregistry( component ) {
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
    }

    /**
     * @param {Function} callback
     * @return {Array.<Component>}
     */
    filter( callback ) {
        return this.toArray().filter( callback );
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
     * @param {Function} callback
     * @return {Array}
     */
    map( callback ) {
        return this.toArray().map( callback );
    }

    /**
     * @return {Array.<Component>}}
     */
    toArray() {
        return Array.from( this.byId.values() );
    }

    clear() {
        this.byId = new Map();
    }
}
