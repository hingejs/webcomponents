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
        pre {outline: 1px solid #ccc; padding: 5px; }
        .string { color: green; }
        .number { color: darkorange; }
        .boolean { color: blue; }
        .null { color: magenta; }
        .key { color: red; }
      </style>
      <pre></pre>
    `
    return template
  }

  render(source) {
    this.$pre.innerHTML = this._syntaxHighlight(source)
  }

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

