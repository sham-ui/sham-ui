/**
 * @callback storeCallback
 * @param {Component} component
 */

/**
 * Components store
 * @property {Map<string, Component>} byId Inner store
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
     * @param {string} componentId
     * @return {Component}
     */
    findById( componentId ) {
        return this.byId.get( componentId );
    }

    /**
     * @param {storeCallback} callback
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
     * @param {storeCallback} callback
     * @return {Array.<Component>}
     */
    filter( callback ) {
        return this.toArray().filter( callback );
    }

    /**
     * @param {storeCallback} callback
     */
    forEach( callback ) {
        this.byId.forEach( callback );
    }

    /**
     * @param {Array<string>} ids
     * @param {storeCallback} callback
     */
    forEachId( ids, callback ) {
        ids.forEach( id => {
            if ( this.byId.has( id ) ) {
                callback( this.byId.get( id ) );
            }
        } );
    }

    /**
     * @param {storeCallback} callback
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

    /**
     * Clear store
     */
    clear() {
        this.byId = new Map();
    }
}
