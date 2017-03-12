import { Widget } from '../../src/shamUI';
import { options } from '../../src/shamUI';

class Label extends Widget {
    @options
    text() {
        return this.ID;
    }

    html() {
        return this.options.text.call( this );
    }
}

export default function() {

    class OverrideDefaultOptions extends Label {
        @options
        static text() {
            return 'override';
        }
    }

    class ExtendWithoutOverride extends Label {

    }

    new OverrideDefaultOptions( '#label-1', 'label-with-override-default-options' );

    new OverrideDefaultOptions( '#label-2', 'label-pass-options-as-params', {
        text() {
            return 'override-from-constructor-args';
        }
    } );

    new ExtendWithoutOverride( '#label-3', 'extend-without-override' );
};
