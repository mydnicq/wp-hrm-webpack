const { THEME_NAME } = require('../env.config');
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

  const rl = readline.createInterface({
    input: await fsp.createReadStream('./style.css')
  });

  let modifiedData = '';

  rl.on('line', (line) => {
    let regExp = /\main.css/;
    // This prevents including main.css file in developemnt mode
    // because in this mode css is inlined via webpack hot module replacement.
    if ((regExp.exec(line)) !== null && ENV == 'development') return;

    if ((regExp.exec(line)) !== null && ENV == 'production') {
      modifiedData += `${mainCssFile}\n`;
    } else {
      let regExp = /\Theme Name:/;
      if ((regExp.exec(line)) !== null && ENV == 'development') {
        modifiedData += `Theme Name: ${THEME_NAME}-DEV\n`;
      } else if ((regExp.exec(line)) !== null && ENV == 'production') {
        modifiedData += `Theme Name: ${THEME_NAME}\n`;
      } else {
        modifiedData += `${line}\n`;
      }
    }
  });

  rl.on('close', async() => {
    if (modifiedData.indexOf('compiled/main.css') == -1 && ENV == 'production') {
      modifiedData += `${mainCssFile}\n`;
    }
    if (ENV == 'production') await fsp.copy('./style.css', './style.tmp');
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
