const program = require('commander');
const fs = require('fs');
const jsdom = require('jsdom').JSDOM,
options = {
    resources: "usable"
};

program
  .version('0.1.0')
  .option('-t, --title [title]', 'give blog a title')
  .parse(process.argv);

function createBlog(title) {
    if (!fs.existsSync(`./blog/${title}`)){
        fs.mkdirSync(`./blog/${title}`);
    }
    fs.copyFile('./blog/blog_template.html', `./blog/${title}/index.html`, (err) => {
        if (err) throw err;
        jsdom.fromFile(`./blog/${title}/index.html`, options).then(function (dom) {
            let window = dom.window, document = window.document;
            var style = document.createElement("link");
            style.setAttribute("rel","stylesheet")
            style.setAttribute("href","../../index.css");
            document.getElementsByTagName("head")[0].appendChild(style);
            fs.writeFile(`./blog/${title}/index.html`, '<!DOCTYPE html>'+window.document.documentElement.outerHTML, function (error){
                if (error) throw error;
                var blog_data = {
                    "url_title": title,
                    "title": "Lorem ipsum dolor sit amet",
                    "sub_title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
    createBlog(('%s', program.title));
} else {
    console.log("provide a title to create a new blog");
}