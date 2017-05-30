import { Widget, handler, DI } from '../../src/shamUI';

class Label extends Widget {
    constructor() {
        super( ...arguments );
        this.labelClicked = false;
    }

    @handler( 'click' )
    onClick() {
        this.labelClicked = true;
    }

    html() {
        return this.ID;
    }
}

export default function() {
    DI.bind(
        'widget-action-sequence-and-bind-once',
        new Label( '#widget-action-sequence-and-bind-once', 'widget-action-sequence-and-bind-once' )
    );
};
