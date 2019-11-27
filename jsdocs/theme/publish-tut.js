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


  data().limit(1).each( (doclet) => {
    const url = helper.longnameToUrl[doclet.longname];
    console.log(url)

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
    }*/
  });

  console.log('=======----tutorials')
  //console.log(tutorials)

  let finalJSON = {}


  tutorials.children.forEach(async (child) => {
    //generateTutorial(child.title, 'Tutorial', child, helper.tutorialToUrl(child.name));
    //saveChildren(child);
    //child.parse()
    //console.log(dom)

    //const el = _fragmentFromString(child.parse())



    let result = md.parse(child.content, { references: {} })

    let htmlResult = mRenderer.render(result, { key: child.name })

    //console.log(result)

    //await writeFileProms('token.json', JSON.stringify(result, null, 2))

    finalJSON = Object.assign({}, finalJSON, htmlResult.json)
    html = html.concat(`HtmlCache.set('tutorials/${child.name}.html', '<template>${escapeHTMLContent(htmlResult.html)}</template>')`)
    routeJSCode = routeJSCode.concat(newRouteCode(`tutorials/${child.name}`))
    routeHTMLCode.push(`<h-route-link data-route="tutorials/${child.name}">${child.title}</h-route-link>`)
  })

  writeFileProms('en.json', JSON.stringify(finalJSON, null, 2))
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

  data().limit(1).each((doclet) => {
    // console.log('-----======FINAL DOC=====-------')
    // console.log(doclet)
    //writeFileProms('doclet.json', JSON.stringify(doclet, null, 2))
  })



  //console.log('opts')
  //console.log(opts)
  //console.log('tutorials')
  //console.log(tutorials)
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
