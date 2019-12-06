const helper = require('jsdoc/util/templateHelper')

const md = require('markdown-it')()
const Renderer = require('./render')
const mRenderer = new Renderer()

const { writeFile } = require('fs')
const { promisify } = require('util')
const writeFileProms = promisify(writeFile)


let html = [
  'const HtmlCache = new Map()',
  'HtmlCache.set("index.html", "<template><h1>Home</h1></template>")'
]
let routeJSCode = []

let routeHTMLCode = []

let finalJSON = {
  "global-since": "Since",
  "global-kind-class": "class",
  "global-kind-function": "function",
  "global-kind-member": "member",
  "global-kind-constant": "constant",
  "global-kind-typedef": "typedef",
  "global-kind-unknown": "unknown",
  "global-properties-type-number": "number",
  "global-properties-type-string": "string",
  "global-properties-type-unknown": "unknown",

}



/** @module publish */

/**
 * Generate documentation output.
 *
 * @param {TAFFY} data - A TaffyDB collection representing
 *                       all the symbols documented in your code.
 * @param {object} opts - An object with options information.
 * @param {Tutorial} tutorials
 */
exports.publish = function (data, opts, tutorials) {
  // do stuff here to generate your output files
  data = helper.prune(data)


  const members = helper.getMembers(data)

  members.classes.forEach(doclet => {
    const url = helper.createLink(doclet)
    let newHTML = ''
    helper.registerLink(doclet.longname, url)

    if (Array.isArray(doclet.examples)) {
      doclet.examples = doclet.examples.map(modelExample)
    }
    const results = render(doclet)
    newHTML += results.html
    const ancestors = helper.find(data, {memberof: doclet.longname})

    ancestors.forEach(subDoclet => {
      const result = renderAncestors(subDoclet)
      newHTML += result.html
      finalJSON = Object.assign({}, finalJSON, result.json)
    })

    finalJSON = Object.assign({}, finalJSON, results.json)
    html = html.concat(`HtmlCache.set('${doclet.longname}.html', '<template>${escapeHTMLContent(newHTML)}</template>')`)
    routeJSCode = routeJSCode.concat(newRouteCode(doclet.longname))
    routeHTMLCode.push(`<h-route-link data-route="${doclet.longname}">${doclet.longname}</h-route-link>`)


  })
/*
  data().each((doclet) => {
    const url = helper.createLink(doclet)
    helper.registerLink(doclet.longname, url)
    // helper.longnameToUrl[doclet.longname]
    //console.log(url)

    if (Array.isArray(doclet.examples)) {
      doclet.examples = doclet.examples.map(modelExample)
    }

    const results = render(doclet)

    const ancestors = helper.find(data, {memberof: doclet.longname})

    finalJSON = Object.assign({}, finalJSON, results.json)
    html = html.concat(`HtmlCache.set('${doclet.longname}.html', '<template>${escapeHTMLContent(results.html)}</template>')`)

    routeJSCode = routeJSCode.concat(newRouteCode(doclet.longname))
    routeHTMLCode.push(`<h-route-link data-route="${doclet.longname}">${doclet.longname}</h-route-link>`)

    //TODO : SEE should link to something else
    /*
    if (doclet.see) {
          doclet.see.forEach(function(seeItem, i) {
              doclet.see[i] = hashToLink(doclet, seeItem)
          })
      }
    */


    /*if (url.indexOf('#') > -1) {
      doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
    }
    else {
      doclet.id = doclet.name;
    }*/

    /* if (needsSignature(doclet)) {
       addSignatureParams(doclet);
       addSignatureReturns(doclet);
       addAttribs(doclet);
     }
  })*/

let doclets = []
  /*data().each((doclet) => {
     //console.log('-----======FINAL DOC=====-------')
    // console.log(doclet)
     doclets.push(doclet)

  })*/

  members.classes.forEach(doclet => {
    const ancestors = helper.find(data, {memberof: doclet.longname})
    doclets.push(ancestors)
  })

  writeFileProms('doclet.json', JSON.stringify(doclets, null, 2))


  writeFileProms('en.json', JSON.stringify(finalJSON, null, 2))
  writeFileProms('es.json', JSON.stringify(finalJSON, null, 2))
  html.push('export default HtmlCache\n')
  writeFileProms('html-cache.js', html.join('\n'))
  //writeFileProms('routes.js', routeHTMLCode.join('\n'))
  writeFileProms('index.html', `
  <html>
  <head>
  <style>
    h-route-link {
      border: 1px solid blue;
      cursor: pointer;
      padding: 1rem;
    }
    h-route-link:hover {
      background-color: blue;
      color: white;
    }
  </style>
  </head>
    <body>
    <p><button class="en">English</button>
    <button class="es">Spanish</button>
    </p>
    <h-route-link data-route="/">Home</h-route-link>
    ${routeHTMLCode.join('\n')}
    <h-route-display></h-route-display>
    <script type="module">
    import HtmlCache from './html-cache.js'
    import 'https://cdn.jsdelivr.net/npm/@hingejs/webcomponents@latest/index.min.js'
    import { I18n, Router } from 'https://cdn.jsdelivr.net/npm/@hingejs/services/index.min.js'
    I18n.loadPath = './\${lang}.json'
    I18n.enableDocumentObserver()

    document.querySelector('button.en').addEventListener('click', () => {
      I18n.setLocale('en')
    })

    document.querySelector('button.es').addEventListener('click', () => {
      I18n.setLocale('es')
    })

    Router.defaultPath('/', async (req, next) => {
      const routeDisplay = document.querySelector('h-route-display')
      await routeDisplay.insertContent(HtmlCache.get('index.html'))
      next()
    })
    ${routeJSCode.join('\n')}
    </script>
    </body></html>
  `)



}

