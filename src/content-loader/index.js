class ContentLoader extends HTMLElement {

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this.generateTemplate().content.cloneNode(true))
    this._loader = this.shadowRoot.querySelector('div.loader')
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
          background-color: var(--background, #eee);
          display: inline-flex;
          height: 100%;
          justify-content: center;
          left: 0;
          position: absolute;
          top: 0;
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
        .dual-ring:hover {
          transform: scale(1.2);
        }
        .loader.is-active {
          visibility: visible;
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
    if (this.dataset.loading && this.dataset.loading.toLowerCase() === 'true') {
      this._loader.classList.add('is-active')
    } else {
      this._loader.classList.remove('is-active')
    }
  }

  isLoading() {
    this.dataset.loading = true
  }

  done() {
    this.dataset.loading = false
  }

}

window.customElements.define('content-loader', ContentLoader)
export default ContentLoader
