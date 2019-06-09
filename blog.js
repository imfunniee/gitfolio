const fs = require('fs');
const jsdom = require('jsdom').JSDOM,
options = {
    resources: "usable"
};
const {getBlog, outDir} = require('./utils');

function createBlog(title, subtitle, pagetitle, folder) {
    // Checks to make sure this directory actually exists
    // and creates it if it doesn't
    if (!fs.existsSync(`${outDir}/blog/`)){
        fs.mkdirSync(`${outDir}/blog/`, { recursive: true }, err => {});
    }    
    
    if (!fs.existsSync(`${outDir}/blog/${folder}`)){
        fs.mkdirSync(`${outDir}/blog/${folder}`, { recursive: true });
    }
    fs.copyFile(`${__dirname}/assets/blog/blogTemplate.html`, `${outDir}/blog/${folder}/index.html`, (err) => {
        if (err) throw err;
        jsdom.fromFile(`${outDir}/blog/${folder}/index.html`, options).then(function (dom) {
            let window = dom.window, document = window.document;
            var style = document.createElement("link");
            style.setAttribute("rel","stylesheet")
            style.setAttribute("href","../../index.css");
            document.getElementsByTagName("head")[0].appendChild(style);
            
            document.getElementsByTagName("title")[0].textContent = pagetitle;
            document.getElementById("blog_title").textContent = title;
            document.getElementById("blog_sub_title").textContent = subtitle;

            fs.writeFile(`${outDir}/blog/${folder}/index.html`, '<!DOCTYPE html>'+window.document.documentElement.outerHTML, async function (error){
                if (error) throw error;
                var blog_data = {
                    "url_title": folder,
                    "title": title,
                    "sub_title": subtitle,
                    "top_image": "https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450",
                    "visible": true }
                const old_blogs = await getBlog();
                old_blogs.push(blog_data);
                fs.writeFile(`${outDir}/blog.json`, JSON.stringify(old_blogs, null, ' '), function(err){
                    if (err) throw err;
                    console.log('Blog Created Successfully in "blog" folder.');
                });
            });
        }).catch(function(error){
            console.log(error);
        });
    });
}

function blogCommand(title, program) {
    /* Check if build has been executed before blog this will prevent it from giving "link : index.css" error */
    if (!fs.existsSync(`${outDir}/index.html`) || !fs.existsSync(`${outDir}/index.css`)){
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
    blogCommand
};
