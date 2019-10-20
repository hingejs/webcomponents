- [For Attributes use data-*](#for-attributes-use-data-)
- [Updating CSS Variables](#updating-css-variables)
- [Get slot elements](#get-slot-elements)
- [Reason to use disconnectedCallback()](#reason-to-use-disconnectedcallback)
- [Need a UUID](#need-a-uuid)
- [Adding CSS once for non-shadow DOM Elements](#adding-css-once-for-non-shadow-dom-elements)
- [Check if a custom element is defined](#check-if-a-custom-element-is-defined)


***


# For Attributes use data-*

While this is not required, it can be suggested to use `data-*` for `observedAttributes()`.  While you can use any attribute name of your choosing, try sticking to using HTML standards.

```js
static get observedAttributes() {
  return ['data-selected']
}

attributeChangedCallback(attr, oldValue, newValue) {
  if (oldValue !== newValue) {
    this.render()
  }
}

render() {
  const isSelected = this.getAttribute('data-selected') === 'true'
  this.currentTab.classList.toggle('selected', isSelected)
}
```

# Updating CSS Variables

Maybe you have to set a custom variable for your component.  If you want to find a particular css variable you wan to update for any reason, here is a snippet to help.

```css
<style>
:host {
  --tabs-width: 100px;
}
</style>
```

```js
this.rootStyle = this.findCSSSelectorText(this.shadowRoot, ':host')
this.rootStyle.style.setProperty('--tabs-width', `${newVal}%`)

findCSSSelectorText(element, selector) {
    let result
    const sheets = [...element.styleSheets]
    const len = sheets.length
    for (let i = 0; i < len; i++) {
      result = [...sheets[i].cssRules].find(rule => rule.selectorText === selector)
      if (result) {
        break
      }
    }
    return result
  }

```

# Get slot elements

Being able to select slot items will be important.

```html
 <h-tabs>
    <button slot="navigation">Tab1</button>
    <button slot="navigation">Tab2</button>
    <section>Tab 1</section>
    <section>Tab 2</section>
</h-tabs>
```

Html for _generateTemplate()
```html
<div class="tab-navigation">
  <slot id="tabSlot" name="navigation"></slot>
</div>
<div id="tabPanel" class="tab-panel">
  <slot id="panelSlot"></slot>
</div>
```

```js
constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this._generateTemplate().content.cloneNode(true))
    this.$tabSlot = this.shadowRoot.querySelector('#tabSlot')
    this.$panelSlot = this.shadowRoot.querySelector('#panelSlot')
   
    this.$tabSlot.addEventListener('slotchange', () => {
      this.$tabs = this.$tabSlot.assignedNodes({ flatten: true })
      this.$panels = this.$panelSlot.assignedNodes({ flatten: true })
        .filter(el => el.nodeType === Node.ELEMENT_NODE)
    })
}
```

# Reason to use disconnectedCallback()

If you have attached an event listener to the window/document or element outside of the scope of the custom element, such as a tool-tip, you must remove the event listener.  You must reference the function in order for the remove to be done correctly

> Note that any events you attached within the custom element does not need to be removed because when the element is removed from the DOM, so are the event listeners attached

```js
constructor() {
    super()
    this._isActivatedBind = this._isActivated.bind(this)
  }

  connectedCallback() {
    window.addEventListener('focus', this._isActivatedBind)
  }

  disconnectedCallback() {
    window.removeEventListener('focus', this._isActivatedBind)
  }
```

# Need a UUID

```js
const uuid = new Date().getTime().toString(36) + performance.now().toString().replace(/[^0-9]/g, '')
```

# Adding CSS once for non-shadow DOM Elements

```js
_insertStyle() {
    const style = `
    <style type="text/css" id="${name}-style">
      ${name} p {
        border: 1px solid var(--${name}-border-color, #111);
        border-radius: 2px;
        display: flex;
        justify-content: space-between;
      }
    </style>`
    const elem = document.head || this.parentElement || this
    if (!elem.querySelector('#${name}-style')) {
      elem.insertAdjacentHTML('afterbegin', style)
    }
  }

connectedCallback() {
  this._insertStyle()
  this._generateTemplate()
}
```

# Check if a custom element is defined

- https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry

```js
if(window.customElements.get('my-custom-eleemnt')) {
  ...
}
```

Promise based
```js
window.customElements.whenDefined('my-custom-eleemnt').then(() => {
   ...
})
```

If you want to check all custom elements are defined

> Note that is one is not defined, the promise will never resolve

```js
function customElementsDefined() {
  const undefinedElements = document.querySelectorAll(':not(:defined)')
  return Promise.all([...undefinedElements].map(
    elem => window.customElements.whenDefined(elem.localName)
  ))
}

// use
await customElementsDefined()
// all elements Defined
```
