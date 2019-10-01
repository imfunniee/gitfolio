#! /usr/bin/env node
/* Argument parser */
const program = require("commander");

process.env.OUT_DIR = process.env.OUT_DIR || process.cwd();

const { buildCommand } = require("../build");
const { updateCommand } = require("../update");
const { uiCommand } = require("../ui");
const { runCommand } = require("../run");
const { version } = require("../package.json");

function collect(val, memo) {
  memo.push(val);
  return memo;
}

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
  .option("-w, --twitter [username]", "specify twitter username")
  .option("-l, --linkedin [username]", "specify linkedin username")
  .option("-m, --medium [username]", "specify medium username")
  .option("-d, --dribbble [username]", "specify dribbble username")
  .action(buildCommand);

program
  .command("update")
  .description("Update user and repository data")
  .action(updateCommand);

program
  .command("ui")
  .description("Create and Manage blogs with ease")
  .action(uiCommand);

program
  .command("run")
  .description("Run build files")
  .option("-p, --port [port]", "provide a port for localhost, default is 3000")
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
