const got = require("got");

/**
 * The defaults here are the same as the API
 * @see https://developer.github.com/v3/repos/#list-user-repositories
 * @param {string} username
 * @param {Object} opts
 * @param {('all' | 'owner' | 'member')[]} [opts.types]
 * @param {'created' | 'updated' | 'pushed' | 'full_name' | 'star'} [opts.sort]
 * @param {'desc' | 'asc'} [opts.order]
 */
async function getRepos(username, opts = {}) {
  let tempRepos;
  let page = 1;
  let repos = [];

  const sort = opts.sort;
  const order = opts.order || (sort === "full_name" ? "asc" : "desc");
  const types = opts.types || [];
  let type = "all";

  if (
    types.includes("all") ||
    (types.includes("owner") && types.includes("member"))
  ) {
    type = "all";
  } else if (types.includes("member")) {
    type = "member";
  }

  do {
    let requestUrl = `https://api.github.com/users/${username}/repos?per_page=100&page=${page++}&type=${type}`;
    if (sort && sort !== "star") {
      requestUrl += `&sort=${sort}&direction=${order}`;
    }
    tempRepos = await got(requestUrl);
    tempRepos = JSON.parse(tempRepos.body);
    repos = repos.concat(tempRepos);
  } while (tempRepos.length == 100);

  if (sort == "star") {
    repos = repos.sort(function(a, b) {
      if (order == "desc") {
        return b.stargazers_count - a.stargazers_count;
      } else {
        return a.stargazers_count - b.stargazers_count;
      }
    });
  }

  return repos;
}

/**
 * @see https://developer.github.com/v3/users/#get-a-single-user
 * @param {string} username
 */
async function getUser(username) {
  const res = await got(`https://api.github.com/users/${username}`);
  return JSON.parse(res.body);
}

module.exports = {
  getRepos,
  getUser
};