function render(doclet) {
  let keys = {}
  let i18nKeys = {
    'classdesc': '',
    'kind': '',
    'since': 'global-since'
  }

  if (doclet.kind && finalJSON.hasOwnProperty(`global-kind-${doclet.kind}`)) {
    i18nKeys['kind'] = `global-kind-${doclet.kind}`
  } else if (doclet.kind && doclet.kind.trim().length) {
    keys[`global-kind-custom-${doclet.kind}`] = doclet.kind
    i18nKeys['kind'] = `global-kind-custom-${doclet.kind}`
  } else {
    i18nKeys['kind'] = 'global-kind-unknown'
  }

  if (doclet.classdesc) {
    i18nKeys['classdesc'] = `${doclet.name}-classdesc`
    keys[`${doclet.name}-classdesc`] = removeHTML(doclet.classdesc)
  }


  if (doclet.properties) {

  }

  let html = `
    <header class="page-header">
      <div class="symbol-detail-labels">
        <span data-i18n="${i18nKeys.kind}" class="label label-kind"></span>
      </div>
      <h1><span class="symbol-name">${doclet.name}</span></h1>
      <div class="symbol-classdesc">
        <span data-i18n="${i18nKeys.classdesc}"></span>
      </div>
    </header>
  `


  return { html, json: keys }
}

function removeHTML(input) {
  const re = /(<([^>]+)>)/gmi
  return input.replace(re, '')
}


function modelExample(example) {
  let caption
  let code

  if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
    caption = RegExp.$1;
    code = RegExp.$3;
  }

  return {
    caption: caption || '',
    code: code || example
  }
}


function newRouteCode(page) {
  return `Router.setPath('${page}', async (req, next) => {
    const routeDisplay = document.querySelector('h-route-display')
    await routeDisplay.insertContent(HtmlCache.get('${page}.html'))
    next()
  })`
}


function safeHTML(input = '') {
  return String(input)
    .replace(/&(?=[^amp;|lt;|gt;|quot;|#])/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
}


function escapeHTMLContent(html) {
  return html.split('\n').join('').split('\r').join('').trim().replace(/'/gi, '\\\'').replace(/(\\\d)/ig, '\\\$1')
}


function renderAncestors(doclet) {
  let keys = {}
  let i18nKeys = {
    'description': '',
    'kind': '',
    'since': 'global-since'
  }

  if (doclet.kind && finalJSON.hasOwnProperty(`global-kind-${doclet.kind}`)) {
    i18nKeys['kind'] = `global-kind-${doclet.kind}`
  } else if (doclet.kind && doclet.kind.trim().length) {
    keys[`global-kind-custom-${doclet.kind}`] = doclet.kind
    i18nKeys['kind'] = `global-kind-custom-${doclet.kind}`
  } else {
    i18nKeys['kind'] = 'global-kind-unknown'
  }

  if (doclet.description) {
    i18nKeys['description'] = `${doclet.name}-description`
    keys[`${doclet.name}-description`] = removeHTML(doclet.description)
  }


  if (doclet.properties) {

  }

  let html = `
    <article class="page-header">
      <div class="symbol-detail-labels">
        <span data-i18n="${i18nKeys.kind}" class="label label-kind"></span>
      </div>
      <h1><span class="symbol-name">${doclet.name}</span></h1>
      <div class="symbol-classdesc">
        <span data-i18n="${i18nKeys.description}"></span>
      </div>
    </article>
  `


  return { html, json: keys }
}
