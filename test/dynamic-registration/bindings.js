import { Widget } from '../../src/shamUI';


class Label extends Widget {
    html() {
        return this.ID;
    }
}

export default function() {

    new Label( "#label-1", "label-1" );

    setTimeout( () => {
        new Label( "#label-2", "label-2", {
            afterRegister() {
                this.UI.render.ONLY( this.ID );
            }
        } );
    }, 500 );
}