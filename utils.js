const path = require("path");
const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("fs"));

const outDir = path.resolve("./dist/" || process.env.OUT_DIR);
const configPath = path.join(outDir, "config.json");
const blogPath = path.join(outDir, "blog.json");
const socialsPath = path.join(outDir, "social.json");
const ignoredPath = path.join(outDir, "ignore.json");

const defaultConfigPath = path.resolve(`${__dirname}/default/config.json`);
const defaultBlogPath = path.resolve(`${__dirname}/default/blog.json`);
const defaultSocialsPath = path.resolve(`${__dirname}/default/social.json`);
const defaultIgnoredPath = path.resolve(`${__dirname}/default/ignore.json`);

/**
 * Tries to read file from out dir,
 * if not present returns default file contents
 */
async function getFileWithDefaults(file, defaultFile) {
  try {
    await fs.accessAsync(file, fs.constants.F_OK);
  } catch (err) {
    const defaultData = await fs.readFileAsync(defaultFile);
    return JSON.parse(defaultData);
  }
  try{
    const data = await fs.readFileAsync(file);
    if( typeof data != 'undefined')
      return JSON.parse(data);
  }
  catch(err) {
  }
  
  
}

async function getConfig() {
  return getFileWithDefaults(configPath, defaultConfigPath);
}

async function getBlog() {
  return getFileWithDefaults(blogPath, defaultBlogPath);
}

async function getSocials() {
  return getFileWithDefaults(socialsPath, defaultSocialsPath);
}

async function getIgnored() {
  return getFileWithDefaults(ignoredPath, defaultIgnoredPath);
}

module.exports = {
  outDir,
  getConfig,
  getBlog,
  getSocials,
  getIgnored,
  defaultSocialsPath,
  defaultIgnoredPath
};
