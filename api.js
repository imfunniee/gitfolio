const got = require('got');

async function getRepos(opts = {}) {
    let tempRepos;
    let page = 1;
    let repos;

    const sort = opts.sort;
    const order = opts.order || "desc";
    const username = opts.username;

    do{
        let requestUrl = `https://api.github.com/users/${username}/repos?per_page=100&page=${page++}`;
        if (sort && sort !== "star") {
            requestUrl += `&sort=${sort}&order=${order}`
        }
        tempRepos = await got(requestUrl);
        tempRepos = JSON.parse(tempRepos.body);
        repos = repos.concat(tempRepos);
    } while(tempRepos.length == 100);
    
    if(sort == "star"){
        repos = repos.sort(function(a, b) {
            if(order == "desc") {
                return  b.stargazers_count - a.stargazers_count;
            } else {
                return a.stargazers_count - b.stargazers_count;
            }
        });
    }

    return repos;
}

async function getUser(username) {
    const res = await got(`https://api.github.com/users/${username}`);
    return JSON.parse(res.body);
}

module.exports = {
    getRepos,
    getUser,
};