#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dir_manager_1 = require("./dir-manager");
const generate_1 = require("./generate");
const { Command } = require("commander"); // add this line
const path = require("path");
const figlet = require("figlet");
const program = new Command();
console.log(figlet.textSync("Angular JSONized"));
program
    .version("1.0.7")
    .description("Custom CLI to generate complex skeleton in angular")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .option("-g, --jsonfile <json file path>", "Generate angular structure from json")
    .parse(process.argv);
const options = program.opts();
if (options.ls) {
    const filepath = typeof options.ls === "string" ? options.ls : __dirname;
    (0, dir_manager_1.listDirContents)(filepath);
}
if (options.mkdir) {
    (0, dir_manager_1.createDir)(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
    (0, dir_manager_1.createFile)(path.resolve(__dirname, options.touch));
}
if (options.jsonfile) {
    let file;
    const isAbsolutePath = path.isAbsolute(options.jsonfile);
    if (isAbsolutePath) {
        file = require(`${options.jsonfile}`);
    }
    else {
        file = require(options.jsonfile.startsWith('./') ? `${options.jsonfile}` : options.jsonfile.startsWith('/') ? `.${options.jsonfile}` : `./${options.jsonfile}`);
    }
    if (file)
        (0, generate_1.generate)(file);
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map