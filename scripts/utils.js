const fsp = require('fs-promise');
const readline = require('readline');
const fileHound = require('filehound');

module.exports = {
  addMainCss,
  getEnv,
  getFilesByExtension,
  getScreenshot
}

async function addMainCss() {
  const ENV = getEnv();
  const mainCssFile = `@import "compiled/main.css?v=${new Date().getTime()}";`
  const readStream = fsp.createReadStream('./style.css');

  const rl = readline.createInterface({
    input: readStream
  });

  let modifiedData = '';

  rl.on('line', (input) => {
    let regExp = /\main.css/;
    if ((regExp.exec(input)) !== null && ENV == 'development') return;

    if ((regExp.exec(input)) !== null && ENV == 'production') {
      modifiedData += `${mainCssFile}\n`;
      return;
    } else {
      modifiedData += `${input}\n`;
    }
  });

  rl.on('close', async() => {
    if (modifiedData.indexOf('compiled/main.css') == -1 && ENV == 'production') {
      modifiedData += `${mainCssFile}\n`;
    }
    await fsp.writeFile('./style.css', modifiedData, 'utf8');
  });
}

function getEnv() {
  const target = process.env.npm_lifecycle_event;

  switch (target) {
    case 'start':
      return 'development';

    case 'build':
      return 'production';

    default:
      return 'development';
  }
}

function getFilesByExtension(path, ext) {
  return fileHound.create()
    .paths(path)
    .discard("node_modules")
    .discard("build")
    .ext(ext)
    .depth(1)
    .find();
}

function getScreenshot(path) {
  return fileHound.create()
    .paths(path)
    .depth(0)
    .glob('screenshot.png')
    .find()
}
