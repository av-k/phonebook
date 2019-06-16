const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  resolveApp,
  appSrc: resolveApp('src'), // App source
  appAssets: resolveApp('src/assets'), // For images and other assets
  appHtml: resolveApp('src/index.html'), // html template
  appIndexJs: resolveApp('src/index.js'), // Main entry point
  appFavicon: resolveApp('src/assets/favicons/favicon.ico'), // Main favicon
  appBuild: resolveApp('public'), // Prod built client files end up here
  appBuildAssets: resolveApp('public/assets') // Prod built client files end up here
};
