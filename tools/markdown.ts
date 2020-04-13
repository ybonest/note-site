const commander = require('commander');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { args } = commander
  .parse(process.argv);
const cwd = process.cwd();

const filePath = args[0];

if (!filePath) {
  throw 'miss file path';
}

const separator =  os.type() === 'Windows_NT' ? '\\' : '/';
const catalogue = filePath.split(separator);
const markdown_dir = path.resolve(cwd, filePath);

if (fs.existsSync(markdown_dir)) {
  throw `${filePath} already exists`;
}

let source_path = cwd;

function getDate() {
  const date = new Date();
  const years = date.getFullYear();
  const day = date.getDate();
  let month = date.getMonth() + 1;
  return `${years}-${month < 10 ? `0${month}` : month}-${day}`;
}

const contents = [
  '---',
  `title: ${path.basename(markdown_dir, '.md')}`,
  'description: ',
  'tag: ',
  'group: ',
  `date: ${getDate()}`,
  '---'
]

for (let i = 0; i < catalogue.length; i++) {
  source_path = path.resolve(source_path, catalogue[i]);

  if (catalogue.length - 1 === i) {
    source_path = source_path.endsWith('.md') ? source_path : `${source_path}.md`;
    fs.writeFileSync(source_path, contents.join('\n'));
    break;
  }
  if (fs.existsSync(source_path)) {
    continue;
  }
  fs.mkdirSync(source_path);
}

