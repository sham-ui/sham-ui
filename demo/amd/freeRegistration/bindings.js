define( [
    "shamUI",
    "../widgets/label/main"
], function(
        shamUI,
        WidgetLabel
    ) {
    return function( UI ) {
        var counter = 0;

        new WidgetLabel(
            "#label-0",
            "label-0",
            {
                text: function() {
                    return this.ID + " " + counter++;
                },
                onClick: function() {
                    new WidgetLabel(
                        "#label-1",
                        "label-1",
                        {
                            text: function() {
                                return this.ID + " " + counter++;
                            },
                            afterRegister: function () {
                                UI.render.ONLY( "label-1" );
                            }
                        }
                    );
                }
            }
        );
    };
 } );
