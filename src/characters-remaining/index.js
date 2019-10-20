/**
 * @component
 * @since 1.0.0
 * @summary Input characters remaining.
 * @fileoverview Used for keeping track of the number of characters left in a textarea
 * or input before the user reaches the maximum number of characters
 * @property maxLength {number} maximum number of characters allowed
 * @example
 * // Wrap the textarea or input tag with a <char-remaining> tag
 * // maxlength is a required attribute for this component
 *  <char-remaining>
 *    <textarea id="description" name="description" required="required" maxlength="2000" placeholder="Add Package Description"></textarea>
 *  </char-remaining>
 */

const TAG_NAME = 'h-characters-remaining'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    constructor() {
      super()
      /** @type {Function} */
      this.updateCharBind = this.updateChar.bind(this)
    }

    generateTemplate() {
      const wrapperDiv = document.createElement('div')
      const el = this.firstElementChild
      this.insertAdjacentElement('afterbegin', wrapperDiv)
      wrapperDiv.appendChild(el)
      wrapperDiv.insertAdjacentHTML('beforeend', '<span></span>')
    }

    insertStyle() {
      const style = `
    <style type="text/css" id="${TAG_NAME}-style">
      ${TAG_NAME} div {
          border: 1px solid var(--field-border);
          border-radius: 2px;
          display: flex;
          justify-content: space-between;
        }

      ${TAG_NAME} span {
        align-self: center;
        color: #232323;
        font-size: 0.65rem;
        font-weight: 200;
        padding-right: 0.5rem;
        white-space: nowrap;
      }

      ${TAG_NAME} textarea + span {
        align-self: flex-end;
        padding-bottom: 0.8rem;
      }

      ${TAG_NAME} input,
      ${TAG_NAME} textarea {
        border: 0;
        font-size: 0.9rem;
        outline: 0;
        padding: 0.8rem;
        width: 100%;
      }

      ${TAG_NAME} textarea {
        height: 6.8rem;
        resize: none;
      }
    </style>`
      const elem = document.head || this.parentElement || this
      if (!elem.querySelector(`#${TAG_NAME}-style`)) {
        elem.insertAdjacentHTML('afterbegin', style)
      }
    }

    connectedCallback() {
      this.insertStyle()
      this.generateTemplate()
      this.$userInput = this.querySelector('textarea') || this.querySelector('input')
      this.$span = this.querySelector('span')
      this.dataset.caption = this.getAttribute('data-caption')
      if (this.$userInput && this.$userInput.maxLength > 0) {
        this.dataset.caption = this.dataset.caption || 'chars max'
        this.updateChar()
        this.$userInput.addEventListener('input', this.updateCharBind)
      }
    }

    disconnectedCallback() {
      if (this.$userInput) {
        this.$userInput.removeEventListener('input', this.updateCharBind)
      }
    }

    static get observedAttributes() {
      return ['data-caption']
    }

    attributeChangedCallback(attr, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.updateChar()
      }
    }

    /**
     * Updates the character counter
     * @memberof char-remaining
     */
    updateChar() {
      if (this.$userInput) {
        const maxLen = this.$userInput.maxLength
        this.$span.textContent = `${maxLen - this.$userInput.value.length} ${this.dataset.caption}`
      }
    }

  })
}
