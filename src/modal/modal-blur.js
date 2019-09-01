window.customElements.define('h-modal-blur', class extends HTMLElement {

  _generateTemplate() {
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        .cover {
          transition: 0.1s all ease;
        }
        .blur {
          filter: blur(3px);
          transform: scale(0.99);
        }
      </style>
      <div class="cover blur">
          <slot></slot>
      </div>
    `.trim()
    return template
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this._generateTemplate().content.cloneNode(true))
    this.modalCover = this.shadowRoot.querySelector('div.cover')
  }

  connectedCallback() {
    this.render()
  }

  static get observedAttributes() {
    return ['data-blur']
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render()
    }
  }

  render() {
    const isBlurred = this.getAttribute('data-blur') === 'true'
    this.modalCover.classList.toggle('blur', isBlurred)
  }

})
