describe('modal-popup', () => {

  let el
  let elSupport
  const elemTag = 'h-modal-popup'
  const elemTagSupport = 'h-modal-blur'
  const expect = chai.expect

  beforeEach(() => {
    elSupport = document.createElement(elemTagSupport)
    elSupport.insertAdjacentHTML('afterbegin', '<h1>Testing</h1>')
    document.body.appendChild(elSupport)

    el = document.createElement(elemTag)
    el.insertAdjacentHTML('afterbegin', '<h1>Testing</h1>')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
    document.body.removeChild(elSupport)
    el = null
    elSupport = null
  })

  describe('interface', () => {

    it('should be defined', async () => {
      const elem = el
      expect(elem).to.not.be.undefined
      expect(window.customElements.get(elemTag)).to.not.be.undefined
    })

    it('should be an Element node ', async () => {
      const elem = el
      expect(elem.nodeType).to.equal(Node.ELEMENT_NODE)
    })

  })

  describe('component', () => {

    it('should include a slot for html', async () => {
      const component = el
      const h1 = component.shadowRoot.querySelector('h1')
      expect(h1).to.not.be.undefined
    })

    it('should open when data-show is true', async () => {
      const component = el
      component.dataset.show ='true'
      const isActive = component.$modal.classList.contains('is-active')
      expect(isActive).to.be.true
    })

    it('should return true when modal isOpen()', async () => {
      const component = el
      component.dataset.show ='true'
      const isOpen = component.isOpen()
      expect(isOpen).to.be.true
    })

    it('right modal should open when data-show is true and data-position is right', async () => {
      const component = el
      component.dataset.show ='true'
      component.dataset.position = 'right'
      const isActive = component.$modal.classList.contains('is-active')
      const hasSideClass = component.$modal.classList.contains('side')
      const hasRightClass = component.$modal.classList.contains('right')
      expect(isActive).to.be.true
      expect(hasSideClass).to.be.true
      expect(hasRightClass).to.be.true
    })

    it('left modal should open when data-show is true and data-position is left', async () => {
      const component = el
      component.dataset.show ='true'
      component.dataset.position = 'left'
      const isActive = component.$modal.classList.contains('is-active')
      const hasSideClass = component.$modal.classList.contains('side')
      const hasLeftClass = component.$modal.classList.contains('left')
      expect(isActive).to.be.true
      expect(hasSideClass).to.be.true
      expect(hasLeftClass).to.be.true
    })

    it('left modal should remove bg-is-active if allowScreenClick = true', async () => {
      const component = el
      component.dataset.show ='true'
      component.dataset.position = 'left'
      component.dataset.allowScreenClick = 'true'
      const fullModal = component.$modal.classList.contains('bg-is-active')
      expect(fullModal).to.be.false
    })

    it('should close when data-show is false', async () => {
      const component = el
      component.dataset.show ='false'
      const isActive = component.$modal.classList.contains('is-active')
      expect(isActive).to.be.false
    })

    it('should close when x icon is clicked', async () => {
      const component = el
      component.dataset.show ='true'
      component.$btnClose.dispatchEvent(new Event('click'))
      const isActive = component.$modal.classList.contains('is-active')
      expect(isActive).to.be.false
    })

    it('should close when background is clicked', async () => {
      const component = el
      component.dataset.show = 'true'
      component.$modalBG.dispatchEvent(new Event('click'))
      const isActive = component.$modal.classList.contains('is-active')
      expect(isActive).to.be.false
    })

    it('should not allow x icon to close when not allowed to close', async () => {
      const component = el
      component.dataset.show ='true'
      component.dataset.allowClose ='false'
      component.$btnClose.dispatchEvent(new Event('click'))
      const isActive = component.$modal.classList.contains('is-active')
      expect(isActive).to.be.true
    })

    it('should not allow background to close when not allowed to close', async () => {
      const component = el
      component.dataset.show ='true'
      component.dataset.allowClose ='false'
      component.$modalBG.dispatchEvent(new Event('click'))
      const isActive = component.$modal.classList.contains('is-active')
      expect(isActive).to.be.true
    })

    it('should remove x icon when not allowed to close', async () => {
      const component = el
      component.dataset.show ='true'
      component.dataset.allowClose ='false'
      component.$btnClose.dispatchEvent(new Event('click'))
      const isHidden = component.$btnClose.classList.contains('hide-content')
      expect(isHidden).to.be.true
    })

    it('should open modal-blur when opened', async () => {
      const component = el
      component.dataset.show ='true'
      expect(component.$modalBlur.dataset.blur === 'true').to.be.true
    })

  })

})
