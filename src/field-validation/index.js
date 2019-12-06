const TAG_NAME = 'h-field-validation'
/**
 * Used for keeping track of field errors and displaying an in-line message to the user
 * @customelement
 * @extends window.HTMLElement
 * @since 1.0.0
 * @property data-field-name {string} input field name attribute
 * @example
 *  <field-validation data-field-name="description"></field-validation>
 *  <input type="text" name="description" required="required" />
 */
class FieldValidation extends window.HTMLElement {

  constructor() {
    super('')
    this._handleInvalidFieldBind = this.handleInvalidField.bind(this)
  }

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

  /**
   * Check if error should be displayed to the user
   * @param {faker} somebody
   * @example
   * // Note that there are event listeners that do this automatically
   * // Manually doing this is not really necessary
   * const fieldValidation = document.querySelector('field-validation')
   * fieldValidation.handleInvalidField()
   */
  handleInvalidField() {
    let isValid = this.$targetInputs.every(input => input.validity.valid)
    if (!isValid) {
      this.$div.innerText = this.$targetInputs[0].validationMessage
    } else {
      this.$div.innerText = ''
    }
  }

  /**
   * remove error message shown to user
   * @example
   * // Recommend to have a better selector
   * const fieldValidation = document.querySelector('field-validation')
   * fieldValidation.resetField()
   */
  resetField() {
    this.$div.innerText = ''
  }

}


if (!window.customElements.get(TAG_NAME)) {
  window.customElements.define(TAG_NAME, FieldValidation)
}
