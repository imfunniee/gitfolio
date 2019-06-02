/* Filepath utilities */
const path = require('path');
/* Promise library */
const bluebird = require('bluebird');
const hbs = require('handlebars');
/*  Creates promise-returning async functions
    from callback-passed async functions      */
const fs = bluebird.promisifyAll(require('fs'));
const { updateHTML } = require('./populate');
const { getConfig, outDir } = require('./utils');

const assetDir = path.resolve(`${__dirname}/assets/`);
const config = path.join(outDir, 'config.json');

/**
 * Creates the stylesheet used by the site from a template stylesheet.
 *
 * Theme styles are added to the new stylesheet depending on command line
 * arguments.
 */
async function populateCSS({
  theme = 'light',
  background = 'https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=500&h=1000&q=80&fit=crop',
} = {}) {
  /* Get the theme the user requests. Defaults to 'light' */
  theme = `${theme}.css`;
  const template = path.resolve(assetDir, 'index.css');
  const stylesheet = path.join(outDir, 'index.css');

  const serviceWorker = path.resolve(assetDir, 'service-worker.js');

  try {
    await fs.accessAsync(outDir, fs.constants.F_OK);
  } catch (err) {
    await fs.mkdirAsync(outDir);
  }
  /* Copy over the template CSS stylesheet */
  await fs.copyFileAsync(template, stylesheet);

  /* Add Service Worker */
  await fs.copyFileSync(serviceWorker, `${outDir}/service-worker.js`);

  /* Get an array of every available theme */
  const themes = await fs.readdirAsync(path.join(assetDir, 'themes'));

  if (!themes.includes(theme)) {
    console.error('Error: Requested theme not found. Defaulting to "light".');
    theme = 'light';
  }
  /* Read in the theme stylesheet */
  let themeSource = await fs.readFileSync(path.join(assetDir, 'themes', theme));
  themeSource = themeSource.toString('utf-8');
  const themeTemplate = hbs.compile(themeSource);
  const styles = themeTemplate({
    background: `${background}`,
  });
  /* Add the user-specified styles to the new stylesheet */
  await fs.appendFileAsync(stylesheet, styles);

  /* Update the config file with the user's theme choice */
  const data = await getConfig();
  data[0].theme = theme;
  await fs.writeFileAsync(config, JSON.stringify(data, null, ' '));
}

async function populateConfig(sort, order, includeFork) {
  const data = await getConfig();
  data[0].sort = sort;
  data[0].order = order;
  data[0].includeFork = includeFork;
  await fs.writeFileAsync(config, JSON.stringify(data, null, ' '));
}

async function buildCommand(username, program) {
  await populateCSS(program);
  const sort = program.sort ? program.sort : 'created';
  const order = program.order ? program.order : 'asc';
  const includeFork = !!program.fork;
  await populateConfig(sort, order, includeFork);
  updateHTML(('%s', username), sort, order, includeFork);
}

module.exports = {
  buildCommand,
};
