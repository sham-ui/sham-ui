/**
 * @inner
 * @return {{DI: *, directives: *, filters: *, appendDirectives: appendDirectives, appendFilters: appendFilters}}
 */
export function extend( extra ) {
    return Object.assign( {
        DI: this.DI,
        directives: this.directives,
        filters: this.filters,
        blocks: this.blocks || [],
        appendDirectives( newDirectives ) {
            this.directives = Object.assign( {}, this.directives, newDirectives );
        },
        appendFilters( newFilters ) {
            this.filters = Object.assign( {}, this.filters, newFilters );
        },
        onUpdate( data ) {
            if ( this.ref ) {
                this.ref.updateState( data );
            }
        },
        extend,
        ref: null
    }, extra );
}
