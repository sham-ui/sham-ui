require.config( {
    paths: {
        "shamUI": "../../../dist/shamUI"
    }
} );

require( [
    "shamUI", "./bindings"
], function( shamUI, bindings ) {
    var counter = 0,
        start,
        UI;

    UI = new shamUI.main();
    UI.setBinding( bindings );

    start = Date.now();
    UI.render.on( "RenderComplete", function() {
        if ( ++counter < 200 ) {
            UI.render.ALL();
        } else {
            console.log( "ALL RENDER COMPLETE " + ( Date.now() - start ) );
            UI.render.off( "RenderComplete" );
        }
    } );
    UI.render.FORCE_ALL();
} );
