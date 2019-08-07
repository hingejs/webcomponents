describe('touch-swipe', () => {

  let el
  const elemTag = 'touch-swipe'
  const expect = chai.expect

  beforeEach(() => {
    el = document.createElement(elemTag)
    el.insertAdjacentHTML('afterbegin', '<p>Swipe me</p>')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.removeChild(el)
    el = null
  })

  function getTouchEvent(x, y, element, eventType) {
    const touchObj = new Touch({
      clientX: x,
      clientY: y,
      force: 0.5,
      identifier: Date.now(),
      radiusX: 2.5,
      radiusY: 2.5,
      rotationAngle: 10,
      target: element,
    })

    return new TouchEvent(eventType, {
      bubbles: true,
      cancelable: true,
      changedTouches: [touchObj],
      shiftKey: true,
      targetTouches: [],
      touches: [touchObj],
    })
  }

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

    it('should support find first child element', async () => {
      const component = document.querySelector(elemTag)
      const childElement = component.querySelector('p')
      expect(component.$slotElement).to.equal(childElement)

    })

    it('should support tap for child element', async (done) => {
      const component = document.querySelector(elemTag)
      const childElement = component.querySelector('p')
      childElement.addEventListener('touch-swipe', evt => {
        expect(evt.detail).to.equal('tap')
        done()
      })
      component._dispatch()
    })

    it('should detect swipe name', async () => {
      const component = document.querySelector(elemTag)
      const eventName = component._getEventName()
      expect(eventName).to.equal('tap')
    })

    it('should detect the swipe event right', async () => {
      const component = document.querySelector(elemTag)
      const childElement = component.querySelector('p')
      const eventStart = getTouchEvent(150, 150, childElement, 'touchstart')
      const eventEnd = getTouchEvent(350, 150, childElement, 'touchend')
      component._onStart(eventStart)
      component._onEnd(eventEnd)
      const eventName = component._getEventName()
      expect(eventName).to.equal('right')
    })

    it('should detect the swipe event right', async () => {
      const component = document.querySelector(elemTag)
      const childElement = component.querySelector('p')
      const eventStart = getTouchEvent(150, 150, childElement, 'touchstart')
      const eventEnd = getTouchEvent(50, 150, childElement, 'touchend')
      component._onStart(eventStart)
      component._onEnd(eventEnd)
      const eventName = component._getEventName()
      expect(eventName).to.equal('left')
    })

    it('should detect the swipe event up', async () => {
      const component = document.querySelector(elemTag)
      const childElement = component.querySelector('p')
      const eventStart = getTouchEvent(150, 150, childElement, 'touchstart')
      const eventEnd = getTouchEvent(150, 50, childElement, 'touchend')
      component._onStart(eventStart)
      component._onEnd(eventEnd)
      const eventName = component._getEventName()
      expect(eventName).to.equal('up')
    })

    it('should detect the swipe event up', async () => {
      const component = document.querySelector(elemTag)
      const childElement = component.querySelector('p')
      const eventStart = getTouchEvent(150, 50, childElement, 'touchstart')
      const eventEnd = getTouchEvent(150, 150, childElement, 'touchend')
      component._onStart(eventStart)
      component._onEnd(eventEnd)
      const eventName = component._getEventName()
      expect(eventName).to.equal('down')
    })

  })

})
