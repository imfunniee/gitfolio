const { getConfig } = require('./utils');
const { updateHTML } = require('./populate');

async function updateCommand() {
  const data = await getConfig();
  const { username } = data[0];
  const { sort } = data[0];
  const { order } = data[0];
  const { includeFork } = data[0];
  if (
    username == null ||
    sort == null ||
    order == null ||
    includeFork == null
  ) {
    console.log(
      'username not found in config.json, please run build command before using update'
    );
    return;
  }
  updateHTML(username, sort, order, includeFork);
}

module.exports = {
  updateCommand,
};
