const program = require('commander');
const fs = require('fs');
const jsdom = require('jsdom').JSDOM,
options = {
    resources: "usable"
};

program
  .version('0.1.1')
  .option('-t, --title [title]', 'give blog a title')
  .option('-s, --subtitle [subtitle]', 'give blog asubtitle', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
  .option('-p, --pagetitle [pagetitle]', 'give page a title')
  .option('-f, --folder [folder]', 'give folder a title')
  .parse(process.argv);

function createBlog(title, subtitle, pagetitle, folder) {
    if (!fs.existsSync(`./blog/${folder}`)){
        fs.mkdirSync(`./blog/${folder}`);
    }
    fs.copyFile('./blog/blog_template.html', `./blog/${folder}/index.html`, (err) => {
        if (err) throw err;
        jsdom.fromFile(`./blog/${folder}/index.html`, options).then(function (dom) {
            let window = dom.window, document = window.document;
            var style = document.createElement("link");
            style.setAttribute("rel","stylesheet")
            style.setAttribute("href","../../index.css");
            document.getElementsByTagName("head")[0].appendChild(style);
            
            document.getElementsByTagName("title")[0].textContent = pagetitle;
            document.getElementById("blog_title").textContent = title;
            document.getElementById("blog_sub_title").textContent = subtitle;

            fs.writeFile(`./blog/${folder}/index.html`, '<!DOCTYPE html>'+window.document.documentElement.outerHTML, function (error){
                if (error) throw error;
                var blog_data = {
                    "url_title": pagetitle,
                    "title": title,
                    "sub_title": subtitle,
                    "top_image": "https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450",
                    "visible": true }
                fs.readFile("./blog/blog.json", function (err , data) {
                    if (err) throw err;
                    var old_blogs = JSON.parse(data);
                    old_blogs.push(blog_data);
                    fs.writeFile('./blog/blog.json', JSON.stringify(old_blogs, null, ' '), function(err){
                      if (err) throw err;
                      console.log('Blog Created Successfully in "blog" folder.');
                    });
                })
            });
        }).catch(function(error){
            console.log(error);
        });
    });
}

if (program.title) {
    if (!program.pagetitle) {
        program.pagetitle = program.title;
    }

    if (!program.folder) {
        program.folder = program.title;
    }

    program.folder = program.folder.replace(/[^A-Za-z0-9_-\s]/g, "").trim();
    program.folder = program.folder.replace(/\s/g, "-");

    createBlog(program.title, program.subtitle, program.pagetitle, program.folder);
} else {
    console.log("provide a title to create a new blog");
}
