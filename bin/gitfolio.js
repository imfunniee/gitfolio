#! /usr/bin/env node
/* Argument parser */
const program = require('commander');
const {buildCommand} = require('../build');
const {updateCommand} = require('../update');
const {blogCommand} = require('../blog');
const {version} = require('../package.json');

program
    .command('build <username>')
    .description('Build site with your GitHub username. This will be used to customize your site')
    .option('-t, --theme [theme]', 'specify a theme to use')
    .option('-b, --background [background]', 'set the background image')
    .option('-f, --fork', 'includes forks with repos')
    .option('-s, --sort [sort]', 'set default sort for repository')
    .option('-o, --order [order]', 'set default order on sort')
    .action(buildCommand)

program
    .command('update')
    .action(updateCommand);

program
    .command('blog <title>')
    .description('Create blog with specified title')
    .option('-s, --subtitle [subtitle]', 'give blog a subtitle', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
    .option('-p, --pagetitle [pagetitle]', 'give blog page a title')
    .option('-f, --folder [folder]', 'give folder a title (use "-" instead of spaces)')
    .action(blogCommand);

program.on('command:*', () => {
    console.log('Unknown Command: ' + program.args.join(' '))
    program.help()
});

program
	.version(version, '-v --version')
	.usage('<command> [options]')
    .parse(process.argv);

if (program.args.length === 0) program.help();
