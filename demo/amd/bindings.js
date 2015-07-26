define( [
    "shamUI"
], function(
        shamUI
    ) {
    return function( UI, options ) {
        console.log( options.number );
        for ( var i = 0; i <= 20; i++ ) {
            new shamUI.Library.Label(
                UI,
                "#label-" + i,
                "label-" + i,
                {
                    text: "Just text " + i,
                    beforeRegister: function() {

                        //console.log( "Before Register" + this.ID );
                    },
                    afterRegister: function() {

                        //console.log( "After Register" + this.ID );
                    },
                    beforeRender: function() {

                        //console.log( "Before Render" + this.ID );
                    },
                    afterRender: function() {

                        //console.log( "After Render " + this.ID );
                    }
                }
            );
        }
    };
 } );
