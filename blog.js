const fs = require('fs');
const jsdom = require('jsdom').JSDOM,
options = {
    resources: "usable"
};

function createBlog(title, subtitle, pagetitle, folder) {
    // Checks to make sure this directory actually exists
    // and creates it if it doesn't
    if (!fs.existsSync(`./dist/blog/`)){
        fs.mkdirSync(`./dist/blog/`, { recursive: true }, err => {});
    }    
    
    if (!fs.existsSync(`./dist/blog/${folder}`)){
        fs.mkdirSync(`./dist/blog/${folder}`, { recursive: true });
    }
    fs.copyFile('./assets/blog/blogTemplate.html', `./dist/blog/${folder}/index.html`, (err) => {
        if (err) throw err;
        jsdom.fromFile(`./dist/blog/${folder}/index.html`, options).then(function (dom) {
            let window = dom.window, document = window.document;
            var style = document.createElement("link");
            style.setAttribute("rel","stylesheet")
            style.setAttribute("href","../../index.css");
            document.getElementsByTagName("head")[0].appendChild(style);
            
            document.getElementsByTagName("title")[0].textContent = pagetitle;
            document.getElementById("blog_title").textContent = title;
            document.getElementById("blog_sub_title").textContent = subtitle;

            fs.writeFile(`./dist/blog/${folder}/index.html`, '<!DOCTYPE html>'+window.document.documentElement.outerHTML, function (error){
                if (error) throw error;
                var blog_data = {
                    "url_title": pagetitle,
                    "title": title,
                    "sub_title": subtitle,
                    "top_image": "https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450",
                    "visible": true }
                fs.readFile("./dist/blog.json", function (err , data) {
                    if (err) throw err;
                    var old_blogs = JSON.parse(data);
                    old_blogs.push(blog_data);
                    fs.writeFile('./dist/blog.json', JSON.stringify(old_blogs, null, ' '), function(err){
                      if (err) throw err;
                      console.log('Blog Created Successfully in "blog" folder.');
                    });
                });
            });
        }).catch(function(error){
            console.log(error);
        });
    });
}

function blogCommand(title, program) {
    /* Check if build has been executed before blog this will prevent it from giving "link : index.css" error */
    if (!fs.existsSync(`./dist/index.html`) || !fs.existsSync(`./dist/index.css`)){
        return console.log("You need to run build command before using blog one");
    }
    if (!program.pagetitle) {
        program.pagetitle = title;
    }
    if (!program.folder) {
        program.folder = title;
    }
    createBlog(title, program.subtitle, program.pagetitle, program.folder);
}

module.exports = {
    blogCommand,
};
