import OptionsConflictResolver from '../base';

export default class ActionSequenceAndHandlerResolver extends OptionsConflictResolver {
    predicate( widget, options ) {
        return widget.handlerProps &&
            'bindEvents' === options.actionSequence[ 0 ] &&
            ( undefined !== widget.html || undefined !== widget.constructor.html )
    }

    resolve( options ) {
        options.actionSequence = [ 'render', 'bindEvents' ];
    }
}