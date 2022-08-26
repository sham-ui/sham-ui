/**
 * Wrap service methods for pass component as first argument
 * @param {string} serviceName
 * @param {string[]}methods
 * @param {Component} component
 * @inner
 */
export default function createProxy( serviceName, methods, component ) {
    const proxy = {};
    methods.forEach(
        name => proxy[ name ] = function() {
            const service = component.ctx.DI.resolve( serviceName );
            return service[ name ].apply(
                service,

                // Pass component to service method as first argument
                [].concat( component, Array.from( arguments ) )
            );
        }
    );
    return proxy;
}
