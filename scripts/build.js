const path = require('path');
const { PATHS } = require('../env.config');
const utils = require('./utils');
const webpack = require('webpack');
const fsp = require('fs-promise');
const webpackConfig = require('../webpack.config');

const bundler = webpack(webpackConfig);

(async() => {
  try {
    await utils.addMainCss();
    await webpackBuild();
    await finalize();
    console.log('Done!');
  } catch (e) {
    console.log(e.toString());
  }
})()

async function webpackBuild() {
  console.log('Running webpack build.');
  await fsp.remove(PATHS.compiled());
  return new Promise((resolve, reject) => {
    bundler.run((err, stats) => (err ? reject(err) : resolve(stats)));
  });
}

async function finalize() {
  console.log('Finalizing.');
  const buildDir = PATHS.base('build');

  await fsp.remove(buildDir);
  await fsp.ensureDir(path.join(buildDir, 'compiled'));
  await fsp.copy(PATHS.compiled(), path.join(buildDir, 'compiled'))

  let phpFiles = await utils.getFilesByExtension(PATHS.base(), 'php');
  let cssFile = await utils.getFilesByExtension(PATHS.base(), 'css');
  let screenshotFile = await utils.getScreenshot(PATHS.base());
  let allFiles = phpFiles.concat(cssFile, screenshotFile);
  allFiles = allFiles.map((f) => fsp.copy(f, `${buildDir}/${f.replace(PATHS.base(), '')}`));
  await Promise.all(allFiles);

  await fsp.remove(path.join(PATHS.base(), 'style.css'))
  return await fsp.rename(path.join(PATHS.base(), 'style.tmp'), path.join(PATHS.base(), 'style.css'));
}
