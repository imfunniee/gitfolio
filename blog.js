const program = require('commander');
const fs = require('fs');
const jsdom = require('jsdom').JSDOM,
options = {
    resources: "usable"
};

program
  .version('0.1.2')
  .option('-t, --title [title]', 'give blog a title')
  .option('-s, --subtitle [subtitle]', 'give blog a subtitle', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
  .option('-p, --pagetitle [pagetitle]', 'give blog page a title')
  .option('-f, --folder [folder]', 'give folder a title (use "-" instead of spaces)')
  .parse(process.argv);

function createBlog(title, subtitle, pagetitle, folder) {
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

if (program.title) {
    /* Check if build has been executed before blog this will prevent it from giving "link : index.css" error */
    if (!fs.existsSync(`./dist/index.html`) || !fs.existsSync(`./dist/index.css`)){
        return console.log("You need to run build command before using blog one");
    }
    if (!program.pagetitle) {
        program.pagetitle = program.title;
    }
    if (!program.folder) {
        program.folder = program.title;
    }
    createBlog(program.title, program.subtitle, program.pagetitle, program.folder);
} else {
    console.log("Provide a title to create a new blog");
}
