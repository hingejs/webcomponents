const TAG_NAME = 'h-field-validation'
if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, class extends window.HTMLElement {

    _generateTemplate() {
      this.innerHTML = '<div></div>'
    }

    _insertStyle() {
      const style = `
    <style type="text/css" id="${TAG_NAME}-style">
    ${TAG_NAME} div {
        color: var(--error, red);
        font-style: italic;
        padding: 0 0 0.2rem 0;
      }
    </style>`
      const elem = document.head || this.parentElement || this
      if (!elem.querySelector(`#${TAG_NAME}-style`)) {
        elem.insertAdjacentHTML('afterbegin', style)
      }
    }

    constructor() {
      super('')
      this._handleInvalidFieldBind = this.handleInvalidField.bind(this)
    }

    connectedCallback() {
      this._insertStyle()
      this._generateTemplate()
      this.$div = this.querySelector('div')
      this.$targetInputs = [...document.querySelectorAll(`[name="${this.dataset.fieldName}"]`)]
      if (Array.isArray(this.$targetInputs)) {
        this.$targetInputs.forEach(input => {
          input.addEventListener('invalid', this._handleInvalidFieldBind)
          input.addEventListener('change', this._handleInvalidFieldBind)
          input.addEventListener('keyup', this._handleInvalidFieldBind)
          input.addEventListener('blur', this._handleInvalidFieldBind)
        })
      }
    }

    disconnectedCallback() {
      if (Array.isArray(this.$targetInputs)) {
        this.$targetInputs.forEach(input => {
          input.removeEventListener('invalid', this._handleInvalidFieldBind)
          input.removeEventListener('change', this._handleInvalidFieldBind)
          input.removeEventListener('keyup', this._handleInvalidFieldBind)
          input.removeEventListener('blur', this._handleInvalidFieldBind)
        })
      }
    }

    handleInvalidField() {
      let isValid = this.$targetInputs.every(input => input.validity.valid)
      if (!isValid) {
        this.$div.innerText = this.$targetInputs[0].validationMessage
      } else {
        this.$div.innerText = ''
      }
    }

    resetField() {
      this.$div.innerText = ''
    }

  })
}
