const {getConfig} = require('./utils');
const {updateHTML} = require('./populate');

async function updateCommand() {
    const data = await getConfig();
    var username = data[0].username;
    var sort = data[0].sort;
    var order = data[0].order;
    var includeFork = data[0].includeFork;
    var includeArchive = data[0].includeArchive;
    if(username == null || sort == null || order == null || includeFork == null || includeArchive == null){
        console.log("username not found in config.json, please run build command before using update");
        return;
    }
    updateHTML(username, sort, order, includeFork, includeArchive);
}

module.exports = {
    updateCommand
};
