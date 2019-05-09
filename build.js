const program = require('commander');
const fs = require('fs');
const got = require('got');
const emoji = require('github-emoji');
const jsdom = require('jsdom').JSDOM,
options = {
    resources: "usable"
};

program
  .version('0.1.1')
  .option('-n, --name [username]', 'get username')
  .option('-d, --dark', 'enable dark mode')
  .option('-b, --background [background]', 'set background image')
  .parse(process.argv);

var dark;
var light;

function populateCSS(){
    if (program.dark) {
        fs.copyFile('./assets/index.css', 'index.css', (err) => {
            if (err) throw err;
            fs.appendFile('index.css', dark, function (err) {
                if (err) throw err;
            });
        });
    }else{
        fs.copyFile('./assets/index.css', 'index.css', (err) => {
            if (err) throw err;
            fs.appendFile('index.css', light, function (err) {
                if (err) throw err;
            });
        });
    }
}


if (program.background) {
    dark = `:root {--bg-color: rgb(10, 10, 10);--text-color: #fff;--blog-gray-color:rgb(180, 180, 180);--background-image: linear-gradient(90deg, rgba(10, 10, 10, 0.6), rgb(10, 10, 10, 1)), url('${('%s', program.background)}');--background-background: linear-gradient(0deg, rgba(10, 10, 10, 1), rgba(10, 10, 10, 0.6)),url('${('%s', program.background)}') center center fixed;--height:50vh;} #display h1 {-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color: #fff;} #blog-display h1 {-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color: #fff;}#projects section {background:rgb(20, 20, 20);}#blog_section section {background:rgb(20, 20, 20);}@media (max-width: 800px){ --background-image: linear-gradient(0deg, rgba(10, 10, 10, 1), rgb(10, 10, 10, 0)), url('${('%s', program.background)}') !important;}`;

    light = `:root {--bg-color: #fff;--text-color: rgb(10, 10, 10);--blog-gray-color:rgb(80, 80, 80);--background-image: linear-gradient(90deg, rgba(10, 10, 10, 0.4), rgb(10, 10, 10, 0.4)), url('${('%s', program.background)}');--background-background: #fff;}`
    populateCSS();
}else{
    dark = `:root {--bg-color: rgb(10, 10, 10);--text-color: #fff;--blog-gray-color:rgb(180, 180, 180);--background-image: linear-gradient(90deg, rgba(10, 10, 10, 0.6), rgb(10, 10, 10, 1)), url('https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450');--background-background: linear-gradient(0deg, rgba(10, 10, 10, 1), rgba(10, 10, 10, 0.6)),url('https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450') center center fixed;--height:50vh;} #display h1 {-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color: #fff;} #blog-display h1 {-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color: #fff;}#projects section {background:rgb(20, 20, 20);}#blog_section section {background:rgb(20, 20, 20);}@media (max-width: 800px){ --background-image: linear-gradient(0deg, rgba(10, 10, 10, 1), rgb(10, 10, 10, 0)), url('https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450') !important;}`;
    light = `:root {--bg-color: #fff;--text-color: rgb(10, 10, 10);--blog-gray-color:rgb(80, 80, 80);--background-image: linear-gradient(90deg, rgba(10, 10, 10, 0.4), rgb(10, 10, 10, 0.4)), url('https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450');--background-background: #fff;}`;
    populateCSS();
}

function convertToEmoji(text){
    if (text == null) return;
    text = text.toString();
    if(text.match(/\:(.*)\:/) != null){
        var str = text.match(/\:(.*)\:/)[1];
        var output = emoji.of(str);
        var emojiImage = output.url.replace("assets-cdn.github", "github.githubassets");
        text = text.replace(/\:(.*)\:/, `<img src="${emojiImage}" class="emoji">`);
        return text;
    }else{
        return text;
    }
}

function populateHTML(username){
//add data to assets/index.html
jsdom.fromFile("./assets/index.html", options).then(function (dom) {
    let window = dom.window, document = window.document;
    (async () => {
        try {
            console.log("Building HTML/CSS...");
            var repos = await got(`https://api.github.com/users/${username}/repos?sort=created`);
            repos = JSON.parse(repos.body);
            for(var i = 0;i < repos.length;i++){
                if(repos[i].fork == false){
                    document.getElementById("projects").innerHTML += `
                    <a href="${repos[i].html_url}" target="_blank">
                    <section>
                        <div class="section_title">${repos[i].name}</div>
                        <div class="about_section">
                        ${convertToEmoji(repos[i].description)}
                        </div>
                        <div class="bottom_section">
                            <span><i class="fas fa-code"></i>&nbsp; ${repos[i].language}</span>
                            <span><i class="fas fa-star"></i>&nbsp; ${repos[i].stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i>&nbsp; ${repos[i].forks_count}</span>
                        </div>
                    </section>
                    </a>`;
                }
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
        document.getElementById("username").innerHTML = `<span>${user.name}</span><br>@${user.login}`;
        //document.getElementById("github_link").href = `https://github.com/${user.login}`;
        document.getElementById("userbio").innerHTML = convertToEmoji(user.bio);
        document.getElementById("userbio").style.display = user.bio == null || !user.bio ? 'none' : 'block';
        document.getElementById("about").innerHTML = `
        <span style="display:${user.email == null || !user.email ? 'none' : 'block'};"><i class="fas fa-envelope"></i> &nbsp; ${user.email}</span>
        <span style="display:${user.blog == null || !user.blog ? 'none' : 'block'};"><i class="fas fa-link"></i> &nbsp; ${user.blog}</span>
        <span style="display:${user.location == null || !user.location ? 'none' : 'block'};"><i class="fas fa-map-marker-alt"></i> &nbsp;&nbsp; ${user.location}</span>`;
        fs.writeFile('index.html', '<!DOCTYPE html>'+window.document.documentElement.outerHTML, function (error){
            if (error) throw error;
        });
        } catch (error) {
            console.log(error);
        }
    })();
}).catch(function(error){
    console.log(error);
});

//copy blog.html from assets to blog
fs.copyFile('./assets/blog_template.html', './blog/blog_template.html', (err) => {
if (err) throw err;
//add data to assets/blog.html
jsdom.fromFile("./blog/blog_template.html", options).then(function (dom) {
    let window = dom.window, document = window.document;
    (async () => {
        try {
            var user = await got(`https://api.github.com/users/${username}`);
            user = JSON.parse(user.body);
            var icon = document.createElement("link");
            icon.setAttribute("rel", "icon");
            icon.setAttribute("href", user.avatar_url);
            icon.setAttribute("type", "image/png");
            document.getElementsByTagName("head")[0].appendChild(icon);
            document.getElementById("profile_img_blog").style.background = `url('${user.avatar_url}') center center`;
            document.getElementById("username_blog").innerHTML = `<span>${user.name}</span><br>@${user.login}<br><b id="blog_time"></b>`;
            fs.writeFile('./blog/blog_template.html', '<!DOCTYPE html>'+window.document.documentElement.outerHTML, function (error){
                if (error) throw error;
            });
        } catch (error) {
            console.log(error);
        }
    })();
}).catch(function(error){
    console.log(error);
});
});
}

if (program.name) {
    populateHTML(('%s', program.name));
} else {
    console.log("Provide a username");
}