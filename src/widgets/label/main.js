/**
 * Виджет для обычной строки текста
 * @module shamUI/widgets/label
 * @see WidgetLabel
 */
define( [
    "Class",
    "../../widget"
], function( Class, Widget ) {
    var WidgetLabel = Class( Widget,
        /** @lends WidgetLabel.prototype */
        {
            /**
             * @constructs
             * @extends Widget
             * @classdesc Виджет для обычной строки текста
             */
            constructor: function() {
                return WidgetLabel.$super.apply( this, arguments );
            },
            defaultOptions: {
                text: "",
                actionSequence: [ "render", "bindEvents" ],
                bindOnce: false
            },
            clickHandler: function( event ) {
                console.log( event.target.textContent );
            },
            bindEvents: function() {
                this.container.addEventListener( "click", this.clickHandler.bind( this ), false );
            },
            html: function() {
                return this.options.text;
            },
            destroy: function() {
                this.container.removeEventListener( "click", this.clickHandler );
            }
        }
    );
    return WidgetLabel;
} );
