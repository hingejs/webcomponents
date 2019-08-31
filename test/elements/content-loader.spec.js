describe('content-loader', () => {

  let el
  const elemTag = 'h-content-loader'
  const expect = chai.expect

  beforeEach(() => {
    el = document.createElement(elemTag)
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

  describe('component', () => {

    it('should be loading when set to true', async () => {
      el.loading()
      expect(el.isLoading()).to.be.true
    })

    it('should not be loading when set to false', async () => {
      el.done()
      expect(el.isLoading()).to.be.false
    })

  })

})

