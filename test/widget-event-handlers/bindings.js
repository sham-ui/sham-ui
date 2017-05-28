import { Widget, handler, options, DI } from '../../src/shamUI';

class Label extends Widget {
    constructor() {
        super( ...arguments );
        this.labelClicked = false;
    }

    @options
    static actionSequence = [ 'render', 'bindEvents' ];

    @options
    static bindOnce = false;

    @handler( 'click' )
    onClick() {
        this.labelClicked = true;
    }

    html() {
        return this.ID;
    }
}

export default function() {

    class OverrideHandler extends Label {
        constructor() {
            super( ...arguments );
            this.overrideHandlerClicked = false;
        }

        @handler( 'click' )
        onClick() {
            super.onClick( ...arguments );
            this.overrideHandlerClicked = true;
        }
    }

    class HandlerWithOption extends Label {
        constructor() {
            super( ...arguments );
            this.handlerWithOptionClicked = false;
        }

        @handler( 'click' )
        @options
        onClick() {
            super.onClick( ...arguments );
            this.handlerWithOptionClicked = true;
        }
    }

    class SubselectorHandler extends Label {
        constructor() {
            super( ...arguments );
            this.subElementClicked = false;
        }

        @handler( 'click', '.sub-element' )
        onClick() {
            this.subElementClicked = true;
        }

        html() {
            return `<span class="sub-element">${this.ID}</span>`;
        }
    }

    DI.bind(
        'widget-defined-handler',
        new Label( '#widget-defined-handler', 'widget-defined-handler' )
    );

    DI.bind(
        'widget-with-override',
        new OverrideHandler( '#widget-with-override', 'widget-with-override' )
    );

    DI.bind(
        'widget-with-handler-in-option',
        new HandlerWithOption( '#widget-with-handler-in-option', 'widget-with-handler-in-option' )
    );

    const handlerWithOption = new HandlerWithOption(
        '#widget-with-handler-in-option-passed-from-option',
        'widget-with-handler-in-option-passed-from-option',
        {
            onClick() {
                this.handlerWithOptionFromInitializeClicked = true;
            }
        }
    );
    handlerWithOption.handlerWithOptionFromInitializeClicked = false;

    DI.bind(
        'widget-with-handler-in-option-passed-from-option',
        handlerWithOption
    );

    DI.bind(
      'widget-sub-selector',
        new SubselectorHandler( '#widget-sub-selector', 'widget-sub-selector' )
    )
};
