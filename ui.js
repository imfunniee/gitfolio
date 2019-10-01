const fs = require("fs");
const express = require("express");
const { updateHTML } = require("./populate");
const { populateCSS, populateConfig } = require("./build");
const { updateCommand } = require("./update");
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));
app.set("views", __dirname + "/views");
app.use(
  express.json({
    limit: "50mb"
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true
  })
);

const port = 3000;

const jsdom = require("jsdom").JSDOM,
  options = {
    resources: "usable"
  };
global.DOMParser = new jsdom().window.DOMParser;
const { getBlog, outDir } = require("./utils");

function createBlog(title, subtitle, folder, topImage, images, content) {
  // Checks to make sure this directory actually exists
  // and creates it if it doesn't
  if (!fs.existsSync(`${outDir}/blog/`)) {
    fs.mkdirSync(
      `${outDir}/blog/`,
      {
        recursive: true
      },
      err => {}
    );
  }

  if (!fs.existsSync(`${outDir}/blog/${folder}`)) {
    fs.mkdirSync(`${outDir}/blog/${folder}`, {
      recursive: true
    });
  }

  fs.copyFile(
    `${__dirname}/assets/blog/blogTemplate.html`,
    `${outDir}/blog/${folder}/index.html`,
    err => {
      if (err) throw err;
      jsdom
        .fromFile(`${outDir}/blog/${folder}/index.html`, options)
        .then(function(dom) {
          let window = dom.window,
            document = window.document;
          let style = document.createElement("link");
          style.setAttribute("rel", "stylesheet");
          style.setAttribute("href", "../../index.css");
          document.getElementsByTagName("head")[0].appendChild(style);

          document.getElementsByTagName("title")[0].textContent = title;
          document.getElementById("blog_title").textContent = title;
          document.getElementById("blog_sub_title").textContent = subtitle;
          document.getElementById(
            "background"
          ).style.background = `url('top_image.${
            topImage.split("/")[1].split(";")[0]
          }') center center`;

          if (content != null) {
            var parser = new DOMParser();
            content = parser.parseFromString(content, "text/html");
            document.getElementById("blog").innerHTML =
              content.documentElement.innerHTML;
          }

          images = JSON.parse(images);
          images.forEach((item, index) => {
            var base64Image = item.split(";base64,").pop();
            fs.writeFile(
              `${outDir}/blog/${folder}/img_${index}.${
                item.split("/")[1].split(";")[0]
              }`,
              base64Image,
              {
                encoding: "base64"
              },
              function(err) {
                if (err) throw err;
              }
            );
          });

          fs.writeFile(
            `${outDir}/blog/${folder}/index.html`,
            "<!DOCTYPE html>" + window.document.documentElement.outerHTML,
            async function(error) {
              if (error) throw error;

              var base64ImageTop = topImage.split(";base64,").pop();
              fs.writeFile(
                `${outDir}/blog/${folder}/top_image.${
                  topImage.split("/")[1].split(";")[0]
                }`,
                base64ImageTop,
                {
                  encoding: "base64"
                },
                function(err) {
                  if (err) throw err;
                }
              );

              let blog_data = {
                url_title: folder,
                title: title,
                sub_title: subtitle,
                top_image: `top_image.${topImage.split("/")[1].split(";")[0]}`,
                visible: true
              };
              const old_blogs = await getBlog();
              old_blogs.push(blog_data);
              fs.writeFile(
                `${outDir}/blog.json`,
                JSON.stringify(old_blogs, null, " "),
                function(err) {
                  if (err) throw err;
                  console.log(
                    `Blog created successfully at ${outDir}\\blog\\${folder}\n`
                  );
                }
              );
            }
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  );
}

function uiCommand() {
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  app.get("/update", function(req, res) {
    if (!fs.existsSync(`${outDir}/config.json`)) {
      return res.send(
        'You need to run build command before using update<br><a href="/">Go Back</a>'
      );
    }
    updateCommand();
    res.redirect("/");
  });

  app.post("/build", function(req, res) {
    let username = req.body.username;
    if (!username) {
      return res.send("username can't be empty");
    }
    let sort = req.body.sort ? req.body.sort : "created";
    let order = req.body.order ? req.body.order : "asc";
    let includeFork = req.body.fork == "true" ? true : false;
    let types = ["owner"];
    let twitter = req.body.twitter ? req.body.twitter : null;
    let linkedin = req.body.linkedin ? req.body.linkedin : null;
    let medium = req.body.medium ? req.body.medium : null;
    let dribbble = req.body.dribbble ? req.body.dribbble : null;
    let background = req.body.background
      ? req.body.background
      : "https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1500&q=80";
    let theme = req.body.theme == "on" ? "dark" : "light";
    const opts = {
      sort: sort,
      order: order,
      includeFork: includeFork,
      types,
      twitter: twitter,
      linkedin: linkedin,
      medium: medium,
      dribbble: dribbble
    };

    updateHTML(username, opts);
    populateCSS({
      background: background,
      theme: theme
    });
    populateConfig(opts);
    res.redirect("/");
  });

  app.get("/blog", function(req, res) {
    if (!fs.existsSync(`${outDir}/config.json`)) {
      return res.send(
        'You need to run build command before accessing blogs<br><a href="/">Go Back</a>'
      );
    }
    fs.readFile(`${outDir}/config.json`, function(err, data) {
      res.render("blog.ejs", {
        profile: JSON.parse(data)
      });
    });
  });

  app.post("/createBlog", function(req, res) {
    let title = req.body.title;
    let subtitle = req.body.subtitle;
    let content = req.body.content ? req.body.content : null;
    if (!title) {
      return res.send("title can't be empty");
    }
    if (!subtitle) {
      return res.send("subtitle can't be empty");
    }
    if (!content) {
      return res.send("something isn't working fine, try again :p");
    }
    let folder = title.replace(/[^a-zA-Z ]/g, "").replace(/ /g, "-");
    let topImage = req.body.top_image;
    let images = req.body.images;
    createBlog(title, subtitle, folder, topImage, images, content);
    res.redirect("/blog");
  });

  console.log("\nStarting...");
  app.listen(port);
  console.log(
    `The GUI is running on port ${port}, Navigate to http://localhost:${port} in your browser\n`
  );
}

module.exports = {
  uiCommand
};
