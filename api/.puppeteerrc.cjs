const { join } = require('path');

/**
 * Store browsers under the service root so Render includes them in the deploy
 * (default ~/.cache/puppeteer is not reliably available at runtime).
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
