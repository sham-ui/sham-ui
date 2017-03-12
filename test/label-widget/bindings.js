import { Widget } from '../../src/shamUI';

class Label extends Widget {
    html() {
        return this.ID;
    }
}

export default function() {
    new Label( '#label-container', 'simple-label-widget-text' );
};
