window.customElements.define('json-syntax', class extends HTMLElement {

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(this._generateTemplate().content.cloneNode(true))
    this.$pre = this.shadowRoot.querySelector('pre')
  }

  _generateTemplate() {
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        pre { overflow: auto; font-weight: bold; }
        .string { color: #de5b4c; }
        .number { color: darkorange; }
        .boolean { color: #6071f6	; }
        .null { color: magenta; }
        .key { color: #8e3693; }
      </style>
      <pre></pre>
    `
    return template
  }

  render(source) {
    this.$pre.innerHTML = this._syntaxHighlight(source)
  }

  /*
    1st Capturing Group = "(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?
      Gets unicode values with optional colon
    " matches the character " literally (case sensitive)
    2nd Capturing Group = \b(true|false|null)\b
      word boundary for boolean or null value
    3th Capturing Group = -?\d+(?:\.\d*)?(?:[eE][+]?\d+)?
      all numeric type values
  */
  _syntaxHighlight(source) {
    let json = this._formatJSON(source)
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return `<span class="${cls}">${match}</span>`
    })
  }

  _formatJSON(obj) {
    return JSON.stringify(obj, undefined, 2)
  }

})

