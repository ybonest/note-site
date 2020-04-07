const path = require('path');
const util = require('util');
const fs = require('fs');
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
import hash from '@emotion/hash';

const readdir = util.promisify(fs.readdir);
const stats = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const cwd = process.cwd();
const output = path.resolve(cwd, 'app');
const basePath = path.resolve(cwd, 'sources');
const templatePath = path.resolve(cwd, 'templates');

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
      const relativeFileDir = fileDir.replace(basePath, '@sources');
      if (path.sep === '\\') {
        allSourcesMap.push({ filepath: relativeFileDir.replace(/\\/g, '/'), namehash: hash(file), name: basename}); // 适配window
      } else {
        allSourcesMap.push({ filepath: relativeFileDir, namehash: hash(file), name: basename });
      }
    }
  }
  return allSourcesMap;
}

async function execute_ejs(template: string, dirname: string, data: Record<string, any>) {
  const ejs_content = await readFile(template, 'utf8');
  const templateAfterCompile = ejs.compile(ejs_content)(data);
  const basename = path.basename(template, '.ejs');
  fs.writeFileSync(path.resolve(dirname, basename), templateAfterCompile);
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
  const docsDir = path.resolve(cwd, './docs');
  const docsFiles = await readdir(docsDir);

  for (const file of docsFiles) {
    if (file === 'CNAME') {
      continue;
    }
    rimraf.sync(path.resolve(docsDir, file));
  }
}

async function main() {
  const files = await collectMdFile();
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  const templates = await buildEjsTemplate();
  for (const template of templates) {
    const dirname = path.dirname(template).replace(templatePath, output);
    if (!fs.existsSync(dirname)) {
      mkdirp.sync(dirname);
    }
    execute_ejs(template, dirname, { sources: files })
  }
  clearDocs();
}

main();