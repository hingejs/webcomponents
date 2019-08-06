describe('characters-remaining', () => {

  let el
  const elemTag = 'characters-remaining'
  const expect = chai.expect

  beforeEach(() => {
    el = document.createElement(elemTag)
    el.insertAdjacentHTML('afterbegin', '<input type="text" name="name"  maxlength="200" />')
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

  describe('input', () => {

    it('should include input tag', async () => {
      let input = el.querySelector('input')
      expect(input).to.not.be.undefined
    })

    it('should include a span', async () => {
      let span = el.querySelector('span')
      expect(span).to.not.be.undefined
    })

    it('should have char max in span', async () => {
      let maxLength = el.querySelector('input').maxLength
      let spanText = el.querySelector('span').innerText
      expect(spanText.includes(maxLength)).to.be.true
    })

    it('should have char max updated in span', async () => {
      const input = el.querySelector('input')
      input.value = '1234567'
      input.dispatchEvent(new Event('input'))
      let spanText = el.querySelector('span').innerText
      expect(spanText.includes('193')).to.be.true
    })

    it('should have char max updated in span be a negative', async () => {
      const input = el.querySelector('input')
      input.value = Array.from({length: 210}, () => Math.floor(Math.random() * 9)).join('')
      input.dispatchEvent(new Event('input'))
      let spanText = el.querySelector('span').innerText
      expect(spanText.includes('-10')).to.be.true
    })

  })

})
