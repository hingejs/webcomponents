class ContentLoader extends HTMLElement {

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this.generateTemplate().content.cloneNode(true))
    this.$loader = this.shadowRoot.querySelector('div.content')
  }

  generateTemplate() {

    const template = document.createElement('template')

    template.innerHTML = `
      <style>
        .content {
          background-color: var(--background, transparent);
          margin: 0;
          position: relative;
        }
        .loader {
          align-items: center;
          background-color: var(--background, transparent);
          display: inline-flex;
          height: 100%;
          justify-content: center;
          left: 0;
          position: absolute;
          top: 0;
          transition: transform .2s ease-out;
          visibility: hidden;
          width: 100%;
          z-index: 9999;
        }
        .dual-ring {
          animation: dual-ring 1.2s linear infinite;
          content: " ";
          display: block;
          border: 5px solid var(--on-background, #000);
          border-left-color: transparent;
          border-radius: 50%;
          border-right-color: transparent;
          height: 46px;
          margin: 1px;
          transition: transform .2s ease-out;
          width: 46px;
        }
        @keyframes dual-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loader:hover {
          transform: scale(1.2);
        }
        .content.is-loading .loader {
          visibility: visible;
          min-height: 70px;
        }
        .content.is-loading slot {
          visibility: hidden;
        }
      </style>
      <div class="content">
        <div class="loader">
          <div class="dual-ring"></div>
        </div>
        <slot></slot>
      </div>
    `
    return template
  }

  connectedCallback() {
    this._render()
  }

  static get observedAttributes() {
    return ['data-loading']
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render()
    }
  }

  _render() {
    if (this.isLoading()) {
      this.$loader.classList.add('is-loading')
    } else {
      this.$loader.classList.remove('is-loading')
    }
  }

  isLoading() {
    return this.getAttribute('data-loading') === 'true'
  }

  loading() {
    this.dataset.loading = true
  }

  done() {
    this.dataset.loading = false
  }

}

window.customElements.define('content-loader', ContentLoader)
export default ContentLoader
