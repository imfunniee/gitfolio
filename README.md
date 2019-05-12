<img src="https://i.imgur.com/eA6clZr.png">

# Gitfolio  [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=about.me%20and%20medium%20but%20for%20every%20github%20user&url=https://github.com/imfunniee/gitfolio) ![GitHub release](https://img.shields.io/github/release/imfunniee/gitfolio.svg) ![GitHub top language](https://img.shields.io/github/languages/top/imfunniee/gitfolio.svg) ![GitHub last commit](https://img.shields.io/github/last-commit/imfunniee/gitfolio.svg) ![GitHub](https://img.shields.io/github/license/imfunniee/gitfolio.svg)
  
### about.me + medium but for every github user

Gitfolio will help get started with a portfolio website where you could showcase your work + a blog that will help you spread your ideas into  real world.

# Getting Started

### Let's build

a. Clone this repository using ``git clone https://github.com/imfunniee/gitfolio.git`` or just simply download it.

```
$ git clone https://github.com/imfunniee/gitfolio.git
```

b. Now ``cd`` into the repository you just cloned ``cd gitfolio`` and run the below command

```
$ npm i
```

This will install all the dependencies you will need to build your website.

c. After its done installing the dependencies run this command where `username` is your username on github

```
$ node build --name username
```
This will create `index.css` and `index.html` files in your working directory.

d. Congrats, you just made yourself a personal website. 

e. To run your website open `index.html` or simply type `index.html` and hit enter in your terminal.

> if you get stuck somewhere or get an error, please create an issue

### Let's customize

#### Enabling Dark theme

To enable dark theme just provide `--dark` as an argument while building

```
$ node build --name username --dark
```

#### Customize background image

To customize the background image just provide `--background [url]` argument while building

```
$ node build --name username --background https://images.unsplash.com/photo-1557277770-baf0ca74f908?w=1634
```

You could also add in your custom CSS inside `index.css` to give it a more personal feel.


### Let's Publish

Push the files to github. You can host your website using github pages by naming your repo ``username.github.io``. You can also your cutsom domain.


### Updating

To update your info, simply run

```
$ node update
```
This will update your info and your repository info.

To Update background or theme you need to run `build` command again.


### Add a Blog

To add your first blog run this command, make sure the title don't have spaces instead use "-".

```
$ node blog --title my-first-blog
```

This will create a `my-first-blog` folder inside `blog`. Inside `my-first-blog` you will find an `index.html` file which contains all the necessary elements for writing a blog. Customize the content of the file to write your first blog.

This also adds content to `blog.json` file. This file helps in showcasing your blogs on your personal website as cards. You could customize the JSON object that corresponds your current blog.

Default JSON Format
```
{
  "url_title": "my-first-blog", // the title you provide while creating a new blog, this appears in url
  "title": "Lorem ipsum dolor sit amet", // main title of blog
  "sub_title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", // sub-title of blog
  "top_image": "https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1450", // main image of blog
  "visible": true // don't worry about this
}
```

More Arguments for Blog

```
--subtitle [subtitle] : gives blog a subtitle (Deafult : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
--pagetitle [pagetitle] : gives blog page a title
--folder [folder] : give folder a title
```

> (use "-" instead of spaces)

Card view of blog

<img src="https://i.imgur.com/ys9AMwt.png" width="50%">

### Enable Blogs

Blog are disabled by default. To enable them head over to `assets/index.html` and find `<div id="blog_section" style="display:none;">`. Remove the style attribute to show your blogs on your personal website.

If you have run build command before adding a blog you need have to remove the style attribute from `index.html` file aswell.

## License
![GitHub](https://img.shields.io/github/license/imfunniee/gitfolio.svg)
