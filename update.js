const { getConfig, getSocials } = require("./utils");
const { updateHTML } = require("./populate");

async function updateCommand() {
  const data = await getConfig();
  const socials = await getSocials();
  var username = data[0].username;
  var sort = data[0].sort;
  var order = data[0].order;
  var includeFork = data[0].includeFork;
  var twitter = socials.twitter;
  var linkedin = socials.linkedin;
  var medium = socials.medium;
  if (
    username == null ||
    sort == null ||
    order == null ||
    includeFork == null
  ) {
    console.log(
      "username not found in config.json, please run build command before using update"
    );
    return;
  }
  updateHTML(username, sort, order, includeFork, twitter, linkedin, medium);
}

module.exports = {
  updateCommand
};
