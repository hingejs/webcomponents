describe('modal-blur', () => {

  let el
  const elemTag = 'h-modal-blur'
  const expect = chai.expect

  beforeEach(() => {
    el = document.createElement(elemTag)
    el.insertAdjacentHTML('afterbegin', '<h1>Testing</h1>')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
    el = null
  })

  describe('interface', () => {

    it('should be defined', async () => {
      const elem = document.querySelector(elemTag)
      expect(elem).to.not.be.undefined
      expect(window.customElements.get(elemTag)).to.not.be.undefined
    })

    it('should be an Element node ', async () => {
      const elem = document.querySelector(elemTag)
      expect(elem.nodeType).to.equal(Node.ELEMENT_NODE)
    })

  })

  describe('component', () => {

    it('should include a slot for html', async () => {
      const component = document.querySelector(elemTag)
      const h1 = component.shadowRoot.querySelector('h1')
      expect(h1).to.not.be.undefined
    })

    it('should have a div that will cover the slot content', async () => {
      const component = document.querySelector(elemTag)
      const cover = component.shadowRoot.querySelector('div.cover')
      expect(cover).to.not.be.undefined
    })

    it('should have a blur class when active', async () => {
      const component = document.querySelector(elemTag)
      component.dataset.blur = 'true'
      const cover = component.shadowRoot.querySelector('div.cover')
      expect(cover.classList.contains('blur')).to.be.true
    })

    it('should not have a blur class when inactive', async () => {
      const component = document.querySelector(elemTag)
      component.dataset.blur = 'false'
      const cover = component.shadowRoot.querySelector('div.cover')
      expect(cover.classList.contains('blur')).to.be.false
    })

  })

})
