/*
<div id="deployment-device"> *** </div>
<drop-down
data-for="deployment-device"
data-user-action="mouse | click | auxclick"
data-position="left | right"
data-distance-x="15"
data-distance-y="15"
data-parent=""
>
  <ul>
    <li>menu item 1</li>
    <li>menu item 2</li>
    <li>menu item 3</li>
  </ul>
</drop-down>
*/

//TODO figure mouse out, blur to close, correct styling, third nested menu test
window.customElements.define('drop-down', class extends HTMLElement {
  constructor() {
    super()
    this._allowedPositions = new Set(['left','right'])
    this._allowedUserActions = new Set(['auxclick','click','mouse'])
    if (null === this.shadowRoot) {
      this._onClickBind = this.toggleMenu.bind(this)
      this._onShowBind = this.show.bind(this)
      this._onHideBind= this.hide.bind(this)
      this._preventDefaultBind = this._preventDefault.bind(this)
      this.attachShadow({ mode: 'open' })
        .appendChild(this._generateTemplate().content.cloneNode(true))
      window.document.body.appendChild(this)
    }
  }

  _generateTemplate() {
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        :host{
          position: absolute;
          z-index: 999;
        }
      </style>
      <slot></slot>
    `
    return template
  }

  connectedCallback() {
    if (this.shadowRoot instanceof ShadowRoot) {
      this.hide()
      this.updateMenuFor()
    }
  }

  disconnectedCallback() {
    if (this.$menuFor) {
      this.$menuFor.removeEventListener('click', this._onClickBind)
      this.$menuFor.removeEventListener('auxclick', this._onClickBind)
      this.$menuFor.removeEventListener('contextmenu', this._preventDefaultBind)
      this.$menuFor.removeEventListener('mouseover', this._onShowBind)
      window.removeEventListener('click', this._onHideBind)
      if (this.observer) {
        this.observer.disconnect()
      }
    }
  }

  updateMenuFor() {
    if (this.isNewMenuFor()) {
      this._updateEvent()
    }
  }

  _updateEvent() {
    this.disconnectedCallback()
    const userAction = this.getAttribute('data-user-action')
    if (this._allowedUserActions.has(userAction)) {
      this.$menuFor = this.$menuForNew
      if (this.$menuFor) {
        this.onRemove(this.$menuFor, this.remove.bind(this))

        if(userAction === 'mouse') {
          this.$menuFor.addEventListener('mouseover', this._onShowBind)

        } else {
          if(userAction === 'auxclick') {
            this.$menuFor.addEventListener('contextmenu', this._preventDefaultBind)
          }
          this.$menuFor.addEventListener(userAction, this._onClickBind)
        }
      }
    }
  }

  isNewMenuFor() {
    this.$menuForNew = document.getElementById(this.getAttribute('data-for'))
    return this.$menuForNew && !this.$menuForNew.isEqualNode(this.$menuFor)
  }

  static get observedAttributes() {
    return ['data-distance-x','data-distance-y', 'data-for', 'data-position', 'data-user-action']
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (['data-for'].includes(attr)) {
        this.updateMenuFor()
      }
      if (['data-user-action'].includes(attr)) {
        this._updateEvent()
      }
      this._positionAt()
    }
  }

  onRemove(element, onDetachCallback) {
    const isDetached = el => {
      if (document === el.parentNode) {
        return false
      } else if (null === el.parentNode) {
        return true
      } else {
        return isDetached(el.parentNode)
      }
    }
    this.observer = new MutationObserver(() => {
      if (isDetached(element)) {
        this.observer.disconnect()
        onDetachCallback()
      }
    })
    this.observer.observe(document, {
      childList: true,
      subtree: true
    })
  }

  _positionAt() {
    if (this.$menuFor) {
      const attrPosition = this.getAttribute('data-position')
      const position = this._allowedPositions.has(attrPosition) ? attrPosition : 'right'
      const parentCoords = this.$menuFor.getBoundingClientRect()
      const attrDistanceX = this.getAttribute('data-distance-x') || 0
      const attrDistanceY = this.getAttribute('data-distance-y') || 0
      const distX = parseInt(attrDistanceX, 10)
      const distY = parseInt(attrDistanceY, 10)
      let left = parseInt(parentCoords.right, 10) + distX
      let top = parseInt(parentCoords.top, 10) + distY

      if (position === 'left') {
        left = parseInt(parentCoords.left, 10) - distX - this.offsetWidth
      }

      left += window.scrollX
      top += window.scrollY

      const maxLeft = window.innerWidth - this.offsetWidth
      left = Math.min(left, maxLeft)
      left = Math.max(0,left)

      this.style.left = `${left}px`
      this.style.top = `${top}px`
    }
  }

  _preventDefault(evt) {
    if(evt instanceof Event) {
      evt.stopPropagation()
      evt.preventDefault()
    }
  }

  toggleMenu(evt) {
    if(this.isShowing()) {
      this.hide()
    } else {
      this.show(evt)
    }
  }

  show(evt) {
    this._preventDefault(evt)
    this.closeChildren()
    this._positionAt()
    this.removeAttribute('hidden')
    requestAnimationFrame(()=>{
      this.classList.add('open')
    })
    window.addEventListener('click', this._onHideBind)
  }

  hide() {
    this.setAttribute('hidden', 'hidden')
    this.classList.remove('open')
    window.removeEventListener('click', this._onHideBind)
  }

  closeChildren() {
    const thisParent = this.getAttribute('data-parent')
    const parentGroup = [...document.querySelectorAll(`dropdown-menu[data-parent="${thisParent}"]`)]

    parentGroup.forEach(elem => {
      const childId = elem.getAttribute('data-for')
      const childGroups = [...document.querySelectorAll(`dropdown-menu[data-parent="${childId}"]`)]
      childGroups.forEach(elem => elem.closeChildren())
      elem.hide()
    })
  }

  isShowing() {
    return !this.hasAttribute('hidden')
  }

})
