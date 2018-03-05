const path = require("path");
const { PATHS } = require("../env.config");
const utils = require("./utils");
const webpack = require("webpack");
const fs = require("fs-extra");
const webpackConfig = require("../webpack.config");

const bundler = webpack(webpackConfig);

(async () => {
  try {
    await utils.addMainCss();
    await webpackBuild();
    await finalize();
    console.log("Done!");
  } catch (e) {
    console.log(e.toString());
  }
})();

async function webpackBuild() {
  console.log("Running webpack build.");
  await fs.remove(PATHS.compiled());
  return new Promise((resolve, reject) => {
    bundler.run((err, stats) => (err ? reject(err) : resolve(stats)));
  });
}

async function finalize() {
  console.log("Finalizing.");
  const buildDir = PATHS.base("build");

  await fs.remove(buildDir);
  await fs.ensureDir(path.join(buildDir, "compiled"));
  await fs.copy(PATHS.compiled(), path.join(buildDir, "compiled"));

  let phpFiles = await utils.getFilesByExtension(PATHS.base(), "php");
  let cssFile = await utils.getFilesByExtension(PATHS.base(), "css");
  let screenshotFile = await utils.getScreenshot(PATHS.base());
  let allFiles = phpFiles.concat(cssFile, screenshotFile);
  allFiles = allFiles.map(f =>
    fs.copy(f, `${buildDir}/${f.replace(PATHS.base(), "")}`)
  );
  await Promise.all(allFiles);

  await fs.remove(path.join(PATHS.base(), "style.css"));
  return await fs.rename(
    path.join(PATHS.base(), "style.tmp"),
    path.join(PATHS.base(), "style.css")
  );
}
