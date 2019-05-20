const fs = require('fs');
const got = require('got');
const emoji = require('github-emoji');
const jsdom = require('jsdom').JSDOM,
    options = {
        resources: "usable"
    };

function convertToEmoji(text) {
    if (text == null) return;
    text = text.toString();
    if (text.match(/(?<=:\s*).*?(?=\s*:)/gs) != null) {
        var str = text.match(/(?<=:\s*).*?(?=\s*:)/gs);
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

module.exports.updateHTML = (username, sort, order) => {
    //add data to assets/index.html
    jsdom.fromFile("./assets/index.html", options).then(function (dom) {
        let window = dom.window, document = window.document;
        (async () => {
            try {
             console.log("Building HTML/CSS/JS...");
            var repos = await got(`https://api.github.com/users/${username}/repos`);
            repos = JSON.parse(repos.body);
            for(var i = 0;i < repos.length;i++){
                if(repos[i].fork == false){
					repos[i].description = convertToEmoji(repos[i].description);
					savedRepos.push(repos[i]);      
                } else {
					repos[i].description = convertToEmoji(repos[i].description);
					savedForks.push(repos[i]);
				}
            }
			saveToFile(sort, order, document);

			
			if(savedRepos.length){
				document.getElementById("navbar").innerHTML += `
				<a href="#projects">Projects</a>`;
			}
			if(savedForks.length){
				document.getElementById("navbar").innerHTML += `
				<a href="#forks">Forks</a>`;
            }
                var user = await got(`https://api.github.com/users/${username}`);
                user = JSON.parse(user.body);
                document.title = user.login;
                var icon = document.createElement("link");
                icon.setAttribute("rel", "icon");
                icon.setAttribute("href", user.avatar_url);
                icon.setAttribute("type", "image/png");
                document.getElementsByTagName("head")[0].appendChild(icon);
                document.getElementById("profile_img").style.background = `url('${user.avatar_url}') center center`
                document.getElementById("username").innerHTML = `<span style="display:${user.name == null || !user.name ? 'none' : 'block'};">${user.name}</span>@${user.login}`;
                //document.getElementById("github_link").href = `https://github.com/${user.login}`;
                document.getElementById("userbio").innerHTML = convertToEmoji(user.bio);
                document.getElementById("userbio").style.display = user.bio == null || !user.bio ? 'none' : 'block';
                document.getElementById("about").innerHTML = `
                <span style="display:${user.company == null || !user.company ? 'none' : 'block'};"><i class="fas fa-users"></i> &nbsp; ${user.company}</span>
                <span style="display:${user.email == null || !user.email ? 'none' : 'block'};"><i class="fas fa-envelope"></i> &nbsp; ${user.email}</span>
                <span style="display:${user.blog == null || !user.blog ? 'none' : 'block'};"><i class="fas fa-link"></i> &nbsp; ${user.blog}</span>
                <span style="display:${user.location == null || !user.location ? 'none' : 'block'};"><i class="fas fa-map-marker-alt"></i> &nbsp;&nbsp; ${user.location}</span>
                <span style="display:${user.hireable == false || !user.hireable ? 'none' : 'block'};"><i class="fas fa-user-tie"></i> &nbsp;&nbsp; Available for hire</span>`;
                //add data to config.json
                fs.readFile("./dist/config.json", function (err, data) {
                    if (err) throw err;
                    data = JSON.parse(data);
                    data[0].username = user.login;
                    data[0].name = user.name;
                    data[0].userimg = user.avatar_url;
                    fs.writeFile('./dist/config.json', JSON.stringify(data, null, ' '), function (err) {
                        if (err) throw err;
                    });
                });
                fs.writeFile('dist/index.html', '<!DOCTYPE html>' + window.document.documentElement.outerHTML, function (error) {
                    if (error) throw error;
                    console.log("Build Complete");
                    process.exit(0)
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }).catch(function (error) {
        console.log(error);
    });
}

function saveToFile(sort, order, document){
	fs.writeFile("./dist/repos.json", JSON.stringify(savedRepos), function(err) {
		if (err) {
			console.log(err);
		}
		
		populateHTML('repos', sort, order, document);
	});
	
	fs.writeFile("./dist/forks.json", JSON.stringify(savedForks), function(err) {
		if (err) {
			console.log(err);
		}
		
		populateHTML('forks', sort, order, document);
	});
}

function populateHTML(type, sort, order, document){
	let data = require('./dist/' + type + '.json');
	let result = [];
	result = data.sort(GetSortOrder(sort, order));
	
	if(result.length){
		for(var i = 0;i < result.length;i++){
            document.getElementById(type === 'repos' ? 'projects' : 'forks').innerHTML += `
            <a href="${result[i].html_url}" target="_blank">
                <section>
                    <div class="section_title">${result[i].name}</div>
                       <div class="about_section">
					<span style="display:${result[i].description == undefined ? 'none' : 'block'};">${result[i].description}</span>
                    </div>
                    <div class="bottom_section">
                        <span style="display:${result[i].language == null ? 'none' : 'inline-block'};"><i class="fas fa-code"></i>&nbsp; ${result[i].language}</span>
                        <span><i class="fas fa-star"></i>&nbsp; ${result[i].stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i>&nbsp; ${result[i].forks_count}</span>
                    </div>
                </section>
            </a>`;
		}
	}
}

function GetSortOrder(prop, order) {  
    return function(a, b) {  
		if(typeof(a[prop]) === 'string'){
			if (a[prop].toLowerCase() > b[prop].toLowerCase()) {  
				return 1 * order;  
			} else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {  
				return -1 * order;  
			}  
		} else {
			if (a[prop] > b[prop]) {  
				return 1 * order;  
			} else if (a[prop] < b[prop]) {  
				return -1 * order;  
			}  
		}
        return 0;  
    }  
} 