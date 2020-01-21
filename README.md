# &#8762; Hingejs - WebComponents

A Suite of Web Components to be used in the UI

These are built under the custom elements spec.  These tags can be dropped into any front end application that supports them, which is all modern browsers.  A polyfill can be added for older browsers.  

You can use this package in addition to your own.

> This is a work in progress until a 1.0.0 release.

## Goals

- [x] Use native JS for little to no dependency
- [x] Cross browser support
- [x] Flexible for CSS
- [x] Unit tested


## Element checklist
This checklist can be used as a guide for adding elements that are easy to reuse and maintain.


**Category**
* [ ] Input Controls: buttons, text fields, toggles
* [ ] Navigational: breadcrumb, search field, pagination
* [ ] Informational: tooltips, notifications, modal windows
* [ ] Containers: accordion, tabs

**Design**
* [ ] Be clear what problem the element solves and when to use it
* [ ] Has unit tests
* [ ] Provides a default
* [ ] Only affects itself
* [ ] Defines itself and its styles only in one place
* [ ] Should not become complex
* [ ] Does not rely on a parent element
* [ ] Uses custom events to notify outside of itself 
* [ ] Works in supported browsers and devices
* [ ] Is [accessible](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript) for all users
* [ ] Provides necessary [WAI-ARIA](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics) information
* [ ] Will not cause issues with translation or [internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

## Live demos

- https://hingejs.github.io/webcomponents/

## Wiki

- https://github.com/hingejs/generator/wiki#learn-to-build-custom-elements

#### Related packages

- https://www.npmjs.com/package/@hingejs/generator
- https://www.npmjs.com/package/@hingejs/services

## Install

```sh
$ npm install @hingejs/webcomponents --save
```

## CDN

https://cdn.jsdelivr.net/npm/@hingejs/webcomponents/index.min.js

or by version

https://cdn.jsdelivr.net/npm/@hingejs/webcomponents@0.0.3/index.min.js


https://cdn.jsdelivr.net/npm/@hingejs/webcomponents@latest/index.min.js


```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@hingejs/webcomponents/index.min.js"></script>
```

### Individual elements

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@hingejs/webcomponents@latest/src/accordion-slider/index.js"></script>
```

## Webpack

All elements

```js
import '@hingejs/webcomponents'
```

### Individual elements

```js
import '@hingejs/webcomponents/src/accordion-slider/index.js'
import '@hingejs/webcomponents/src/characters-remaining/index.js'
import '@hingejs/webcomponents/src/content-loader/index.js'
import '@hingejs/webcomponents/src/content-loader/index.js'
import '@hingejs/webcomponents/src/json-syntax/index.js'
import '@hingejs/webcomponents/src/route/index.js'
import '@hingejs/webcomponents/src/side-notification/index.js'
import '@hingejs/webcomponents/src/table-sort/index.js'
import '@hingejs/webcomponents/src/tool-tip/index.js'
import '@hingejs/webcomponents/src/touch-swipe/index.js'
```


## CSS Variables to style components using shadow-dom

```css
--primary: #4d68cb;
--on-primary: #fff;
--primary-variant: #0026ad;
--secondary: #506be5;
--on-secondary: #fff;
--success: #5ba014;
--error: #d05050;
--header: #f5f5f5;
--on-header: #494949;
--nav: #fff;
--on-nav: #000;
--background: #fff;
--on-background: #4d68cb;
--surface: #fff;
--on-surface: #212121;
  ```
