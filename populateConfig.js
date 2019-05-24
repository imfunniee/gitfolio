const { fs, config } = require("./build");
async function populateConfig(sort, order, includeFork) {
    let data = await fs.readFileAsync(config);
    data = JSON.parse(data);
    data[0].sort = sort;
    data[0].order = order;
    data[0].includeFork = includeFork;
    await fs.writeFileAsync(config, JSON.stringify(data, null, ' '));
}
exports.populateConfig = populateConfig;
