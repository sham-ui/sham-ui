/**
 * Decorator for mark property as default value of options
 * @param target
 * @param name
 * @param descriptor
 * @return {*}
 */
export default function( target, name, descriptor ) {
    target.defaultOptionProps = ( target.defaultOptionProps || [] ).concat( [ name ] );
    return descriptor;
}
