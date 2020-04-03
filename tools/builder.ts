const path = require('path');
const util = require('util');
const fs = require('fs');
const ejs = require('ejs');

const readdir = util.promisify(fs.readdir);
const stats = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const cwd = process.cwd();
const output = path.resolve(cwd, 'app');
const basePath = path.resolve(cwd, 'sources');

async function collectMdFile(dir = './sources') {
  let allSourcesMap = [];
  const sourceDir = path.resolve(cwd, dir);
  const files = await readdir(sourceDir);

  for (const file of files) {
    const fileDir = path.resolve(sourceDir, file);
    const fileStats = await stats(fileDir);
    if (fileStats.isDirectory()) {
      const fileList = await collectMdFile(fileDir);
      allSourcesMap = allSourcesMap.concat(fileList);
    } else {
      const relativeFileDir = fileDir.replace(basePath, '@sources');
      if (path.sep === '\\') {
        allSourcesMap.push(relativeFileDir.replace(/\\/g, '/')); // 适配window
      } else {
        allSourcesMap.push(relativeFileDir);
      }
    }
  }
  return allSourcesMap;
}

async function execute_ejs(file: string, data: Record<string, any>) {
  const ejs_content = await readFile(file, 'utf8');
  return ejs.compile(ejs_content)(data);
}

async function main() {
  const files = await collectMdFile();
  const content = await execute_ejs(path.resolve(cwd, 'templates/list.tsx.ejs'), { sources: files });
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  fs.writeFileSync(path.resolve(output, 'list.tsx'), content);
}

main();