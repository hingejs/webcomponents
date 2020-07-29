const TAG_NAME = 'h-tool-tip'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {
    constructor() {
      super()
      if (null === this.shadowRoot) {
        this._onMouseoverBind = this.show.bind(this)
        this._onMouseoutBind = this.hide.bind(this)
        this.attachShadow({ mode: 'open' })
          .appendChild(this._generateTemplate().content.cloneNode(true))
        window.document.body.appendChild(this)
      }
    }


    _generateTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          .arrow {
            background: var(--surface, #212121);
            height: 15px;
            position: absolute;
            transform: rotateZ(45deg);
            width: 15px;
          }
          .tip {
            background-color: var(--surface, #212121);
            border-radius: 6px;
            box-shadow: var(--element-shadow, rgba(0,0,0,0.5));
            color: var(--on-surface, #eee);
            display: inline;
            left: -100px;
            opacity: 0;
            padding: 0.6rem;
            position: absolute;
            top: -100px;
            transition: opacity 0.3s;
            z-index: 1000;
          }
          .tip.active {
            opacity:1;
          }
          .bottom {
            box-shadow: -1px -1px var(--shadow);
          }
          .left {
            box-shadow: 1px -1px var(--shadow);
          }
          .top {
            box-shadow: 1px 1px 1px 0px var(--shadow);
          }
          .right {
            box-shadow: -1px 1px var(--shadow);
          }
        </style>
        <div class="tip">
          <div class="arrow"></div>
          <slot></slot>
        </div>
      `
      return template
    }

    connectedCallback() {
      if (this.shadowRoot instanceof ShadowRoot) {
        this.$tip = this.shadowRoot.querySelector('div.tip')
        this.$arrow = this.shadowRoot.querySelector('div.arrow')
        this.hide()
        this.updateTipFor()
      }
    }

    disconnectedCallback() {
      if (this.$tipFor) {
        this.$tipFor.removeEventListener('mouseover', this._onMouseoverBind)
        this.$tipFor.removeEventListener('mouseout', this._onMouseoutBind)
        if (this.observer) {
          this.observer.disconnect()
        }
      }
    }

    updateTipFor() {
      if (this.isNewTipFor()) {
        this._updateHoverFeature()
      }
    }

    _updateHoverFeature() {
      this.disconnectedCallback()
      if (this.getAttribute('data-hover') !== 'false') {
        this.$tipFor = this.$tipForNew
        if (this.$tipFor) {
          this.$tipFor.addEventListener('mouseover', this._onMouseoverBind)
          this.$tipFor.addEventListener('mouseout', this._onMouseoutBind)
          this.onRemove(this.$tipFor, this.remove.bind(this))
        }
      }
    }

    isNewTipFor() {
      this.$tipForNew = document.getElementById(this.dataset.for)
      return this.$tipForNew && !this.$tipForNew.isEqualNode(this.$tipFor)
    }

    static get observedAttributes() {
      return ['data-position', 'data-for', 'data-hover']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (['data-for'].includes(attr)) {
          this.updateTipFor()
        }
        if (['data-hover'].includes(attr)) {
          this._updateHoverFeature()
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
      if (this.$tipFor && this.$tip) {
        const position = this.dataset.position || 'right'
        const parentCoords = this.$tipFor.getBoundingClientRect()
        const tooltip = this.$tip
        const dist = 15
        let left = parseInt(parentCoords.right, 10) + dist
        let top = (parseInt(parentCoords.top, 10) + parseInt(parentCoords.bottom, 10)) / 2 - tooltip.offsetHeight / 2

        if (position === 'left') {
          left = parseInt(parentCoords.left, 10) - dist - tooltip.offsetWidth
        }

        if (position === 'bottom') {
          left = (parseInt(parentCoords.left, 10) + parseInt(parentCoords.right, 10)) / 2 - tooltip.offsetWidth / 2
          top = parseInt(parentCoords.bottom, 10) + dist
        }

        if (position === 'top') {
          left = (parseInt(parentCoords.left, 10) + parseInt(parentCoords.right, 10)) / 2 - tooltip.offsetWidth / 2
          top = parseInt(parentCoords.top, 10) - dist - tooltip.offsetHeight
        }

        left += window.scrollX
        top += window.scrollY

        tooltip.style.left = `${left}px`
        tooltip.style.top = `${top}px`
        this._positionArrow(
          position,
          parentCoords.top,
          parentCoords.right,
          parentCoords.bottom,
          parentCoords.left
        )
      }
    }

    _positionArrow(position) {
      /**
       * use the getBoundingClientRect() function to get the rendered
       * borders of the transformed $arrow div, and use those to center its point
       * on the specified toggle element
       */
      let arrowCoords
      const thisRect = this.$tip.getBoundingClientRect()
      switch (position) {
      case 'left': arrowCoords = this._arrowAtRight(thisRect); break
      case 'right': arrowCoords = this._arrowAtLeft(thisRect); break
      case 'top': arrowCoords = this._arrowAtBottom(thisRect); break
      case 'bottom': arrowCoords = this._arrowAtTop(thisRect); break
      default: arrowCoords = this._arrowAtRight(thisRect)
      }
      const { arrowTop, arrowLeft } = arrowCoords
      this.$arrow.style.left = `${arrowLeft}px`
      this.$arrow.style.top = `${arrowTop}px`
      this.$arrow.classList.remove('top', 'bottom', 'left', 'right')
      this.$arrow.classList.add(position)
    }

    _arrowAtLeft(targetCoords) {
      const { top, bottom } = targetCoords
      const arrowTop = ((bottom - top) / 2) - this.$arrow.clientWidth / 2
      const arrowLeft = - (this.$arrow.clientWidth / 2)
      return { arrowLeft, arrowTop }
    }

    _arrowAtRight(targetCoords) {
      const { top, bottom, right, left } = targetCoords
      const arrowTop = ((bottom - top) / 2) - this.$arrow.clientHeight / 2
      const arrowLeft = right - left - (this.$arrow.clientWidth / 2)
      return { arrowLeft, arrowTop }
    }

    _arrowAtTop(targetCoords) {
      const { left, right } = targetCoords
      const arrowTop = - this.$arrow.clientWidth / 2
      const arrowLeft = (right - left) / 2 - (this.$arrow.clientWidth / 2)
      return { arrowLeft, arrowTop }
    }

    _arrowAtBottom(targetCoords) {
      const { top, bottom, left, right } = targetCoords
      const arrowTop = bottom - top - (this.$arrow.clientWidth / 2)
      const arrowLeft = (right - left) / 2 - (this.$arrow.clientWidth / 2)
      return { arrowLeft, arrowTop }
    }

    show() {
      this._positionAt()
      this.$tip.classList.add('active')
    }

    hide() {
      this.$tip.classList.remove('active')
      this.$tip.style.left = '-1000px'
      this.$tip.style.top = '-1000px'
    }

    isShowing() {
      return this.$tip.classList.contains('active')
    }

  })
}

