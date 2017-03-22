import { State } from '../../utils/fsm';

/**
 * @classdesc Deferred на нативных Promise
 * todo: move to utils?
 * @returns {*}
 * @constructor
 * @class Deferred
 */
function Deferred() {
    this.promise = new Promise( function( resolve, reject ) {
        this.resolve = resolve;
        this.reject = reject;
    }.bind( this ) );
    return this;
}

/**
 * Класс для состояния "Отрисовываем виджеты"
 */
export default class RenderingState extends State {
    /**
     * Что делать с необрабатываемыми в этом состояния хэндлеры
     */
    _anyEvents() {
        this.deferUntilTransition();
    }

    /**
     * Вызывается при входе в это состояние
     */
    _onEnter() {
        let self = this,
            promises = [],
            promiseById = {},
            widgetDependencePromise;

        this.cmpWidget = function( a, b ) {
            const indexA = self._fsm.idArray.indexOf( a ),
                indexB = self._fsm.idArray.indexOf( b );
            if ( indexA > indexB ) {
                return 1;
            } else if ( indexA < indexB ) {
                return -1;
            } else {
                return 0;
            }
        };

        // Сортируем по renderDependence
        this._fsm.changeWidgets.sort( function( a, b ) {
            const widgetARD = self._fsm.byId[ a ].options.renderDependence,
                widgetBRD = self._fsm.byId[ b ].options.renderDependence;
            if ( !widgetARD || !widgetARD.length ) {
                if ( !widgetBRD || !widgetBRD.length ) {

                    // У обоих виджетов нет зависимостей
                    return self.cmpWidget( a, b );
                } else {

                    // Зависит ли виджет B от виджета A
                    return widgetBRD.indexOf( a ) !== -1 ? -1 : self.cmpWidget( a, b );
                }
            } else {
                if ( !widgetBRD || !widgetBRD.length ) {

                    // Зависит ли виджет A от виджета B
                    return widgetARD.indexOf( b ) !== -1 ? 1 : self.cmpWidget( a, b );
                } else {

                    // У обоих виджетов есть зависимости
                    if ( widgetARD.indexOf( b ) !== -1 ) {

                        // Виджет A зависит от виджета B
                        return 1;
                    } else if ( widgetBRD.indexOf( a ) !== -1 ) {

                        // Виджет B зависит от виджета A
                        return -1;
                    } else {

                        // Виджеты не зависят друг от друга
                        return self.cmpWidget( a, b );
                    }
                }
            }
        } );

        this.rendered = [];

        for ( let i = 0; i < this._fsm.changeWidgets.length; i++ ) {
            let current = this._fsm.byId[ this._fsm.changeWidgets[ i ] ];
            if ( current && current.render ) {
                if ( !current.options.conditionRender ||
                    current.options.conditionRender() ) {
                    const deferred = new Deferred();
                    promises.push( deferred.promise );
                    promiseById[ this._fsm.changeWidgets[ i ] ] = deferred.promise;

                    if ( current.options.renderDependence &&
                        current.options.renderDependence.length ) {
                        widgetDependencePromise = new Array(
                            current.options.renderDependence.length
                        );
                        for ( let j = 0; j < current.options.renderDependence.length; j++ ) {
                            widgetDependencePromise[ j ] = promiseById[
                                current.options.renderDependence[ j ]
                                ];
                        }
                    } else {
                        widgetDependencePromise = [];
                    }

                    ( function( widget, widgetDependencePromise, deferred ) {

                        // Отрисовываем этот виджет только после того, как
                        // все зависимости отрисовались
                        Promise.all( widgetDependencePromise )
                            .then( function() {
                                if ( widget.options.renderAsync ) {
                                    widget.options.renderAsyncWrapper(
                                        function() {
                                            self.handle( "renderWidget", widget, deferred );
                                        }
                                    );
                                } else {
                                    self.handle( "renderWidget", widget, deferred );
                                }
                            }, self.handleException.bind( self ) );
                    } )( current, widgetDependencePromise, deferred );
                }
            }
        }

        Promise.all( promises ).then( function() {
            // Все области отрисовались
            promiseById = null;

            // Так же обрабатываем по отдельности
            for ( let i = 0; i < self.rendered.length; i++ ) {
                self.emit( [
                               "RenderComplete[", self.rendered[ i ], "]"
                           ].join( "" ) );
            }

            // И все сразу
            self.emit( "RenderComplete", self.rendered );
            self.transition( "ready" );
        }, this.handleException.bind( this ) );
    }

    /**
     * Вызывается при выходе из этого состояни
     */
    _onExit() {
        this.rendered = [];
        this._fsm.changeWidgets = [];
    }

    /**
     * Отрисовать один виджет
     * @param {Object} widget   Виджет
     * @param {Object} deferred Отложенный объект для этого виджета
     * @see Widget
     */
    renderWidget( widget, deferred ) {
        if ( widget.options.actionSequence[ 0 ] === "render" ) {
            widget.queryContainer();
        }

        if ( widget.options.beforeRender ) {
            widget.options.beforeRender.call( widget );
        }
        this.rendered.push( widget.ID );

        new Promise( ( resolve ) => {
            const obj = widget.render();
            if ( !obj ) {
                resolve();
                return;
            }
            if ( !obj.html ) {
                resolve()
            }
            const newEl = obj.container.cloneNode( false );
            newEl.innerHTML = obj.html;
            obj.container.parentNode.replaceChild( newEl, obj.container );
            widget.container = newEl;
            resolve();
        } ).then( () => {
            if ( widget.options.afterRender ) {
                widget.options.afterRender.call( widget );
            }
            if ( widget.options.actionSequence[ 0 ] === "render" &&
                widget.bindEvents && !widget.isBinded ) {

                // Если после отрисовки нужно биндить обработчики событий виджета или нет
                if ( widget.options.beforeBindEvents ) {
                    widget.options.beforeBindEvents.call( widget );
                }
                widget.bindEvents();
                if ( widget.options.afterBindEvents ) {
                    widget.options.afterBindEvents.call( widget );
                }
                if ( widget.options.bindOnce ) {
                    widget.isBinded = true;
                }
            }
            deferred.resolve();
        } ).catch( this.handleException.bind( this ) );
    }
}