Routing is based on history API and does not use a hash fallback. Params and optional params are supported as well.

## Router Service

It depends on the use of History API (`window.history.pushState`).  This `Router` class service is a `singleton` and will always reference the same instance.

This service looks for either a `url-change` or a `popstate` event dispatched by the window.  The `url-change` is a custom event.    Add a `Router.defaultPath(path, ...callbacks)` and set other paths as needed with `Router.setPath(path, ...callbacks)`.

The Router service is not dependent on the components `<h-route-link>` or `<h-route-display>` but they compliment the Router service.

**Samples**
```js
import { Router } from '@hingejs/services'
import HTML from 'features/todo/home.html'

const RouteCtrl = async (req, next) => {
  const $routeDisplay = document.querySelector('h-route-display')
  await $routeDisplay.insertContent(HTML)
  req.exit(async () => {
    // remove if not needed
  })
  next()
}

Router
  .setPath('todo/home', RouteCtrl)
```

### .setPath(path, ...Controllers)
For the setPath the first parameter is the route.  The next parameters are functions(middleware) to run.  This is useful to check for authentication.  Remember that the next() function needs to be invoked to run the next function in the stack.

```js
function AuthCtrl(req, next) {
  if(isAllowed) {
    next()
  } else {
    Router.goto('login/')
  }
}

Router
  .setPath('todo/home', AuthCtrl, RouteCtrl)
```

### req variable

| property |  Description |
|:---------:|:---------:|
| req.exit(function) | execute a function to run when leaving the route path |
| req.params.get(key) | a new Map() of parameters configured from the route path |
| req.search.get(key) | returns new URLSearchParams(window.location.search) |

### Routing Path
All routing paths are absolute but a parameter can be added with a colon `:`.

```js
RouterService
  .setPath('/alerts/:id', alertController)
  .setPath('/alerts/:id?', alertControllerOptional)
  .setPath('/alerts/:id/warn/:status?', alertWarnControllerOptional)
```

Adding a question mark ? will make the param optional. 

The `req` object will have a new Map() named params that will have the the values found from the url.

```js
// url http://localhost:9000/home/alerts/1234/warn/error
const homeController = (req, next) => {
  req.params.get('id') // equal to 1234 from url
  req.params.get('status') // equal to error from url
  next()
}
```

### How to use

The idea here is that the route controller will link services and views when executed.  It is up to the developer to know what HTML to display and what services are needed to populate the view.  Below are details about how to change the url path with a custom element and how to display content using a custom element from the controller.

## Routing Custom Elements

The `<h-route-link>` custom element is a way to create links that will update the `window.history` object to change the window url.  This action will be picked up by the `Router` service via a custom window event (`url change`) or the `popstate` when using the back and forward buttons.  Based on the url a function will be execute.  Within the function, `<h-route-display>` should be updated to with the html for that route.

## `<h-route-link>`

For links to change the url use the custom element `<h-route-link>`

```html
<h-route-link data-route="home" data-title="Home Page">Home</h-route-link>
```
The browser url will change to <http://localhost:9000/home> when clicked on.  This element will dispatch a custom window event that can be picked up.

**Attributes**

| Attribute  | value | Description |
|:---------:|:---------:|:---------:|
| data-title | string | will set the document title |
| data-back | boolean[true or false] | will this be used as a back/return button |
| data-link | string | url to route |
| data-disabled | boolean[true or false] | Disable the button from being clicked on |

> Note attribute values are always a string value

## `<h-route-display>`
This should be used to display html from a given template and style.  The `<template>` tag with the HTML to display is required.

**Attributes**

| Attribute  | value | Description |
|:---------:|:---------:|:---------:|
| data-transition-type | defaults to opacity | pass in a CSS transition type to animate display changes |
| data-transition-start | defaults to 0 | start time based on CSS transitions |
| data-transition-end | defaults to 1 | end time based on CSS transitions |
| data-transition-enable | boolean[true or false] | must be false to disable, can be omitted |

**Methods**

| Method  | Description |
|:---------:|:---------:|
| empty() | remove html from display |
| insertContent(content) | content should be a string with a <template> and optional <style> tags with HTML and CSS |
|addElementToContent(element, position = 'beforeend') | uses insertAdjacentElement to insert an element to the display |

**Samples**

```html
// HTML for features/todo/home.html
<template>
  <p>I am a todo page</p>
</template>
<style>
  p { color: red }
</style>
```

```js
import { Router } from '@hingejs/services'
import HTML from 'features/todo/home.html'

const RouteCtrl = async (req, next) => {
  const $routeDisplay = document.querySelector('h-route-display')
  await $routeDisplay.insertContent(HTML)
  const newElement = document.createElement('my-tag')
  await $routeDisplay.addElementToContent(newElement)
  next()
}

Router
  .setPath('todo/home', RouteCtrl)
```
