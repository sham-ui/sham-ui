/**
 * Decorator for auto bind & unbind events
 * @param {String} eventType Type of bind event
 * @param {=String} selector Optional selector for sub-element. Default bind on widget container
 * @return {*}
 */
export default function( eventType, selector ) {
    return function( target, name, descriptor ) {
        target.handlerProps = ( target.handlerProps || [] ).concat( [ {
            selector,
            eventType,
            handlerName: name
        } ] );
        return descriptor;
    };
}
