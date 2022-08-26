# Runtime lib for sham-ui

[![Build Status](https://travis-ci.com/sham-ui/sham-ui.svg?branch=master)](https://travis-ci.com/sham-ui/sham-ui)

### API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

##### Table of Contents

-   [start](#start)
    -   [Parameters](#parameters)
-   [createDI](#createdi)
-   [DI](#di)
    -   [bind](#bind)
        -   [Parameters](#parameters-1)
    -   [bindLazy](#bindlazy)
        -   [Parameters](#parameters-2)
    -   [resolve](#resolve)
        -   [Parameters](#parameters-3)
-   [Store](#store)
    -   [Properties](#properties)
-   [Dom](#dom)
    -   [build](#build)
        -   [Parameters](#parameters-4)
    -   [el](#el)
        -   [Parameters](#parameters-5)
    -   [text](#text)
        -   [Parameters](#parameters-6)
    -   [comment](#comment)
        -   [Parameters](#parameters-7)
    -   [unsafe](#unsafe)
        -   [Parameters](#parameters-8)
-   [Hooks](#hooks)
    -   [create](#create)
        -   [Parameters](#parameters-9)
    -   [hydrate](#hydrate)
        -   [Parameters](#parameters-10)
    -   [rehydrate](#rehydrate)
        -   [Parameters](#parameters-11)
    -   [resolveID](#resolveid)
        -   [Parameters](#parameters-12)
-   [optionsCallback](#optionscallback)
    -   [Parameters](#parameters-13)
-   [didMountCallback](#didmountcallback)
    -   [Parameters](#parameters-14)
-   [onRemoveCallback](#onremovecallback)
    -   [Parameters](#parameters-15)
-   [didReceiveCallback](#didreceivecallback)
    -   [Parameters](#parameters-16)
-   [componentConstructor](#componentconstructor)
    -   [Parameters](#parameters-17)
-   [ComponentFactory](#componentfactory)
    -   [Parameters](#parameters-18)
-   [Component](#component)
    -   [Parameters](#parameters-19)
    -   [Properties](#properties-1)
    -   [spots](#spots)
    -   [nested](#nested)
    -   [nodes](#nodes)
    -   [onMount](#onmount)
    -   [onRemove](#onremove)
    -   [onReceive](#onreceive)
-   [setDefaultOptions](#setdefaultoptions)
    -   [Parameters](#parameters-20)
-   [insert](#insert)
    -   [Parameters](#parameters-21)
-   [cond](#cond)
    -   [Parameters](#parameters-22)
-   [loop](#loop)
    -   [Parameters](#parameters-23)
-   [createRootContext](#createrootcontext)
    -   [Parameters](#parameters-24)
-   [createChildContext](#createchildcontext)
    -   [Parameters](#parameters-25)
-   [createLoopContext](#createloopcontext)
    -   [Parameters](#parameters-26)
-   [createBlockContext](#createblockcontext)
    -   [Parameters](#parameters-27)

#### start

Render root components

##### Parameters

-   `DI` **[DI](#di)** 

#### createDI

Create new instance of DI

Returns **[DI](#di)** 

#### DI

##### bind

Bind item by name

###### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `item` **any** 

Returns **[DI](#di)** 

##### bindLazy

Lazy bind item factory by name

###### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `factory` **any** 

Returns **[DI](#di)** 

##### resolve

Get item from container by name

###### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **any** 

#### Store

Components store

##### Properties

-   `byId` **[Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), [Component](#component)>** Inner store

#### Dom

Inner service for wrap document's methods (create elements, text nodes & comments)

##### build

Construct dom enabled

###### Parameters

-   `component` **[Component](#component)** 

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

##### el

Create element

###### Parameters

-   `component` **[Component](#component)** 
-   `tagName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element)** 

##### text

Create a text node

###### Parameters

-   `component` **[Component](#component)** 
-   `data` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Text](https://developer.mozilla.org/docs/Web/HTML)** 

##### comment

Create comment node

###### Parameters

-   `component` **[Component](#component)** 
-   `data` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[Comment](https://developer.mozilla.org/docs/Web/API/Comment/Comment)** 

##### unsafe

This function is being used for unsafe `innerHTML` insertion of HTML into DOM.
Code looks strange. I know. But it is possible minimalistic implementation of.

###### Parameters

-   `component` **[Comment](https://developer.mozilla.org/docs/Web/API/Comment/Comment)** 
-   `root`  {Element} Node there to insert unsafe html.
-   `nodes`  {Array} List of already inserted html nodes for remove.
-   `html`  {string} Unsafe html to insert.

#### Hooks

Inner service for hydrate/rehydrate hooks

##### create

Hook for extra processing after component created

###### Parameters

-   `component` **[Component](#component)** 

##### hydrate

Hook for mark root component as ready for hydrating

###### Parameters

-   `component` **[Component](#component)** 

##### rehydrate

Hook for mark rehydrating component

###### Parameters

-   `component` **[Component](#component)** 

##### resolveID

Hook for resolve ID for component

###### Parameters

-   `component` **[Component](#component)** 

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

#### optionsCallback

Setup default component state
Return reference to component state

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

##### Parameters

-   `defaultState` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), any>** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String), any>** 

#### didMountCallback

Registry function on component didMount hook.
Param callback will call after component render & update

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

##### Parameters

-   `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

Returns **([onRemoveCallback](#onremovecallback) \| [undefined](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined))** 

#### onRemoveCallback

Registry function on component onRemove hook
Param callback will call after component remove

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

##### Parameters

-   `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

#### didReceiveCallback

Registry function on component didReceive hook.
Param callback will call after component receive new state update from outer components

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

##### Parameters

-   `callback` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

#### componentConstructor

Constructor function for component

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

##### Parameters

-   `options` **[optionsCallback](#optionscallback)** 
-   `didMount` **[didMountCallback](#didmountcallback)** 
-   `didReceive` **[didReceiveCallback](#didreceivecallback)** 

#### ComponentFactory

Factory for create new component

##### Parameters

-   `constructors` **...[componentConstructor](#componentconstructor)?** 

Returns **Component.constructor** 

#### Component

Base component class

##### Parameters

-   `context` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Context
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Default options

##### Properties

-   `ctx` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Context
-   `ID` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Component unique ID
-   `dom` **[Dom](#dom)** 
-   `UI` **[Store](#store)** 
-   `hooks` **[Hooks](#hooks)** 

##### spots

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Spot>

##### nested

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Component](#component)>

##### nodes

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Element](https://developer.mozilla.org/docs/Web/API/Element)>

##### onMount

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)>

##### onRemove

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)>

##### onReceive

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)>

#### setDefaultOptions

##### Parameters

-   `current` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `newOptions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `proxy` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

#### insert

Custom tags processor.

##### Parameters

-   `context` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Context
-   `template` **Class&lt;[Component](#component)>** Component class for insert, if test true
-   `data` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options for component

#### cond

If condition processor.

##### Parameters

-   `context` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Context
-   `template` **Class&lt;[Component](#component)>** Component class for insert, if test true
-   `test` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Condition test

Returns **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** test result

#### loop

Loops processor

##### Parameters

-   `context` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Context
-   `template` **Class&lt;[Component](#component)>** Component class for insert, if test true
-   `array` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** Iterated object or array
-   `options` **(LoopOptions | null)** Options for component

#### createRootContext

##### Parameters

-   `$0` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `$0.DI` **[DI](#di)** 
    -   `$0.ID` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
    -   `$0.container` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** 
    -   `$0.directives` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)
    -   `$0.filters` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `[]`)

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

#### createChildContext

##### Parameters

-   `parent` **[Component](#component)** 
-   `container` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** 
-   `blocks` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

#### createLoopContext

##### Parameters

-   `parent` **[Component](#component)** 
-   `container` **[Element](https://developer.mozilla.org/docs/Web/API/Element)** 

Returns **any** 

#### createBlockContext

##### Parameters

-   `owner` **[Component](#component)** 

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### License

The MIT License (MIT)

Copyright (c) 2015  Eugene Burnashov <mailto:shamcode@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
