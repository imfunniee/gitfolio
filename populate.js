const fs = require('fs');
const got = require('got');
const emoji = require('github-emoji');
const jsdom = require('jsdom').JSDOM,
    options = {
        resources: "usable"
    };
const { getConfig, outDir } = require('./utils');

function convertToEmoji(text) {
    if (text == null) return;
    text = text.toString();
    var pattern = /(?<=:\s*).*?(?=\s*:)/gs
    if (text.match(pattern) != null) {
        var str = text.match(pattern);
        str = str.filter(function (arr) {
            return /\S/.test(arr);
        });
        for (i = 0; i < str.length; i++) {
            if (emoji.URLS[str[i]] != undefined) {
                var output = emoji.of(str[i]);
                var emojiImage = output.url.replace("assets-cdn.github", "github.githubassets");
                text = text.replace(`:${str[i]}:`, `<img src="${emojiImage}" class="emoji">`);
            }
        }
        return text;
    } else {
        return text;
    }
}

module.exports.updateHTML = (username, sort, order, includeFork, useGitlab) => {
    //add data to assets/index.html
    jsdom.fromFile(`${__dirname}/assets/index.html`, options).then(function (dom) {
        let window = dom.window, document = window.document;
        (async () => {
            try {
                console.log("Building HTML/CSS...");
                var repos = [];
                var tempRepos;
                var page = 1;
                if (useGitlab) {
                    switch(sort) {
                        case 'created':
                            sort = 'created_at';
                            break;
                        case 'updated':
                            sort = 'updated_at';
                            break;
                        case 'pushed':
                            sort = 'last_activity_at';
                            break;
                        case 'full_name':
                            sort = 'name';
                            break;
                    }
                }
                if(sort == "star"){
                    do{
                        if (!useGitlab) {
                            tempRepos = await got(`https://api.github.com/users/${username}/repos?per_page=100&page=${page++}`);
                        } else {
                            tempRepos = await got(`https://gitlab.com/api/v4/users/${username}/projects?per_page=100&page=${page++}`);
                        }
                        repos = repos.concat(tempRepos);
                    } while(tempRepos.length == 100);
                    if(order == "desc"){
                        repos = repos.sort(function(a, b) {
                            return  b.stargazers_count - a.stargazers_count;
                        });
                    }else{
                        repos = repos.sort(function(a, b) {
                            return a.stargazers_count - b.stargazers_count;
                        });
                    }
                }else{
                    do{
                        if (!useGitlab) {
                            tempRepos = await got(`https://api.github.com/users/${username}/repos?sort=${sort}&order=${order}&per_page=100&page=${page++}`);
                        } else {
                            // in the GitLab API, sort means ordering (ascending/descending) and order_by means sort criteria - https://docs.gitlab.com/ee/api/projects.html#list-all-projects
                            tempRepos = await got(`https://gitlab.com/api/v4/users/${username}/projects?order_by=${sort}&sort=${order}&per_page=100&page=${page++}`);
                        }
                        tempRepos = JSON.parse(tempRepos.body);
                        repos = repos.concat(tempRepos);
                    } while(tempRepos.length == 100);
                }
                if (useGitlab) {
                    if (includeFork == true) {
                        console.warn('Warning: The public GitLab API currently does not provide forking relations, forked repos will be displayed as your own.');
                    }
                    // convert gitlab property names to github property names
                    for (var i = 0; i < repos.length; i++) {
                        repos[i].stargazers_count = repos[i].star_count;
                        repos[i].html_url = repos[i].web_url;
                        repos[i].fork = (repos[i].forked_from_project ? true : false); // only fork-projects have this object; forked_from_project is only available for the logged in user
                        // forks_count, name and description already exist
                        // missing language specification, must be be requested from other endpoint - https://docs.gitlab.com/ee/api/projects.html#languages
                    }
                }
                for (var i = 0; i < repos.length; i++) {
                    if(repos[i].fork == false){
                        document.getElementById("work_section").innerHTML += `
                        <a href="${repos[i].html_url}" target="_blank">
                        <section>
                            <div class="section_title">${repos[i].name}</div>
                            <div class="about_section">
                            <span style="display:${repos[i].description == undefined ? 'none' : 'block'};">${convertToEmoji(repos[i].description)}</span>
                            </div>
                            <div class="bottom_section">
                                <span style="display:${repos[i].language == null ? 'none' : 'inline-block'};"><i class="fas fa-code"></i>&nbsp; ${repos[i].language}</span>
                                <span><i class="fas fa-star"></i>&nbsp; ${repos[i].stargazers_count}</span>
                                <span><i class="fas fa-code-branch"></i>&nbsp; ${repos[i].forks_count}</span>
                            </div>
                        </section>
                        </a>`;
                    }else{
                        if(includeFork == true){
                            document.getElementById("forks").style.display = "block";
                            document.getElementById("forks_section").innerHTML += `
                            <a href="${repos[i].html_url}" target="_blank">
                            <section>
                                <div class="section_title">${repos[i].name}</div>
                                <div class="about_section">
                                <span style="display:${repos[i].description == undefined ? 'none' : 'block'};">${convertToEmoji(repos[i].description)}</span>
                                </div>
                                <div class="bottom_section">
                                    <span style="display:${repos[i].language == null ? 'none' : 'inline-block'};"><i class="fas fa-code"></i>&nbsp; ${repos[i].language}</span>
                                    <span><i class="fas fa-star"></i>&nbsp; ${repos[i].stargazers_count}</span>
                                    <span><i class="fas fa-code-branch"></i>&nbsp; ${repos[i].forks_count}</span>
                                </div>
                            </section>
                            </a>`;
                        }
                    }
                }
                if (!useGitlab) {
                    var user = await got(`https://api.github.com/users/${username}`);
                    user = JSON.parse(user.body);
                } else {
                    var searchResults = await got(`https://gitlab.com/api/v4/users?username=${username}`);
                    searchResults = JSON.parse(searchResults.body);
                    var userId = searchResults[0].id;
                    var user = await got(`https://gitlab.com/api/v4/users/${userId}`);
                    user = JSON.parse(user.body);
                    // convert gitlab property names to github property names
                    user.login = user.username;
                    user.html_url = user.web_url;
                    user.company = user.organization;
                    user.email = user.public_email;
                    user.blog = user.website_url;
                    user.hireable = false; // GitLab does not support hireable status
                    // avatar_url, name, bio and location already exist
                }
                document.title = user.login;
                var icon = document.createElement("link");
                icon.setAttribute("rel", "icon");
                icon.setAttribute("href", user.avatar_url);
                icon.setAttribute("type", "image/png");
                document.getElementsByTagName("head")[0].appendChild(icon);
                document.getElementById("profile_img").style.background = `url('${user.avatar_url}') center center`
                document.getElementById("username").innerHTML = `<span style="display:${user.name == null || !user.name ? 'none' : 'block'};">${user.name}</span><a href="${user.html_url}">@${user.login}</a>`;
                //document.getElementById("github_link").href = `https://github.com/${user.login}`;
                document.getElementById("userbio").innerHTML = convertToEmoji(user.bio);
                document.getElementById("userbio").style.display = user.bio == null || !user.bio ? 'none' : 'block';
                document.getElementById("about").innerHTML = `
                <span style="display:${user.company == null || !user.company ? 'none' : 'block'};"><i class="fas fa-users"></i> &nbsp; ${user.company}</span>
                <span style="display:${user.email == null || !user.email ? 'none' : 'block'};"><i class="fas fa-envelope"></i> &nbsp; ${user.email}</span>
                <span style="display:${user.blog == null || !user.blog ? 'none' : 'block'};"><i class="fas fa-link"></i> &nbsp; <a href="${user.blog}">${user.blog}</a></span>
                <span style="display:${user.location == null || !user.location ? 'none' : 'block'};"><i class="fas fa-map-marker-alt"></i> &nbsp;&nbsp; ${user.location}</span>
                <span style="display:${user.hireable == false || !user.hireable ? 'none' : 'block'};"><i class="fas fa-user-tie"></i> &nbsp;&nbsp; Available for hire</span>`;
                //add data to config.json
                const data = await getConfig();
                data[0].username = user.login;
                data[0].name = user.name;
                data[0].userimg = user.avatar_url;
                await fs.writeFile(`${outDir}/config.json`, JSON.stringify(data, null, ' '), function (err) {
                    if (err) throw err;
                    console.log("Config file updated.");
                });
                await fs.writeFile(`${outDir}/index.html`, '<!DOCTYPE html>' + window.document.documentElement.outerHTML, function (error) {
                    if (error) throw error;
                    console.log(`Build Complete, Files can be Found @ ${outDir}`);
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }).catch(function (error) {
        console.log(error);
    });
}
