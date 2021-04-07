/**
 * Components store
 * @property {Map<string, Component>} byId Inner store
 */
export default class Store {
    constructor() {
        this.byId = new Map();
    }
}
