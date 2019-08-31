describe('table-sort', () => {

  let el
  const elemTag = 'h-table-sort'
  const expect = chai.expect

  beforeEach(() => {
    el = document.createElement(elemTag)
    const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Created On</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Eve</td>
          <td>02/5/2019 11:42 AM</td>
        </tr>
        <tr>
          <td>Adam</td>
          <td>02/1/2019 11:34 AM</td>
        </tr>
      </tbody>
    </table>
    `
    el.insertAdjacentHTML('afterbegin', tableHTML)
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
    el = null
  })

  describe('interface', () => {

    it('should be defined', async () => {
      let elem = document.querySelector(elemTag)
      expect(elem).to.not.be.undefined
      expect(window.customElements.get(elemTag)).to.not.be.undefined
    })

    it('should be an Element node ', async () => {
      let elem = document.querySelector(elemTag)
      expect(elem.nodeType).to.equal(Node.ELEMENT_NODE)
    })

  })

  describe('sort', () => {

    it('should add click events to the header to sort the first column', async () => {
      const header = Array.from(el.$tableTHCells).shift()
      const table = header.closest('table')
      header.dispatchEvent(new Event('click'))
      const column = [...table.querySelectorAll('tbody>tr>:nth-child(1)')].map(col => col.innerText)
      expect(column).to.deep.equal(['Adam','Eve'])
    })

    it('should add click events to the header to sort the second column', async () => {
      const header = Array.from(el.$tableTHCells).pop()
      const table = header.closest('table')
      header.dispatchEvent(new Event('click'))
      let column = [...table.querySelectorAll('tbody>tr>:nth-child(2)')].map(col => col.innerText)
      expect(column).to.deep.equal(['02/1/2019 11:34 AM','02/5/2019 11:42 AM'])
    })

    it('should add "active" to the header class that is sorted', async () => {
      const header = Array.from(el.$tableTHCells).pop()
      header.dispatchEvent(new Event('click'))
      let isActive = header.classList.contains('active')
      expect(isActive).to.be.true
    })

    it('should add the data-sort attribute to the header class that is sorted', async () => {
      const header = Array.from(el.$tableTHCells).shift()
      header.dispatchEvent(new Event('click'))
      expect(header.dataset.sort).to.equal('asc')
      header.dispatchEvent(new Event('click'))
      expect(header.dataset.sort).to.equal('desc')
    })

    it('should set sort direction on columnSort function', async () => {
      const header = Array.from(el.$tableTHCells).shift()
      el.columnSort(header, false)
      expect(header.dataset.sort).to.equal('desc')
      el.columnSort(header, true)
      expect(header.dataset.sort).to.equal('asc')
    })

  })

})
