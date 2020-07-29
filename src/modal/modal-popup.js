const TAG_NAME = 'h-modal-popup'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
        :host {
          --modal-popup-expand-width: 2rem;
        }
        .modal {
          align-items: center;
          bottom: 0;
          display: none;
          flex-direction: column;
          justify-content: center;
          left: 0;
          margin: auto;
          max-height: 50vh;
          max-width: calc(50vw + var(--modal-popup-expand-width));
          overflow: hidden;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 200;
        }
        .side {
          flex-direction: initial;
          height: 100%;
          margin: 0;
          max-height: 100vh;
          max-width: calc(50vw + var(--modal-popup-expand-width));
          right: 0;
          width: calc(50vw + var(--modal-popup-expand-width));
        }
        .bg-is-active {
          max-height: 100vh;
          max-width: 100vw;
          width: 100vw;
        }
        .left {
          justify-content: flex-start;
        }
        .right {
          justify-content: flex-end;
          left: initial;
          right: 0;
        }
        .popup {
          background: #fff;
          border-radius: 3px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          max-height: 50vh;
          max-width: 50vw;
          min-height: 100px;
          min-width: 300px;
          overflow: auto;
          position: fixed;
          z-index: 2;
        }
        .large {
          max-height: 80vh;
          width: 80vw;
        }
        .is-tall {
          max-height: 95vh;
        }
        .popup-side {
          height: 100vh;
          max-height: 100vh;
          width: 50vw;
        }
        .modal, .popup-side {
          transition:  0.5s ease-in-out max-width, 0.5s ease-in-out width;
        }
        .side.expanded {
          max-width: calc(85vw + var(--modal-popup-expand-width));
          width: calc(85vw + var(--modal-popup-expand-width));
        }
        .expanded .popup-side {
          max-width: 85vw;
          width: 85vw;
        }
        .is-active {
          animation: slide-in-left 0.5s forwards;
          display: flex;
        }
        .is-active.right {
          animation: slide-in-right 0.5s forwards;
        }
        .background {
          background-color: rgba(10, 10, 10, 0.5);
          left: 0;
          position: absolute;
          top: 0;
        }
        .bg-is-active .background {
          max-height: 100vh;
          bottom: 0;
          right: 0;
        }
        .content {
          box-sizing: border-box;
          width: 100%;
        }
        .slide .content {
          height: 100vh;
        }
        .close {
          background-color: #fff;
          border-radius: 50px;
          color: #555;
          cursor: pointer;
          font: 500 2.2rem sans-serif;
          outline: none;
          position: absolute;
          right: 2.4rem;
          text-align: center;
          top: 1rem;
          width: 38px;
        }
        .close-wrapper {
          position: sticky;
          position: -webkit-sticky;
          top: 0;
          z-index: 1;
        }
        .side-expand {
          align-items: center;
          background-color: rgb(70, 70, 70);
          bottom: 50vh;
          cursor: pointer;
          display: flex;
          justify-content: center;
          min-height: 3rem;
          position: fixed;
          width: var(--modal-popup-expand-width);
          z-index: 201;
        }
        .side.right .side-expand {
          border-radius: 8px 0 0 8px;
          box-shadow: -2px 0px 3px 0px rgba(0, 0, 0, 0.3);
          margin-left: -var(--modal-popup-expand-width);
          left:0;
        }
        .side.left .side-expand {
          border-radius: 0 8px 8px 0;
          box-shadow: 2px 0px 3px 0px rgba(0, 0, 0, 0.3);
          right: 0;
        }
        .expand-circle {
          align-items: center;
          background-color: white;
          border-radius: 50px;
          color: rgb(70, 70, 70);
          display: flex;
          font-size: 1rem;
          justify-content: center;
          padding: 0.15rem;
        }
        .expand-circle::after {
          content: '\\25C0';
          display: block;
          transform: rotate(0deg);
          transition: 0.2s ease-in-out transform;
        }
        .left .expand-circle::after,
        .expanded .expand-circle::after {
          transform: rotate(180deg);
        }
        .left.expanded .expand-circle::after {
          transform: rotate(0deg);
        }
        .hide-content,
        .modal:not(.side) .side-expand {
          display: none;
        }
        @keyframes slide-in-left {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(0%); }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(200%); }
          100% { transform: translateX(0%); }
        }
        @media screen and (max-width: 800px) {
          .modal {
            max-height: 75vh;
            max-width: 79vw;
          }
          .side {
            max-height: 100vh;
            width: 79vw;
          }
          .bg-is-active {
            max-height: 100vh;
            max-width: 100vw;
            width: 100vw;
          }
          .popup {
            max-height: 75vh;
            max-width: 75vw;
            min-height: 100px;
            min-width: 300px;
          }
          .popup-side {
            max-height: 100vh;
            width: 75vw;
          }
          .side-expand {
            display: none;
          }
        }
        </style>
        <div class="modal" part="wrapper">
          <div class="background" part="background"></div>
          <div class="popup" part="popup">
            <div class="close-wrapper" part="close-wrapper">
              <div class="close" aria-label="close" part="close">&#215;</div>
            </div>
            <div class="content">
              <slot></slot>
            </div>
            <div class="side-expand" part="expand">
              <div class="expand-circle" part="expand-circle"></div>
            </div>
          </div>
        </div>
      `.trim()
      return template
    }

    constructor() {
      super()
      if (null === this.shadowRoot) {
        this.attachShadow({ mode: 'open' })
          .appendChild(this._generateTemplate().content.cloneNode(true))
          window.document.body.appendChild(this)
          this.$btnClose = this.shadowRoot.querySelector('div.close')
          this.$modal = this.shadowRoot.querySelector('div.modal')
          this.$modalPopup = this.shadowRoot.querySelector('div.popup')
          this.$modalBG = this.shadowRoot.querySelector('div.background')
          this.$modalBlur = document.querySelector('modal-blur')
          this.$sideExpand = this.shadowRoot.querySelector('.side-expand')
      }
    }

    connectedCallback() {
      if (this.shadowRoot instanceof ShadowRoot) {
        this.$btnClose.addEventListener('click', this.closePopup.bind(this))
        this.$modalBG.addEventListener('click', this.closePopup.bind(this))
        this.$sideExpand.addEventListener('click', this.expand.bind(this))
        this.render()
      }
    }

    resetScroll() {
      this.$modalPopup.scroll({
        top: 0,
      })
    }

    static get observedAttributes() {
      return ['data-show', 'data-allow-close', 'data-position', 'data-allow-screen-click', 'data-is-large', 'data-is-tall', 'data-expand', 'data-for']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (['data-for'].includes(attr)) {
          this.updateTipFor()
        }
        this.render()
      }
    }

    render() {
      let position = 'center'

      this.isLargeDisplay()
      this.$modalPopup.classList.toggle('is-tall', this.getAttribute('data-is-tall') === 'true')

      if (this.dataset.position) {
        position = this.dataset.position.toLowerCase()
      }

      if (this.$modalBlur) {
        this.$modalBlur.dataset.blur = 'false'
      }

      this.resetModal()

      /* !allowClose */
      this.$btnClose.classList.toggle('hide-content', this.getAttribute('data-allow-close') === 'false')

      if (position && ['right', 'left'].includes(position)) {
        this.$modal.classList.add('side', position)
        this.$modalPopup.classList.add('popup-side')
      }

      this.showModalCheck()
      this.hideBGCheck()
      this.enableExpandCheck()
    }

    isLargeDisplay() {
      this.$modalPopup.classList.toggle('large', this.getAttribute('data-is-large') === 'true')
    }

    showModalCheck() {
      if (this.getAttribute('data-show') === 'true') {
        this.$modal.classList.add('is-active')
        if (this.$modalBlur) {
          this.$modalBlur.dataset.blur = 'true'
        }
      }
    }

    hideBGCheck() {
      /* Hide background */
      if (this.getAttribute('data-allow-screen-click') === 'true') {
        if (this.$modalBlur) {
          this.$modalBlur.dataset.blur = 'false'
        }
        this.$modal.classList.remove('bg-is-active')
      }
    }

    resetModal() {
      this.$modal.classList.remove('is-active', 'side', 'right', 'left', 'expanded')
      this.$modal.classList.add('bg-is-active')
      this.$modalPopup.classList.remove('popup-side')
      this.$btnClose.classList.remove('hide-content')
    }

    closePopup() {
      let allowClose = true
      if (this.getAttribute('data-allow-close') === 'false') {
        allowClose = false
      }
      if (allowClose) {
        this.dataset.show = false
      }
      this.dispatchEvent(new CustomEvent('popup-closed'),  { bubbles: true })
    }

    isOpen() {
      return this.getAttribute('data-show') === 'true'
    }

    expand() {
      this.$modal.classList.toggle('expanded')
      const isExpanded = this.$modal.classList.contains('expanded')
      this.dispatchEvent(new CustomEvent('popup-expanded', { bubbles: true, detail: { isExpanded } }))
    }

    enableExpandCheck() {
      this.$sideExpand.classList.toggle('hide-content', this.getAttribute('data-expand') === 'false')
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

    updateTipFor() {
      if (this.isNewTipFor()) {
        if (this.observer instanceof MutationObserver) {
          this.observer.disconnect()
        }
        this.$tipFor = this.$tipForNew
        if (this.$tipFor) {
          this.onRemove(this.$tipFor, this.remove.bind(this))
        }
      }
    }

    isNewTipFor() {
      this.$tipForNew = document.getElementById(this.dataset.for)
      return this.$tipForNew && !this.$tipForNew.isEqualNode(this.$tipFor)
    }

  })
}

