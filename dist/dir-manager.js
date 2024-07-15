"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDirContents = listDirContents;
exports.createDir = createDir;
exports.createFile = createFile;
exports.writeFile = writeFile;
const fs = require("fs");
const path = require("path");
function listDirContents(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.promises.readdir(filepath);
            const detailedFilesPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                let fileDetails = yield fs.promises.lstat(path.resolve(filepath, file));
                const { size, birthtime } = fileDetails;
                return { filename: file, "size(KB)": size, created_at: birthtime };
            }));
            const detailedFiles = yield Promise.all(detailedFilesPromises);
            console.table(detailedFiles);
        }
        catch (error) {
            console.error("Error occurred while reading the directory!", error);
        }
    });
}
function createDir(filepath) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
    }
}
function createFile(filepath) {
    if (fs.existsSync(filepath)) {
        throw new Error("File already exists");
    }
    else {
        fs.openSync(filepath, "w");
    }
}
function writeFile(filepath, content) {
    if (fs.existsSync(filepath)) {
        throw new Error(`File already exists in path: ${filepath}`);
    }
    else {
        fs.writeFile(filepath, content, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}
//# sourceMappingURL=dir-manager.js.map