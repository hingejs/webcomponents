'use strict'
/* eslint-env commonjs, es6 */

exports.defineTags = function (dictionary) {
  dictionary.defineTag('customelement', {
    canHaveName: false,
    canHaveType: false,
    mustHaveValue: false,
    mustNotHaveDescription: false,
    onTagged: function (doclet, tag) {
      doclet.kind = 'class'
      doclet.customelement = true
    }
  })
}

exports.handlers = {
  newDoclet: function (e) {
    const parameters = e.doclet.customelement
    if (parameters) {
      //console.log('------==========-------')
      //console.log(e)
      e.doclet.kind = 'class';
      //e.doclet.name = e.doclet.longname = e.doclet.customelements.map(a => `${a.name}`).join(', ');
      //e.doclet.description = `${e.doclet.description}<pre><code>${e.doclet.customelements.map(a => `&lt;${a.name} ${(e.doclet.properties || []).map(b => `${b.name}="[${b.type.names.join(', ')}]"`).join(' ')}&gt;`).join('\n')}&lt;/${e.doclet.name}&gt;</code></pre>`;
      //delete e.doclet.meta.code;
      if (!e.doclet.examples) {
        console.log('\x1b[33m%s\x1b[0m', 'NO EXAMPLES FOR:' + e.doclet.name);
      }
    }
  }
}

