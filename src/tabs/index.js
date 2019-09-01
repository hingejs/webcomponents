window.customElements.define('h-tabs', class extends HTMLElement {

  _generateTemplate() {
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
      .tab-panel {
        box-shadow: 0 2px 2px rgba(0, 0, 0, .3);
        background: white;
        border-radius: 3px;
        padding: 16px;
        height: 250px;
        overflow: auto;
      }
      .tab-panel ::slotted([aria-hidden="true"]) {
        display: none;
      }


      .tab-navigation {
        display: flex;
        user-select: none;
        outline: none;
      }
      .tab-navigation slot {
        display: flex;
      }

      .tab-navigation ::slotted(*) {
        font: 400 16px/22px 'Roboto';
        padding: 16px 8px;
        margin: 0;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        outline: none;
        cursor: pointer;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background: linear-gradient(#fafafa, #eee);
        border: none; /* if the user users a <button> */
      }
      .tab-navigation ::slotted([aria-selected="true"]) {
        font-weight: 600;
        background: white;
        box-shadow: none;
      }

      .animate-opacity {
        animation:animateOpacity 0.8s;
      }
      @keyframes animateOpacity {
        from {
          opacity:0;
        }
        to {
          opacity:1;
        }
      }
      .animate-left {
        position:relative;
        animation: animateLeft 0.4s;
      }
      @keyframes animateLeft {
        from {
          left:-300px;
          opacity:0;
        }
        to {
          left:0;
          opacity:1;
        }
      }
      .animate-right {
        position:relative;
        animation:animateRight 0.4s
      }
      @keyframes animateRight {
        from {
          right:-300px;
          opacity:0;
        }
        to {
          right:0;
          opacity:1;
        }
      }
      </style>
      <div class="tab-navigation">
        <slot id="tabSlot" name="navigation"></slot>
      </div>
      <div class="tab-panel">
        <slot id="panelSlot" class="animate-opacity"></slot>
      </div>
    `.trim()
    return template
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this._generateTemplate().content.cloneNode(true))
    this.$tabSlot = this.shadowRoot.querySelector('#tabSlot')
    this.$panelSlot = this.shadowRoot.querySelector('#panelSlot')
    this._selected = 0

    this.$tabSlot.addEventListener('slotchange', () => {
      this.$tabs = this.$tabSlot.assignedNodes({ flatten: true })
      this.$panels = this.$panelSlot.assignedNodes({ flatten: true })
        .filter(el => el.nodeType === Node.ELEMENT_NODE)
      this.selected = this._findFirstSelectedTab()
    })

    this.$tabSlot.addEventListener('click', (evt) => {
      if (evt.target.slot === 'navigation') {
        this.selected = this.$tabs.indexOf(evt.target)
        evt.target.focus()
      }
    })

  }

  get selected() {
    return this._selected
  }

  set selected(idx) {
    this._selected = idx
    this._selectTab(idx)
    // Updated the element's selected attribute value when
    // backing property changes.
    this.setAttribute('selected', idx)
  }

  _selectTab(idx = null) {
    this.$tabs.forEach((tab, i) => {
      const select = i === idx
      tab.setAttribute('aria-selected', select)
      this.$panels[i].setAttribute('aria-hidden', !select)
    })
  }

  _findFirstSelectedTab() {
    let selectedIndex = 0
    this.$tabs.forEach((tab, i) => {
      if (tab.hasAttribute('selected')) {
        selectedIndex = i
      }
    })
    return selectedIndex
  }

})
