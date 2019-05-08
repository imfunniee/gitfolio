# GitFolio

### about.me + medium but for every github User

Gitfolio will help get started with a portfolio website where you could showcase your work + a blog that will help you spread your ideas into  real world.

# Getting Started

### Fork this repository

Get yourself a copy of this repository by forking it as `username.github.io` so you could customize it.

### Let's build

a. Clone the repository you just forked using ``git clone`` or just simply download it.

b. Now ``cd`` into the repository you just cloned and run the below command

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

You can host your website using github pages and use a custom domain aswell or simply use `username.github.io`.


### Updating

To update your info, follow the same steps shown in `Let's build` part


### Add a Blog

To add your first blog run this command, make sure the title don't have spaces.

```
$ node blog --title my-first-blog
```

This will create a `my-first-blog` folder inside `blog`. Inside `my-first-blog` you will find an `index.html` file which will all the necessary elements for writing a blog. Customize the content of the file to write your first blog.

This also adds it to `blog.json` file. This files helps in showing blogs on your personal website as cards. You could customize the file content to match your current blog.

Blog are disabled by default. To enable them head over to `assets/index.html` and find `<div id="blog_section" style="display:none;">`. Remove the style attribute to show your blogs on your personal website.

After enabling blogs you need to run the `build` command to update your personal website.


## License
GNU General Public License v3.0
