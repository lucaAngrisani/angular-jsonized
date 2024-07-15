const fs = require("fs");
const path = require("path");

export async function listDirContents(filepath: string) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file: string) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });

        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}

export function createDir(filepath: string) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
    }
}

export function createFile(filepath: string) {
    if (fs.existsSync(filepath)) {
        throw new Error("File already exists");
    } else {
        fs.openSync(filepath, "w");
    }
}

export function writeFile(filepath: string, content: string) {
    if (fs.existsSync(filepath)) {
        throw new Error(`File already exists in path: ${filepath}`);
    } else {
        fs.writeFile(filepath, content, (err: Error) => {
            if (err) {
                console.error(err);
            }
        });
    }
}