import { Widget } from '../../src/shamUI';

class Label extends Widget {
    html() {
        return this.ID;
    }
}

export default function() {
    new Label( '#label-container', 'widget-text' );
    new Widget( '#non-rendered', 'non-rendered' )
};
