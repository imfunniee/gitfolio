const path = require("path");
const bluebird = require("bluebird");
const fs = bluebird.promisifyAll(require("fs"));

const outDir = path.resolve("./dist/" || process.env.OUT_DIR);
const configPath = path.join(outDir, "config.json");
const blogPath = path.join(outDir, "blog.json");

const defaultConfigPath = path.resolve(`${__dirname}/default/config.json`);
const defaultBlogPath = path.resolve(`${__dirname}/default/blog.json`);

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
  const data = await fs.readFileAsync(file);
  return JSON.parse(data);
}

async function getConfig() {
  return getFileWithDefaults(configPath, defaultConfigPath);
}

async function getBlog() {
  return getFileWithDefaults(blogPath, defaultBlogPath);
}

module.exports = {
  outDir,
  getConfig,
  getBlog
};
