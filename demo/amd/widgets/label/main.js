/**
 * Виджет для обычной строки текста
 * @see WidgetLabel
 */
define( [
    "shamUI"
], function( shamUI ) {
    var WidgetLabel = shamUI.Class( shamUI.Widget,
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
                text: function() { return "" },
                actionSequence: [ "render", "bindEvents" ],
                bindOnce: false
            },
            clickHandler: function( event ) {
                if ( this.options.onClick ) {
                    this.options.onClick.apply( this, arguments );
                }
                console.log( event.target.textContent );
            },
            bindEvents: function() {
                this.container.addEventListener( "click", this.clickHandler.bind( this ), false );
            },
            html: function() {
                return this.options.text.call( this );
            },
            destroy: function() {
                this.container.removeEventListener( "click", this.clickHandler );
            }
        }
    );
    return WidgetLabel;
} );
