define( [
    "shamUI",
    "../widgets/label/main"
], function(
        shamUI,
        WidgetLabel
    ) {
    return function() {
        var counter = 0;

        new WidgetLabel(
            "#label-0",
            "label-0",
            {
                text: function() {
                    return this.ID + " " + counter++;
                },
                renderDependence: [ "label-2", "label-1" ]
            }
        );

        new WidgetLabel(
            "#label-1",
            "label-1",
            {
                text: function() {
                    return this.ID + " " + counter++;
                },
                renderDependence: [ "label-2" ],
                renderAsync: true
            }
        );

        new WidgetLabel(
            "#label-2",
            "label-2",
            {
                text: function() {
                    return this.ID + " " + counter++;
                }
            }
        );
    };
 } );
