import { Widget, inject } from '../../src/shamUI';

class Label extends Widget {
    @inject logger = 'logger';

    html() {
        this.logger.log( 'Logged message' );
        return this.ID;
    }
}

export default function() {
    new Label( '#label-container', 'simple-label-widget-text' );
};
