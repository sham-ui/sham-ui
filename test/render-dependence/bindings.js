import { Widget } from '../../src/shamUI';


class Label extends Widget {
    html() {
        return this.ID;
    }
}

export default function() {
    new Label(
        "#label-1",
        "label-1",
        {
            renderDependence: [ "label-3", "label-2" ]
        }
    );

    new Label(
        "#label-2",
        "label-2",
        {
            renderDependence: [ "label-3" ],
        }
    );

    new Label(
        "#label-3",
        "label-3"
    );

}