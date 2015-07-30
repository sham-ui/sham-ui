/**
 * Пакетная отрисовка виджетов.
 * Объединяет несколько виджетов в один пакет и отрисовывает его с помощью requestAnimationFrame
 * @module shamUI/packageRender
 * @see PackageRender
 */
define( [
    "Class"
], function( Class ) {
    var PackageRender = Class(
        /** @lends PackageRender.prototype */
        {
            /**
             * @constructs
             * @classdesc Пакетная отрисовка виджетов
             */
            constructor: function() {},

            $singleton: true,

            /**
             * Отложенные до следующей отрисовки виджеты
             * @member {Array}
             */
            deferred: new Array( 10 ),

            /**
             * Сколько отложенно
             * @member {Number}
             */
            deferredCount: 0,

            /**
             * Добавить функцию отрисовки
             * @param {Function} callback
             */
            add: function( callback ) {
                this.deferred[ this.deferredCount ] = callback;
                this.deferredCount += 1;
                if ( this.deferredCount === 1 ) {
                    window.requestAnimationFrame( this.renderBlock.bind( this ) );
                }
            },

            /**
             * Отрисовать блок виджетов в одном фрейме
             */
            renderBlock: function() {
                console.log( "Count:" + this.deferredCount );
                var i;
                for ( i = 0; i < this.deferredCount; i++ ) {
                    this.deferred[ i ]();
                    this.deferred[ i ] = null;
                }
                this.deferredCount = 0;
            }
        }
    );

    /**
     * Пакетная отрисовка виджетов
     * @see PackageRender
     */
    return PackageRender;
} );
