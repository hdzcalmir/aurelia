"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualFileSystem = void 0;
function toParts(path) {
    // eslint-disable-next-line no-useless-escape
    return path.split(/[\\\/]/);
}
class VirtualFileSystem {
    constructor() {
        this.root = new Map();
    }
    addFile(path, content) {
        const dir = this.getParentDir(path);
        dir.set(toParts(path)[0], content);
    }
    async realpath(path) {
        return path;
    }
    realpathSync(path) {
        return path;
    }
    async readdir(path, withFileTypes) {
        return this.readdirSync(path, withFileTypes);
    }
    readdirSync(path, withFileTypes) {
        // eslint-disable-next-line no-useless-escape
        const parts = path.split(/[\\\/]/);
        let dir = this.root;
        while (parts.length > 0) {
            const part = parts.shift();
            let subdir = dir.get(part);
            if (subdir === void 0) {
                dir.set(part, subdir = new Map());
            }
            dir = subdir;
        }
        const keys = Array.from(dir.keys());
        if (withFileTypes) {
            return keys.map(k => {
                return {
                    name: k,
                    isFile() {
                        return typeof dir.get(k) === 'string';
                    },
                    isDirectory() {
                        return dir.get(k) instanceof Map;
                    },
                    isSymbolicLink() {
                        return false;
                    },
                };
            });
        }
        return keys;
    }
    async mkdir(path) {
        throw new Error('Method not implemented.');
    }
    mkdirSync(path) {
        throw new Error('Method not implemented.');
    }
    async isReadable(path) {
        throw new Error('Method not implemented.');
    }
    isReadableSync(path) {
        throw new Error('Method not implemented.');
    }
    async fileExists(path) {
        throw new Error('Method not implemented.');
    }
    fileExistsSync(path) {
        throw new Error('Method not implemented.');
    }
    async stat(path) {
        throw new Error('Method not implemented.');
    }
    statSync(path) {
        throw new Error('Method not implemented.');
    }
    async lstat(path) {
        throw new Error('Method not implemented.');
    }
    lstatSync(path) {
        throw new Error('Method not implemented.');
    }
    async readFile(path, encoding, cache, force) {
        throw new Error('Method not implemented.');
    }
    readFileSync(path, encoding, cache, force) {
        throw new Error('Method not implemented.');
    }
    async ensureDir(path) {
        throw new Error('Method not implemented.');
    }
    ensureDirSync(path) {
        throw new Error('Method not implemented.');
    }
    async writeFile(path, content, encoding) {
        throw new Error('Method not implemented.');
    }
    writeFileSync(path, content, encoding) {
        throw new Error('Method not implemented.');
    }
    async rimraf(path) {
        throw new Error('Method not implemented.');
    }
    async getRealPath(path) {
        throw new Error('Method not implemented.');
    }
    getRealPathSync(path) {
        throw new Error('Method not implemented.');
    }
    async getChildren(path) {
        throw new Error('Method not implemented.');
    }
    getChildrenSync(path) {
        throw new Error('Method not implemented.');
    }
    async getFiles(dir, loadContent) {
        throw new Error('Method not implemented.');
    }
    getFilesSync(dir, loadContent) {
        throw new Error('Method not implemented.');
    }
    getParentDir(path) {
        // eslint-disable-next-line no-useless-escape
        const parts = path.split(/[\\\/]/);
        let dir = this.root;
        while (parts.length > 1) {
            const part = parts.shift();
            let subdir = dir.get(part);
            if (subdir === void 0) {
                dir.set(part, subdir = new Map());
            }
            dir = subdir;
        }
        return dir;
    }
}
exports.VirtualFileSystem = VirtualFileSystem;
//# sourceMappingURL=virtual-file-system.js.map