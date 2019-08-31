window.customElements.define('h-route-display', class extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = '<div class="route-display-content"></div>'
    this.$content = this.querySelector('.route-display-content')
    this.$content.style.transition = 'all 0.2s'
    this.$content.style.transformStyle = 'preserve-3d'
  }

  empty() {
    if (this.$content) {
      this.$content.innerHTML = ''
    }
  }

  async insertContent(content) {
    if (!this.$content) {
      return Promise.reject()
    }
    const transitionType = this.getAttribute('data-transition-type') || 'opacity'
    const transitionStart = this.getAttribute('data-transition-start') || '0'
    const transitionEnd = this.getAttribute('data-transition-end') || '1'
    let transitionDisable = this.getAttribute('data-transition-enable')
    transitionDisable = (transitionDisable && transitionDisable.toLowerCase() === 'false')
    if (!transitionDisable) {
      await this._transitionToPromise(this.$content, transitionType, transitionStart)
    }
    const doc = new DOMParser().parseFromString(content, 'text/html')
    const template = doc.querySelector('template')
    const style = doc.querySelector('style')
    if (template) {
      this.empty()
      this.$content.innerHTML = template.innerHTML.toString()
    }
    if (style) {
      this.$content.insertAdjacentHTML('afterbegin', style.outerHTML)
    }
    return transitionDisable ?
      Promise.resolve() :
      this._transitionToPromise(this.$content, transitionType, transitionEnd)
  }

  addElementToContent(element, position = 'beforeend') {
    this.$content.insertAdjacentElement(position, element)
  }

  _transitionToPromise(el, property, value) {
    return new Promise(resolve => {
      const pascalCaseProperty = property.split(/(?=[A-Z])/g).map(prop => prop.charAt(0).toLowerCase() + prop.substring(1)).join('-')
      const transitionEnded = evt => {
        if (evt.propertyName !== pascalCaseProperty) {
          return
        }
        el.removeEventListener('transitionend', transitionEnded)
        resolve()
      }
      el.addEventListener('transitionend', transitionEnded)
      el.style[property] = value
    })
  }

})
