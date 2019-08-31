describe('route-link', () => {

  let el
  const elemTag = 'h-route-link'
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

    it('should be an Element node', async () => {
      const elem = document.querySelector(elemTag)
      expect(elem.nodeType).to.equal(Node.ELEMENT_NODE)
    })

  })

  describe('component', () => {

    it('should change the history API when clicked', async (done) => {
      const component = document.querySelector(elemTag)
      component.dataset.title = 'test'
      component.dataset.route = '/test'
      const urlChangeBind = urlChange.bind(this)
      window.addEventListener('url-change', urlChangeBind)
      component.dispatchEvent(new Event('click'))
      function urlChange(evt) {
        expect(evt.detail).to.equal('test')
        expect(window.location.href.includes(evt.detail)).to.be.true
        window.removeEventListener('url-change', urlChangeBind)
        done()
      }
    })

    it('should change the page title when clicked', async () => {
      const component = document.querySelector(elemTag)
      component.dataset.title = 'test'
      component.dataset.route = '/test'
      component.dispatchEvent(new Event('click'))
      expect(document.title).to.equal('test')
    })

    it('should try to go back from sessionStorage key', async (done) => {
      const component = document.querySelector(elemTag)
      window.sessionStorage.setItem('last-route-path', '/back')
      component.dataset.title = 'forward'
      component.dataset.route = '/forward'
      component.dataset.back = true
      const urlChangeBind = urlChange.bind(this)
      window.addEventListener('url-change', urlChangeBind)
      component.dispatchEvent(new Event('click'))
      function urlChange(evt) {
        expect(evt.detail).to.equal('back')
        expect(window.location.href.includes(evt.detail)).to.be.true
        window.removeEventListener('url-change', urlChangeBind)
        done()
      }
    })

    it('should try to go back from history api', (done) => {
      const component = document.querySelector(elemTag)
      component.dataset.title = 'forward'
      component.dataset.route = '/forward'
      component.dispatchEvent(new Event('click'))
      component.dataset.title = 'back'
      component.dataset.route = '/back'
      component.dispatchEvent(new Event('click'))
      window.sessionStorage.clear()
      component.dataset.back = true
      window.addEventListener('popstate', urlChange)
      component.dispatchEvent(new Event('click'))
      function urlChange() {
        expect(window.location.href.includes('forward')).to.be.true
        window.removeEventListener('popstate', urlChange)
        done()
      }
    })

    it('should set a class name of "active" when clicked', async () => {
      const component = document.querySelector(elemTag)
      component.dataset.title = 'test'
      component.dataset.route = '/'
      component.dispatchEvent(new Event('click'))
      expect(component.classList.contains('active')).to.be.true
    })

  })

})
