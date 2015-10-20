define( [
    "shamUI",
    "../widgets/label/main"
], function(
        shamUI,
        WidgetLabel
    ) {
    return function() {
        var ExtendLabel1,
            ExtendLabel2,
            ExtendLabel3;

        ExtendLabel1 = shamUI.Class( WidgetLabel,
            {
                constructor: function() {
                    return ExtendLabel1.$super.apply( this, arguments );
                },
                defaultOptions: {
                    text: function() { return "Extend label 1" }
                }
            }
        );

        ExtendLabel2 = shamUI.Class( ExtendLabel1,
            {
                constructor: function() {
                    return ExtendLabel2.$super.apply( this, arguments );
                },
                defaultOptions: {
                    text: function() { return "Extend label " + this.ID }
                }
            }
        );

        ExtendLabel3 = shamUI.Class( ExtendLabel2,
            {
                constructor: function() {
                    return ExtendLabel2.$super.apply( this, arguments );
                }
            }
        );

        new WidgetLabel( "#label-0", "label-0", {
            text: function() { return "Extend label 0" }
        } );

        new ExtendLabel1( "#label-1", "label-1" );

        new ExtendLabel2( "#label-2", "label-2" );

        new ExtendLabel3( "#label-3", "label-3" );
    };
 } );
