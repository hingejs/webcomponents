describe('route-display', () => {

  let el
  const elemTag = 'h-route-display'
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

    it('should safely insert html', async () => {
      el.dataset.transitionEnable = false
      await el.insertContent('<template><h1>Testing</h1></template>')
      expect(el.$content.innerHTML).to.equal('<h1>Testing</h1>')
    })

    it('should safely insert style', async () => {
      el.dataset.transitionEnable = false
      await el.insertContent('<template><h1>Testing</h1></template><style>h1{color:red;}</style>')
      const h1Styles = window.getComputedStyle(el.$content.querySelector('h1'))
      expect(h1Styles.getPropertyValue('color')).to.equal('rgb(255, 0, 0)')
    })

    it('should transition a style', (done) => {
      document.body.insertAdjacentHTML('afterbegin', '<div id="transition">Testing</h1>')
      const elem = document.getElementById('transition')
      elem.style.transition = 'all 0.2s'
      elem.style.transformStyle = 'preserve-3d'
      el._transitionToPromise(elem, 'opacity', 1)
      setTimeout(() => {
        expect(elem.style.opacity).to.equal('1')
        done()
      }, 200)
    })

  })

})
