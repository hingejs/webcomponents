class TableSort extends HTMLElement {

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
      .appendChild(this._generateTemplate().content.cloneNode(true))
    this.$tableTHCells = [...this.querySelectorAll('th')]
    this._columnSortEvtBind = this._columnSortEvt.bind(this)
  }

  _generateTemplate() {
    const template = document.createElement('template')
    template.innerHTML = '<slot></slot>'
    return template
  }

  connectedCallback() {
    this.$tableTHCells = [...this.querySelectorAll('th')]
    this.$tableTHCells.forEach(th => th.addEventListener('click', this._columnSortEvtBind))
  }

  disconnectedCallback() {
    this.$tableTHCells.forEach(th => th.removeEventListener('click', this._columnSortEvtBind))
  }

  _getCellValue(tr, idx) {
    return tr.children[idx].innerText || tr.children[idx].textContent
  }

  _comparer(idx, asc) {
    return (a, b) => ((v1, v2) => new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'}).compare(v1, v2)
    )(this._getCellValue(asc ? a : b, idx), this._getCellValue(asc ? b : a, idx))
  }

  _columnSortEvt(evt) {
    this.columnSort(evt.target)
  }

  columnSort(th, asc) {
    const table = th.closest('table')
    if (th.asc === undefined) {
      th.asc = false
    }
    th.asc = !th.asc
    if(asc !== undefined) {
      th.asc = !!asc
    }
    this.$tableTHCells.forEach(cell => cell.classList.remove('active'))
    th.classList.add('active')
    Array.from(table.tBodies[0].children)
      .sort(this._comparer(Array.from(th.parentNode.children).indexOf(th), th.asc))
      .forEach(tr => table.tBodies[0].appendChild(tr))
    th.dataset.sort = th.asc ? 'asc' : 'desc'
    this.dispatchEvent(new CustomEvent('col-sort', { detail: {asc, th} }))
  }

}

window.customElements.define('table-sort', TableSort)
export default TableSort
