/* Argument parser */
const program = require('commander');
/* Filepath utilities */
const path = require('path');
/* Promise library */
const bluebird = require('bluebird');
const hbs = require('handlebars');
/*  Creates promise-returning async functions
    from callback-passed async functions      */
const fs = bluebird.promisifyAll(require('fs'));
const { updateHTML } = require('./populate');


/* Specify the options the program uses */
program
    .version('0.1.2')
    .option('-n, --name [username]', 'your GitHub username. This will be used to customize your site')
    .option('-t, --theme [theme]', 'specify a theme to use')
    .option('-b, --background [background]', 'set the background image')
    .option('-f, --fork', 'includes forks with repos')
    .option('-s, --sort [sort]', 'set default sort for repository')
    .option('-o, --order [order]', 'set default order on sort')
    .parse(process.argv);

const config = './dist/config.json';
const assetDir = path.resolve('./assets/');
const outDir = path.resolve('./dist/');

/**
 * Creates the stylesheet used by the site from a template stylesheet.
 * 
 * Theme styles are added to the new stylesheet depending on command line 
 * arguments.
 */
async function populateCSS() {
    /* Get the theme the user requests. Defaults to 'light' */
    let theme = `${program.theme || 'light'}.css`; /* Site theme, defaults to 'light' */
    let template = path.resolve(assetDir, 'index.css');
    let stylesheet = path.join(outDir, 'index.css');

    try {
        await fs.accessAsync(outDir, fs.constants.F_OK);
    } catch (err) {
        await fs.mkdirAsync(outDir);
    }
    /* Copy over the template CSS stylesheet */
    await fs.copyFileAsync(template, stylesheet);

    /* Get an array of every available theme */
    let themes = await fs.readdirAsync(path.join(assetDir, 'themes'));

    if (!themes.includes(theme)) {
        console.error('Error: Requested theme not found. Defaulting to "light".');
        theme = 'light';
    }
    /* Read in the theme stylesheet */
    let themeSource = await fs.readFileSync(path.join(assetDir, 'themes', theme));
    themeSource = themeSource.toString('utf-8');
    let themeTemplate = hbs.compile(themeSource);
    let styles = themeTemplate({
      'background': `${program.background || 'https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450'}`
    })
    /* Add the user-specified styles to the new stylesheet */
    await fs.appendFileAsync(stylesheet, styles);

    /* Update the config file with the user's theme choice */
    let data = await fs.readFileAsync(config);
    data = JSON.parse(data);
    data[0].theme = theme;
    await fs.writeFileAsync(config, JSON.stringify(data, null, ' '));
}

async function populateConfig(sort, order, includeFork) {
    let data = await fs.readFileAsync(config);
    data = JSON.parse(data);
    data[0].sort = sort;
    data[0].order = order;
    data[0].includeFork = includeFork;
    await fs.writeFileAsync(config, JSON.stringify(data, null, ' '));
}

populateCSS();

if (typeof program.name === 'string' && program.name !== '') {
    let sort = program.sort ? program.sort : 'created';
    let order = "asc";
    let includeFork = false;
	if(program.order){
		order = ('%s', program.order);
    }
    if(program.fork){
        includeFork = true;
    }
    populateConfig(sort, order, includeFork);
    updateHTML(('%s', program.name), sort, order, includeFork);
} else {
    console.error("Error: Please provide a GitHub username.");
}