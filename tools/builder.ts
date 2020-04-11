import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as rimraf from 'rimraf';
import * as marked from 'marked';
import * as prettier from 'prettier';
import mkdirp from 'mkdirp';
import hash from '@emotion/hash';

const readdir = util.promisify(fs.readdir);
const stats = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const cwd = process.cwd();
const output = path.resolve(cwd, 'app');
const basePath = path.resolve(cwd, 'sources');
const templatePath = path.resolve(cwd, 'templates');
const devMode = String.prototype.trim.call(process.env.NODE_ENV || '') === 'development';

interface Collect {
  title?: string;
  description?: string;
  image?: any;
  tag?: string;
  date?: string;
}

const categoryByTag = {};

function parser(content: string) {
  const markedAst = marked.lexer(content);
  const hrStack = [];
  const collect: Collect = {};

  for (const item of markedAst) {
    if (hrStack.length > 1) {
      break;
    }
    if (item.type === 'hr') {
      hrStack.push(item);
    } else {
      item.text.split('\n').forEach((item: string) => {
        const [key, content] = item.split(':').map(value => value.trim());
        if (key === 'image') {
          collect[key] = {
            path: content,
            name: path.basename(content.split('/').pop(), content.split('.').pop()) 
          }
        } else {
          collect[key] = content;
        }
      });
    }
  }
  if (!collect.image) collect.image = {};
  return collect;
}

async function collectMdFile(dir = './sources') {
  let allSourcesMap = [];
  const sourceDir = path.resolve(cwd, dir);
  const files = await readdir(sourceDir);

  for (const file of files) {
    const basename = path.basename(file, '.md');
    const fileDir = path.resolve(sourceDir, file);
    const fileStats = await stats(fileDir);
    if (fileStats.isDirectory()) {
      const fileList = await collectMdFile(fileDir);
      allSourcesMap = allSourcesMap.concat(fileList);
    } else {
      const headers = parser(fs.readFileSync(fileDir, 'utf8'))
      const relativeFileDir = fileDir.replace(basePath, '@sources');
      const source = {
        filepath: relativeFileDir,
        namehash: hash(file),
        name: basename,
        headers
      }
      if (path.sep === '\\') {
        source.filepath = relativeFileDir.replace(/\\/g, '/'); // 适配window
      }
      if (!headers.tag) {
        throw `tag missed in file ${file}`;
      }
      categoryByTag[headers.tag] = (categoryByTag[headers.tag] || []).concat([source]);
      allSourcesMap.push(source);
    }
  }
  return allSourcesMap;
}

async function execute_ejs(template: string, dirname: string, data: Record<string, any>) {
  const ejs_content = await readFile(template, 'utf8');
  const templateAfterCompile = ejs.compile(ejs_content)(data);
  const basename = path.basename(template, '.ejs');
  fs.writeFileSync(path.resolve(dirname, basename), prettier.format(templateAfterCompile, { semi: true, parser: "babel" }));
}

async function buildEjsTemplate(source = './templates') {
  const baseDIR = path.resolve(cwd, source);
  const templates = await readdir(baseDIR);
  let collectTemplates = [];

  for (const template of templates) {
    const templateDIR = path.resolve(baseDIR, template);
    const templateStat = await stats(templateDIR);
    if (templateStat.isDirectory()) {
      collectTemplates = collectTemplates.concat(await buildEjsTemplate(templateDIR));
    } else {
      collectTemplates.push(templateDIR);
    }
  }
  return collectTemplates;
}

async function clearDocs() {
  if (devMode) {
    return;
  }
  const docsDir = path.resolve(cwd, './docs');
  const docsFiles = await readdir(docsDir);

  for (const file of docsFiles) {
    if (file === 'CNAME') {
      continue;
    }
    rimraf.sync(path.resolve(docsDir, file));
  }
}

function compareDate(file1, file2) {
  let date1 = file1.headers.date;
  let date2 = file2.headers.date;
  if (!date1 || !date2) {
    return -1;
  }
  date1 = new Date(date1);
  date2 = new Date(date2);
  return date2 - date1;
}

async function main() {
  const files = await collectMdFile();
  const sortFiles = files.sort(compareDate);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  const templates = await buildEjsTemplate();
  for (const template of templates) {
    const dirname = path.dirname(template).replace(templatePath, output);
    if (!fs.existsSync(dirname)) {
      mkdirp.sync(dirname);
    }
    execute_ejs(template, dirname, { sources: sortFiles, categoryByTag })
  }
  clearDocs();
}

main();