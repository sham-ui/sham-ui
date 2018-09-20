## master
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