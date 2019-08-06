class AccordionSlider extends HTMLElement {


  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
      .appendChild(this._generateTemplate().content.cloneNode(true))
  }

  _generateTemplate() {
    const template = document.createElement('template')
    template.innerHTML = '<slot></slot>'
    return template
  }

  connectedCallback() {
    this.observerConfig = { attributes: false, childList: true, subtree: true }
    const accordionObserver = new MutationObserver(this.newSummary.bind(this))
    accordionObserver.observe(this, this.observerConfig)
    this.summaryObserver = new MutationObserver(this.adjustAllSummaryHeights.bind(this))
    this.newSummary()
  }

  toggleExpanded(header, summary, section) {
    header.classList.toggle('expanded')
    if (header.classList.contains('expanded')) {
      summary.classList.add('expanded')
      section.classList.add('expanded')
    } else {
      summary.classList.remove('expanded')
      section.classList.remove('expanded')
    }
    this.adjustAllSummaryHeights(summary)
  }

  newSummary() {
    const sections = [...this.querySelectorAll('section:not([data-all-set])')]
    sections.forEach(section => {
      section.dataset.allSet = true
      const header = section.querySelector('header')
      const summary = section.querySelector('summary')
      this._applyStyle(summary)
      if (header) {
        if (header.classList.contains('expanded')) {
          summary.classList.add('expanded')
          section.classList.add('expanded')
        }
        header.addEventListener('click', this.toggleExpanded.bind(this, header, summary, section))
      }
      this.summaryObserver.observe(summary, this.observerConfig)
    })
    this.adjustAllSummaryHeights()
  }

  expandAll(group = '') {
    let selector = 'section[data-all-set]'
    if (group.length) {
      selector += `[data-group="${group}"]`
    }
    const sections = [...this.querySelectorAll(selector)]
    sections.forEach(section => {
      const header = section.querySelector('header')
      const summary = section.querySelector('summary')
      section.classList.add('expanded')
      if (header) {
        header.classList.add('expanded')
      }
      if (summary) {
        summary.classList.add('expanded')
      }
    })
    this.adjustAllSummaryHeights()
  }

  async adjustAllSummaryHeights(filterSummary = null) {
    const summaries = [...this.querySelectorAll('summary')]
    await Promise.all(summaries.filter(summary => summary === filterSummary).map(async summary =>
      await this._setSummaryHeight(summary)
    ))
    await Promise.all(summaries.filter(summary => summary !== filterSummary).map(async summary =>
      await this._setSummaryHeight(summary)
    ))
  }

  collapseAll(group = '') {
    let selector = 'section[data-all-set]'
    if (group.length) {
      selector += `[data-group="${group}"]`
    }
    const sections = [...this.querySelectorAll(selector)]
    sections.forEach(section => {
      const header = section.querySelector('header')
      const summary = section.querySelector('summary')
      if (header) {
        header.classList.remove('expanded')
      }
      if (summary) {
        summary.style.maxHeight = '0'
        summary.classList.remove('expanded')
      }
      section.classList.remove('expanded')
    })
  }

  _setSummaryHeight(summary) {
    summary.dataset.maxHeight = this._getHeight(summary)
    let height = '0'
    if (summary.classList.contains('expanded')) {
      height = `${summary.dataset.maxHeight}px`
    }
    return this._transitionToPromise(summary, 'maxHeight', height)
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

  _applyStyle(elem) {
    elem.style.maxHeight = 0
    elem.style.overflow = 'hidden'
    elem.style.transition = 'max-height 0.2s ease-out'
  }

  _getHeight(target) {
    const style = window.getComputedStyle(target)
    return ~~['height', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom']
      .map(key => parseInt(style.getPropertyValue(key), 10))
      .reduce((prev, cur) => prev + cur, ~~target.scrollHeight)
  }

}

window.customElements.define('accordion-slider', AccordionSlider)
export default AccordionSlider
