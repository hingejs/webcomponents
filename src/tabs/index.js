window.customElements.define('h-tabs', class extends HTMLElement {

  _generateTemplate() {
    const template = document.createElement('template')
    template.innerHTML = `
    <style>
        :host {
          --tabs-width: 100px;
          --tabs-section-width: 100px;
        }
        .panel-container {
          overflow: hidden;
          height: 200px;
          background: var(--surface, rgba(0,0,0,0.75));
          color: var(--on-surface, white);
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        .tab-panel {
          width: var(--tabs-width);
          height: 100%;
          transition: transform 0.3s;
          display: flex;
          flex-flow: row nowrap;
        }
        .tab-panel ::slotted(*) {
          height: 100%;
          width: var(--tabs-section-width);
          padding: 30px;
          overflow-y: auto;
        }
        .tab-navigation slot {
          display: inline-flex;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          overflow: hidden;
        }
        .tab-navigation ::slotted(*) {
          cursor: pointer;
          user-select: none;
          padding: 20px;
          border: none;
          outline: none;
          background: var(--surface, rgba(0,0,0,0.5));
          color: var(--on-surface, white);
          font-weight: bold;
        }
        .tab-navigation ::slotted([aria-selected="true"]) {
          background: rgba(0,0,0,0.75);
        }
    </style>
    <div class="tab-navigation">
      <slot id="tabSlot" name="navigation"></slot>
    </div>
    <div class="panel-container">
        <div id="tabPanel" class="tab-panel">
          <slot id="panelSlot"></slot>
        </div>
    </div>
  `.trim()
    return template
  }

  updateWidth() {
    if (this.rootStyle && this.$panels) {
      const numTabs = this.$panels.length
      this.rootStyle.style.setProperty('--tabs-width', `${100 * numTabs}%`)
      this.rootStyle.style.setProperty('--tabs-section-width', `${(100 / numTabs).toFixed(1)}%`)
    }
  }

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

  constructor() {
    super()
    let numTabs
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this._generateTemplate().content.cloneNode(true))
    this.$tabPanel = this.shadowRoot.querySelector('#tabPanel')
    this.$tabSlot = this.shadowRoot.querySelector('#tabSlot')
    this.$panelSlot = this.shadowRoot.querySelector('#panelSlot')
    this._selected = 0
    this.rootStyle = this.findCSSSelectorText(this.shadowRoot, ':host')

    this.$tabSlot.addEventListener('slotchange', () => {
      this.$tabs = this.$tabSlot.assignedNodes({ flatten: true })
      this.$panels = this.$panelSlot.assignedNodes({ flatten: true })
        .filter(el => el.nodeType === Node.ELEMENT_NODE)
      numTabs = this.$panels.length
      this.selected = this._findFirstSelectedTab()
      this.updateWidth()
    })

    this.$tabSlot.addEventListener('click', (evt) => {
      if (evt.target.slot === 'navigation') {
        this.selected = this.$tabs.indexOf(evt.target)
        evt.target.focus()
        let panelOffset = this.selected * (-100 / numTabs).toFixed(1)
        this.$tabPanel.style.transform = `translateX(${panelOffset}%)`
      }
    })
  }

  get selected() {
    return this._selected
  }

  set selected(idx) {
    this._selected = idx
    this._selectTab(idx)
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
      if (tab.hasAttribute('aria-selected')) {
        selectedIndex = i
      }
    })
    return selectedIndex
  }

})
