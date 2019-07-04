#! /usr/bin/env node
/* Argument parser */
const program = require("commander");

process.env.OUT_DIR = process.env.OUT_DIR || process.cwd();

const { buildCommand } = require("../build");
const { updateCommand } = require("../update");
const { blogCommand } = require("../blog");
const { runCommand } = require("../run");
const { version } = require("../package.json");

program
  .command("build <username>")
  .description(
    "Build site with your GitHub username. This will be used to customize your site"
  )
  .option("-t, --theme [theme]", "specify a theme to use", "light")
  .option("-b, --background [background]", "set the background image")
  .option("-f, --fork", "includes forks with repos")
  .option("-s, --sort [sort]", "set default sort for repository", "created")
  .option("-o, --order [order]", "set default order on sort", "asc")
  .option("-i, --ogimage [image]", "set the open graph image", null)
  .option("-x, --twitter [twitter_handle]", "specify your Twitter username.")
  .option("-l, --linkedin [linkedin_handle]", "specify your LinkedIn username.")
  .option("-m, --medium [username]", "specify Medium username")
  .action(buildCommand);

program
  .command("update")
  .description("Update user and repository data")
  .action(updateCommand);

program
  .command("blog <title>")
  .description("Create blog with specified title")
  .option(
    "-s, --subtitle [subtitle]",
    "give blog a subtitle",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  )
  .option("-p, --pagetitle [pagetitle]", "give blog page a title")
  .option(
    "-f, --folder [folder]",
    'give folder a title (use "-" instead of spaces)'
  )
  .action(blogCommand);

program
  .command("run")
  .description("Run build files")
  .action(runCommand);

program.on("command:*", () => {
  console.log("Unknown Command: " + program.args.join(" "));
  program.help();
});

program
  .version(version, "-v --version")
  .usage("<command> [options]")
  .parse(process.argv);

if (program.args.length === 0) program.help();
