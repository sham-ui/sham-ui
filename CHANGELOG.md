## master
* Rename Map To LoopItems & move to context
* Update browserslist
* Move some blueprint codes from `for` compiler to runtime
* Changes hooks:
  `function FooComponent( options, didMount, didRecieve )`
  `didMount` can return function for `onRemove`
  `didRecieve` should call after new option set from outer component
  `options` return function with state. Now state will autocall update:
  ```
  const state = options( { foo: 42, bar: 56 } );
  state.foo = 31; // call update inner
  state( { foo: 78, bar: 93 } ) // call update once for multiple values
  ```
* Add new base entity - `context` for decrease compiled templates size & more robust api for directives & filters

## 5.0.0
* Release

## 5.0.0-alpha.8
* Fix `_dataForBlock` for first render (before set `this.__data__`)

## 5.0.0-alpha.7
* Add extra data to `_dataForBlock`

## 5.0.0-alpha.6
* Call `hydrate` hook only for root components

## 5.0.0-alpha.5
* Fix work with _options
* Add `create` hook

## 5.0.0-alpha.4
* Migrate from webpack to rollup
* Extract config from package.json
* Update travis CI node.js version to 14
* Update documentation

## 5.0.0-alpha.3
* Remove `@options`, `configureOptions`
* Now `Component` is a factory

## 5.0.0-alpha.2
* Throw error for default `Dom.unsafe`

## 5.0.0-alpha.1
* Fix a API docs in `README.md`

## 5.0.0-alpha.0
* Remove methods from store (unused in real cases)
* Add `Dom` service for wrap creating DOM nodes
* Remove exception from loop processor (unused in real cases)
* Move services to `services`
* Remove patching `window`
* Add `Hooks` service
* Change internal spots format
* Move `resolveID` to `Hooks` service
* Some refactoring & reduce size

## 4.1.0
* Set default empty directives & filters in component for simple add directives on component level
* Add inner `dataForBlock` helper for render blocks
* Set inner properties `__cache__` && `__data__` in constructore
* Move `updateSpots` logic from template compiler to runtime 

## 4.0.1
* Update `size-limit`
* Fix `null` options with `configureOptions` helper

## 4.0.0
* Add `size-limit`
* Add `browserlist`
* Add `configureOptions` helper
* Remove `containerSelector` 
* Remove component `type` options
* Remove `querySelector`
* Remove auto start render (optional)
* Remove `component-binder`
* Remove FSM
* Remove logger
* Remove `inject` decorator
* Injection `sham-ui:store` to `sham-ui` as `store`
* Remove `ONLY_IDS` & `ALL`
* Remove `needUpdateAfterRender`
* Remove `update` from `render`
* Rename `bindEvents` to `didMount`
* Call `didMount` after component rendered & updated
* Add `doc:generate` script & add docs to `README.md`
* Block mapping options

## 3.3.0
* Fix `needUpdateAfterRender`

## 3.2.0
* [#42](https://github.com/sham-ui/sham-ui/issues/16) fix `needUpdateAfterRender`

## 3.1.3
* Update dependencies

## 3.1.2
* Add `.travis.yml` to `.npmignore` 

## 3.1.1
* Update dependencies

## 3.1.0
* Move common parts for `update` from `sham-ui-templates` to `sham-ui` 

## 3.0.0
* Rename widget to component
* Remove extra component update in processors

## 2.0.5
* Simplify fsm 
* Optimize defer rendering

## 2.0.4
* Fix override options in `sham-ui-templates`

## 2.0.3
* Update `.npmignore`

## 2.0.2
* Update `.npmignore`

## 2.0.1
* Update `.npmignore`

## 2.0.0
* Remove `context` from processors & widget constructor 
* [#28](https://github.com/sham-ui/sham-ui/issues/28) Remove before & after hooks
* Rename `destroy` to `remove`
* Generate ID by default (if not passed from options) 
* Change widget constructor signature (move ID & containerSelector to options)
* [#16](https://github.com/sham-ui/sham-ui/issues/16) Support `options.container`
* [#26](https://github.com/sham-ui/sham-ui/issues/26) Upgrade webpack & babel
* [#24](https://github.com/sham-ui/sham-ui/issues/25) Widget storage
* [#23](https://github.com/sham-ui/sham-ui/issues/23) Auto start render (optional)
* Change render API: 
    1) rename `FORCE_ALL` to `ALL`
    2) rename `ONLY` to `ONLY_IDS`
    3) rename `ONLY_TYPE` to `ONLY_TYPES`
    4) remove `ALL` & `FORCE_ONLY`
* Bind widget context to options getters & methods
* Override options descriptor with initializer
* [#22](https://github.com/sham-ui/sham-ui/issues/22) Prototype based options 
* [#21](https://github.com/sham-ui/sham-ui/issues/21) Remove `actionSequence` 
* Remove `renderDependencies`
* Remove `fsm.renderCache` & `widget.options.cacheParentContainer` 
* Remove `bindOnce`, `renderAsync` & `renderAsyncWrapper`
* [#18](https://github.com/sham-ui/sham-ui/issues/18) remove `@handler`
* [#20](https://github.com/sham-ui/sham-ui/issues/20) inject as getter
* Remove options conflict resolver

## 1.3.4
* `Widget.querySelector`

## 1.3.3
* Move merge options to `Widget.configureOptions`

## 1.3.2
* Change repository URL

## 1.3.1
* Fix missing call `bindEvents` after empty `render`
