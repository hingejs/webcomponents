describe('tool-tip', () => {

  let el
  const elemTag = 'tool-tip'
  const expect = chai.expect

  beforeEach(() => {
    document.body.insertAdjacentHTML('afterbegin', '<p id="test">Testing</p>')
    el = document.createElement(elemTag)
    el.insertAdjacentHTML('afterbegin', 'Tip Text')
    el.dataset.for = 'test'
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.getElementById('test').remove()
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

    it('should show tip when element event is mouseover', async () => {
      const component = document.querySelector(elemTag)
      const target = document.getElementById('test')
      const event = new UIEvent('mouseover')
      target.dispatchEvent(event)
      const isActive = component.$tip.classList.contains('active')
      expect(isActive).to.be.true
    })

    it('should remove tip when element event is mouseout', async () => {
      const component = document.querySelector(elemTag)
      const target = document.getElementById('test')
      let event = new UIEvent('mouseover')
      target.dispatchEvent(event)
      event = new UIEvent('mouseout')
      target.dispatchEvent(event)
      const isActive = component.$tip.classList.contains('active')
      expect(isActive).to.be.false
    })

    it('should be able to change position', async () => {
      const component = document.querySelector(elemTag)
      const componentStyle = window.getComputedStyle(component.$tip)
      const firstPosition = componentStyle.getPropertyValue('left')
      component.dataset.position = 'left'
      const secondPosition = componentStyle.getPropertyValue('left')
      expect(firstPosition).to.not.equal(secondPosition)
    })

  })

})

