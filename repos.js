const program = require('commander');
const fs = require('fs');
const got = require('got');
options = {
    resources: "usable"
};

program
  .version('0.1.0')
  .option('-n, --name [username]', 'get username')
  .parse(process.argv);

function populateRepos(username){
    var repoData = [];
    (async () => {
        try {
    var repos = await got(`https://api.github.com/users/${username}/repos?sort=created`);
    repos = JSON.parse(repos.body);
    for(var i = 0;i < repos.length;i++){
        if(repos[i].fork == false){
            repoData.push({
                "html_url": repos[i].html_url, 
                "name": repos[i].name,
                "description": repos[i].description,
                "language": repos[i].language,
                "stargazers_count": repos[i].stargazers_count,
                "forks_count" :repos[i].forks_count
            });
        }

    }
    fs.writeFile('repos.json', JSON.stringify(repoData), function(err){
        if (err) throw err;
        console.log('Repos Created Successfully in root folder.');
      });
    } catch (error) {
        console.log(error);
    }
})();
}
if (program.name) {
    populateRepos(('%s', program.name));
} else {
    console.log("provide a name to scrape repos");
}