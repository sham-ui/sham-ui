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
                afterRender: function() {
                    console.log( this.ID1.a );
                }
            }
        );
    };
 } );
