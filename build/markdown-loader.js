const marked = require('marked');
const loaderUtils = require("loader-utils");
const hljs = require('highlight.js');

const highlight = function(code, lang = 'js') {
  return hljs.highlight(lang, code).value;
}

const tempate = (content, className) => `<div class="${className}">${content}</div>`;

const renderer = new class Renderer extends marked.Renderer {
  paragraph(text) {
    if (text.indexOf('title') !== -1 && text.indexOf('description') !== -1) {
      const details = text.split('\n').reduce((collect, item) => {
        const [key, content] = item.split(':');
        let html = '';
        if (key === 'image') {
          html = `<img src="${content.trim().replace('@static', '/static')}"></img>\n`;
        } else {
          html = '<p>' + content.trim() + '</p>\n';
        }
        collect[key] = html;
        return collect;
      }, {});
      let collectHtml = '';
      if (details.image) collectHtml += details.image;
      if (details.title) collectHtml += details.title;
      if (details.description) collectHtml += details.description;
      return collectHtml; 
    }
    return '<p>' + text + '</p>\n';
  }
};

class MarkedParse {
  constructor(markdown, option) {
    this.markdown = markdown;
    this.option = option;
  }
  get markedLexer() {
    return marked.lexer(this.markdown, this.option);
  }

  get markedAst() {
    const header = [];
    const body = [];
    const hrStack = [];
    header.links = Object.create(null);
    body.links = Object.create(null);

    this.markedLexer.forEach(item => {
      if (hrStack.length <= 1) {
        if (item.type === 'hr') {
          hrStack.push(item);
        } else {
          header.push(item);
        }
      } else {
        body.push(item);
      }
    })
    return { header, body };
  }

  get html() {
    const options = { 
      renderer, 
      highlight,
      langPrefix:'hljs ',
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    };
    const header = tempate(
      marked.parser(this.markedAst.header, options),
      'note-title'
    );
    const body = tempate(
      marked.parser(this.markedAst.body, options),
      'note-content'
    );
    return `${header}${body}`;
  }
}

module.exports = function(markdown) {
  return new MarkedParse(markdown, loaderUtils.getOptions(this)).html;
}
