export default class OptionsConflictResolverManager {
    constructor() {
        this.resolvers = new Set();
    }

    registry( resolver ) {
        this.resolvers.add( resolver );
        return this;
    }

    resolve( widget, options ) {
        for ( let resolver of this.resolvers.values() ) {
            if ( resolver.predicate( widget, options ) ) {
                resolver.resolve( options );
            }
        }
    }
}
