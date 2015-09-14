require.config( {
    paths: {
        "shamUI": "../../../shamUI"
    },
    packages: [
        {
            name: "testApp",
            location: "test-app"
        }
    ]
} );

require( [
    "shamUI", "./bindings"
], function( shamUI, bindings ) {
    var counter = 0,
        Fsm,
        fsmStates,
        start;

    // Расширяем функционал fsm
    Fsm = shamUI.Class( shamUI.fsm.Fsm, {
        constructor: function() {
            Fsm.$super.apply( this, arguments );
        },
        ALL: function() {
            Fsm.$superp.ALL.call( this );
            console.log( "ALL" );
        }
    } );

    fsmStates = shamUI.fsm.states;

    //  Расширияем состояние rendering
    fsmStates.rendering = shamUI.Class( shamUI.fsm.states.rendering, {
        constructor: function() {
            fsmStates.rendering.$super.apply( this, arguments );
        },
        renderWidget: function( widget, deferred ) {
            console.log( "Render: " + widget.ID );
            return fsmStates.rendering.$superp.renderWidget.call( this, widget, deferred );
        }
    } );

    var UI = new shamUI.main( {
        Fsm: Fsm,
        fsmStates: fsmStates
    } );

    UI.setBinding( bindings, {
        number: 42
    } );

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
