#! /usr/bin/env node
import { createDir, createFile, listDirContents } from './dir-manager';
import { generate } from './generate';

const { Command } = require("commander"); // add this line

const path = require("path");
const figlet = require("figlet");
const pjson = require('./package.json');

const program = new Command();

console.log(figlet.textSync("Angular JSONized"));

program
    .version(pjson.version)
    .description("Custom CLI to generate complex skeleton in angular")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .option("-g, --jsonfile <json file path>", "Generate angular structure from json")
    .parse(process.argv);

const options = program.opts();

if (options.ls) {
    const filepath = typeof options.ls === "string" ? options.ls : __dirname;
    listDirContents(filepath);
}

if (options.mkdir) {
    createDir(path.resolve(__dirname, options.mkdir));
}

if (options.touch) {
    createFile(path.resolve(__dirname, options.touch));
}

if (options.jsonfile) {
    const file = require(`./${options.jsonfile}`);
    if (file)
        generate(file);
}

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
