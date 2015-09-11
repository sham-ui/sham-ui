/**
 * Обертка для биндинга
 */
define( function() {
    /**
     * Создать обертку для биндинга
     * @exports shamUI/binding
     * @param {Function} bindingFn  Функция создающая виджеты
     * @param {Object}   shamUI     Инстанс shamUI
     * @returns {Function} Обернутый binding
     */
    function bindingWrapper( bindingFn, shamUI ) {

        // Пропускаем bindingFn, остальное собираем в массив
        var args = Array.prototype.slice.call( arguments, 1 );
        return function() {
            bindingFn.apply( this, args );

            // После вызова bindingFn, считаем что регистрация виджетов закончена
            shamUI.render.handle( "registrationComplete" );
        };
    }
    return bindingWrapper;
} );
