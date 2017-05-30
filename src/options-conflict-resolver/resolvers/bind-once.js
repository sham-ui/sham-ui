import OptionsConflictResolver from '../base';

export default class BindOnceAndHandlerResolver extends OptionsConflictResolver {
    predicate( widget, options ) {
        return widget.handlerProps &&
        'render' === options.actionSequence[ 0 ] &&
        ( undefined !== widget.html || undefined !== widget.constructor.html ) &&
        options.bindOnce
    }

    resolve( options ) {
        options.bindOnce = false;
    }
}