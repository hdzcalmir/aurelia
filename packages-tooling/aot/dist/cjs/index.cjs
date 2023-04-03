'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var kernel = require('@aurelia/kernel');
var typescript = require('typescript');
var jsdom = require('jsdom');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

const normalizePath = (function () {
    const cache = Object.create(null);
    const regex = /\\/g;
    return function (path) {
        let normalized = cache[path];
        if (normalized === void 0) {
            normalized = cache[path] = path.replace(regex, '/');
        }
        return normalized;
    };
})();
function joinPath(...paths) {
    return normalizePath(path.join(...paths));
}
function resolvePath(...paths) {
    return normalizePath(path.resolve(...paths));
}
function isRootedDiskPath(path) {
    const ch0 = path.charCodeAt(0);
    return (ch0 === 47
        || (ch0 >= 97
            && ch0 <= 122
            && path.charCodeAt(1) === 58));
}
function isRelativeModulePath(path) {
    const ch0 = path.charCodeAt(0);
    if (ch0 === 46) {
        const ch1 = path.charCodeAt(1);
        if (ch1 === 46) {
            return path.charCodeAt(2) === 47 || path.length === 2;
        }
        return ch1 === 47 || path.length === 1;
    }
    return isRootedDiskPath(path);
}

const { access, lstat, mkdir, readdir, readFile, realpath, rmdir, stat, unlink, writeFile, } = fs.promises;
function compareFilePath(a, b) {
    return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
}
function shouldTraverse(path) {
    return path.charCodeAt(0) !== 46 && path !== 'node_modules';
}
class File {
    constructor(fs, path, dir, rootlessPath, name, shortName, ext) {
        this.fs = fs;
        this.path = path;
        this.dir = dir;
        this.rootlessPath = rootlessPath;
        this.name = name;
        this.shortName = shortName;
        this.ext = ext;
        this.shortPath = `${dir}/${shortName}`;
        switch (ext) {
            case '.js':
            case '.ts':
            case '.d.ts':
            case '.jsx':
            case '.tsx':
                this.kind = 1;
                break;
            case '.html':
                this.kind = 2;
                break;
            case '.css':
                this.kind = 3;
                break;
            case '.json':
                this.kind = 4;
                break;
            default:
                this.kind = 0;
        }
    }
    static getExtension(name) {
        const lastDotIndex = name.lastIndexOf('.');
        if (lastDotIndex <= 0) {
            return void 0;
        }
        const lastPart = name.slice(lastDotIndex);
        switch (lastPart) {
            case '.ts':
                return name.endsWith('.d.ts') ? '.d.ts' : '.ts';
            case '.map': {
                const extensionlessName = name.slice(0, lastDotIndex);
                const secondDotIndex = extensionlessName.lastIndexOf('.');
                if (secondDotIndex === -1) {
                    return void 0;
                }
                return name.slice(secondDotIndex);
            }
            default:
                return lastPart;
        }
    }
    getContent(cache = false, force = false) {
        return this.fs.readFile(this.path, "utf8", cache, force);
    }
    getContentSync(cache = false, force = false) {
        return this.fs.readFileSync(this.path, "utf8", cache, force);
    }
}
const tick = {
    current: void 0,
    wait() {
        if (tick.current === void 0) {
            tick.current = new Promise(function (resolve) {
                setTimeout(function () {
                    tick.current = void 0;
                    resolve();
                });
            });
        }
        return tick.current;
    }
};
exports.NodeFileSystem = class NodeFileSystem {
    constructor(logger) {
        this.logger = logger;
        this.childrenCache = new Map();
        this.realPathCache = new Map();
        this.contentCache = new Map();
        this.pendingReads = 0;
        this.maxConcurrentReads = 0;
        this.logger = logger.scopeTo(this.constructor.name);
        this.logger.info('constructor');
    }
    async realpath(path) {
        this.logger.trace(`realpath(path: ${path})`);
        return realpath(path);
    }
    realpathSync(path) {
        this.logger.trace(`realpathSync(path: ${path})`);
        return fs.realpathSync(path);
    }
    async readdir(path, withFileTypes) {
        this.logger.trace(`readdir(path: ${path}, withFileTypes: ${withFileTypes})`);
        if (withFileTypes === true) {
            return readdir(path, { withFileTypes: true });
        }
        return readdir(path);
    }
    readdirSync(path, withFileTypes) {
        this.logger.trace(`readdirSync(path: ${path}, withFileTypes: ${withFileTypes})`);
        if (withFileTypes === true) {
            return fs.readdirSync(path, { withFileTypes: true });
        }
        return fs.readdirSync(path);
    }
    async mkdir(path) {
        this.logger.trace(`mkdir(path: ${path})`);
        return mkdir(path, { recursive: true });
    }
    mkdirSync(path) {
        this.logger.trace(`mkdirSync(path: ${path})`);
        fs.mkdirSync(path, { recursive: true });
    }
    async isReadable(path) {
        this.logger.trace(`isReadable(path: ${path})`);
        try {
            await access(path, fs.constants.F_OK);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    isReadableSync(path) {
        this.logger.trace(`isReadableSync(path: ${path})`);
        try {
            fs.accessSync(path, fs.constants.F_OK);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    async fileExists(path) {
        this.logger.trace(`fileExists(path: ${path})`);
        try {
            return (await stat(path)).isFile();
        }
        catch (err) {
            return false;
        }
    }
    fileExistsSync(path) {
        this.logger.trace(`fileExistsSync(path: ${path})`);
        try {
            return fs.statSync(path).isFile();
        }
        catch (err) {
            return false;
        }
    }
    async stat(path) {
        this.logger.trace(`stat(path: ${path})`);
        return stat(path);
    }
    statSync(path) {
        this.logger.trace(`statSync(path: ${path})`);
        return fs.statSync(path);
    }
    async lstat(path) {
        this.logger.trace(`lstat(path: ${path})`);
        return lstat(path);
    }
    lstatSync(path) {
        this.logger.trace(`lstatSync(path: ${path})`);
        return fs.lstatSync(path);
    }
    async readFile(path, encoding, cache = false, force = false) {
        this.logger.trace(`readFile(path: ${path}, encoding: ${encoding}, cache: ${cache}, force: ${force})`);
        const contentCache = this.contentCache;
        let content = contentCache.get(path);
        if (content === void 0 || force) {
            try {
                while (this.maxConcurrentReads > 0 && this.maxConcurrentReads < this.pendingReads) {
                    await tick.wait();
                }
                ++this.pendingReads;
                content = await readFile(path, encoding);
                --this.pendingReads;
            }
            catch (err) {
                if (err.code === 'EMFILE') {
                    --this.pendingReads;
                    this.maxConcurrentReads = this.pendingReads;
                    await tick.wait();
                    return this.readFile(path, encoding, cache, force);
                }
                throw err;
            }
            if (cache) {
                contentCache.set(path, content);
            }
        }
        return content;
    }
    readFileSync(path, encoding, cache = false, force = false) {
        this.logger.trace(`readFileSync(path: ${path}, encoding: ${encoding}, cache: ${cache}, force: ${force})`);
        const contentCache = this.contentCache;
        let content = contentCache.get(path);
        if (content === void 0 || force) {
            content = fs.readFileSync(path, encoding);
            if (cache) {
                contentCache.set(path, content);
            }
        }
        return content;
    }
    async ensureDir(path) {
        this.logger.trace(`ensureDir(path: ${path})`);
        if (await new Promise(res => { fs.exists(path, res); })) {
            return;
        }
        return this.mkdir(path);
    }
    ensureDirSync(path) {
        this.logger.trace(`ensureDirSync(path: ${path})`);
        if (fs.existsSync(path)) {
            return;
        }
        this.mkdirSync(path);
    }
    async writeFile(path$1, content, encoding) {
        this.logger.trace(`writeFile(path: ${path$1}, content: ${content}, encoding: ${encoding})`);
        await this.ensureDir(path.dirname(path$1));
        return writeFile(path$1, content, { encoding: encoding });
    }
    writeFileSync(path$1, content, options) {
        this.logger.trace(`readFileSync(path: ${path$1}, content: ${content}, encoding: ${options})`);
        this.ensureDirSync(path.dirname(path$1));
        fs.writeFileSync(path$1, content, options);
    }
    async rimraf(path$1) {
        this.logger.trace(`rimraf(path: ${path$1})`);
        try {
            const stats = await lstat(path$1);
            if (stats.isDirectory()) {
                await Promise.all((await readdir(path$1)).map(async (x) => this.rimraf(path.join(path$1, x))));
                await rmdir(path$1);
            }
            else if (stats.isFile() || stats.isSymbolicLink()) {
                await unlink(path$1);
            }
        }
        catch (err) {
            this.logger.error(`rimraf failed`, err);
        }
    }
    async getRealPath(path) {
        path = normalizePath(path);
        const realPathCache = this.realPathCache;
        let real = realPathCache.get(path);
        if (real === void 0) {
            real = normalizePath(await realpath(path));
            realPathCache.set(path, real);
        }
        return real;
    }
    getRealPathSync(path) {
        path = normalizePath(path);
        const realPathCache = this.realPathCache;
        let real = realPathCache.get(path);
        if (real === void 0) {
            real = normalizePath(fs.realpathSync(path));
            realPathCache.set(path, real);
        }
        return real;
    }
    async getChildren(path) {
        const childrenCache = this.childrenCache;
        let children = childrenCache.get(path);
        if (children === void 0) {
            children = (await readdir(path)).filter(shouldTraverse);
            childrenCache.set(path, children);
        }
        return children;
    }
    getChildrenSync(path) {
        const childrenCache = this.childrenCache;
        let children = childrenCache.get(path);
        if (children === void 0) {
            children = fs.readdirSync(path).filter(shouldTraverse);
            childrenCache.set(path, children);
        }
        return children;
    }
    async getFiles(root, loadContent = false) {
        const files = [];
        const seen = {};
        const walk = async (dir, name) => {
            const path$1 = await this.getRealPath(joinPath(dir, name));
            if (seen[path$1] === void 0) {
                seen[path$1] = true;
                const stats = await stat(path$1);
                if (stats.isFile()) {
                    const ext = File.getExtension(path$1);
                    if (ext !== void 0) {
                        const rootlessPath = path$1.slice(path.dirname(root).length);
                        const shortName = name.slice(0, -ext.length);
                        const file = new File(this, path$1, dir, rootlessPath, name, shortName, ext);
                        if (loadContent) {
                            await this.readFile(path$1, "utf8", true);
                        }
                        files.push(file);
                    }
                }
                else if (stats.isDirectory()) {
                    await Promise.all((await this.getChildren(path$1)).map(async (x) => walk(path$1, x)));
                }
            }
        };
        await Promise.all((await this.getChildren(root)).map(async (x) => walk(root, x)));
        return files.sort(compareFilePath);
    }
    getFilesSync(root, loadContent = false) {
        const files = [];
        const seen = {};
        const walk = (dir, name) => {
            const path$1 = this.getRealPathSync(joinPath(dir, name));
            if (seen[path$1] === void 0) {
                seen[path$1] = true;
                const stats = fs.statSync(path$1);
                if (stats.isFile()) {
                    const ext = File.getExtension(path$1);
                    if (ext !== void 0) {
                        const rootlessPath = path$1.slice(path.dirname(root).length);
                        const shortName = name.slice(0, -ext.length);
                        const file = new File(this, path$1, dir, rootlessPath, name, shortName, ext);
                        if (loadContent) {
                            this.readFileSync(path$1, "utf8", true);
                        }
                        files.push(file);
                    }
                }
                else if (stats.isDirectory()) {
                    this.getChildrenSync(path$1).forEach(x => { walk(path$1, x); });
                }
            }
        };
        this.getChildrenSync(root).forEach(x => { walk(root, x); });
        return files.sort(compareFilePath);
    }
};
exports.NodeFileSystem = __decorate([
    __param(0, kernel.ILogger)
], exports.NodeFileSystem);

exports.Encoding = void 0;
(function (Encoding) {
    Encoding["utf8"] = "utf8";
    Encoding["utf16le"] = "utf16le";
    Encoding["latin1"] = "latin1";
    Encoding["base64"] = "base64";
    Encoding["ascii"] = "ascii";
    Encoding["hex"] = "hex";
    Encoding["raw"] = "raw";
})(exports.Encoding || (exports.Encoding = {}));
exports.FileKind = void 0;
(function (FileKind) {
    FileKind[FileKind["Unknown"] = 0] = "Unknown";
    FileKind[FileKind["Script"] = 1] = "Script";
    FileKind[FileKind["Markup"] = 2] = "Markup";
    FileKind[FileKind["Style"] = 3] = "Style";
    FileKind[FileKind["JSON"] = 4] = "JSON";
})(exports.FileKind || (exports.FileKind = {}));
const IFileSystem = kernel.DI.createInterface('IFileSystem');

var CompletionType;
(function (CompletionType) {
    CompletionType[CompletionType["normal"] = 1] = "normal";
    CompletionType[CompletionType["break"] = 2] = "break";
    CompletionType[CompletionType["continue"] = 3] = "continue";
    CompletionType[CompletionType["return"] = 4] = "return";
    CompletionType[CompletionType["throw"] = 5] = "throw";
})(CompletionType || (CompletionType = {}));
const nextValueId = (function () {
    let id = 0;
    return function () {
        return ++id;
    };
})();
const Int32 = (function () {
    const $ = new Int32Array(1);
    return function (value) {
        $[0] = Number(value);
        return $[0];
    };
})();
const Uint32 = (function () {
    const $ = new Uint32Array(1);
    return function (value) {
        $[0] = Number(value);
        return $[0];
    };
})();
const Int16 = (function () {
    const $ = new Int16Array(1);
    return function (value) {
        $[0] = Number(value);
        return $[0];
    };
})();
const Uint16 = (function () {
    const $ = new Uint16Array(1);
    return function (value) {
        $[0] = Number(value);
        return $[0];
    };
})();
const Int8 = (function () {
    const $ = new Int8Array(1);
    return function (value) {
        $[0] = Number(value);
        return $[0];
    };
})();
const Uint8 = (function () {
    const $ = new Uint8Array(1);
    return function (value) {
        $[0] = Number(value);
        return $[0];
    };
})();
const Uint8Clamp = (function () {
    const $ = new Uint8ClampedArray(1);
    return function (value) {
        $[0] = Number(value);
        return $[0];
    };
})();
function compareIndices(a, b) {
    return a['[[Value]]'] - b['[[Value]]'];
}

let descriptorId = 0;
class $PropertyDescriptor {
    get isAbrupt() { return false; }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return false; }
    get isFunction() { return false; }
    get isAccessorDescriptor() {
        return !this['[[Get]]'].isEmpty || !this['[[Set]]'].isEmpty;
    }
    get isDataDescriptor() {
        return !this['[[Value]]'].isEmpty || !this['[[Writable]]'].isEmpty;
    }
    get isGenericDescriptor() {
        return (this['[[Get]]'].isEmpty &&
            this['[[Set]]'].isEmpty &&
            this['[[Value]]'].isEmpty &&
            this['[[Writable]]'].isEmpty);
    }
    constructor(realm, name, config) {
        this.realm = realm;
        this.name = name;
        this.id = ++descriptorId;
        const $empty = realm['[[Intrinsics]]'].empty;
        this['[[Enumerable]]'] = $empty;
        this['[[Configurable]]'] = $empty;
        this['[[Get]]'] = $empty;
        this['[[Set]]'] = $empty;
        this['[[Value]]'] = $empty;
        this['[[Writable]]'] = $empty;
        Object.assign(this, config);
    }
    Complete(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (this.isGenericDescriptor || this.isDataDescriptor) {
            if (this['[[Value]]'].isEmpty) {
                this['[[Value]]'] = intrinsics.undefined;
            }
            if (this['[[Writable]]'].isEmpty) {
                this['[[Writable]]'] = intrinsics.false;
            }
        }
        else {
            if (this['[[Get]]'].isEmpty) {
                this['[[Get]]'] = intrinsics.undefined;
            }
            if (this['[[Set]]'].isEmpty) {
                this['[[Set]]'] = intrinsics.undefined;
            }
        }
        if (this['[[Enumerable]]'].isEmpty) {
            this['[[Enumerable]]'] = intrinsics.false;
        }
        if (this['[[Configurable]]'].isEmpty) {
            this['[[Configurable]]'] = intrinsics.false;
        }
        return this;
    }
    dispose() {
        this['[[Enumerable]]'] = void 0;
        this['[[Configurable]]'] = void 0;
        this['[[Get]]'] = void 0;
        this['[[Set]]'] = void 0;
        this['[[Writable]]'] = void 0;
        this['[[Value]]'] = void 0;
    }
}
function $IsDataDescriptor(Desc) {
    if (Desc.isUndefined) {
        return false;
    }
    return Desc.isDataDescriptor;
}

class $Number {
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return 'Number'; }
    get isNaN() { return isNaN(this['[[Value]]']); }
    get isPositiveZero() { return Object.is(this['[[Value]]'], +0); }
    get isNegativeZero() { return Object.is(this['[[Value]]'], -0); }
    get isPositiveInfinity() { return Object.is(this['[[Value]]'], +Infinity); }
    get isNegativeInfinity() { return Object.is(this['[[Value]]'], -Infinity); }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return true; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return true; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return this['[[Value]]'] !== 0 && !isNaN(this['[[Value]]']); }
    get isFalsey() { return this['[[Value]]'] === 0 || isNaN(this['[[Value]]']); }
    get isSpeculative() { return false; }
    get hasValue() { return true; }
    get isList() { return false; }
    constructor(realm, value, type = 1, target = realm['[[Intrinsics]]'].empty, sourceNode = null, conversionSource = null) {
        this.realm = realm;
        this.sourceNode = sourceNode;
        this.conversionSource = conversionSource;
        this.id = nextValueId();
        this.IntrinsicName = 'number';
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this['[[Value]]'] = value;
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    is(other) {
        return other instanceof $Number && Object.is(this['[[Value]]'], other['[[Value]]']);
    }
    enrichWith(ctx, node) {
        if (this['[[Type]]'] === 5) {
            this.nodeStack.push(node);
            if (this.ctx === null) {
                this.ctx = ctx;
                this.stack = ctx.Realm.stack.toString();
            }
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return String(this['[[Value]]']);
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    equals(other) {
        return Object.is(this['[[Value]]'], other['[[Value]]']);
    }
    get IsInteger() {
        if (isNaN(this['[[Value]]']) || Object.is(this['[[Value]]'], Infinity) || Object.is(this['[[Value]]'], -Infinity)) {
            return false;
        }
        return Math.floor(Math.abs(this['[[Value]]'])) === Math.abs(this['[[Value]]']);
    }
    ToObject(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return $Object.ObjectCreate(ctx, 'number', intrinsics['%NumberPrototype%'], {
            '[[NumberData]]': this,
        });
    }
    ToPropertyKey(ctx) {
        return this.ToString(ctx);
    }
    ToPrimitive(ctx) {
        return this;
    }
    ToBoolean(ctx) {
        return new $Boolean(this.realm, Boolean(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToNumber(ctx) {
        return this;
    }
    ToInteger(ctx) {
        const value = this['[[Value]]'];
        if (isNaN(value)) {
            return new $Number(this.realm, 0, this['[[Type]]'], this['[[Target]]'], null, this);
        }
        if (Object.is(value, +0) || Object.is(value, -0) || Object.is(value, +Infinity) || Object.is(value, -Infinity)) {
            return this;
        }
        const sign = value < 0 ? -1 : 1;
        return new $Number(this.realm, Math.floor(Math.abs(value)) * sign, this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToLength(ctx) {
        const len = this.ToInteger(ctx);
        if (len.isAbrupt) {
            return len;
        }
        if (len['[[Value]]'] < 0) {
            return new $Number(this.realm, 0, this['[[Type]]'], this['[[Target]]'], null, this);
        }
        if (len['[[Value]]'] > (2 ** 53 - 1)) {
            return new $Number(this.realm, (2 ** 53 - 1), this['[[Type]]'], this['[[Target]]'], null, this);
        }
        return this;
    }
    ToInt32(ctx) {
        return new $Number(this.realm, Int32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint32(ctx) {
        return new $Number(this.realm, Uint32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt16(ctx) {
        return new $Number(this.realm, Int16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint16(ctx) {
        return new $Number(this.realm, Uint16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt8(ctx) {
        return new $Number(this.realm, Int8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8(ctx) {
        return new $Number(this.realm, Uint8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8Clamp(ctx) {
        return new $Number(this.realm, Uint8Clamp(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToString(ctx) {
        return new $String(this.realm, String(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    GetValue(ctx) {
        return this;
    }
}

class $String {
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return 'String'; }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return true; }
    get isSymbol() { return false; }
    get isPrimitive() { return true; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return this['[[Value]]'].length > 0; }
    get isFalsey() { return this['[[Value]]'].length === 0; }
    get isSpeculative() { return false; }
    get hasValue() { return true; }
    get isAmbiguous() {
        if (this['[[Value]]'] !== 'ambiguous') {
            throw new Error(`Expected "${this['[[Value]]']}" to be "ambiguous"`);
        }
        return true;
    }
    get isList() { return false; }
    CanonicalNumericIndexString(ctx) {
        if (this['[[Value]]'] === '-0') {
            return this.realm['[[Intrinsics]]']['-0'];
        }
        const n = this.ToNumber(ctx);
        if (n.ToString(ctx).is(this)) {
            return n;
        }
        return this.realm['[[Intrinsics]]'].undefined;
    }
    get IsArrayIndex() {
        if (this['[[Value]]'] === '-0') {
            return false;
        }
        const num = Number(this['[[Value]]']);
        if (num.toString() === this['[[Value]]']) {
            return num >= 0 && num <= (2 ** 32 - 1);
        }
        return false;
    }
    constructor(realm, value, type = 1, target = realm['[[Intrinsics]]'].empty, sourceNode = null, conversionSource = null) {
        this.realm = realm;
        this.sourceNode = sourceNode;
        this.conversionSource = conversionSource;
        this.id = nextValueId();
        this.IntrinsicName = 'string';
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this['[[Value]]'] = value;
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    is(other) {
        return other instanceof $String && this['[[Value]]'] === other['[[Value]]'];
    }
    enrichWith(ctx, node) {
        if (this['[[Type]]'] === 5) {
            this.nodeStack.push(node);
            if (this.ctx === null) {
                this.ctx = ctx;
                this.stack = ctx.Realm.stack.toString();
            }
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return `"${this['[[Value]]']}"`;
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    ToObject(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return $Object.ObjectCreate(ctx, 'string', intrinsics['%StringPrototype%'], {
            '[[StringData]]': this,
        });
    }
    ToPropertyKey(ctx) {
        return this.ToString(ctx);
    }
    ToLength(ctx) {
        return this.ToNumber(ctx).ToLength(ctx);
    }
    ToPrimitive(ctx) {
        return this;
    }
    ToBoolean(ctx) {
        return new $Boolean(this.realm, Boolean(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToNumber(ctx) {
        return new $Number(this.realm, Number(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt32(ctx) {
        return new $Number(this.realm, Int32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint32(ctx) {
        return new $Number(this.realm, Uint32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt16(ctx) {
        return new $Number(this.realm, Int16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint16(ctx) {
        return new $Number(this.realm, Uint16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt8(ctx) {
        return new $Number(this.realm, Int8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8(ctx) {
        return new $Number(this.realm, Uint8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8Clamp(ctx) {
        return new $Number(this.realm, Uint8Clamp(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToString(ctx) {
        return this;
    }
    GetValue(ctx) {
        return this;
    }
}

class $Error {
    get isAbrupt() { return true; }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return true; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return true; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return this['[[Value]]']; }
    get isFalsey() { return !this['[[Value]]']; }
    get isSpeculative() { return false; }
    get hasValue() { return true; }
    get isList() { return false; }
    constructor(realm, err, intrinsicName) {
        this.realm = realm;
        this.id = nextValueId();
        this['[[Type]]'] = 5;
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this.IntrinsicName = intrinsicName;
        this['[[Value]]'] = err;
        this['[[Target]]'] = realm['[[Intrinsics]]'].empty;
    }
    is(other) {
        return other instanceof $Error && other.id === this.id;
    }
    enrichWith(ctx, node) {
        this.nodeStack.push(node);
        if (this.ctx === null) {
            this.ctx = ctx;
            this.stack = ctx.Realm.stack.toString();
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return String(this['[[Value]]']);
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        return this;
    }
    GetValue(ctx) {
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    ToObject(ctx) {
        return this;
    }
    ToPropertyKey(ctx) {
        return this;
    }
    ToLength(ctx) {
        return this;
    }
    ToPrimitive(ctx) {
        return this;
    }
    ToBoolean(ctx) {
        return this;
    }
    ToNumber(ctx) {
        return this;
    }
    ToInt32(ctx) {
        return this;
    }
    ToUint32(ctx) {
        return this;
    }
    ToInt16(ctx) {
        return this;
    }
    ToUint16(ctx) {
        return this;
    }
    ToInt8(ctx) {
        return this;
    }
    ToUint8(ctx) {
        return this;
    }
    ToUint8Clamp(ctx) {
        return this;
    }
    ToString(ctx) {
        return this;
    }
}
class $SyntaxError extends $Error {
    constructor(realm, message = void 0) {
        super(realm, new SyntaxError(message), 'SyntaxError');
    }
}
class $TypeError extends $Error {
    constructor(realm, message = void 0) {
        super(realm, new TypeError(message), 'TypeError');
    }
}
class $ReferenceError extends $Error {
    constructor(realm, message = void 0) {
        super(realm, new ReferenceError(message), 'ReferenceError');
    }
}
class $RangeError extends $Error {
    constructor(realm, message = void 0) {
        super(realm, new RangeError(message), 'RangeError');
    }
}
class $URIError extends $Error {
    constructor(realm, message = void 0) {
        super(realm, new URIError(message), 'URIError');
    }
}

class $List extends Array {
    get isAbrupt() { return false; }
    get isList() { return true; }
    constructor(...items) {
        super(...items);
    }
    $copy() {
        return new $List(...this);
    }
    $contains(item) {
        return this.some(x => x.is(item));
    }
    GetValue(ctx) {
        return this;
    }
    enrichWith(ctx, node) {
        return this;
    }
    is(other) {
        return this === other;
    }
}

const empty = Symbol('empty');
class $Empty {
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return new $TypeError(this.realm, `[[empty]] has no Type`); }
    get isEmpty() { return true; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return false; }
    get isFalsey() { return true; }
    get isSpeculative() { return false; }
    get hasValue() { return false; }
    get isList() { return false; }
    constructor(realm, type = 1, target = realm['[[Intrinsics]]'].empty, sourceNode = null) {
        this.realm = realm;
        this.sourceNode = sourceNode;
        this.id = nextValueId();
        this.IntrinsicName = 'empty';
        this['[[Value]]'] = empty;
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    is(other) {
        return other instanceof $Empty;
    }
    enrichWith(ctx, node) {
        return this;
    }
    [Symbol.toPrimitive]() {
        return '[[empty]]';
    }
    [Symbol.toStringTag]() {
        return '[object [[empty]]]';
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return value.ToCompletion(this['[[Type]]'], this['[[Target]]']);
    }
    ToObject(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to object`);
    }
    ToPropertyKey(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to property key`);
    }
    ToLength(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to length`);
    }
    ToPrimitive(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to primitive`);
    }
    ToBoolean(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to boolean`);
    }
    ToNumber(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to number`);
    }
    ToInt32(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to Int32`);
    }
    ToUint32(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to Uint32`);
    }
    ToInt16(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to Int16`);
    }
    ToUint16(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to Uint16`);
    }
    ToInt8(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to Int8`);
    }
    ToUint8(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to Uint8`);
    }
    ToUint8Clamp(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to Uint8Clamp`);
    }
    ToString(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] cannot be converted to string`);
    }
    GetValue(ctx) {
        return new $TypeError(ctx.Realm, `[[empty]] has no value`);
    }
}

function $Set(ctx, O, P, V, Throw) {
    const success = O['[[Set]]'](ctx, P, V, O);
    if (success.isAbrupt) {
        return success;
    }
    if (success.isFalsey && Throw.isTruthy) {
        return new $TypeError(ctx.Realm, `Cannot set property ${P}`);
    }
    return success;
}
function $GetV(ctx, V, P) {
    const O = V.ToObject(ctx);
    if (O.isAbrupt) {
        return O;
    }
    return O['[[Get]]'](ctx, P, V);
}
function $GetMethod(ctx, V, P) {
    const func = $GetV(ctx, V, P);
    if (func.isAbrupt) {
        return func;
    }
    if (func.isNil) {
        return ctx.Realm['[[Intrinsics]]'].undefined;
    }
    if (!func.isFunction) {
        return new $TypeError(ctx.Realm, `Property ${P} of ${V} is ${func}, but expected a callable function`);
    }
    return func;
}
function $CreateDataProperty(ctx, O, P, V) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const newDesc = new $PropertyDescriptor(realm, P);
    newDesc['[[Value]]'] = V;
    newDesc['[[Writable]]'] = intrinsics.true;
    newDesc['[[Enumerable]]'] = intrinsics.true;
    newDesc['[[Configurable]]'] = intrinsics.true;
    return O['[[DefineOwnProperty]]'](ctx, P, newDesc);
}
function $OrdinarySetWithOwnDescriptor(ctx, O, P, V, Receiver, ownDesc) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (ownDesc.isUndefined) {
        const parent = O['[[GetPrototypeOf]]'](ctx);
        if (parent.isAbrupt) {
            return parent;
        }
        if (!parent.isNull) {
            return parent['[[Set]]'](ctx, P, V, Receiver);
        }
        else {
            ownDesc = new $PropertyDescriptor(realm, P);
            ownDesc['[[Value]]'] = intrinsics.undefined;
            ownDesc['[[Writable]]'] = intrinsics.true;
            ownDesc['[[Enumerable]]'] = intrinsics.true;
            ownDesc['[[Configurable]]'] = intrinsics.true;
        }
    }
    if (ownDesc.isDataDescriptor) {
        if (ownDesc['[[Writable]]'].isFalsey) {
            return intrinsics.false;
        }
        if (!Receiver.isObject) {
            return intrinsics.false;
        }
        const existingDescriptor = Receiver['[[GetOwnProperty]]'](ctx, P);
        if (existingDescriptor.isAbrupt) {
            return existingDescriptor;
        }
        if (!existingDescriptor.isUndefined) {
            if (existingDescriptor.isAccessorDescriptor) {
                return intrinsics.false;
            }
            if (existingDescriptor['[[Writable]]'].isFalsey) {
                return intrinsics.false;
            }
            const valueDesc = new $PropertyDescriptor(realm, P);
            valueDesc['[[Value]]'] = V;
            return Receiver['[[DefineOwnProperty]]'](ctx, P, valueDesc);
        }
        else {
            return $CreateDataProperty(ctx, Receiver, P, V);
        }
    }
    const setter = ownDesc['[[Set]]'];
    if (setter.isUndefined) {
        return intrinsics.false;
    }
    $Call(ctx, setter, Receiver, new $List(V));
    return intrinsics.true;
}
function $HasOwnProperty(ctx, O, P) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const desc = O['[[GetOwnProperty]]'](ctx, P);
    if (desc.isAbrupt) {
        return desc;
    }
    if (desc.isUndefined) {
        return intrinsics.false;
    }
    return intrinsics.true;
}
function $Call(ctx, F, V, argumentsList) {
    if (!argumentsList.isList) {
        argumentsList = new $List();
    }
    if (!F.isFunction) {
        return new $TypeError(ctx.Realm, `${F} is not callable`);
    }
    return F['[[Call]]'](ctx, V, argumentsList);
}
function $Construct(ctx, F, argumentsList, newTarget) {
    if (newTarget.isUndefined) {
        newTarget = F;
    }
    if (!argumentsList.isList) {
        argumentsList = new $List();
    }
    return F['[[Construct]]'](ctx, argumentsList, newTarget);
}
function $DefinePropertyOrThrow(ctx, O, P, desc) {
    const success = O['[[DefineOwnProperty]]'](ctx, P, desc);
    if (success.isAbrupt) {
        return success;
    }
    if (success.isFalsey) {
        return new $TypeError(ctx.Realm, `Failed to define property ${P} on ${O}`);
    }
    return success;
}
function $ValidateAndApplyPropertyDescriptor(ctx, O, P, extensible, Desc, current) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (current.isUndefined) {
        if (extensible.isFalsey) {
            return intrinsics.false;
        }
        if (Desc.isGenericDescriptor || Desc.isDataDescriptor) {
            if (!O.isUndefined) {
                const newDesc = new $PropertyDescriptor(realm, P);
                if (Desc['[[Value]]'].isEmpty) {
                    newDesc['[[Value]]'] = intrinsics.undefined;
                }
                else {
                    newDesc['[[Value]]'] = Desc['[[Value]]'];
                }
                if (Desc['[[Writable]]'].isEmpty) {
                    newDesc['[[Writable]]'] = intrinsics.false;
                }
                else {
                    newDesc['[[Writable]]'] = Desc['[[Writable]]'];
                }
                if (Desc['[[Enumerable]]'].isEmpty) {
                    newDesc['[[Enumerable]]'] = intrinsics.false;
                }
                else {
                    newDesc['[[Enumerable]]'] = Desc['[[Enumerable]]'];
                }
                if (Desc['[[Configurable]]'].isEmpty) {
                    newDesc['[[Configurable]]'] = intrinsics.false;
                }
                else {
                    newDesc['[[Configurable]]'] = Desc['[[Configurable]]'];
                }
                O['setProperty'](newDesc);
            }
        }
        else {
            if (!O.isUndefined) {
                const newDesc = new $PropertyDescriptor(realm, P);
                if (Desc['[[Get]]'].isEmpty) {
                    newDesc['[[Get]]'] = intrinsics.undefined;
                }
                else {
                    newDesc['[[Get]]'] = Desc['[[Get]]'];
                }
                if (Desc['[[Set]]'].isEmpty) {
                    newDesc['[[Set]]'] = intrinsics.undefined;
                }
                else {
                    newDesc['[[Set]]'] = Desc['[[Set]]'];
                }
                if (Desc['[[Enumerable]]'].isEmpty) {
                    newDesc['[[Enumerable]]'] = intrinsics.false;
                }
                else {
                    newDesc['[[Enumerable]]'] = Desc['[[Enumerable]]'];
                }
                if (Desc['[[Configurable]]'].isEmpty) {
                    newDesc['[[Configurable]]'] = intrinsics.false;
                }
                else {
                    newDesc['[[Configurable]]'] = Desc['[[Configurable]]'];
                }
                O['setProperty'](newDesc);
            }
        }
        return intrinsics.true;
    }
    if (Desc['[[Configurable]]'].isEmpty &&
        Desc['[[Enumerable]]'].isEmpty &&
        Desc['[[Writable]]'].isEmpty &&
        Desc['[[Value]]'].isEmpty &&
        Desc['[[Get]]'].isEmpty &&
        Desc['[[Set]]'].isEmpty) {
        return intrinsics.true;
    }
    if (current['[[Configurable]]'].isFalsey) {
        if (Desc['[[Configurable]]'].isTruthy) {
            return intrinsics.false;
        }
        if (!Desc['[[Enumerable]]'].isEmpty && current['[[Enumerable]]'].isTruthy === Desc['[[Enumerable]]'].isFalsey) {
            return intrinsics.false;
        }
    }
    if (Desc.isGenericDescriptor) ;
    else if (current.isDataDescriptor !== Desc.isDataDescriptor) {
        if (current['[[Configurable]]'].isFalsey) {
            return intrinsics.false;
        }
        if (current.isDataDescriptor) {
            if (!O.isUndefined) {
                const existingDesc = O['getProperty'](P);
                const newDesc = new $PropertyDescriptor(realm, P);
                newDesc['[[Configurable]]'] = existingDesc['[[Configurable]]'];
                newDesc['[[Enumerable]]'] = existingDesc['[[Enumerable]]'];
                newDesc['[[Get]]'] = intrinsics.undefined;
                newDesc['[[Set]]'] = intrinsics.undefined;
                O['setProperty'](newDesc);
            }
        }
        else {
            if (!O.isUndefined) {
                const existingDesc = O['getProperty'](P);
                const newDesc = new $PropertyDescriptor(realm, P);
                newDesc['[[Configurable]]'] = existingDesc['[[Configurable]]'];
                newDesc['[[Enumerable]]'] = existingDesc['[[Enumerable]]'];
                newDesc['[[Writable]]'] = intrinsics.false;
                newDesc['[[Value]]'] = intrinsics.undefined;
                O['setProperty'](newDesc);
            }
        }
    }
    else if (current.isDataDescriptor && Desc.isDataDescriptor) {
        if (current['[[Configurable]]'].isFalsey && current['[[Writable]]'].isFalsey) {
            if (Desc['[[Writable]]'].isTruthy) {
                return intrinsics.false;
            }
            if (!Desc['[[Value]]'].isEmpty && !Desc['[[Value]]'].is(current['[[Value]]'])) {
                return intrinsics.false;
            }
            return intrinsics.true;
        }
    }
    else {
        if (current['[[Configurable]]'].isFalsey) {
            if (!Desc['[[Set]]'].isEmpty && !Desc['[[Set]]'].is(current['[[Set]]'])) {
                return intrinsics.false;
            }
            if (!Desc['[[Get]]'].isEmpty && !Desc['[[Get]]'].is(current['[[Get]]'])) {
                return intrinsics.false;
            }
            return intrinsics.true;
        }
    }
    if (!O.isUndefined) {
        const existingDesc = O['getProperty'](P);
        if (!Desc['[[Configurable]]'].isEmpty) {
            existingDesc['[[Configurable]]'] = Desc['[[Configurable]]'];
        }
        if (!Desc['[[Enumerable]]'].isEmpty) {
            existingDesc['[[Enumerable]]'] = Desc['[[Enumerable]]'];
        }
        if (!Desc['[[Writable]]'].isEmpty) {
            existingDesc['[[Writable]]'] = Desc['[[Writable]]'];
        }
        if (!Desc['[[Value]]'].isEmpty) {
            existingDesc['[[Value]]'] = Desc['[[Value]]'];
        }
        if (!Desc['[[Get]]'].isEmpty) {
            existingDesc['[[Get]]'] = Desc['[[Get]]'];
        }
        if (!Desc['[[Set]]'].isEmpty) {
            existingDesc['[[Set]]'] = Desc['[[Set]]'];
        }
    }
    return intrinsics.true;
}
function $SetImmutablePrototype(ctx, O, V) {
    const intrinsics = O.realm['[[Intrinsics]]'];
    const current = O['[[GetPrototypeOf]]'](ctx);
    if (current.isAbrupt) {
        return current;
    }
    if (V.is(current)) {
        return intrinsics.true;
    }
    return intrinsics.false;
}
function $AbstractRelationalComparison(ctx, leftFirst, x, y) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    let px;
    let py;
    if (leftFirst) {
        px = x.ToPrimitive(ctx, 'number');
        if (px.isAbrupt) {
            return px;
        }
        py = y.ToPrimitive(ctx, 'number');
        if (py.isAbrupt) {
            return py;
        }
    }
    else {
        py = y.ToPrimitive(ctx, 'number');
        if (py.isAbrupt) {
            return py;
        }
        px = x.ToPrimitive(ctx, 'number');
        if (px.isAbrupt) {
            return px;
        }
    }
    if (px.isString && py.isString) {
        if (px['[[Value]]'] < py['[[Value]]']) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    const nx = px.ToNumber(ctx);
    if (nx.isAbrupt) {
        return nx;
    }
    const ny = py.ToNumber(ctx);
    if (ny.isAbrupt) {
        return ny;
    }
    if (nx.isNaN) {
        return intrinsics.undefined;
    }
    if (ny.isNaN) {
        return intrinsics.undefined;
    }
    if (nx.equals(ny)) {
        return intrinsics.false;
    }
    if (nx.isPositiveZero && ny.isNegativeZero) {
        return intrinsics.false;
    }
    if (nx.isNegativeZero && ny.isPositiveZero) {
        return intrinsics.false;
    }
    if (nx.isPositiveInfinity) {
        return intrinsics.false;
    }
    if (ny.isPositiveInfinity) {
        return intrinsics.true;
    }
    if (ny.isNegativeInfinity) {
        return intrinsics.false;
    }
    if (nx.isNegativeInfinity) {
        return intrinsics.true;
    }
    if (px['[[Value]]'] < py['[[Value]]']) {
        return intrinsics.true;
    }
    return intrinsics.false;
}
function $AbstractEqualityComparison(ctx, x, y) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (x.constructor === y.constructor) {
        return $StrictEqualityComparison(ctx, x, y);
    }
    if (x.isNil && y.isNil) {
        return intrinsics.true;
    }
    if (x.isNumber && y.isString) {
        if (x.is(y.ToNumber(ctx))) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    if (x.isString && y.isNumber) {
        if (x.ToNumber(ctx).is(y)) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    if (x.isBoolean) {
        if (x.ToNumber(ctx).is(y)) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    if (y.isBoolean) {
        if (x.is(y.ToNumber(ctx))) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    if ((x.isString || x.isNumber || x.isSymbol) && y.isObject) {
        const yPrim = y.ToPrimitive(ctx);
        if (yPrim.isAbrupt) {
            return yPrim;
        }
        if (x.is(yPrim)) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    if (x.isObject && (y.isString || y.isNumber || y.isSymbol)) {
        if (x.ToPrimitive(ctx).is(y)) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    return intrinsics.false;
}
function $StrictEqualityComparison(ctx, x, y) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (x.is(y)) {
        return intrinsics.true;
    }
    return intrinsics.false;
}
function $InstanceOfOperator(ctx, V, target) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (!target.isObject) {
        return new $TypeError(realm, `Right-hand side of 'instanceof' operator is ${target}, but expected an object`);
    }
    const instOfhandler = target.GetMethod(ctx, intrinsics['@@hasInstance']);
    if (instOfhandler.isAbrupt) {
        return instOfhandler;
    }
    if (!instOfhandler.isUndefined) {
        return $Call(ctx, instOfhandler, target, new $List(V)).ToBoolean(ctx);
    }
    if (!target.isFunction) {
        return new $TypeError(realm, `Right-hand side of 'instanceof' operator is ${target}, but expected a callable function`);
    }
    return $OrdinaryHasInstance(ctx, target, V);
}
function $OrdinaryHasInstance(ctx, C, O) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (!C.isFunction) {
        return intrinsics.false;
    }
    if (C.isBoundFunction) {
        const BC = C['[[BoundTargetFunction]]'];
        return $InstanceOfOperator(ctx, O, BC);
    }
    if (!O.isObject) {
        return intrinsics.false;
    }
    const P = C['[[Get]]'](ctx, intrinsics.$prototype, C);
    if (P.isAbrupt) {
        return P;
    }
    if (!P.isObject) {
        return new $TypeError(realm, `Prototype of right-hand side of 'instanceof' operator ${O} is ${P}, but expected an object`);
    }
    while (true) {
        const $O = O['[[GetPrototypeOf]]'](ctx);
        if ($O.isAbrupt) {
            return $O;
        }
        O = $O;
        if (O.isNull) {
            return intrinsics.false;
        }
        if (P.is(O)) {
            return intrinsics.true;
        }
    }
}
function $ToPropertyDescriptor(ctx, Obj, key) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (!Obj.isObject) {
        return new $TypeError(realm, `Cannot convert ${Obj} to property descriptor for property ${key}: expected an object`);
    }
    const desc = new $PropertyDescriptor(Obj.realm, key);
    const hasEnumerable = Obj['[[HasProperty]]'](ctx, intrinsics.$enumerable);
    if (hasEnumerable.isAbrupt) {
        return hasEnumerable;
    }
    if (hasEnumerable.isTruthy) {
        const enumerable = Obj['[[Get]]'](ctx, intrinsics.$enumerable, Obj).ToBoolean(ctx);
        if (enumerable.isAbrupt) {
            return enumerable;
        }
        desc['[[Enumerable]]'] = enumerable;
    }
    const hasConfigurable = Obj['[[HasProperty]]'](ctx, intrinsics.$configurable);
    if (hasConfigurable.isAbrupt) {
        return hasConfigurable;
    }
    if (hasConfigurable.isTruthy) {
        const configurable = Obj['[[Get]]'](ctx, intrinsics.$configurable, Obj).ToBoolean(ctx);
        if (configurable.isAbrupt) {
            return configurable;
        }
        desc['[[Enumerable]]'] = configurable;
    }
    const hasValue = Obj['[[HasProperty]]'](ctx, intrinsics.$value);
    if (hasValue.isAbrupt) {
        return hasValue;
    }
    if (hasValue.isTruthy) {
        const value = Obj['[[Get]]'](ctx, intrinsics.$value, Obj).ToBoolean(ctx);
        if (value.isAbrupt) {
            return value;
        }
        desc['[[Enumerable]]'] = value;
    }
    const hasWritable = Obj['[[HasProperty]]'](ctx, intrinsics.$writable);
    if (hasWritable.isAbrupt) {
        return hasWritable;
    }
    if (hasWritable.isTruthy) {
        const writable = Obj['[[Get]]'](ctx, intrinsics.$writable, Obj).ToBoolean(ctx);
        if (writable.isAbrupt) {
            return writable;
        }
        desc['[[Enumerable]]'] = writable;
    }
    const hasGet = Obj['[[HasProperty]]'](ctx, intrinsics.$get);
    if (hasGet.isAbrupt) {
        return hasGet;
    }
    if (hasGet.isTruthy) {
        const getter = Obj['[[Get]]'](ctx, intrinsics.$get, Obj);
        if (getter.isAbrupt) {
            return getter;
        }
        if (!getter.isFunction && !getter.isUndefined) {
            return new $TypeError(realm, `Cannot convert ${Obj} to property descriptor for property ${key}: the getter is neither a callable function nor undefined`);
        }
        desc['[[Get]]'] = getter;
    }
    const hasSet = Obj['[[HasProperty]]'](ctx, intrinsics.$set);
    if (hasSet.isAbrupt) {
        return hasSet;
    }
    if (hasSet.isTruthy) {
        const setter = Obj['[[Get]]'](ctx, intrinsics.$set, Obj);
        if (setter.isAbrupt) {
            return setter;
        }
        if (!setter.isFunction && !setter.isUndefined) {
            return new $TypeError(realm, `Cannot convert ${Obj} to property descriptor for property ${key}: the setter is neither a callable function nor undefined`);
        }
        desc['[[Set]]'] = setter;
    }
    if (desc['[[Get]]'].hasValue || desc['[[Set]]'].hasValue) {
        if (desc['[[Value]]'].hasValue || desc['[[Writable]]'].hasValue) {
            return new $TypeError(realm, `Cannot convert ${Obj} to property descriptor for property ${key}: there is a getter and/or setter, as well as a writable and/or value property`);
        }
    }
    return desc;
}
function $FromPropertyDescriptor(ctx, Desc) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (Desc.isUndefined) {
        return intrinsics.undefined;
    }
    const obj = $Object.ObjectCreate(ctx, 'PropertyDescriptor', intrinsics['%ObjectPrototype%']);
    if (Desc['[[Value]]'].hasValue) {
        $CreateDataProperty(ctx, obj, intrinsics.$value, Desc['[[Value]]']);
    }
    if (Desc['[[Writable]]'].hasValue) {
        $CreateDataProperty(ctx, obj, intrinsics.$writable, Desc['[[Writable]]']);
    }
    if (Desc['[[Get]]'].hasValue) {
        $CreateDataProperty(ctx, obj, intrinsics.$get, Desc['[[Get]]']);
    }
    if (Desc['[[Set]]'].hasValue) {
        $CreateDataProperty(ctx, obj, intrinsics.$set, Desc['[[Set]]']);
    }
    if (Desc['[[Enumerable]]'].hasValue) {
        $CreateDataProperty(ctx, obj, intrinsics.$enumerable, Desc['[[Enumerable]]']);
    }
    if (Desc['[[Configurable]]'].hasValue) {
        $CreateDataProperty(ctx, obj, intrinsics.$configurable, Desc['[[Configurable]]']);
    }
    return obj;
}
const defaultElementTypes = [
    'Undefined',
    'Null',
    'Boolean',
    'String',
    'Symbol',
    'Number',
    'Object',
];
function $CreateListFromArrayLike(ctx, obj, elementTypes = defaultElementTypes) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (!obj.isObject) {
        return new $TypeError(realm, `Cannot convert ${obj} to list: expected an object`);
    }
    const len = obj['[[Get]]'](ctx, intrinsics.length, obj).ToLength(ctx);
    if (len.isAbrupt) {
        return len;
    }
    const list = new $List();
    let index = 0;
    while (index < len['[[Value]]']) {
        const indexName = new $String(realm, index.toString());
        const next = obj['[[Get]]'](ctx, indexName, obj);
        if (next.isAbrupt) {
            return next;
        }
        if (!elementTypes.includes(next.Type)) {
            return new $TypeError(realm, `Cannot convert ${obj} to list: one of the elements (${next}) is of type ${next.Type}, but expected one of: ${elementTypes}`);
        }
        list[index++] = next;
    }
    return list;
}
function $CopyDataProperties(ctx, target, source, excludedItems) {
    if (source.isNil) {
        return target;
    }
    const from = source.ToObject(ctx);
    const keys = from['[[OwnPropertyKeys]]'](ctx);
    if (keys.isAbrupt) {
        return keys;
    }
    for (const nextKey of keys) {
        if (!excludedItems.some(x => x.is(nextKey))) {
            const desc = from['[[GetOwnProperty]]'](ctx, nextKey);
            if (desc.isAbrupt) {
                return desc;
            }
            if (!desc.isUndefined && desc['[[Enumerable]]'].isTruthy) {
                const propValue = from['[[Get]]'](ctx, nextKey, from);
                if (propValue.isAbrupt) {
                    return propValue;
                }
                $CreateDataProperty(ctx, target, nextKey, propValue);
            }
        }
    }
    return target;
}
function $LoopContinues(ctx, completion, labelSet) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (completion['[[Type]]'] === 1) {
        return intrinsics.true;
    }
    if (completion['[[Type]]'] !== 3) {
        return intrinsics.false;
    }
    if (completion['[[Target]]'].isEmpty) {
        return intrinsics.true;
    }
    if (labelSet.has(completion['[[Target]]'])) {
        return intrinsics.true;
    }
    return intrinsics.false;
}
function $HostEnsureCanCompileStrings(ctx, callerRealm, calleeRealm) {
    return new $Empty(calleeRealm);
}
function $Invoke(ctx, V, P, argumentsList) {
    if (!argumentsList.isList) {
        argumentsList = new $List();
    }
    const func = $GetV(ctx, V, P);
    if (func.isAbrupt) {
        return func;
    }
    return $Call(ctx, func, V, argumentsList);
}
function $SpeciesConstructor(ctx, O, defaultConstructor) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const C = O['[[Get]]'](ctx, intrinsics.$constructor, O);
    if (C.isAbrupt) {
        return C;
    }
    if (C.isUndefined) {
        return defaultConstructor;
    }
    if (!C.isObject) {
        return new $TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
    }
    const S = C['[[Get]]'](ctx, intrinsics['@@species'], C);
    if (S.isAbrupt) {
        return S;
    }
    if (S.isNil) {
        return defaultConstructor;
    }
    if (S.isFunction) {
        return S;
    }
    return new $TypeError(realm, `Expected return value of @@species to be null, undefined or a function, but got: ${S}`);
}

class $Object {
    get '[[Value]]'() {
        const obj = {};
        for (const pd of this.propertyDescriptors) {
        }
        return obj;
    }
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return 'Object'; }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return true; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return true; }
    get isFalsey() { return false; }
    get isSpeculative() { return false; }
    get hasValue() { return false; }
    get isList() { return false; }
    constructor(realm, IntrinsicName, proto, type, target) {
        this.realm = realm;
        this.IntrinsicName = IntrinsicName;
        this.disposed = false;
        this.id = nextValueId();
        this.propertyMap = new Map();
        this.propertyDescriptors = [];
        this.propertyKeys = [];
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this['[[Prototype]]'] = proto;
        this['[[Extensible]]'] = realm['[[Intrinsics]]'].true;
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    static ObjectCreate(ctx, IntrinsicName, proto, internalSlotsList) {
        const realm = ctx.Realm;
        const obj = new $Object(realm, IntrinsicName, proto, 1, realm['[[Intrinsics]]'].empty);
        Object.assign(obj, internalSlotsList);
        return obj;
    }
    is(other) {
        return this.id === other.id;
    }
    enrichWith(ctx, node) {
        if (this['[[Type]]'] === 5) {
            this.nodeStack.push(node);
            if (this.ctx === null) {
                this.ctx = ctx;
                this.stack = ctx.Realm.stack.toString();
            }
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return String(this['[[Value]]']);
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    ToObject(ctx) {
        return this;
    }
    ToPropertyKey(ctx) {
        return this.ToString(ctx);
    }
    ToLength(ctx) {
        return this.ToNumber(ctx).ToLength(ctx);
    }
    ToBoolean(ctx) {
        return this.ToPrimitive(ctx, 'number').ToBoolean(ctx);
    }
    ToNumber(ctx) {
        return this.ToPrimitive(ctx, 'number').ToNumber(ctx);
    }
    ToInt32(ctx) {
        return this.ToPrimitive(ctx, 'number').ToInt32(ctx);
    }
    ToUint32(ctx) {
        return this.ToPrimitive(ctx, 'number').ToUint32(ctx);
    }
    ToInt16(ctx) {
        return this.ToPrimitive(ctx, 'number').ToInt16(ctx);
    }
    ToUint16(ctx) {
        return this.ToPrimitive(ctx, 'number').ToUint16(ctx);
    }
    ToInt8(ctx) {
        return this.ToPrimitive(ctx, 'number').ToInt8(ctx);
    }
    ToUint8(ctx) {
        return this.ToPrimitive(ctx, 'number').ToUint8(ctx);
    }
    ToUint8Clamp(ctx) {
        return this.ToPrimitive(ctx, 'number').ToUint8Clamp(ctx);
    }
    ToString(ctx) {
        return this.ToPrimitive(ctx, 'string').ToString(ctx);
    }
    ToPrimitive(ctx, PreferredType = 'default') {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const input = this;
        let hint = intrinsics[PreferredType];
        const exoticToPrim = input.GetMethod(ctx, intrinsics['@@toPrimitive']);
        if (exoticToPrim.isAbrupt) {
            return exoticToPrim;
        }
        if (!exoticToPrim.isUndefined) {
            const result = $Call(ctx, exoticToPrim, input, new $List(hint));
            if (result.isAbrupt) {
                return result;
            }
            if (result.isPrimitive) {
                return result;
            }
            return new $TypeError(realm, `Symbol.toPrimitive returned ${result}, but expected a primitive`);
        }
        if (hint['[[Value]]'] === 'default') {
            hint = intrinsics.number;
        }
        return input.OrdinaryToPrimitive(ctx, hint['[[Value]]']);
    }
    OrdinaryToPrimitive(ctx, hint) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        if (hint === 'string') {
            let method = O['[[Get]]'](ctx, intrinsics.$toString, O);
            if (method.isAbrupt) {
                return method;
            }
            if (method.isFunction) {
                const result = $Call(ctx, method, O, intrinsics.undefined);
                if (result.isAbrupt) {
                    return result;
                }
                if (result.isPrimitive) {
                    return result;
                }
            }
            method = O['[[Get]]'](ctx, intrinsics.$valueOf, O);
            if (method.isAbrupt) {
                return method;
            }
            if (method.isFunction) {
                const result = $Call(ctx, method, O, intrinsics.undefined);
                if (result.isAbrupt) {
                    return result;
                }
                if (result.isPrimitive) {
                    return result;
                }
                return new $TypeError(realm, `valueOf returned ${result}, but expected a primitive`);
            }
            return new $TypeError(realm, `${this} has neither a toString nor a valueOf method that returns a primitive`);
        }
        else {
            let method = O['[[Get]]'](ctx, intrinsics.$valueOf, O);
            if (method.isAbrupt) {
                return method;
            }
            if (method.isFunction) {
                const result = $Call(ctx, method, O, intrinsics.undefined);
                if (result.isAbrupt) {
                    return result;
                }
                if (result.isPrimitive) {
                    return result;
                }
            }
            method = O['[[Get]]'](ctx, intrinsics.$toString, O);
            if (method.isAbrupt) {
                return method;
            }
            if (method.isFunction) {
                const result = $Call(ctx, method, O, intrinsics.undefined);
                if (result.isAbrupt) {
                    return result;
                }
                if (result.isPrimitive) {
                    return result;
                }
                return new $TypeError(realm, `toString returned ${result}, but expected a primitive`);
            }
            return new $TypeError(realm, `${this} has neither a valueOf nor a toString method that returns a primitive`);
        }
    }
    GetValue(ctx) {
        return this;
    }
    GetMethod(ctx, P) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const V = this;
        const func = V['[[Get]]'](ctx, P, V);
        if (func.isAbrupt) {
            return func;
        }
        if (func.isNil) {
            return intrinsics.undefined;
        }
        if (!func.isFunction) {
            return new $TypeError(realm, `Return value from GetMethod is ${func}, but expected a callable function`);
        }
        return func;
    }
    hasProperty(key) {
        return this.propertyMap.has(key['[[Value]]']);
    }
    getProperty(key) {
        return this.propertyDescriptors[this.propertyMap.get(key['[[Value]]'])];
    }
    setProperty(desc) {
        if (this.propertyMap.has(desc.name['[[Value]]'])) {
            const idx = this.propertyMap.get(desc.name['[[Value]]']);
            this.propertyDescriptors[idx] = desc;
            this.propertyKeys[idx] = desc.name;
        }
        else {
            const idx = this.propertyDescriptors.length;
            this.propertyDescriptors[idx] = desc;
            this.propertyKeys[idx] = desc.name;
            this.propertyMap.set(desc.name['[[Value]]'], idx);
        }
    }
    deleteProperty(key) {
        const idx = this.propertyMap.get(key['[[Value]]']);
        this.propertyMap.delete(key['[[Value]]']);
        this.propertyDescriptors.splice(idx, 1);
        this.propertyKeys.splice(idx, 1);
    }
    setDataProperty(name, value, writable = true, enumerable = false, configurable = true) {
        const realm = this.realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const desc = new $PropertyDescriptor(realm, name);
        desc['[[Value]]'] = value;
        desc['[[Writable]]'] = writable ? intrinsics.true : intrinsics.false;
        desc['[[Enumerable]]'] = enumerable ? intrinsics.true : intrinsics.false;
        desc['[[Configurable]]'] = configurable ? intrinsics.true : intrinsics.false;
        const idx = this.propertyDescriptors.length;
        this.propertyDescriptors[idx] = desc;
        this.propertyKeys[idx] = name;
        this.propertyMap.set(name['[[Value]]'], idx);
    }
    setAccessorProperty(name, getter, setter, enumerable = false, configurable = true) {
        const realm = this.realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const desc = new $PropertyDescriptor(realm, name);
        desc['[[Enumerable]]'] = enumerable ? intrinsics.true : intrinsics.false;
        desc['[[Configurable]]'] = configurable ? intrinsics.true : intrinsics.false;
        if (getter !== null) {
            desc['[[Get]]'] = getter;
        }
        if (setter !== null) {
            desc['[[Set]]'] = setter;
        }
        const idx = this.propertyDescriptors.length;
        this.propertyDescriptors[idx] = desc;
        this.propertyKeys[idx] = name;
        this.propertyMap.set(name['[[Value]]'], idx);
    }
    '[[GetPrototypeOf]]'(ctx) {
        const O = this;
        return O['[[Prototype]]'];
    }
    '[[SetPrototypeOf]]'(ctx, V) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const O = this;
        const extensible = O['[[Extensible]]']['[[Value]]'];
        const current = O['[[Prototype]]'];
        if (V.is(current)) {
            return intrinsics.true;
        }
        if (!extensible) {
            return intrinsics.false;
        }
        let p = V;
        let done = false;
        while (!done) {
            if (p.isNull) {
                done = true;
            }
            else if (p.is(O)) {
                return intrinsics.false;
            }
            else {
                if (p['[[GetPrototypeOf]]'] !== $Object.prototype['[[GetPrototypeOf]]']) {
                    done = true;
                }
                else {
                    p = p['[[Prototype]]'];
                }
            }
        }
        O['[[Prototype]]'] = V;
        return intrinsics.true;
    }
    '[[IsExtensible]]'(ctx) {
        const O = this;
        return O['[[Extensible]]'];
    }
    '[[PreventExtensions]]'(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const O = this;
        O['[[Extensible]]'] = intrinsics.false;
        return intrinsics.true;
    }
    '[[GetOwnProperty]]'(ctx, P) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        if (!O.hasProperty(P)) {
            return intrinsics.undefined;
        }
        const D = new $PropertyDescriptor(realm, P);
        const X = O.getProperty(P);
        if (X.isDataDescriptor) {
            D['[[Value]]'] = X['[[Value]]'];
            D['[[Writable]]'] = X['[[Writable]]'];
        }
        else {
            D['[[Get]]'] = X['[[Get]]'];
            D['[[Set]]'] = X['[[Set]]'];
        }
        D['[[Enumerable]]'] = X['[[Enumerable]]'];
        D['[[Configurable]]'] = X['[[Configurable]]'];
        return D;
    }
    '[[DefineOwnProperty]]'(ctx, P, Desc) {
        const O = this;
        const current = O['[[GetOwnProperty]]'](ctx, P);
        if (current.isAbrupt) {
            return current;
        }
        const extensible = O['[[IsExtensible]]'](ctx);
        if (extensible.isAbrupt) {
            return extensible;
        }
        return $ValidateAndApplyPropertyDescriptor(ctx, O, P, extensible, Desc, current);
    }
    '[[HasProperty]]'(ctx, P) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const hasOwn = O['[[GetOwnProperty]]'](ctx, P);
        if (hasOwn.isAbrupt) {
            return hasOwn;
        }
        if (!hasOwn.isUndefined) {
            return intrinsics.true;
        }
        const parent = O['[[GetPrototypeOf]]'](ctx);
        if (parent.isAbrupt) {
            return parent;
        }
        if (!parent.isNull) {
            return parent['[[HasProperty]]'](ctx, P);
        }
        return intrinsics.false;
    }
    '[[Get]]'(ctx, P, Receiver) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const desc = O['[[GetOwnProperty]]'](ctx, P);
        if (desc.isAbrupt) {
            return desc;
        }
        if (desc.isUndefined) {
            const parent = O['[[GetPrototypeOf]]'](ctx);
            if (parent.isAbrupt) {
                return parent;
            }
            if (parent.isNull) {
                return intrinsics.undefined;
            }
            return parent['[[Get]]'](ctx, P, Receiver);
        }
        if (desc.isDataDescriptor) {
            return desc['[[Value]]'];
        }
        const getter = desc['[[Get]]'];
        if (getter.isUndefined) {
            return getter;
        }
        return $Call(ctx, getter, Receiver, intrinsics.undefined);
    }
    '[[Set]]'(ctx, P, V, Receiver) {
        const O = this;
        const ownDesc = O['[[GetOwnProperty]]'](ctx, P);
        if (ownDesc.isAbrupt) {
            return ownDesc;
        }
        return $OrdinarySetWithOwnDescriptor(ctx, O, P, V, Receiver, ownDesc);
    }
    '[[Delete]]'(ctx, P) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const desc = O['[[GetOwnProperty]]'](ctx, P);
        if (desc.isAbrupt) {
            return desc;
        }
        if (desc.isUndefined) {
            return intrinsics.true;
        }
        if (desc['[[Configurable]]'].isTruthy) {
            O.deleteProperty(P);
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    '[[OwnPropertyKeys]]'(ctx) {
        const keys = new $List();
        let arrayIndexLen = 0;
        let stringLen = 0;
        let symbolLen = 0;
        const arrayIndexProps = [];
        const stringProps = [];
        const symbolProps = [];
        const ownPropertyKeys = this.propertyKeys;
        let ownPropertyKey;
        for (let i = 0, ii = ownPropertyKeys.length; i < ii; ++i) {
            ownPropertyKey = ownPropertyKeys[i];
            if (ownPropertyKey.isString) {
                if (ownPropertyKey.IsArrayIndex) {
                    arrayIndexProps[arrayIndexLen++] = ownPropertyKey;
                }
                else {
                    stringProps[stringLen++] = ownPropertyKey;
                }
            }
            else {
                symbolProps[symbolLen++] = ownPropertyKey;
            }
        }
        arrayIndexProps.sort(compareIndices);
        let i = 0;
        let keysLen = 0;
        for (i = 0; i < arrayIndexLen; ++i) {
            keys[keysLen++] = arrayIndexProps[i];
        }
        for (i = 0; i < stringLen; ++i) {
            keys[keysLen++] = stringProps[i];
        }
        for (i = 0; i < symbolLen; ++i) {
            keys[keysLen++] = symbolProps[i];
        }
        return keys;
    }
    dispose() {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        this.propertyDescriptors.forEach(x => { x.dispose(); });
        this.propertyDescriptors = void 0;
        this.propertyKeys = void 0;
        this.propertyMap = void 0;
        this['[[Target]]'] = void 0;
        this['[[Prototype]]'] = void 0;
        this['[[Extensible]]'] = void 0;
        this.realm = void 0;
    }
}

class $Boolean {
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return 'Boolean'; }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return true; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return true; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return this['[[Value]]']; }
    get isFalsey() { return !this['[[Value]]']; }
    get isSpeculative() { return false; }
    get hasValue() { return true; }
    get isList() { return false; }
    constructor(realm, value, type = 1, target = realm['[[Intrinsics]]'].empty, sourceNode = null, conversionSource = null) {
        this.realm = realm;
        this.sourceNode = sourceNode;
        this.conversionSource = conversionSource;
        this.id = nextValueId();
        this.IntrinsicName = 'boolean';
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this['[[Value]]'] = value;
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    is(other) {
        return other instanceof $Boolean && this['[[Value]]'] === other['[[Value]]'];
    }
    enrichWith(ctx, node) {
        if (this['[[Type]]'] === 5) {
            this.nodeStack.push(node);
            if (this.ctx === null) {
                this.ctx = ctx;
                this.stack = ctx.Realm.stack.toString();
            }
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return String(this['[[Value]]']);
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    ToObject(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return $Object.ObjectCreate(ctx, 'boolean', intrinsics['%BooleanPrototype%'], {
            '[[BooleanData]]': this,
        });
    }
    ToPropertyKey(ctx) {
        return this.ToString(ctx);
    }
    ToLength(ctx) {
        return this.ToNumber(ctx).ToLength(ctx);
    }
    ToPrimitive(ctx) {
        return this;
    }
    ToBoolean(ctx) {
        return this;
    }
    ToNumber(ctx) {
        return new $Number(this.realm, Number(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt32(ctx) {
        return new $Number(this.realm, Int32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint32(ctx) {
        return new $Number(this.realm, Uint32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt16(ctx) {
        return new $Number(this.realm, Int16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint16(ctx) {
        return new $Number(this.realm, Uint16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt8(ctx) {
        return new $Number(this.realm, Int8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8(ctx) {
        return new $Number(this.realm, Uint8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8Clamp(ctx) {
        return new $Number(this.realm, Uint8Clamp(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToString(ctx) {
        return new $String(this.realm, String(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    GetValue(ctx) {
        return this;
    }
}

class $Null {
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return 'Null'; }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return true; }
    get isNil() { return true; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return true; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return false; }
    get isFalsey() { return true; }
    get isSpeculative() { return false; }
    get hasValue() { return true; }
    get isAmbiguous() { return false; }
    get isList() { return false; }
    constructor(realm, type = 1, target = realm['[[Intrinsics]]'].empty, sourceNode = null) {
        this.realm = realm;
        this.sourceNode = sourceNode;
        this.id = nextValueId();
        this.IntrinsicName = 'null';
        this['[[Value]]'] = null;
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    is(other) {
        return other instanceof $Null;
    }
    enrichWith(ctx, node) {
        if (this['[[Type]]'] === 5) {
            this.nodeStack.push(node);
            if (this.ctx === null) {
                this.ctx = ctx;
                this.stack = ctx.Realm.stack.toString();
            }
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return String(this['[[Value]]']);
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    ToObject(ctx) {
        return new $TypeError(ctx.Realm, `${this} cannot be converted to object`);
    }
    ToPropertyKey(ctx) {
        return this.ToString(ctx);
    }
    ToLength(ctx) {
        return this.ToNumber(ctx).ToLength(ctx);
    }
    ToPrimitive(ctx) {
        return this;
    }
    ToBoolean(ctx) {
        return new $Boolean(this.realm, Boolean(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToNumber(ctx) {
        return new $Number(this.realm, Number(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt32(ctx) {
        return new $Number(this.realm, Int32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint32(ctx) {
        return new $Number(this.realm, Uint32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt16(ctx) {
        return new $Number(this.realm, Int16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint16(ctx) {
        return new $Number(this.realm, Uint16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt8(ctx) {
        return new $Number(this.realm, Int8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8(ctx) {
        return new $Number(this.realm, Uint8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8Clamp(ctx) {
        return new $Number(this.realm, Uint8Clamp(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToString(ctx) {
        return new $String(this.realm, String(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    GetValue(ctx) {
        return this;
    }
}

class $Symbol {
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return 'Symbol'; }
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return true; }
    get isPrimitive() { return true; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return true; }
    get isFalsey() { return false; }
    get isSpeculative() { return false; }
    get hasValue() { return true; }
    get isList() { return false; }
    get IsArrayIndex() { return false; }
    constructor(realm, Description, value = Symbol(Description['[[Value]]']), type = 1, target = realm['[[Intrinsics]]'].empty) {
        this.realm = realm;
        this.Description = Description;
        this.id = nextValueId();
        this.IntrinsicName = 'symbol';
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this['[[Value]]'] = value;
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    is(other) {
        return other instanceof $Symbol && this['[[Value]]'] === other['[[Value]]'];
    }
    enrichWith(ctx, node) {
        if (this['[[Type]]'] === 5) {
            this.nodeStack.push(node);
            if (this.ctx === null) {
                this.ctx = ctx;
                this.stack = ctx.Realm.stack.toString();
            }
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return String(this['[[Value]]']);
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    ToObject(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return $Object.ObjectCreate(ctx, 'symbol', intrinsics['%SymbolPrototype%'], {
            '[[SymbolData]]': this,
        });
    }
    ToPropertyKey(ctx) {
        return this.ToString(ctx);
    }
    ToLength(ctx) {
        return this.ToNumber(ctx);
    }
    ToPrimitive(ctx) {
        return this;
    }
    ToBoolean(ctx) {
        return new $Boolean(this.realm, Boolean(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToNumber(ctx) {
        return new $TypeError(ctx.Realm, `${this} cannot be converted to number`);
    }
    ToInt32(ctx) {
        return this.ToNumber(ctx);
    }
    ToUint32(ctx) {
        return this.ToNumber(ctx);
    }
    ToInt16(ctx) {
        return this.ToNumber(ctx);
    }
    ToUint16(ctx) {
        return this.ToNumber(ctx);
    }
    ToInt8(ctx) {
        return this.ToNumber(ctx);
    }
    ToUint8(ctx) {
        return this.ToNumber(ctx);
    }
    ToUint8Clamp(ctx) {
        return this.ToNumber(ctx);
    }
    ToString(ctx) {
        return new $String(this.realm, String(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    GetValue(ctx) {
        return this;
    }
}

class $Undefined {
    get isAbrupt() { return (this['[[Type]]'] !== 1); }
    get Type() { return 'Undefined'; }
    get isEmpty() { return false; }
    get isUndefined() { return true; }
    get isNull() { return false; }
    get isNil() { return true; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return true; }
    get isObject() { return false; }
    get isArray() { return false; }
    get isProxy() { return false; }
    get isFunction() { return false; }
    get isBoundFunction() { return false; }
    get isTruthy() { return false; }
    get isFalsey() { return true; }
    get isSpeculative() { return false; }
    get hasValue() { return true; }
    get isList() { return false; }
    get IsArrayIndex() { return false; }
    constructor(realm, type = 1, target = realm['[[Intrinsics]]'].empty, sourceNode = null) {
        this.realm = realm;
        this.sourceNode = sourceNode;
        this.id = nextValueId();
        this.IntrinsicName = 'undefined';
        this['[[Value]]'] = void 0;
        this.nodeStack = [];
        this.ctx = null;
        this.stack = '';
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
    }
    is(other) {
        return other instanceof $Undefined;
    }
    enrichWith(ctx, node) {
        if (this['[[Type]]'] === 5) {
            this.nodeStack.push(node);
            if (this.ctx === null) {
                this.ctx = ctx;
                this.stack = ctx.Realm.stack.toString();
            }
        }
        return this;
    }
    [Symbol.toPrimitive]() {
        return String(this['[[Value]]']);
    }
    [Symbol.toStringTag]() {
        return Object.prototype.toString.call(this['[[Value]]']);
    }
    ToCompletion(type, target) {
        this['[[Type]]'] = type;
        this['[[Target]]'] = target;
        return this;
    }
    UpdateEmpty(value) {
        return this;
    }
    ToObject(ctx) {
        return new $TypeError(ctx.Realm, `${this} cannot be converted to object`);
    }
    ToPropertyKey(ctx) {
        return this.ToString(ctx);
    }
    ToLength(ctx) {
        return this.ToNumber(ctx).ToLength(ctx);
    }
    ToPrimitive(ctx) {
        return this;
    }
    ToBoolean(ctx) {
        return new $Boolean(this.realm, Boolean(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToNumber(ctx) {
        return new $Number(this.realm, Number(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt32(ctx) {
        return new $Number(this.realm, Int32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint32(ctx) {
        return new $Number(this.realm, Uint32(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt16(ctx) {
        return new $Number(this.realm, Int16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint16(ctx) {
        return new $Number(this.realm, Uint16(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToInt8(ctx) {
        return new $Number(this.realm, Int8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8(ctx) {
        return new $Number(this.realm, Uint8(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToUint8Clamp(ctx) {
        return new $Number(this.realm, Uint8Clamp(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    ToString(ctx) {
        return new $String(this.realm, String(this['[[Value]]']), this['[[Type]]'], this['[[Target]]'], null, this);
    }
    GetValue(ctx) {
        return this;
    }
}

class Job {
    constructor(logger, realm, scriptOrModule) {
        this.logger = logger;
        this.logger = logger.scopeTo(`Job`);
        this['[[Realm]]'] = realm;
        this['[[ScriptOrModule]]'] = scriptOrModule;
    }
    dispose() {
        this['[[Realm]]'] = void 0;
        this['[[ScriptOrModule]]'] = void 0;
        this.logger = void 0;
    }
}
class JobQueue {
    get isEmpty() {
        return this.queue.length === 0;
    }
    constructor(logger, name) {
        this.logger = logger;
        this.name = name;
        this.queue = [];
        this.logger = logger.root.scopeTo(`JobQueue['${name}']`);
    }
    EnqueueJob(ctx, job) {
        const realm = ctx.Realm;
        this.logger.debug(`EnqueueJob(#${ctx.id}) currentQueueLength=${this.queue.length}`);
        this.queue.push(job);
        return new $Empty(realm);
    }
    dispose() {
        this.queue.forEach(x => { x.dispose(); });
        this.queue = void 0;
        this.logger = void 0;
    }
}

let bindingId = 0;
class $Binding {
    get isIndirect() {
        return this.M !== null;
    }
    constructor(isMutable, isStrict, isInitialized, canBeDeleted, value, name, origin, M = null, N2 = null) {
        this.isMutable = isMutable;
        this.isStrict = isStrict;
        this.isInitialized = isInitialized;
        this.canBeDeleted = canBeDeleted;
        this.value = value;
        this.name = name;
        this.origin = origin;
        this.M = M;
        this.N2 = N2;
        this.id = ++bindingId;
    }
    dispose() {
        this.value = void 0;
        this.origin = void 0;
        this.M = void 0;
        this.N2 = void 0;
    }
}
class $DeclarativeEnvRec {
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return false; }
    get isFunction() { return false; }
    constructor(logger, realm, outer) {
        this.logger = logger;
        this.realm = realm;
        this.outer = outer;
        this.bindings = new Map();
        this.logger = logger.scopeTo('DeclarativeEnvRec');
    }
    HasBinding(ctx, N) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        if (envRec.bindings.has(N['[[Value]]'])) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    CreateMutableBinding(ctx, N, D) {
        this.logger.debug(`CreateMutableBinding(${N['[[Value]]']})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const binding = new $Binding(true, false, false, D['[[Value]]'], intrinsics.empty, N['[[Value]]'], this);
        envRec.bindings.set(N['[[Value]]'], binding);
        return intrinsics.empty;
    }
    CreateImmutableBinding(ctx, N, S) {
        this.logger.debug(`CreateImmutableBinding(${N['[[Value]]']})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const binding = new $Binding(false, S['[[Value]]'], false, false, intrinsics.empty, N['[[Value]]'], this);
        envRec.bindings.set(N['[[Value]]'], binding);
        return intrinsics.empty;
    }
    InitializeBinding(ctx, N, V) {
        this.logger.debug(`InitializeBinding(#${ctx.id}, ${N['[[Value]]']}, ${JSON.stringify(V['[[Value]]'])})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const binding = envRec.bindings.get(N['[[Value]]']);
        binding.value = V;
        binding.isInitialized = true;
        return intrinsics.empty;
    }
    SetMutableBinding(ctx, N, V, S) {
        this.logger.debug(`SetMutableBinding(${N['[[Value]]']})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const bindings = this.bindings;
        const binding = bindings.get(N['[[Value]]']);
        if (binding === void 0) {
            if (S.isTruthy) {
                return new $ReferenceError(ctx.Realm, `Cannot assign to non-existing binding ${N['[[Value]]']} in strict mode code.`);
            }
            envRec.CreateMutableBinding(ctx, N, intrinsics.true);
            envRec.InitializeBinding(ctx, N, V);
            return intrinsics.empty;
        }
        if (binding.isStrict) {
            S = intrinsics.true;
        }
        if (!binding.isInitialized) {
            return new $ReferenceError(ctx.Realm, `Binding ${N['[[Value]]']} is not yet initialized.`);
        }
        else if (binding.isMutable) {
            binding.value = V;
        }
        else {
            if (S.isTruthy) {
                return new $TypeError(ctx.Realm, `Cannot change the value of immutable binding ${N}`);
            }
        }
        return intrinsics.empty;
    }
    GetBindingValue(ctx, N, S) {
        this.logger.debug(`GetBindingValue(${N['[[Value]]']})`);
        const envRec = this;
        const binding = envRec.bindings.get(N['[[Value]]']);
        if (!binding.isInitialized) {
            return new $ReferenceError(ctx.Realm, `No binding exists for: ${N['[[Value]]']}.`);
        }
        return binding.value;
    }
    DeleteBinding(ctx, N) {
        this.logger.debug(`DeleteBinding(${N['[[Value]]']})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const bindings = envRec.bindings;
        const binding = bindings.get(N['[[Value]]']);
        if (!binding.canBeDeleted) {
            return intrinsics.false;
        }
        bindings.delete(N['[[Value]]']);
        return intrinsics.true;
    }
    HasThisBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.false;
    }
    HasSuperBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.false;
    }
    WithBaseObject(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.undefined;
    }
    dispose() {
        for (const binding of this.bindings.values()) {
            binding.dispose();
        }
        this.bindings.clear();
        this.bindings = void 0;
        this.logger = void 0;
        this.realm = void 0;
        this.outer = void 0;
    }
}
class $ObjectEnvRec {
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return false; }
    get isFunction() { return false; }
    constructor(logger, realm, outer, bindingObject) {
        this.logger = logger;
        this.realm = realm;
        this.outer = outer;
        this.bindingObject = bindingObject;
        this.withEnvironment = false;
        this.logger = logger.scopeTo('ObjectEnvRec');
    }
    HasBinding(ctx, N) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const bindings = envRec.bindingObject;
        const foundBinding = bindings['[[HasProperty]]'](ctx, N);
        if (foundBinding.isAbrupt) {
            return foundBinding;
        }
        if (foundBinding.isFalsey) {
            return intrinsics.false;
        }
        if (!envRec.withEnvironment) {
            return intrinsics.true;
        }
        const unscopables = bindings['[[Get]]'](ctx, intrinsics['@@unscopables'], bindings);
        if (unscopables.isAbrupt) {
            return unscopables;
        }
        if (unscopables.isObject) {
            const _blocked = unscopables['[[Get]]'](ctx, N, unscopables);
            if (_blocked.isAbrupt) {
                return _blocked;
            }
            const blocked = _blocked.ToBoolean(ctx);
            if (blocked.isAbrupt) {
                return blocked;
            }
            if (blocked.isTruthy) {
                return intrinsics.false;
            }
        }
        return intrinsics.true;
    }
    CreateMutableBinding(ctx, N, D) {
        this.logger.debug(`CreateMutableBinding(${N['[[Value]]']})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const envRec = this;
        const bindings = envRec.bindingObject;
        const Desc = new $PropertyDescriptor(realm, N);
        Desc['[[Value]]'] = intrinsics.undefined;
        Desc['[[Writable]]'] = intrinsics.true;
        Desc['[[Enumerable]]'] = intrinsics.true;
        Desc['[[Configurable]]'] = D;
        return $DefinePropertyOrThrow(ctx, bindings, N, Desc);
    }
    CreateImmutableBinding(ctx, N, S) {
        throw new Error('Should not be called');
    }
    InitializeBinding(ctx, N, V) {
        this.logger.debug(`InitializeBinding(#${ctx.id}, ${N['[[Value]]']}, ${JSON.stringify(V['[[Value]]'])})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        return envRec.SetMutableBinding(ctx, N, V, intrinsics.false);
    }
    SetMutableBinding(ctx, N, V, S) {
        this.logger.debug(`SetMutableBinding(${N['[[Value]]']})`);
        const envRec = this;
        const bindings = envRec.bindingObject;
        return $Set(ctx, bindings, N, V, S);
    }
    GetBindingValue(ctx, N, S) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const bindings = envRec.bindingObject;
        const value = bindings['[[HasProperty]]'](ctx, N);
        if (value.isAbrupt) {
            return value;
        }
        if (value.isFalsey) {
            if (S.isFalsey) {
                return intrinsics.undefined;
            }
            return new $ReferenceError(ctx.Realm, `Cannot read from non-existing binding ${N['[[Value]]']} in strict mode code.`);
        }
        return bindings['[[Get]]'](ctx, N, bindings);
    }
    DeleteBinding(ctx, N) {
        this.logger.debug(`DeleteBinding(${N['[[Value]]']})`);
        const envRec = this;
        const bindings = envRec.bindingObject;
        return bindings['[[Delete]]'](ctx, N);
    }
    HasThisBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.false;
    }
    HasSuperBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.false;
    }
    WithBaseObject(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        if (envRec.withEnvironment) {
            return envRec.bindingObject;
        }
        return intrinsics.undefined;
    }
    dispose() {
        this.bindingObject.dispose();
        this.bindingObject = void 0;
        this.logger = void 0;
        this.realm = void 0;
        this.outer = void 0;
    }
}
class $FunctionEnvRec extends $DeclarativeEnvRec {
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return false; }
    get isFunction() { return false; }
    constructor(logger, realm, F, newTarget) {
        super(logger, realm, F['[[Environment]]']);
        this.logger = logger;
        this.logger = logger.scopeTo('FunctionEnvRec');
        const envRec = this;
        envRec['[[FunctionObject]]'] = F;
        if (F['[[ThisMode]]'] === 'lexical') {
            envRec['[[ThisBindingStatus]]'] = 'lexical';
        }
        else {
            envRec['[[ThisBindingStatus]]'] = 'uninitialized';
        }
        const home = F['[[HomeObject]]'];
        envRec['[[HomeObject]]'] = home;
        envRec['[[NewTarget]]'] = newTarget;
    }
    HasThisBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        if (envRec['[[ThisBindingStatus]]'] === 'lexical') {
            return intrinsics.false;
        }
        return intrinsics.true;
    }
    HasSuperBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        if (envRec['[[ThisBindingStatus]]'] === 'lexical') {
            return intrinsics.false;
        }
        if (envRec['[[HomeObject]]'].isUndefined) {
            return intrinsics.false;
        }
        return intrinsics.true;
    }
    BindThisValue(ctx, V) {
        const envRec = this;
        if (envRec['[[ThisBindingStatus]]'] === 'initialized') {
            return new $ReferenceError(ctx.Realm, `The 'this' binding is already initialized.`);
        }
        envRec['[[ThisValue]]'] = V;
        envRec['[[ThisBindingStatus]]'] = 'initialized';
        return V;
    }
    GetThisBinding(ctx) {
        const envRec = this;
        if (envRec['[[ThisBindingStatus]]'] === 'uninitialized') {
            return new $ReferenceError(ctx.Realm, `The 'this' binding is not yet initialized.`);
        }
        return envRec['[[ThisValue]]'];
    }
    GetSuperBase(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const home = envRec['[[HomeObject]]'];
        if (home.isUndefined) {
            return intrinsics.undefined;
        }
        return home['[[GetPrototypeOf]]'](ctx);
    }
    dispose() {
        super.dispose();
        this['[[ThisValue]]'] = void 0;
        this['[[FunctionObject]]'] = void 0;
        this['[[HomeObject]]'] = void 0;
        this['[[NewTarget]]'] = void 0;
    }
}
class $GlobalEnvRec {
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return false; }
    get isFunction() { return false; }
    constructor(logger, realm, G, thisValue) {
        this.logger = logger;
        this.realm = realm;
        this.logger = logger.scopeTo('GlobalEnvRec');
        this.outer = realm['[[Intrinsics]]'].null;
        const objRec = new $ObjectEnvRec(logger, realm, realm['[[Intrinsics]]'].null, G);
        const dclRec = new $DeclarativeEnvRec(logger, realm, realm['[[Intrinsics]]'].null);
        const globalRec = this;
        globalRec['[[ObjectRecord]]'] = objRec;
        globalRec['[[GlobalThisValue]]'] = thisValue;
        globalRec['[[DeclarativeRecord]]'] = dclRec;
        globalRec['[[VarNames]]'] = [];
    }
    HasBinding(ctx, N) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        if (dclRec.HasBinding(ctx, N).isTruthy) {
            return intrinsics.true;
        }
        const objRec = envRec['[[ObjectRecord]]'];
        return objRec.HasBinding(ctx, N);
    }
    CreateMutableBinding(ctx, N, D) {
        this.logger.debug(`CreateMutableBinding(${N['[[Value]]']})`);
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        if (dclRec.HasBinding(ctx, N).isTruthy) {
            return new $TypeError(ctx.Realm, `A global binding for ${N} already exists`);
        }
        return dclRec.CreateMutableBinding(ctx, N, D);
    }
    CreateImmutableBinding(ctx, N, S) {
        this.logger.debug(`CreateImmutableBinding(${N['[[Value]]']})`);
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        if (dclRec.HasBinding(ctx, N).isTruthy) {
            return new $TypeError(ctx.Realm, `A global binding for ${N} already exists`);
        }
        return dclRec.CreateImmutableBinding(ctx, N, S);
    }
    InitializeBinding(ctx, N, V) {
        this.logger.debug(`InitializeBinding(#${ctx.id}, ${N['[[Value]]']}, ${JSON.stringify(V['[[Value]]'])})`);
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        if (dclRec.HasBinding(ctx, N).isTruthy) {
            return dclRec.InitializeBinding(ctx, N, V);
        }
        const objRec = envRec['[[ObjectRecord]]'];
        return objRec.InitializeBinding(ctx, N, V);
    }
    SetMutableBinding(ctx, N, V, S) {
        this.logger.debug(`SetMutableBinding(${N['[[Value]]']})`);
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        if (dclRec.HasBinding(ctx, N).isTruthy) {
            return dclRec.SetMutableBinding(ctx, N, V, S);
        }
        const objRec = envRec['[[ObjectRecord]]'];
        return objRec.SetMutableBinding(ctx, N, V, S);
    }
    GetBindingValue(ctx, N, S) {
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        if (dclRec.HasBinding(ctx, N).isTruthy) {
            return dclRec.GetBindingValue(ctx, N, S);
        }
        const objRec = envRec['[[ObjectRecord]]'];
        return objRec.GetBindingValue(ctx, N, S);
    }
    DeleteBinding(ctx, N) {
        this.logger.debug(`DeleteBinding(${N['[[Value]]']})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        if (dclRec.HasBinding(ctx, N).isTruthy) {
            return dclRec.DeleteBinding(ctx, N);
        }
        const objRec = envRec['[[ObjectRecord]]'];
        const globalObject = objRec.bindingObject;
        const existingProp = $HasOwnProperty(ctx, globalObject, N);
        if (existingProp.isAbrupt) {
            return existingProp;
        }
        if (existingProp.isTruthy) {
            const status = objRec.DeleteBinding(ctx, N);
            if (status.isAbrupt) {
                return status;
            }
            if (status.isTruthy) {
                const varNames = envRec['[[VarNames]]'];
                const idx = varNames.indexOf(N['[[Value]]']);
                if (idx >= 0) {
                    varNames.splice(idx, 1);
                }
            }
            return status;
        }
        return intrinsics.true;
    }
    HasThisBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.true;
    }
    HasSuperBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.false;
    }
    WithBaseObject(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.undefined;
    }
    GetThisBinding(ctx) {
        const envRec = this;
        return envRec['[[GlobalThisValue]]'];
    }
    HasVarDeclaration(ctx, N) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const varDeclaredNames = envRec['[[VarNames]]'];
        if (varDeclaredNames.includes(N['[[Value]]'])) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    HasLexicalDeclaration(ctx, N) {
        const envRec = this;
        const dclRec = envRec['[[DeclarativeRecord]]'];
        return dclRec.HasBinding(ctx, N);
    }
    HasRestrictedGlobalProperty(ctx, N) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const objRec = envRec['[[ObjectRecord]]'];
        const globalObject = objRec.bindingObject;
        const existingProp = globalObject['[[GetOwnProperty]]'](ctx, N);
        if (existingProp.isAbrupt) {
            return existingProp;
        }
        if (existingProp.isUndefined) {
            return intrinsics.false;
        }
        if (existingProp['[[Configurable]]'].isTruthy) {
            return intrinsics.false;
        }
        return intrinsics.true;
    }
    CanDeclareGlobalVar(ctx, N) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const objRec = envRec['[[ObjectRecord]]'];
        const globalObject = objRec.bindingObject;
        const hasProperty = $HasOwnProperty(ctx, globalObject, N);
        if (hasProperty.isAbrupt) {
            return hasProperty;
        }
        if (hasProperty.isTruthy) {
            return intrinsics.true;
        }
        return globalObject['[[IsExtensible]]'](ctx);
    }
    CanDeclareGlobalFunction(ctx, N) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const objRec = envRec['[[ObjectRecord]]'];
        const globalObject = objRec.bindingObject;
        const existingProp = globalObject['[[GetOwnProperty]]'](ctx, N);
        if (existingProp.isAbrupt) {
            return existingProp;
        }
        if (existingProp.isUndefined) {
            return globalObject['[[IsExtensible]]'](ctx);
        }
        if (existingProp['[[Configurable]]'].isTruthy) {
            return intrinsics.true;
        }
        if (existingProp.isDataDescriptor && existingProp['[[Writable]]'].isTruthy && existingProp['[[Enumerable]]'].isTruthy) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    CreateGlobalVarBinding(ctx, N, D) {
        this.logger.debug(`CreateGlobalVarBinding(${N['[[Value]]']})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const objRec = envRec['[[ObjectRecord]]'];
        const globalObject = objRec.bindingObject;
        const hasProperty = $HasOwnProperty(ctx, globalObject, N);
        if (hasProperty.isAbrupt) {
            return hasProperty;
        }
        const extensible = globalObject['[[IsExtensible]]'](ctx);
        if (extensible.isAbrupt) {
            return extensible;
        }
        if (hasProperty.isFalsey && extensible.isTruthy) {
            const $CreateMutableBinding = objRec.CreateMutableBinding(ctx, N, D);
            if ($CreateMutableBinding.isAbrupt) {
                return $CreateMutableBinding;
            }
            const $InitializeBinding = objRec.InitializeBinding(ctx, N, intrinsics.undefined);
            if ($InitializeBinding.isAbrupt) {
                return $InitializeBinding;
            }
        }
        const varDeclaredNames = envRec['[[VarNames]]'];
        if (!varDeclaredNames.includes(N['[[Value]]'])) {
            varDeclaredNames.push(N['[[Value]]']);
        }
        return intrinsics.empty;
    }
    CreateGlobalFunctionBinding(ctx, N, V, D) {
        this.logger.debug(`CreateGlobalFunctionBinding(${N['[[Value]]']})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const envRec = this;
        const objRec = envRec['[[ObjectRecord]]'];
        const globalObject = objRec.bindingObject;
        const existingProp = globalObject['[[GetOwnProperty]]'](ctx, N);
        if (existingProp.isAbrupt) {
            return existingProp;
        }
        let desc;
        if (existingProp.isUndefined || existingProp['[[Configurable]]'].isTruthy) {
            desc = new $PropertyDescriptor(realm, N);
            desc['[[Enumerable]]'] = intrinsics.true;
            desc['[[Configurable]]'] = D;
            desc['[[Value]]'] = V;
            desc['[[Writable]]'] = intrinsics.true;
        }
        else {
            desc = new $PropertyDescriptor(realm, N);
            desc['[[Value]]'] = V;
        }
        const $DefinePropertyOrThrowResult = $DefinePropertyOrThrow(ctx, globalObject, N, desc);
        if ($DefinePropertyOrThrowResult.isAbrupt) {
            return $DefinePropertyOrThrowResult;
        }
        const $SetResult = $Set(ctx, globalObject, N, V, intrinsics.false);
        if ($SetResult.isAbrupt) {
            return $SetResult;
        }
        const varDeclaredNames = envRec['[[VarNames]]'];
        if (!varDeclaredNames.includes(N['[[Value]]'])) {
            varDeclaredNames.push(N['[[Value]]']);
        }
        return intrinsics.empty;
    }
    dispose() {
        this['[[ObjectRecord]]'] = void 0;
        this['[[GlobalThisValue]]'] = void 0;
        this['[[DeclarativeRecord]]'] = void 0;
        this['[[VarNames]]'] = void 0;
        this.logger = void 0;
        this.outer = void 0;
        this.realm = void 0;
    }
}
class $ModuleEnvRec extends $DeclarativeEnvRec {
    get isEmpty() { return false; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    get isNil() { return false; }
    get isBoolean() { return false; }
    get isNumber() { return false; }
    get isString() { return false; }
    get isSymbol() { return false; }
    get isPrimitive() { return false; }
    get isObject() { return false; }
    get isFunction() { return false; }
    constructor(logger, realm, outer) {
        super(logger, realm, outer);
        this.logger = logger;
        this.logger = logger.scopeTo('ModuleEnvRec');
    }
    GetBindingValue(ctx, N, S) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const binding = envRec.bindings.get(N['[[Value]]']);
        if (binding.isIndirect) {
            const M = binding.M;
            const N2 = binding.N2;
            const targetER = M['[[Environment]]'];
            if (targetER.isUndefined) {
                return new $ReferenceError(ctx.Realm, `Cannot resolve export: ${N['[[Value]]']}`);
            }
            return targetER.GetBindingValue(ctx, N2, intrinsics.true);
        }
        if (!binding.isInitialized) {
            return new $ReferenceError(ctx.Realm, `Binding for ${N['[[Value]]']} is not yet initialized`);
        }
        return binding.value;
    }
    DeleteBinding(ctx, N) {
        throw new Error('1. Assert: This method is never invoked. See 12.5.3.1.');
    }
    HasThisBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.true;
    }
    GetThisBinding(ctx) {
        const intrinsics = this.realm['[[Intrinsics]]'];
        return intrinsics.undefined;
    }
    CreateImportBinding(ctx, N, M, N2) {
        this.logger.debug(`CreateImportBinding(${N['[[Value]]']})`);
        const intrinsics = this.realm['[[Intrinsics]]'];
        const envRec = this;
        const binding = new $Binding(false, true, true, false, intrinsics.empty, N['[[Value]]'], this, M, N2);
        envRec.bindings.set(N['[[Value]]'], binding);
        return intrinsics.empty;
    }
}

class $Function extends $Object {
    get isFunction() { return true; }
    constructor(realm, IntrinsicName, proto) {
        super(realm, IntrinsicName, proto, 1, realm['[[Intrinsics]]'].empty);
    }
    toString() {
        const code = this['[[ECMAScriptCode]]'];
        const sourceFile = code.mos.node;
        const node = code.node;
        const path = code.path;
        const text = this['[[SourceText]]']['[[Value]]'];
        const firstLine = text.split(/\r?\n/)[0];
        let line = -1;
        let character = -1;
        if (node.pos > -1) {
            ({ line, character } = typescript.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile)));
        }
        return `${firstLine}:${line + 1}:${character} (${path})`;
    }
    '[[Call]]'(ctx, thisArgument, argumentsList) {
        const F = this;
        const realm = F['[[Realm]]'];
        const intrinsics = realm['[[Intrinsics]]'];
        if (F['[[FunctionKind]]'] === 2) {
            return new $TypeError(realm, `Cannot call classConstructor (${F.propertyMap.has('name') ? F.propertyDescriptors[F.propertyMap.get('name')]['[[Value]]'] : 'anonymous'}) as a function`);
        }
        const calleeContext = $PrepareForOrdinaryCall(ctx, F, intrinsics.undefined);
        $OrdinaryCallBindThis(ctx, F, calleeContext, thisArgument);
        const result = F['[[ECMAScriptCode]]'].EvaluateBody(calleeContext, F, argumentsList);
        realm.stack.pop();
        ctx.resume();
        if (result['[[Type]]'] === 4) {
            return result.ToCompletion(1, intrinsics.empty);
        }
        if (result.isAbrupt) {
            return result;
        }
        return new $Undefined(realm, 1, intrinsics.empty);
    }
    '[[Construct]]'(ctx, argumentsList, newTarget) {
        const F = this;
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const stack = realm.stack;
        const kind = F['[[ConstructorKind]]'];
        let thisArgument;
        if (kind === 'base') {
            const $thisArgument = $OrdinaryCreateFromConstructor(ctx, newTarget, '%ObjectPrototype%');
            if ($thisArgument.isAbrupt) {
                return $thisArgument;
            }
            thisArgument = $thisArgument;
        }
        else {
            thisArgument = intrinsics.undefined;
        }
        const calleeContext = $PrepareForOrdinaryCall(ctx, F, newTarget);
        if (kind === 'base') {
            $OrdinaryCallBindThis(ctx, F, calleeContext, thisArgument);
        }
        const envRec = calleeContext.LexicalEnvironment;
        const result = F['[[ECMAScriptCode]]'].EvaluateBody(calleeContext, F, argumentsList);
        stack.pop();
        ctx.resume();
        if (result['[[Type]]'] === 4) {
            if (result.isObject) {
                return result.ToCompletion(1, intrinsics.empty);
            }
            if (kind === 'base') {
                return thisArgument.ToCompletion(1, intrinsics.empty);
            }
            if (!result.isUndefined) {
                return new $TypeError(realm, `base constructor for ${F.propertyMap.has('name') ? F.propertyDescriptors[F.propertyMap.get('name')]['[[Value]]'] : 'anonymous'} returned ${result}, but expected undefined`);
            }
        }
        else {
            if (result.isAbrupt) {
                return result;
            }
        }
        return envRec.GetThisBinding(ctx);
    }
    static FunctionAllocate(ctx, functionPrototype, strict, functionKind) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const needsConstruct = functionKind === 0;
        if (functionKind === 1) {
            functionKind = 0;
        }
        const F = new $Function(realm, 'function', functionPrototype);
        if (needsConstruct) {
            F['[[ConstructorKind]]'] = 'base';
        }
        F['[[Strict]]'] = strict;
        F['[[FunctionKind]]'] = functionKind;
        F['[[Prototype]]'] = functionPrototype;
        F['[[Extensible]]'] = intrinsics.true;
        F['[[Realm]]'] = realm;
        return F;
    }
    static FunctionInitialize(ctx, F, kind, code, Scope) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const len = code.$parameters.ExpectedArgumentCount;
        const Desc = new $PropertyDescriptor(realm, intrinsics.length);
        Desc['[[Value]]'] = new $Number(realm, len);
        Desc['[[Writable]]'] = intrinsics.false;
        Desc['[[Enumerable]]'] = intrinsics.false;
        Desc['[[Configurable]]'] = intrinsics.true;
        $DefinePropertyOrThrow(ctx, F, intrinsics.length, Desc);
        const Strict = F['[[Strict]]'];
        F['[[Environment]]'] = Scope;
        F['[[ECMAScriptCode]]'] = code;
        F['[[ScriptOrModule]]'] = realm.GetActiveScriptOrModule();
        if (kind === 'arrow') {
            F['[[ThisMode]]'] = 'lexical';
        }
        else if (Strict.isTruthy) {
            F['[[ThisMode]]'] = 'strict';
        }
        else {
            F['[[ThisMode]]'] = 'global';
        }
        return F;
    }
    static FunctionCreate(ctx, kind, code, Scope, Strict, prototype) {
        code.logger.debug(`$Function.FunctionCreate(#${ctx.id}, ${JSON.stringify(kind)})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (prototype === void 0) {
            prototype = intrinsics['%FunctionPrototype%'];
        }
        let allocKind;
        if (kind !== 'normal') {
            allocKind = 1;
        }
        else {
            allocKind = 0;
        }
        const F = this.FunctionAllocate(ctx, prototype, Strict, allocKind);
        return this.FunctionInitialize(ctx, F, kind, code, Scope);
    }
    static GeneratorFunctionCreate(ctx, kind, code, Scope, Strict) {
        code.logger.debug(`$Function.GeneratorFunctionCreate(#${ctx.id}, ${JSON.stringify(kind)})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const functionPrototype = intrinsics['%Generator%'];
        const F = this.FunctionAllocate(ctx, functionPrototype, Strict, 4);
        return this.FunctionInitialize(ctx, F, kind, code, Scope);
    }
    static AsyncGeneratorFunctionCreate(ctx, kind, code, Scope, Strict) {
        code.logger.debug(`$Function.AsyncGeneratorFunctionCreate(#${ctx.id}, ${JSON.stringify(kind)})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const functionPrototype = intrinsics['%AsyncGenerator%'];
        const F = this.FunctionAllocate(ctx, functionPrototype, Strict, 4);
        return this.FunctionInitialize(ctx, F, kind, code, Scope);
    }
    static AsyncFunctionCreate(ctx, kind, code, Scope, Strict) {
        code.logger.debug(`$Function.AsyncFunctionCreate(#${ctx.id}, ${JSON.stringify(kind)})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const functionPrototype = intrinsics['%AsyncFunctionPrototype%'];
        const F = this.FunctionAllocate(ctx, functionPrototype, Strict, 8);
        return this.FunctionInitialize(ctx, F, kind, code, Scope);
    }
    MakeConstructor(ctx, writablePrototype, prototype) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const F = this;
        if (writablePrototype === void 0) {
            writablePrototype = intrinsics.true;
        }
        if (prototype === void 0) {
            prototype = $Object.ObjectCreate(ctx, 'constructor', intrinsics['%ObjectPrototype%']);
            const Desc = new $PropertyDescriptor(realm, intrinsics.$constructor);
            Desc['[[Value]]'] = F;
            Desc['[[Writable]]'] = writablePrototype;
            Desc['[[Enumerable]]'] = intrinsics.false;
            Desc['[[Configurable]]'] = intrinsics.true;
            $DefinePropertyOrThrow(ctx, prototype, intrinsics.$constructor, Desc);
        }
        const Desc = new $PropertyDescriptor(realm, intrinsics.$prototype);
        Desc['[[Value]]'] = prototype;
        Desc['[[Writable]]'] = writablePrototype;
        Desc['[[Enumerable]]'] = intrinsics.false;
        Desc['[[Configurable]]'] = intrinsics.false;
        $DefinePropertyOrThrow(ctx, F, intrinsics.$prototype, Desc);
        return intrinsics.undefined;
    }
    SetFunctionName(ctx, name, prefix) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (name.isSymbol) {
            const description = name.Description;
            if (description.isUndefined) {
                name = intrinsics[''];
            }
            else {
                name = new $String(realm, `[${description['[[Value]]']}]`);
            }
        }
        if (prefix !== void 0) {
            name = new $String(realm, `${prefix['[[Value]]']} ${name['[[Value]]']}`);
        }
        const Desc = new $PropertyDescriptor(realm, intrinsics.$name);
        Desc['[[Value]]'] = name;
        Desc['[[Writable]]'] = intrinsics.false;
        Desc['[[Enumerable]]'] = intrinsics.false;
        Desc['[[Configurable]]'] = intrinsics.true;
        return $DefinePropertyOrThrow(ctx, this, intrinsics.$name, Desc);
    }
}
function $OrdinaryCreateFromConstructor(ctx, constructor, intrinsicDefaultProto, internalSlotsList) {
    const proto = $GetPrototypeFromConstructor(ctx, constructor, intrinsicDefaultProto);
    if (proto.isAbrupt) {
        return proto;
    }
    return $Object.ObjectCreate(ctx, intrinsicDefaultProto, proto, internalSlotsList);
}
function $GetPrototypeFromConstructor(ctx, constructor, intrinsicDefaultProto) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    let proto = constructor['[[Get]]'](ctx, intrinsics.$prototype, constructor);
    if (proto.isAbrupt) {
        return proto;
    }
    if (!proto.isObject) {
        proto = intrinsics[intrinsicDefaultProto];
    }
    return proto;
}
function $PrepareForOrdinaryCall(ctx, F, newTarget) {
    const callerContext = ctx;
    const calleeRealm = F['[[Realm]]'];
    const calleeContext = new ExecutionContext(calleeRealm);
    calleeContext.Function = F;
    calleeContext.ScriptOrModule = F['[[ScriptOrModule]]'];
    const localEnv = new $FunctionEnvRec(F['[[ECMAScriptCode]]'].logger, calleeRealm, F, newTarget);
    calleeContext.LexicalEnvironment = localEnv;
    calleeContext.VariableEnvironment = localEnv;
    if (!callerContext.suspended) {
        callerContext.suspend();
    }
    calleeRealm.stack.push(calleeContext);
    return calleeContext;
}
function $OrdinaryCallBindThis(ctx, F, calleeContext, thisArgument) {
    const thisMode = F['[[ThisMode]]'];
    if (thisMode === 'lexical') {
        return new $Undefined(ctx.Realm);
    }
    const calleeRealm = F['[[Realm]]'];
    const localEnv = calleeContext.LexicalEnvironment;
    let thisValue;
    if (thisMode === 'strict') {
        thisValue = thisArgument;
    }
    else {
        if (thisArgument.isNil) {
            const globalEnvRec = calleeRealm['[[GlobalEnv]]'];
            thisValue = globalEnvRec['[[GlobalThisValue]]'];
        }
        else {
            thisValue = thisArgument.ToObject(ctx);
        }
    }
    const envRec = localEnv;
    return envRec.BindThisValue(ctx, thisValue);
}
class $BuiltinFunction extends $Function {
    constructor(realm, IntrinsicName, proto) {
        super(realm, IntrinsicName, proto);
        this['[[Realm]]'] = realm;
        this['[[ScriptOrModule]]'] = realm['[[Intrinsics]]'].null;
    }
    '[[Call]]'(ctx, thisArgument, argumentsList) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const callerContext = ctx;
        if (!callerContext.suspended) {
            callerContext.suspend();
        }
        const calleeRealm = this['[[Realm]]'];
        const calleeContext = new ExecutionContext(calleeRealm);
        calleeContext.Function = this;
        calleeContext.ScriptOrModule = this['[[ScriptOrModule]]'];
        realm.stack.push(calleeContext);
        const result = this.performSteps(calleeContext, thisArgument, argumentsList, intrinsics.undefined);
        realm.stack.pop();
        callerContext.resume();
        return result;
    }
    '[[Construct]]'(ctx, argumentsList, newTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const callerContext = ctx;
        if (!callerContext.suspended) {
            callerContext.suspend();
        }
        const calleeRealm = this['[[Realm]]'];
        const calleeContext = new ExecutionContext(calleeRealm);
        calleeContext.Function = this;
        calleeContext.ScriptOrModule = this['[[ScriptOrModule]]'];
        realm.stack.push(calleeContext);
        const result = this.performSteps(calleeContext, intrinsics.undefined, argumentsList, newTarget);
        realm.stack.pop();
        callerContext.resume();
        return result;
    }
}

class $ValueRecord {
    constructor(value) {
        this['[[Value]]'] = value;
    }
}
class $GetSpecies extends $BuiltinFunction {
    constructor(realm) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'get [@@species]', intrinsics['%FunctionPrototype%']);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return thisArgument;
    }
}

class $ArrayExoticObject extends $Object {
    get isArray() { return true; }
    constructor(realm, length, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        if (proto === void 0) {
            proto = intrinsics['%ArrayPrototype%'];
        }
        super(realm, 'ArrayExoticObject', proto, 1, intrinsics.empty);
        if (length.is(intrinsics['-0'])) {
            length = intrinsics['0'];
        }
        if (length['[[Value]]'] > (2 ** 32 - 1)) {
            throw new RangeError('3. If length > 2^32 - 1, throw a RangeError exception.');
        }
        super['[[DefineOwnProperty]]'](realm.stack.top, intrinsics.length, new $PropertyDescriptor(realm, intrinsics.length, {
            '[[Value]]': length,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.false,
        }));
    }
    '[[DefineOwnProperty]]'(ctx, P, Desc) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (P.is(intrinsics.length)) {
            return this.ArraySetLength(ctx, Desc);
        }
        else if (P.IsArrayIndex) {
            const oldLenDesc = super['[[GetOwnProperty]]'](ctx, intrinsics.length);
            const oldLen = oldLenDesc['[[Value]]'];
            const index = P.ToUint32(ctx);
            if (index['[[Value]]'] >= oldLen['[[Value]]'] && oldLenDesc['[[Writable]]'].isFalsey) {
                return intrinsics.false;
            }
            const succeeded = super['[[DefineOwnProperty]]'](ctx, P, Desc);
            if (succeeded.isFalsey) {
                return intrinsics.false;
            }
            if (index['[[Value]]'] >= oldLen['[[Value]]']) {
                oldLenDesc['[[Value]]'] = new $Number(realm, index['[[Value]]'] + 1);
                super['[[DefineOwnProperty]]'](ctx, intrinsics.length, oldLenDesc);
            }
            return intrinsics.true;
        }
        return super['[[DefineOwnProperty]]'](ctx, P, Desc);
    }
    ArraySetLength(ctx, Desc) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (Desc['[[Value]]'].isEmpty) {
            return super['[[DefineOwnProperty]]'](ctx, intrinsics.length, Desc);
        }
        const newLenDesc = new $PropertyDescriptor(Desc.realm, Desc.name, {
            '[[Writable]]': Desc['[[Writable]]'],
            '[[Enumerable]]': Desc['[[Enumerable]]'],
            '[[Configurable]]': Desc['[[Configurable]]'],
        });
        const newLen = Desc['[[Value]]'].ToUint32(ctx);
        if (newLen.isAbrupt) {
            return newLen;
        }
        const numberLen = Desc['[[Value]]'].ToNumber(ctx);
        if (numberLen.isAbrupt) {
            return numberLen;
        }
        if (!newLen.is(numberLen)) {
            return new $RangeError(ctx.Realm, '5. If newLen ≠ numberLen, throw a RangeError exception.');
        }
        newLenDesc['[[Value]]'] = newLen;
        const oldLenDesc = super['[[GetOwnProperty]]'](ctx, intrinsics.length);
        const oldLen = oldLenDesc['[[Value]]'];
        if (newLen['[[Value]]'] >= oldLen['[[Value]]']) {
            return super['[[DefineOwnProperty]]'](ctx, intrinsics.length, newLenDesc);
        }
        if (oldLenDesc['[[Writable]]'].isFalsey) {
            return intrinsics.false;
        }
        let newWritable;
        if (newLenDesc['[[Writable]]'].isEmpty || newLenDesc['[[Writable]]'].isTruthy) {
            newWritable = true;
        }
        else {
            newWritable = false;
            newLenDesc['[[Writable]]'] = intrinsics.true;
        }
        const succeeded = super['[[DefineOwnProperty]]'](ctx, intrinsics.length, newLenDesc);
        if (succeeded.isFalsey) {
            return intrinsics.false;
        }
        const $newLen = newLen['[[Value]]'];
        let $oldLen = oldLen['[[Value]]'];
        while ($newLen < $oldLen) {
            --$oldLen;
            const deleteSucceeded = this['[[Delete]]'](ctx, new $Number(realm, $oldLen).ToString(ctx));
            if (deleteSucceeded.isFalsey) {
                newLenDesc['[[Value]]'] = new $Number(realm, $oldLen + 1);
                if (!newWritable) {
                    newLenDesc['[[Writable]]'] = intrinsics.false;
                }
                super['[[DefineOwnProperty]]'](ctx, intrinsics.length, newLenDesc);
                return intrinsics.false;
            }
        }
        if (!newWritable) {
            return super['[[DefineOwnProperty]]'](ctx, intrinsics.length, new $PropertyDescriptor(realm, intrinsics.length, {
                '[[Writable]]': intrinsics.false,
            }));
        }
        return intrinsics.true;
    }
}
function $CreateArrayFromList(ctx, elements) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const array = new $ArrayExoticObject(realm, intrinsics['0']);
    let n = 0;
    for (const e of elements) {
        $CreateDataProperty(ctx, array, new $String(realm, n.toString()), e);
        ++n;
    }
    return array;
}

class $PromiseCapability {
    get isUndefined() { return false; }
    get isAbrupt() { return false; }
    constructor(promise, resolve, reject) {
        this['[[Promise]]'] = promise;
        this['[[Resolve]]'] = resolve;
        this['[[Reject]]'] = reject;
    }
}
function $IfAbruptRejectPromise(ctx, value, capability) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (value.isAbrupt) {
        const $CallResult = $Call(ctx, capability['[[Reject]]'], intrinsics.undefined, new $List(value));
        if ($CallResult.isAbrupt) {
            return $CallResult;
        }
        return capability['[[Promise]]'];
    }
    return value;
}
var PromiseReactionType;
(function (PromiseReactionType) {
    PromiseReactionType[PromiseReactionType["Fulfill"] = 1] = "Fulfill";
    PromiseReactionType[PromiseReactionType["Reject"] = 2] = "Reject";
})(PromiseReactionType || (PromiseReactionType = {}));
class $PromiseReaction {
    constructor(capability, type, handler) {
        this['[[Capability]]'] = capability;
        this['[[Type]]'] = type;
        this['[[Handler]]'] = handler;
    }
    is(other) {
        return this === other;
    }
}
class $PromiseResolvingFunctions {
    constructor(realm, promise) {
        const alreadyResolved = new $ValueRecord(false);
        this['[[Resolve]]'] = new $PromiseResolveFunction(realm, promise, alreadyResolved);
        this['[[Reject]]'] = new $PromiseRejectFunction(realm, promise, alreadyResolved);
    }
}
class $PromiseRejectFunction extends $BuiltinFunction {
    constructor(realm, promise, alreadyResolved) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'PromiseRejectFunction', intrinsics['%FunctionPrototype%']);
        this['[[Promise]]'] = promise;
        this['[[AlreadyResolved]]'] = alreadyResolved;
    }
    performSteps(ctx, thisArgument, [reason], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (reason === void 0) {
            reason = intrinsics.undefined;
        }
        const F = this;
        const promise = F['[[Promise]]'];
        const alreadyResolved = F['[[AlreadyResolved]]'];
        if (alreadyResolved['[[Value]]']) {
            return intrinsics.undefined;
        }
        alreadyResolved['[[Value]]'] = true;
        return $RejectPromise(ctx, promise, reason);
    }
}
class $PromiseResolveFunction extends $BuiltinFunction {
    constructor(realm, promise, alreadyResolved) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'PromiseResolveFunction', intrinsics['%FunctionPrototype%']);
        this['[[Promise]]'] = promise;
        this['[[AlreadyResolved]]'] = alreadyResolved;
    }
    performSteps(ctx, thisArgument, [resolution], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (resolution === void 0) {
            resolution = intrinsics.undefined;
        }
        const F = this;
        const promise = F['[[Promise]]'];
        const alreadyResolved = F['[[AlreadyResolved]]'];
        if (alreadyResolved['[[Value]]']) {
            return intrinsics.undefined;
        }
        alreadyResolved['[[Value]]'] = true;
        if (resolution.is(promise)) {
            const selfResolutionError = new $TypeError(realm, `Failed to resolve self`);
            return $RejectPromise(ctx, promise, selfResolutionError);
        }
        if (!resolution.isObject) {
            return $FulfillPromise(ctx, promise, resolution);
        }
        const then = resolution['[[Get]]'](ctx, intrinsics.then, resolution);
        if (then.isAbrupt) {
            return $RejectPromise(ctx, promise, then);
        }
        if (!then.isFunction) {
            return $FulfillPromise(ctx, promise, resolution);
        }
        const mos = ctx.ScriptOrModule;
        if (mos.isNull) {
            throw new Error(`No ScriptOrModule found in this realm`);
        }
        realm.PromiseJobs.EnqueueJob(ctx, new PromiseResolveThenableJob(realm, mos, promise, resolution, then));
        return new $Undefined(realm);
    }
}
function $FulfillPromise(ctx, promise, value) {
    const realm = ctx.Realm;
    realm['[[Intrinsics]]'];
    const reactions = promise['[[PromiseFulfillReactions]]'];
    promise['[[PromiseResult]]'] = value;
    promise['[[PromiseFulfillReactions]]'] = void 0;
    promise['[[PromiseRejectReactions]]'] = void 0;
    promise['[[PromiseState]]'] = 2;
    return $TriggerPromiseReactions(ctx, reactions, value);
}
function $NewPromiseCapability(ctx, C) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (!C.isFunction) {
        return new $TypeError(realm, `Expected constructor, but got: ${C}`);
    }
    const promiseCapability = new $PromiseCapability(intrinsics.undefined, intrinsics.undefined, intrinsics.undefined);
    const executor = new $GetCapabilitiesExecutor(realm, promiseCapability);
    const promise = $Construct(ctx, C, new $List(executor), intrinsics.undefined);
    if (!promiseCapability['[[Resolve]]'].isFunction) {
        return new $TypeError(realm, `Expected [[Resolve]] to be callable, but got: ${promiseCapability['[[Resolve]]']}`);
    }
    if (!promiseCapability['[[Reject]]'].isFunction) {
        return new $TypeError(realm, `Expected [[Reject]] to be callable, but got: ${promiseCapability['[[Reject]]']}`);
    }
    promiseCapability['[[Promise]]'] = promise;
    return promiseCapability;
}
class $GetCapabilitiesExecutor extends $BuiltinFunction {
    constructor(realm, capability) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'GetCapabilitiesExecutor', intrinsics['%FunctionPrototype%']);
        this['[[Capability]]'] = capability;
    }
    performSteps(ctx, thisArgument, [resolve, reject], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (resolve === void 0) {
            resolve = intrinsics.undefined;
        }
        if (reject === void 0) {
            reject = intrinsics.undefined;
        }
        const F = this;
        const promiseCapability = F['[[Capability]]'];
        if (!promiseCapability['[[Resolve]]'].isUndefined) {
            return new $TypeError(realm, `[[Resolve]] is already defined`);
        }
        if (!promiseCapability['[[Reject]]'].isUndefined) {
            return new $TypeError(realm, `[[Reject]] is already defined`);
        }
        promiseCapability['[[Resolve]]'] = resolve;
        promiseCapability['[[Reject]]'] = reject;
        return intrinsics.undefined;
    }
}
function $RejectPromise(ctx, promise, reason) {
    const realm = ctx.Realm;
    realm['[[Intrinsics]]'];
    const reactions = promise['[[PromiseRejectReactions]]'];
    promise['[[PromiseResult]]'] = reason;
    promise['[[PromiseFulfillReactions]]'] = void 0;
    promise['[[PromiseRejectReactions]]'] = void 0;
    promise['[[PromiseState]]'] = 3;
    if (!promise['[[PromiseIsHandled]]']) {
        $HostPromiseRejectionTracker(ctx, promise);
    }
    return $TriggerPromiseReactions(ctx, reactions, reason);
}
function $TriggerPromiseReactions(ctx, reactions, argument) {
    const realm = ctx.Realm;
    realm['[[Intrinsics]]'];
    const promiseJobs = realm.PromiseJobs;
    const mos = ctx.ScriptOrModule;
    if (mos.isNull) {
        throw new Error(`No ScriptOrModule found in this realm`);
    }
    for (const reaction of reactions) {
        promiseJobs.EnqueueJob(ctx, new PromiseReactionJob(realm, mos, reaction, argument));
    }
    return new $Undefined(realm);
}
var PromiseRejectionOperation;
(function (PromiseRejectionOperation) {
    PromiseRejectionOperation[PromiseRejectionOperation["reject"] = 1] = "reject";
    PromiseRejectionOperation[PromiseRejectionOperation["handle"] = 2] = "handle";
})(PromiseRejectionOperation || (PromiseRejectionOperation = {}));
function $HostPromiseRejectionTracker(ctx, promise, operation) {
    ctx.logger.error(`Promise rejected: ${promise}`);
}
class PromiseReactionJob extends Job {
    constructor(realm, scriptOrModule, reaction, argument) {
        super(realm.logger.root, realm, scriptOrModule);
        this.reaction = reaction;
        this.argument = argument;
    }
    Run(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`Run(#${ctx.id})`);
        const reaction = this.reaction;
        const argument = this.argument;
        const promiseCapability = reaction['[[Capability]]'];
        const type = reaction['[[Type]]'];
        const handler = reaction['[[Handler]]'];
        let handlerResult;
        if (handler.isUndefined) {
            if (type === 1) {
                handlerResult = argument;
            }
            else {
                handlerResult = argument.ToCompletion(5, intrinsics.empty);
            }
        }
        else {
            handlerResult = $Call(ctx, handler, intrinsics.undefined, new $List(argument));
        }
        if (promiseCapability.isUndefined) {
            return new $Empty(realm);
        }
        let status;
        if (handlerResult.isAbrupt) {
            status = $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(handlerResult));
        }
        else {
            status = $Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new $List(handlerResult));
        }
        return status;
    }
}
class PromiseResolveThenableJob extends Job {
    constructor(realm, scriptOrModule, promiseToResolve, thenable, then) {
        super(realm.logger.root, realm, scriptOrModule);
        this.promiseToResolve = promiseToResolve;
        this.thenable = thenable;
        this.then = then;
    }
    Run(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`Run(#${ctx.id})`);
        const promiseToResolve = this.promiseToResolve;
        const thenable = this.thenable;
        const then = this.then;
        const resolvingFunctions = new $PromiseResolvingFunctions(realm, promiseToResolve);
        const thenCallResult = $Call(ctx, then, thenable, new $List(resolvingFunctions['[[Resolve]]'], resolvingFunctions['[[Reject]]']));
        if (thenCallResult.isAbrupt) {
            const status = $Call(ctx, resolvingFunctions['[[Reject]]'], intrinsics.undefined, new $List(thenCallResult));
            return status;
        }
        return thenCallResult;
    }
}
class $PromiseConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    get all() {
        return this.getProperty(this.realm['[[Intrinsics]]'].all)['[[Value]]'];
    }
    set all(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].all, value);
    }
    get race() {
        return this.getProperty(this.realm['[[Intrinsics]]'].race)['[[Value]]'];
    }
    set race(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].race, value);
    }
    get reject() {
        return this.getProperty(this.realm['[[Intrinsics]]'].reject)['[[Value]]'];
    }
    set reject(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].reject, value);
    }
    get resolve() {
        return this.getProperty(this.realm['[[Intrinsics]]'].resolve)['[[Value]]'];
    }
    set resolve(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].resolve, value, false, false, false);
    }
    get ['@@species']() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@species'])['[[Value]]'];
    }
    set ['@@species'](value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@species'], value, false, false, false);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Promise%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [executor], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (NewTarget.isUndefined) {
            return new $TypeError(realm, `Promise cannot be called as a function.`);
        }
        if (executor === void 0 || !executor.isFunction) {
            return new $TypeError(realm, `The promise constructor requires an executor function`);
        }
        const promise = $PromiseInstance.Create(ctx, NewTarget);
        if (promise.isAbrupt) {
            return promise;
        }
        promise['[[PromiseState]]'] = 1;
        promise['[[PromiseFulfillReactions]]'] = new $List();
        promise['[[PromiseRejectReactions]]'] = new $List();
        promise['[[PromiseIsHandled]]'] = false;
        const resolvingFunctions = new $PromiseResolvingFunctions(realm, promise);
        const completion = $Call(ctx, executor, intrinsics.undefined, new $List(resolvingFunctions['[[Resolve]]'], resolvingFunctions['[[Reject]]']));
        if (completion.isAbrupt) {
            const $CallResult = $Call(ctx, resolvingFunctions['[[Reject]]'], intrinsics.undefined, new $List(completion));
            if ($CallResult.isAbrupt) {
                return $CallResult;
            }
        }
        return promise;
    }
}
class $Promise_all extends $BuiltinFunction {
    constructor(realm, functionPrototype) {
        super(realm, '%Promise_all%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [iterable], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (iterable === void 0) {
            iterable = intrinsics.undefined;
        }
        const C = thisArgument;
        if (!C.isObject) {
            return new $TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
        }
        const promiseCapability = $NewPromiseCapability(ctx, C);
        if (promiseCapability.isAbrupt) {
            return promiseCapability;
        }
        const iteratorRecord = $GetIterator(ctx, iterable);
        if (iteratorRecord.isAbrupt) {
            return iteratorRecord;
        }
        const maybeAbrupt = $IfAbruptRejectPromise(ctx, iteratorRecord, promiseCapability);
        if (maybeAbrupt.isAbrupt) {
            return maybeAbrupt;
        }
        let result = PerformPromiseAll(ctx, iteratorRecord, C, promiseCapability);
        if (result.isAbrupt) {
            if (iteratorRecord['[[Done]]'].isFalsey) {
                result = $IteratorClose(ctx, iteratorRecord, result);
            }
            const maybeAbrupt = $IfAbruptRejectPromise(ctx, result, promiseCapability);
            if (maybeAbrupt.isAbrupt) {
                return maybeAbrupt;
            }
        }
        return result;
    }
}
function PerformPromiseAll(ctx, iteratorRecord, constructor, resultCapability) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const values = new $List();
    const remainingElementsCount = new $ValueRecord(1);
    let index = 0;
    while (true) {
        const next = $IteratorStep(ctx, iteratorRecord);
        if (next.isAbrupt) {
            iteratorRecord['[[Done]]'] = intrinsics.true;
            return next;
        }
        if (next.isFalsey) {
            iteratorRecord['[[Done]]'] = intrinsics.true;
            if (--remainingElementsCount['[[Value]]'] === 0) {
                const valuesArray = $CreateArrayFromList(ctx, values);
                const $CallResult = $Call(ctx, resultCapability['[[Resolve]]'], intrinsics.undefined, new $List(valuesArray));
                if ($CallResult.isAbrupt) {
                    return $CallResult;
                }
            }
            return resultCapability['[[Promise]]'];
        }
        const nextValue = $IteratorValue(ctx, next);
        if (nextValue.isAbrupt) {
            iteratorRecord['[[Done]]'] = intrinsics.true;
            return nextValue;
        }
        values.push(new $Undefined(realm));
        const nextPromise = $Invoke(ctx, constructor, intrinsics.resolve, new $List(nextValue));
        if (nextPromise.isAbrupt) {
            return nextPromise;
        }
        const resolveElement = new $Promise_all_ResolveElement(realm, new $ValueRecord(false), index, values, resultCapability, remainingElementsCount);
        ++remainingElementsCount['[[Value]]'];
        const $InvokeResult = $Invoke(ctx, nextPromise, intrinsics.then, new $List(resolveElement, resultCapability['[[Reject]]']));
        if ($InvokeResult.isAbrupt) {
            return $InvokeResult;
        }
        ++index;
    }
}
class $Promise_all_ResolveElement extends $BuiltinFunction {
    constructor(realm, alreadyCalled, index, values, capability, remainingElements) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'Promise.all Resolve Element', intrinsics['%FunctionPrototype%']);
        this['[[AlreadyCalled]]'] = alreadyCalled;
        this['[[Index]]'] = index;
        this['[[Values]]'] = values;
        this['[[Capability]]'] = capability;
        this['[[RemainingElements]]'] = remainingElements;
    }
    performSteps(ctx, thisArgument, [x], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (x === void 0) {
            x = intrinsics.undefined;
        }
        const F = this;
        const alreadyCalled = F['[[AlreadyCalled]]'];
        if (alreadyCalled['[[Value]]']) {
            return intrinsics.undefined;
        }
        alreadyCalled['[[Value]]'] = true;
        const index = F['[[Index]]'];
        const values = F['[[Values]]'];
        const promiseCapability = F['[[Capability]]'];
        const remainingElementsCount = F['[[RemainingElements]]'];
        values[index] = x;
        if (--remainingElementsCount['[[Value]]'] === 0) {
            const valuesArray = $CreateArrayFromList(ctx, values);
            return $Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new $List(valuesArray));
        }
        return intrinsics.undefined;
    }
}
class $Promise_race extends $BuiltinFunction {
    constructor(realm, functionPrototype) {
        super(realm, '%Promise_race%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [iterable], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (iterable === void 0) {
            iterable = intrinsics.undefined;
        }
        const C = thisArgument;
        if (!C.isObject) {
            return new $TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
        }
        const promiseCapability = $NewPromiseCapability(ctx, C);
        if (promiseCapability.isAbrupt) {
            return promiseCapability;
        }
        const iteratorRecord = $GetIterator(ctx, iterable);
        if (iteratorRecord.isAbrupt) {
            return iteratorRecord;
        }
        const maybeAbrupt = $IfAbruptRejectPromise(ctx, iteratorRecord, promiseCapability);
        if (maybeAbrupt.isAbrupt) {
            return maybeAbrupt;
        }
        let result = PerformPromiseAll(ctx, iteratorRecord, C, promiseCapability);
        if (result.isAbrupt) {
            if (iteratorRecord['[[Done]]'].isFalsey) {
                result = $IteratorClose(ctx, iteratorRecord, result);
            }
            const maybeAbrupt = $IfAbruptRejectPromise(ctx, result, promiseCapability);
            if (maybeAbrupt.isAbrupt) {
                return maybeAbrupt;
            }
        }
        return result;
    }
}
class $Promise_reject extends $BuiltinFunction {
    constructor(realm, functionPrototype) {
        super(realm, '%Promise_reject%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [r], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (r === void 0) {
            r = intrinsics.undefined;
        }
        const C = thisArgument;
        if (!C.isObject) {
            return new $TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
        }
        const promiseCapability = $NewPromiseCapability(ctx, C);
        if (promiseCapability.isAbrupt) {
            return promiseCapability;
        }
        const $CallResult = $Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new $List(r));
        if ($CallResult.isAbrupt) {
            return $CallResult;
        }
        return promiseCapability['[[Promise]]'];
    }
}
class $Promise_resolve extends $BuiltinFunction {
    constructor(realm, functionPrototype) {
        super(realm, '%Promise_resolve%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [x], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (x === void 0) {
            x = intrinsics.undefined;
        }
        const C = thisArgument;
        if (!C.isObject) {
            return new $TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
        }
        return $PromiseResolve(ctx, C, x);
    }
}
function $PromiseResolve(ctx, C, x) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (x instanceof $PromiseInstance) {
        const xConstructor = x['[[Get]]'](ctx, intrinsics.$constructor, x);
        if (xConstructor.is(C)) {
            return x;
        }
    }
    const promiseCapability = $NewPromiseCapability(ctx, C);
    if (promiseCapability.isAbrupt) {
        return promiseCapability;
    }
    const $CallResult = $Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new $List(x));
    if ($CallResult.isAbrupt) {
        return $CallResult;
    }
    return promiseCapability['[[Promise]]'];
}
class $PromisePrototype extends $Object {
    get catch() {
        return this.getProperty(this.realm['[[Intrinsics]]'].catch)['[[Value]]'];
    }
    set catch(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].catch, value);
    }
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get finally() {
        return this.getProperty(this.realm['[[Intrinsics]]'].finally)['[[Value]]'];
    }
    set finally(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].finally, value);
    }
    get then() {
        return this.getProperty(this.realm['[[Intrinsics]]'].then)['[[Value]]'];
    }
    set then(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].then, value);
    }
    get '@@toStringTag'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
    }
    set '@@toStringTag'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
    }
    constructor(realm, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%PromisePrototype%', proto, 1, intrinsics.empty);
    }
}
class $PromiseProto_catch extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%PromiseProto_catch%', proto);
    }
    performSteps(ctx, thisArgument, [onRejected], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (onRejected === void 0) {
            onRejected = intrinsics.undefined;
        }
        const promise = thisArgument;
        return $Invoke(ctx, promise, intrinsics.then, new $List(intrinsics.undefined, onRejected));
    }
}
class $PromiseProto_finally extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%PromiseProto_finally%', proto);
    }
    performSteps(ctx, thisArgument, [onFinally], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (onFinally === void 0) {
            onFinally = intrinsics.undefined;
        }
        const promise = thisArgument;
        if (!promise.isObject) {
            return new $TypeError(realm, `Expected 'this' to be an object, but got: ${promise}`);
        }
        const C = $SpeciesConstructor(ctx, promise, intrinsics['%Promise%']);
        if (C.isAbrupt) {
            return C;
        }
        let thenFinally;
        let catchFinally;
        if (!onFinally.isFunction) {
            thenFinally = onFinally;
            catchFinally = onFinally;
        }
        else {
            thenFinally = new $ThenFinally(realm, C, onFinally);
            catchFinally = new $CatchFinally(realm, C, onFinally);
        }
        return $Invoke(ctx, promise, intrinsics.then, new $List(thenFinally, catchFinally));
    }
}
class $ThenFinally extends $BuiltinFunction {
    constructor(realm, constructor, onFinally) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'Then Finally', intrinsics['%FunctionPrototype%']);
        this['[[Constructor]]'] = constructor;
        this['[[OnFinally]]'] = onFinally;
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const F = this;
        const onFinally = F['[[OnFinally]]'];
        const result = $Call(ctx, onFinally, intrinsics.undefined, intrinsics.undefined);
        if (result.isAbrupt) {
            return result;
        }
        const C = F['[[Constructor]]'];
        const promise = $PromiseResolve(ctx, C, result);
        if (promise.isAbrupt) {
            return promise;
        }
        const valueThunk = new $ValueThunk(realm, value);
        return $Invoke(ctx, promise, intrinsics.then, new $List(valueThunk));
    }
}
class $ValueThunk extends $BuiltinFunction {
    constructor(realm, value) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'ValueThunk', intrinsics['%FunctionPrototype%']);
        this.value = value;
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return this.value;
    }
}
class $CatchFinally extends $BuiltinFunction {
    constructor(realm, constructor, onFinally) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'Catch Finally', intrinsics['%FunctionPrototype%']);
        this['[[Constructor]]'] = constructor;
        this['[[OnFinally]]'] = onFinally;
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const F = this;
        const onFinally = F['[[OnFinally]]'];
        const result = $Call(ctx, onFinally, intrinsics.undefined, intrinsics.undefined);
        if (result.isAbrupt) {
            return result;
        }
        const C = F['[[Constructor]]'];
        const promise = $PromiseResolve(ctx, C, result);
        if (promise.isAbrupt) {
            return promise;
        }
        const thrower = new $Thrower(realm, value);
        return $Invoke(ctx, promise, intrinsics.then, new $List(thrower));
    }
}
class $Thrower extends $BuiltinFunction {
    constructor(realm, reason) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'Thrower', intrinsics['%FunctionPrototype%']);
        this.reason = reason;
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return this.reason.ToCompletion(5, ctx.Realm['[[Intrinsics]]'].empty);
    }
}
class $PromiseProto_then extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%PromiseProto_then%', proto);
    }
    performSteps(ctx, thisArgument, [onFulfilled, onRejected], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (onFulfilled === void 0) {
            onFulfilled = intrinsics.undefined;
        }
        if (onRejected === void 0) {
            onRejected = intrinsics.undefined;
        }
        const promise = thisArgument;
        if (!promise.isObject) {
            return new $TypeError(realm, `Expected 'this' to be an object, but got: ${promise}`);
        }
        const C = $SpeciesConstructor(ctx, promise, intrinsics['%Promise%']);
        if (C.isAbrupt) {
            return C;
        }
        const resultCapability = $NewPromiseCapability(ctx, C);
        if (resultCapability.isAbrupt) {
            return resultCapability;
        }
        return $PerformPromiseThen(ctx, promise, onFulfilled, onRejected, resultCapability);
    }
}
function $PerformPromiseThen(ctx, promise, onFulfilled, onRejected, resultCapability) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (resultCapability !== void 0) ;
    else {
        resultCapability = intrinsics.undefined;
    }
    if (!onFulfilled.isFunction) {
        onFulfilled = intrinsics.undefined;
    }
    if (!onRejected.isFunction) {
        onRejected = intrinsics.undefined;
    }
    const fulfillReaction = new $PromiseReaction(resultCapability, 1, onFulfilled);
    const rejectReaction = new $PromiseReaction(resultCapability, 2, onRejected);
    if (promise['[[PromiseState]]'] === 1) {
        promise['[[PromiseFulfillReactions]]'].push(fulfillReaction);
        promise['[[PromiseRejectReactions]]'].push(rejectReaction);
    }
    else if (promise['[[PromiseState]]'] === 2) {
        const value = promise['[[PromiseResult]]'];
        realm.PromiseJobs.EnqueueJob(ctx, new PromiseReactionJob(realm, ctx.ScriptOrModule, fulfillReaction, value));
    }
    else {
        const reason = promise['[[PromiseResult]]'];
        if (!promise['[[PromiseIsHandled]]']) {
            $HostPromiseRejectionTracker(ctx, promise);
        }
        realm.PromiseJobs.EnqueueJob(ctx, new PromiseReactionJob(realm, ctx.ScriptOrModule, rejectReaction, reason));
    }
    promise['[[PromiseIsHandled]]'] = true;
    if (resultCapability === void 0 || resultCapability.isUndefined) {
        return intrinsics.undefined;
    }
    else {
        return resultCapability['[[Promise]]'];
    }
}
var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["pending"] = 1] = "pending";
    PromiseState[PromiseState["fulfilled"] = 2] = "fulfilled";
    PromiseState[PromiseState["rejected"] = 3] = "rejected";
})(PromiseState || (PromiseState = {}));
class $PromiseInstance extends $Object {
    constructor(realm, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'PromiseInstance', proto, 1, intrinsics.empty);
        this['[[PromiseState]]'] = 1;
        this['[[PromiseResult]]'] = void 0;
        this['[[PromiseFulfillReactions]]'] = new $List();
        this['[[PromiseRejectReactions]]'] = new $List();
        this['[[PromiseIsHandled]]'] = false;
    }
    static Create(ctx, NewTarget) {
        const proto = $GetPrototypeFromConstructor(ctx, NewTarget, '%PromisePrototype%');
        if (proto.isAbrupt) {
            return proto;
        }
        return new $PromiseInstance(ctx.Realm, proto);
    }
}

function $GetIterator(ctx, obj, hint, method) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (hint === void 0) {
        hint = 'sync';
    }
    if (method === void 0) {
        if (hint === 'async') {
            const $method = $GetMethod(ctx, obj, intrinsics['@@asyncIterator']);
            if ($method.isAbrupt) {
                return $method;
            }
            method = $method;
            if (method.isUndefined) {
                const syncMethod = $GetMethod(ctx, obj, intrinsics['@@iterator']);
                if (syncMethod.isAbrupt) {
                    return syncMethod;
                }
                const syncIteratorRecord = $GetIterator(ctx, obj, 'sync', syncMethod);
                if (syncIteratorRecord.isAbrupt) {
                    return syncIteratorRecord;
                }
                return $CreateAsyncFromSyncIterator(ctx, syncIteratorRecord);
            }
        }
        else {
            const $method = $GetMethod(ctx, obj, intrinsics['@@iterator']);
            if ($method.isAbrupt) {
                return $method;
            }
            method = $method;
        }
    }
    const iterator = $Call(ctx, method, obj, intrinsics.undefined);
    if (iterator.isAbrupt) {
        return iterator;
    }
    if (!iterator.isObject) {
        return new $TypeError(realm, `The iterator is ${iterator}, but expected an object`);
    }
    const nextMethod = iterator['[[Get]]'](ctx, intrinsics.next, iterator);
    if (nextMethod.isAbrupt) {
        return nextMethod;
    }
    const iteratorRecord = new $IteratorRecord(iterator, nextMethod, intrinsics.false);
    return iteratorRecord;
}
function $IteratorNext(ctx, iteratorRecord, value) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    let result;
    if (value === void 0) {
        const $result = $Call(ctx, iteratorRecord['[[NextMethod]]'], iteratorRecord['[[Iterator]]'], intrinsics.undefined);
        if ($result.isAbrupt) {
            return $result;
        }
        result = $result;
    }
    else {
        const $result = $Call(ctx, iteratorRecord['[[NextMethod]]'], iteratorRecord['[[Iterator]]'], new $List(value));
        if ($result.isAbrupt) {
            return $result;
        }
        result = $result;
    }
    if (!result.isObject) {
        return new $TypeError(ctx.Realm, `The iterator next result is ${result}, but expected an object`);
    }
    return result;
}
function $IteratorComplete(ctx, iterResult) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    return iterResult['[[Get]]'](ctx, intrinsics.$done, iterResult).ToBoolean(ctx);
}
function $IteratorValue(ctx, iterResult) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    return iterResult['[[Get]]'](ctx, intrinsics.$value, iterResult);
}
function $IteratorStep(ctx, iteratorRecord) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const result = $IteratorNext(ctx, iteratorRecord);
    if (result.isAbrupt) {
        return result;
    }
    const done = $IteratorComplete(ctx, result);
    if (done.isAbrupt) {
        return done;
    }
    if (done.isTruthy) {
        return intrinsics.false;
    }
    return result;
}
function $IteratorClose(ctx, iteratorRecord, completion) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const iterator = iteratorRecord['[[Iterator]]'];
    const $return = iterator.GetMethod(ctx, intrinsics.$return);
    if ($return.isAbrupt) {
        return $return;
    }
    if ($return.isUndefined) {
        return completion;
    }
    const innerResult = $Call(ctx, $return, iterator, intrinsics.undefined);
    if (completion['[[Type]]'] === 5) {
        return completion;
    }
    if (innerResult['[[Type]]'] === 5) {
        return innerResult;
    }
    if (!innerResult.isObject) {
        return new $TypeError(realm, `The iterator close innerResult is ${innerResult}, but expected an object`);
    }
    return completion;
}
function $CreateIterResultObject(ctx, value, done) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const obj = $Object.ObjectCreate(ctx, 'IterResultObject', intrinsics['%ObjectPrototype%']);
    $CreateDataProperty(ctx, obj, intrinsics.$value, value);
    $CreateDataProperty(ctx, obj, intrinsics.$done, done);
    return obj;
}
function $CreateListIteratorRecord(ctx, list) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    return new $IteratorRecord(new $ListIterator(realm, list), new $ListIterator_next(realm), intrinsics.false);
}
class $ListIterator_next extends $BuiltinFunction {
    constructor(realm) {
        super(realm, 'ListIterator_next', realm['[[Intrinsics]]']['%FunctionPrototype%']);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = thisArgument;
        const list = O['[[IteratedList]]'];
        const index = O['[[ListIteratorNextIndex]]'];
        const len = list.length;
        if (index['[[Value]]'] >= len) {
            return $CreateIterResultObject(ctx, intrinsics.undefined, intrinsics.true);
        }
        O['[[ListIteratorNextIndex]]'] = new $Number(realm, index['[[Value]]'] + 1);
        return $CreateIterResultObject(ctx, list[index['[[Value]]']], intrinsics.false);
    }
}
class $ListIterator extends $Object {
    get isAbrupt() { return false; }
    constructor(realm, list) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'ListIterator', intrinsics['%IteratorPrototype%'], 1, intrinsics.empty);
        this['[[IteratedList]]'] = list;
        this['[[ListIteratorNextIndex]]'] = new $Number(realm, 0);
    }
}
class $IteratorRecord {
    get isAbrupt() { return false; }
    constructor(iterator, next, done) {
        this['[[Iterator]]'] = iterator;
        this['[[NextMethod]]'] = next;
        this['[[Done]]'] = done;
    }
}
class $AsyncFromSyncIterator extends $Object {
    constructor(realm, syncIteratorRecord) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'AsyncFromSyncIterator', intrinsics['%AsyncFromSyncIteratorPrototype%'], 1, intrinsics.empty);
        this['[[SyncIteratorRecord]]'] = syncIteratorRecord;
    }
}
class $Symbol_Iterator extends $BuiltinFunction {
    constructor(realm) {
        super(realm, '[Symbol.iterator]', realm['[[Intrinsics]]']['%FunctionPrototype%']);
        this.SetFunctionName(realm.stack.top, new $String(realm, '[Symbol.iterator]'));
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return thisArgument;
    }
}
class $Symbol_AsyncIterator extends $BuiltinFunction {
    constructor(realm) {
        super(realm, '[Symbol.asyncIterator]', realm['[[Intrinsics]]']['%FunctionPrototype%']);
        this.SetFunctionName(realm.stack.top, new $String(realm, '[Symbol.asyncIterator]'));
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return thisArgument;
    }
}
class $IteratorPrototype extends $Object {
    constructor(realm, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%IteratorPrototype%', proto, 1, intrinsics.empty);
        $DefinePropertyOrThrow(realm.stack.top, this, intrinsics['@@iterator'], new $PropertyDescriptor(realm, intrinsics['@@iterator'], {
            '[[Value]]': new $Symbol_Iterator(realm),
        }));
    }
}
class $AsyncIteratorPrototype extends $Object {
    constructor(realm, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%AsyncIteratorPrototype%', proto, 1, intrinsics.empty);
        $DefinePropertyOrThrow(realm.stack.top, this, intrinsics['@@asyncIterator'], new $PropertyDescriptor(realm, intrinsics['@@asyncIterator'], {
            '[[Value]]': new $Symbol_AsyncIterator(realm),
        }));
    }
}
function $CreateAsyncFromSyncIterator(ctx, syncIteratorRecord) {
    const realm = ctx.Realm;
    const asyncIterator = new $AsyncFromSyncIterator(realm, syncIteratorRecord);
    return $GetIterator(ctx, asyncIterator, 'async');
}
class $AsyncFromSyncIteratorPrototype extends $Object {
    get next() {
        return this.getProperty(this.realm['[[Intrinsics]]'].next)['[[Value]]'];
    }
    set next(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].next, value);
    }
    get return() {
        return this.getProperty(this.realm['[[Intrinsics]]'].return)['[[Value]]'];
    }
    set return(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].return, value);
    }
    get throw() {
        return this.getProperty(this.realm['[[Intrinsics]]'].throw)['[[Value]]'];
    }
    set throw(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].throw, value);
    }
    get '@@toStringTag'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
    }
    set '@@toStringTag'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
    }
    constructor(realm, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%AsyncFromSyncIteratorPrototype%', proto, 1, intrinsics.empty);
    }
}
class $AsyncFromSyncIteratorPrototype_next extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%AsyncFromSyncIteratorPrototype%.next', proto);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const O = thisArgument;
        const promiseCapability = $NewPromiseCapability(ctx, intrinsics['%Promise%']);
        if (!(O instanceof $AsyncFromSyncIterator)) {
            const invalidIteratorError = new $TypeError(realm, `Expected AsyncFromSyncIterator, but got: ${O}`);
            $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(invalidIteratorError));
            return promiseCapability['[[Promise]]'];
        }
        const syncIteratorRecord = O['[[SyncIteratorRecord]]'];
        const result = $IteratorNext(ctx, syncIteratorRecord, value);
        const $IfAbruptRejectPromiseResult = $IfAbruptRejectPromise(ctx, result, promiseCapability);
        if ($IfAbruptRejectPromiseResult.isAbrupt) {
            return $IfAbruptRejectPromiseResult;
        }
        return $AsyncFromSyncIteratorContinuation(ctx, result, promiseCapability);
    }
}
class $AsyncFromSyncIteratorPrototype_return extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%AsyncFromSyncIteratorPrototype%.return', proto);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const O = thisArgument;
        const promiseCapability = $NewPromiseCapability(ctx, intrinsics['%Promise%']);
        if (!(O instanceof $AsyncFromSyncIterator)) {
            const invalidIteratorError = new $TypeError(realm, `Expected AsyncFromSyncIterator, but got: ${O}`);
            $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(invalidIteratorError));
            return promiseCapability['[[Promise]]'];
        }
        const syncIterator = O['[[SyncIteratorRecord]]']['[[Iterator]]'];
        const $return = $GetMethod(ctx, syncIterator, intrinsics.return);
        let $IfAbruptRejectPromiseResult = $IfAbruptRejectPromise(ctx, $return, promiseCapability);
        if ($IfAbruptRejectPromiseResult.isAbrupt) {
            return $IfAbruptRejectPromiseResult;
        }
        if ($return.isUndefined) {
            const iterResult = $CreateIterResultObject(ctx, value, intrinsics.true);
            $Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new $List(iterResult));
            return promiseCapability['[[Promise]]'];
        }
        const result = $Call(ctx, $return, syncIterator, new $List(value));
        $IfAbruptRejectPromiseResult = $IfAbruptRejectPromise(ctx, result, promiseCapability);
        if ($IfAbruptRejectPromiseResult.isAbrupt) {
            return $IfAbruptRejectPromiseResult;
        }
        if (!result.isObject) {
            const err = new $TypeError(realm, `Expected syncIterator return result to be an object, but got: ${result}`);
            $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(err));
            return promiseCapability['[[Promise]]'];
        }
        return $AsyncFromSyncIteratorContinuation(ctx, result, promiseCapability);
    }
}
class $AsyncFromSyncIteratorPrototype_throw extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%AsyncFromSyncIteratorPrototype%.throw', proto);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const O = thisArgument;
        const promiseCapability = $NewPromiseCapability(ctx, intrinsics['%Promise%']);
        if (!(O instanceof $AsyncFromSyncIterator)) {
            const invalidIteratorError = new $TypeError(realm, `Expected AsyncFromSyncIterator, but got: ${O}`);
            $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(invalidIteratorError));
            return promiseCapability['[[Promise]]'];
        }
        const syncIterator = O['[[SyncIteratorRecord]]']['[[Iterator]]'];
        const $throw = $GetMethod(ctx, syncIterator, intrinsics.throw);
        let $IfAbruptRejectPromiseResult = $IfAbruptRejectPromise(ctx, $throw, promiseCapability);
        if ($IfAbruptRejectPromiseResult.isAbrupt) {
            return $IfAbruptRejectPromiseResult;
        }
        if ($throw.isUndefined) {
            $Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new $List(value));
            return promiseCapability['[[Promise]]'];
        }
        const result = $Call(ctx, $throw, syncIterator, new $List(value));
        $IfAbruptRejectPromiseResult = $IfAbruptRejectPromise(ctx, result, promiseCapability);
        if ($IfAbruptRejectPromiseResult.isAbrupt) {
            return $IfAbruptRejectPromiseResult;
        }
        if (!result.isObject) {
            const err = new $TypeError(realm, `Expected syncIterator return result to be an object, but got: ${result}`);
            $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(err));
            return promiseCapability['[[Promise]]'];
        }
        return $AsyncFromSyncIteratorContinuation(ctx, result, promiseCapability);
    }
}
class $AsyncFromSyncIterator_Value_Unwrap extends $BuiltinFunction {
    constructor(realm, done) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'Async-from-Sync Iterator Value Unwrap', intrinsics['%FunctionPrototype%']);
        this['[[Done]]'] = done;
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const F = this;
        return $CreateIterResultObject(ctx, value, F['[[Done]]']);
    }
}
function $AsyncFromSyncIteratorContinuation(ctx, result, promiseCapability) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const done = $IteratorComplete(ctx, result);
    let $IfAbruptRejectPromiseResult = $IfAbruptRejectPromise(ctx, done, promiseCapability);
    if ($IfAbruptRejectPromiseResult.isAbrupt) {
        return $IfAbruptRejectPromiseResult;
    }
    const value = $IteratorValue(ctx, result);
    $IfAbruptRejectPromiseResult = $IfAbruptRejectPromise(ctx, value, promiseCapability);
    if ($IfAbruptRejectPromiseResult.isAbrupt) {
        return $IfAbruptRejectPromiseResult;
    }
    const valueWrapper = $PromiseResolve(ctx, intrinsics['%Promise%'], new $List(value));
    if (valueWrapper.isAbrupt) {
        return valueWrapper;
    }
    const onFulfilled = new $AsyncFromSyncIterator_Value_Unwrap(realm, done);
    $PerformPromiseThen(ctx, valueWrapper, onFulfilled, intrinsics.undefined, promiseCapability);
    return promiseCapability['[[Promise]]'];
}

class $StringExoticObject extends $Object {
    constructor(realm, value, proto) {
        super(realm, 'StringExoticObject', proto, 1, realm['[[Intrinsics]]'].empty);
        this['[[StringData]]'] = value;
        const length = value['[[Value]]'].length;
        $DefinePropertyOrThrow(realm.stack.top, this, realm['[[Intrinsics]]'].length, new $PropertyDescriptor(realm, realm['[[Intrinsics]]'].length, {
            '[[Value]]': new $Number(realm, length),
            '[[Writable]]': realm['[[Intrinsics]]'].false,
            '[[Enumerable]]': realm['[[Intrinsics]]'].false,
            '[[Configurable]]': realm['[[Intrinsics]]'].false,
        }));
    }
    '[[GetOwnProperty]]'(ctx, P) {
        const desc = super['[[GetOwnProperty]]'](ctx, P);
        if (!desc.isUndefined) {
            return desc;
        }
        return $StringGetOwnProperty(ctx, this, P);
    }
    '[[DefineOwnProperty]]'(ctx, P, Desc) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const stringDesc = $StringGetOwnProperty(ctx, this, P);
        if (!stringDesc.isUndefined) {
            const extensible = this['[[Extensible]]'];
            return $ValidateAndApplyPropertyDescriptor(ctx, intrinsics.undefined, intrinsics.undefined, extensible, Desc, stringDesc);
        }
        return super['[[DefineOwnProperty]]'](ctx, P, Desc);
    }
    '[[OwnPropertyKeys]]'(ctx) {
        const realm = ctx.Realm;
        const keys = new $List();
        const str = this['[[StringData]]'];
        const len = str['[[Value]]'].length;
        let i = 0;
        let keysLen = 0;
        for (; i < len; ++i) {
            keys[keysLen++] = new $String(realm, i.toString());
        }
        return keys;
    }
}
function $StringGetOwnProperty(ctx, S, P) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    if (!P.isString) {
        return intrinsics.undefined;
    }
    const index = P.CanonicalNumericIndexString(ctx);
    if (index.isUndefined) {
        return intrinsics.undefined;
    }
    if (!index.IsInteger) {
        return intrinsics.undefined;
    }
    if (index.is(intrinsics['-0'])) {
        return intrinsics.undefined;
    }
    const str = S['[[StringData]]'];
    const len = str['[[Value]]'].length;
    if (index['[[Value]]'] < 0 || len <= index['[[Value]]']) {
        return intrinsics.undefined;
    }
    const resultStr = new $String(realm, str['[[Value]]'][index['[[Value]]']]);
    return new $PropertyDescriptor(realm, P, {
        '[[Value]]': resultStr,
        '[[Writable]]': intrinsics.false,
        '[[Enumerable]]': intrinsics.true,
        '[[Configurable]]': intrinsics.false,
    });
}

class $StringConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%String%', functionPrototype);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        let s;
        if (argumentsList.length === 0) {
            s = new $String(realm, '');
        }
        else {
            const [value] = argumentsList;
            if (NewTarget.isUndefined && value.isSymbol) ;
            const $s = value.ToString(ctx);
            if ($s.isAbrupt) {
                return $s;
            }
            s = $s;
        }
        if (NewTarget.isUndefined) {
            return s;
        }
        const proto = $GetPrototypeFromConstructor(ctx, NewTarget, '%StringPrototype%');
        if (proto.isAbrupt) {
            return proto;
        }
        return new $StringExoticObject(realm, s, proto);
    }
}
class $StringPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    constructor(realm, objectPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%StringPrototype%', objectPrototype, 1, intrinsics.empty);
        this['[[StringData]]'] = new $String(realm, '');
    }
}
class $StringSet {
    constructor() {
        this.arr = [];
        this.map = new Map();
    }
    has(item) {
        return this.map.has(item['[[Value]]']);
    }
    add(item) {
        const arr = this.arr;
        const map = this.map;
        const value = item['[[Value]]'];
        let idx = map.get(value);
        if (idx === void 0) {
            arr[idx = arr.length] = item;
            map.set(value, idx);
        }
        else {
            arr[idx] = item;
        }
    }
    [Symbol.iterator]() {
        return this.arr[Symbol.iterator]();
    }
}

class $ObjectConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    get $assign() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$assign)['[[Value]]'];
    }
    set $assign(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$assign, value);
    }
    get $create() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$create)['[[Value]]'];
    }
    set $create(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$create, value);
    }
    get $defineProperties() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$defineProperties)['[[Value]]'];
    }
    set $defineProperties(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$defineProperties, value);
    }
    get $defineProperty() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$defineProperty)['[[Value]]'];
    }
    set $defineProperty(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$defineProperty, value);
    }
    get $entries() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$entries)['[[Value]]'];
    }
    set $entries(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$entries, value);
    }
    get $freeze() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$freeze)['[[Value]]'];
    }
    set $freeze(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$freeze, value);
    }
    get $fromEntries() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$fromEntries)['[[Value]]'];
    }
    set $fromEntries(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$fromEntries, value);
    }
    get $getOwnPropertyDescriptor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyDescriptor)['[[Value]]'];
    }
    set $getOwnPropertyDescriptor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyDescriptor, value);
    }
    get $getOwnPropertyDescriptors() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyDescriptors)['[[Value]]'];
    }
    set $getOwnPropertyDescriptors(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyDescriptors, value);
    }
    get $getOwnPropertyNames() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyNames)['[[Value]]'];
    }
    set $getOwnPropertyNames(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyNames, value);
    }
    get $getOwnPropertySymbols() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$getOwnPropertySymbols)['[[Value]]'];
    }
    set $getOwnPropertySymbols(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$getOwnPropertySymbols, value);
    }
    get $getPrototypeOf() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$getPrototypeOf)['[[Value]]'];
    }
    set $getPrototypeOf(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$getPrototypeOf, value);
    }
    get $is() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$is)['[[Value]]'];
    }
    set $is(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$is, value);
    }
    get $isExtensible() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$isExtensible)['[[Value]]'];
    }
    set $isExtensible(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$isExtensible, value);
    }
    get $isFrozen() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$isFrozen)['[[Value]]'];
    }
    set $isFrozen(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$isFrozen, value);
    }
    get $isSealed() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$isSealed)['[[Value]]'];
    }
    set $isSealed(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$isSealed, value);
    }
    get $keys() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$keys)['[[Value]]'];
    }
    set $keys(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$keys, value);
    }
    get $preventExtensions() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$preventExtensions)['[[Value]]'];
    }
    set $preventExtensions(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$preventExtensions, value);
    }
    get $seal() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$seal)['[[Value]]'];
    }
    set $seal(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$seal, value);
    }
    get $setPrototypeOf() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$setPrototypeOf)['[[Value]]'];
    }
    set $setPrototypeOf(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$setPrototypeOf, value);
    }
    get $values() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$values)['[[Value]]'];
    }
    set $values(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$values, value);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Object%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (!NewTarget.isUndefined && NewTarget !== this) {
            return $OrdinaryCreateFromConstructor(ctx, NewTarget, '%ObjectPrototype%');
        }
        if (value === void 0 || value.isNil) {
            return $Object.ObjectCreate(ctx, 'Object', intrinsics['%ObjectPrototype%']);
        }
        return value.ToObject(ctx);
    }
}
class $Object_assign extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.assign', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_create extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.create', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_defineProperties extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.defineProperties', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_defineProperty extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.defineProperty', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_entries extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.entries', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_freeze extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.freeze', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_fromEntries extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.fromEntries', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_getOwnPropertyDescriptor extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.getOwnPropertyDescriptor', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_getOwnPropertyDescriptors extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.getOwnPropertyDescriptors', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_getOwnPropertyNames extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.getOwnPropertyNames', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_getOwnPropertySymbols extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.getOwnPropertySymbols', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_getPrototypeOf extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.getPrototypeOf', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_is extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.is', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_isExtensible extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.isExtensible', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_isFrozen extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.isFrozen', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_isSealed extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.isSealed', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_keys extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.keys', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_preventExtensions extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.preventExtensions', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_seal extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.seal', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_setPrototypeOf extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.setPrototypeOf', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $Object_values extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.values', proto);
    }
    performSteps(ctx, thisArgument, [O], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (O === void 0) {
            O = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $ObjectPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get $hasOwnProperty() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$hasOwnProperty)['[[Value]]'];
    }
    set $hasOwnProperty(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$hasOwnProperty, value);
    }
    get $isPrototypeOf() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$isPrototypeOf)['[[Value]]'];
    }
    set $isPrototypeOf(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$isPrototypeOf, value);
    }
    get $propertyIsEnumerable() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$propertyIsEnumerable)['[[Value]]'];
    }
    set $propertyIsEnumerable(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$propertyIsEnumerable, value);
    }
    get $toLocaleString() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$toLocaleString)['[[Value]]'];
    }
    set $toLocaleString(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$toLocaleString, value);
    }
    get $toString() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$toString)['[[Value]]'];
    }
    set $toString(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$toString, value);
    }
    get $valueOf() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$valueOf)['[[Value]]'];
    }
    set $valueOf(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$valueOf, value);
    }
    constructor(realm) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%ObjectPrototype%', intrinsics.null, 1, intrinsics.empty);
    }
}
class $ObjectPrototype_hasOwnProperty extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.prototype.hasOwnProperty', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        throw new Error('Method not implemented.');
    }
}
class $ObjectPrototype_isPrototypeOf extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.prototype.isPrototypeOf', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        throw new Error('Method not implemented.');
    }
}
class $ObjectPrototype_propertyIsEnumerable extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.prototype.propertyIsEnumerable', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        throw new Error('Method not implemented.');
    }
}
class $ObjectPrototype_toLocaleString extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.prototype.toLocaleString', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        throw new Error('Method not implemented.');
    }
}
class $ObjProto_toString extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Object.prototype.toString', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (thisArgument.isUndefined) {
            return new $String(realm, '[object Undefined]');
        }
        if (thisArgument.isNull) {
            return new $String(realm, '[object Null]');
        }
        const O = thisArgument.ToObject(ctx);
        const tag = O['[[Get]]'](ctx, intrinsics['@@toStringTag'], O);
        if (tag.isAbrupt) {
            return tag;
        }
        if (tag.isString) {
            return new $String(realm, `[object ${tag['[[Value]]']}]`);
        }
        if (O.isArray) {
            return new $String(realm, `[object Array]`);
        }
        if (O instanceof $StringExoticObject) {
            return new $String(realm, `[object String]`);
        }
        if ('[[ParameterMap]]' in O) {
            return new $String(realm, `[object Arguments]`);
        }
        if ('[[Call]]' in O) {
            return new $String(realm, `[object Function]`);
        }
        if ('[[ErrorData]]' in O) {
            return new $String(realm, `[object Error]`);
        }
        if ('[[BooleanData]]' in O) {
            return new $String(realm, `[object Boolean]`);
        }
        if ('[[NumberData]]' in O) {
            return new $String(realm, `[object Number]`);
        }
        if ('[[DateValue]]' in O) {
            return new $String(realm, `[object Date]`);
        }
        if ('[[RegExpMatcher]]' in O) {
            return new $String(realm, `[object RegExp]`);
        }
        return new $String(realm, `[object Object]`);
    }
}
class $ObjProto_valueOf extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%ObjProto_valueOf%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        throw new Error('Method not implemented.');
    }
}

class $ComputedPropertyName {
    get $kind() { return typescript.SyntaxKind.ComputedPropertyName; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ComputedPropertyName`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        this.PropName = new $Empty(realm, void 0, void 0, this);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const exprValue = this.$expression.Evaluate(ctx);
        const propName = exprValue.GetValue(ctx);
        if (propName.isAbrupt) {
            return propName.enrichWith(ctx, this);
        }
        return propName.ToPropertyKey(ctx).enrichWith(ctx, this);
    }
    EvaluatePropName(ctx) {
        ctx.checkTimeout();
        return this.Evaluate(ctx);
    }
}
class $ObjectBindingPattern {
    get $kind() { return typescript.SyntaxKind.ObjectBindingPattern; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ObjectBindingPattern`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.combinedModifierFlags = parent.combinedModifierFlags;
        ctx |= 64;
        const $elements = this.$elements = $bindingElementList(node.elements, this, ctx);
        this.BoundNames = $elements.flatMap(getBoundNames);
        this.ContainsExpression = $elements.some(getContainsExpression);
        this.HasInitializer = $elements.some(getHasInitializer);
        this.IsSimpleParameterList = $elements.every(getIsSimpleParameterList);
    }
    InitializeBinding(ctx, value, environment) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeBinding(#${ctx.id})`);
        const realm = ctx.Realm;
        if (value.isNil) {
            return new $TypeError(realm, `Cannot destructure ${value['[[Value]]']} into object`).enrichWith(ctx, this);
        }
        const elements = this.$elements;
        for (let i = 0, ii = elements.length; i < ii; ++i) {
            const el = elements[i];
            const result = el.InitializePropertyBinding(ctx, value, environment);
            if (result.isAbrupt) {
                return result.enrichWith(ctx, this);
            }
        }
        return new $Empty(realm);
    }
}
function $$arrayBindingElement(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.BindingElement:
            return new $BindingElement(node, parent, ctx, idx);
        case typescript.SyntaxKind.OmittedExpression:
            return new $OmittedExpression(node, parent, ctx, idx);
    }
}
function $$arrayBindingElementList(nodes, parent, ctx) {
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = $$arrayBindingElement(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
function $bindingElementList(nodes, parent, ctx) {
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = new $BindingElement(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
class $ArrayBindingPattern {
    get $kind() { return typescript.SyntaxKind.ArrayBindingPattern; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ArrayBindingPattern`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.combinedModifierFlags = parent.combinedModifierFlags;
        ctx |= 64;
        const $elements = this.$elements = $$arrayBindingElementList(node.elements, this, ctx);
        this.BoundNames = $elements.flatMap(getBoundNames);
        this.ContainsExpression = $elements.some(getContainsExpression);
        this.HasInitializer = $elements.some(getHasInitializer);
        this.IsSimpleParameterList = $elements.every(getIsSimpleParameterList);
    }
    InitializeBinding(ctx, value, environment) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeBinding(#${ctx.id})`);
        const iteratorRecord = $GetIterator(ctx, value);
        if (iteratorRecord.isAbrupt) {
            return iteratorRecord.enrichWith(ctx, this);
        }
        const result = this.InitializeIteratorBinding(ctx, iteratorRecord, environment);
        if (result.isAbrupt) {
            return result.enrichWith(ctx, this);
        }
        if (iteratorRecord['[[Done]]'].isFalsey) {
            return $IteratorClose(ctx, iteratorRecord, result).enrichWith(ctx, this);
        }
        return result;
    }
    InitializeIteratorBinding(ctx, iteratorRecord, environment) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeIteratorBinding(#${ctx.id})`);
        const realm = ctx.Realm;
        const elements = this.$elements;
        for (let i = 0, ii = elements.length; i < ii; ++i) {
            const el = elements[i];
            switch (el.$kind) {
                case typescript.SyntaxKind.OmittedExpression: {
                    if (i + 1 === ii) {
                        break;
                    }
                    const result = el.EvaluateDestructuringAssignmentIterator(ctx, iteratorRecord);
                    if (result.isAbrupt) {
                        return result.enrichWith(ctx, this);
                    }
                    break;
                }
                case typescript.SyntaxKind.BindingElement: {
                    const result = el.InitializeIteratorBinding(ctx, iteratorRecord, environment);
                    if (result.isAbrupt) {
                        return result.enrichWith(ctx, this);
                    }
                    if (i + 1 === ii) {
                        return result;
                    }
                }
            }
        }
        return new $Empty(realm);
    }
}
class $BindingElement {
    get $kind() { return typescript.SyntaxKind.BindingElement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.BindingElement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : void 0);
        this.combinedModifierFlags = this.modifierFlags | parent.combinedModifierFlags;
        ctx = clearBit(ctx, 8);
        if (node.propertyName === void 0) {
            this.$propertyName = void 0;
            const $name = this.$name = $$bindingName(node.name, this, ctx | 8, -1);
            this.BoundNames = $name.BoundNames;
            if (node.initializer === void 0) {
                this.$initializer = void 0;
                this.ContainsExpression = $name.ContainsExpression;
                this.HasInitializer = false;
                this.IsSimpleParameterList = $name.$kind === typescript.SyntaxKind.Identifier;
            }
            else {
                this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
                this.ContainsExpression = true;
                this.HasInitializer = true;
                this.IsSimpleParameterList = false;
            }
        }
        else {
            const $propertyName = this.$propertyName = $$propertyName(node.propertyName, this, ctx, -1);
            const $name = this.$name = $$bindingName(node.name, this, ctx | 8, -1);
            this.BoundNames = $name.BoundNames;
            if (node.initializer === void 0) {
                this.$initializer = void 0;
                this.ContainsExpression = $propertyName.$kind === typescript.SyntaxKind.ComputedPropertyName || $name.ContainsExpression;
                this.HasInitializer = false;
                this.IsSimpleParameterList = $name.$kind === typescript.SyntaxKind.Identifier;
            }
            else {
                this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
                this.ContainsExpression = true;
                this.HasInitializer = true;
                this.IsSimpleParameterList = false;
            }
        }
    }
    InitializePropertyBinding(ctx, value, environment) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializePropertyBinding(#${ctx.id})`);
        const PropertyName = this.$propertyName;
        if (PropertyName === void 0) {
            return this.$name.InitializePropertyBinding(ctx, value, environment).enrichWith(ctx, this);
        }
        const P = PropertyName.Evaluate(ctx);
        if (P.isAbrupt) {
            return P.enrichWith(ctx, this);
        }
        const result = this.InitializeKeyedBinding(ctx, value, environment, P);
        if (result.isAbrupt) {
            return result.enrichWith(ctx, this);
        }
        return new $List(P);
    }
    InitializeKeyedBinding(ctx, value, environment, propertyName, initializer) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeKeyedBinding(#${ctx.id})`);
        ctx.Realm;
        const BindingElement = this.$name;
        if (BindingElement.$kind === typescript.SyntaxKind.Identifier) {
            return BindingElement.InitializeKeyedBinding(ctx, value, environment, propertyName, initializer).enrichWith(ctx, this);
        }
        const obj = value.ToObject(ctx);
        if (obj.isAbrupt) {
            return obj.enrichWith(ctx, this);
        }
        let v = obj['[[Get]]'](ctx, propertyName, obj);
        if (v.isAbrupt) {
            return v.enrichWith(ctx, this);
        }
        if (initializer !== void 0 && v.isUndefined) {
            const defaultValue = initializer.Evaluate(ctx);
            v = defaultValue.GetValue(ctx);
            if (v.isAbrupt) {
                return v.enrichWith(ctx, this);
            }
        }
        return BindingElement.InitializeBinding(ctx, v, environment).enrichWith(ctx, this);
    }
    InitializeIteratorBinding(ctx, iteratorRecord, environment) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeIteratorBinding(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const BindingElement = this.$name;
        if (BindingElement.$kind === typescript.SyntaxKind.Identifier) {
            return BindingElement.InitializeIteratorBinding(ctx, iteratorRecord, environment, this.$initializer).enrichWith(ctx, this);
        }
        let v = intrinsics.undefined;
        if (iteratorRecord['[[Done]]'].isFalsey) {
            const next = $IteratorStep(ctx, iteratorRecord);
            if (next.isAbrupt) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
                if (next.isAbrupt) {
                    return next.enrichWith(ctx, this);
                }
            }
            if (next.isFalsey) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
            }
            else {
                v = $IteratorValue(ctx, next);
                if (v.isAbrupt) {
                    iteratorRecord['[[Done]]'] = intrinsics.true;
                    if (v.isAbrupt) {
                        return v.enrichWith(ctx, this);
                    }
                }
            }
        }
        if (iteratorRecord['[[Done]]'].isTruthy) {
            v = intrinsics.undefined;
        }
        const initializer = this.$initializer;
        if (initializer !== void 0 && v.isUndefined) {
            const defaultValue = initializer.Evaluate(ctx);
            v = defaultValue.GetValue(ctx);
            if (v.isAbrupt) {
                return v.enrichWith(ctx, this);
            }
        }
        return BindingElement.InitializeBinding(ctx, v, environment).enrichWith(ctx, this);
    }
}
class $SpreadElement {
    get $kind() { return typescript.SyntaxKind.SpreadElement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.SpreadElement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const list = new $List();
        const spreadRef = this.$expression.Evaluate(ctx);
        const spreadObj = spreadRef.GetValue(ctx);
        if (spreadObj.isAbrupt) {
            return spreadObj.enrichWith(ctx, this);
        }
        const iteratorRecord = $GetIterator(ctx, spreadObj);
        if (iteratorRecord.isAbrupt) {
            return iteratorRecord.enrichWith(ctx, this);
        }
        while (true) {
            const next = $IteratorStep(ctx, iteratorRecord);
            if (next.isAbrupt) {
                return next.enrichWith(ctx, this);
            }
            if (next.isFalsey) {
                return list;
            }
            const nextArg = $IteratorValue(ctx, next);
            if (nextArg.isAbrupt) {
                return nextArg.enrichWith(ctx, this);
            }
            list.push(nextArg);
        }
    }
    AccumulateArray(ctx, array, nextIndex) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const spreadRef = this.$expression.Evaluate(ctx);
        const spreadObj = spreadRef.GetValue(ctx);
        if (spreadObj.isAbrupt) {
            return spreadObj.enrichWith(ctx, this);
        }
        const iteratorRecord = $GetIterator(ctx, spreadObj);
        if (iteratorRecord.isAbrupt) {
            return iteratorRecord.enrichWith(ctx, this);
        }
        while (true) {
            const next = $IteratorStep(ctx, iteratorRecord);
            if (next.isAbrupt) {
                return next.enrichWith(ctx, this);
            }
            if (next.isFalsey) {
                return nextIndex;
            }
            const nextValue = $IteratorValue(ctx, next);
            if (nextValue.isAbrupt) {
                return nextValue.enrichWith(ctx, this);
            }
            $CreateDataProperty(ctx, array, nextIndex.ToUint32(ctx).ToString(ctx), nextValue);
            nextIndex = new $Number(realm, nextIndex['[[Value]]'] + 1);
        }
    }
}
class $OmittedExpression {
    get $kind() { return typescript.SyntaxKind.OmittedExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.OmittedExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.BoundNames = kernel.emptyArray;
        this.ContainsExpression = false;
        this.HasInitializer = false;
        this.IsSimpleParameterList = false;
    }
    EvaluateDestructuringAssignmentIterator(ctx, iteratorRecord) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.EvaluateDestructuringAssignmentIterator(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (iteratorRecord['[[Done]]'].isFalsey) {
            const next = $IteratorStep(ctx, iteratorRecord);
            if (next.isAbrupt) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
                return next;
            }
            if (next.isFalsey) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
            }
        }
        return new $Empty(realm);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return null;
    }
}

class $Reference {
    get isAbrupt() { return false; }
    constructor(realm, baseValue, referencedName, strict, thisValue) {
        this.realm = realm;
        this.baseValue = baseValue;
        this.referencedName = referencedName;
        this.strict = strict;
        this.thisValue = thisValue;
    }
    enrichWith(ctx, node) {
        return this;
    }
    GetBase() {
        return this.baseValue;
    }
    GetReferencedName() {
        return this.referencedName;
    }
    IsStrictReference() {
        return this.strict;
    }
    HasPrimitiveBase() {
        if (this.baseValue.isPrimitive && !this.baseValue.isUndefined) {
            return this.realm['[[Intrinsics]]'].true;
        }
        return this.realm['[[Intrinsics]]'].false;
    }
    IsPropertyReference() {
        if (this.baseValue.isObject || this.HasPrimitiveBase().isTruthy) {
            return this.realm['[[Intrinsics]]'].true;
        }
        return this.realm['[[Intrinsics]]'].false;
    }
    IsUnresolvableReference() {
        if (this.baseValue.isUndefined) {
            return this.realm['[[Intrinsics]]'].true;
        }
        return this.realm['[[Intrinsics]]'].false;
    }
    IsSuperReference() {
        if (!this.thisValue.isUndefined) {
            return this.realm['[[Intrinsics]]'].true;
        }
        return this.realm['[[Intrinsics]]'].false;
    }
    GetValue(ctx) {
        let base = this.GetBase();
        if (this.IsUnresolvableReference().isTruthy) {
            return new $ReferenceError(ctx.Realm, `${this.referencedName['[[Value]]']} is not defined.`);
        }
        if (this.IsPropertyReference().isTruthy) {
            if (this.HasPrimitiveBase().isTruthy) {
                base = base.ToObject(ctx);
            }
            return base['[[Get]]'](ctx, this.GetReferencedName(), this.GetThisValue());
        }
        else {
            return base.GetBindingValue(ctx, this.GetReferencedName(), this.IsStrictReference());
        }
    }
    PutValue(ctx, W) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        let base = this.GetBase();
        if (this.IsUnresolvableReference().isTruthy) {
            if (this.IsStrictReference().isTruthy) {
                return new $ReferenceError(realm, `${this.referencedName['[[Value]]']} is not defined.`);
            }
            const globalObj = realm['[[GlobalObject]]'];
            return $Set(ctx, globalObj, this.GetReferencedName(), W, intrinsics.false);
        }
        else if (this.IsPropertyReference().isTruthy) {
            if (this.HasPrimitiveBase().isTruthy) {
                base = base.ToObject(ctx);
            }
            const succeeded = base['[[Set]]'](ctx, this.GetReferencedName(), W, this.GetThisValue());
            if (succeeded.isAbrupt) {
                return succeeded;
            }
            if (succeeded.isFalsey && this.IsStrictReference().isTruthy) {
                return new $TypeError(realm, `${this.referencedName['[[Value]]']} is not writable.`);
            }
            return intrinsics.undefined;
        }
        else {
            return base.SetMutableBinding(ctx, this.GetReferencedName(), W, this.IsStrictReference());
        }
    }
    GetThisValue() {
        if (this.IsSuperReference().isTruthy) {
            return this.thisValue;
        }
        return this.GetBase();
    }
    InitializeReferencedBinding(ctx, W) {
        const base = this.GetBase();
        return base.InitializeBinding(ctx, this.GetReferencedName(), W);
    }
}

class $NamespaceExoticObject extends $Object {
    constructor(realm, mod, exports) {
        super(realm, 'NamespaceExoticObject', realm['[[Intrinsics]]'].null, 1, realm['[[Intrinsics]]'].empty);
        this['[[Module]]'] = mod;
        this['[[Exports]]'] = exports.$copy();
        mod['[[Namespace]]'] = this;
    }
    '[[SetPrototypeOf]]'(ctx, V) {
        return $SetImmutablePrototype(ctx, this, V);
    }
    '[[IsExtensible]]'(ctx) {
        return this.realm['[[Intrinsics]]'].false;
    }
    '[[PreventExtensions]]'(ctx) {
        return this.realm['[[Intrinsics]]'].true;
    }
    '[[GetOwnProperty]]'(ctx, P) {
        if (P.isSymbol) {
            return super['[[GetOwnProperty]]'](ctx, P);
        }
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const exports = O['[[Exports]]'];
        if (exports.every(x => !x.is(P))) {
            return intrinsics.undefined;
        }
        const value = O['[[Get]]'](ctx, P, O);
        if (value.isAbrupt) {
            return value;
        }
        const desc = new $PropertyDescriptor(realm, P);
        desc['[[Value]]'] = value;
        desc['[[Writable]]'] = intrinsics.true;
        desc['[[Enumerable]]'] = intrinsics.true;
        desc['[[Configurable]]'] = intrinsics.false;
        return desc;
    }
    '[[DefineOwnProperty]]'(ctx, P, Desc) {
        if (P.isSymbol) {
            return super['[[DefineOwnProperty]]'](ctx, P, Desc);
        }
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const current = O['[[GetOwnProperty]]'](ctx, P);
        if (current.isAbrupt) {
            return current;
        }
        if (current.isUndefined) {
            return intrinsics.false;
        }
        if (Desc.isAccessorDescriptor) {
            return intrinsics.false;
        }
        if (Desc['[[Writable]]'].hasValue && Desc['[[Writable]]'].isFalsey) {
            return intrinsics.false;
        }
        if (Desc['[[Enumerable]]'].hasValue && Desc['[[Enumerable]]'].isFalsey) {
            return intrinsics.false;
        }
        if (Desc['[[Configurable]]'].hasValue === Desc['[[Configurable]]'].isTruthy) {
            return intrinsics.false;
        }
        if (!Desc['[[Value]]'].isEmpty) {
            if (Desc['[[Value]]'].is(current['[[Value]]'])) {
                return intrinsics.true;
            }
            return intrinsics.false;
        }
        return intrinsics.true;
    }
    '[[HasProperty]]'(ctx, P) {
        if (P.isSymbol) {
            return super['[[HasProperty]]'](ctx, P);
        }
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const exports = O['[[Exports]]'];
        if (exports.some(x => x.is(P))) {
            return intrinsics.true;
        }
        return intrinsics.false;
    }
    '[[Get]]'(ctx, P, Receiver) {
        if (P.isSymbol) {
            return super['[[Get]]'](ctx, P, Receiver);
        }
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const exports = O['[[Exports]]'];
        if (exports.every(x => !x.is(P))) {
            return intrinsics.undefined;
        }
        const m = O['[[Module]]'];
        const binding = m.ResolveExport(ctx, P, new ResolveSet());
        const targetModule = binding.Module;
        const targetEnv = targetModule['[[Environment]]'];
        if (targetEnv.isUndefined) {
            return new $ReferenceError(realm, `${P['[[Value]]']} cannot be resolved from namespace.`);
        }
        return targetEnv.GetBindingValue(ctx, binding.BindingName, intrinsics.true);
    }
    '[[Set]]'(ctx, P, V, Receiver) {
        return ctx.Realm['[[Intrinsics]]'].false;
    }
    '[[Delete]]'(ctx, P) {
        if (P.isSymbol) {
            return super['[[Delete]]'](ctx, P);
        }
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = this;
        const exports = O['[[Exports]]'];
        if (exports.some(x => x.is(P))) {
            return intrinsics.false;
        }
        return intrinsics.true;
    }
    '[[OwnPropertyKeys]]'(ctx) {
        const $exports = this['[[Exports]]'].$copy();
        const symbolKeys = super['[[OwnPropertyKeys]]'](ctx);
        $exports.push(...symbolKeys);
        return $exports;
    }
}

function $expressionWithTypeArgumentsList(nodes, parent, ctx) {
    if (nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = new $ExpressionWithTypeArguments(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
class $HeritageClause {
    get $kind() { return typescript.SyntaxKind.HeritageClause; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.HeritageClause`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$types = $expressionWithTypeArgumentsList(node.types, this, ctx);
    }
}
class $ExpressionWithTypeArguments {
    get $kind() { return typescript.SyntaxKind.ExpressionWithTypeArguments; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ExpressionWithTypeArguments`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $LHSExpression(node.expression, this, ctx, -1);
    }
}
class $ClassExpression {
    get $kind() { return typescript.SyntaxKind.ClassExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ClassExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.ConstructorMethod = void 0;
        this.IsConstantDeclaration = false;
        this.IsFunctionDefinition = true;
        const intrinsics = realm['[[Intrinsics]]'];
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        const $heritageClauses = this.$heritageClauses = $heritageClauseList(node.heritageClauses, this, ctx);
        const $members = this.$members = $$classElementList(node.members, this, ctx);
        this.ClassHeritage = $heritageClauses.find(h => h.node.token === typescript.SyntaxKind.ExtendsKeyword);
        if ($name === void 0) {
            this.BoundNames = [intrinsics['*default*']];
        }
        else {
            if (hasAllBits(modifierFlags, typescript.ModifierFlags.ExportDefault)) {
                this.BoundNames = [...$name.BoundNames, intrinsics['*default*']];
            }
            else {
                this.BoundNames = $name.BoundNames;
            }
        }
        const NonConstructorMethodDefinitions = this.NonConstructorMethodDefinitions = [];
        const PrototypePropertyNameList = this.PrototypePropertyNameList = [];
        let $member;
        for (let i = 0, ii = $members.length; i < ii; ++i) {
            $member = $members[i];
            switch ($member.$kind) {
                case typescript.SyntaxKind.PropertyDeclaration:
                    break;
                case typescript.SyntaxKind.Constructor:
                    this.ConstructorMethod = $member;
                    break;
                case typescript.SyntaxKind.MethodDeclaration:
                case typescript.SyntaxKind.GetAccessor:
                case typescript.SyntaxKind.SetAccessor:
                    NonConstructorMethodDefinitions.push($member);
                    if (!$member.PropName.isEmpty && !$member.IsStatic) {
                        PrototypePropertyNameList.push($member.PropName);
                    }
                    break;
                case typescript.SyntaxKind.SemicolonClassElement:
            }
        }
        this.HasName = $name !== void 0;
    }
    EvaluateNamed(ctx, name) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return $ClassDeclaration.prototype.EvaluateClassDefinition.call(this, ctx, intrinsics.undefined, name);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const className = this.$name === void 0 ? intrinsics.undefined : this.$name.StringValue;
        const value = $ClassDeclaration.prototype.EvaluateClassDefinition.call(this, ctx, className, className);
        if (value.isAbrupt) {
            return value.enrichWith(ctx, this);
        }
        value['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return value;
    }
}
class $ClassDeclaration {
    get $kind() { return typescript.SyntaxKind.ClassDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ClassDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.IsConstantDeclaration = false;
        this.IsFunctionDefinition = true;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const intrinsics = realm['[[Intrinsics]]'];
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        if (hasBit(modifierFlags, typescript.ModifierFlags.Export)) {
            ctx |= 4096;
        }
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        let $name;
        if (node.name === void 0) {
            $name = this.$name = new $Undefined(realm, void 0, void 0, this);
        }
        else {
            $name = this.$name = new $Identifier(node.name, this, ctx, -1);
        }
        const $heritageClauses = this.$heritageClauses = $heritageClauseList(node.heritageClauses, this, ctx);
        const $members = this.$members = $$classElementList(node.members, this, ctx);
        this.ClassHeritage = $heritageClauses.find(h => h.node.token === typescript.SyntaxKind.ExtendsKeyword);
        const NonConstructorMethodDefinitions = this.NonConstructorMethodDefinitions = [];
        const PrototypePropertyNameList = this.PrototypePropertyNameList = [];
        let $member;
        for (let i = 0, ii = $members.length; i < ii; ++i) {
            $member = $members[i];
            switch ($member.$kind) {
                case typescript.SyntaxKind.PropertyDeclaration:
                    break;
                case typescript.SyntaxKind.Constructor:
                    this.ConstructorMethod = $member;
                    break;
                case typescript.SyntaxKind.MethodDeclaration:
                case typescript.SyntaxKind.GetAccessor:
                case typescript.SyntaxKind.SetAccessor:
                    NonConstructorMethodDefinitions.push($member);
                    if (!$member.PropName.isEmpty && !$member.IsStatic) {
                        PrototypePropertyNameList.push($member.PropName);
                    }
                    break;
                case typescript.SyntaxKind.SemicolonClassElement:
            }
        }
        const HasName = this.HasName = !$name.isUndefined;
        if (hasBit(ctx, 4096)) {
            if (hasBit(this.modifierFlags, typescript.ModifierFlags.Default)) {
                if (HasName) {
                    const [localName] = $name.BoundNames;
                    const BoundNames = this.BoundNames = [localName, intrinsics['*default*']];
                    this.ExportedBindings = BoundNames;
                    this.ExportedNames = [intrinsics['default']];
                    this.ExportEntries = [
                        new ExportEntryRecord(this, intrinsics['default'], intrinsics.null, intrinsics.null, localName),
                    ];
                }
                else {
                    const BoundNames = this.BoundNames = [intrinsics['*default*']];
                    this.ExportedBindings = BoundNames;
                    this.ExportedNames = [intrinsics['default']];
                    this.ExportEntries = [
                        new ExportEntryRecord(this, intrinsics['default'], intrinsics.null, intrinsics.null, intrinsics['*default*']),
                    ];
                }
                this.LexicallyScopedDeclarations = [this];
            }
            else {
                const BoundNames = this.BoundNames = $name.BoundNames;
                const [localName] = BoundNames;
                this.ExportedBindings = BoundNames;
                this.ExportedNames = BoundNames;
                this.ExportEntries = [
                    new ExportEntryRecord(this, localName, intrinsics.null, intrinsics.null, localName),
                ];
                this.LexicallyScopedDeclarations = [this];
            }
        }
        else {
            this.BoundNames = $name.BoundNames;
            this.ExportedBindings = kernel.emptyArray;
            this.ExportedNames = kernel.emptyArray;
            this.ExportEntries = kernel.emptyArray;
            this.LexicallyScopedDeclarations = kernel.emptyArray;
        }
        this.ModuleRequests = kernel.emptyArray;
    }
    EvaluateClassDefinition(ctx, classBinding, className) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const lex = ctx.LexicalEnvironment;
        const classScope = new $DeclarativeEnvRec(this.logger, realm, lex);
        if (!classBinding.isUndefined) {
            classScope.CreateImmutableBinding(ctx, classBinding, intrinsics.true);
        }
        let protoParent;
        let constructorParent;
        if (this.ClassHeritage === void 0) {
            protoParent = intrinsics['%ObjectPrototype%'];
            constructorParent = intrinsics['%FunctionPrototype%'];
        }
        else {
            ctx.LexicalEnvironment = classScope;
            const superClassRef = this.ClassHeritage.$types[0].$expression.Evaluate(ctx);
            ctx.LexicalEnvironment = lex;
            const superClass = superClassRef.GetValue(ctx);
            if (superClass.isAbrupt) {
                return superClass.enrichWith(ctx, this);
            }
            if (superClass.isNull) {
                protoParent = intrinsics.null;
                constructorParent = intrinsics['%FunctionPrototype%'];
            }
            else if (!superClass.isFunction) {
                return new $TypeError(realm, `Superclass is ${superClass}, but expected a function`);
            }
            else {
                const $protoParent = superClass['[[Get]]'](ctx, intrinsics.$prototype, superClass);
                if ($protoParent.isAbrupt) {
                    return $protoParent.enrichWith(ctx, this);
                }
                if (!$protoParent.isObject && !$protoParent.isNull) {
                    return new $TypeError(realm, `Superclass prototype is ${superClass}, but expected null or an object`);
                }
                protoParent = $protoParent;
                constructorParent = superClass;
            }
        }
        const proto = new $Object(realm, 'proto', protoParent, 1, intrinsics.empty);
        let constructor;
        if (this.ConstructorMethod === void 0) {
            constructor = intrinsics.empty;
        }
        else {
            constructor = this.ConstructorMethod;
        }
        if (constructor instanceof $Empty) {
            if (this.ClassHeritage !== void 0) {
                constructor = this.ConstructorMethod = new $ConstructorDeclaration(typescript.factory.createConstructorDeclaration([], [
                    typescript.factory.createParameterDeclaration(void 0, typescript.factory.createToken(typescript.SyntaxKind.DotDotDotToken), typescript.factory.createIdentifier('args')),
                ], typescript.factory.createBlock([
                    typescript.factory.createExpressionStatement(typescript.factory.createCallExpression(typescript.factory.createSuper(), void 0, [
                        typescript.factory.createSpreadElement(typescript.factory.createIdentifier('args')),
                    ])),
                ])), this, this.ctx, -1);
            }
            else {
                constructor = this.ConstructorMethod = new $ConstructorDeclaration(typescript.factory.createConstructorDeclaration([], [], typescript.factory.createBlock([])), this, this.ctx, -1);
            }
        }
        ctx.LexicalEnvironment = classScope;
        const constructorInfo = constructor.DefineMethod(ctx, proto, constructorParent);
        const F = constructorInfo['[[Closure]]'];
        if (this.ClassHeritage !== void 0) {
            F['[[ConstructorKind]]'] = 'derived';
        }
        F.MakeConstructor(ctx, intrinsics.false, proto);
        F['[[FunctionKind]]'] = 2;
        if (!className.isUndefined) {
            F.SetFunctionName(ctx, className);
        }
        proto['[[DefineOwnProperty]]'](ctx, intrinsics.$constructor, new $PropertyDescriptor(realm, intrinsics.$constructor, {
            '[[Value]]': F,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.true,
        }));
        const methods = this.NonConstructorMethodDefinitions;
        let status;
        for (const m of methods) {
            if (!m.IsStatic) {
                status = m.EvaluatePropertyDefinition(ctx, proto, intrinsics.false);
            }
            else {
                status = m.EvaluatePropertyDefinition(ctx, F, intrinsics.false);
            }
            if (status.isAbrupt) {
                ctx.LexicalEnvironment = lex;
                return status;
            }
        }
        ctx.LexicalEnvironment = lex;
        if (!classBinding.isUndefined) {
            classScope.InitializeBinding(ctx, classBinding, F);
        }
        return F;
    }
    EvaluateBindingClassDeclaration(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const name = this.$name;
        if (name.isUndefined) {
            const value = this.EvaluateClassDefinition(ctx, intrinsics.undefined, intrinsics.default);
            if (value.isAbrupt) {
                return value.enrichWith(ctx, this);
            }
            value['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
            return value;
        }
        const className = name.StringValue;
        const value = this.EvaluateClassDefinition(ctx, className, className);
        if (value.isAbrupt) {
            return value.enrichWith(ctx, this);
        }
        value['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        const $InitializeBoundNameResult = ctx.LexicalEnvironment.InitializeBinding(ctx, className, value);
        if ($InitializeBoundNameResult.isAbrupt) {
            return $InitializeBoundNameResult.enrichWith(ctx, this);
        }
        return value;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const $EvaluateBindingClassDeclarationResult = this.EvaluateBindingClassDeclaration(ctx);
        if ($EvaluateBindingClassDeclarationResult.isAbrupt) {
            return $EvaluateBindingClassDeclarationResult.enrichWith(ctx, this);
        }
        return intrinsics.empty;
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        ctx.checkTimeout();
        return this.ConstructorMethod.EvaluateBody(ctx, functionObject, argumentsList);
    }
}
class $PropertyDeclaration {
    get $kind() { return typescript.SyntaxKind.PropertyDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.PropertyDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        this.$name = $$propertyName(node.name, this, ctx | 512, -1);
        this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
        this.IsStatic = hasBit(modifierFlags, typescript.ModifierFlags.Static);
    }
}
class $SemicolonClassElement {
    get $kind() { return typescript.SyntaxKind.SemicolonClassElement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.SemicolonClassElement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.IsStatic = false;
        this.PropName = empty;
    }
}

class $InterfaceDeclaration {
    get $kind() { return typescript.SyntaxKind.InterfaceDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.InterfaceDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.IsType = true;
        const intrinsics = realm['[[Intrinsics]]'];
        ctx |= 128;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        if (hasBit(modifierFlags, typescript.ModifierFlags.Export)) {
            ctx |= 4096;
        }
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        this.$heritageClauses = $heritageClauseList(node.heritageClauses, this, ctx);
        const BoundNames = this.BoundNames = $name.BoundNames;
        this.TypeDeclarations = [this];
        if (hasBit(ctx, 4096)) {
            const [localName] = BoundNames;
            this.ExportedBindings = BoundNames;
            this.ExportedNames = BoundNames;
            this.ExportEntries = [
                new ExportEntryRecord(this, localName, intrinsics.null, intrinsics.null, localName),
            ];
        }
        else {
            this.ExportedBindings = kernel.emptyArray;
            this.ExportedNames = kernel.emptyArray;
            this.ExportEntries = kernel.emptyArray;
        }
    }
}
class $TypeAliasDeclaration {
    get $kind() { return typescript.SyntaxKind.TypeAliasDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.TypeAliasDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.IsType = true;
        const intrinsics = realm['[[Intrinsics]]'];
        ctx |= 128;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        if (hasBit(modifierFlags, typescript.ModifierFlags.Export)) {
            ctx |= 4096;
        }
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        const BoundNames = this.BoundNames = $name.BoundNames;
        this.TypeDeclarations = [this];
        if (hasBit(ctx, 4096)) {
            const [localName] = BoundNames;
            this.ExportedBindings = BoundNames;
            this.ExportedNames = BoundNames;
            this.ExportEntries = [
                new ExportEntryRecord(this, localName, intrinsics.null, intrinsics.null, localName),
            ];
        }
        else {
            this.ExportedBindings = kernel.emptyArray;
            this.ExportedNames = kernel.emptyArray;
            this.ExportEntries = kernel.emptyArray;
        }
    }
}
function $enumMemberList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = new $EnumMember(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
class $EnumDeclaration {
    get $kind() { return typescript.SyntaxKind.EnumDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.EnumDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.IsType = true;
        const intrinsics = realm['[[Intrinsics]]'];
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        if (hasBit(modifierFlags, typescript.ModifierFlags.Export)) {
            ctx |= 4096;
        }
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        this.$members = $enumMemberList(node.members, this, ctx);
        const BoundNames = this.BoundNames = $name.BoundNames;
        this.TypeDeclarations = [this];
        if (hasBit(ctx, 4096)) {
            const [localName] = BoundNames;
            this.ExportedBindings = BoundNames;
            this.ExportedNames = BoundNames;
            this.ExportEntries = [
                new ExportEntryRecord(this, localName, intrinsics.null, intrinsics.null, localName),
            ];
        }
        else {
            this.ExportedBindings = kernel.emptyArray;
            this.ExportedNames = kernel.emptyArray;
            this.ExportEntries = kernel.emptyArray;
        }
    }
}
class $EnumMember {
    get $kind() { return typescript.SyntaxKind.EnumMember; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.EnumMember`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$name = $$propertyName(node.name, this, ctx | 512, -1);
        this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
    }
}

class $TemplateHead {
    get $kind() { return typescript.SyntaxKind.TemplateHead; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.TemplateHead`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $TemplateMiddle {
    get $kind() { return typescript.SyntaxKind.TemplateMiddle; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.TemplateMiddle`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $TemplateTail {
    get $kind() { return typescript.SyntaxKind.TemplateTail; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.TemplateTail`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $TemplateSpan {
    get $kind() { return typescript.SyntaxKind.TemplateSpan; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.TemplateSpan`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        if (node.literal.kind === typescript.SyntaxKind.TemplateMiddle) {
            this.$literal = new $TemplateMiddle(node.literal, this, ctx);
        }
        else {
            this.$literal = new $TemplateTail(node.literal, this, ctx);
        }
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $NumericLiteral {
    get $kind() { return typescript.SyntaxKind.NumericLiteral; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.NumericLiteral`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        const num = Number(node.text);
        this.PropName = new $String(realm, num.toString(), void 0, void 0, this);
        this.Value = new $Number(realm, num, void 0, void 0, this);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return this.Value;
    }
    EvaluatePropName(ctx) {
        ctx.checkTimeout();
        return this.PropName;
    }
}
class $BigIntLiteral {
    get $kind() { return typescript.SyntaxKind.BigIntLiteral; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.BigIntLiteral`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics['0'];
    }
}
class $StringLiteral {
    get $kind() { return typescript.SyntaxKind.StringLiteral; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.StringLiteral`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        const StringValue = this.StringValue = new $String(realm, node.text, void 0, void 0, this);
        this.PropName = StringValue;
        this.Value = StringValue;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return this.Value;
    }
    EvaluatePropName(ctx) {
        ctx.checkTimeout();
        return this.PropName;
    }
}
class $RegularExpressionLiteral {
    get $kind() { return typescript.SyntaxKind.RegularExpressionLiteral; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.RegularExpressionLiteral`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        this.StringValue = node.text;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return intrinsics['%ObjectPrototype%'];
    }
}
class $NoSubstitutionTemplateLiteral {
    get $kind() { return typescript.SyntaxKind.NoSubstitutionTemplateLiteral; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.NoSubstitutionTemplateLiteral`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return intrinsics[''];
    }
}
class $NullLiteral {
    get $kind() { return typescript.SyntaxKind.NullKeyword; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.NullLiteral`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        this.Value = new $Null(realm, void 0, void 0, this);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return this.Value;
    }
}
class $BooleanLiteral {
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.BooleanLiteral`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        this.$kind = node.kind;
        this.Value = new $Boolean(realm, node.kind === typescript.SyntaxKind.TrueKeyword, void 0, void 0, this);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return this.Value;
    }
}

class $ESScript {
    get isNull() { return false; }
    get isScript() { return true; }
    get isModule() { return false; }
    constructor(logger, $file, node, realm) {
        this.logger = logger;
        this.$file = $file;
        this.node = node;
        this.realm = realm;
        this.disposed = false;
        this.mos = this;
        this.parent = this;
        this.ctx = 0;
        this.depth = 0;
        const intrinsics = realm['[[Intrinsics]]'];
        this.ExecutionResult = intrinsics.empty;
        this['[[Environment]]'] = intrinsics.undefined;
        this.path = `ESScript<(...)${$file.rootlessPath}>`;
        this.logger = logger.root;
        let ctx = 0;
        this.DirectivePrologue = GetDirectivePrologue(node.statements);
        if (this.DirectivePrologue.ContainsUseStrict) {
            ctx |= 65536;
        }
        const LexicallyDeclaredNames = this.LexicallyDeclaredNames = [];
        const LexicallyScopedDeclarations = this.LexicallyScopedDeclarations = [];
        const VarDeclaredNames = this.VarDeclaredNames = [];
        const VarScopedDeclarations = this.VarScopedDeclarations = [];
        const $statements = this.$statements = [];
        const statements = node.statements;
        let stmt;
        let $stmt;
        let s = 0;
        for (let i = 0, ii = statements.length; i < ii; ++i) {
            stmt = statements[i];
            switch (stmt.kind) {
                case typescript.SyntaxKind.VariableStatement:
                    $stmt = $statements[s] = new $VariableStatement(stmt, this, ctx, s);
                    ++s;
                    if ($stmt.isLexical) {
                        LexicallyDeclaredNames.push(...$stmt.BoundNames);
                        LexicallyScopedDeclarations.push($stmt);
                    }
                    else {
                        VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                        VarScopedDeclarations.push($stmt);
                    }
                    break;
                case typescript.SyntaxKind.FunctionDeclaration:
                    $stmt = $statements[s] = new $FunctionDeclaration(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.BoundNames);
                    VarScopedDeclarations.push($stmt);
                    break;
                case typescript.SyntaxKind.ClassDeclaration:
                    $stmt = $statements[s] = new $ClassDeclaration(stmt, this, ctx, s);
                    ++s;
                    LexicallyDeclaredNames.push(...$stmt.BoundNames);
                    LexicallyScopedDeclarations.push($stmt);
                    break;
                case typescript.SyntaxKind.Block:
                    $stmt = $statements[s] = new $Block(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.EmptyStatement:
                    $stmt = $statements[s] = new $EmptyStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.ExpressionStatement:
                    $stmt = $statements[s] = new $ExpressionStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.IfStatement:
                    $stmt = $statements[s] = new $IfStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.DoStatement:
                    $stmt = $statements[s] = new $DoStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.WhileStatement:
                    $stmt = $statements[s] = new $WhileStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ForStatement:
                    $stmt = $statements[s] = new $ForStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ForInStatement:
                    $stmt = $statements[s] = new $ForInStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ForOfStatement:
                    $stmt = $statements[s] = new $ForOfStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ContinueStatement:
                    $stmt = $statements[s] = new $ContinueStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.BreakStatement:
                    $stmt = $statements[s] = new $BreakStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.ReturnStatement:
                    $stmt = $statements[s] = new $ReturnStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.WithStatement:
                    $stmt = $statements[s] = new $WithStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.SwitchStatement:
                    $stmt = $statements[s] = new $SwitchStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.LabeledStatement:
                    $stmt = $statements[s] = new $LabeledStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.TopLevelVarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.TopLevelVarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ThrowStatement:
                    $stmt = $statements[s] = new $ThrowStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.TryStatement:
                    $stmt = $statements[s] = new $TryStatement(stmt, this, ctx, s);
                    ++s;
                    VarDeclaredNames.push(...$stmt.VarDeclaredNames);
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.DebuggerStatement:
                    $stmt = $statements[s] = new $DebuggerStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                default:
                    throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[node.kind]}.`);
            }
        }
    }
    InstantiateGlobalDeclaration(ctx, env) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const script = this;
        const envRec = env;
        const lexNames = script.LexicallyDeclaredNames;
        const varNames = script.VarDeclaredNames;
        for (const name of lexNames) {
            if (envRec.HasVarDeclaration(ctx, name).isTruthy) {
                return new $SyntaxError(realm, `${name} is already var-declared in global scope`).enrichWith(ctx, this);
            }
            if (envRec.HasLexicalDeclaration(ctx, name).isTruthy) {
                return new $SyntaxError(realm, `${name} is already lexically-declared in global scope`).enrichWith(ctx, this);
            }
            const hasRestrictedGlobal = envRec.HasRestrictedGlobalProperty(ctx, name);
            if (hasRestrictedGlobal.isAbrupt) {
                return hasRestrictedGlobal.enrichWith(ctx, this);
            }
            if (hasRestrictedGlobal.isTruthy) {
                return new $SyntaxError(realm, `${name} is a restricted global property`).enrichWith(ctx, this);
            }
        }
        for (const name of varNames) {
            if (envRec.HasLexicalDeclaration(ctx, name).isTruthy) {
                return new $SyntaxError(realm, `${name} is already lexically-declared in global scope`).enrichWith(ctx, this);
            }
        }
        const varDeclarations = script.VarScopedDeclarations;
        const functionsToInitialize = [];
        const declaredFunctionNames = new $StringSet();
        for (let i = varDeclarations.length - 1; i >= 0; --i) {
            const d = varDeclarations[i];
            if (d instanceof $FunctionDeclaration) {
                const [fn] = d.BoundNames;
                if (!declaredFunctionNames.has(fn)) {
                    const fnDefinable = envRec.CanDeclareGlobalFunction(ctx, fn);
                    if (fnDefinable.isAbrupt) {
                        return fnDefinable.enrichWith(ctx, this);
                    }
                    if (fnDefinable.isFalsey) {
                        return new $TypeError(realm, `function declaration ${fn} cannot be defined in global scope.`).enrichWith(ctx, this);
                    }
                    declaredFunctionNames.add(fn);
                    functionsToInitialize.unshift(d);
                }
            }
        }
        const declaredVarNames = new $StringSet();
        for (const d of varDeclarations) {
            if (!(d instanceof $FunctionDeclaration)) {
                for (const vn of d.BoundNames) {
                    if (!declaredFunctionNames.has(vn)) {
                        const vnDefinable = envRec.CanDeclareGlobalVar(ctx, vn);
                        if (vnDefinable.isAbrupt) {
                            return vnDefinable.enrichWith(ctx, this);
                        }
                        if (vnDefinable.isFalsey) {
                            return new $TypeError(realm, `var declaration ${vn} cannot be defined in global scope.`).enrichWith(ctx, this);
                        }
                        if (!declaredVarNames.has(vn)) {
                            declaredVarNames.add(vn);
                        }
                    }
                }
            }
        }
        const lexDeclarations = script.LexicallyScopedDeclarations;
        for (const d of lexDeclarations) {
            for (const dn of d.BoundNames) {
                if (d.IsConstantDeclaration) {
                    const $CreateImmutableBindingResult = envRec.CreateImmutableBinding(ctx, dn, intrinsics.true);
                    if ($CreateImmutableBindingResult.isAbrupt) {
                        return $CreateImmutableBindingResult.enrichWith(ctx, this);
                    }
                }
                else {
                    const $CreateImmutableBindingResult = envRec.CreateImmutableBinding(ctx, dn, intrinsics.false);
                    if ($CreateImmutableBindingResult.isAbrupt) {
                        return $CreateImmutableBindingResult.enrichWith(ctx, this);
                    }
                }
            }
        }
        for (const f of functionsToInitialize) {
            const [fn] = f.BoundNames;
            const fo = f.InstantiateFunctionObject(ctx, env);
            if (fo.isAbrupt) {
                return fo.enrichWith(ctx, this);
            }
            const $CreateGlobalFunctionBindingResult = envRec.CreateGlobalFunctionBinding(ctx, fn, fo, intrinsics.false);
            if ($CreateGlobalFunctionBindingResult.isAbrupt) {
                return $CreateGlobalFunctionBindingResult.enrichWith(ctx, this);
            }
        }
        for (const vn of declaredVarNames) {
            const $CreateGlobalVarBindingResult = envRec.CreateGlobalVarBinding(ctx, vn, intrinsics.false);
            if ($CreateGlobalVarBindingResult.isAbrupt) {
                return $CreateGlobalVarBindingResult.enrichWith(ctx, this);
            }
        }
        return new $Empty(realm);
    }
    EvaluateScript(ctx) {
        const scriptRecord = this;
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        const stack = realm.stack;
        const globalEnv = scriptRecord.realm['[[GlobalEnv]]'];
        const scriptCxt = new ExecutionContext(realm);
        scriptCxt.ScriptOrModule = scriptRecord;
        scriptCxt.VariableEnvironment = globalEnv;
        scriptCxt.LexicalEnvironment = globalEnv;
        ctx.suspend();
        stack.push(scriptCxt);
        const scriptBody = scriptRecord;
        let result = scriptBody.InstantiateGlobalDeclaration(scriptCxt, globalEnv);
        if (result['[[Type]]'] === 1) {
            const $statements = scriptBody.$statements;
            let $statement;
            let sl = (void 0);
            for (let i = 0, ii = $statements.length; i < ii; ++i) {
                $statement = $statements[i];
                switch ($statement.$kind) {
                    case typescript.SyntaxKind.VariableStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.FunctionDeclaration:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.ClassDeclaration:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.Block:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.EmptyStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.ExpressionStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.IfStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.DoStatement:
                        sl = $statement.EvaluateLabelled(scriptCxt, new $StringSet());
                        break;
                    case typescript.SyntaxKind.WhileStatement:
                        sl = $statement.EvaluateLabelled(scriptCxt, new $StringSet());
                        break;
                    case typescript.SyntaxKind.ForStatement:
                        sl = $statement.EvaluateLabelled(scriptCxt);
                        break;
                    case typescript.SyntaxKind.ForInStatement:
                        sl = $statement.EvaluateLabelled(scriptCxt);
                        break;
                    case typescript.SyntaxKind.ForOfStatement:
                        sl = $statement.EvaluateLabelled(scriptCxt);
                        break;
                    case typescript.SyntaxKind.ContinueStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.BreakStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.ReturnStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.WithStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.SwitchStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.LabeledStatement:
                        sl = $statement.EvaluateLabelled(scriptCxt);
                        break;
                    case typescript.SyntaxKind.ThrowStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.TryStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    case typescript.SyntaxKind.DebuggerStatement:
                        sl = $statement.Evaluate(scriptCxt);
                        break;
                    default:
                        throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[$statement.$kind]}.`);
                }
                if (sl.isAbrupt) {
                    sl.enrichWith(ctx, this);
                    break;
                }
            }
            result = sl;
        }
        if (result['[[Type]]'] === 1 && result.isEmpty) {
            result = new $Undefined(realm);
        }
        scriptCxt.suspend();
        stack.pop();
        ctx.resume();
        return result;
    }
}
class $ESModule {
    get isAbrupt() { return false; }
    get $kind() { return typescript.SyntaxKind.SourceFile; }
    get isNull() { return false; }
    get isScript() { return false; }
    get isModule() { return true; }
    constructor(logger, $file, node, realm, pkg, moduleResolver, compilerOptions) {
        this.logger = logger;
        this.$file = $file;
        this.node = node;
        this.realm = realm;
        this.pkg = pkg;
        this.moduleResolver = moduleResolver;
        this.compilerOptions = compilerOptions;
        this.disposed = false;
        this.mos = this;
        this.parent = this;
        this.ctx = 0;
        this.depth = 0;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const intrinsics = realm['[[Intrinsics]]'];
        this.ExecutionResult = intrinsics.empty;
        this['[[Environment]]'] = intrinsics.undefined;
        this['[[Namespace]]'] = intrinsics.undefined;
        this.path = `ESModule<(...)${$file.rootlessPath}>`;
        this.logger = logger.root;
        let ctx = 0;
        this.DirectivePrologue = GetDirectivePrologue(node.statements);
        if (this.DirectivePrologue.ContainsUseStrict) {
            ctx |= 65536;
        }
        const ExportedBindings = this.ExportedBindings = [];
        const ExportedNames = this.ExportedNames = [];
        const ExportEntries = this.ExportEntries = [];
        const ImportEntries = this.ImportEntries = [];
        const ImportedLocalNames = this.ImportedLocalNames = [];
        const ModuleRequests = this.ModuleRequests = [];
        const LexicallyScopedDeclarations = this.LexicallyScopedDeclarations = [];
        const VarScopedDeclarations = this.VarScopedDeclarations = [];
        const $statements = this.$statements = [];
        const statements = node.statements;
        let stmt;
        let $stmt;
        let s = 0;
        for (let i = 0, ii = statements.length; i < ii; ++i) {
            stmt = statements[i];
            switch (stmt.kind) {
                case typescript.SyntaxKind.ModuleDeclaration:
                    $stmt = $statements[s] = new $ModuleDeclaration(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.NamespaceExportDeclaration:
                    $stmt = $statements[s] = new $NamespaceExportDeclaration(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.ImportEqualsDeclaration:
                    $stmt = $statements[s] = new $ImportEqualsDeclaration(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.ImportDeclaration:
                    $stmt = $statements[s] = new $ImportDeclaration(stmt, this, ctx, s);
                    ++s;
                    ImportEntries.push(...$stmt.ImportEntries);
                    ImportedLocalNames.push(...$stmt.ImportEntries.map(getLocalName));
                    ModuleRequests.push(...$stmt.ModuleRequests);
                    break;
                case typescript.SyntaxKind.ExportAssignment:
                    $stmt = $statements[s] = new $ExportAssignment(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.ExportDeclaration:
                    $stmt = $statements[s] = new $ExportDeclaration(stmt, this, ctx, s);
                    ++s;
                    ExportedBindings.push(...$stmt.ExportedBindings);
                    ExportedNames.push(...$stmt.ExportedNames);
                    ExportEntries.push(...$stmt.ExportEntries);
                    ModuleRequests.push(...$stmt.ModuleRequests);
                    LexicallyScopedDeclarations.push(...$stmt.LexicallyScopedDeclarations);
                    break;
                case typescript.SyntaxKind.VariableStatement:
                    $stmt = $statements[s] = new $VariableStatement(stmt, this, ctx, s);
                    ++s;
                    if ($stmt.isLexical) {
                        LexicallyScopedDeclarations.push($stmt);
                    }
                    else {
                        VarScopedDeclarations.push($stmt);
                    }
                    if (hasBit($stmt.modifierFlags, typescript.ModifierFlags.Export)) {
                        ExportedBindings.push(...$stmt.ExportedBindings);
                        ExportedNames.push(...$stmt.ExportedNames);
                        ExportEntries.push(...$stmt.ExportEntries);
                    }
                    break;
                case typescript.SyntaxKind.FunctionDeclaration:
                    if (stmt.body === void 0) {
                        continue;
                    }
                    $stmt = $statements[s] = new $FunctionDeclaration(stmt, this, ctx, s);
                    ++s;
                    if (hasBit($stmt.modifierFlags, typescript.ModifierFlags.Export)) {
                        ExportedBindings.push(...$stmt.ExportedBindings);
                        ExportedNames.push(...$stmt.ExportedNames);
                        ExportEntries.push(...$stmt.ExportEntries);
                    }
                    LexicallyScopedDeclarations.push($stmt);
                    break;
                case typescript.SyntaxKind.ClassDeclaration:
                    $stmt = $statements[s] = new $ClassDeclaration(stmt, this, ctx, s);
                    ++s;
                    if (hasBit($stmt.modifierFlags, typescript.ModifierFlags.Export)) {
                        ExportedBindings.push(...$stmt.ExportedBindings);
                        ExportedNames.push(...$stmt.ExportedNames);
                        ExportEntries.push(...$stmt.ExportEntries);
                    }
                    LexicallyScopedDeclarations.push($stmt);
                    break;
                case typescript.SyntaxKind.InterfaceDeclaration:
                    $stmt = $statements[s] = new $InterfaceDeclaration(stmt, this, ctx, s);
                    ++s;
                    if (hasBit($stmt.modifierFlags, typescript.ModifierFlags.Export)) {
                        ExportedBindings.push(...$stmt.ExportedBindings);
                        ExportedNames.push(...$stmt.ExportedNames);
                        ExportEntries.push(...$stmt.ExportEntries);
                    }
                    break;
                case typescript.SyntaxKind.TypeAliasDeclaration:
                    $stmt = $statements[s] = new $TypeAliasDeclaration(stmt, this, ctx, s);
                    ++s;
                    if (hasBit($stmt.modifierFlags, typescript.ModifierFlags.Export)) {
                        ExportedBindings.push(...$stmt.ExportedBindings);
                        ExportedNames.push(...$stmt.ExportedNames);
                        ExportEntries.push(...$stmt.ExportEntries);
                    }
                    break;
                case typescript.SyntaxKind.EnumDeclaration:
                    $stmt = $statements[s] = new $EnumDeclaration(stmt, this, ctx, s);
                    ++s;
                    if (hasBit($stmt.modifierFlags, typescript.ModifierFlags.Export)) {
                        ExportedBindings.push(...$stmt.ExportedBindings);
                        ExportedNames.push(...$stmt.ExportedNames);
                        ExportEntries.push(...$stmt.ExportEntries);
                    }
                    break;
                case typescript.SyntaxKind.Block:
                    $stmt = $statements[s] = new $Block(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.EmptyStatement:
                    $stmt = $statements[s] = new $EmptyStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.ExpressionStatement:
                    $stmt = $statements[s] = new $ExpressionStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.IfStatement:
                    $stmt = $statements[s] = new $IfStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.DoStatement:
                    $stmt = $statements[s] = new $DoStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.WhileStatement:
                    $stmt = $statements[s] = new $WhileStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ForStatement:
                    $stmt = $statements[s] = new $ForStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ForInStatement:
                    $stmt = $statements[s] = new $ForInStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ForOfStatement:
                    $stmt = $statements[s] = new $ForOfStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ContinueStatement:
                    $stmt = $statements[s] = new $ContinueStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.BreakStatement:
                    $stmt = $statements[s] = new $BreakStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.ReturnStatement:
                    $stmt = $statements[s] = new $ReturnStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.WithStatement:
                    $stmt = $statements[s] = new $WithStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.SwitchStatement:
                    $stmt = $statements[s] = new $SwitchStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.LabeledStatement:
                    $stmt = $statements[s] = new $LabeledStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.ThrowStatement:
                    $stmt = $statements[s] = new $ThrowStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                case typescript.SyntaxKind.TryStatement:
                    $stmt = $statements[s] = new $TryStatement(stmt, this, ctx, s);
                    ++s;
                    VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.DebuggerStatement:
                    $stmt = $statements[s] = new $DebuggerStatement(stmt, this, ctx, s);
                    ++s;
                    break;
                default:
                    throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[node.kind]}.`);
            }
        }
        const requestedModules = ModuleRequests;
        const importEntries = ImportEntries;
        const importedBoundNames = ImportedLocalNames;
        const indirectExportEntries = [];
        const localExportEntries = [];
        const starExportEntries = [];
        const exportEntries = ExportEntries;
        let ee;
        for (let i = 0, ii = exportEntries.length; i < ii; ++i) {
            ee = exportEntries[i];
            if (ee.ModuleRequest.isNull) {
                if (!importedBoundNames.some(x => x.is(ee.LocalName))) {
                    localExportEntries.push(ee);
                }
                else {
                    const ie = importEntries.find(x => x.LocalName.is(ee.LocalName));
                    if (ie.ImportName['[[Value]]'] === '*') {
                        localExportEntries.push(ee);
                    }
                    else {
                        indirectExportEntries.push(new ExportEntryRecord(this, ee.ExportName, ie.ModuleRequest, ie.ImportName, intrinsics.null));
                    }
                }
            }
            else if (ee.ImportName['[[Value]]'] === '*') {
                starExportEntries.push(ee);
            }
            else {
                indirectExportEntries.push(ee);
            }
        }
        this.Status = 'uninstantiated';
        this.DFSIndex = void 0;
        this.DFSAncestorIndex = void 0;
        this.RequestedModules = requestedModules;
        this.IndirectExportEntries = indirectExportEntries;
        this.LocalExportEntries = localExportEntries;
        this.StarExportEntries = starExportEntries;
        this.logger.trace(`RequestedModules: `, requestedModules);
        this.logger.trace(`ImportEntries: `, importEntries);
        this.logger.trace(`IndirectExportEntries: `, indirectExportEntries);
        this.logger.trace(`LocalExportEntries: `, localExportEntries);
        this.logger.trace(`StarExportEntries: `, starExportEntries);
    }
    Instantiate(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const start = Date.now();
        this.logger.debug(`${this.path}.[Instantiate] starting`);
        if (realm.stack.top.ScriptOrModule.isNull) {
            realm.stack.top.ScriptOrModule = this;
        }
        const stack = [];
        const result = this._InnerModuleInstantiation(ctx, stack, new $Number(realm, 0));
        if (result.isAbrupt) {
            for (const m of stack) {
                m.Status = 'uninstantiated';
                m['[[Environment]]'] = intrinsics.undefined;
                m.DFSIndex = void 0;
                m.DFSAncestorIndex = void 0;
            }
            return result;
        }
        const end = Date.now();
        this.logger.debug(`${this.path}.[Instantiate] done in ${Math.round(end - start)}ms`);
        return new $Undefined(realm);
    }
    _InnerModuleInstantiation(ctx, stack, idx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}._InnerModuleInstantiation(#${ctx.id})`);
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        if (this.Status === 'instantiating' || this.Status === 'instantiated' || this.Status === 'evaluated') {
            return idx;
        }
        this.Status = 'instantiating';
        this.DFSIndex = idx['[[Value]]'];
        this.DFSAncestorIndex = idx['[[Value]]'];
        idx = new $Number(realm, idx['[[Value]]'] + 1);
        stack.push(this);
        for (const required of this.RequestedModules) {
            const requiredModule = this.moduleResolver.ResolveImportedModule(ctx, this, required);
            if (requiredModule.isAbrupt) {
                return requiredModule.enrichWith(ctx, this);
            }
            const $idx = requiredModule._InnerModuleInstantiation(ctx, stack, idx);
            if ($idx.isAbrupt) {
                return $idx.enrichWith(ctx, this);
            }
            idx = $idx;
            if (requiredModule instanceof $ESModule && requiredModule.Status === 'instantiating') {
                this.logger.warn(`[_InnerModuleInstantiation] ${requiredModule.$file.name} is a cyclic module record`);
                this.DFSAncestorIndex = Math.min(this.DFSAncestorIndex, requiredModule.DFSAncestorIndex);
            }
        }
        const $InitializeEnvironmentResult = this.InitializeEnvironment(ctx);
        if ($InitializeEnvironmentResult.isAbrupt) {
            return $InitializeEnvironmentResult.enrichWith(ctx, this);
        }
        if (this.DFSAncestorIndex === this.DFSIndex) {
            let done = false;
            while (!done) {
                const requiredModule = stack.pop();
                requiredModule.Status = 'instantiated';
                if (requiredModule === this) {
                    done = true;
                }
            }
        }
        return idx;
    }
    InitializeEnvironment(ctx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeEnvironment(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        for (const e of this.IndirectExportEntries) {
            const resolution = this.ResolveExport(ctx, e.ExportName, new ResolveSet());
            if (resolution.isAbrupt) {
                return resolution.enrichWith(ctx, this);
            }
            if (resolution.isNull || resolution.isAmbiguous) {
                return new $SyntaxError(realm, `ResolveExport(${e.ExportName}) returned ${resolution}`);
            }
        }
        const envRec = new $ModuleEnvRec(this.logger, realm, realm['[[GlobalEnv]]']);
        this['[[Environment]]'] = envRec;
        for (const ie of this.ImportEntries) {
            const importedModule = this.moduleResolver.ResolveImportedModule(ctx, this, ie.ModuleRequest);
            if (ie.ImportName['[[Value]]'] === '*') {
                const namespace = (function (mod) {
                    let namespace = mod['[[Namespace]]'];
                    if (namespace.isUndefined) {
                        const exportedNames = mod.GetExportedNames(ctx, new Set());
                        if (exportedNames.isAbrupt) {
                            return exportedNames.enrichWith(ctx, mod);
                        }
                        const unambiguousNames = new $List();
                        for (const name of exportedNames) {
                            const resolution = mod.ResolveExport(ctx, name, new ResolveSet());
                            if (resolution.isAbrupt) {
                                return resolution.enrichWith(ctx, mod);
                            }
                            if (resolution instanceof ResolvedBindingRecord) {
                                unambiguousNames.push(name);
                            }
                        }
                        namespace = new $NamespaceExoticObject(realm, mod, unambiguousNames);
                    }
                    return namespace;
                })(importedModule);
                envRec.CreateImmutableBinding(ctx, ie.LocalName, intrinsics.true);
                if (namespace.isAbrupt) {
                    return namespace.enrichWith(ctx, this);
                }
                envRec.InitializeBinding(ctx, ie.LocalName, namespace);
            }
            else {
                const resolution = importedModule.ResolveExport(ctx, ie.ImportName, new ResolveSet());
                if (resolution.isAbrupt) {
                    return resolution.enrichWith(ctx, this);
                }
                if (resolution.isNull || resolution.isAmbiguous) {
                    return new $SyntaxError(realm, `ResolveExport(${ie.ImportName}) returned ${resolution}`);
                }
                envRec.CreateImportBinding(ctx, ie.LocalName, resolution.Module, resolution.BindingName);
            }
        }
        const varDeclarations = this.VarScopedDeclarations;
        const declaredVarNames = new $List();
        for (const d of varDeclarations) {
            for (const dn of d.BoundNames) {
                if (!declaredVarNames.$contains(dn)) {
                    envRec.CreateMutableBinding(ctx, dn, intrinsics.false);
                    envRec.InitializeBinding(ctx, dn, intrinsics.undefined);
                    declaredVarNames.push(dn);
                }
            }
        }
        const lexDeclarations = this.LexicallyScopedDeclarations;
        for (const d of lexDeclarations) {
            for (const dn of d.BoundNames) {
                if (d.IsConstantDeclaration) {
                    envRec.CreateImmutableBinding(ctx, dn, intrinsics.true);
                }
                else {
                    envRec.CreateMutableBinding(ctx, dn, intrinsics.false);
                    if (d.$kind === typescript.SyntaxKind.FunctionDeclaration) {
                        const fo = d.InstantiateFunctionObject(ctx, envRec);
                        if (fo.isAbrupt) {
                            return fo.enrichWith(ctx, this);
                        }
                        envRec.InitializeBinding(ctx, dn, fo);
                    }
                }
            }
        }
        return new $Empty(realm);
    }
    GetExportedNames(ctx, exportStarSet) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        const mod = this;
        if (exportStarSet.has(mod)) {
            return new $List();
        }
        exportStarSet.add(mod);
        const exportedNames = new $List();
        for (const e of mod.LocalExportEntries) {
            exportedNames.push(e.ExportName);
        }
        for (const e of mod.IndirectExportEntries) {
            exportedNames.push(e.ExportName);
        }
        for (const e of mod.StarExportEntries) {
            const requestedModule = this.moduleResolver.ResolveImportedModule(ctx, mod, e.ModuleRequest);
            if (requestedModule.isAbrupt) {
                return requestedModule.enrichWith(ctx, this);
            }
            const starNames = requestedModule.GetExportedNames(ctx, exportStarSet);
            if (starNames.isAbrupt) {
                return starNames.enrichWith(ctx, this);
            }
            for (const n of starNames) {
                if (n['[[Value]]'] !== 'default') {
                    if (!exportedNames.$contains(n)) {
                        exportedNames.push(n);
                    }
                }
            }
        }
        return exportedNames;
    }
    ResolveExport(ctx, exportName, resolveSet) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        if (resolveSet.has(this, exportName)) {
            this.logger.warn(`[ResolveExport] Circular import: ${exportName}`);
            return new $Null(realm);
        }
        resolveSet.add(this, exportName);
        for (const e of this.LocalExportEntries) {
            if (exportName.is(e.ExportName)) {
                this.logger.debug(`${this.path}.[ResolveExport] found direct binding for ${exportName['[[Value]]']}`);
                return new ResolvedBindingRecord(this, e.LocalName);
            }
        }
        for (const e of this.IndirectExportEntries) {
            if (exportName.is(e.ExportName)) {
                this.logger.debug(`${this.path}.[ResolveExport] found specific imported binding for ${exportName['[[Value]]']}`);
                const importedModule = this.moduleResolver.ResolveImportedModule(ctx, this, e.ModuleRequest);
                if (importedModule.isAbrupt) {
                    return importedModule.enrichWith(ctx, this);
                }
                return importedModule.ResolveExport(ctx, e.ImportName, resolveSet);
            }
        }
        if (exportName['[[Value]]'] === 'default') {
            this.logger.warn(`[ResolveExport] No default export defined`);
            return new $Null(realm);
        }
        let starResolution = new $Null(realm);
        for (const e of this.StarExportEntries) {
            const importedModule = this.moduleResolver.ResolveImportedModule(ctx, this, e.ModuleRequest);
            if (importedModule.isAbrupt) {
                return importedModule.enrichWith(ctx, this);
            }
            const resolution = importedModule.ResolveExport(ctx, exportName, resolveSet);
            if (resolution.isAbrupt) {
                return resolution.enrichWith(ctx, this);
            }
            if (resolution.isAmbiguous) {
                this.logger.warn(`[ResolveExport] ambiguous resolution for ${exportName['[[Value]]']}`);
                return resolution;
            }
            if (!resolution.isNull) {
                if (starResolution.isNull) {
                    starResolution = resolution;
                }
                else {
                    if (!(resolution.Module === starResolution.Module && resolution.BindingName.is(starResolution.BindingName))) {
                        this.logger.warn(`[ResolveExport] ambiguous resolution for ${exportName['[[Value]]']}`);
                        return new $String(realm, 'ambiguous');
                    }
                }
            }
        }
        if (starResolution.isNull) {
            this.logger.warn(`[ResolveExport] starResolution is null for ${exportName['[[Value]]']}`);
        }
        return starResolution;
    }
    EvaluateModule(ctx) {
        this.logger.debug(`${this.path}.EvaluateModule()`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const stack = [];
        const result = this.EvaluateModuleInner(ctx, stack, 0);
        if (result.isAbrupt) {
            for (const m of stack) {
                m.Status = 'evaluated';
            }
            return result;
        }
        return new $Undefined(realm, 1, intrinsics.empty, this);
    }
    EvaluateModuleInner(ctx, stack, idx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.EvaluateModuleInner(#${ctx.id})`);
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        if (this.Status === 'evaluated') {
            return new $Number(realm, idx);
        }
        if (this.Status === 'evaluating') {
            return new $Number(realm, idx);
        }
        this.Status = 'evaluating';
        this.DFSIndex = idx;
        this.DFSAncestorIndex = idx;
        ++idx;
        stack.push(this);
        for (const required of this.RequestedModules) {
            const requiredModule = this.moduleResolver.ResolveImportedModule(ctx, this, required);
            const $EvaluateModuleInnerResult = requiredModule.EvaluateModuleInner(ctx, stack, idx);
            if ($EvaluateModuleInnerResult.isAbrupt) {
                return $EvaluateModuleInnerResult.enrichWith(ctx, this);
            }
            idx = $EvaluateModuleInnerResult['[[Value]]'];
            if (requiredModule.Status === 'evaluating') {
                this.DFSAncestorIndex = Math.min(this.DFSAncestorIndex, requiredModule.DFSAncestorIndex);
            }
        }
        const $ExecuteModuleResult = this.ExecutionResult = this.ExecuteModule(ctx);
        if ($ExecuteModuleResult.isAbrupt) {
            return $ExecuteModuleResult.enrichWith(ctx, this);
        }
        if (this.DFSAncestorIndex === this.DFSIndex) {
            let done = false;
            while (!done) {
                const requiredModule = stack.pop();
                requiredModule.Status = 'evaluated';
                if (requiredModule === this) {
                    done = true;
                }
            }
        }
        return new $Number(realm, idx);
    }
    ExecuteModule(ctx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.ExecuteModule(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const moduleCxt = new ExecutionContext(this.realm);
        moduleCxt.Function = intrinsics.null;
        moduleCxt.ScriptOrModule = this;
        moduleCxt.VariableEnvironment = this['[[Environment]]'];
        moduleCxt.LexicalEnvironment = this['[[Environment]]'];
        const stack = realm.stack;
        ctx.suspend();
        stack.push(moduleCxt);
        const result = this.Evaluate(moduleCxt);
        moduleCxt.suspend();
        stack.pop();
        ctx.resume();
        return result;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const $statements = this.$statements;
        let $statement;
        let sl = (void 0);
        for (let i = 0, ii = $statements.length; i < ii; ++i) {
            $statement = $statements[i];
            switch ($statement.$kind) {
                case typescript.SyntaxKind.ModuleDeclaration:
                    break;
                case typescript.SyntaxKind.NamespaceExportDeclaration:
                    break;
                case typescript.SyntaxKind.ImportEqualsDeclaration:
                    break;
                case typescript.SyntaxKind.ImportDeclaration:
                    break;
                case typescript.SyntaxKind.ExportAssignment:
                    break;
                case typescript.SyntaxKind.ExportDeclaration:
                    break;
                case typescript.SyntaxKind.VariableStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.FunctionDeclaration:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.ClassDeclaration:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.InterfaceDeclaration:
                    break;
                case typescript.SyntaxKind.TypeAliasDeclaration:
                    break;
                case typescript.SyntaxKind.EnumDeclaration:
                    break;
                case typescript.SyntaxKind.Block:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.EmptyStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.ExpressionStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.IfStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.DoStatement:
                    sl = $statement.EvaluateLabelled(ctx, new $StringSet());
                    break;
                case typescript.SyntaxKind.WhileStatement:
                    sl = $statement.EvaluateLabelled(ctx, new $StringSet());
                    break;
                case typescript.SyntaxKind.ForStatement:
                    sl = $statement.EvaluateLabelled(ctx);
                    break;
                case typescript.SyntaxKind.ForInStatement:
                    sl = $statement.EvaluateLabelled(ctx);
                    break;
                case typescript.SyntaxKind.ForOfStatement:
                    sl = $statement.EvaluateLabelled(ctx);
                    break;
                case typescript.SyntaxKind.ContinueStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.BreakStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.ReturnStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.WithStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.SwitchStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.LabeledStatement:
                    sl = $statement.EvaluateLabelled(ctx);
                    break;
                case typescript.SyntaxKind.ThrowStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.TryStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                case typescript.SyntaxKind.DebuggerStatement:
                    sl = $statement.Evaluate(ctx);
                    break;
                default:
                    throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[$statement.$kind]}.`);
            }
            if (sl.isAbrupt) {
                return sl.enrichWith(ctx, this);
            }
        }
        return sl;
    }
    dispose() {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        this['[[Environment]]'] = void 0;
        this['[[Namespace]]'] = void 0;
        this.mos = void 0;
        this.parent = void 0;
        this.$statements = void 0;
        this.DirectivePrologue = void 0;
        this.ExecutionResult = void 0;
        this.ExportedBindings = void 0;
        this.ExportedNames = void 0;
        this.ExportEntries = void 0;
        this.ImportEntries = void 0;
        this.ImportedLocalNames = void 0;
        this.ModuleRequests = void 0;
        this.LexicallyScopedDeclarations = void 0;
        this.VarScopedDeclarations = void 0;
        this.TypeDeclarations = void 0;
        this.RequestedModules = void 0;
        this.LocalExportEntries = void 0;
        this.IndirectExportEntries = void 0;
        this.StarExportEntries = void 0;
        this.logger = void 0;
        this.$file = void 0;
        this.node = void 0;
        this.realm = void 0;
        this.pkg = void 0;
        this.moduleResolver = void 0;
        this.compilerOptions = void 0;
    }
}
class $DocumentFragment {
    get isNull() { return false; }
    get isAbrupt() { return false; }
    constructor(logger, $file, node, realm, pkg) {
        this.logger = logger;
        this.$file = $file;
        this.node = node;
        this.realm = realm;
        this.pkg = pkg;
        this.documentFragment = this;
        this.parent = this;
        this.ctx = 0;
        this.depth = 0;
        const intrinsics = realm['[[Intrinsics]]'];
        this['[[Environment]]'] = intrinsics.undefined;
        this['[[Namespace]]'] = intrinsics.undefined;
        this.logger = logger.root;
        this.path = `DocumentFragment<(...)${$file.rootlessPath}>`;
    }
    ResolveExport(ctx, exportName, resolveSet) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.[ResolveExport] returning content as '${exportName['[[Value]]']}'`);
        return new ResolvedBindingRecord(this, exportName);
    }
    GetExportedNames(ctx, exportStarSet) {
        ctx.checkTimeout();
        return new $List();
    }
    Instantiate(ctx) {
        ctx.checkTimeout();
        return ctx.Realm['[[Intrinsics]]'].undefined;
    }
    _InnerModuleInstantiation(ctx, stack, idx) {
        ctx.checkTimeout();
        return idx;
    }
    dispose() {
        throw new Error('Method not implemented.');
    }
}
class $ModuleDeclaration {
    get $kind() { return typescript.SyntaxKind.ModuleDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ModuleDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        if (node.name.kind === typescript.SyntaxKind.Identifier) {
            this.$name = new $Identifier(node.name, this, ctx, -1);
        }
        else {
            this.$name = new $StringLiteral(node.name, this, ctx, -1);
        }
        if (node.body === void 0) {
            this.$body = void 0;
        }
        else {
            switch (node.body.kind) {
                case typescript.SyntaxKind.Identifier:
                    this.$body = new $Identifier(node.body, this, ctx, -1);
                    break;
                case typescript.SyntaxKind.ModuleBlock:
                    this.$body = new $ModuleBlock(node.body, this, ctx);
                    break;
                case typescript.SyntaxKind.ModuleDeclaration:
                    this.$body = new $ModuleDeclaration(node.body, this, ctx, -1);
                    break;
                default:
                    throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[node.kind]}.`);
            }
        }
    }
}
class ImportEntryRecord {
    constructor(source, ModuleRequest, ImportName, LocalName) {
        this.source = source;
        this.ModuleRequest = ModuleRequest;
        this.ImportName = ImportName;
        this.LocalName = LocalName;
    }
}
class $ImportEqualsDeclaration {
    get $kind() { return typescript.SyntaxKind.ImportEqualsDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ImportEqualsDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        this.$name = $identifier(node.name, this, ctx, -1);
        switch (node.moduleReference.kind) {
            case typescript.SyntaxKind.Identifier:
                this.$moduleReference = new $Identifier(node.moduleReference, this, ctx, -1);
                break;
            case typescript.SyntaxKind.QualifiedName:
                this.$moduleReference = new $QualifiedName(node.moduleReference, this, ctx);
                break;
            case typescript.SyntaxKind.ExternalModuleReference:
                this.$moduleReference = new $ExternalModuleReference(node.moduleReference, this, ctx);
                break;
            default:
                throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[node.kind]}.`);
        }
    }
}
class $ImportDeclaration {
    get $kind() { return typescript.SyntaxKind.ImportDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ImportDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        const $moduleSpecifier = this.$moduleSpecifier = new $StringLiteral(node.moduleSpecifier, this, ctx, -1);
        const moduleSpecifier = this.moduleSpecifier = $moduleSpecifier.StringValue;
        if (node.importClause === void 0) {
            this.$importClause = new $Undefined(realm, void 0, void 0, this);
            this.BoundNames = kernel.emptyArray;
            this.ImportEntries = kernel.emptyArray;
        }
        else {
            const $importClause = this.$importClause = new $ImportClause(node.importClause, this, ctx);
            this.BoundNames = $importClause.BoundNames;
            this.ImportEntries = $importClause.ImportEntriesForModule;
        }
        this.ModuleRequests = [moduleSpecifier];
    }
}
class $ImportClause {
    get $kind() { return typescript.SyntaxKind.ImportClause; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.ImportClause`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const intrinsics = realm['[[Intrinsics]]'];
        const moduleSpecifier = this.moduleSpecifier = parent.moduleSpecifier;
        const BoundNames = this.BoundNames = [];
        const ImportEntriesForModule = this.ImportEntriesForModule = [];
        if (node.name === void 0) {
            this.$name = new $Undefined(realm, void 0, void 0, this);
        }
        else {
            const $name = this.$name = new $Identifier(node.name, this, ctx, -1);
            const [localName] = $name.BoundNames;
            BoundNames.push(localName);
            ImportEntriesForModule.push(new ImportEntryRecord(this, moduleSpecifier, intrinsics.default, localName));
        }
        if (node.namedBindings === void 0) {
            this.$namedBindings = void 0;
        }
        else {
            if (node.namedBindings.kind === typescript.SyntaxKind.NamespaceImport) {
                const $namedBindings = this.$namedBindings = new $NamespaceImport(node.namedBindings, this, ctx);
                BoundNames.push(...$namedBindings.BoundNames);
                ImportEntriesForModule.push(...$namedBindings.ImportEntriesForModule);
            }
            else {
                const $namedBindings = this.$namedBindings = new $NamedImports(node.namedBindings, this, ctx);
                BoundNames.push(...$namedBindings.BoundNames);
                ImportEntriesForModule.push(...$namedBindings.ImportEntriesForModule);
            }
        }
    }
}
class $NamedImports {
    get $kind() { return typescript.SyntaxKind.NamedImports; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.NamedImports`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.moduleSpecifier = parent.moduleSpecifier;
        const $elements = this.$elements = node.elements.map(x => new $ImportSpecifier(x, this, ctx));
        this.BoundNames = $elements.flatMap(getBoundNames);
        this.ImportEntriesForModule = $elements.flatMap(getImportEntriesForModule);
    }
}
class $ImportSpecifier {
    get $kind() { return typescript.SyntaxKind.ImportSpecifier; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.ImportSpecifier`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        let $propertyName;
        if (node.propertyName === void 0) {
            $propertyName = this.$propertyName = new $Undefined(realm, void 0, void 0, this);
        }
        else {
            $propertyName = this.$propertyName = new $Identifier(node.propertyName, this, ctx, -1);
        }
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        const BoundNames = this.BoundNames = this.$name.BoundNames;
        const moduleSpecifier = parent.moduleSpecifier;
        if ($propertyName.isUndefined) {
            const [localName] = BoundNames;
            this.ImportEntriesForModule = [
                new ImportEntryRecord(this, moduleSpecifier, localName, localName),
            ];
        }
        else {
            const importName = $propertyName.StringValue;
            const localName = $name.StringValue;
            this.ImportEntriesForModule = [
                new ImportEntryRecord(this, moduleSpecifier, importName, localName),
            ];
        }
    }
}
class $NamespaceImport {
    get $kind() { return typescript.SyntaxKind.NamespaceImport; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.NamespaceImport`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const intrinsics = realm['[[Intrinsics]]'];
        const $name = this.$name = new $Identifier(node.name, this, ctx, -1);
        this.BoundNames = $name.BoundNames;
        const moduleSpecifier = parent.moduleSpecifier;
        const localName = $name.StringValue;
        this.ImportEntriesForModule = [
            new ImportEntryRecord(this, moduleSpecifier, intrinsics['*'], localName),
        ];
    }
}
class ExportEntryRecord {
    constructor(source, ExportName, ModuleRequest, ImportName, LocalName) {
        this.source = source;
        this.ExportName = ExportName;
        this.ModuleRequest = ModuleRequest;
        this.ImportName = ImportName;
        this.LocalName = LocalName;
    }
}
class $ExportAssignment {
    get $kind() { return typescript.SyntaxKind.ExportAssignment; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ExportAssignment`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const intrinsics = realm['[[Intrinsics]]'];
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        this.BoundNames = [intrinsics['*default*']];
    }
}
class $ExportDeclaration {
    get $kind() { return typescript.SyntaxKind.ExportDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ExportDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.BoundNames = kernel.emptyArray;
        this.ExportedBindings = kernel.emptyArray;
        this.IsConstantDeclaration = false;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const intrinsics = realm['[[Intrinsics]]'];
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        let moduleSpecifier;
        if (node.moduleSpecifier === void 0) {
            this.$moduleSpecifier = void 0;
            moduleSpecifier = this.moduleSpecifier = intrinsics.null;
            this.ModuleRequests = kernel.emptyArray;
        }
        else {
            const $moduleSpecifier = this.$moduleSpecifier = new $StringLiteral(node.moduleSpecifier, this, ctx, -1);
            moduleSpecifier = this.moduleSpecifier = $moduleSpecifier.StringValue;
            this.ModuleRequests = [moduleSpecifier];
        }
        if (node.exportClause === void 0) {
            this.$exportClause = void 0;
            this.ExportedNames = kernel.emptyArray;
            this.ExportEntries = [
                new ExportEntryRecord(this, intrinsics.null, moduleSpecifier, intrinsics['*'], intrinsics.null),
            ];
        }
        else {
            const $exportClause = this.$exportClause = new $NamedExports(node.exportClause, this, ctx);
            this.ExportedNames = $exportClause.ExportedNames;
            this.ExportEntries = $exportClause.ExportEntriesForModule;
        }
    }
}
class $NamedExports {
    get $kind() { return typescript.SyntaxKind.NamedExports; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.NamedExports`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.moduleSpecifier = parent.moduleSpecifier;
        const $elements = this.$elements = node.elements.map(x => new $ExportSpecifier(x, this, ctx));
        this.ExportedNames = $elements.flatMap(getExportedNames);
        this.ExportEntriesForModule = $elements.flatMap(getExportEntriesForModule);
        this.ReferencedBindings = $elements.flatMap(getReferencedBindings);
    }
}
class $ExportSpecifier {
    get $kind() { return typescript.SyntaxKind.ExportSpecifier; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.ExportSpecifier`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const intrinsics = realm['[[Intrinsics]]'];
        let $propertyName;
        if (node.propertyName === void 0) {
            $propertyName = this.$propertyName = new $Undefined(realm, void 0, void 0, this);
        }
        else {
            $propertyName = this.$propertyName = new $Identifier(node.propertyName, this, ctx, -1);
        }
        const $name = this.$name = new $Identifier(node.name, this, ctx, -1);
        const moduleSpecifier = parent.moduleSpecifier;
        if ($propertyName.isUndefined) {
            const sourceName = $name.StringValue;
            this.ReferencedBindings = [sourceName];
            this.ExportedNames = [sourceName];
            if (moduleSpecifier.isNull) {
                this.ExportEntriesForModule = [
                    new ExportEntryRecord(this, sourceName, moduleSpecifier, intrinsics.null, sourceName),
                ];
            }
            else {
                this.ExportEntriesForModule = [
                    new ExportEntryRecord(this, sourceName, moduleSpecifier, sourceName, intrinsics.null),
                ];
            }
        }
        else {
            const exportName = $name.StringValue;
            const sourceName = $propertyName.StringValue;
            this.ReferencedBindings = [sourceName];
            this.ExportedNames = [exportName];
            if (moduleSpecifier.isNull) {
                this.ExportEntriesForModule = [
                    new ExportEntryRecord(this, exportName, moduleSpecifier, intrinsics.null, sourceName),
                ];
            }
            else {
                this.ExportEntriesForModule = [
                    new ExportEntryRecord(this, exportName, moduleSpecifier, sourceName, intrinsics.null),
                ];
            }
        }
    }
}
class $NamespaceExportDeclaration {
    get $kind() { return typescript.SyntaxKind.NamespaceExportDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.NamespaceExportDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        this.$name = $identifier(node.name, this, ctx, -1);
    }
}
class $ModuleBlock {
    get $kind() { return typescript.SyntaxKind.ModuleBlock; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.ModuleBlock`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$statements = kernel.emptyArray;
    }
}
class $ExternalModuleReference {
    get $kind() { return typescript.SyntaxKind.ExternalModuleReference; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.ExternalModuleReference`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = new $StringLiteral(node.expression, this, ctx, -1);
    }
}
class $QualifiedName {
    get $kind() { return typescript.SyntaxKind.QualifiedName; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.QualifiedName`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        if (node.left.kind === typescript.SyntaxKind.Identifier) {
            this.$left = new $Identifier(node.left, this, ctx, -1);
        }
        else {
            this.$left = new $QualifiedName(node.left, this, ctx);
        }
        this.$right = new $Identifier(node.right, this, ctx, -1);
    }
}

class $VariableStatement {
    get $kind() { return typescript.SyntaxKind.VariableStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.VariableStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const intrinsics = realm['[[Intrinsics]]'];
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        ctx |= 4;
        if (hasBit(this.modifierFlags, typescript.ModifierFlags.Export)) {
            ctx |= 4096;
        }
        const $declarationList = this.$declarationList = new $VariableDeclarationList(node.declarationList, this, ctx);
        const isLexical = this.isLexical = $declarationList.isLexical;
        this.IsConstantDeclaration = $declarationList.IsConstantDeclaration;
        const BoundNames = this.BoundNames = $declarationList.BoundNames;
        this.VarDeclaredNames = $declarationList.VarDeclaredNames;
        this.VarScopedDeclarations = $declarationList.VarScopedDeclarations;
        if (hasBit(ctx, 4096)) {
            this.ExportedBindings = BoundNames;
            this.ExportedNames = BoundNames;
            this.ExportEntries = BoundNames.map(name => new ExportEntryRecord(this, name, intrinsics.null, intrinsics.null, name));
            if (isLexical) {
                this.LexicallyScopedDeclarations = [this];
            }
            else {
                this.LexicallyScopedDeclarations = kernel.emptyArray;
            }
        }
        else {
            this.ExportedBindings = kernel.emptyArray;
            this.ExportedNames = kernel.emptyArray;
            this.ExportEntries = kernel.emptyArray;
            this.LexicallyScopedDeclarations = kernel.emptyArray;
        }
        this.ModuleRequests = kernel.emptyArray;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $VariableDeclaration {
    get $kind() { return typescript.SyntaxKind.VariableDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.VariableDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        if (hasBit(ctx, 4)) {
            this.combinedModifierFlags = modifierFlags | parent.combinedModifierFlags;
        }
        else {
            this.combinedModifierFlags = modifierFlags;
        }
        const $name = this.$name = $$bindingName(node.name, this, ctx, -1);
        ctx = clearBit(ctx, 4);
        this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
        this.BoundNames = $name.BoundNames;
        if (hasBit(ctx, 32768)) {
            this.VarDeclaredNames = this.BoundNames;
            this.VarScopedDeclarations = [this];
            this.IsConstantDeclaration = false;
        }
        else {
            this.VarDeclaredNames = kernel.emptyArray;
            this.VarScopedDeclarations = kernel.emptyArray;
            this.IsConstantDeclaration = hasBit(ctx, 8192);
        }
    }
    InitializeBinding(ctx, value) {
        var _a, _b;
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const bindingName = this.$name;
        const kind = bindingName.$kind;
        const boundNames = bindingName.BoundNames;
        const envRec = ctx.LexicalEnvironment;
        if (((_a = boundNames === null || boundNames === void 0 ? void 0 : boundNames.length) !== null && _a !== void 0 ? _a : 0) > 0) {
            switch (kind) {
                case typescript.SyntaxKind.Identifier: {
                    const name = (_b = boundNames[0]) === null || _b === void 0 ? void 0 : _b.GetValue(ctx);
                    if (envRec !== void 0) {
                        envRec.InitializeBinding(ctx, name, value);
                        return realm['[[Intrinsics]]'].undefined;
                    }
                    else {
                        const lhs = realm.ResolveBinding(name);
                        if (lhs.isAbrupt) {
                            return lhs.enrichWith(ctx, this);
                        }
                        return lhs.PutValue(ctx, value).enrichWith(ctx, this);
                    }
                }
                case typescript.SyntaxKind.ObjectBindingPattern:
                    bindingName.InitializeBinding(ctx, value, envRec);
                    break;
                case typescript.SyntaxKind.ArrayBindingPattern:
                    break;
            }
        }
        return ctx.Realm['[[Intrinsics]]'].empty;
    }
}
function $variableDeclarationList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = new $VariableDeclaration(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
class $VariableDeclarationList {
    get $kind() { return typescript.SyntaxKind.VariableDeclarationList; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.VariableDeclarationList`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.isLexical = (node.flags & (typescript.NodeFlags.Const | typescript.NodeFlags.Let)) > 0;
        this.IsConstantDeclaration = (node.flags & typescript.NodeFlags.Const) > 0;
        if (hasBit(ctx, 4)) {
            this.combinedModifierFlags = parent.modifierFlags;
        }
        else {
            this.combinedModifierFlags = typescript.ModifierFlags.None;
        }
        if (hasBit(node.flags, typescript.NodeFlags.Const)) {
            ctx |= 8192;
        }
        else if (hasBit(node.flags, typescript.NodeFlags.Let)) {
            ctx |= 16384;
        }
        else {
            ctx |= 32768;
        }
        const $declarations = this.$declarations = $variableDeclarationList(node.declarations, this, ctx);
        this.BoundNames = $declarations.flatMap(getBoundNames);
        this.VarDeclaredNames = $declarations.flatMap(getVarDeclaredNames);
        this.VarScopedDeclarations = $declarations.flatMap(getVarScopedDeclarations);
    }
}
class $Block {
    get $kind() { return typescript.SyntaxKind.Block; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.Block`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const $statements = this.$statements = $$tsStatementList(node.statements, this, ctx);
        const LexicallyDeclaredNames = this.LexicallyDeclaredNames = [];
        const LexicallyScopedDeclarations = this.LexicallyScopedDeclarations = [];
        const TopLevelLexicallyDeclaredNames = this.TopLevelLexicallyDeclaredNames = [];
        const TopLevelLexicallyScopedDeclarations = this.TopLevelLexicallyScopedDeclarations = [];
        const TopLevelVarDeclaredNames = this.TopLevelVarDeclaredNames = [];
        const TopLevelVarScopedDeclarations = this.TopLevelVarScopedDeclarations = [];
        const VarDeclaredNames = this.VarDeclaredNames = [];
        const VarScopedDeclarations = this.VarScopedDeclarations = [];
        const len = $statements.length;
        let $statement;
        for (let i = 0; i < len; ++i) {
            $statement = $statements[i];
            switch ($statement.$kind) {
                case typescript.SyntaxKind.FunctionDeclaration:
                    LexicallyDeclaredNames.push(...$statement.BoundNames);
                    LexicallyScopedDeclarations.push($statement);
                    TopLevelVarDeclaredNames.push(...$statement.BoundNames);
                    TopLevelVarScopedDeclarations.push($statement);
                    break;
                case typescript.SyntaxKind.ClassDeclaration:
                    LexicallyDeclaredNames.push(...$statement.BoundNames);
                    LexicallyScopedDeclarations.push($statement);
                    TopLevelLexicallyDeclaredNames.push(...$statement.BoundNames);
                    TopLevelLexicallyScopedDeclarations.push($statement);
                    break;
                case typescript.SyntaxKind.VariableStatement:
                    if ($statement.isLexical) {
                        LexicallyDeclaredNames.push(...$statement.BoundNames);
                        LexicallyScopedDeclarations.push($statement);
                        TopLevelLexicallyDeclaredNames.push(...$statement.BoundNames);
                        TopLevelLexicallyScopedDeclarations.push($statement);
                    }
                    else {
                        TopLevelVarDeclaredNames.push(...$statement.VarDeclaredNames);
                        TopLevelVarScopedDeclarations.push(...$statement.VarScopedDeclarations);
                        VarDeclaredNames.push(...$statement.VarDeclaredNames);
                        VarScopedDeclarations.push(...$statement.VarScopedDeclarations);
                    }
                    break;
                case typescript.SyntaxKind.LabeledStatement:
                    LexicallyDeclaredNames.push(...$statement.LexicallyDeclaredNames);
                    LexicallyScopedDeclarations.push(...$statement.LexicallyScopedDeclarations);
                    TopLevelVarDeclaredNames.push(...$statement.TopLevelVarDeclaredNames);
                    TopLevelVarScopedDeclarations.push(...$statement.TopLevelVarScopedDeclarations);
                    VarDeclaredNames.push(...$statement.VarDeclaredNames);
                    VarScopedDeclarations.push(...$statement.VarScopedDeclarations);
                    break;
                case typescript.SyntaxKind.Block:
                case typescript.SyntaxKind.IfStatement:
                case typescript.SyntaxKind.DoStatement:
                case typescript.SyntaxKind.WhileStatement:
                case typescript.SyntaxKind.ForStatement:
                case typescript.SyntaxKind.ForInStatement:
                case typescript.SyntaxKind.ForOfStatement:
                case typescript.SyntaxKind.WithStatement:
                case typescript.SyntaxKind.SwitchStatement:
                case typescript.SyntaxKind.TryStatement:
                    TopLevelVarDeclaredNames.push(...$statement.VarDeclaredNames);
                    TopLevelVarScopedDeclarations.push(...$statement.VarScopedDeclarations);
                    VarDeclaredNames.push(...$statement.VarDeclaredNames);
                    VarScopedDeclarations.push(...$statement.VarScopedDeclarations);
            }
        }
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const $statements = this.$statements;
        if ($statements.length === 0) {
            return intrinsics.empty;
        }
        const oldEnv = ctx.LexicalEnvironment;
        const blockEnv = ctx.LexicalEnvironment = new $DeclarativeEnvRec(this.logger, realm, oldEnv);
        const $BlockDeclarationInstantiationResult = BlockDeclarationInstantiation(ctx, this.LexicallyScopedDeclarations, blockEnv);
        if ($BlockDeclarationInstantiationResult.isAbrupt) {
            return $BlockDeclarationInstantiationResult;
        }
        realm.stack.push(ctx);
        const blockValue = evaluateStatementList(ctx, $statements);
        realm.stack.pop();
        ctx.LexicalEnvironment = oldEnv;
        return blockValue;
    }
}
class $EmptyStatement {
    get $kind() { return typescript.SyntaxKind.EmptyStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.EmptyStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $ExpressionStatement {
    get $kind() { return typescript.SyntaxKind.ExpressionStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ExpressionStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return this.$expression.Evaluate(ctx).GetValue(ctx).enrichWith(ctx, this);
    }
}
class $IfStatement {
    get $kind() { return typescript.SyntaxKind.IfStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.IfStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        const $thenStatement = this.$thenStatement = $$esLabelledItem(node.thenStatement, this, ctx, -1);
        if (node.elseStatement === void 0) {
            this.$elseStatement = void 0;
            this.VarDeclaredNames = $thenStatement.VarDeclaredNames;
            this.VarScopedDeclarations = $thenStatement.VarScopedDeclarations;
        }
        else {
            const $elseStatement = this.$elseStatement = $$esLabelledItem(node.elseStatement, this, ctx, -1);
            this.VarDeclaredNames = [
                ...$thenStatement.VarDeclaredNames,
                ...$elseStatement.VarDeclaredNames,
            ];
            this.VarScopedDeclarations = [
                ...$thenStatement.VarScopedDeclarations,
                ...$elseStatement.VarScopedDeclarations,
            ];
        }
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const { $expression, $thenStatement, $elseStatement } = this;
        const exprRef = $expression.Evaluate(ctx);
        const exprValue = exprRef.GetValue(ctx).ToBoolean(ctx);
        if ($elseStatement !== undefined) {
            let stmtCompletion;
            if (exprValue.is(intrinsics.true)) {
                stmtCompletion = evaluateStatement(ctx, $thenStatement);
            }
            else {
                stmtCompletion = evaluateStatement(ctx, $elseStatement);
            }
            stmtCompletion.UpdateEmpty(intrinsics.undefined);
            return stmtCompletion;
        }
        else {
            let stmtCompletion;
            if (exprValue.is(intrinsics.false)) {
                return new $Undefined(realm);
            }
            else {
                stmtCompletion = evaluateStatement(ctx, $thenStatement);
                stmtCompletion.UpdateEmpty(intrinsics.undefined);
                return stmtCompletion;
            }
        }
    }
}
class $DoStatement {
    get $kind() { return typescript.SyntaxKind.DoStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.DoStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        const $statement = this.$statement = $$esLabelledItem(node.statement, this, ctx, -1);
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        this.VarDeclaredNames = $statement.VarDeclaredNames;
        this.VarScopedDeclarations = $statement.VarScopedDeclarations;
    }
    EvaluateLabelled(ctx, labelSet) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.EvaluateLabelled(#${ctx.id})`);
        const expr = this.$expression;
        const stmt = this.$statement;
        let V = intrinsics.undefined;
        while (true) {
            const stmtResult = evaluateStatement(ctx, stmt);
            if ($LoopContinues(ctx, stmtResult, labelSet).isFalsey) {
                return stmtResult.UpdateEmpty(V);
            }
            if (!stmtResult.isEmpty) {
                V = stmtResult;
            }
            const exprRef = expr.Evaluate(ctx);
            const exprValue = exprRef.GetValue(ctx);
            if (exprValue.isAbrupt) {
                return exprValue.enrichWith(ctx, this);
            }
            const bool = exprValue.ToBoolean(ctx);
            if (bool.isAbrupt) {
                return bool.enrichWith(ctx, this);
            }
            if (bool.isFalsey) {
                return V.ToCompletion(1, intrinsics.empty);
            }
        }
    }
}
class $WhileStatement {
    get $kind() { return typescript.SyntaxKind.WhileStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.WhileStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        const $statement = this.$statement = $$esLabelledItem(node.statement, this, ctx, -1);
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        this.VarDeclaredNames = $statement.VarDeclaredNames;
        this.VarScopedDeclarations = $statement.VarScopedDeclarations;
    }
    EvaluateLabelled(ctx, labelSet) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.EvaluateLabelled(#${ctx.id})`);
        const expr = this.$expression;
        const stmt = this.$statement;
        let V = intrinsics.undefined;
        while (true) {
            const exprRef = expr.Evaluate(ctx);
            const exprValue = exprRef.GetValue(ctx);
            if (exprValue.isAbrupt) {
                return exprValue.enrichWith(ctx, this);
            }
            const bool = exprValue.ToBoolean(ctx);
            if (bool.isAbrupt) {
                return bool.enrichWith(ctx, this);
            }
            if (bool.isFalsey) {
                return V.ToCompletion(1, intrinsics.empty);
            }
            const stmtResult = evaluateStatement(ctx, stmt);
            if ($LoopContinues(ctx, stmtResult, labelSet).isFalsey) {
                return stmtResult.UpdateEmpty(V);
            }
            if (!stmtResult.isEmpty) {
                V = stmtResult;
            }
        }
    }
}
class $ForStatement {
    get $kind() { return typescript.SyntaxKind.ForStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ForStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.$condition = $assignmentExpression(node.condition, this, ctx, -1);
        this.$incrementor = $assignmentExpression(node.incrementor, this, ctx, -1);
        const $statement = this.$statement = $$esLabelledItem(node.statement, this, ctx, -1);
        if (node.initializer === void 0) {
            this.$initializer = void 0;
            this.VarDeclaredNames = $statement.VarDeclaredNames;
            this.VarScopedDeclarations = $statement.VarScopedDeclarations;
        }
        else {
            if (node.initializer.kind === typescript.SyntaxKind.VariableDeclarationList) {
                const $initializer = this.$initializer = new $VariableDeclarationList(node.initializer, this, ctx);
                if ($initializer.isLexical) {
                    this.VarDeclaredNames = $statement.VarDeclaredNames;
                    this.VarScopedDeclarations = $statement.VarScopedDeclarations;
                }
                else {
                    this.VarDeclaredNames = [
                        ...$initializer.VarDeclaredNames,
                        ...$statement.VarDeclaredNames,
                    ];
                    this.VarScopedDeclarations = [
                        ...$initializer.VarScopedDeclarations,
                        ...$statement.VarScopedDeclarations,
                    ];
                }
            }
            else {
                this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
                this.VarDeclaredNames = $statement.VarDeclaredNames;
                this.VarScopedDeclarations = $statement.VarScopedDeclarations;
            }
        }
    }
    EvaluateLabelled(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.EvaluateLabelled(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $ForInStatement {
    get $kind() { return typescript.SyntaxKind.ForInStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ForInStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        const $statement = this.$statement = $$esLabelledItem(node.statement, this, ctx, -1);
        if (node.initializer.kind === typescript.SyntaxKind.VariableDeclarationList) {
            const $initializer = this.$initializer = new $VariableDeclarationList(node.initializer, this, ctx);
            if ($initializer.isLexical) {
                this.BoundNames = $initializer.BoundNames;
                this.VarDeclaredNames = $statement.VarDeclaredNames;
                this.VarScopedDeclarations = $statement.VarScopedDeclarations;
            }
            else {
                this.BoundNames = kernel.emptyArray;
                this.VarDeclaredNames = [
                    ...$initializer.VarDeclaredNames,
                    ...$statement.VarDeclaredNames,
                ];
                this.VarScopedDeclarations = [
                    ...$initializer.VarScopedDeclarations,
                    ...$statement.VarScopedDeclarations,
                ];
            }
        }
        else {
            this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
            this.BoundNames = kernel.emptyArray;
            this.VarDeclaredNames = $statement.VarDeclaredNames;
            this.VarScopedDeclarations = $statement.VarScopedDeclarations;
        }
    }
    EvaluateLabelled(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.EvaluateLabelled(#${ctx.id})`);
        return intrinsics.empty;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $ForOfStatement {
    get $kind() { return typescript.SyntaxKind.ForOfStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ForOfStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        const $statement = this.$statement = $$esLabelledItem(node.statement, this, ctx, -1);
        if (node.initializer.kind === typescript.SyntaxKind.VariableDeclarationList) {
            const $initializer = this.$initializer = new $VariableDeclarationList(node.initializer, this, ctx);
            if ($initializer.isLexical) {
                this.BoundNames = $initializer.BoundNames;
                this.VarDeclaredNames = $statement.VarDeclaredNames;
                this.VarScopedDeclarations = $statement.VarScopedDeclarations;
            }
            else {
                this.BoundNames = kernel.emptyArray;
                this.VarDeclaredNames = [
                    ...$initializer.VarDeclaredNames,
                    ...$statement.VarDeclaredNames,
                ];
                this.VarScopedDeclarations = [
                    ...$initializer.VarScopedDeclarations,
                    ...$statement.VarScopedDeclarations,
                ];
            }
        }
        else {
            this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
            this.BoundNames = kernel.emptyArray;
            this.VarDeclaredNames = $statement.VarDeclaredNames;
            this.VarScopedDeclarations = $statement.VarScopedDeclarations;
        }
    }
    EvaluateLabelled(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.EvaluateLabelled(#${ctx.id})`);
        return intrinsics.empty;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $ContinueStatement {
    get $kind() { return typescript.SyntaxKind.ContinueStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ContinueStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.$label = $identifier(node.label, this, ctx | 2048, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        if (this.$label === void 0) {
            return new $Empty(realm, 3, intrinsics.empty, this);
        }
        return new $Empty(realm, 3, this.$label.StringValue, this);
    }
}
class $BreakStatement {
    get $kind() { return typescript.SyntaxKind.BreakStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.BreakStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.$label = $identifier(node.label, this, ctx | 2048, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        if (this.$label === void 0) {
            return new $Empty(realm, 2, intrinsics.empty, this);
        }
        return new $Empty(realm, 2, this.$label.StringValue, this);
    }
}
class $ReturnStatement {
    get $kind() { return typescript.SyntaxKind.ReturnStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ReturnStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        if (node.expression === void 0) {
            this.$expression = void 0;
        }
        else {
            this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        }
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        if (this.$expression === void 0) {
            return new $Undefined(realm, 4);
        }
        const exprRef = this.$expression.Evaluate(ctx);
        const exprValue = exprRef.GetValue(ctx);
        if (exprValue.isAbrupt) {
            return exprValue.enrichWith(ctx, this);
        }
        return exprValue.ToCompletion(4, intrinsics.empty);
    }
}
class $WithStatement {
    get $kind() { return typescript.SyntaxKind.WithStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.WithStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        const $statement = this.$statement = $$esLabelledItem(node.statement, this, ctx, -1);
        this.VarDeclaredNames = $statement.VarDeclaredNames;
        this.VarScopedDeclarations = $statement.VarScopedDeclarations;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $SwitchStatement {
    get $kind() { return typescript.SyntaxKind.SwitchStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.SwitchStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        const $caseBlock = this.$caseBlock = new $CaseBlock(node.caseBlock, this, ctx);
        this.LexicallyDeclaredNames = $caseBlock.LexicallyDeclaredNames;
        this.LexicallyScopedDeclarations = $caseBlock.LexicallyScopedDeclarations;
        this.VarDeclaredNames = $caseBlock.VarDeclaredNames;
        this.VarScopedDeclarations = $caseBlock.VarScopedDeclarations;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const realm = ctx.Realm;
        const switchValue = this.$expression.Evaluate(ctx).GetValue(ctx);
        if (switchValue.isAbrupt) {
            return switchValue.enrichWith(ctx, this);
        }
        const oldEnv = ctx.LexicalEnvironment;
        const blockEnv = ctx.LexicalEnvironment = new $DeclarativeEnvRec(this.logger, realm, oldEnv);
        const $BlockDeclarationInstantiationResult = BlockDeclarationInstantiation(ctx, this.LexicallyScopedDeclarations, blockEnv);
        if ($BlockDeclarationInstantiationResult.isAbrupt) {
            return $BlockDeclarationInstantiationResult;
        }
        realm.stack.push(ctx);
        const R = this.EvaluateCaseBlock(ctx, switchValue);
        realm.stack.pop();
        ctx.LexicalEnvironment = oldEnv;
        return R;
    }
    EvaluateCaseBlock(ctx, switchValue) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const { $caseBlock: { $clauses: clauses } } = this;
        const { undefined: $undefined } = realm['[[Intrinsics]]'];
        if (clauses.length === 0) {
            return new $Undefined(realm);
        }
        let V = $undefined;
        const defaultClauseIndex = clauses.findIndex((clause) => clause.$kind === typescript.SyntaxKind.DefaultClause);
        class CaseClausesEvaluationResult {
            constructor(result, found, isAbrupt) {
                this.result = result;
                this.found = found;
                this.isAbrupt = isAbrupt;
            }
        }
        const evaluateCaseClauses = (inclusiveStartIndex, exclusiveEndIndex, found = false) => {
            for (let i = inclusiveStartIndex; i < exclusiveEndIndex; i++) {
                const C = clauses[i];
                if (!found) {
                    found = this.IsCaseClauseSelected(ctx, C, switchValue);
                }
                if (found) {
                    const R = evaluateStatementList(ctx, C.$statements);
                    if (R.hasValue) {
                        V = R;
                    }
                    if (R.isAbrupt) {
                        return new CaseClausesEvaluationResult(R.enrichWith(ctx, this).UpdateEmpty(V), found, true);
                    }
                }
            }
            return new CaseClausesEvaluationResult(V.ToCompletion(1, intrinsics.empty), found, false);
        };
        if (defaultClauseIndex === -1) {
            return evaluateCaseClauses(0, clauses.length).result;
        }
        let { result, found, isAbrupt } = evaluateCaseClauses(0, defaultClauseIndex);
        if (isAbrupt) {
            return result;
        }
        if (!found) {
            ({ result, isAbrupt, found } = evaluateCaseClauses(defaultClauseIndex + 1, clauses.length));
            if (isAbrupt || found) {
                return result;
            }
        }
        ({ result, isAbrupt } = evaluateCaseClauses(defaultClauseIndex, defaultClauseIndex + 1, true));
        if (isAbrupt) {
            return result;
        }
        return evaluateCaseClauses(defaultClauseIndex + 1, clauses.length, true).result;
    }
    IsCaseClauseSelected(ctx, clause, switchValue) {
        ctx.checkTimeout();
        return clause.$expression.Evaluate(ctx).GetValue(ctx)['[[Value]]'] === switchValue['[[Value]]'];
    }
}
class $LabeledStatement {
    get $kind() { return typescript.SyntaxKind.LabeledStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.LabeledStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.TopLevelLexicallyDeclaredNames = kernel.emptyArray;
        this.TopLevelLexicallyScopedDeclarations = kernel.emptyArray;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        this.$label = $identifier(node.label, this, ctx | 1024, -1);
        const $statement = this.$statement = $$esLabelledItem(node.statement, this, ctx, -1);
        if ($statement.$kind === typescript.SyntaxKind.FunctionDeclaration) {
            this.LexicallyDeclaredNames = $statement.BoundNames;
            this.LexicallyScopedDeclarations = [$statement];
            this.TopLevelVarDeclaredNames = $statement.BoundNames;
            this.TopLevelVarScopedDeclarations = [$statement];
            this.VarDeclaredNames = kernel.emptyArray;
            this.VarScopedDeclarations = kernel.emptyArray;
        }
        else {
            this.LexicallyDeclaredNames = kernel.emptyArray;
            this.LexicallyScopedDeclarations = kernel.emptyArray;
            if ($statement.$kind === typescript.SyntaxKind.LabeledStatement) {
                this.TopLevelVarDeclaredNames = $statement.TopLevelVarDeclaredNames;
                this.TopLevelVarScopedDeclarations = $statement.TopLevelVarScopedDeclarations;
            }
            else {
                this.TopLevelVarDeclaredNames = $statement.VarDeclaredNames;
                this.TopLevelVarScopedDeclarations = $statement.VarScopedDeclarations;
            }
            this.VarDeclaredNames = $statement.VarDeclaredNames;
            this.VarScopedDeclarations = $statement.VarScopedDeclarations;
        }
    }
    EvaluateLabelled(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.EvaluateLabelled(#${ctx.id})`);
        return intrinsics.undefined;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $ThrowStatement {
    get $kind() { return typescript.SyntaxKind.ThrowStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ThrowStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const exprRef = this.$expression.Evaluate(ctx);
        const exprValue = exprRef.GetValue(ctx);
        if (exprValue.isAbrupt) {
            return exprValue.enrichWith(ctx, this);
        }
        return exprValue.ToCompletion(5, intrinsics.empty);
    }
}
class $TryStatement {
    get $kind() { return typescript.SyntaxKind.TryStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.TryStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        const $tryBlock = this.$tryBlock = new $Block(node.tryBlock, this, ctx, -1);
        if (node.catchClause === void 0) {
            this.$catchClause = void 0;
            const $finallyBlock = this.$finallyBlock = new $Block(node.finallyBlock, this, ctx, -1);
            this.VarDeclaredNames = [
                ...$tryBlock.VarDeclaredNames,
                ...$finallyBlock.VarDeclaredNames,
            ];
            this.VarScopedDeclarations = [
                ...$tryBlock.VarScopedDeclarations,
                ...$finallyBlock.VarScopedDeclarations,
            ];
        }
        else if (node.finallyBlock === void 0) {
            const $catchClause = this.$catchClause = new $CatchClause(node.catchClause, this, ctx);
            this.$finallyBlock = void 0;
            this.VarDeclaredNames = [
                ...$tryBlock.VarDeclaredNames,
                ...$catchClause.VarDeclaredNames,
            ];
            this.VarScopedDeclarations = [
                ...$tryBlock.VarScopedDeclarations,
                ...$catchClause.VarScopedDeclarations,
            ];
        }
        else {
            const $catchClause = this.$catchClause = new $CatchClause(node.catchClause, this, ctx);
            const $finallyBlock = this.$finallyBlock = new $Block(node.finallyBlock, this, ctx, -1);
            this.VarDeclaredNames = [
                ...$tryBlock.VarDeclaredNames,
                ...$catchClause.VarDeclaredNames,
                ...$finallyBlock.VarDeclaredNames,
            ];
            this.VarScopedDeclarations = [
                ...$tryBlock.VarScopedDeclarations,
                ...$catchClause.VarScopedDeclarations,
                ...$finallyBlock.VarScopedDeclarations,
            ];
        }
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const realm = ctx.Realm;
        let result = this.$tryBlock.Evaluate(ctx);
        if (this.$catchClause !== void 0) {
            result = result['[[Type]]'] === 5 ? this.EvaluateCatchClause(ctx, result.GetValue(ctx)) : result;
        }
        const $finallyBlock = this.$finallyBlock;
        if ($finallyBlock !== void 0) {
            const F = $finallyBlock.Evaluate(ctx);
            result = F['[[Type]]'] !== 1 ? F : result;
        }
        result.UpdateEmpty(realm['[[Intrinsics]]'].undefined);
        return result;
    }
    EvaluateCatchClause(ctx, thrownValue) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const catchClause = this.$catchClause;
        const varDeclarations = catchClause === null || catchClause === void 0 ? void 0 : catchClause.$variableDeclaration;
        const hasCatchParamteres = varDeclarations !== void 0;
        const oldEnv = ctx.LexicalEnvironment;
        if (hasCatchParamteres) {
            ctx.LexicalEnvironment = new $DeclarativeEnvRec(this.logger, realm, oldEnv);
            catchClause === null || catchClause === void 0 ? void 0 : catchClause.CreateBinding(ctx, realm);
            realm.stack.push(ctx);
            const status = varDeclarations === null || varDeclarations === void 0 ? void 0 : varDeclarations.InitializeBinding(ctx, thrownValue);
            if (status === null || status === void 0 ? void 0 : status.isAbrupt) {
                realm.stack.pop();
                ctx.LexicalEnvironment = oldEnv;
                return status;
            }
        }
        const B = catchClause === null || catchClause === void 0 ? void 0 : catchClause.$block.Evaluate(ctx);
        if (hasCatchParamteres) {
            realm.stack.pop();
            ctx.LexicalEnvironment = oldEnv;
        }
        return B;
    }
}
class $DebuggerStatement {
    get $kind() { return typescript.SyntaxKind.DebuggerStatement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.DebuggerStatement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
function $$clauseList(nodes, parent, ctx) {
    const len = nodes.length;
    let node;
    const $nodes = [];
    for (let i = 0; i < len; ++i) {
        node = nodes[i];
        switch (node.kind) {
            case typescript.SyntaxKind.CaseClause:
                $nodes[i] = new $CaseClause(node, parent, ctx, i);
                break;
            case typescript.SyntaxKind.DefaultClause:
                $nodes[i] = new $DefaultClause(node, parent, ctx, i);
                break;
        }
    }
    return $nodes;
}
class $CaseBlock {
    get $kind() { return typescript.SyntaxKind.CaseBlock; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.CaseBlock`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const $clauses = this.$clauses = $$clauseList(node.clauses, this, ctx);
        this.LexicallyDeclaredNames = $clauses.flatMap(getLexicallyDeclaredNames);
        this.LexicallyScopedDeclarations = $clauses.flatMap(getLexicallyScopedDeclarations);
        this.VarDeclaredNames = $clauses.flatMap(getVarDeclaredNames);
        this.VarScopedDeclarations = $clauses.flatMap(getVarScopedDeclarations);
    }
}
class $CaseClause {
    get $kind() { return typescript.SyntaxKind.CaseClause; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.CaseClause`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        const $statements = this.$statements = $$tsStatementList(node.statements, this, ctx);
        this.LexicallyDeclaredNames = $statements.flatMap(getLexicallyDeclaredNames);
        this.LexicallyScopedDeclarations = $statements.flatMap(getLexicallyScopedDeclarations);
        this.VarDeclaredNames = $statements.flatMap(getVarDeclaredNames);
        this.VarScopedDeclarations = $statements.flatMap(getVarScopedDeclarations);
    }
}
class $DefaultClause {
    get $kind() { return typescript.SyntaxKind.DefaultClause; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.DefaultClause`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const $statements = this.$statements = $$tsStatementList(node.statements, this, ctx);
        this.LexicallyDeclaredNames = $statements.flatMap(getLexicallyDeclaredNames);
        this.LexicallyScopedDeclarations = $statements.flatMap(getLexicallyScopedDeclarations);
        this.VarDeclaredNames = $statements.flatMap(getVarDeclaredNames);
        this.VarScopedDeclarations = $statements.flatMap(getVarScopedDeclarations);
    }
}
class $CatchClause {
    get $kind() { return typescript.SyntaxKind.CatchClause; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.CatchClause`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        ctx |= 32;
        if (node.variableDeclaration === void 0) {
            this.$variableDeclaration = void 0;
        }
        else {
            this.$variableDeclaration = new $VariableDeclaration(node.variableDeclaration, this, ctx, -1);
        }
        const $block = this.$block = new $Block(node.block, this, ctx, -1);
        this.VarDeclaredNames = $block.VarDeclaredNames;
        this.VarScopedDeclarations = $block.VarScopedDeclarations;
    }
    CreateBinding(ctx, realm) {
        var _a, _b;
        ctx.checkTimeout();
        for (const argName of (_b = (_a = this.$variableDeclaration) === null || _a === void 0 ? void 0 : _a.BoundNames) !== null && _b !== void 0 ? _b : []) {
            ctx.LexicalEnvironment.CreateMutableBinding(ctx, argName, realm['[[Intrinsics]]'].false);
        }
    }
}

class $MethodDeclaration {
    get $kind() { return typescript.SyntaxKind.MethodDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.MethodDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        const $name = this.$name = $$propertyName(node.name, this, ctx | 512, -1);
        this.$parameters = new $FormalParameterList(node.parameters, this, ctx);
        const $body = this.$body = new $Block(node.body, this, ctx, -1);
        this.PropName = $name.PropName;
        this.IsStatic = hasBit(modifierFlags, typescript.ModifierFlags.Static);
        this.LexicallyDeclaredNames = $body.TopLevelLexicallyDeclaredNames;
        this.LexicallyScopedDeclarations = $body.TopLevelLexicallyScopedDeclarations;
        this.VarDeclaredNames = $body.TopLevelVarDeclaredNames;
        this.VarScopedDeclarations = $body.TopLevelVarScopedDeclarations;
        if (!hasBit(modifierFlags, typescript.ModifierFlags.Async)) {
            if (node.asteriskToken === void 0) {
                this.functionKind = 0;
            }
            else {
                this.functionKind = 4;
            }
        }
        else if (node.asteriskToken === void 0) {
            this.functionKind = 8;
        }
        else {
            this.functionKind = 12;
        }
    }
    DefineMethod(ctx, object) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const propKey = this.$name.EvaluatePropName(ctx);
        if (propKey.isAbrupt) {
            return propKey.enrichWith(ctx, this);
        }
        const strict = intrinsics.true;
        const scope = ctx.LexicalEnvironment;
        const functionPrototype = intrinsics['%FunctionPrototype%'];
        const closure = $Function.FunctionCreate(ctx, 'method', this, scope, strict, functionPrototype);
        closure['[[HomeObject]]'] = object;
        closure['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return new MethodDefinitionRecord(propKey, closure);
    }
    EvaluatePropertyDefinition(ctx, object, enumerable) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const methodDef = this.DefineMethod(ctx, object);
        if (methodDef.isAbrupt) {
            return methodDef.enrichWith(ctx, this);
        }
        methodDef['[[Closure]]'].SetFunctionName(ctx, methodDef['[[Key]]']);
        const desc = new $PropertyDescriptor(realm, methodDef['[[Key]]'], {
            '[[Value]]': methodDef['[[Closure]]'],
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': enumerable,
            '[[Configurable]]': intrinsics.true,
        });
        return $DefinePropertyOrThrow(ctx, object, methodDef['[[Key]]'], desc).enrichWith(ctx, this);
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        ctx.checkTimeout();
        return $FunctionDeclaration.prototype.EvaluateBody.call(this, ctx, functionObject, argumentsList);
    }
}
class $GetAccessorDeclaration {
    get $kind() { return typescript.SyntaxKind.GetAccessor; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.GetAccessorDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.functionKind = 0;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        const $name = this.$name = $$propertyName(node.name, this, ctx | 512, -1);
        this.$parameters = new $FormalParameterList(node.parameters, this, ctx);
        const $body = this.$body = new $Block(node.body, this, ctx, -1);
        this.PropName = $name.PropName;
        this.IsStatic = hasBit(modifierFlags, typescript.ModifierFlags.Static);
        this.LexicallyDeclaredNames = $body.TopLevelLexicallyDeclaredNames;
        this.LexicallyScopedDeclarations = $body.TopLevelLexicallyScopedDeclarations;
        this.VarDeclaredNames = $body.TopLevelVarDeclaredNames;
        this.VarScopedDeclarations = $body.TopLevelVarScopedDeclarations;
    }
    EvaluatePropertyDefinition(ctx, object, enumerable) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const propKey = this.$name.EvaluatePropName(ctx);
        if (propKey.isAbrupt) {
            return propKey.enrichWith(ctx, this);
        }
        const strict = intrinsics.true;
        const scope = ctx.LexicalEnvironment;
        const closure = $Function.FunctionCreate(ctx, 'method', this, scope, strict);
        closure['[[HomeObject]]'] = object;
        closure.SetFunctionName(ctx, propKey, intrinsics.$get);
        closure['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        const desc = new $PropertyDescriptor(realm, propKey, {
            '[[Get]]': closure,
            '[[Enumerable]]': enumerable,
            '[[Configurable]]': intrinsics.true,
        });
        return $DefinePropertyOrThrow(ctx, object, propKey, desc).enrichWith(ctx, this);
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        ctx.checkTimeout();
        return $FunctionDeclaration.prototype.EvaluateBody.call(this, ctx, functionObject, argumentsList);
    }
}
class $SetAccessorDeclaration {
    get $kind() { return typescript.SyntaxKind.SetAccessor; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.SetAccessorDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.functionKind = 0;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        const $name = this.$name = $$propertyName(node.name, this, ctx | 512, -1);
        this.$parameters = new $FormalParameterList(node.parameters, this, ctx);
        const $body = this.$body = new $Block(node.body, this, ctx, -1);
        this.PropName = $name.PropName;
        this.IsStatic = hasBit(modifierFlags, typescript.ModifierFlags.Static);
        this.LexicallyDeclaredNames = $body.TopLevelLexicallyDeclaredNames;
        this.LexicallyScopedDeclarations = $body.TopLevelLexicallyScopedDeclarations;
        this.VarDeclaredNames = $body.TopLevelVarDeclaredNames;
        this.VarScopedDeclarations = $body.TopLevelVarScopedDeclarations;
    }
    EvaluatePropertyDefinition(ctx, object, enumerable) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const propKey = this.$name.EvaluatePropName(ctx);
        if (propKey.isAbrupt) {
            return propKey.enrichWith(ctx, this);
        }
        const strict = intrinsics.true;
        const scope = ctx.LexicalEnvironment;
        const closure = $Function.FunctionCreate(ctx, 'method', this, scope, strict);
        closure['[[HomeObject]]'] = object;
        closure.SetFunctionName(ctx, propKey, intrinsics.$set);
        closure['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        const desc = new $PropertyDescriptor(realm, propKey, {
            '[[Set]]': closure,
            '[[Enumerable]]': enumerable,
            '[[Configurable]]': intrinsics.true,
        });
        return $DefinePropertyOrThrow(ctx, object, propKey, desc).enrichWith(ctx, this);
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        ctx.checkTimeout();
        return $FunctionDeclaration.prototype.EvaluateBody.call(this, ctx, functionObject, argumentsList);
    }
}

class $Decorator {
    get $kind() { return typescript.SyntaxKind.Decorator; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.Decorator`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $LHSExpression(node.expression, this, ctx, -1);
    }
}
class $ThisExpression {
    get $kind() { return typescript.SyntaxKind.ThisKeyword; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ThisExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return realm.ResolveThisBinding().enrichWith(ctx, this);
    }
}
class $SuperExpression {
    get $kind() { return typescript.SyntaxKind.SuperKeyword; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.SuperExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
function $argumentOrArrayLiteralElement(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.SpreadElement:
            return new $SpreadElement(node, parent, ctx, idx);
        case typescript.SyntaxKind.OmittedExpression:
            return new $OmittedExpression(node, parent, ctx, idx);
        default:
            return $assignmentExpression(node, parent, ctx, idx);
    }
}
function $argumentOrArrayLiteralElementList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = $argumentOrArrayLiteralElement(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
class $ArrayLiteralExpression {
    get $kind() { return typescript.SyntaxKind.ArrayLiteralExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ArrayLiteralExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        this.$elements = $argumentOrArrayLiteralElementList(node.elements, this, ctx);
    }
    AccumulateArray(ctx, array, nextIndex) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const elements = this.$elements;
        let el;
        let padding = 0;
        let postIndex = intrinsics['0'];
        for (let i = 0, ii = elements.length; i < ii; ++i) {
            el = elements[i];
            switch (el.$kind) {
                case typescript.SyntaxKind.OmittedExpression: {
                    ++padding;
                    break;
                }
                case typescript.SyntaxKind.SpreadElement: {
                    const $postIndex = el.AccumulateArray(ctx, array, new $Number(realm, postIndex['[[Value]]'] + padding));
                    if ($postIndex.isAbrupt) {
                        return $postIndex.enrichWith(ctx, this);
                    }
                    postIndex = $postIndex;
                    padding = 0;
                    break;
                }
                default: {
                    const initResult = el.Evaluate(ctx);
                    const initValue = initResult.GetValue(ctx);
                    if (initValue.isAbrupt) {
                        return initValue.enrichWith(ctx, this);
                    }
                    $CreateDataProperty(ctx, array, new $Number(realm, postIndex['[[Value]]'] + padding).ToUint32(ctx).ToString(ctx), initValue);
                    postIndex = new $Number(realm, postIndex['[[Value]]'] + padding + 1);
                    padding = 0;
                    break;
                }
            }
        }
        return postIndex;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const array = new $ArrayExoticObject(realm, intrinsics['0']);
        const len = this.AccumulateArray(ctx, array, intrinsics['0']);
        if (len.isAbrupt) {
            return len.enrichWith(ctx, this);
        }
        $Set(ctx, array, intrinsics.length, len.ToUint32(ctx), intrinsics.false);
        return array;
    }
}
function $$objectLiteralElementLikeList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    let el;
    for (let i = 0; i < len; ++i) {
        el = nodes[i];
        switch (el.kind) {
            case typescript.SyntaxKind.PropertyAssignment:
                $nodes[i] = new $PropertyAssignment(el, parent, ctx, i);
                break;
            case typescript.SyntaxKind.ShorthandPropertyAssignment:
                $nodes[i] = new $ShorthandPropertyAssignment(el, parent, ctx, i);
                break;
            case typescript.SyntaxKind.SpreadAssignment:
                $nodes[i] = new $SpreadAssignment(el, parent, ctx, i);
                break;
            case typescript.SyntaxKind.MethodDeclaration:
                $nodes[i] = new $MethodDeclaration(el, parent, ctx, i);
                break;
            case typescript.SyntaxKind.GetAccessor:
                $nodes[i] = new $GetAccessorDeclaration(el, parent, ctx, i);
                break;
            case typescript.SyntaxKind.SetAccessor:
                $nodes[i] = new $SetAccessorDeclaration(el, parent, ctx, i);
                break;
        }
    }
    return $nodes;
}
class $ObjectLiteralExpression {
    get $kind() { return typescript.SyntaxKind.ObjectLiteralExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ObjectLiteralExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        this.$properties = $$objectLiteralElementLikeList(node.properties, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const obj = $Object.ObjectCreate(ctx, 'Object', intrinsics['%ObjectPrototype%']);
        for (const prop of this.$properties) {
            const $PropertyDefinitionEvaluationResult = prop.EvaluatePropertyDefinition(ctx, obj, intrinsics.true);
            if ($PropertyDefinitionEvaluationResult.isAbrupt) {
                return $PropertyDefinitionEvaluationResult.enrichWith(ctx, this);
            }
        }
        return obj;
    }
}
class $PropertyAssignment {
    get $kind() { return typescript.SyntaxKind.PropertyAssignment; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.PropertyAssignment`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        const $name = this.$name = $$propertyName(node.name, this, ctx | 512, -1);
        this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
        this.PropName = $name.PropName;
    }
    EvaluatePropertyDefinition(ctx, object, enumerable) {
        ctx.checkTimeout();
        const propKey = this.$name.EvaluatePropName(ctx);
        if (propKey.isAbrupt) {
            return propKey.enrichWith(ctx, this);
        }
        let propValue;
        if (this.$initializer instanceof $FunctionExpression && !this.$initializer.HasName) {
            const $propValue = this.$initializer.EvaluateNamed(ctx, propKey);
            if ($propValue.isAbrupt) {
                return $propValue.enrichWith(ctx, this);
            }
            propValue = $propValue;
        }
        else {
            const exprValueRef = this.$initializer.Evaluate(ctx);
            const $propValue = exprValueRef.GetValue(ctx);
            if ($propValue.isAbrupt) {
                return $propValue.enrichWith(ctx, this);
            }
            propValue = $propValue;
        }
        return $CreateDataProperty(ctx, object, propKey, propValue);
    }
}
class $ShorthandPropertyAssignment {
    get $kind() { return typescript.SyntaxKind.ShorthandPropertyAssignment; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ShorthandPropertyAssignment`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        this.$objectAssignmentInitializer = $assignmentExpression(node.objectAssignmentInitializer, this, ctx, -1);
        this.PropName = $name.PropName;
    }
    EvaluatePropertyDefinition(ctx, object, enumerable) {
        ctx.checkTimeout();
        const propName = this.$name.StringValue;
        const exprValue = this.$name.Evaluate(ctx);
        const propValue = exprValue.GetValue(ctx);
        if (propValue.isAbrupt) {
            return propValue.enrichWith(ctx, this);
        }
        return $CreateDataProperty(ctx, object, propName, propValue);
    }
}
class $SpreadAssignment {
    get $kind() { return typescript.SyntaxKind.SpreadAssignment; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.SpreadAssignment`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.PropName = empty;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    EvaluatePropertyDefinition(ctx, object, enumerable) {
        ctx.checkTimeout();
        const exprValue = this.$expression.Evaluate(ctx);
        const fromValue = exprValue.GetValue(ctx);
        if (fromValue.isAbrupt) {
            return fromValue.enrichWith(ctx, this);
        }
        const excludedNames = [];
        return $CopyDataProperties(ctx, object, fromValue, excludedNames);
    }
}
class $PropertyAccessExpression {
    get $kind() { return typescript.SyntaxKind.PropertyAccessExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.PropertyAccessExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $LHSExpression(node.expression, this, ctx, -1);
        this.$name = $identifier(node.name, this, ctx | 256, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const baseReference = this.$expression.Evaluate(ctx);
        const baseValue = baseReference.GetValue(ctx);
        if (baseValue.isAbrupt) {
            return baseValue.enrichWith(ctx, this);
        }
        if (baseValue.isNil) {
            return new $TypeError(realm, `Cannot access property ${this.$name.StringValue['[[Value]]']} on value: ${baseValue['[[Value]]']}`).enrichWith(ctx, this);
        }
        const propertyNameString = this.$name.StringValue;
        const strict = intrinsics.true;
        return new $Reference(realm, baseValue, propertyNameString, strict, intrinsics.undefined);
    }
}
class $ElementAccessExpression {
    get $kind() { return typescript.SyntaxKind.ElementAccessExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ElementAccessExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $LHSExpression(node.expression, this, ctx, -1);
        this.$argumentExpression = $assignmentExpression(node.argumentExpression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const baseReference = this.$expression.Evaluate(ctx);
        const baseValue = baseReference.GetValue(ctx);
        if (baseValue.isAbrupt) {
            return baseValue.enrichWith(ctx, this);
        }
        const propertyNameReference = this.$argumentExpression.Evaluate(ctx);
        const propertyNameValue = propertyNameReference.GetValue(ctx);
        if (propertyNameValue.isAbrupt) {
            return propertyNameValue.enrichWith(ctx, this);
        }
        if (baseValue.isNil) {
            return new $TypeError(realm, `Cannot access computed / indexed property on value: ${baseValue['[[Value]]']}`).enrichWith(ctx, this);
        }
        const propertyKey = propertyNameValue.ToPropertyKey(ctx);
        if (propertyKey.isAbrupt) {
            return propertyKey.enrichWith(ctx, this);
        }
        const strict = intrinsics.true;
        return new $Reference(realm, baseValue, propertyKey, strict, intrinsics.undefined);
    }
}
class $CallExpression {
    get $kind() { return typescript.SyntaxKind.CallExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.CallExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $LHSExpression(node.expression, this, ctx, -1);
        this.$arguments = $argumentOrArrayLiteralElementList(node.arguments, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const memberExpr = this.$expression;
        const $arguments = this.$arguments;
        const ref = memberExpr.Evaluate(ctx);
        const func = ref.GetValue(ctx);
        if (func.isAbrupt) {
            return func.enrichWith(ctx, this);
        }
        if (ref instanceof $Reference && ref.IsPropertyReference().isFalsey && ref.GetReferencedName()['[[Value]]'] === 'eval') {
            if (func.is(intrinsics['%eval%'])) ;
        }
        return $EvaluateCall(ctx, func, ref, $arguments, intrinsics.false).enrichWith(ctx, this);
    }
}
function $EvaluateCall(ctx, func, ref, $arguments, tailPosition) {
    ctx.checkTimeout();
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    let thisValue;
    if (ref instanceof $Reference) {
        if (ref.IsPropertyReference().isTruthy) {
            thisValue = ref.GetThisValue();
        }
        else {
            const refEnv = ref.GetBase();
            thisValue = refEnv.WithBaseObject(ctx);
        }
    }
    else {
        thisValue = intrinsics.undefined;
    }
    const argList = $ArgumentListEvaluation(ctx, $arguments);
    if (argList.isAbrupt) {
        return argList;
    }
    if (!func.isFunction) {
        return new $TypeError(realm, `${func} is not callable`);
    }
    const result = $Call(ctx, func, thisValue, argList);
    return result;
}
function $ArgumentListEvaluation(ctx, args) {
    ctx.checkTimeout();
    const list = new $List();
    for (const arg of args) {
        const ref = arg.Evaluate(ctx);
        if (ref.isAbrupt) {
            return ref;
        }
        const value = ref.GetValue(ctx);
        if (value.isAbrupt) {
            return value;
        }
        if (value.isList) {
            list.push(...value);
        }
        else {
            list.push(value);
        }
    }
    return list;
}
class $NewExpression {
    get $kind() { return typescript.SyntaxKind.NewExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.NewExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $LHSExpression(node.expression, this, ctx, -1);
        this.$arguments = $argumentOrArrayLiteralElementList(node.arguments, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const ref = this.$expression.Evaluate(ctx);
        const constructor = ref.GetValue(ctx);
        if (constructor.isAbrupt) {
            return constructor.enrichWith(ctx, this);
        }
        const $arguments = this.$arguments;
        let argList;
        if ($arguments.length === 0) {
            argList = new $List();
        }
        else {
            const $argList = $ArgumentListEvaluation(ctx, $arguments);
            if ($argList.isAbrupt) {
                return $argList.enrichWith(ctx, this);
            }
            argList = $argList;
        }
        if (!IsConstructor(ctx, constructor)) {
            return new $TypeError(realm, `${constructor} is not a constructor`);
        }
        return $Construct(ctx, constructor, argList, intrinsics.undefined).enrichWith(ctx, this);
    }
}
class $TaggedTemplateExpression {
    get $kind() { return typescript.SyntaxKind.TaggedTemplateExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.TaggedTemplateExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$tag = $LHSExpression(node.tag, this, ctx, -1);
        if (node.template.kind === typescript.SyntaxKind.NoSubstitutionTemplateLiteral) {
            this.$template = new $NoSubstitutionTemplateLiteral(node.template, this, ctx, -1);
        }
        else {
            this.$template = new $TemplateExpression(node.template, this, ctx, -1);
        }
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
function $$templateSpanList(nodes, parent, ctx) {
    if (nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = new $TemplateSpan(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
class $TemplateExpression {
    get $kind() { return typescript.SyntaxKind.TemplateExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.TemplateExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = false;
        this.AssignmentTargetType = 'invalid';
        this.$head = new $TemplateHead(node.head, this, ctx);
        this.$templateSpans = $$templateSpanList(node.templateSpans, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return intrinsics[''];
    }
}
class $ParenthesizedExpression {
    get $kind() { return typescript.SyntaxKind.ParenthesizedExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ParenthesizedExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        const $expression = this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
        this.CoveredParenthesizedExpression = $expression;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        return this.$expression.Evaluate(ctx).enrichWith(ctx, this);
    }
}
class $NonNullExpression {
    get $kind() { return typescript.SyntaxKind.NonNullExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.NonNullExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $LHSExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return this.$expression.Evaluate(ctx).enrichWith(ctx, this);
    }
}
class $MetaProperty {
    get $kind() { return typescript.SyntaxKind.MetaProperty; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.MetaProperty`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$name = $identifier(node.name, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $DeleteExpression {
    get $kind() { return typescript.SyntaxKind.DeleteExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.DeleteExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $unaryExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.true;
    }
}
class $TypeOfExpression {
    get $kind() { return typescript.SyntaxKind.TypeOfExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.TypeOfExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $unaryExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        let val = this.$expression.Evaluate(ctx);
        if (val instanceof $Reference && val.IsUnresolvableReference()['[[Value]]']) {
            return new $Undefined(realm);
        }
        val = val.GetValue(ctx);
        if (val.isAbrupt) {
            return val.enrichWith(ctx, this);
        }
        switch (true) {
            case val instanceof $Undefined:
                return new $String(realm, "undefined");
            case val instanceof $Boolean:
                return new $String(realm, "boolean");
            case val instanceof $Number:
                return new $String(realm, "number");
            case val instanceof $String:
                return new $String(realm, "string");
            case val instanceof $Function:
                return new $String(realm, "function");
            case val instanceof $Object:
            case val instanceof $Null:
            default:
                return new $String(realm, "object");
        }
    }
}
class $VoidExpression {
    get $kind() { return typescript.SyntaxKind.VoidExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.VoidExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $unaryExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const expr = this.$expression.Evaluate(ctx);
        const value = expr.GetValue(ctx);
        if (value.isAbrupt) {
            return value.enrichWith(ctx, this);
        }
        return intrinsics.undefined;
    }
}
class $AwaitExpression {
    get $kind() { return typescript.SyntaxKind.AwaitExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.AwaitExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $unaryExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $PrefixUnaryExpression {
    get $kind() { return typescript.SyntaxKind.PrefixUnaryExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.PrefixUnaryExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$operand = $unaryExpression(node.operand, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        switch (this.node.operator) {
            case typescript.SyntaxKind.PlusPlusToken: {
                const expr = this.$operand.Evaluate(ctx);
                if (expr.isAbrupt) {
                    return expr.enrichWith(ctx, this);
                }
                const $oldValue = expr.GetValue(ctx);
                if ($oldValue.isAbrupt) {
                    return $oldValue.enrichWith(ctx, this);
                }
                const oldValue = $oldValue.ToNumber(ctx);
                if (oldValue.isAbrupt) {
                    return oldValue.enrichWith(ctx, this);
                }
                const newValue = new $Number(realm, oldValue['[[Value]]'] + 1);
                if (!(expr instanceof $Reference)) {
                    return new $ReferenceError(realm, `Value is not assignable: ${expr}`).enrichWith(ctx, this);
                }
                const $PutValueResult = expr.PutValue(ctx, newValue);
                if ($PutValueResult.isAbrupt) {
                    return $PutValueResult.enrichWith(ctx, this);
                }
                return newValue;
            }
            case typescript.SyntaxKind.MinusMinusToken: {
                const expr = this.$operand.Evaluate(ctx);
                if (expr.isAbrupt) {
                    return expr.enrichWith(ctx, this);
                }
                const $oldValue = expr.GetValue(ctx);
                if ($oldValue.isAbrupt) {
                    return $oldValue.enrichWith(ctx, this);
                }
                const oldValue = $oldValue.ToNumber(ctx);
                if (oldValue.isAbrupt) {
                    return oldValue.enrichWith(ctx, this);
                }
                const newValue = new $Number(realm, oldValue['[[Value]]'] - 1);
                if (!(expr instanceof $Reference)) {
                    return new $ReferenceError(realm, `Value is not assignable: ${expr}`).enrichWith(ctx, this);
                }
                const $PutValueResult = expr.PutValue(ctx, newValue);
                if ($PutValueResult.isAbrupt) {
                    return $PutValueResult.enrichWith(ctx, this);
                }
                return newValue;
            }
            case typescript.SyntaxKind.PlusToken: {
                const expr = this.$operand.Evaluate(ctx);
                if (expr.isAbrupt) {
                    return expr.enrichWith(ctx, this);
                }
                const $value = expr.GetValue(ctx);
                if ($value.isAbrupt) {
                    return $value.enrichWith(ctx, this);
                }
                const value = $value.ToNumber(ctx);
                if (value.isAbrupt) {
                    return value.enrichWith(ctx, this);
                }
                return value;
            }
            case typescript.SyntaxKind.MinusToken: {
                const expr = this.$operand.Evaluate(ctx);
                if (expr.isAbrupt) {
                    return expr.enrichWith(ctx, this);
                }
                const $oldValue = expr.GetValue(ctx);
                if ($oldValue.isAbrupt) {
                    return $oldValue.enrichWith(ctx, this);
                }
                const oldValue = $oldValue.ToNumber(ctx);
                if (oldValue.isAbrupt) {
                    return oldValue.enrichWith(ctx, this);
                }
                if (oldValue.isNaN) {
                    return oldValue;
                }
                return new $Number(realm, -oldValue['[[Value]]']);
            }
            case typescript.SyntaxKind.TildeToken: {
                const expr = this.$operand.Evaluate(ctx);
                if (expr.isAbrupt) {
                    return expr.enrichWith(ctx, this);
                }
                const $oldValue = expr.GetValue(ctx);
                if ($oldValue.isAbrupt) {
                    return $oldValue.enrichWith(ctx, this);
                }
                const oldValue = $oldValue.ToInt32(ctx);
                if (oldValue.isAbrupt) {
                    return oldValue.enrichWith(ctx, this);
                }
                return new $Number(realm, ~oldValue['[[Value]]']);
            }
            case typescript.SyntaxKind.ExclamationToken: {
                const expr = this.$operand.Evaluate(ctx);
                if (expr.isAbrupt) {
                    return expr.enrichWith(ctx, this);
                }
                const $oldValue = expr.GetValue(ctx);
                if ($oldValue.isAbrupt) {
                    return $oldValue.enrichWith(ctx, this);
                }
                const oldValue = $oldValue.ToBoolean(ctx);
                if (oldValue.isAbrupt) {
                    return oldValue.enrichWith(ctx, this);
                }
                if (oldValue.isTruthy) {
                    return intrinsics.false;
                }
                return intrinsics.true;
            }
        }
    }
}
class $PostfixUnaryExpression {
    get $kind() { return typescript.SyntaxKind.PostfixUnaryExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.PostfixUnaryExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$operand = $LHSExpression(node.operand, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        switch (this.node.operator) {
            case typescript.SyntaxKind.PlusPlusToken: {
                const lhs = this.$operand.Evaluate(ctx);
                const $oldValue = lhs.GetValue(ctx);
                if ($oldValue.isAbrupt) {
                    return $oldValue.enrichWith(ctx, this);
                }
                const oldValue = $oldValue.ToNumber(ctx);
                if (oldValue.isAbrupt) {
                    return oldValue.enrichWith(ctx, this);
                }
                const newValue = new $Number(realm, oldValue['[[Value]]'] + 1);
                if (!(lhs instanceof $Reference)) {
                    return new $ReferenceError(realm, `Value is not assignable: ${lhs}`).enrichWith(ctx, this);
                }
                const $PutValueResult = lhs.PutValue(ctx, newValue);
                if ($PutValueResult.isAbrupt) {
                    return $PutValueResult.enrichWith(ctx, this);
                }
                return oldValue;
            }
            case typescript.SyntaxKind.MinusMinusToken: {
                const lhs = this.$operand.Evaluate(ctx);
                const $oldValue = lhs.GetValue(ctx);
                if ($oldValue.isAbrupt) {
                    return $oldValue.enrichWith(ctx, this);
                }
                const oldValue = $oldValue.ToNumber(ctx);
                if (oldValue.isAbrupt) {
                    return oldValue.enrichWith(ctx, this);
                }
                const newValue = new $Number(realm, oldValue['[[Value]]'] - 1);
                if (!(lhs instanceof $Reference)) {
                    return new $ReferenceError(realm, `Value is not assignable: ${lhs}`).enrichWith(ctx, this);
                }
                const $PutValueResult = lhs.PutValue(ctx, newValue);
                if ($PutValueResult.isAbrupt) {
                    return $PutValueResult.enrichWith(ctx, this);
                }
                return oldValue;
            }
        }
    }
}
class $TypeAssertion {
    get $kind() { return typescript.SyntaxKind.TypeAssertionExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.TypeAssertion`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return this.$expression.Evaluate(ctx);
    }
}
class $BinaryExpression {
    get $kind() { return typescript.SyntaxKind.BinaryExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.BinaryExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$left = $assignmentExpression(node.left, this, ctx, -1);
        this.$right = $assignmentExpression(node.right, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        switch (this.node.operatorToken.kind) {
            case typescript.SyntaxKind.AsteriskAsteriskToken: {
                const left = this.$left.Evaluate(ctx);
                const leftValue = left.GetValue(ctx);
                if (leftValue.isAbrupt) {
                    return leftValue.enrichWith(ctx, this);
                }
                const right = this.$right.Evaluate(ctx);
                const rightValue = right.GetValue(ctx);
                if (rightValue.isAbrupt) {
                    return rightValue.enrichWith(ctx, this);
                }
                const base = leftValue.ToNumber(ctx);
                if (base.isAbrupt) {
                    return base.enrichWith(ctx, this);
                }
                const exponent = rightValue.ToNumber(ctx);
                if (exponent.isAbrupt) {
                    return exponent.enrichWith(ctx, this);
                }
                return new $Number(realm, base['[[Value]]'] ** exponent['[[Value]]']);
            }
            case typescript.SyntaxKind.AsteriskToken: {
                const left = this.$left.Evaluate(ctx);
                const leftValue = left.GetValue(ctx);
                if (leftValue.isAbrupt) {
                    return leftValue.enrichWith(ctx, this);
                }
                const right = this.$right.Evaluate(ctx);
                const rightValue = right.GetValue(ctx);
                if (rightValue.isAbrupt) {
                    return rightValue.enrichWith(ctx, this);
                }
                const lnum = leftValue.ToNumber(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rightValue.ToNumber(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] * rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.SlashToken: {
                const left = this.$left.Evaluate(ctx);
                const leftValue = left.GetValue(ctx);
                if (leftValue.isAbrupt) {
                    return leftValue.enrichWith(ctx, this);
                }
                const right = this.$right.Evaluate(ctx);
                const rightValue = right.GetValue(ctx);
                if (rightValue.isAbrupt) {
                    return rightValue.enrichWith(ctx, this);
                }
                const lnum = leftValue.ToNumber(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rightValue.ToNumber(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] / rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.PercentToken: {
                const left = this.$left.Evaluate(ctx);
                const leftValue = left.GetValue(ctx);
                if (leftValue.isAbrupt) {
                    return leftValue.enrichWith(ctx, this);
                }
                const right = this.$right.Evaluate(ctx);
                const rightValue = right.GetValue(ctx);
                if (rightValue.isAbrupt) {
                    return rightValue.enrichWith(ctx, this);
                }
                const lnum = leftValue.ToNumber(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rightValue.ToNumber(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] % rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.PlusToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lprim = lval.ToPrimitive(ctx);
                if (lprim.isAbrupt) {
                    return lprim.enrichWith(ctx, this);
                }
                const rprim = rval.ToPrimitive(ctx);
                if (rprim.isAbrupt) {
                    return rprim.enrichWith(ctx, this);
                }
                if (lprim.isString || rprim.isString) {
                    const lstr = lprim.ToString(ctx);
                    if (lstr.isAbrupt) {
                        return lstr.enrichWith(ctx, this);
                    }
                    const rstr = rprim.ToString(ctx);
                    if (rstr.isAbrupt) {
                        return rstr.enrichWith(ctx, this);
                    }
                    return new $String(realm, lstr['[[Value]]'] + rstr['[[Value]]']);
                }
                const lnum = lprim.ToNumber(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rprim.ToNumber(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] + rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.MinusToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lnum = lval.ToNumber(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rval.ToNumber(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] - rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.LessThanLessThanToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lnum = lval.ToInt32(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rval.ToUint32(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                const shiftCount = rnum['[[Value]]'] & 0b11111;
                return new $Number(realm, lnum['[[Value]]'] << shiftCount);
            }
            case typescript.SyntaxKind.GreaterThanGreaterThanToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lnum = lval.ToInt32(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rval.ToUint32(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                const shiftCount = rnum['[[Value]]'] & 0b11111;
                return new $Number(realm, lnum['[[Value]]'] >> shiftCount);
            }
            case typescript.SyntaxKind.GreaterThanGreaterThanGreaterThanToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lnum = lval.ToUint32(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rval.ToUint32(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                const shiftCount = rnum['[[Value]]'] & 0b11111;
                return new $Number(realm, lnum['[[Value]]'] >>> shiftCount);
            }
            case typescript.SyntaxKind.LessThanToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const r = $AbstractRelationalComparison(ctx, true, lval, rval);
                if (r.isAbrupt) {
                    return r.enrichWith(ctx, this);
                }
                return r.isUndefined ? intrinsics.false : r;
            }
            case typescript.SyntaxKind.GreaterThanToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const r = $AbstractRelationalComparison(ctx, false, rval, lval);
                if (r.isAbrupt) {
                    return r.enrichWith(ctx, this);
                }
                return r.isUndefined ? intrinsics.false : r;
            }
            case typescript.SyntaxKind.LessThanEqualsToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const r = $AbstractRelationalComparison(ctx, false, rval, lval);
                if (r.isAbrupt) {
                    return r.enrichWith(ctx, this);
                }
                return r.isTruthy || r.isUndefined ? intrinsics.false : intrinsics.true;
            }
            case typescript.SyntaxKind.GreaterThanEqualsToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const r = $AbstractRelationalComparison(ctx, true, lval, rval);
                if (r.isAbrupt) {
                    return r.enrichWith(ctx, this);
                }
                return r.isTruthy || r.isUndefined ? intrinsics.false : intrinsics.true;
            }
            case typescript.SyntaxKind.InstanceOfKeyword: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                return $InstanceOfOperator(ctx, lval, rval).enrichWith(ctx, this);
            }
            case typescript.SyntaxKind.InKeyword: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                if (!rval.isObject) {
                    return new $TypeError(realm, `Right-hand side of 'in' keyword is not an object: ${rval}`);
                }
                return rval['[[HasProperty]]'](ctx, lval.ToPropertyKey(ctx)).enrichWith(ctx, this);
            }
            case typescript.SyntaxKind.EqualsEqualsToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                return $AbstractEqualityComparison(ctx, rval, lval).enrichWith(ctx, this);
            }
            case typescript.SyntaxKind.ExclamationEqualsToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const r = $AbstractEqualityComparison(ctx, rval, lval);
                if (r.isAbrupt) {
                    return r.enrichWith(ctx, this);
                }
                return r.isTruthy ? intrinsics.false : intrinsics.true;
            }
            case typescript.SyntaxKind.EqualsEqualsEqualsToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                return $StrictEqualityComparison(ctx, rval, lval).enrichWith(ctx, this);
            }
            case typescript.SyntaxKind.ExclamationEqualsEqualsToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const r = $StrictEqualityComparison(ctx, rval, lval);
                if (r.isAbrupt) {
                    return r.enrichWith(ctx, this);
                }
                return r.isTruthy ? intrinsics.false : intrinsics.true;
            }
            case typescript.SyntaxKind.AmpersandToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lnum = lval.ToInt32(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rval.ToInt32(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] & rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.CaretToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lnum = lval.ToInt32(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rval.ToInt32(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] ^ rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.BarToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$right.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                const lnum = lval.ToInt32(ctx);
                if (lnum.isAbrupt) {
                    return lnum.enrichWith(ctx, this);
                }
                const rnum = rval.ToInt32(ctx);
                if (rnum.isAbrupt) {
                    return rnum.enrichWith(ctx, this);
                }
                return new $Number(realm, lnum['[[Value]]'] | rnum['[[Value]]']);
            }
            case typescript.SyntaxKind.AmpersandAmpersandToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const lbool = lval.ToBoolean(ctx);
                if (lbool.isAbrupt) {
                    return lbool.enrichWith(ctx, this);
                }
                if (lbool.isFalsey) {
                    return lval;
                }
                const rref = this.$right.Evaluate(ctx);
                return rref.GetValue(ctx);
            }
            case typescript.SyntaxKind.BarBarToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const lbool = lval.ToBoolean(ctx);
                if (lbool.isAbrupt) {
                    return lbool.enrichWith(ctx, this);
                }
                if (lbool.isTruthy) {
                    return lval;
                }
                const rref = this.$right.Evaluate(ctx);
                return rref.GetValue(ctx);
            }
            case typescript.SyntaxKind.EqualsToken: {
                const lhs = this.$left;
                const assign = this.$right;
                if (!(lhs instanceof $ObjectLiteralExpression || lhs instanceof $ArrayLiteralExpression)) {
                    const lref = lhs.Evaluate(ctx);
                    if (lref.isAbrupt) {
                        return lref.enrichWith(ctx, this);
                    }
                    let rval;
                    if (assign instanceof $FunctionExpression && !assign.HasName && lref instanceof $Identifier) {
                        rval = lref.GetReferencedName();
                    }
                    else {
                        const rref = assign.Evaluate(ctx);
                        const $rval = rref.GetValue(ctx);
                        if ($rval.isAbrupt) {
                            return $rval.enrichWith(ctx, this);
                        }
                        rval = $rval;
                    }
                    if (!(lref instanceof $Reference)) {
                        return new $ReferenceError(realm, `Value is not assignable: ${lref}`).enrichWith(ctx, this);
                    }
                    const $PutValueResult = lref.PutValue(ctx, rval);
                    if ($PutValueResult.isAbrupt) {
                        return $PutValueResult.enrichWith(ctx, this);
                    }
                    return rval;
                }
                const rref = assign.Evaluate(ctx);
                const $rval = rref.GetValue(ctx);
                if ($rval.isAbrupt) {
                    return $rval.enrichWith(ctx, this);
                }
                const rval = $rval;
                return rval;
            }
            case typescript.SyntaxKind.CommaToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$left.Evaluate(ctx);
                return rref.GetValue(ctx).enrichWith(ctx, this);
            }
            case typescript.SyntaxKind.QuestionQuestionToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                if (lval.isNil) {
                    const rref = this.$right.Evaluate(ctx);
                    return rref.GetValue(ctx).enrichWith(ctx, this);
                }
                return lval;
            }
            case typescript.SyntaxKind.AsteriskAsteriskEqualsToken:
            case typescript.SyntaxKind.AsteriskEqualsToken:
            case typescript.SyntaxKind.SlashEqualsToken:
            case typescript.SyntaxKind.PercentEqualsToken:
            case typescript.SyntaxKind.PlusEqualsToken:
            case typescript.SyntaxKind.MinusEqualsToken:
            case typescript.SyntaxKind.LessThanLessThanEqualsToken:
            case typescript.SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case typescript.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
            case typescript.SyntaxKind.AmpersandEqualsToken:
            case typescript.SyntaxKind.CaretEqualsToken:
            case typescript.SyntaxKind.BarEqualsToken: {
                const lref = this.$left.Evaluate(ctx);
                const lval = lref.GetValue(ctx);
                if (lval.isAbrupt) {
                    return lval.enrichWith(ctx, this);
                }
                const rref = this.$left.Evaluate(ctx);
                const rval = rref.GetValue(ctx);
                if (rval.isAbrupt) {
                    return rval.enrichWith(ctx, this);
                }
                let r;
                switch (this.node.operatorToken.kind) {
                    case typescript.SyntaxKind.AsteriskAsteriskEqualsToken: {
                        const base = lval.ToNumber(ctx);
                        if (base.isAbrupt) {
                            return base.enrichWith(ctx, this);
                        }
                        const exponent = rval.ToNumber(ctx);
                        if (exponent.isAbrupt) {
                            return exponent.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, base['[[Value]]'] ** exponent['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.AsteriskEqualsToken: {
                        const lnum = lval.ToNumber(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToNumber(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] * rnum['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.SlashEqualsToken: {
                        const lnum = lval.ToNumber(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToNumber(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] / rnum['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.PercentEqualsToken: {
                        const lnum = lval.ToNumber(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToNumber(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] % rnum['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.PlusEqualsToken: {
                        const lprim = lval.ToPrimitive(ctx);
                        if (lprim.isAbrupt) {
                            return lprim.enrichWith(ctx, this);
                        }
                        const rprim = rval.ToPrimitive(ctx);
                        if (rprim.isAbrupt) {
                            return rprim.enrichWith(ctx, this);
                        }
                        if (lprim.isString || rprim.isString) {
                            const lstr = lprim.ToString(ctx);
                            if (lstr.isAbrupt) {
                                return lstr.enrichWith(ctx, this);
                            }
                            const rstr = rprim.ToString(ctx);
                            if (rstr.isAbrupt) {
                                return rstr.enrichWith(ctx, this);
                            }
                            r = new $String(realm, lstr['[[Value]]'] + rstr['[[Value]]']);
                            break;
                        }
                        const lnum = lprim.ToNumber(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rprim.ToNumber(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] + rnum['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.MinusEqualsToken: {
                        const lnum = lval.ToNumber(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToNumber(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] - rnum['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.LessThanLessThanEqualsToken: {
                        const lnum = lval.ToInt32(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToUint32(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        const shiftCount = rnum['[[Value]]'] & 0b11111;
                        r = new $Number(realm, lnum['[[Value]]'] << shiftCount);
                        break;
                    }
                    case typescript.SyntaxKind.GreaterThanGreaterThanEqualsToken: {
                        const lnum = lval.ToInt32(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToUint32(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        const shiftCount = rnum['[[Value]]'] & 0b11111;
                        r = new $Number(realm, lnum['[[Value]]'] >> shiftCount);
                        break;
                    }
                    case typescript.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken: {
                        const lnum = lval.ToUint32(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToUint32(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        const shiftCount = rnum['[[Value]]'] & 0b11111;
                        r = new $Number(realm, lnum['[[Value]]'] >>> shiftCount);
                        break;
                    }
                    case typescript.SyntaxKind.AmpersandEqualsToken: {
                        const lnum = lval.ToInt32(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToInt32(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] & rnum['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.CaretEqualsToken: {
                        const lnum = lval.ToInt32(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToInt32(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] ^ rnum['[[Value]]']);
                        break;
                    }
                    case typescript.SyntaxKind.BarEqualsToken: {
                        const lnum = lval.ToInt32(ctx);
                        if (lnum.isAbrupt) {
                            return lnum.enrichWith(ctx, this);
                        }
                        const rnum = rval.ToInt32(ctx);
                        if (rnum.isAbrupt) {
                            return rnum.enrichWith(ctx, this);
                        }
                        r = new $Number(realm, lnum['[[Value]]'] | rnum['[[Value]]']);
                        break;
                    }
                }
                if (!(lref instanceof $Reference)) {
                    return new $ReferenceError(realm, `Value is not assignable: ${lref}`).enrichWith(ctx, this);
                }
                const $PutValueResult = lref.PutValue(ctx, r);
                if ($PutValueResult.isAbrupt) {
                    return $PutValueResult.enrichWith(ctx, this);
                }
                return r;
            }
            default:
                throw new Error(`SyntaxKind ${this.node.operatorToken.kind} not yet implemented`);
        }
    }
}
class $ConditionalExpression {
    get $kind() { return typescript.SyntaxKind.ConditionalExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ConditionalExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        if (node.condition.kind === typescript.SyntaxKind.BinaryExpression) {
            this.$condition = new $BinaryExpression(node.condition, this, ctx, -1);
        }
        else {
            this.$condition = $unaryExpression(node.condition, this, ctx, -1);
        }
        this.$whenTrue = $assignmentExpression(node.whenTrue, this, ctx, -1);
        this.$whenFalse = $assignmentExpression(node.whenFalse, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $YieldExpression {
    get $kind() { return typescript.SyntaxKind.YieldExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.YieldExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $AsExpression {
    get $kind() { return typescript.SyntaxKind.AsExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.AsExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        return this.$expression.Evaluate(ctx);
    }
}
class $Identifier {
    get $kind() { return typescript.SyntaxKind.Identifier; }
    get isUndefined() { return false; }
    get isNull() { return false; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.Identifier(${node.text})`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.CoveredParenthesizedExpression = this;
        this.HasName = false;
        this.IsFunctionDefinition = false;
        this.IsIdentifierRef = true;
        this.ContainsExpression = false;
        this.HasInitializer = false;
        this.IsSimpleParameterList = true;
        const StringValue = this.StringValue = new $String(realm, node.text, void 0, void 0, this);
        this.PropName = StringValue;
        this.BoundNames = [StringValue];
        if (hasBit(ctx, 65536) && (StringValue['[[Value]]'] === 'eval' || StringValue['[[Value]]'] === 'arguments')) {
            this.AssignmentTargetType = 'strict';
        }
        else {
            this.AssignmentTargetType = 'simple';
        }
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        return realm.ResolveBinding(this.StringValue).enrichWith(ctx, this);
    }
    EvaluatePropName(ctx) {
        ctx.checkTimeout();
        return this.PropName;
    }
    InitializePropertyBinding(ctx, value, environment) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializePropertyBinding(#${ctx.id})`);
        const [name] = this.BoundNames;
        const $InitializeKeyedBindingResult = this.InitializeKeyedBinding(ctx, value, environment, name);
        if ($InitializeKeyedBindingResult.isAbrupt) {
            return $InitializeKeyedBindingResult.enrichWith(ctx, this);
        }
        return new $List(...this.BoundNames);
    }
    InitializeIteratorBinding(ctx, iteratorRecord, environment, initializer) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeIteratorBinding(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const bindingId = this.StringValue;
        const lhs = realm.ResolveBinding(bindingId, environment);
        if (lhs.isAbrupt) {
            return lhs.enrichWith(ctx, this);
        }
        let v = intrinsics.undefined;
        if (iteratorRecord['[[Done]]'].isFalsey) {
            const next = $IteratorStep(ctx, iteratorRecord);
            if (next.isAbrupt) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
                return next;
            }
            if (next.isFalsey) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
            }
            else {
                v = $IteratorValue(ctx, next);
                if (v.isAbrupt) {
                    iteratorRecord['[[Done]]'] = intrinsics.true;
                    return v;
                }
            }
        }
        if (iteratorRecord['[[Done]]'].isTruthy) {
            v = intrinsics.undefined;
        }
        if (initializer !== void 0 && v.isUndefined) {
            if (initializer instanceof $FunctionExpression && !initializer.HasName) {
                v = initializer.EvaluateNamed(ctx, bindingId);
            }
            else {
                const defaultValue = initializer.Evaluate(ctx);
                const $v = defaultValue.GetValue(ctx);
                if ($v.isAbrupt) {
                    return $v.enrichWith(ctx, this);
                }
                v = $v;
            }
        }
        if (environment === void 0) {
            return lhs.PutValue(ctx, v).enrichWith(ctx, this);
        }
        return lhs.InitializeReferencedBinding(ctx, v).enrichWith(ctx, this);
    }
    InitializeKeyedBinding(ctx, value, environment, propertyName, initializer) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeKeyedBinding(#${ctx.id})`);
        const realm = ctx.Realm;
        const bindingId = this.StringValue;
        const lhs = realm.ResolveBinding(bindingId, environment);
        if (lhs.isAbrupt) {
            return lhs.enrichWith(ctx, this);
        }
        const obj = value.ToObject(ctx);
        if (obj.isAbrupt) {
            return obj.enrichWith(ctx, this);
        }
        let v = obj['[[Get]]'](ctx, propertyName, obj);
        if (v.isAbrupt) {
            return v.enrichWith(ctx, this);
        }
        if (initializer !== void 0 && v.isUndefined) {
            if (initializer instanceof $FunctionExpression && !initializer.HasName) {
                v = initializer.EvaluateNamed(ctx, bindingId);
            }
            else {
                const defaultValue = initializer.Evaluate(ctx);
                const $v = defaultValue.GetValue(ctx);
                if ($v.isAbrupt) {
                    return $v.enrichWith(ctx, this);
                }
            }
        }
        if (environment === void 0) {
            return lhs.PutValue(ctx, v).enrichWith(ctx, this);
        }
        return lhs.InitializeReferencedBinding(ctx, v).enrichWith(ctx, this);
    }
}

function $$jsxChildList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        switch (nodes[i].kind) {
            case typescript.SyntaxKind.JsxText:
                $nodes[i] = new $JsxText(nodes[i], parent, ctx, i);
                break;
            case typescript.SyntaxKind.JsxExpression:
                $nodes[i] = new $JsxExpression(nodes[i], parent, ctx, i);
                break;
            case typescript.SyntaxKind.JsxElement:
                $nodes[i] = new $JsxElement(nodes[i], parent, ctx, i);
                break;
            case typescript.SyntaxKind.JsxSelfClosingElement:
                $nodes[i] = new $JsxSelfClosingElement(nodes[i], parent, ctx, i);
                break;
            case typescript.SyntaxKind.JsxFragment:
                $nodes[i] = new $JsxFragment(nodes[i], parent, ctx, i);
                break;
        }
    }
    return $nodes;
}
class $JsxElement {
    get $kind() { return typescript.SyntaxKind.JsxElement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.JsxElement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$openingElement = new $JsxOpeningElement(node.openingElement, this, ctx);
        this.$children = $$jsxChildList(node.children, this, ctx);
        this.$closingElement = new $JsxClosingElement(node.closingElement, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
function $$jsxTagNameExpression(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.Identifier:
            return new $Identifier(node, parent, ctx, idx);
        case typescript.SyntaxKind.ThisKeyword:
            return new $ThisExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.PropertyAccessExpression:
            return new $PropertyAccessExpression(node, parent, ctx, idx);
        default:
            throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[node.kind]}.`);
    }
}
class $JsxSelfClosingElement {
    get $kind() { return typescript.SyntaxKind.JsxSelfClosingElement; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.JsxSelfClosingElement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$tagName = $$jsxTagNameExpression(node.tagName, this, ctx, -1);
        this.$attributes = new $JsxAttributes(node.attributes, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $JsxFragment {
    get $kind() { return typescript.SyntaxKind.JsxFragment; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.JsxFragment`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$openingFragment = new $JsxOpeningFragment(node.openingFragment, this, ctx);
        this.$children = $$jsxChildList(node.children, this, ctx);
        this.$closingFragment = new $JsxClosingFragment(node.closingFragment, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
}
class $JsxText {
    get $kind() { return typescript.SyntaxKind.JsxText; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.JsxText`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $JsxOpeningElement {
    get $kind() { return typescript.SyntaxKind.JsxOpeningElement; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.JsxOpeningElement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$tagName = $$jsxTagNameExpression(node.tagName, this, ctx, -1);
        this.$attributes = new $JsxAttributes(node.attributes, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $JsxClosingElement {
    get $kind() { return typescript.SyntaxKind.JsxClosingElement; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.JsxClosingElement`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$tagName = $$jsxTagNameExpression(node.tagName, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $JsxOpeningFragment {
    get $kind() { return typescript.SyntaxKind.JsxOpeningFragment; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.JsxOpeningFragment`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $JsxClosingFragment {
    get $kind() { return typescript.SyntaxKind.JsxClosingFragment; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.JsxClosingFragment`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $JsxAttribute {
    get $kind() { return typescript.SyntaxKind.JsxAttribute; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.JsxAttribute`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$name = $identifier(node.name, this, ctx, -1);
        if (node.initializer === void 0) {
            this.$initializer = void 0;
        }
        else {
            if (node.initializer.kind === typescript.SyntaxKind.StringLiteral) {
                this.$initializer = new $StringLiteral(node.initializer, this, ctx, -1);
            }
            else {
                this.$initializer = new $JsxExpression(node.initializer, this, ctx, -1);
            }
        }
    }
}
function $$jsxAttributeLikeList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        switch (nodes[i].kind) {
            case typescript.SyntaxKind.JsxAttribute:
                $nodes[i] = new $JsxAttribute(nodes[i], parent, ctx, i);
                break;
            case typescript.SyntaxKind.JsxSpreadAttribute:
                $nodes[i] = new $JsxSpreadAttribute(nodes[i], parent, ctx, i);
                break;
        }
    }
    return $nodes;
}
class $JsxAttributes {
    get $kind() { return typescript.SyntaxKind.JsxAttributes; }
    constructor(node, parent, ctx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}.JsxAttributes`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$properties = $$jsxAttributeLikeList(node.properties, this, ctx);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $JsxSpreadAttribute {
    get $kind() { return typescript.SyntaxKind.JsxSpreadAttribute; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.JsxSpreadAttribute`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}
class $JsxExpression {
    get $kind() { return typescript.SyntaxKind.JsxExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.JsxExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.$expression = $assignmentExpression(node.expression, this, ctx, -1);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.empty;
    }
}

function $assignmentExpression(node, parent, ctx, idx) {
    if (node === void 0) {
        return void 0;
    }
    switch (node.kind) {
        case typescript.SyntaxKind.AsExpression:
            return new $AsExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.BinaryExpression:
            return new $BinaryExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.ArrowFunction:
            return new $ArrowFunction(node, parent, ctx, idx);
        case typescript.SyntaxKind.ConditionalExpression:
            return new $ConditionalExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.YieldExpression:
            return new $YieldExpression(node, parent, ctx, idx);
        default:
            return $unaryExpression(node, parent, ctx, idx);
    }
}
function $unaryExpression(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.JsxElement:
            return new $JsxElement(node, parent, ctx, idx);
        case typescript.SyntaxKind.JsxFragment:
            return new $JsxFragment(node, parent, ctx, idx);
        case typescript.SyntaxKind.JsxSelfClosingElement:
            return new $JsxSelfClosingElement(node, parent, ctx, idx);
        case typescript.SyntaxKind.PostfixUnaryExpression:
            return new $PostfixUnaryExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.PrefixUnaryExpression:
            return new $PrefixUnaryExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.AwaitExpression:
            return new $AwaitExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.DeleteExpression:
            return new $DeleteExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.TypeAssertionExpression:
            return new $TypeAssertion(node, parent, ctx, idx);
        case typescript.SyntaxKind.TypeOfExpression:
            return new $TypeOfExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.VoidExpression:
            return new $VoidExpression(node, parent, ctx, idx);
        default:
            return $LHSExpression(node, parent, ctx, idx);
    }
}
function $LHSExpression(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.ArrayLiteralExpression:
            return new $ArrayLiteralExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.ClassExpression:
            return new $ClassExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.FunctionExpression:
            return new $FunctionExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.Identifier:
            return new $Identifier(node, parent, ctx, idx);
        case typescript.SyntaxKind.NewExpression:
            return new $NewExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.ObjectLiteralExpression:
            return new $ObjectLiteralExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.ParenthesizedExpression:
            return new $ParenthesizedExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.TemplateExpression:
            return new $TemplateExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.ElementAccessExpression:
            return new $ElementAccessExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.NonNullExpression:
            return new $NonNullExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.PropertyAccessExpression:
            return new $PropertyAccessExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.TaggedTemplateExpression:
            return new $TaggedTemplateExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.CallExpression:
            return new $CallExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.MetaProperty:
            return new $MetaProperty(node, parent, ctx, idx);
        case typescript.SyntaxKind.ThisKeyword:
            return new $ThisExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.SuperKeyword:
            return new $SuperExpression(node, parent, ctx, idx);
        case typescript.SyntaxKind.NumericLiteral:
            return new $NumericLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.BigIntLiteral:
            return new $BigIntLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.StringLiteral:
            return new $StringLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.RegularExpressionLiteral:
            return new $RegularExpressionLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.NoSubstitutionTemplateLiteral:
            return new $NoSubstitutionTemplateLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.NullKeyword:
            return new $NullLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.TrueKeyword:
        case typescript.SyntaxKind.FalseKeyword:
            return new $BooleanLiteral(node, parent, ctx, idx);
        default:
            throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[node.kind]}.`);
    }
}
function $identifier(node, parent, ctx, idx) {
    if (node === void 0) {
        return void 0;
    }
    return new $Identifier(node, parent, ctx, idx);
}
function $$propertyName(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.Identifier:
            return new $Identifier(node, parent, ctx, idx);
        case typescript.SyntaxKind.StringLiteral:
            return new $StringLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.NumericLiteral:
            return new $NumericLiteral(node, parent, ctx, idx);
        case typescript.SyntaxKind.ComputedPropertyName:
            return new $ComputedPropertyName(node, parent, ctx, idx);
    }
}
function $$bindingName(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.Identifier:
            return new $Identifier(node, parent, ctx | 8, idx);
        case typescript.SyntaxKind.ObjectBindingPattern:
            return new $ObjectBindingPattern(node, parent, ctx, idx);
        case typescript.SyntaxKind.ArrayBindingPattern:
            return new $ArrayBindingPattern(node, parent, ctx, idx);
    }
}
function $$esStatement(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.Block:
            return new $Block(node, parent, ctx, idx);
        case typescript.SyntaxKind.EmptyStatement:
            return new $EmptyStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.ExpressionStatement:
            return new $ExpressionStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.IfStatement:
            return new $IfStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.DoStatement:
            return new $DoStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.WhileStatement:
            return new $WhileStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.ForStatement:
            return new $ForStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.ForInStatement:
            return new $ForInStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.ForOfStatement:
            return new $ForOfStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.ContinueStatement:
            return new $ContinueStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.BreakStatement:
            return new $BreakStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.ReturnStatement:
            return new $ReturnStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.WithStatement:
            return new $WithStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.SwitchStatement:
            return new $SwitchStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.LabeledStatement:
            return new $LabeledStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.ThrowStatement:
            return new $ThrowStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.TryStatement:
            return new $TryStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.DebuggerStatement:
            return new $DebuggerStatement(node, parent, ctx, idx);
        default:
            throw new Error(`Unexpected syntax node: ${typescript.SyntaxKind[node.kind]}.`);
    }
}
function $$tsStatementListItem(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.VariableStatement:
            return new $VariableStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.FunctionDeclaration:
            return new $FunctionDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.ClassDeclaration:
            return new $ClassDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.InterfaceDeclaration:
            return new $InterfaceDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.TypeAliasDeclaration:
            return new $TypeAliasDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.EnumDeclaration:
            return new $EnumDeclaration(node, parent, ctx, idx);
        default:
            return $$esStatement(node, parent, ctx, idx);
    }
}
function $$tsStatementList(nodes, parent, ctx) {
    const len = nodes.length;
    let node;
    const $nodes = [];
    let x = 0;
    for (let i = 0; i < len; ++i) {
        node = nodes[i];
        if (node.kind === typescript.SyntaxKind.FunctionDeclaration && node.body === void 0) {
            continue;
        }
        $nodes[x] = $$tsStatementListItem(node, parent, ctx, x);
        ++x;
    }
    return $nodes;
}
function $$esLabelledItem(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.VariableStatement:
            return new $VariableStatement(node, parent, ctx, idx);
        case typescript.SyntaxKind.FunctionDeclaration:
            return new $FunctionDeclaration(node, parent, ctx, idx);
        default:
            return $$esStatement(node, parent, ctx, idx);
    }
}
function GetDirectivePrologue(statements) {
    let directivePrologue = kernel.emptyArray;
    let statement;
    const len = statements.length;
    for (let i = 0; i < len; ++i) {
        statement = statements[i];
        if (statement.kind === typescript.SyntaxKind.ExpressionStatement
            && statement.expression.kind === typescript.SyntaxKind.StringLiteral) {
            if (directivePrologue === kernel.emptyArray) {
                directivePrologue = [statement];
            }
            else {
                directivePrologue.push(statement);
            }
            if (statement.expression.text === 'use strict') {
                directivePrologue.ContainsUseStrict = true;
            }
        }
        else {
            break;
        }
    }
    return directivePrologue;
}
function evaluateStatement(ctx, statement) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    let stmtCompletion = intrinsics.empty;
    switch (statement.$kind) {
        case typescript.SyntaxKind.Block:
        case typescript.SyntaxKind.VariableStatement:
        case typescript.SyntaxKind.EmptyStatement:
        case typescript.SyntaxKind.ExpressionStatement:
        case typescript.SyntaxKind.IfStatement:
        case typescript.SyntaxKind.SwitchStatement:
        case typescript.SyntaxKind.ContinueStatement:
        case typescript.SyntaxKind.BreakStatement:
        case typescript.SyntaxKind.ReturnStatement:
        case typescript.SyntaxKind.WithStatement:
        case typescript.SyntaxKind.LabeledStatement:
        case typescript.SyntaxKind.ThrowStatement:
        case typescript.SyntaxKind.TryStatement:
        case typescript.SyntaxKind.DebuggerStatement:
        case typescript.SyntaxKind.FunctionDeclaration:
            stmtCompletion = statement.Evaluate(ctx);
            break;
        case typescript.SyntaxKind.DoStatement:
        case typescript.SyntaxKind.WhileStatement:
        case typescript.SyntaxKind.ForStatement:
        case typescript.SyntaxKind.ForInStatement:
        case typescript.SyntaxKind.ForOfStatement:
            stmtCompletion = statement.EvaluateLabelled(ctx, new $StringSet());
            break;
    }
    return stmtCompletion;
}
function evaluateStatementList(ctx, statements) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    let sl = intrinsics.empty;
    for (const statement of statements) {
        const s = evaluateStatement(ctx, statement);
        if (s.isAbrupt) {
            return s;
        }
        sl = sl.UpdateEmpty(s);
    }
    return sl;
}
function BlockDeclarationInstantiation(ctx, lexicallyScopedDeclarations, envRec) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    for (const d of lexicallyScopedDeclarations) {
        for (const dn of d.BoundNames) {
            if (d.IsConstantDeclaration) {
                envRec.CreateImmutableBinding(ctx, dn, intrinsics.true);
            }
            else {
                envRec.CreateImmutableBinding(ctx, dn, intrinsics.false);
            }
        }
        const dkind = d.$kind;
        if (dkind === typescript.SyntaxKind.FunctionDeclaration) {
            const fn = d.BoundNames[0];
            const fo = d.InstantiateFunctionObject(ctx, envRec);
            if (fo.isAbrupt) {
                return fo;
            }
            envRec.InitializeBinding(ctx, fn, fo);
        }
    }
    return ctx.Realm['[[Intrinsics]]'].empty;
}
function IsConstructor(ctx, argument) {
    const intrinsics = ctx.Realm['[[Intrinsics]]'];
    if (!argument.isObject) {
        return intrinsics.false.GetValue(ctx)['[[Value]]'];
    }
    if (argument instanceof $Function && argument['[[Construct]]'] !== void 0) {
        return intrinsics.true.GetValue(ctx)['[[Value]]'];
    }
    return intrinsics.false.GetValue(ctx)['[[Value]]'];
}
function $decoratorList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    if (nodes.length === 1) {
        return [new $Decorator(nodes[0], parent, ctx, 0)];
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = new $Decorator(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
function getContainsExpression(obj) { return obj.ContainsExpression; }
function getHasInitializer(obj) { return obj.HasInitializer; }
function getIsSimpleParameterList(obj) { return obj.IsSimpleParameterList; }
function getBoundNames(obj) { return obj.BoundNames; }
function getLexicallyDeclaredNames(obj) { return obj.LexicallyDeclaredNames; }
function getLexicallyScopedDeclarations(obj) { return obj.LexicallyScopedDeclarations; }
function getVarDeclaredNames(obj) { return obj.VarDeclaredNames; }
function getVarScopedDeclarations(obj) { return obj.VarScopedDeclarations; }
function getLocalName(obj) { return obj.LocalName; }
function getImportEntriesForModule(obj) { return obj.ImportEntriesForModule; }
function getExportedNames(obj) { return obj.ExportedNames; }
function getExportEntriesForModule(obj) { return obj.ExportEntriesForModule; }
function getReferencedBindings(obj) { return obj.ReferencedBindings; }
function $heritageClauseList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = Array(len);
    for (let i = 0; i < len; ++i) {
        $nodes[i] = new $HeritageClause(nodes[i], parent, ctx, i);
    }
    return $nodes;
}
function $$classElementList(nodes, parent, ctx) {
    if (nodes === void 0 || nodes.length === 0) {
        return kernel.emptyArray;
    }
    const len = nodes.length;
    const $nodes = [];
    let $node;
    let node;
    for (let i = 0; i < len; ++i) {
        node = nodes[i];
        if (node.body !== void 0) {
            $node = $$classElement(nodes[i], parent, ctx, i);
            if ($node !== void 0) {
                $nodes.push($node);
            }
        }
    }
    return $nodes;
}
function $$classElement(node, parent, ctx, idx) {
    switch (node.kind) {
        case typescript.SyntaxKind.PropertyDeclaration:
            return new $PropertyDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.SemicolonClassElement:
            return new $SemicolonClassElement(node, parent, ctx, idx);
        case typescript.SyntaxKind.MethodDeclaration:
            return new $MethodDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.Constructor:
            return new $ConstructorDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.GetAccessor:
            return new $GetAccessorDeclaration(node, parent, ctx, idx);
        case typescript.SyntaxKind.SetAccessor:
            return new $SetAccessorDeclaration(node, parent, ctx, idx);
        default:
            return void 0;
    }
}
function hasBit(flag, bit) {
    return (flag & bit) > 0;
}
function hasAllBits(flag, bit) {
    return (flag & bit) === bit;
}
function clearBit(flag, bit) {
    return (flag | bit) ^ bit;
}
var Context;
(function (Context) {
    Context[Context["None"] = 0] = "None";
    Context[Context["Dynamic"] = 2] = "Dynamic";
    Context[Context["InVariableStatement"] = 4] = "InVariableStatement";
    Context[Context["IsBindingName"] = 8] = "IsBindingName";
    Context[Context["InParameterDeclaration"] = 16] = "InParameterDeclaration";
    Context[Context["InCatchClause"] = 32] = "InCatchClause";
    Context[Context["InBindingPattern"] = 64] = "InBindingPattern";
    Context[Context["InTypeElement"] = 128] = "InTypeElement";
    Context[Context["IsPropertyAccessName"] = 256] = "IsPropertyAccessName";
    Context[Context["IsMemberName"] = 512] = "IsMemberName";
    Context[Context["IsLabel"] = 1024] = "IsLabel";
    Context[Context["IsLabelReference"] = 2048] = "IsLabelReference";
    Context[Context["InExport"] = 4096] = "InExport";
    Context[Context["IsConst"] = 8192] = "IsConst";
    Context[Context["IsLet"] = 16384] = "IsLet";
    Context[Context["IsBlockScoped"] = 24576] = "IsBlockScoped";
    Context[Context["IsVar"] = 32768] = "IsVar";
    Context[Context["IsFunctionScoped"] = 32768] = "IsFunctionScoped";
    Context[Context["InStrictMode"] = 65536] = "InStrictMode";
})(Context || (Context = {}));
const modifiersToModifierFlags = (function () {
    const lookup = Object.assign(Object.create(null), {
        [typescript.SyntaxKind.ConstKeyword]: typescript.ModifierFlags.Const,
        [typescript.SyntaxKind.DefaultKeyword]: typescript.ModifierFlags.Default,
        [typescript.SyntaxKind.ExportKeyword]: typescript.ModifierFlags.Export,
        [typescript.SyntaxKind.AsyncKeyword]: typescript.ModifierFlags.Async,
        [typescript.SyntaxKind.PrivateKeyword]: typescript.ModifierFlags.Private,
        [typescript.SyntaxKind.ProtectedKeyword]: typescript.ModifierFlags.Protected,
        [typescript.SyntaxKind.PublicKeyword]: typescript.ModifierFlags.Public,
        [typescript.SyntaxKind.StaticKeyword]: typescript.ModifierFlags.Static,
        [typescript.SyntaxKind.AbstractKeyword]: typescript.ModifierFlags.Abstract,
        [typescript.SyntaxKind.DeclareKeyword]: typescript.ModifierFlags.Ambient,
        [typescript.SyntaxKind.ReadonlyKeyword]: typescript.ModifierFlags.Readonly,
    });
    return function (mods) {
        if (mods === void 0) {
            return typescript.ModifierFlags.None;
        }
        const len = mods.length;
        if (len === 1) {
            return lookup[mods[0].kind];
        }
        else if (len === 2) {
            return lookup[mods[0].kind] + lookup[mods[1].kind];
        }
        else if (len === 3) {
            return lookup[mods[0].kind]
                + lookup[mods[1].kind]
                + lookup[mods[2].kind];
        }
        else {
            return lookup[mods[0].kind]
                + lookup[mods[1].kind]
                + lookup[mods[2].kind]
                + lookup[mods[3].kind];
        }
    };
})();
var FunctionKind;
(function (FunctionKind) {
    FunctionKind[FunctionKind["normal"] = 0] = "normal";
    FunctionKind[FunctionKind["nonConstructor"] = 1] = "nonConstructor";
    FunctionKind[FunctionKind["classConstructor"] = 2] = "classConstructor";
    FunctionKind[FunctionKind["generator"] = 4] = "generator";
    FunctionKind[FunctionKind["async"] = 8] = "async";
    FunctionKind[FunctionKind["asyncGenerator"] = 12] = "asyncGenerator";
})(FunctionKind || (FunctionKind = {}));
function $i(idx) {
    return idx === -1 ? '' : `[${idx}]`;
}

class $ArgumentsExoticObject extends $Object {
    constructor(realm, func, formals, argumentsList, env) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'ArgumentsExoticObject', intrinsics['%ObjectPrototype%'], 1, intrinsics.empty);
        const ctx = realm.stack.top;
        const len = argumentsList.length;
        const map = new $Object(realm, '[[ParameterMap]]', intrinsics.null, 1, intrinsics.empty);
        this['[[ParameterMap]]'] = map;
        const parameterNames = formals.flatMap(getBoundNames);
        const numberOfParameters = parameterNames.length;
        let index = 0;
        while (index < len) {
            const val = argumentsList[index];
            $CreateDataProperty(ctx, this, new $String(realm, index.toString()), val);
            ++index;
        }
        const desc = new $PropertyDescriptor(realm, intrinsics.length);
        desc['[[Value]]'] = new $Number(realm, len);
        const mappedNames = [];
        index = numberOfParameters - 1;
        while (index >= 0) {
            const name = parameterNames[index];
            if (!mappedNames.some(x => x.is(name))) {
                mappedNames.push(name);
                if (index < len) {
                    const g = new $ArgGetter(realm, name, env);
                    const p = new $ArgSetter(realm, name, env);
                    const desc = new $PropertyDescriptor(realm, new $String(realm, index.toString()), {
                        '[[Set]]': p,
                        '[[Get]]': g,
                        '[[Enumerable]]': intrinsics.false,
                        '[[Configurable]]': intrinsics.true,
                    });
                    map['[[DefineOwnProperty]]'](ctx, desc.name, desc);
                }
            }
            --index;
        }
        const iteratorDesc = new $PropertyDescriptor(realm, intrinsics['@@iterator'], {
            '[[Value]]': intrinsics['%ArrayProto_values%'],
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.true,
        });
        $DefinePropertyOrThrow(ctx, this, iteratorDesc.name, iteratorDesc);
        const calleeDesc = new $PropertyDescriptor(realm, intrinsics.$callee, {
            '[[Value]]': func,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.true,
        });
        $DefinePropertyOrThrow(ctx, this, calleeDesc.name, calleeDesc);
    }
    '[[GetOwnProperty]]'(ctx, P) {
        const desc = super['[[GetOwnProperty]]'](ctx, P);
        if (desc.isUndefined) {
            return desc;
        }
        const map = this['[[ParameterMap]]'];
        const isMapped = $HasOwnProperty(ctx, map, P).isTruthy;
        if (isMapped) {
            desc['[[Value]]'] = map['[[Get]]'](ctx, P, map);
        }
        return desc;
    }
    '[[DefineOwnProperty]]'(ctx, P, Desc) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const map = this['[[ParameterMap]]'];
        const isMapped = $HasOwnProperty(ctx, map, P).isTruthy;
        let newArgDesc = Desc;
        if (isMapped && $IsDataDescriptor(Desc)) {
            if (Desc['[[Value]]'].isEmpty && Desc['[[Writable]]'].hasValue && Desc['[[Writable]]'].isFalsey) {
                newArgDesc = new $PropertyDescriptor(Desc.realm, Desc.name, {
                    '[[Value]]': map['[[Get]]'](ctx, P, map),
                    '[[Writable]]': Desc['[[Writable]]'],
                    '[[Enumerable]]': Desc['[[Enumerable]]'],
                    '[[Configurable]]': Desc['[[Configurable]]'],
                });
            }
        }
        const allowed = super['[[DefineOwnProperty]]'](ctx, P, newArgDesc);
        if (allowed.isAbrupt) {
            return allowed;
        }
        if (allowed.isFalsey) {
            return allowed;
        }
        if (isMapped) {
            if (Desc.isAccessorDescriptor) {
                map['[[Delete]]'](ctx, P);
            }
        }
        else {
            if (Desc['[[Value]]'].hasValue) {
                $Set(ctx, map, P, Desc['[[Value]]'], intrinsics.false);
                if (Desc['[[Writable]]'].hasValue && Desc['[[Writable]]'].isFalsey) {
                    map['[[Delete]]'](ctx, P);
                }
            }
        }
        return intrinsics.true;
    }
    '[[Get]]'(ctx, P, Receiver) {
        const map = this['[[ParameterMap]]'];
        const isMapped = $HasOwnProperty(ctx, map, P).isTruthy;
        if (!isMapped) {
            return super['[[Get]]'](ctx, P, Receiver);
        }
        else {
            return map['[[Get]]'](ctx, P, map);
        }
    }
    '[[Set]]'(ctx, P, V, Receiver) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (this.is(Receiver)) {
            const map = this['[[ParameterMap]]'];
            const isMapped = $HasOwnProperty(ctx, map, P).isTruthy;
            if (isMapped) {
                $Set(ctx, map, P, V, intrinsics.false);
            }
        }
        return super['[[Set]]'](ctx, P, V, Receiver);
    }
    '[[Delete]]'(ctx, P) {
        const map = this['[[ParameterMap]]'];
        const isMapped = $HasOwnProperty(ctx, map, P).isTruthy;
        const result = super['[[Delete]]'](ctx, P);
        if (result.isAbrupt) {
            return result;
        }
        if (result.isTruthy && isMapped) {
            map['[[Delete]]'](ctx, P);
        }
        return result;
    }
}
class $ArgGetter extends $BuiltinFunction {
    constructor(realm, name, env) {
        super(realm, 'ArgGetter', realm['[[Intrinsics]]']['%FunctionPrototype%']);
        this['[[Name]]'] = name;
        this['[[Env]]'] = env;
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const name = this['[[Name]]'];
        const env = this['[[Env]]'];
        return env.GetBindingValue(ctx, name, intrinsics.false);
    }
}
class $ArgSetter extends $BuiltinFunction {
    constructor(realm, name, env) {
        super(realm, 'ArgSetter', realm['[[Intrinsics]]']['%FunctionPrototype%']);
        this['[[Name]]'] = name;
        this['[[Env]]'] = env;
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const name = this['[[Name]]'];
        const env = this['[[Env]]'];
        return env.SetMutableBinding(ctx, name, value, intrinsics.false);
    }
}
function $CreateUnmappedArgumentsObject(ctx, argumentsList) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const len = argumentsList.length;
    const obj = $Object.ObjectCreate(ctx, 'UnmappedArgumentsObject', intrinsics['%ObjectPrototype%'], {
        '[[ParameterMap]]': intrinsics.undefined,
    });
    $DefinePropertyOrThrow(ctx, obj, intrinsics.length, new $PropertyDescriptor(realm, intrinsics.length, {
        '[[Value]]': new $Number(realm, len),
        '[[Writable]]': intrinsics.true,
        '[[Enumerable]]': intrinsics.false,
        '[[Configurable]]': intrinsics.true,
    }));
    let index = 0;
    while (index < len) {
        const val = argumentsList[index];
        $CreateDataProperty(ctx, obj, new $String(realm, index.toString()), val);
        ++index;
    }
    $DefinePropertyOrThrow(ctx, obj, intrinsics['@@iterator'], new $PropertyDescriptor(realm, intrinsics['@@iterator'], {
        '[[Value]]': intrinsics['%ArrayProto_values%'],
        '[[Writable]]': intrinsics.true,
        '[[Enumerable]]': intrinsics.false,
        '[[Configurable]]': intrinsics.true,
    }));
    $DefinePropertyOrThrow(ctx, obj, intrinsics.$callee, new $PropertyDescriptor(realm, intrinsics.$callee, {
        '[[Get]]': intrinsics['%ThrowTypeError%'],
        '[[Set]]': intrinsics['%ThrowTypeError%'],
        '[[Enumerable]]': intrinsics.false,
        '[[Configurable]]': intrinsics.false,
    }));
    return obj;
}

class $FormalParameterList extends Array {
    constructor(nodes, parent, ctx) {
        super();
        this.ContainsExpression = false;
        this.ExpectedArgumentCount = 0;
        this.HasInitializer = false;
        this.IsSimpleParameterList = true;
        this.hasDuplicates = false;
        if (nodes === void 0) {
            this.BoundNames = kernel.emptyArray;
        }
        else {
            const BoundNames = this.BoundNames = [];
            const seenNames = new Set();
            let boundNamesLen = 0;
            let cur;
            let curBoundNames;
            let curBoundName;
            for (let i = 0, ii = nodes.length; i < ii; ++i) {
                cur = super[i] = new $ParameterDeclaration(nodes[i], parent, ctx, i);
                curBoundNames = cur.BoundNames;
                for (let j = 0, jj = curBoundNames.length; j < jj; ++j) {
                    curBoundName = curBoundNames[j];
                    if (seenNames.has(curBoundName['[[Value]]'])) {
                        this.hasDuplicates = true;
                    }
                    else {
                        seenNames.add(curBoundName['[[Value]]']);
                    }
                    BoundNames[boundNamesLen++] = curBoundName;
                }
                if (cur.ContainsExpression && !this.ContainsExpression) {
                    this.ContainsExpression = true;
                }
                if (cur.HasInitializer && !this.HasInitializer) {
                    this.HasInitializer = true;
                    this.ExpectedArgumentCount = i;
                }
                if (!cur.IsSimpleParameterList && this.IsSimpleParameterList) {
                    this.IsSimpleParameterList = false;
                }
            }
            if (!this.HasInitializer) {
                this.ExpectedArgumentCount = nodes.length;
            }
        }
    }
}
class $FunctionExpression {
    get $kind() { return typescript.SyntaxKind.FunctionExpression; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.FunctionExpression`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.IsConstantDeclaration = false;
        this.IsFunctionDefinition = true;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        const DirectivePrologue = this.DirectivePrologue = GetDirectivePrologue(node.body.statements);
        if (DirectivePrologue.ContainsUseStrict) {
            ctx |= 65536;
        }
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        this.$parameters = new $FormalParameterList(node.parameters, this, ctx);
        const $body = this.$body = new $Block(node.body, this, ctx, -1);
        this.BoundNames = kernel.emptyArray;
        this.ContainsUseStrict = DirectivePrologue.ContainsUseStrict === true;
        this.HasName = $name !== void 0;
        this.LexicallyDeclaredNames = $body.TopLevelLexicallyDeclaredNames;
        this.LexicallyScopedDeclarations = $body.TopLevelLexicallyScopedDeclarations;
        this.VarDeclaredNames = $body.TopLevelVarDeclaredNames;
        this.VarScopedDeclarations = $body.TopLevelVarScopedDeclarations;
        if (!hasBit(modifierFlags, typescript.ModifierFlags.Async)) {
            if (node.asteriskToken === void 0) {
                this.functionKind = 0;
            }
            else {
                this.functionKind = 4;
            }
        }
        else if (node.asteriskToken === void 0) {
            this.functionKind = 8;
        }
        else {
            this.functionKind = 12;
        }
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        return EvaluateBody(this, ctx, functionObject, argumentsList);
    }
    Evaluate(ctx) {
        switch (this.functionKind) {
            case 0:
                return this.$Evaluate(ctx);
            case 4:
                return this.$EvaluateGenerator(ctx);
            case 12:
                return this.$EvaluateAsyncGenerator(ctx);
            case 8:
                return this.$EvaluateAsync(ctx);
        }
    }
    $Evaluate(ctx) {
        var _a, _b;
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.$Evaluate(#${ctx.id})`);
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const scope = ctx.LexicalEnvironment;
        const funcEnv = new $DeclarativeEnvRec(this.logger, realm, scope);
        const name = (_b = (_a = this.$name) === null || _a === void 0 ? void 0 : _a.StringValue) !== null && _b !== void 0 ? _b : void 0;
        if (name !== void 0) {
            funcEnv.CreateImmutableBinding(ctx, name, intrinsics.false);
        }
        const closure = $Function.FunctionCreate(ctx, 'normal', this, funcEnv, strict);
        closure.MakeConstructor(ctx);
        if (name !== void 0) {
            closure.SetFunctionName(ctx, name);
        }
        closure['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        if (name !== void 0) {
            funcEnv.InitializeBinding(ctx, name, closure);
        }
        return closure;
    }
    $EvaluateGenerator(ctx) {
        var _a, _b;
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.$EvaluateGenerator(#${ctx.id})`);
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const scope = ctx.LexicalEnvironment;
        const funcEnv = new $DeclarativeEnvRec(this.logger, realm, scope);
        const name = (_b = (_a = this.$name) === null || _a === void 0 ? void 0 : _a.StringValue) !== null && _b !== void 0 ? _b : void 0;
        if (name !== void 0) {
            funcEnv.CreateImmutableBinding(ctx, name, intrinsics.false);
        }
        const closure = $Function.GeneratorFunctionCreate(ctx, 'normal', this, funcEnv, strict);
        const prototype = $Object.ObjectCreate(ctx, 'Generator', intrinsics['%GeneratorPrototype%']);
        const $DefinePropertyOrThrowResult = $DefinePropertyOrThrow(ctx, closure, intrinsics.$prototype, new $PropertyDescriptor(realm, intrinsics.$prototype, {
            '[[Value]]': prototype,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.false,
        }));
        if ($DefinePropertyOrThrowResult.isAbrupt) {
            return $DefinePropertyOrThrowResult.enrichWith(ctx, this);
        }
        if (name !== void 0) {
            closure.SetFunctionName(ctx, name);
            funcEnv.InitializeBinding(ctx, name, closure);
        }
        closure['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return closure;
    }
    $EvaluateAsyncGenerator(ctx) {
        var _a, _b;
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.$EvaluateAsyncGenerator(#${ctx.id})`);
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const scope = ctx.LexicalEnvironment;
        const funcEnv = new $DeclarativeEnvRec(this.logger, realm, scope);
        const name = (_b = (_a = this.$name) === null || _a === void 0 ? void 0 : _a.StringValue) !== null && _b !== void 0 ? _b : void 0;
        if (name !== void 0) {
            funcEnv.CreateImmutableBinding(ctx, name, intrinsics.false);
        }
        const closure = $Function.AsyncGeneratorFunctionCreate(ctx, 'normal', this, funcEnv, strict);
        const prototype = $Object.ObjectCreate(ctx, 'AsyncGenerator', intrinsics['%AsyncGeneratorPrototype%']);
        const $DefinePropertyOrThrowResult = $DefinePropertyOrThrow(ctx, closure, intrinsics.$prototype, new $PropertyDescriptor(realm, intrinsics.$prototype, {
            '[[Value]]': prototype,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.false,
        }));
        if ($DefinePropertyOrThrowResult.isAbrupt) {
            return $DefinePropertyOrThrowResult.enrichWith(ctx, this);
        }
        if (name !== void 0) {
            closure.SetFunctionName(ctx, name);
            funcEnv.InitializeBinding(ctx, name, closure);
        }
        closure['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return closure;
    }
    $EvaluateAsync(ctx) {
        var _a, _b;
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.$EvaluateAsync(#${ctx.id})`);
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const scope = ctx.LexicalEnvironment;
        const funcEnv = new $DeclarativeEnvRec(this.logger, realm, scope);
        const name = (_b = (_a = this.$name) === null || _a === void 0 ? void 0 : _a.StringValue) !== null && _b !== void 0 ? _b : void 0;
        if (name !== void 0) {
            funcEnv.CreateImmutableBinding(ctx, name, intrinsics.false);
        }
        const closure = $Function.AsyncFunctionCreate(ctx, 'normal', this, funcEnv, strict);
        if (name !== void 0) {
            closure.SetFunctionName(ctx, name);
            funcEnv.InitializeBinding(ctx, name, closure);
        }
        closure['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return closure;
    }
    EvaluateNamed(ctx, name) {
        ctx.checkTimeout();
        const closure = this.Evaluate(ctx);
        if (closure.isAbrupt) {
            return closure.enrichWith(ctx, this);
        }
        closure.SetFunctionName(ctx, name);
        return closure;
    }
}
class $FunctionDeclaration {
    get $kind() { return typescript.SyntaxKind.FunctionDeclaration; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.FunctionDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.IsConstantDeclaration = false;
        this.IsFunctionDefinition = true;
        this.ModuleRequests = kernel.emptyArray;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const intrinsics = realm['[[Intrinsics]]'];
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        if (hasBit(modifierFlags, typescript.ModifierFlags.Export)) {
            ctx |= 4096;
        }
        const DirectivePrologue = this.DirectivePrologue = GetDirectivePrologue(node.body.statements);
        if (this.DirectivePrologue.ContainsUseStrict) {
            ctx |= 65536;
        }
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        const $name = this.$name = $identifier(node.name, this, ctx, -1);
        this.$parameters = new $FormalParameterList(node.parameters, this, ctx);
        const $body = this.$body = new $Block(node.body, this, ctx, -1);
        this.ContainsUseStrict = DirectivePrologue.ContainsUseStrict === true;
        const HasName = this.HasName = $name !== void 0;
        this.LexicallyDeclaredNames = $body.TopLevelLexicallyDeclaredNames;
        this.LexicallyScopedDeclarations = $body.TopLevelLexicallyScopedDeclarations;
        this.VarDeclaredNames = $body.TopLevelVarDeclaredNames;
        this.VarScopedDeclarations = $body.TopLevelVarScopedDeclarations;
        if ($name === void 0) {
            this.PropName = new $Undefined(realm);
        }
        else {
            this.PropName = $name.PropName;
        }
        if (hasBit(ctx, 4096)) {
            if (hasBit(this.modifierFlags, typescript.ModifierFlags.Default)) {
                if (HasName) {
                    const [localName] = $name.BoundNames;
                    const BoundNames = this.BoundNames = [localName, intrinsics['*default*']];
                    this.ExportedBindings = BoundNames;
                    this.ExportedNames = [intrinsics['default']];
                    this.ExportEntries = [
                        new ExportEntryRecord(this, intrinsics['default'], intrinsics.null, intrinsics.null, localName),
                    ];
                }
                else {
                    const BoundNames = this.BoundNames = [intrinsics['*default*']];
                    this.ExportedBindings = BoundNames;
                    this.ExportedNames = [intrinsics['default']];
                    this.ExportEntries = [
                        new ExportEntryRecord(this, intrinsics['default'], intrinsics.null, intrinsics.null, intrinsics['*default*']),
                    ];
                }
            }
            else {
                const BoundNames = this.BoundNames = $name.BoundNames;
                const [localName] = BoundNames;
                this.ExportedBindings = BoundNames;
                this.ExportedNames = BoundNames;
                this.ExportEntries = [
                    new ExportEntryRecord(this, localName, intrinsics.null, intrinsics.null, localName),
                ];
            }
        }
        else {
            this.BoundNames = $name.BoundNames;
            this.ExportedBindings = kernel.emptyArray;
            this.ExportedNames = kernel.emptyArray;
            this.ExportEntries = kernel.emptyArray;
        }
        if (!hasBit(modifierFlags, typescript.ModifierFlags.Async)) {
            if (node.asteriskToken === void 0) {
                this.functionKind = 0;
            }
            else {
                this.functionKind = 4;
            }
        }
        else if (node.asteriskToken === void 0) {
            this.functionKind = 8;
        }
        else {
            this.functionKind = 12;
        }
    }
    InstantiateFunctionObject(ctx, Scope) {
        switch (this.functionKind) {
            case 0:
                return this.$InstantiateFunctionObject(ctx, Scope);
            case 4:
                return this.$InstantiateGeneratorFunctionObject(ctx, Scope);
            case 12:
                return this.$InstantiateAsyncGeneratorFunctionObject(ctx, Scope);
            case 8:
                return this.$InstantiateAsyncFunctionObject(ctx, Scope);
        }
    }
    $InstantiateFunctionObject(ctx, Scope) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.$InstantiateFunctionObject(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const name = this.$name === void 0 ? intrinsics.default : this.$name.StringValue;
        const F = $Function.FunctionCreate(ctx, 'normal', this, Scope, strict);
        F.MakeConstructor(ctx);
        F.SetFunctionName(ctx, name);
        F['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return F;
    }
    $InstantiateGeneratorFunctionObject(ctx, Scope) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.$InstantiateFunctionObject(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const name = this.$name === void 0 ? intrinsics.default : this.$name.StringValue;
        const F = $Function.GeneratorFunctionCreate(ctx, 'normal', this, Scope, strict);
        const prototype = $Object.ObjectCreate(ctx, 'Generator', intrinsics['%GeneratorPrototype%']);
        const $DefinePropertyOrThrowResult = $DefinePropertyOrThrow(ctx, F, intrinsics.$prototype, new $PropertyDescriptor(realm, intrinsics.$prototype, {
            '[[Value]]': prototype,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.false,
        }));
        if ($DefinePropertyOrThrowResult.isAbrupt) {
            return $DefinePropertyOrThrowResult.enrichWith(ctx, this);
        }
        F.SetFunctionName(ctx, name);
        F['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return F;
    }
    $InstantiateAsyncGeneratorFunctionObject(ctx, Scope) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.$InstantiateFunctionObject(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const name = this.$name === void 0 ? intrinsics.default : this.$name.StringValue;
        const F = $Function.GeneratorFunctionCreate(ctx, 'normal', this, Scope, strict);
        const prototype = $Object.ObjectCreate(ctx, 'AsyncGenerator', intrinsics['%AsyncGeneratorPrototype%']);
        const $DefinePropertyOrThrowResult = $DefinePropertyOrThrow(ctx, F, intrinsics.$prototype, new $PropertyDescriptor(realm, intrinsics.$prototype, {
            '[[Value]]': prototype,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.false,
        }));
        if ($DefinePropertyOrThrowResult.isAbrupt) {
            return $DefinePropertyOrThrowResult.enrichWith(ctx, this);
        }
        F.SetFunctionName(ctx, name);
        F['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return F;
    }
    $InstantiateAsyncFunctionObject(ctx, Scope) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.$InstantiateFunctionObject(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const strict = new $Boolean(realm, this.DirectivePrologue.ContainsUseStrict === true);
        const name = this.$name === void 0 ? intrinsics.default : this.$name.StringValue;
        const F = $Function.GeneratorFunctionCreate(ctx, 'normal', this, Scope, strict);
        F.SetFunctionName(ctx, name);
        F['[[SourceText]]'] = new $String(realm, this.node.getText(this.mos.node));
        return F;
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        return EvaluateBody(this, ctx, functionObject, argumentsList);
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return new $Empty(realm, 1, intrinsics.empty, this);
    }
}
function EvaluateBody(fn, ctx, functionObject, argumentsList) {
    ctx.checkTimeout();
    fn.logger.debug(`${fn.path}.EvaluateBody(#${ctx.id})`);
    const realm = ctx.Realm;
    realm['[[Intrinsics]]'];
    const fdiResult = $FunctionDeclarationInstantiation(ctx, functionObject, argumentsList);
    if (fdiResult.isAbrupt) {
        return fdiResult.enrichWith(ctx, fn);
    }
    return fn.$body.Evaluate(ctx);
}
function $FunctionDeclarationInstantiation(ctx, func, argumentsList) {
    ctx.checkTimeout();
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const envRec = ctx.LexicalEnvironment;
    const code = func['[[ECMAScriptCode]]'];
    const strict = func['[[Strict]]'];
    const formals = code.$parameters;
    const parameterNames = formals.BoundNames;
    const hasDuplicates = formals.hasDuplicates;
    const simpleParameterList = formals.IsSimpleParameterList;
    const hasParameterExpressions = formals.ContainsExpression;
    const varNames = code.VarDeclaredNames;
    const varDeclarations = code.VarScopedDeclarations;
    const lexicalNames = code.LexicallyDeclaredNames;
    const functionNames = [];
    const functionsToInitialize = [];
    let i = varDeclarations.length;
    let d;
    while (--i >= 0) {
        d = varDeclarations[i];
        if (d instanceof $FunctionDeclaration) {
            const [fn] = d.BoundNames;
            if (!functionNames.some(x => x.is(fn))) {
                functionNames.unshift(fn);
                functionsToInitialize.unshift(d);
            }
        }
    }
    let argumentsObjectNeeded = true;
    if (func['[[ThisMode]]'] === 'lexical') {
        argumentsObjectNeeded = false;
    }
    else if (parameterNames.some(x => x['[[Value]]'] === 'arguments')) {
        argumentsObjectNeeded = false;
    }
    else if (!hasParameterExpressions) {
        if (functionNames.some(x => x['[[Value]]'] === 'arguments') || lexicalNames.some(x => x['[[Value]]'] === 'arguments')) {
            argumentsObjectNeeded = false;
        }
    }
    for (const paramName of parameterNames) {
        const alreadyDeclared = envRec.HasBinding(ctx, paramName);
        if (alreadyDeclared.isFalsey) {
            envRec.CreateMutableBinding(ctx, paramName, intrinsics.false);
            if (hasDuplicates) {
                envRec.InitializeBinding(ctx, paramName, intrinsics.undefined);
            }
        }
    }
    let ao;
    let parameterBindings;
    if (argumentsObjectNeeded) {
        if (strict.isTruthy || !simpleParameterList) {
            ao = $CreateUnmappedArgumentsObject(ctx, argumentsList);
        }
        else {
            ao = new $ArgumentsExoticObject(realm, func, formals, argumentsList, envRec);
        }
        if (strict.isTruthy) {
            envRec.CreateImmutableBinding(ctx, intrinsics.$arguments, intrinsics.false);
        }
        else {
            envRec.CreateMutableBinding(ctx, intrinsics.$arguments, intrinsics.false);
        }
        envRec.InitializeBinding(ctx, intrinsics.$arguments, ao);
        parameterBindings = parameterNames.concat(intrinsics.$arguments);
    }
    else {
        parameterBindings = parameterNames;
    }
    const iteratorRecord = $CreateListIteratorRecord(ctx, argumentsList);
    if (hasDuplicates) {
        for (const formal of formals) {
            const result = formal.InitializeIteratorBinding(ctx, iteratorRecord, void 0);
            if (result === null || result === void 0 ? void 0 : result.isAbrupt) {
                return result;
            }
        }
    }
    else {
        for (const formal of formals) {
            const result = formal.InitializeIteratorBinding(ctx, iteratorRecord, envRec);
            if (result === null || result === void 0 ? void 0 : result.isAbrupt) {
                return result;
            }
        }
    }
    let varEnvRec;
    if (!hasParameterExpressions) {
        const instantiatedVarNames = parameterBindings.slice();
        for (const n of varNames) {
            if (!instantiatedVarNames.some(x => x.is(n))) {
                instantiatedVarNames.push(n);
                envRec.CreateMutableBinding(ctx, n, intrinsics.false);
                envRec.InitializeBinding(ctx, n, intrinsics.undefined);
            }
        }
        varEnvRec = envRec;
    }
    else {
        varEnvRec = new $DeclarativeEnvRec(code.logger, realm, envRec);
        ctx.VariableEnvironment = varEnvRec;
        const instantiatedVarNames = [];
        for (const n of varNames) {
            if (!instantiatedVarNames.some(x => x.is(n))) {
                instantiatedVarNames.push(n);
                varEnvRec.CreateMutableBinding(ctx, n, intrinsics.false);
                let initialValue;
                if (!parameterBindings.some(x => x.is(n))) {
                    initialValue = intrinsics.undefined;
                }
                else {
                    initialValue = envRec.GetBindingValue(ctx, n, intrinsics.false);
                }
                varEnvRec.InitializeBinding(ctx, n, initialValue);
            }
        }
    }
    let lexEnvRec;
    if (strict.isFalsey) {
        lexEnvRec = new $DeclarativeEnvRec(code.logger, realm, varEnvRec);
    }
    else {
        lexEnvRec = varEnvRec;
    }
    ctx.LexicalEnvironment = lexEnvRec;
    const lexDeclarations = code.LexicallyScopedDeclarations;
    for (const d of lexDeclarations) {
        for (const dn of d.BoundNames) {
            if (d.IsConstantDeclaration) {
                lexEnvRec.CreateImmutableBinding(ctx, dn, intrinsics.true);
            }
            else {
                lexEnvRec.CreateMutableBinding(ctx, dn, intrinsics.false);
            }
        }
    }
    for (const f of functionsToInitialize) {
        const [fn] = f.BoundNames;
        if (f instanceof $FunctionDeclaration) {
            const fo = f.InstantiateFunctionObject(ctx, lexEnvRec);
            if (fo.isAbrupt) {
                return fo;
            }
            varEnvRec.SetMutableBinding(ctx, fn, fo, intrinsics.false);
        }
    }
    return new $Empty(realm, 1, intrinsics.empty);
}
class $ArrowFunction {
    get $kind() { return typescript.SyntaxKind.ArrowFunction; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ArrowFunction`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.BoundNames = kernel.emptyArray;
        this.HasName = false;
        this.LexicallyDeclaredNames = kernel.emptyArray;
        this.LexicallyScopedDeclarations = kernel.emptyArray;
        this.VarDeclaredNames = kernel.emptyArray;
        this.VarScopedDeclarations = kernel.emptyArray;
        this.TypeDeclarations = kernel.emptyArray;
        this.IsType = false;
        const modifierFlags = this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        if (node.body.kind === typescript.SyntaxKind.Block) {
            const DirectivePrologue = this.DirectivePrologue = GetDirectivePrologue(node.body.statements);
            if (DirectivePrologue.ContainsUseStrict) {
                ctx |= 65536;
                this.ContainsUseStrict = true;
            }
            else {
                this.ContainsUseStrict = false;
            }
            this.$parameters = this.CoveredFormalsList = new $FormalParameterList(node.parameters, this, ctx);
            this.$body = new $Block(node.body, this, ctx, -1);
        }
        else {
            this.DirectivePrologue = kernel.emptyArray;
            this.ContainsUseStrict = false;
            this.$parameters = this.CoveredFormalsList = new $FormalParameterList(node.parameters, this, ctx);
            this.$body = $assignmentExpression(node.body, this, ctx, -1);
        }
        this.functionKind = hasBit(modifierFlags, typescript.ModifierFlags.Async) ? 8 : 0;
    }
    Evaluate(ctx) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        this.logger.debug(`${this.path}.Evaluate(#${ctx.id})`);
        return intrinsics.undefined;
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        ctx.checkTimeout();
        if (this.$body.$kind === typescript.SyntaxKind.Block) {
            return $FunctionDeclaration.prototype.EvaluateBody.call(this, ctx, functionObject, argumentsList);
        }
        this.logger.debug(`${this.path}.EvaluateBody(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        return intrinsics.undefined;
    }
}
class MethodDefinitionRecord {
    get isAbrupt() { return false; }
    constructor(key, closure) {
        this['[[Key]]'] = key;
        this['[[Closure]]'] = closure;
    }
}
class $ConstructorDeclaration {
    get $kind() { return typescript.SyntaxKind.Constructor; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ConstructorDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.functionKind = 0;
        this.modifierFlags = modifiersToModifierFlags(typescript.getModifiers(node));
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        this.$parameters = new $FormalParameterList(node.parameters, this, ctx);
        const $body = this.$body = new $Block(node.body, this, ctx, -1);
        this.LexicallyDeclaredNames = $body.TopLevelLexicallyDeclaredNames;
        this.LexicallyScopedDeclarations = $body.TopLevelLexicallyScopedDeclarations;
        this.VarDeclaredNames = $body.TopLevelVarDeclaredNames;
        this.VarScopedDeclarations = $body.TopLevelVarScopedDeclarations;
    }
    DefineMethod(ctx, object, functionPrototype) {
        ctx.checkTimeout();
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const propKey = intrinsics.$constructor;
        const strict = intrinsics.true;
        const scope = ctx.LexicalEnvironment;
        const closure = $Function.FunctionCreate(ctx, 'normal', this, scope, strict, functionPrototype);
        closure['[[HomeObject]]'] = object;
        closure['[[SourceText]]'] = new $String(realm, this.parent.node.getText(this.mos.node));
        return new MethodDefinitionRecord(propKey, closure);
    }
    EvaluateBody(ctx, functionObject, argumentsList) {
        return EvaluateBody(this, ctx, functionObject, argumentsList);
    }
}
class $ParameterDeclaration {
    get $kind() { return typescript.SyntaxKind.Parameter; }
    constructor(node, parent, ctx, idx, mos = parent.mos, realm = parent.realm, depth = parent.depth + 1, logger = parent.logger, path = `${parent.path}${$i(idx)}.ParameterDeclaration`) {
        this.node = node;
        this.parent = parent;
        this.ctx = ctx;
        this.idx = idx;
        this.mos = mos;
        this.realm = realm;
        this.depth = depth;
        this.logger = logger;
        this.path = path;
        this.modifierFlags = this.combinedModifierFlags = modifiersToModifierFlags(typescript.canHaveModifiers(node) ? typescript.getModifiers(node) : undefined);
        ctx |= 16;
        this.$decorators = $decoratorList(typescript.getDecorators(node), this, ctx);
        const $name = this.$name = $$bindingName(node.name, this, ctx, -1);
        this.BoundNames = $name.BoundNames;
        if (node.initializer === void 0) {
            this.$initializer = void 0;
            this.ContainsExpression = $name.ContainsExpression;
            this.HasInitializer = false;
            this.IsSimpleParameterList = $name.IsSimpleParameterList;
        }
        else {
            this.$initializer = $assignmentExpression(node.initializer, this, ctx, -1);
            this.ContainsExpression = true;
            this.HasInitializer = true;
            this.IsSimpleParameterList = false;
        }
    }
    InitializeIteratorBinding(ctx, iteratorRecord, environment) {
        ctx.checkTimeout();
        this.logger.debug(`${this.path}.InitializeIteratorBinding(#${ctx.id})`);
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const BindingElement = this.$name;
        if (BindingElement.$kind === typescript.SyntaxKind.Identifier) {
            return BindingElement.InitializeIteratorBinding(ctx, iteratorRecord, environment, this.$initializer);
        }
        if (!this.ContainsExpression) {
            let v = intrinsics.undefined;
            if (iteratorRecord['[[Done]]'].isFalsey) {
                const next = $IteratorStep(ctx, iteratorRecord);
                if (next.isAbrupt) {
                    iteratorRecord['[[Done]]'] = intrinsics.true;
                    if (next.isAbrupt) {
                        return next;
                    }
                }
                if (next.isFalsey) {
                    iteratorRecord['[[Done]]'] = intrinsics.true;
                }
                else {
                    v = $IteratorValue(ctx, next);
                    if (v.isAbrupt) {
                        iteratorRecord['[[Done]]'] = intrinsics.true;
                        if (v.isAbrupt) {
                            return v;
                        }
                    }
                }
            }
            if (iteratorRecord['[[Done]]'].isTruthy) {
                v = intrinsics.undefined;
            }
            const initializer = this.$initializer;
            if (initializer !== void 0 && v.isUndefined) {
                const defaultValue = initializer.Evaluate(ctx);
                const $v = defaultValue.GetValue(ctx);
                if ($v.isAbrupt) {
                    return $v.enrichWith(ctx, this);
                }
            }
            return BindingElement.InitializeBinding(ctx, v, environment);
        }
    }
}

class $FunctionConstructor extends $BuiltinFunction {
    get length() {
        return this.getProperty(this.realm['[[Intrinsics]]'].length)['[[Value]]'];
    }
    set length(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].length, value);
    }
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Function%', functionPrototype);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return $CreateDynamicFunction(ctx, this, NewTarget, 0, argumentsList);
    }
}
class $FunctionPrototype extends $Object {
    get $apply() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$apply)['[[Value]]'];
    }
    set $apply(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$apply, value);
    }
    get $bind() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$bind)['[[Value]]'];
    }
    set $bind(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$bind, value);
    }
    get $call() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$call)['[[Value]]'];
    }
    set $call(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$call, value);
    }
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get $toString() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$toString)['[[Value]]'];
    }
    set $toString(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$toString, value);
    }
    get '@@hasInstance'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@hasInstance'])['[[Value]]'];
    }
    set '@@hasInstance'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@hasInstance'], value);
    }
    constructor(realm, objectPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%FunctionPrototype%', objectPrototype, 1, intrinsics.empty);
    }
}
class $FunctionPrototype_apply extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Function.prototype.apply', proto);
    }
    performSteps(ctx, thisArgument, [thisArg, argArray], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (thisArg === void 0) {
            thisArg = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $FunctionPrototype_bind extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Function.prototype.bind', proto);
    }
    performSteps(ctx, thisArgument, [thisArg, ...args], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (thisArg === void 0) {
            thisArg = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $FunctionPrototype_call extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Function.prototype.call', proto);
    }
    performSteps(ctx, thisArgument, [thisArg, ...args], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (thisArg === void 0) {
            thisArg = intrinsics.undefined;
        }
        const func = thisArgument;
        if (!func.isFunction) {
            return new $TypeError(realm, `Function.prototype.call called on ${func}, but expected a callable function`);
        }
        const argList = new $List();
        if (args.length > 0) {
            argList.push(...args);
        }
        ctx.suspend();
        realm.stack.pop();
        return $Call(realm.stack.top, func, thisArg, argList);
    }
}
class $FunctionPrototype_toString extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Function.prototype.toString', proto);
    }
    performSteps(ctx, thisArgument, [thisArg, ...args], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (thisArg === void 0) {
            thisArg = intrinsics.undefined;
        }
        throw new Error('Method not implemented.');
    }
}
class $FunctionPrototype_hasInstance extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Function.prototype.hasInstance', proto);
    }
    performSteps(ctx, thisArgument, [V], NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        throw new Error('Method not implemented.');
    }
}
function $CreateDynamicFunction(ctx, constructor, newTarget, kind, args) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const stack = realm.stack;
    const callerContext = stack[stack.length - 2];
    const callerRealm = callerContext.Realm;
    const calleeRealm = realm;
    const $HostEnsureCanCompileStringsResult = $HostEnsureCanCompileStrings(ctx, callerRealm, calleeRealm);
    if ($HostEnsureCanCompileStringsResult.isAbrupt) {
        return $HostEnsureCanCompileStringsResult;
    }
    if (newTarget.isUndefined) {
        newTarget = constructor;
    }
    let prefix;
    let fallbackProto;
    switch (kind) {
        case 0:
            prefix = 'function';
            fallbackProto = '%FunctionPrototype%';
            break;
        case 4:
            prefix = 'function*';
            fallbackProto = '%Generator%';
            break;
        case 8:
            prefix = 'async function';
            fallbackProto = '%AsyncFunctionPrototype%';
            break;
        case 12:
            prefix = 'async function*';
            fallbackProto = '%AsyncGenerator%';
            break;
    }
    const argCount = args.length;
    let P = intrinsics[''];
    let $bodyText;
    let bodyText;
    if (argCount === 0) {
        $bodyText = intrinsics[''];
    }
    else if (argCount === 1) {
        $bodyText = args[0];
    }
    else {
        const firstArg = args[0];
        const $P = firstArg.ToString(ctx);
        if ($P.isAbrupt) {
            return $P;
        }
        P = $P;
        let k = 1;
        while (k < argCount - 1) {
            const nextArg = args[k];
            const nextArgString = nextArg.ToString(ctx);
            if (nextArgString.isAbrupt) {
                return nextArgString;
            }
            P = new $String(realm, `${P['[[Value]]']},${nextArgString['[[Value]]']}`);
            ++k;
        }
        $bodyText = args[k];
    }
    $bodyText = $bodyText.ToString(ctx);
    if ($bodyText.isAbrupt) {
        return $bodyText;
    }
    bodyText = $bodyText;
    const sourceText = `${prefix} anonymous(${P['[[Value]]']}\n) {\n${bodyText['[[Value]]']}\n}`;
    const node = typescript.createSourceFile('', sourceText, typescript.ScriptTarget.Latest).statements[0];
    const ScriptOrModule = callerContext.ScriptOrModule;
    const $functionDeclaration = new $FunctionDeclaration(node, ScriptOrModule, 2, -1, ScriptOrModule, calleeRealm, 1, ScriptOrModule.logger, `${ScriptOrModule.path}[Dynamic].FunctionDeclaration`);
    const strict = $functionDeclaration.ContainsUseStrict;
    const proto = $GetPrototypeFromConstructor(ctx, newTarget, fallbackProto);
    if (proto.isAbrupt) {
        return proto;
    }
    const F = $Function.FunctionAllocate(ctx, proto, new $Boolean(realm, strict), kind);
    const realmF = F['[[Realm]]'];
    const scope = realmF['[[GlobalEnv]]'];
    $Function.FunctionInitialize(ctx, F, 'normal', $functionDeclaration, scope);
    if (kind === 4) {
        const prototype = new $Object(realm, 'anonymous generator', intrinsics['%GeneratorPrototype%'], 1, intrinsics.empty);
        $DefinePropertyOrThrow(ctx, F, intrinsics.$prototype, new $PropertyDescriptor(realm, intrinsics.$prototype, {
            '[[Value]]': prototype,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.false,
        }));
    }
    else if (kind === 12) {
        const prototype = new $Object(realm, 'anonymous async generator', intrinsics['%AsyncGeneratorPrototype%'], 1, intrinsics.empty);
        $DefinePropertyOrThrow(ctx, F, intrinsics.$prototype, new $PropertyDescriptor(realm, intrinsics.$prototype, {
            '[[Value]]': prototype,
            '[[Writable]]': intrinsics.true,
            '[[Enumerable]]': intrinsics.false,
            '[[Configurable]]': intrinsics.false,
        }));
    }
    else if (kind === 0) {
        F.MakeConstructor(ctx);
    }
    F.SetFunctionName(ctx, new $String(realm, 'anonymous'));
    F['[[SourceText]]'] = new $String(realm, sourceText);
    return F;
}

class $NumberConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Number%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        let n;
        if (value === void 0) {
            n = intrinsics['0'];
        }
        else {
            const $n = value.ToNumber(ctx);
            if ($n.isAbrupt) {
                return $n;
            }
            n = $n;
        }
        if (NewTarget.isUndefined) {
            return n;
        }
        return $OrdinaryCreateFromConstructor(ctx, NewTarget, '%NumberPrototype%', { '[[NumberData]]': n });
    }
}
class $NumberPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    constructor(realm, objectPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%NumberPrototype%', objectPrototype, 1, intrinsics.empty);
        this['[[NumberData]]'] = new $Number(realm, 0);
    }
}

class $BooleanConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Boolean%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        var _a;
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const b = (_a = value === null || value === void 0 ? void 0 : value.ToBoolean(ctx)) !== null && _a !== void 0 ? _a : intrinsics.undefined;
        if (b.isAbrupt) {
            return b;
        }
        if (NewTarget.isUndefined) {
            return b;
        }
        return $OrdinaryCreateFromConstructor(ctx, NewTarget, '%BooleanPrototype%', { '[[BooleanData]]': b });
    }
}
class $BooleanPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    constructor(realm, objectPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%BooleanPrototype%', objectPrototype, 1, intrinsics.empty);
        this['[[BooleanData]]'] = new $Boolean(realm, false);
    }
}

class $SymbolConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Symbol%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [description], NewTarget) {
        const realm = ctx.Realm;
        realm['[[Intrinsics]]'];
        if (!NewTarget.isUndefined) {
            return new $TypeError(realm, `Symbol is not a constructor`);
        }
        if (description === void 0 || description.isUndefined) {
            return new $Symbol(realm, new $Undefined(realm));
        }
        else {
            const descString = description.ToString(ctx);
            if (descString.isAbrupt) {
                return descString;
            }
            return new $Symbol(realm, descString);
        }
    }
}
class $SymbolPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    constructor(realm, objectPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%SymbolPrototype%', objectPrototype, 1, intrinsics.empty);
    }
}

class $ErrorConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Error%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [message], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const newTarget = NewTarget.isUndefined ? ctx.Function : NewTarget;
        const O = $OrdinaryCreateFromConstructor(ctx, newTarget, '%ErrorPrototype%', { '[[ErrorData]]': void 0 });
        if (O.isAbrupt) {
            return O;
        }
        if (message !== void 0) {
            const msg = message.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
            const msgDesc = new $PropertyDescriptor(realm, intrinsics.message, {
                '[[Value]]': msg,
                '[[Writable]]': intrinsics.true,
                '[[Enumerable]]': intrinsics.false,
                '[[Configurable]]': intrinsics.true,
            });
            $DefinePropertyOrThrow(ctx, O, intrinsics.message, msgDesc);
        }
        return O;
    }
}
class $ErrorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get message() {
        return this.getProperty(this.realm['[[Intrinsics]]'].message)['[[Value]]'];
    }
    set message(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].message, value);
    }
    get $name() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $name(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    get $toString() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $toString(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    constructor(realm, objectPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%ErrorPrototype%', objectPrototype, 1, intrinsics.empty);
    }
}
class $ErrorPrototype_toString extends $BuiltinFunction {
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const O = thisArgument;
        if (!O.isObject) {
            return new $TypeError(realm, `Error.prototype.toString called on ${O}, but expected an object`);
        }
        let name = O['[[Get]]'](ctx, intrinsics.$name, O);
        if (name.isAbrupt) {
            return name;
        }
        if (name.isUndefined) {
            name = new $String(realm, 'Error');
        }
        else {
            name = name.ToString(ctx);
            if (name.isAbrupt) {
                return name;
            }
        }
        let msg = O['[[Get]]'](ctx, intrinsics.message, O);
        if (msg.isAbrupt) {
            return msg;
        }
        if (msg.isUndefined) {
            msg = new $String(realm, '');
        }
        else {
            msg = msg.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
        }
        if (name['[[Value]]'] === '') {
            return msg;
        }
        if (msg['[[Value]]'] === '') {
            return name;
        }
        return new $String(realm, `${name['[[Value]]']}: ${msg['[[Value]]']}`);
    }
}
class $EvalErrorConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, errorConstructor) {
        super(realm, '%EvalError%', errorConstructor);
    }
    performSteps(ctx, thisArgument, [message], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const newTarget = NewTarget.isUndefined ? ctx.Function : NewTarget;
        const O = $OrdinaryCreateFromConstructor(ctx, newTarget, '%EvalErrorPrototype%', { '[[ErrorData]]': void 0 });
        if (O.isAbrupt) {
            return O;
        }
        if (message !== void 0) {
            const msg = message.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
            const msgDesc = new $PropertyDescriptor(realm, intrinsics.message, {
                '[[Value]]': msg,
                '[[Writable]]': intrinsics.true,
                '[[Enumerable]]': intrinsics.false,
                '[[Configurable]]': intrinsics.true,
            });
            $DefinePropertyOrThrow(ctx, O, intrinsics.message, msgDesc);
        }
        return O;
    }
}
class $EvalErrorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get message() {
        return this.getProperty(this.realm['[[Intrinsics]]'].message)['[[Value]]'];
    }
    set message(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].message, value);
    }
    get $name() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $name(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    constructor(realm, errorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%EvalErrorPrototype%', errorPrototype, 1, intrinsics.empty);
    }
}
class $RangeErrorConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, errorConstructor) {
        super(realm, '%RangeError%', errorConstructor);
    }
    performSteps(ctx, thisArgument, [message], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const newTarget = NewTarget.isUndefined ? ctx.Function : NewTarget;
        const O = $OrdinaryCreateFromConstructor(ctx, newTarget, '%RangeErrorPrototype%', { '[[ErrorData]]': void 0 });
        if (O.isAbrupt) {
            return O;
        }
        if (message !== void 0) {
            const msg = message.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
            const msgDesc = new $PropertyDescriptor(realm, intrinsics.message, {
                '[[Value]]': msg,
                '[[Writable]]': intrinsics.true,
                '[[Enumerable]]': intrinsics.false,
                '[[Configurable]]': intrinsics.true,
            });
            $DefinePropertyOrThrow(ctx, O, intrinsics.message, msgDesc);
        }
        return O;
    }
}
class $RangeErrorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get message() {
        return this.getProperty(this.realm['[[Intrinsics]]'].message)['[[Value]]'];
    }
    set message(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].message, value);
    }
    get $name() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $name(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    constructor(realm, errorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%RangeErrorPrototype%', errorPrototype, 1, intrinsics.empty);
    }
}
class $ReferenceErrorConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, errorConstructor) {
        super(realm, '%ReferenceError%', errorConstructor);
    }
    performSteps(ctx, thisArgument, [message], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const newTarget = NewTarget.isUndefined ? ctx.Function : NewTarget;
        const O = $OrdinaryCreateFromConstructor(ctx, newTarget, '%ReferenceErrorPrototype%', { '[[ErrorData]]': void 0 });
        if (O.isAbrupt) {
            return O;
        }
        if (message !== void 0) {
            const msg = message.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
            const msgDesc = new $PropertyDescriptor(realm, intrinsics.message, {
                '[[Value]]': msg,
                '[[Writable]]': intrinsics.true,
                '[[Enumerable]]': intrinsics.false,
                '[[Configurable]]': intrinsics.true,
            });
            $DefinePropertyOrThrow(ctx, O, intrinsics.message, msgDesc);
        }
        return O;
    }
}
class $ReferenceErrorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get message() {
        return this.getProperty(this.realm['[[Intrinsics]]'].message)['[[Value]]'];
    }
    set message(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].message, value);
    }
    get $name() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $name(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    constructor(realm, errorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%ReferenceErrorPrototype%', errorPrototype, 1, intrinsics.empty);
    }
}
class $SyntaxErrorConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, errorConstructor) {
        super(realm, '%SyntaxError%', errorConstructor);
    }
    performSteps(ctx, thisArgument, [message], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const newTarget = NewTarget.isUndefined ? ctx.Function : NewTarget;
        const O = $OrdinaryCreateFromConstructor(ctx, newTarget, '%SyntaxErrorPrototype%', { '[[ErrorData]]': void 0 });
        if (O.isAbrupt) {
            return O;
        }
        if (message !== void 0) {
            const msg = message.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
            const msgDesc = new $PropertyDescriptor(realm, intrinsics.message, {
                '[[Value]]': msg,
                '[[Writable]]': intrinsics.true,
                '[[Enumerable]]': intrinsics.false,
                '[[Configurable]]': intrinsics.true,
            });
            $DefinePropertyOrThrow(ctx, O, intrinsics.message, msgDesc);
        }
        return O;
    }
}
class $SyntaxErrorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get message() {
        return this.getProperty(this.realm['[[Intrinsics]]'].message)['[[Value]]'];
    }
    set message(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].message, value);
    }
    get $name() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $name(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    constructor(realm, errorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%SyntaxErrorPrototype%', errorPrototype, 1, intrinsics.empty);
    }
}
class $TypeErrorConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, errorConstructor) {
        super(realm, '%TypeError%', errorConstructor);
    }
    performSteps(ctx, thisArgument, [message], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const newTarget = NewTarget.isUndefined ? ctx.Function : NewTarget;
        const O = $OrdinaryCreateFromConstructor(ctx, newTarget, '%TypeErrorPrototype%', { '[[ErrorData]]': void 0 });
        if (O.isAbrupt) {
            return O;
        }
        if (message !== void 0) {
            const msg = message.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
            const msgDesc = new $PropertyDescriptor(realm, intrinsics.message, {
                '[[Value]]': msg,
                '[[Writable]]': intrinsics.true,
                '[[Enumerable]]': intrinsics.false,
                '[[Configurable]]': intrinsics.true,
            });
            $DefinePropertyOrThrow(ctx, O, intrinsics.message, msgDesc);
        }
        return O;
    }
}
class $TypeErrorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get message() {
        return this.getProperty(this.realm['[[Intrinsics]]'].message)['[[Value]]'];
    }
    set message(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].message, value);
    }
    get $name() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $name(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    constructor(realm, errorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%TypeErrorPrototype%', errorPrototype, 1, intrinsics.empty);
    }
}
class $URIErrorConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    constructor(realm, errorConstructor) {
        super(realm, '%URIError%', errorConstructor);
    }
    performSteps(ctx, thisArgument, [message], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const newTarget = NewTarget.isUndefined ? ctx.Function : NewTarget;
        const O = $OrdinaryCreateFromConstructor(ctx, newTarget, '%URIErrorPrototype%', { '[[ErrorData]]': void 0 });
        if (O.isAbrupt) {
            return O;
        }
        if (message !== void 0) {
            const msg = message.ToString(ctx);
            if (msg.isAbrupt) {
                return msg;
            }
            const msgDesc = new $PropertyDescriptor(realm, intrinsics.message, {
                '[[Value]]': msg,
                '[[Writable]]': intrinsics.true,
                '[[Enumerable]]': intrinsics.false,
                '[[Configurable]]': intrinsics.true,
            });
            $DefinePropertyOrThrow(ctx, O, intrinsics.message, msgDesc);
        }
        return O;
    }
}
class $URIErrorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
    }
    get message() {
        return this.getProperty(this.realm['[[Intrinsics]]'].message)['[[Value]]'];
    }
    set message(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].message, value);
    }
    get $name() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$name)['[[Value]]'];
    }
    set $name(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$name, value);
    }
    constructor(realm, errorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%URIErrorPrototype%', errorPrototype, 1, intrinsics.empty);
    }
}

class $ThrowTypeError extends $BuiltinFunction {
    performSteps(ctx, thisArgument, [thisArg, ...args], NewTarget) {
        return new $TypeError(ctx.Realm);
    }
}

class $GeneratorFunctionConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    get length() {
        return this.getProperty(this.realm['[[Intrinsics]]'].length)['[[Value]]'];
    }
    set length(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].length, value, false, false, true);
    }
    constructor(realm, functionConstructor) {
        super(realm, '%GeneratorFunction%', functionConstructor);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return $CreateDynamicFunction(ctx, this, NewTarget, 4, argumentsList);
    }
}
class $GeneratorFunctionPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value, false, false, true);
    }
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, true);
    }
    get '@@toStringTag'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
    }
    set '@@toStringTag'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
    }
    constructor(realm, functionPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%Generator%', functionPrototype, 1, intrinsics.empty);
    }
}
class $GeneratorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value, false, false, true);
    }
    get next() {
        return this.getProperty(this.realm['[[Intrinsics]]'].next)['[[Value]]'];
    }
    set next(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].next, value);
    }
    get return() {
        return this.getProperty(this.realm['[[Intrinsics]]'].return)['[[Value]]'];
    }
    set return(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].return, value);
    }
    get throw() {
        return this.getProperty(this.realm['[[Intrinsics]]'].throw)['[[Value]]'];
    }
    set throw(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].throw, value);
    }
    get '@@toStringTag'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
    }
    set '@@toStringTag'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
    }
    constructor(realm, iteratorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%GeneratorPrototype%', iteratorPrototype, 1, intrinsics.empty);
    }
}
class $GeneratorPrototype_next extends $BuiltinFunction {
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const g = thisArgument;
        return $GeneratorResume(ctx, g, value);
    }
}
class $GeneratorPrototype_return extends $BuiltinFunction {
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const g = thisArgument;
        const C = value.ToCompletion(4, intrinsics.empty);
        return $GeneratorResumeAbrupt(ctx, g, C);
    }
}
class $GeneratorPrototype_throw extends $BuiltinFunction {
    performSteps(ctx, thisArgument, [exception], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (exception === void 0) {
            exception = intrinsics.undefined;
        }
        const g = thisArgument;
        const C = exception.ToCompletion(5, intrinsics.empty);
        return $GeneratorResumeAbrupt(ctx, g, C);
    }
}
var GeneratorState;
(function (GeneratorState) {
    GeneratorState[GeneratorState["none"] = 0] = "none";
    GeneratorState[GeneratorState["suspendedStart"] = 1] = "suspendedStart";
    GeneratorState[GeneratorState["suspendedYield"] = 2] = "suspendedYield";
    GeneratorState[GeneratorState["executing"] = 3] = "executing";
    GeneratorState[GeneratorState["completed"] = 4] = "completed";
})(GeneratorState || (GeneratorState = {}));
class $GeneratorInstance extends $Object {
    constructor(realm, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'GeneratorInstance', proto, 1, intrinsics.empty);
        this['[[GeneratorState]]'] = 0;
        this['[[GeneratorContext]]'] = void 0;
    }
}
class $GeneratorState {
    get isAbrupt() { return false; }
    constructor(value) {
        this.value = value;
    }
}
function $GeneratorValidate(ctx, generator) {
    const realm = ctx.Realm;
    if (!(generator instanceof $GeneratorInstance)) {
        return new $TypeError(realm, `Expected generator to be an GeneratorInstance, but got: ${generator}`);
    }
    const state = generator['[[GeneratorState]]'];
    if (state === 3) {
        return new $TypeError(realm, `Generator validation failed: already executing`);
    }
    return new $GeneratorState(state);
}
function $GeneratorResume(ctx, _generator, value) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const stack = realm.stack;
    const $state = $GeneratorValidate(ctx, _generator);
    if ($state.isAbrupt) {
        return $state;
    }
    const state = $state.value;
    const generator = _generator;
    if (state === 4) {
        return $CreateIterResultObject(ctx, intrinsics.undefined, intrinsics.true);
    }
    const genContext = generator['[[GeneratorContext]]'];
    const methodContext = ctx;
    methodContext.suspend();
    generator['[[GeneratorState]]'] = 3;
    stack.push(genContext);
    genContext.resume();
    const result = genContext.onResume(value);
    return result;
}
function $GeneratorResumeAbrupt(ctx, _generator, abruptCompletion) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const stack = realm.stack;
    const $state = $GeneratorValidate(ctx, _generator);
    if ($state.isAbrupt) {
        return $state;
    }
    let state = $state.value;
    const generator = _generator;
    if (state === 1) {
        generator['[[GeneratorState]]'] = 4;
        state = 4;
    }
    if (state === 4) {
        if (abruptCompletion['[[Type]]'] === 4) {
            return $CreateIterResultObject(ctx, abruptCompletion, intrinsics.true);
        }
        return abruptCompletion;
    }
    const genContext = generator['[[GeneratorContext]]'];
    const methodContext = ctx;
    methodContext.suspend();
    generator['[[GeneratorState]]'] = 3;
    stack.push(genContext);
    genContext.resume();
    const result = genContext.onResume(abruptCompletion);
    return result;
}
var GeneratorKind;
(function (GeneratorKind) {
    GeneratorKind[GeneratorKind["none"] = 0] = "none";
    GeneratorKind[GeneratorKind["async"] = 1] = "async";
    GeneratorKind[GeneratorKind["sync"] = 2] = "sync";
})(GeneratorKind || (GeneratorKind = {}));

class $AsyncFunctionConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    get length() {
        return this.getProperty(this.realm['[[Intrinsics]]'].length)['[[Value]]'];
    }
    set length(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].length, value, false, false, true);
    }
    constructor(realm, functionConstructor) {
        super(realm, '%AsyncFunction%', functionConstructor);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return $CreateDynamicFunction(ctx, this, NewTarget, 8, argumentsList);
    }
}
class $AsyncFunctionPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value, false, false, true);
    }
    get '@@toStringTag'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
    }
    set '@@toStringTag'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
    }
    constructor(realm, functionPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%AsyncFunctionPrototype%', functionPrototype, 1, intrinsics.empty);
    }
}

class $AsyncGeneratorFunctionConstructor extends $BuiltinFunction {
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
    }
    get length() {
        return this.getProperty(this.realm['[[Intrinsics]]'].length)['[[Value]]'];
    }
    set length(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].length, value, false, false, true);
    }
    constructor(realm, functionConstructor) {
        super(realm, '%AsyncGeneratorFunction%', functionConstructor);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        return $CreateDynamicFunction(ctx, this, NewTarget, 12, argumentsList);
    }
}
class $AsyncGeneratorFunctionPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value, false, false, true);
    }
    get $prototype() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
    }
    set $prototype(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, true);
    }
    get '@@toStringTag'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
    }
    set '@@toStringTag'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
    }
    constructor(realm, functionPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%AsyncGenerator%', functionPrototype, 1, intrinsics.empty);
    }
}
class $AsyncGeneratorPrototype extends $Object {
    get $constructor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
    }
    set $constructor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value, false, false, true);
    }
    get next() {
        return this.getProperty(this.realm['[[Intrinsics]]'].next)['[[Value]]'];
    }
    set next(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].next, value);
    }
    get return() {
        return this.getProperty(this.realm['[[Intrinsics]]'].return)['[[Value]]'];
    }
    set return(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].return, value);
    }
    get throw() {
        return this.getProperty(this.realm['[[Intrinsics]]'].throw)['[[Value]]'];
    }
    set throw(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].throw, value);
    }
    get '@@toStringTag'() {
        return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
    }
    set '@@toStringTag'(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
    }
    constructor(realm, iteratorPrototype) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, '%AsyncGeneratorPrototype%', iteratorPrototype, 1, intrinsics.empty);
    }
}
class $AsyncGeneratorPrototype_next extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'AsyncGenerator.prototype.next', proto);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const generator = thisArgument;
        const completion = value;
        return $AsyncGeneratorEnqueue(ctx, generator, completion);
    }
}
class $AsyncGeneratorPrototype_return extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'AsyncGenerator.prototype.return', proto);
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const generator = thisArgument;
        const completion = value.ToCompletion(4, intrinsics.empty);
        return $AsyncGeneratorEnqueue(ctx, generator, completion);
    }
}
class $AsyncGeneratorPrototype_throw extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'AsyncGenerator.prototype.throw', proto);
    }
    performSteps(ctx, thisArgument, [exception], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (exception === void 0) {
            exception = intrinsics.undefined;
        }
        const generator = thisArgument;
        const completion = exception.ToCompletion(5, intrinsics.empty);
        return $AsyncGeneratorEnqueue(ctx, generator, completion);
    }
}
var AsyncGeneratorState;
(function (AsyncGeneratorState) {
    AsyncGeneratorState[AsyncGeneratorState["none"] = 0] = "none";
    AsyncGeneratorState[AsyncGeneratorState["suspendedStart"] = 1] = "suspendedStart";
    AsyncGeneratorState[AsyncGeneratorState["suspendedYield"] = 2] = "suspendedYield";
    AsyncGeneratorState[AsyncGeneratorState["executing"] = 3] = "executing";
    AsyncGeneratorState[AsyncGeneratorState["awaitingReturn"] = 4] = "awaitingReturn";
    AsyncGeneratorState[AsyncGeneratorState["completed"] = 5] = "completed";
})(AsyncGeneratorState || (AsyncGeneratorState = {}));
class $AsyncGeneratorInstance extends $Object {
    constructor(realm, proto) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'AsyncGeneratorInstance', proto, 1, intrinsics.empty);
        this['[[AsyncGeneratorState]]'] = 0;
        this['[[AsyncGeneratorContext]]'] = void 0;
    }
}
class $AsyncGeneratorRequest {
    constructor(completion, capability) {
        this['[[Completion]]'] = completion;
        this['[[Capability]]'] = capability;
    }
    is(other) {
        return this === other;
    }
}
function $AsyncGeneratorResolve(ctx, generator, value, done) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const queue = generator['[[AsyncGeneratorQueue]]'];
    const next = queue.shift();
    const promiseCapability = next['[[Capability]]'];
    const iteratorResult = $CreateIterResultObject(ctx, value, done);
    $Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new $List(iteratorResult));
    $AsyncGeneratorResumeNext(ctx, generator);
    return intrinsics.undefined;
}
function $AsyncGeneratorReject(ctx, generator, exception) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const queue = generator['[[AsyncGeneratorQueue]]'];
    const next = queue.shift();
    const promiseCapability = next['[[Capability]]'];
    $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(exception));
    $AsyncGeneratorResumeNext(ctx, generator);
    return intrinsics.undefined;
}
function $AsyncGeneratorResumeNext(ctx, generator) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const stack = realm.stack;
    let state = generator['[[AsyncGeneratorState]]'];
    if (state === 4) {
        return intrinsics.undefined;
    }
    const queue = generator['[[AsyncGeneratorQueue]]'];
    if (queue.length === 0) {
        return intrinsics.undefined;
    }
    const next = queue[0];
    const completion = next['[[Completion]]'];
    if (completion.isAbrupt) {
        if (state === 1) {
            generator['[[AsyncGeneratorState]]'] = 5;
            state = 5;
        }
        if (state === 5) {
            if (completion['[[Type]]'] === 4) {
                generator['[[AsyncGeneratorState]]'] = 4;
                const promise = $PromiseResolve(ctx, intrinsics['%Promise%'], new $List(completion));
                if (promise.isAbrupt) {
                    return promise;
                }
                const onFulfilled = new $AsyncGeneratorResumeNext_Return_Processor_Fulfilled(realm, generator);
                const onRejected = new $AsyncGeneratorResumeNext_Return_Processor_Rejected(realm, generator);
                $PerformPromiseThen(ctx, promise, onFulfilled, onRejected);
                return intrinsics.undefined;
            }
            else {
                $AsyncGeneratorReject(ctx, generator, completion);
                return intrinsics.undefined;
            }
        }
    }
    else if (state === 5) {
        return $AsyncGeneratorResolve(ctx, generator, intrinsics.undefined, intrinsics.true);
    }
    const genContext = generator['[[AsyncGeneratorContext]]'];
    const callerContext = ctx;
    callerContext.suspend();
    generator['[[AsyncGeneratorState]]'] = 3;
    stack.push(genContext);
    genContext.resume();
    genContext.onResume(completion);
    return intrinsics.undefined;
}
class $AsyncGeneratorResumeNext_Return_Processor_Fulfilled extends $BuiltinFunction {
    constructor(realm, generator) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'AsyncGeneratorResumeNext Return Processor Fulfilled', intrinsics['%FunctionPrototype%']);
        this['[[Generator]]'] = generator;
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const F = this;
        F['[[Generator]]']['[[AsyncGeneratorState]]'] = 5;
        return $AsyncGeneratorResolve(ctx, F['[[Generator]]'], value, intrinsics.true);
    }
}
class $AsyncGeneratorResumeNext_Return_Processor_Rejected extends $BuiltinFunction {
    constructor(realm, generator) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'AsyncGeneratorResumeNext Return Processor Rejected', intrinsics['%FunctionPrototype%']);
        this['[[Generator]]'] = generator;
    }
    performSteps(ctx, thisArgument, [value], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (value === void 0) {
            value = intrinsics.undefined;
        }
        const F = this;
        F['[[Generator]]']['[[AsyncGeneratorState]]'] = 5;
        return $AsyncGeneratorResolve(ctx, F['[[Generator]]'], value, intrinsics.true);
    }
}
function $AsyncGeneratorEnqueue(ctx, generator, completion) {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const promiseCapability = $NewPromiseCapability(ctx, intrinsics['%Promise%']);
    if (!(generator instanceof $AsyncGeneratorInstance)) {
        const badGeneratorError = new $TypeError(realm, `Expected generator to be AsyncGeneratorInstance, but got: ${generator}`);
        $Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new $List(badGeneratorError));
        return promiseCapability['[[Promise]]'];
    }
    const queue = generator['[[AsyncGeneratorQueue]]'];
    const request = new $AsyncGeneratorRequest(completion, promiseCapability);
    queue.push(request);
    const state = generator['[[AsyncGeneratorState]]'];
    if (state !== 3) {
        $AsyncGeneratorResumeNext(ctx, generator);
    }
    return promiseCapability['[[Promise]]'];
}

class $ProxyExoticObject extends $Object {
    get isProxy() { return true; }
    constructor(realm, target, handler) {
        super(realm, 'ProxyExoticObject', realm['[[Intrinsics]]'].null, 1, realm['[[Intrinsics]]'].empty);
        if (!target.isObject) {
            return new $TypeError(realm);
        }
        if (target.isProxy && target['[[ProxyHandler]]'].isNull) {
            return new $TypeError(realm);
        }
        if (!handler.isObject) {
            return new $TypeError(realm);
        }
        if (handler instanceof $ProxyExoticObject && handler['[[ProxyHandler]]'].isNull) {
            return new $TypeError(realm);
        }
        this['[[ProxyTarget]]'] = target;
        this['[[ProxyHandler]]'] = handler;
    }
    '[[GetPrototypeOf]]'(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$getPrototypeOf);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[GetPrototypeOf]]'](ctx);
        }
        const handlerProto = $Call(ctx, trap, handler, new $List(target));
        if (handlerProto.isAbrupt) {
            return handlerProto;
        }
        if (!handlerProto.isNull && !handlerProto.isObject) {
            return new $TypeError(realm, `Proxy handler prototype is ${handlerProto}, but expected Object or Null`);
        }
        const extensibleTarget = target['[[IsExtensible]]'](ctx);
        if (extensibleTarget.isAbrupt) {
            return extensibleTarget;
        }
        if (extensibleTarget.isTruthy) {
            return handlerProto;
        }
        const targetProto = target['[[GetPrototypeOf]]'](ctx);
        if (targetProto.isAbrupt) {
            return targetProto;
        }
        if (!handlerProto.is(targetProto)) {
            return new $TypeError(realm, `Expected handler prototype ${handlerProto} to be the same value as target prototype ${targetProto}`);
        }
        return handlerProto;
    }
    '[[SetPrototypeOf]]'(ctx, V) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$setPrototypeOf);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[SetPrototypeOf]]'](ctx, V);
        }
        const booleanTrapResult = $Call(ctx, trap, handler, new $List(target, V)).ToBoolean(ctx);
        if (booleanTrapResult.isAbrupt) {
            return booleanTrapResult;
        }
        if (booleanTrapResult.isFalsey) {
            return intrinsics.false;
        }
        const extensibleTarget = target['[[IsExtensible]]'](ctx);
        if (extensibleTarget.isAbrupt) {
            return extensibleTarget;
        }
        if (extensibleTarget.isTruthy) {
            return intrinsics.true;
        }
        const targetProto = target['[[GetPrototypeOf]]'](ctx);
        if (targetProto.isAbrupt) {
            return targetProto;
        }
        if (!V.is(targetProto)) {
            return new $TypeError(realm, `Expected value ${V} to be the same value as target prototype ${targetProto}`);
        }
        return intrinsics.true;
    }
    '[[IsExtensible]]'(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$isExtensible);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[IsExtensible]]'](ctx);
        }
        const booleanTrapResult = $Call(ctx, trap, handler, new $List(target)).ToBoolean(ctx);
        const targetResult = target['[[IsExtensible]]'](ctx);
        if (targetResult.isAbrupt) {
            return targetResult;
        }
        if (!booleanTrapResult.is(targetResult)) {
            return new $TypeError(realm, `Expected booleanTrapResult ${booleanTrapResult} to be the same value as targetResult ${targetResult}`);
        }
        return booleanTrapResult;
    }
    '[[PreventExtensions]]'(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$preventExtensions);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[PreventExtensions]]'](ctx);
        }
        const booleanTrapResult = $Call(ctx, trap, handler, new $List(target)).ToBoolean(ctx);
        if (booleanTrapResult.isAbrupt) {
            return booleanTrapResult;
        }
        if (booleanTrapResult.isTruthy) {
            const targetIsExtensible = target['[[IsExtensible]]'](ctx);
            if (targetIsExtensible.isAbrupt) {
                return targetIsExtensible;
            }
            if (targetIsExtensible.isTruthy) {
                return new $TypeError(realm, `Target is still extensible`);
            }
        }
        return booleanTrapResult;
    }
    '[[GetOwnProperty]]'(ctx, P) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$getOwnPropertyDescriptor);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[GetOwnProperty]]'](ctx, P);
        }
        const trapResultObj = $Call(ctx, trap, handler, new $List(target, P));
        if (trapResultObj.isAbrupt) {
            return trapResultObj;
        }
        if (!trapResultObj.isObject && !trapResultObj.isUndefined) {
            return new $TypeError(realm, `trapResultObj from GetOwnProperty(${P}) is ${trapResultObj}, but expected Object or Undefined`);
        }
        const targetDesc = target['[[GetOwnProperty]]'](ctx, P);
        if (targetDesc.isAbrupt) {
            return targetDesc;
        }
        if (trapResultObj.isUndefined) {
            if (targetDesc.isUndefined) {
                return intrinsics.undefined;
            }
            if (targetDesc['[[Configurable]]'].isFalsey) {
                return new $TypeError(realm, `The proxy returned undefined for property descriptor ${P}, but there is a backing property descriptor which is not configurable`);
            }
            const extensibleTarget = target['[[IsExtensible]]'](ctx);
            if (extensibleTarget.isAbrupt) {
                return extensibleTarget;
            }
            if (extensibleTarget.isFalsey) {
                return new $TypeError(realm, `The proxy returned undefined for property descriptor ${P}, but there is a backing property descriptor and the backing object is not extensible`);
            }
            return intrinsics.undefined;
        }
        const extensibleTarget = target['[[IsExtensible]]'](ctx);
        if (extensibleTarget.isAbrupt) {
            return extensibleTarget;
        }
        const resultDesc = $ToPropertyDescriptor(ctx, trapResultObj, P);
        if (resultDesc.isAbrupt) {
            return resultDesc;
        }
        resultDesc.Complete(ctx);
        const valid = $ValidateAndApplyPropertyDescriptor(ctx, intrinsics.undefined, intrinsics.undefined, extensibleTarget, resultDesc, targetDesc);
        if (valid.isFalsey) {
            return new $TypeError(realm, `Validation for property descriptor ${P} failed`);
        }
        if (resultDesc['[[Configurable]]'].isFalsey) {
            if (targetDesc.isUndefined || targetDesc['[[Configurable]]'].isTruthy) {
                return new $TypeError(realm, `The proxy returned a non-configurable property descriptor for ${P}, but the backing property descriptor is either undefined or configurable`);
            }
        }
        return resultDesc;
    }
    '[[DefineOwnProperty]]'(ctx, P, Desc) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$defineProperty);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[DefineOwnProperty]]'](ctx, P, Desc);
        }
        const descObj = $FromPropertyDescriptor(ctx, Desc);
        if (descObj.isAbrupt) {
            return descObj;
        }
        const booleanTrapResult = $Call(ctx, trap, handler, new $List(target, P, descObj)).ToBoolean(ctx);
        if (booleanTrapResult.isAbrupt) {
            return booleanTrapResult;
        }
        if (booleanTrapResult.isFalsey) {
            return intrinsics.false;
        }
        const targetDesc = target['[[GetOwnProperty]]'](ctx, P);
        if (targetDesc.isAbrupt) {
            return targetDesc;
        }
        const extensibleTarget = target['[[IsExtensible]]'](ctx);
        if (extensibleTarget.isAbrupt) {
            return extensibleTarget;
        }
        let settingConfigFalse;
        if (Desc['[[Configurable]]'].hasValue && Desc['[[Configurable]]'].isFalsey) {
            settingConfigFalse = true;
        }
        else {
            settingConfigFalse = false;
        }
        if (targetDesc.isUndefined) {
            if (extensibleTarget.isFalsey) {
                return new $TypeError(realm, `Cannot define property ${P} on non-extensible target`);
            }
            if (!settingConfigFalse) {
                return new $TypeError(realm, `Cannot define non-configurable property ${P} on proxy`);
            }
        }
        else {
            if ($ValidateAndApplyPropertyDescriptor(ctx, intrinsics.undefined, intrinsics.undefined, extensibleTarget, Desc, targetDesc).isFalsey) {
                return new $TypeError(realm, `The provided property descriptor for ${P} is not compatible with the proxy target's existing descriptor`);
            }
            if (settingConfigFalse && targetDesc['[[Configurable]]'].isTruthy) {
                return new $TypeError(realm, `The provided property descriptor for ${P} is not configurable but the proxy target's existing descriptor is`);
            }
        }
        return intrinsics.true;
    }
    '[[HasProperty]]'(ctx, P) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$has);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[HasProperty]]'](ctx, P);
        }
        const booleanTrapResult = $Call(ctx, trap, handler, new $List(target, P)).ToBoolean(ctx);
        if (booleanTrapResult.isAbrupt) {
            return booleanTrapResult;
        }
        if (booleanTrapResult.isFalsey) {
            const targetDesc = target['[[GetOwnProperty]]'](ctx, P);
            if (targetDesc.isAbrupt) {
                return targetDesc;
            }
            if (!targetDesc.isUndefined) {
                if (targetDesc['[[Configurable]]'].isFalsey) {
                    return new $TypeError(realm, `The proxy returned false for HasProperty for ${P}, but the backing object has a property with that name which is not configurable`);
                }
                const extensibleTarget = target['[[IsExtensible]]'](ctx);
                if (extensibleTarget.isAbrupt) {
                    return extensibleTarget;
                }
                if (extensibleTarget.isFalsey) {
                    return new $TypeError(realm, `The proxy returned false for HasProperty for ${P}, but the backing object has a property with that name and is not extensible`);
                }
            }
        }
        return booleanTrapResult;
    }
    '[[Get]]'(ctx, P, Receiver) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$get);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[Get]]'](ctx, P, Receiver);
        }
        const trapResult = $Call(ctx, trap, handler, new $List(target, P, Receiver));
        if (trapResult.isAbrupt) {
            return trapResult;
        }
        const targetDesc = target['[[GetOwnProperty]]'](ctx, P);
        if (targetDesc.isAbrupt) {
            return targetDesc;
        }
        if (!targetDesc.isUndefined && targetDesc['[[Configurable]]'].isFalsey) {
            if (targetDesc.isDataDescriptor && targetDesc['[[Writable]]'].isFalsey) {
                if (!trapResult.is(targetDesc['[[Value]]'])) {
                    return new $TypeError(realm, `The value returned by the proxy's getter for ${P} (${trapResult}) is different from the backing property's value (${targetDesc}), but the backing descriptor is neither configurable nor writable`);
                }
            }
            if (targetDesc.isAccessorDescriptor && targetDesc['[[Get]]'].isUndefined) {
                if (!trapResult.isUndefined) {
                    return new $TypeError(realm, `The proxy's getter for ${P} returned (${trapResult}), but expected undefined because the backing property's accessor descriptor has no getter and is not configurable`);
                }
            }
        }
        return trapResult;
    }
    '[[Set]]'(ctx, P, V, Receiver) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$set);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[Set]]'](ctx, P, V, Receiver);
        }
        const booleanTrapResult = $Call(ctx, trap, handler, new $List(target, P, V, Receiver)).ToBoolean(ctx);
        if (booleanTrapResult.isAbrupt) {
            return booleanTrapResult;
        }
        if (booleanTrapResult.isFalsey) {
            return intrinsics.false;
        }
        const targetDesc = target['[[GetOwnProperty]]'](ctx, P);
        if (targetDesc.isAbrupt) {
            return targetDesc;
        }
        if (!targetDesc.isUndefined && targetDesc['[[Configurable]]'].isFalsey) {
            if (targetDesc.isDataDescriptor && targetDesc['[[Writable]]'].isFalsey) {
                if (!V.is(targetDesc['[[Value]]'])) {
                    return new $TypeError(realm, `The value supplied to the proxy's setter for ${P} (${V}) is different from the backing property's value (${targetDesc}), but the backing descriptor is neither configurable nor writable`);
                }
            }
            if (targetDesc.isAccessorDescriptor) {
                if (targetDesc['[[Set]]'].isUndefined) {
                    return new $TypeError(realm, `The proxy's setter for ${P} was invoked, but the backing property's accessor descriptor has no setter and is not configurable`);
                }
            }
        }
        return intrinsics.true;
    }
    '[[Delete]]'(ctx, P) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$deleteProperty);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[Delete]]'](ctx, P);
        }
        const booleanTrapResult = $Call(ctx, trap, handler, new $List(target, P)).ToBoolean(ctx);
        if (booleanTrapResult.isAbrupt) {
            return booleanTrapResult;
        }
        if (booleanTrapResult.isFalsey) {
            return intrinsics.false;
        }
        const targetDesc = target['[[GetOwnProperty]]'](ctx, P);
        if (targetDesc.isAbrupt) {
            return targetDesc;
        }
        if (targetDesc.isUndefined) {
            return intrinsics.true;
        }
        if (targetDesc['[[Configurable]]'].isFalsey) {
            return new $TypeError(realm, `The [[Delete]] trap returned true for ${P}, but the backing descriptor is not configurable`);
        }
        return intrinsics.true;
    }
    '[[OwnPropertyKeys]]'(ctx) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$ownKeys);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return target['[[OwnPropertyKeys]]'](ctx);
        }
        const trapResultArray = $Call(ctx, trap, handler, new $List(target));
        if (trapResultArray.isAbrupt) {
            return trapResultArray;
        }
        const trapResult = $CreateListFromArrayLike(ctx, trapResultArray, ['String', 'Symbol']);
        if (trapResult.isAbrupt) {
            return trapResult;
        }
        if (trapResult.filter((x, i) => trapResult.findIndex(y => x.is(y)) === i).length !== trapResult.length) {
            return new $TypeError(realm, `The [[OwnPropertyKeys]] trap returned more than one of the same property key: ${trapResult.map(x => x['[[Value]]'])}`);
        }
        const extensibleTarget = target['[[IsExtensible]]'](ctx);
        if (extensibleTarget.isAbrupt) {
            return extensibleTarget;
        }
        const targetKeys = target['[[OwnPropertyKeys]]'](ctx);
        if (targetKeys.isAbrupt) {
            return targetKeys;
        }
        const targetConfigurableKeys = [];
        const targetNonconfigurableKeys = [];
        for (const key of targetKeys) {
            const desc = target['[[GetOwnProperty]]'](ctx, key);
            if (desc.isAbrupt) {
                return desc;
            }
            if (!desc.isUndefined && desc['[[Configurable]]'].isFalsey) {
                targetNonconfigurableKeys.push(key);
            }
            else {
                targetConfigurableKeys.push(key);
            }
        }
        if (extensibleTarget.isTruthy && targetConfigurableKeys.length === 0) {
            return trapResult;
        }
        const uncheckedResultKeys = trapResult.slice();
        for (const key of targetNonconfigurableKeys) {
            const idx = uncheckedResultKeys.findIndex(x => x.is(key));
            if (idx === -1) {
                return new $TypeError(realm, `The [[OwnPropertyKeys]] trap did not return all non-configurable keys of the backing object: ${key}`);
            }
            uncheckedResultKeys.splice(idx, 1);
        }
        if (extensibleTarget.isTruthy) {
            return trapResult;
        }
        for (const key of targetConfigurableKeys) {
            const idx = uncheckedResultKeys.findIndex(x => x.is(key));
            if (idx === -1) {
                return new $TypeError(realm, `The [[OwnPropertyKeys]] trap did not return all configurable keys of the backing object: ${key}`);
            }
            uncheckedResultKeys.splice(idx, 1);
        }
        if (uncheckedResultKeys.length > 0) {
            return new $TypeError(realm, `The [[OwnPropertyKeys]] returned one or more keys that do not exist on the backing object: ${uncheckedResultKeys.map(x => x)}`);
        }
        return trapResult;
    }
    '[[Call]]'(ctx, thisArgument, argumentsList) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$apply);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return $Call(ctx, target, thisArgument, argumentsList);
        }
        const argArray = $CreateArrayFromList(ctx, argumentsList);
        return $Call(ctx, trap, handler, new $List(target, thisArgument, argArray));
    }
    '[[Construct]]'(ctx, argumentsList, newTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const handler = this['[[ProxyHandler]]'];
        if (handler.isNull) {
            return new $TypeError(realm, `ProxyHandler is null`);
        }
        const target = this['[[ProxyTarget]]'];
        const trap = handler.GetMethod(ctx, intrinsics.$construct);
        if (trap.isAbrupt) {
            return trap;
        }
        if (trap.isUndefined) {
            return $Construct(ctx, target, argumentsList, newTarget);
        }
        const argArray = $CreateArrayFromList(ctx, argumentsList);
        const newObj = $Call(ctx, trap, handler, new $List(target, argArray, newTarget));
        if (newObj.isAbrupt) {
            return newObj;
        }
        if (!newObj.isObject) {
            return new $TypeError(realm, `The [[Construct]] trap returned ${newObj}, but expected an object`);
        }
        return newObj;
    }
}

class $ProxyConstructor extends $BuiltinFunction {
    get revocable() {
        return this.getProperty(this.realm['[[Intrinsics]]'].revocable)['[[Value]]'];
    }
    set revocable(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].revocable, value);
    }
    constructor(realm, functionPrototype) {
        super(realm, '%Proxy%', functionPrototype);
    }
    performSteps(ctx, thisArgument, [target, handler], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (handler === void 0) {
            handler = intrinsics.undefined;
        }
        if (NewTarget.isUndefined) {
            return new $TypeError(realm, `Proxy cannot be called as a function`);
        }
        return new $ProxyExoticObject(realm, target, handler);
    }
}
class $Proxy_revocable extends $BuiltinFunction {
    constructor(realm, functionPrototype) {
        super(realm, 'Proxy.revocable', functionPrototype);
    }
    performSteps(ctx, thisArgument, [target, handler], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (handler === void 0) {
            handler = intrinsics.undefined;
        }
        const p = new $ProxyExoticObject(realm, target, handler);
        if (p.isAbrupt) {
            return p;
        }
        const revoker = new $Proxy_revocation(realm, p);
        const result = $Object.ObjectCreate(ctx, 'Revocable Proxy', intrinsics['%ObjectPrototype%']);
        $CreateDataProperty(ctx, result, new $String(realm, 'proxy'), p);
        $CreateDataProperty(ctx, result, new $String(realm, 'revoke'), revoker);
        return result;
    }
}
class $Proxy_revocation extends $BuiltinFunction {
    constructor(realm, revocableProxy) {
        const intrinsics = realm['[[Intrinsics]]'];
        super(realm, 'Proxy Revocation', intrinsics['%FunctionPrototype%']);
        this['[[RecovableProxy]]'] = revocableProxy;
    }
    performSteps(ctx, thisArgument, [target, handler], NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (handler === void 0) {
            handler = intrinsics.undefined;
        }
        const F = this;
        const p = F['[[RecovableProxy]]'];
        if (p.isNull) {
            return intrinsics.undefined;
        }
        F['[[RecovableProxy]]'] = intrinsics.null;
        p['[[ProxyTarget]]'] = intrinsics.null;
        p['[[ProxyHandler]]'] = intrinsics.null;
        return intrinsics.undefined;
    }
}

class $Reflect extends $Object {
    get $apply() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$apply)['[[Value]]'];
    }
    set $apply(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$apply, value);
    }
    get $construct() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$construct)['[[Value]]'];
    }
    set $construct(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$construct, value);
    }
    get $defineProperty() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$defineProperty)['[[Value]]'];
    }
    set $defineProperty(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$defineProperty, value);
    }
    get $deleteProperty() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$deleteProperty)['[[Value]]'];
    }
    set $deleteProperty(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$deleteProperty, value);
    }
    get $get() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$get)['[[Value]]'];
    }
    set $get(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$get, value);
    }
    get $getOwnPropertyDescriptor() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyDescriptor)['[[Value]]'];
    }
    set $getOwnPropertyDescriptor(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$getOwnPropertyDescriptor, value);
    }
    get $getPrototypeOf() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$getPrototypeOf)['[[Value]]'];
    }
    set $getPrototypeOf(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$getPrototypeOf, value);
    }
    get $has() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$has)['[[Value]]'];
    }
    set $has(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$has, value);
    }
    get $isExtensible() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$isExtensible)['[[Value]]'];
    }
    set $isExtensible(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$isExtensible, value);
    }
    get $ownKeys() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$ownKeys)['[[Value]]'];
    }
    set $ownKeys(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$ownKeys, value);
    }
    get $preventExtensions() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$preventExtensions)['[[Value]]'];
    }
    set $preventExtensions(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$preventExtensions, value);
    }
    get $set() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$set)['[[Value]]'];
    }
    set $set(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$set, value);
    }
    get $setPrototypeOf() {
        return this.getProperty(this.realm['[[Intrinsics]]'].$setPrototypeOf)['[[Value]]'];
    }
    set $setPrototypeOf(value) {
        this.setDataProperty(this.realm['[[Intrinsics]]'].$setPrototypeOf, value);
    }
    constructor(realm, proto) {
        super(realm, '%Reflect%', proto, 1, realm['[[Intrinsics]]'].empty);
    }
}
class $Reflect_apply extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.apply', proto);
    }
    performSteps(ctx, $thisArgument, [target, thisArgument, argumentsList], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (thisArgument === void 0) {
            thisArgument = intrinsics.undefined;
        }
        if (argumentsList === void 0) {
            argumentsList = intrinsics.undefined;
        }
        if (!target.isFunction) {
            return new $TypeError(realm, `Expected target to be a function, but got: ${target}`);
        }
        const args = $CreateListFromArrayLike(ctx, argumentsList);
        if (args.isAbrupt) {
            return args;
        }
        ctx.suspend();
        realm.stack.pop();
        return $Call(ctx, target, thisArgument, args);
    }
}
class $Reflect_construct extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.construct', proto);
    }
    performSteps(ctx, $thisArgument, [target, argumentsList, newTarget], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (argumentsList === void 0) {
            argumentsList = intrinsics.undefined;
        }
        if (!target.isFunction) {
            return new $TypeError(realm, `Expected target to be a constructor function, but got: ${target}`);
        }
        if (newTarget === void 0) {
            newTarget = target;
        }
        else if (!newTarget.isFunction) {
            return new $TypeError(realm, `Expected newTarget to be a constructor function, but got: ${newTarget}`);
        }
        const args = $CreateListFromArrayLike(ctx, argumentsList);
        if (args.isAbrupt) {
            return args;
        }
        return $Construct(ctx, target, args, newTarget);
    }
}
class $Reflect_defineProperty extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.defineProperty', proto);
    }
    performSteps(ctx, $thisArgument, [target, propertyKey, attributes], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (propertyKey === void 0) {
            propertyKey = intrinsics.undefined;
        }
        if (attributes === void 0) {
            attributes = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        const key = propertyKey.ToPropertyKey(ctx);
        if (key.isAbrupt) {
            return key;
        }
        const desc = $ToPropertyDescriptor(ctx, attributes, key);
        if (desc.isAbrupt) {
            return desc;
        }
        return target['[[DefineOwnProperty]]'](ctx, key, desc);
    }
}
class $Reflect_deleteProperty extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.deleteProperty', proto);
    }
    performSteps(ctx, $thisArgument, [target, propertyKey], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (propertyKey === void 0) {
            propertyKey = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        const key = propertyKey.ToPropertyKey(ctx);
        if (key.isAbrupt) {
            return key;
        }
        return target['[[Delete]]'](ctx, key);
    }
}
class $Reflect_get extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.get', proto);
    }
    performSteps(ctx, $thisArgument, [target, propertyKey, receiver], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (propertyKey === void 0) {
            propertyKey = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        const key = propertyKey.ToPropertyKey(ctx);
        if (key.isAbrupt) {
            return key;
        }
        if (receiver === void 0) {
            receiver = target;
        }
        return target['[[Get]]'](ctx, key, receiver);
    }
}
class $Reflect_getOwnPropertyDescriptor extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.getOwnPropertyDescriptor', proto);
    }
    performSteps(ctx, $thisArgument, [target, propertyKey], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (propertyKey === void 0) {
            propertyKey = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        const key = propertyKey.ToPropertyKey(ctx);
        if (key.isAbrupt) {
            return key;
        }
        const desc = target['[[GetOwnProperty]]'](ctx, key);
        if (desc.isAbrupt) {
            return desc;
        }
        return $FromPropertyDescriptor(ctx, desc);
    }
}
class $Reflect_getPrototypeOf extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.getPrototypeOf', proto);
    }
    performSteps(ctx, $thisArgument, [target], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        return target['[[GetPrototypeOf]]'](ctx);
    }
}
class $Reflect_has extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.has', proto);
    }
    performSteps(ctx, $thisArgument, [target, propertyKey], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (propertyKey === void 0) {
            propertyKey = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        const key = propertyKey.ToPropertyKey(ctx);
        if (key.isAbrupt) {
            return key;
        }
        return target['[[HasProperty]]'](ctx, key);
    }
}
class $Reflect_isExtensible extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.isExtensible', proto);
    }
    performSteps(ctx, $thisArgument, [target], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        return target['[[IsExtensible]]'](ctx);
    }
}
class $Reflect_ownKeys extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.ownKeys', proto);
    }
    performSteps(ctx, $thisArgument, [target], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        const keys = target['[[OwnPropertyKeys]]'](ctx);
        if (keys.isAbrupt) {
            return keys;
        }
        return $CreateArrayFromList(ctx, keys);
    }
}
class $Reflect_preventExtensions extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.preventExtensions', proto);
    }
    performSteps(ctx, $thisArgument, [target], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        return target['[[PreventExtensions]]'](ctx);
    }
}
class $Reflect_set extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.set', proto);
    }
    performSteps(ctx, $thisArgument, [target, propertyKey, V, receiver], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (propertyKey === void 0) {
            propertyKey = intrinsics.undefined;
        }
        if (V === void 0) {
            V = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        const key = propertyKey.ToPropertyKey(ctx);
        if (key.isAbrupt) {
            return key;
        }
        if (receiver === void 0) {
            receiver = target;
        }
        return target['[[Set]]'](ctx, key, V, receiver);
    }
}
class $Reflect_setPrototypeOf extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, 'Reflect.setPrototypeOf', proto);
    }
    performSteps(ctx, $thisArgument, [target, proto], $NewTarget) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        if (target === void 0) {
            target = intrinsics.undefined;
        }
        if (proto === void 0) {
            proto = intrinsics.undefined;
        }
        if (!target.isObject) {
            return new $TypeError(realm, `Expected target to be an object, but got: ${target}`);
        }
        if (!proto.isObject && !proto.isNull) {
            return new $TypeError(realm, `Expected proto to be an object or null, but got: ${proto}`);
        }
        return target['[[SetPrototypeOf]]'](ctx, proto);
    }
}

class $Eval extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%eval%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}

class $IsFinite extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%isFinite%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}

class $IsNaN extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%isNaN%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}

class $ParseFloat extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%parseFloat%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}

class $ParseInt extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%parseInt%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}

class $DecodeURI extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%decodeURI%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}
class $DecodeURIComponent extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%decodeURIComponent%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}
class $EncodeURI extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%encodeURI%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}
class $EncodeURIComponent extends $BuiltinFunction {
    constructor(realm, proto) {
        super(realm, '%encodeURIComponent%', proto);
    }
    performSteps(ctx, thisArgument, argumentsList, NewTarget) {
        throw new Error('Method not implemented.');
    }
}

class Intrinsics {
    constructor(realm) {
        realm['[[Intrinsics]]'] = this;
        const empty = this['empty'] = new $Empty(realm);
        this['undefined'] = new $Undefined(realm);
        this['null'] = new $Null(realm);
        const root = new ExecutionContext(realm);
        root.Function = this['null'];
        root.ScriptOrModule = this['null'];
        realm.stack.push(root);
        this['true'] = new $Boolean(realm, true);
        this['false'] = new $Boolean(realm, false);
        this['NaN'] = new $Number(realm, NaN);
        this['Infinity'] = new $Number(realm, Infinity);
        this['-Infinity'] = new $Number(realm, -Infinity);
        this['0'] = new $Number(realm, 0);
        this['-0'] = new $Number(realm, -0);
        this[''] = new $String(realm, '');
        this['*'] = new $String(realm, '*');
        this['*default*'] = new $String(realm, '*default*');
        this['default'] = new $String(realm, 'default');
        this['string'] = new $String(realm, 'string');
        this['number'] = new $String(realm, 'number');
        this['length'] = new $String(realm, 'length');
        this['next'] = new $String(realm, 'next');
        this['return'] = new $String(realm, 'return');
        this['throw'] = new $String(realm, 'throw');
        this['call'] = new $String(realm, 'call');
        this['all'] = new $String(realm, 'all');
        this['race'] = new $String(realm, 'race');
        this['reject'] = new $String(realm, 'reject');
        this['resolve'] = new $String(realm, 'resolve');
        this['finally'] = new $String(realm, 'finally');
        this['then'] = new $String(realm, 'then');
        this['catch'] = new $String(realm, 'catch');
        this['message'] = new $String(realm, 'message');
        this['proxy'] = new $String(realm, 'proxy');
        this['revoke'] = new $String(realm, 'revoke');
        this['revocable'] = new $String(realm, 'revocable');
        this['$arguments'] = new $String(realm, 'arguments');
        this['$callee'] = new $String(realm, 'callee');
        this['$constructor'] = new $String(realm, 'constructor');
        this['$hasOwnProperty'] = new $String(realm, 'hasOwnProperty');
        this['$isPrototypeOf'] = new $String(realm, 'isPrototypeOf');
        this['$propertyIsEnumerable'] = new $String(realm, 'propertyIsEnumerable');
        this['$toLocaleString'] = new $String(realm, 'toLocaleString');
        this['$prototype'] = new $String(realm, 'prototype');
        this['$name'] = new $String(realm, 'name');
        this['$toString'] = new $String(realm, 'toString');
        this['$valueOf'] = new $String(realm, 'valueOf');
        this['$enumerable'] = new $String(realm, 'enumerable');
        this['$configurable'] = new $String(realm, 'configurable');
        this['$writable'] = new $String(realm, 'writable');
        this['$value'] = new $String(realm, 'value');
        this['$return'] = new $String(realm, 'return');
        this['$done'] = new $String(realm, 'done');
        this['$getPrototypeOf'] = new $String(realm, 'getPrototypeOf');
        this['$setPrototypeOf'] = new $String(realm, 'setPrototypeOf');
        this['$isExtensible'] = new $String(realm, 'isExtensible');
        this['$preventExtensions'] = new $String(realm, 'preventExtensions');
        this['$getOwnPropertyDescriptor'] = new $String(realm, 'getOwnPropertyDescriptor');
        this['$defineProperty'] = new $String(realm, 'defineProperty');
        this['$has'] = new $String(realm, 'has');
        this['$get'] = new $String(realm, 'get');
        this['$set'] = new $String(realm, 'set');
        this['$deleteProperty'] = new $String(realm, 'deleteProperty');
        this['$ownKeys'] = new $String(realm, 'ownKeys');
        this['$apply'] = new $String(realm, 'apply');
        this['$construct'] = new $String(realm, 'construct');
        this['$bind'] = new $String(realm, 'bind');
        this['$call'] = new $String(realm, 'call');
        this['$assign'] = new $String(realm, 'assign');
        this['$create'] = new $String(realm, 'create');
        this['$defineProperties'] = new $String(realm, 'defineProperties');
        this['$entries'] = new $String(realm, 'entries');
        this['$freeze'] = new $String(realm, 'freeze');
        this['$fromEntries'] = new $String(realm, 'fromEntries');
        this['$getOwnPropertyDescriptors'] = new $String(realm, 'getOwnPropertyDescriptors');
        this['$getOwnPropertyNames'] = new $String(realm, 'getOwnPropertyNames');
        this['$getOwnPropertySymbols'] = new $String(realm, 'getOwnPropertySymbols');
        this['$is'] = new $String(realm, 'is');
        this['$isFrozen'] = new $String(realm, 'isFrozen');
        this['$isSealed'] = new $String(realm, 'isSealed');
        this['$keys'] = new $String(realm, 'keys');
        this['$seal'] = new $String(realm, 'seal');
        this['$values'] = new $String(realm, 'values');
        this['@@asyncIterator'] = new $Symbol(realm, new $String(realm, 'Symbol.asyncIterator'));
        this['@@hasInstance'] = new $Symbol(realm, new $String(realm, 'Symbol.hasInstance'));
        this['@@isConcatSpreadable'] = new $Symbol(realm, new $String(realm, 'Symbol.isConcatSpreadable'));
        this['@@iterator'] = new $Symbol(realm, new $String(realm, 'Symbol.iterator'));
        this['@@match'] = new $Symbol(realm, new $String(realm, 'Symbol.match'));
        this['@@replace'] = new $Symbol(realm, new $String(realm, 'Symbol.replace'));
        this['@@search'] = new $Symbol(realm, new $String(realm, 'Symbol.search'));
        this['@@species'] = new $Symbol(realm, new $String(realm, 'Symbol.species'));
        this['@@split'] = new $Symbol(realm, new $String(realm, 'Symbol.split'));
        this['@@toPrimitive'] = new $Symbol(realm, new $String(realm, 'Symbol.toPrimitive'));
        this['@@toStringTag'] = new $Symbol(realm, new $String(realm, 'Symbol.toStringTag'));
        this['@@unscopables'] = new $Symbol(realm, new $String(realm, 'Symbol.unscopables'));
        const objectPrototype = this['%ObjectPrototype%'] = new $ObjectPrototype(realm);
        const functionPrototype = this['%FunctionPrototype%'] = new $FunctionPrototype(realm, objectPrototype);
        const objectConstructor = this['%Object%'] = new $ObjectConstructor(realm, functionPrototype);
        (objectConstructor.$prototype = objectPrototype).$constructor = objectConstructor;
        const functionConstructor = this['%Function%'] = new $FunctionConstructor(realm, functionPrototype);
        (functionConstructor.$prototype = functionPrototype).$constructor = functionConstructor;
        this['%ThrowTypeError%'] = new $ThrowTypeError(realm, '%ThrowTypeError%', functionPrototype);
        objectConstructor.$assign = new $Object_assign(realm, functionPrototype);
        objectConstructor.$create = new $Object_create(realm, functionPrototype);
        objectConstructor.$defineProperties = new $Object_defineProperties(realm, functionPrototype);
        objectConstructor.$defineProperty = new $Object_defineProperty(realm, functionPrototype);
        objectConstructor.$entries = new $Object_entries(realm, functionPrototype);
        objectConstructor.$freeze = new $Object_freeze(realm, functionPrototype);
        objectConstructor.$fromEntries = new $Object_fromEntries(realm, functionPrototype);
        objectConstructor.$getOwnPropertyDescriptor = new $Object_getOwnPropertyDescriptor(realm, functionPrototype);
        objectConstructor.$getOwnPropertyDescriptors = new $Object_getOwnPropertyDescriptors(realm, functionPrototype);
        objectConstructor.$getOwnPropertyNames = new $Object_getOwnPropertyNames(realm, functionPrototype);
        objectConstructor.$getOwnPropertySymbols = new $Object_getOwnPropertySymbols(realm, functionPrototype);
        objectConstructor.$getPrototypeOf = new $Object_getPrototypeOf(realm, functionPrototype);
        objectConstructor.$is = new $Object_is(realm, functionPrototype);
        objectConstructor.$isExtensible = new $Object_isExtensible(realm, functionPrototype);
        objectConstructor.$isFrozen = new $Object_isFrozen(realm, functionPrototype);
        objectConstructor.$isSealed = new $Object_isSealed(realm, functionPrototype);
        objectConstructor.$keys = new $Object_keys(realm, functionPrototype);
        objectConstructor.$preventExtensions = new $Object_preventExtensions(realm, functionPrototype);
        objectConstructor.$seal = new $Object_seal(realm, functionPrototype);
        objectConstructor.$setPrototypeOf = new $Object_setPrototypeOf(realm, functionPrototype);
        objectConstructor.$values = new $Object_values(realm, functionPrototype);
        objectPrototype.$hasOwnProperty = new $ObjectPrototype_hasOwnProperty(realm, functionPrototype);
        objectPrototype.$isPrototypeOf = new $ObjectPrototype_isPrototypeOf(realm, functionPrototype);
        objectPrototype.$propertyIsEnumerable = new $ObjectPrototype_propertyIsEnumerable(realm, functionPrototype);
        objectPrototype.$toLocaleString = new $ObjectPrototype_toLocaleString(realm, functionPrototype);
        objectPrototype.$toString = this['%ObjProto_toString%'] = new $ObjProto_toString(realm, functionPrototype);
        objectPrototype.$valueOf = this['%ObjProto_valueOf%'] = new $ObjProto_valueOf(realm, functionPrototype);
        functionPrototype.$apply = new $FunctionPrototype_apply(realm, functionPrototype);
        functionPrototype.$bind = new $FunctionPrototype_bind(realm, functionPrototype);
        functionPrototype.$call = new $FunctionPrototype_call(realm, functionPrototype);
        functionPrototype.$toString = new $FunctionPrototype_toString(realm, functionPrototype);
        functionPrototype['@@hasInstance'] = new $FunctionPrototype_hasInstance(realm, functionPrototype);
        const stringConstructor = this['%String%'] = new $StringConstructor(realm, functionPrototype);
        const stringPrototype = this['%StringPrototype%'] = new $StringPrototype(realm, objectPrototype);
        (stringConstructor.$prototype = stringPrototype).$constructor = stringConstructor;
        const numberConstructor = this['%Number%'] = new $NumberConstructor(realm, functionPrototype);
        const numberPrototype = this['%NumberPrototype%'] = new $NumberPrototype(realm, objectPrototype);
        (numberConstructor.$prototype = numberPrototype).$constructor = numberConstructor;
        const booleanConstructor = this['%Boolean%'] = new $BooleanConstructor(realm, functionPrototype);
        const booleanPrototype = this['%BooleanPrototype%'] = new $BooleanPrototype(realm, objectPrototype);
        (booleanConstructor.$prototype = booleanPrototype).$constructor = booleanConstructor;
        const symbolConstructor = this['%Symbol%'] = new $SymbolConstructor(realm, functionPrototype);
        const symbolPrototype = this['%SymbolPrototype%'] = new $SymbolPrototype(realm, objectPrototype);
        (symbolConstructor.$prototype = symbolPrototype).$constructor = symbolConstructor;
        const errorConstructor = this['%Error%'] = new $ErrorConstructor(realm, functionPrototype);
        const errorPrototype = this['%ErrorPrototype%'] = new $ErrorPrototype(realm, objectPrototype);
        (errorConstructor.$prototype = errorPrototype).$constructor = errorConstructor;
        errorPrototype.message = new $String(realm, '');
        errorPrototype.$name = new $String(realm, 'Error');
        errorPrototype.$toString = new $ErrorPrototype_toString(realm, 'Error.prototype.toString', functionPrototype);
        const evalErrorConstructor = this['%EvalError%'] = new $EvalErrorConstructor(realm, errorConstructor);
        const evalErrorPrototype = this['%EvalErrorPrototype%'] = new $EvalErrorPrototype(realm, errorPrototype);
        (evalErrorConstructor.$prototype = evalErrorPrototype).$constructor = evalErrorConstructor;
        evalErrorPrototype.message = new $String(realm, '');
        evalErrorPrototype.$name = new $String(realm, 'EvalError');
        const rangeErrorConstructor = this['%RangeError%'] = new $RangeErrorConstructor(realm, errorConstructor);
        const rangeErrorPrototype = this['%RangeErrorPrototype%'] = new $RangeErrorPrototype(realm, errorPrototype);
        (rangeErrorConstructor.$prototype = rangeErrorPrototype).$constructor = rangeErrorConstructor;
        rangeErrorPrototype.message = new $String(realm, '');
        rangeErrorPrototype.$name = new $String(realm, 'RangeError');
        const referenceErrorConstructor = this['%ReferenceError%'] = new $ReferenceErrorConstructor(realm, errorConstructor);
        const referenceErrorPrototype = this['%ReferenceErrorPrototype%'] = new $ReferenceErrorPrototype(realm, errorPrototype);
        (referenceErrorConstructor.$prototype = referenceErrorPrototype).$constructor = referenceErrorConstructor;
        referenceErrorPrototype.message = new $String(realm, '');
        referenceErrorPrototype.$name = new $String(realm, 'ReferenceError');
        const syntaxErrorConstructor = this['%SyntaxError%'] = new $SyntaxErrorConstructor(realm, errorConstructor);
        const syntaxErrorPrototype = this['%SyntaxErrorPrototype%'] = new $SyntaxErrorPrototype(realm, errorPrototype);
        (syntaxErrorConstructor.$prototype = syntaxErrorPrototype).$constructor = syntaxErrorConstructor;
        syntaxErrorPrototype.message = new $String(realm, '');
        syntaxErrorPrototype.$name = new $String(realm, 'SyntaxError');
        const typeErrorConstructor = this['%TypeError%'] = new $TypeErrorConstructor(realm, errorConstructor);
        const typeErrorPrototype = this['%TypeErrorPrototype%'] = new $TypeErrorPrototype(realm, errorPrototype);
        (typeErrorConstructor.$prototype = typeErrorPrototype).$constructor = typeErrorConstructor;
        typeErrorPrototype.message = new $String(realm, '');
        typeErrorPrototype.$name = new $String(realm, 'TypeError');
        const URIErrorConstructor = this['%URIError%'] = new $URIErrorConstructor(realm, errorConstructor);
        const URIErrorPrototype = this['%URIErrorPrototype%'] = new $URIErrorPrototype(realm, errorPrototype);
        (URIErrorConstructor.$prototype = URIErrorPrototype).$constructor = URIErrorConstructor;
        URIErrorPrototype.message = new $String(realm, '');
        URIErrorPrototype.$name = new $String(realm, 'URIError');
        const iteratorPrototype = this['%IteratorPrototype%'] = new $IteratorPrototype(realm, objectPrototype);
        const generatorFunctionConstructor = this['%GeneratorFunction%'] = new $GeneratorFunctionConstructor(realm, functionConstructor);
        const generatorFunctionPrototype = this['%Generator%'] = new $GeneratorFunctionPrototype(realm, functionPrototype);
        (generatorFunctionConstructor.$prototype = generatorFunctionPrototype).$constructor = generatorFunctionConstructor;
        generatorFunctionConstructor.length = new $Number(realm, 1);
        const generatorPrototype = this['%GeneratorPrototype%'] = new $GeneratorPrototype(realm, iteratorPrototype);
        (generatorFunctionPrototype.$prototype = generatorPrototype).$constructor = generatorFunctionPrototype;
        generatorFunctionPrototype['@@toStringTag'] = new $String(realm, 'GeneratorFunction');
        generatorPrototype.next = new $GeneratorPrototype_next(realm, 'Generator.prototype.next', functionPrototype);
        generatorPrototype.return = new $GeneratorPrototype_return(realm, 'Generator.prototype.return', functionPrototype);
        generatorPrototype.throw = new $GeneratorPrototype_throw(realm, 'Generator.prototype.throw', functionPrototype);
        generatorPrototype['@@toStringTag'] = new $String(realm, 'Generator');
        const promiseConstructor = this['%Promise%'] = new $PromiseConstructor(realm, functionPrototype);
        const promisePrototype = this['%PromisePrototype%'] = new $PromisePrototype(realm, functionPrototype);
        (promiseConstructor.$prototype = promisePrototype).$constructor = promiseConstructor;
        promisePrototype.then = this['%PromiseProto_then%'] = new $PromiseProto_then(realm, functionPrototype);
        promisePrototype.catch = new $PromiseProto_catch(realm, functionPrototype);
        promisePrototype.finally = new $PromiseProto_finally(realm, functionPrototype);
        promisePrototype['@@toStringTag'] = new $String(realm, 'Promise');
        promiseConstructor.all = this['%Promise_all%'] = new $Promise_all(realm, functionPrototype);
        promiseConstructor.race = new $Promise_race(realm, functionPrototype);
        promiseConstructor.resolve = this['%Promise_resolve%'] = new $Promise_resolve(realm, functionPrototype);
        promiseConstructor.reject = this['%Promise_reject%'] = new $Promise_reject(realm, functionPrototype);
        promiseConstructor['@@species'] = new $GetSpecies(realm);
        const asyncFunctionConstructor = this['%AsyncFunction%'] = new $AsyncFunctionConstructor(realm, functionConstructor);
        const asyncFunctionPrototype = this['%AsyncFunctionPrototype%'] = new $AsyncFunctionPrototype(realm, functionPrototype);
        (asyncFunctionConstructor.$prototype = asyncFunctionPrototype).$constructor = asyncFunctionConstructor;
        asyncFunctionConstructor.length = new $Number(realm, 1);
        asyncFunctionPrototype['@@toStringTag'] = new $String(realm, 'AsyncFunction');
        const asyncIteratorPrototype = this['%AsyncIteratorPrototype%'] = new $AsyncIteratorPrototype(realm, objectPrototype);
        const asyncFromSyncIteratorPrototype = this['%AsyncFromSyncIteratorPrototype%'] = new $AsyncFromSyncIteratorPrototype(realm, asyncIteratorPrototype);
        asyncFromSyncIteratorPrototype.next = new $AsyncFromSyncIteratorPrototype_next(realm, functionPrototype);
        asyncFromSyncIteratorPrototype.return = new $AsyncFromSyncIteratorPrototype_return(realm, functionPrototype);
        asyncFromSyncIteratorPrototype.throw = new $AsyncFromSyncIteratorPrototype_throw(realm, functionPrototype);
        asyncFromSyncIteratorPrototype['@@toStringTag'] = new $String(realm, 'Async-from-Sync Iterator');
        const asyncGeneratorFunctionConstructor = this['%AsyncGeneratorFunction%'] = new $AsyncGeneratorFunctionConstructor(realm, functionConstructor);
        const asyncGeneratorFunctionPrototype = this['%AsyncGenerator%'] = new $AsyncGeneratorFunctionPrototype(realm, functionPrototype);
        (asyncGeneratorFunctionConstructor.$prototype = asyncGeneratorFunctionPrototype).$constructor = asyncGeneratorFunctionConstructor;
        asyncGeneratorFunctionConstructor.length = new $Number(realm, 1);
        asyncGeneratorFunctionPrototype['@@toStringTag'] = new $String(realm, 'AsyncGeneratorFunction');
        const asyncGeneratorPrototype = this['%AsyncGeneratorPrototype%'] = new $AsyncGeneratorPrototype(realm, iteratorPrototype);
        (asyncGeneratorFunctionPrototype.$prototype = asyncGeneratorPrototype).$constructor = asyncGeneratorFunctionPrototype;
        asyncGeneratorPrototype.next = new $AsyncGeneratorPrototype_next(realm, functionPrototype);
        asyncGeneratorPrototype.return = new $AsyncGeneratorPrototype_return(realm, functionPrototype);
        asyncGeneratorPrototype.throw = new $AsyncGeneratorPrototype_throw(realm, functionPrototype);
        this['%RegExpPrototype%'] = new $Object(realm, '%RegExpPrototype%', objectPrototype, 1, empty);
        this['%DatePrototype%'] = new $Object(realm, '%DatePrototype%', objectPrototype, 1, empty);
        this['%ArrayIteratorPrototype%'] = new $Object(realm, '%ArrayIteratorPrototype%', this['%IteratorPrototype%'], 1, empty);
        this['%MapIteratorPrototype%'] = new $Object(realm, '%MapIteratorPrototype%', this['%IteratorPrototype%'], 1, empty);
        this['%SetIteratorPrototype%'] = new $Object(realm, '%SetIteratorPrototype%', this['%IteratorPrototype%'], 1, empty);
        this['%StringIteratorPrototype%'] = new $Object(realm, '%StringIteratorPrototype%', this['%IteratorPrototype%'], 1, empty);
        this['%ArrayPrototype%'] = new $Object(realm, '%ArrayPrototype%', objectPrototype, 1, empty);
        this['%MapPrototype%'] = new $Object(realm, '%MapPrototype%', objectPrototype, 1, empty);
        this['%WeakMapPrototype%'] = new $Object(realm, '%WeakMapPrototype%', objectPrototype, 1, empty);
        this['%SetPrototype%'] = new $Object(realm, '%SetPrototype%', objectPrototype, 1, empty);
        this['%WeakSetPrototype%'] = new $Object(realm, '%WeakSetPrototype%', objectPrototype, 1, empty);
        this['%DataViewPrototype%'] = new $Object(realm, '%DataViewPrototype%', objectPrototype, 1, empty);
        this['%ArrayBufferPrototype%'] = new $Object(realm, '%ArrayBufferPrototype%', objectPrototype, 1, empty);
        this['%SharedArrayBufferPrototype%'] = new $Object(realm, '%SharedArrayBufferPrototype%', objectPrototype, 1, empty);
        this['%TypedArrayPrototype%'] = new $Object(realm, '%TypedArrayPrototype%', objectPrototype, 1, empty);
        this['%Float32ArrayPrototype%'] = new $Object(realm, '%Float32ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Float64ArrayPrototype%'] = new $Object(realm, '%Float64ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Int8ArrayPrototype%'] = new $Object(realm, '%Int8ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Int16ArrayPrototype%'] = new $Object(realm, '%Int16ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Int32ArrayPrototype%'] = new $Object(realm, '%Int32ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Uint8ArrayPrototype%'] = new $Object(realm, '%Uint8ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Uint8ClampedArrayPrototype%'] = new $Object(realm, '%Uint8ClampedArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Uint16ArrayPrototype%'] = new $Object(realm, '%Uint16ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%Uint32ArrayPrototype%'] = new $Object(realm, '%Uint32ArrayPrototype%', this['%TypedArrayPrototype%'], 1, empty);
        this['%RegExp%'] = new $Object(realm, '%RegExp%', functionPrototype, 1, empty);
        this['%Date%'] = new $Object(realm, '%Date%', functionPrototype, 1, empty);
        this['%Array%'] = new $Object(realm, '%Array%', functionPrototype, 1, empty);
        this['%Map%'] = new $Object(realm, '%Map%', functionPrototype, 1, empty);
        this['%WeakMap%'] = new $Object(realm, '%WeakMap%', functionPrototype, 1, empty);
        this['%Set%'] = new $Object(realm, '%Set%', functionPrototype, 1, empty);
        this['%WeakSet%'] = new $Object(realm, '%WeakSet%', functionPrototype, 1, empty);
        this['%DataView%'] = new $Object(realm, '%DataView%', functionPrototype, 1, empty);
        this['%ArrayBuffer%'] = new $Object(realm, '%ArrayBuffer%', functionPrototype, 1, empty);
        this['%SharedArrayBuffer%'] = new $Object(realm, '%SharedArrayBuffer%', functionPrototype, 1, empty);
        this['%TypedArray%'] = new $Object(realm, '%TypedArray%', functionPrototype, 1, empty);
        this['%Float32Array%'] = new $Object(realm, '%Float32Array%', this['%TypedArray%'], 1, empty);
        this['%Float64Array%'] = new $Object(realm, '%Float64Array%', this['%TypedArray%'], 1, empty);
        this['%Int8Array%'] = new $Object(realm, '%Int8Array%', this['%TypedArray%'], 1, empty);
        this['%Int16Array%'] = new $Object(realm, '%Int16Array%', this['%TypedArray%'], 1, empty);
        this['%Int32Array%'] = new $Object(realm, '%Int32Array%', this['%TypedArray%'], 1, empty);
        this['%Uint8Array%'] = new $Object(realm, '%Uint8Array%', this['%TypedArray%'], 1, empty);
        this['%Uint8ClampedArray%'] = new $Object(realm, '%Uint8ClampedArray%', this['%TypedArray%'], 1, empty);
        this['%Uint16Array%'] = new $Object(realm, '%Uint16Array%', this['%TypedArray%'], 1, empty);
        this['%Uint32Array%'] = new $Object(realm, '%Uint32Array%', this['%TypedArray%'], 1, empty);
        this['%Atomics%'] = new $Object(realm, '%Atomics%', objectPrototype, 1, empty);
        this['%JSON%'] = new $Object(realm, '%JSON%', objectPrototype, 1, empty);
        this['%Math%'] = new $Object(realm, '%Math%', objectPrototype, 1, empty);
        const reflect = this['%Reflect%'] = new $Reflect(realm, objectPrototype);
        reflect.$apply = new $Reflect_apply(realm, functionPrototype);
        reflect.$construct = new $Reflect_construct(realm, functionPrototype);
        reflect.$defineProperty = new $Reflect_defineProperty(realm, functionPrototype);
        reflect.$deleteProperty = new $Reflect_deleteProperty(realm, functionPrototype);
        reflect.$get = new $Reflect_get(realm, functionPrototype);
        reflect.$getOwnPropertyDescriptor = new $Reflect_getOwnPropertyDescriptor(realm, functionPrototype);
        reflect.$getPrototypeOf = new $Reflect_getPrototypeOf(realm, functionPrototype);
        reflect.$has = new $Reflect_has(realm, functionPrototype);
        reflect.$isExtensible = new $Reflect_isExtensible(realm, functionPrototype);
        reflect.$ownKeys = new $Reflect_ownKeys(realm, functionPrototype);
        reflect.$preventExtensions = new $Reflect_preventExtensions(realm, functionPrototype);
        reflect.$set = new $Reflect_set(realm, functionPrototype);
        reflect.$setPrototypeOf = new $Reflect_setPrototypeOf(realm, functionPrototype);
        const proxyConstructor = this['%Proxy%'] = new $ProxyConstructor(realm, functionPrototype);
        proxyConstructor.revocable = new $Proxy_revocable(realm, functionPrototype);
        this['%decodeURI%'] = new $DecodeURI(realm, functionPrototype);
        this['%decodeURIComponent%'] = new $DecodeURIComponent(realm, functionPrototype);
        this['%encodeURI%'] = new $EncodeURI(realm, functionPrototype);
        this['%encodeURIComponent%'] = new $EncodeURIComponent(realm, functionPrototype);
        this['%eval%'] = new $Eval(realm, functionPrototype);
        this['%isFinite%'] = new $IsFinite(realm, functionPrototype);
        this['%isNaN%'] = new $IsNaN(realm, functionPrototype);
        this['%parseFloat%'] = new $ParseFloat(realm, functionPrototype);
        this['%parseInt%'] = new $ParseInt(realm, functionPrototype);
        this['%JSONParse%'] = new $Object(realm, '%JSONParse%', functionPrototype, 1, empty);
        this['%JSONStringify%'] = new $Object(realm, '%JSONStringify%', functionPrototype, 1, empty);
        this['%ArrayProto_entries%'] = new $Object(realm, '%ArrayProto_entries%', functionPrototype, 1, empty);
        this['%ArrayProto_forEach%'] = new $Object(realm, '%ArrayProto_forEach%', functionPrototype, 1, empty);
        this['%ArrayProto_keys%'] = new $Object(realm, '%ArrayProto_keys%', functionPrototype, 1, empty);
        this['%ArrayProto_values%'] = new $Object(realm, '%ArrayProto_values%', functionPrototype, 1, empty);
        this['%ObjProto_valueOf%'] = new $Object(realm, '%ObjProto_valueOf%', functionPrototype, 1, empty);
    }
    dispose() {
        this['true'] = void 0;
        this['false'] = void 0;
        this['NaN'] = void 0;
        this['Infinity'] = void 0;
        this['-Infinity'] = void 0;
        this['0'] = void 0;
        this['-0'] = void 0;
        this[''] = void 0;
        this['*'] = void 0;
        this['*default*'] = void 0;
        this['default'] = void 0;
        this['string'] = void 0;
        this['number'] = void 0;
        this['length'] = void 0;
        this['next'] = void 0;
        this['return'] = void 0;
        this['throw'] = void 0;
        this['call'] = void 0;
        this['message'] = void 0;
        this['$arguments'] = void 0;
        this['$callee'] = void 0;
        this['$constructor'] = void 0;
        this['$prototype'] = void 0;
        this['$name'] = void 0;
        this['$toString'] = void 0;
        this['$valueOf'] = void 0;
        this['$enumerable'] = void 0;
        this['$configurable'] = void 0;
        this['$writable'] = void 0;
        this['$value'] = void 0;
        this['$return'] = void 0;
        this['$done'] = void 0;
        this['$getPrototypeOf'] = void 0;
        this['$setPrototypeOf'] = void 0;
        this['$isExtensible'] = void 0;
        this['$preventExtensions'] = void 0;
        this['$getOwnPropertyDescriptor'] = void 0;
        this['$defineProperty'] = void 0;
        this['$has'] = void 0;
        this['$get'] = void 0;
        this['$set'] = void 0;
        this['$deleteProperty'] = void 0;
        this['$ownKeys'] = void 0;
        this['$apply'] = void 0;
        this['$construct'] = void 0;
        this['@@asyncIterator'] = void 0;
        this['@@hasInstance'] = void 0;
        this['@@isConcatSpreadable'] = void 0;
        this['@@iterator'] = void 0;
        this['@@match'] = void 0;
        this['@@replace'] = void 0;
        this['@@search'] = void 0;
        this['@@species'] = void 0;
        this['@@split'] = void 0;
        this['@@toPrimitive'] = void 0;
        this['@@toStringTag'] = void 0;
        this['@@unscopables'] = void 0;
        this['%ObjectPrototype%'].dispose();
        this['%ObjectPrototype%'] = void 0;
        this['%FunctionPrototype%'].dispose();
        this['%FunctionPrototype%'] = void 0;
        this['%Object%'].dispose();
        this['%Object%'] = void 0;
        this['%Function%'].dispose();
        this['%Function%'] = void 0;
        this['%ThrowTypeError%'].dispose();
        this['%ThrowTypeError%'] = void 0;
        this['%ObjProto_toString%'].dispose();
        this['%ObjProto_toString%'] = void 0;
        this['%String%'].dispose();
        this['%String%'] = void 0;
        this['%StringPrototype%'].dispose();
        this['%StringPrototype%'] = void 0;
        this['%Number%'].dispose();
        this['%Number%'] = void 0;
        this['%NumberPrototype%'].dispose();
        this['%NumberPrototype%'] = void 0;
        this['%Boolean%'].dispose();
        this['%Boolean%'] = void 0;
        this['%BooleanPrototype%'].dispose();
        this['%BooleanPrototype%'] = void 0;
        this['%Symbol%'].dispose();
        this['%Symbol%'] = void 0;
        this['%SymbolPrototype%'].dispose();
        this['%SymbolPrototype%'] = void 0;
        this['%Error%'].dispose();
        this['%Error%'] = void 0;
        this['%ErrorPrototype%'].dispose();
        this['%ErrorPrototype%'] = void 0;
        this['%EvalError%'].dispose();
        this['%EvalError%'] = void 0;
        this['%EvalErrorPrototype%'].dispose();
        this['%EvalErrorPrototype%'] = void 0;
        this['%RangeError%'].dispose();
        this['%RangeError%'] = void 0;
        this['%RangeErrorPrototype%'].dispose();
        this['%RangeErrorPrototype%'] = void 0;
        this['%ReferenceError%'].dispose();
        this['%ReferenceError%'] = void 0;
        this['%ReferenceErrorPrototype%'].dispose();
        this['%ReferenceErrorPrototype%'] = void 0;
        this['%SyntaxError%'].dispose();
        this['%SyntaxError%'] = void 0;
        this['%SyntaxErrorPrototype%'].dispose();
        this['%SyntaxErrorPrototype%'] = void 0;
        this['%TypeError%'].dispose();
        this['%TypeError%'] = void 0;
        this['%TypeErrorPrototype%'].dispose();
        this['%TypeErrorPrototype%'] = void 0;
        this['%URIError%'].dispose();
        this['%URIError%'] = void 0;
        this['%URIErrorPrototype%'].dispose();
        this['%URIErrorPrototype%'] = void 0;
        this['%PromisePrototype%'].dispose();
        this['%PromisePrototype%'] = void 0;
        this['%RegExpPrototype%'].dispose();
        this['%RegExpPrototype%'] = void 0;
        this['%DatePrototype%'].dispose();
        this['%DatePrototype%'] = void 0;
        this['%AsyncFunctionPrototype%'].dispose();
        this['%AsyncFunctionPrototype%'] = void 0;
        this['%Generator%'].dispose();
        this['%Generator%'] = void 0;
        this['%AsyncGenerator%'].dispose();
        this['%AsyncGenerator%'] = void 0;
        this['%IteratorPrototype%'].dispose();
        this['%IteratorPrototype%'] = void 0;
        this['%ArrayIteratorPrototype%'].dispose();
        this['%ArrayIteratorPrototype%'] = void 0;
        this['%MapIteratorPrototype%'].dispose();
        this['%MapIteratorPrototype%'] = void 0;
        this['%SetIteratorPrototype%'].dispose();
        this['%SetIteratorPrototype%'] = void 0;
        this['%StringIteratorPrototype%'].dispose();
        this['%StringIteratorPrototype%'] = void 0;
        this['%GeneratorPrototype%'].dispose();
        this['%GeneratorPrototype%'] = void 0;
        this['%AsyncIteratorPrototype%'].dispose();
        this['%AsyncIteratorPrototype%'] = void 0;
        this['%AsyncFromSyncIteratorPrototype%'].dispose();
        this['%AsyncFromSyncIteratorPrototype%'] = void 0;
        this['%AsyncGeneratorPrototype%'].dispose();
        this['%AsyncGeneratorPrototype%'] = void 0;
        this['%ArrayPrototype%'].dispose();
        this['%ArrayPrototype%'] = void 0;
        this['%MapPrototype%'].dispose();
        this['%MapPrototype%'] = void 0;
        this['%WeakMapPrototype%'].dispose();
        this['%WeakMapPrototype%'] = void 0;
        this['%SetPrototype%'].dispose();
        this['%SetPrototype%'] = void 0;
        this['%WeakSetPrototype%'].dispose();
        this['%WeakSetPrototype%'] = void 0;
        this['%DataViewPrototype%'].dispose();
        this['%DataViewPrototype%'] = void 0;
        this['%ArrayBufferPrototype%'].dispose();
        this['%ArrayBufferPrototype%'] = void 0;
        this['%SharedArrayBufferPrototype%'].dispose();
        this['%SharedArrayBufferPrototype%'] = void 0;
        this['%TypedArrayPrototype%'].dispose();
        this['%TypedArrayPrototype%'] = void 0;
        this['%Float32ArrayPrototype%'].dispose();
        this['%Float32ArrayPrototype%'] = void 0;
        this['%Float64ArrayPrototype%'].dispose();
        this['%Float64ArrayPrototype%'] = void 0;
        this['%Int8ArrayPrototype%'].dispose();
        this['%Int8ArrayPrototype%'] = void 0;
        this['%Int16ArrayPrototype%'].dispose();
        this['%Int16ArrayPrototype%'] = void 0;
        this['%Int32ArrayPrototype%'].dispose();
        this['%Int32ArrayPrototype%'] = void 0;
        this['%Uint8ArrayPrototype%'].dispose();
        this['%Uint8ArrayPrototype%'] = void 0;
        this['%Uint8ClampedArrayPrototype%'].dispose();
        this['%Uint8ClampedArrayPrototype%'] = void 0;
        this['%Uint16ArrayPrototype%'].dispose();
        this['%Uint16ArrayPrototype%'] = void 0;
        this['%Uint32ArrayPrototype%'].dispose();
        this['%Uint32ArrayPrototype%'] = void 0;
        this['%Promise%'].dispose();
        this['%Promise%'] = void 0;
        this['%RegExp%'].dispose();
        this['%RegExp%'] = void 0;
        this['%Date%'].dispose();
        this['%Date%'] = void 0;
        this['%AsyncFunction%'].dispose();
        this['%AsyncFunction%'] = void 0;
        this['%GeneratorFunction%'].dispose();
        this['%GeneratorFunction%'] = void 0;
        this['%AsyncGeneratorFunction%'].dispose();
        this['%AsyncGeneratorFunction%'] = void 0;
        this['%Array%'].dispose();
        this['%Array%'] = void 0;
        this['%Map%'].dispose();
        this['%Map%'] = void 0;
        this['%WeakMap%'].dispose();
        this['%WeakMap%'] = void 0;
        this['%Set%'].dispose();
        this['%Set%'] = void 0;
        this['%WeakSet%'].dispose();
        this['%WeakSet%'] = void 0;
        this['%DataView%'].dispose();
        this['%DataView%'] = void 0;
        this['%ArrayBuffer%'].dispose();
        this['%ArrayBuffer%'] = void 0;
        this['%SharedArrayBuffer%'].dispose();
        this['%SharedArrayBuffer%'] = void 0;
        this['%TypedArray%'].dispose();
        this['%TypedArray%'] = void 0;
        this['%Float32Array%'].dispose();
        this['%Float32Array%'] = void 0;
        this['%Float64Array%'].dispose();
        this['%Float64Array%'] = void 0;
        this['%Int8Array%'].dispose();
        this['%Int8Array%'] = void 0;
        this['%Int16Array%'].dispose();
        this['%Int16Array%'] = void 0;
        this['%Int32Array%'].dispose();
        this['%Int32Array%'] = void 0;
        this['%Uint8Array%'].dispose();
        this['%Uint8Array%'] = void 0;
        this['%Uint8ClampedArray%'].dispose();
        this['%Uint8ClampedArray%'] = void 0;
        this['%Uint16Array%'].dispose();
        this['%Uint16Array%'] = void 0;
        this['%Uint32Array%'].dispose();
        this['%Uint32Array%'] = void 0;
        this['%Atomics%'].dispose();
        this['%Atomics%'] = void 0;
        this['%JSON%'].dispose();
        this['%JSON%'] = void 0;
        this['%Math%'].dispose();
        this['%Math%'] = void 0;
        this['%Reflect%'].dispose();
        this['%Reflect%'] = void 0;
        this['%Proxy%'].dispose();
        this['%Proxy%'] = void 0;
        this['%decodeURI%'].dispose();
        this['%decodeURI%'] = void 0;
        this['%decodeURIComponent%'].dispose();
        this['%decodeURIComponent%'] = void 0;
        this['%encodeURI%'].dispose();
        this['%encodeURI%'] = void 0;
        this['%encodeURIComponent%'].dispose();
        this['%encodeURIComponent%'] = void 0;
        this['%eval%'].dispose();
        this['%eval%'] = void 0;
        this['%isFinite%'].dispose();
        this['%isFinite%'] = void 0;
        this['%isNaN%'].dispose();
        this['%isNaN%'] = void 0;
        this['%parseFloat%'].dispose();
        this['%parseFloat%'] = void 0;
        this['%parseInt%'].dispose();
        this['%parseInt%'] = void 0;
        this['%JSONParse%'].dispose();
        this['%JSONParse%'] = void 0;
        this['%JSONStringify%'].dispose();
        this['%JSONStringify%'] = void 0;
        this['%ArrayProto_entries%'].dispose();
        this['%ArrayProto_entries%'] = void 0;
        this['%ArrayProto_forEach%'].dispose();
        this['%ArrayProto_forEach%'] = void 0;
        this['%ArrayProto_keys%'].dispose();
        this['%ArrayProto_keys%'] = void 0;
        this['%ArrayProto_values%'].dispose();
        this['%ArrayProto_values%'] = void 0;
        this['%ObjProto_valueOf%'].dispose();
        this['%ObjProto_valueOf%'] = void 0;
        this['%PromiseProto_then%'].dispose();
        this['%PromiseProto_then%'] = void 0;
        this['%Promise_all%'].dispose();
        this['%Promise_all%'] = void 0;
        this['%Promise_reject%'].dispose();
        this['%Promise_reject%'] = void 0;
        this['%Promise_resolve%'].dispose();
        this['%Promise_resolve%'] = void 0;
    }
}

class ResolveSet {
    constructor() {
        this.modules = [];
        this.exportNames = [];
        this.count = 0;
    }
    has(mod, exportName) {
        const modules = this.modules;
        const exportNames = this.exportNames;
        const count = this.count;
        for (let i = 0; i < count; ++i) {
            if (exportNames[i].is(exportName) && modules[i] === mod) {
                return true;
            }
        }
        return false;
    }
    add(mod, exportName) {
        const index = this.count;
        this.modules[index] = mod;
        this.exportNames[index] = exportName;
        ++this.count;
    }
    forEach(callback) {
        const modules = this.modules;
        const exportNames = this.exportNames;
        const count = this.count;
        for (let i = 0; i < count; ++i) {
            callback(modules[i], exportNames[i]);
        }
    }
}
class ResolvedBindingRecord {
    get isAbrupt() { return false; }
    get isNull() { return false; }
    get isAmbiguous() { return false; }
    constructor(Module, BindingName) {
        this.Module = Module;
        this.BindingName = BindingName;
    }
}
class DeferredModule {
    get isAbrupt() { return false; }
    constructor($file, realm) {
        this.$file = $file;
        this.realm = realm;
    }
    ResolveExport(ctx, exportName, resolveSet) {
        throw new Error('Method not implemented.');
    }
    GetExportedNames(ctx, exportStarSet) {
        throw new Error('Method not implemented.');
    }
    Instantiate(ctx) {
        throw new Error('Method not implemented.');
    }
    _InnerModuleInstantiation(ctx, stack, index) {
        throw new Error('Method not implemented.');
    }
    dispose() {
        throw new Error('Method not implemented.');
    }
}
class Realm {
    get isAbrupt() { return false; }
    constructor(container, logger, PromiseJobs) {
        this.container = container;
        this.logger = logger;
        this.PromiseJobs = PromiseJobs;
        this.timeout = 100;
        this.contextId = 0;
        this.stack = new ExecutionContextStack(logger);
    }
    static Create(container, promiseJobs) {
        const logger = container.get(kernel.ILogger).root.scopeTo('Realm');
        logger.debug('Creating new realm');
        const realm = new Realm(container, logger, promiseJobs);
        new Intrinsics(realm);
        realm['[[GlobalObject]]'] = (void 0);
        realm['[[GlobalEnv]]'] = (void 0);
        realm['[[TemplateMap]]'] = [];
        const intrinsics = realm['[[Intrinsics]]'];
        const newContext = new ExecutionContext(realm);
        newContext.Function = intrinsics.null;
        newContext.ScriptOrModule = intrinsics.null;
        realm.stack.push(newContext);
        const globalObj = $Object.ObjectCreate(newContext, 'GlobalObject', intrinsics['%ObjectPrototype%']);
        const thisValue = globalObj;
        realm['[[GlobalObject]]'] = globalObj;
        const newGlobalEnv = new $GlobalEnvRec(logger, realm, globalObj, thisValue);
        realm['[[GlobalEnv]]'] = newGlobalEnv;
        const global = realm['[[GlobalObject]]'];
        function def(propertyName, intrinsicName) {
            const name = new $String(realm, propertyName);
            const desc = new $PropertyDescriptor(realm, name);
            desc['[[Writable]]'] = intrinsics.false;
            desc['[[Enumerable]]'] = intrinsics.false;
            desc['[[Configurable]]'] = intrinsics.false;
            desc['[[Value]]'] = intrinsics[intrinsicName];
            $DefinePropertyOrThrow(newContext, global, name, desc);
        }
        def('Infinity', 'Infinity');
        def('NaN', 'NaN');
        def('undefined', 'undefined');
        def('eval', '%eval%');
        def('isFinite', '%isFinite%');
        def('isNaN', '%isNaN%');
        def('parseFloat', '%parseFloat%');
        def('parseInt', '%parseInt%');
        def('decodeURI', '%decodeURI%');
        def('decodeURIComponent', '%decodeURIComponent%');
        def('encodeURI', '%encodeURI%');
        def('encodeURIComponent', '%encodeURIComponent%');
        def('Array', '%Array%');
        def('ArrayBuffer', '%ArrayBuffer%');
        def('Boolean', '%Boolean%');
        def('DataView', '%DataView%');
        def('Date', '%Date%');
        def('Error', '%Error%');
        def('EvalError', '%EvalError%');
        def('Float32Array', '%Float32Array%');
        def('Float64Array', '%Float64Array%');
        def('Function', '%Function%');
        def('Int8Array', '%Int8Array%');
        def('Int16Array', '%Int16Array%');
        def('Int32Array', '%Int32Array%');
        def('Map', '%Map%');
        def('Number', '%Number%');
        def('Object', '%Object%');
        def('Promise', '%Promise%');
        def('Proxy', '%Proxy%');
        def('RangeError', '%RangeError%');
        def('ReferenceError', '%ReferenceError%');
        def('RegExp', '%RegExp%');
        def('Set', '%Set%');
        def('SharedArrayBuffer', '%SharedArrayBuffer%');
        def('String', '%String%');
        def('Symbol', '%Symbol%');
        def('SyntaxError', '%SyntaxError%');
        def('TypeError', '%TypeError%');
        def('Uint8Array', '%Uint8Array%');
        def('Uint8ClampedArray', '%Uint8ClampedArray%');
        def('Uint16Array', '%Uint16Array%');
        def('Uint32Array', '%Uint32Array%');
        def('URIError', '%URIError%');
        def('WeakMap', '%WeakMap%');
        def('WeakSet', '%WeakSet%');
        def('Atomics', '%Atomics%');
        def('JSON', '%JSON%');
        def('Math', '%Math%');
        def('Reflect', '%Reflect%');
        logger.debug('Finished initializing realm');
        return realm;
    }
    GetActiveScriptOrModule() {
        const stack = this.stack;
        if (stack.length === 0) {
            throw new Error(`GetActiveScriptOrModule: stack is empty`);
        }
        let ec;
        let i = stack.length;
        while (i-- > 0) {
            ec = stack[i];
            if (!ec.ScriptOrModule.isNull) {
                return ec.ScriptOrModule;
            }
        }
        throw new Error(`GetActiveScriptOrModule: stack has no execution context with an active module`);
    }
    ResolveBinding(name, env) {
        if (env === void 0) {
            env = this.stack.top.LexicalEnvironment;
        }
        const strict = this['[[Intrinsics]]'].true;
        return this.GetIdentifierReference(env, name, strict);
    }
    GetThisEnvironment() {
        let envRec = this.stack.top.LexicalEnvironment;
        while (true) {
            if (envRec.HasThisBinding(this.stack.top).isTruthy) {
                return envRec;
            }
            envRec = envRec.outer;
        }
    }
    ResolveThisBinding() {
        const envRec = this.GetThisEnvironment();
        return envRec.GetThisBinding(this.stack.top);
    }
    GetCurrentLexicalEnvironment() {
        return this.stack.top.LexicalEnvironment;
    }
    SetCurrentLexicalEnvironment(envRec) {
        this.stack.top.LexicalEnvironment = envRec;
    }
    dispose() {
        this.stack.dispose();
        this.stack = void 0;
        this['[[Intrinsics]]'].dispose();
        this['[[Intrinsics]]'] = void 0;
        this['[[GlobalObject]]'].dispose();
        this['[[GlobalObject]]'] = void 0;
        this['[[GlobalEnv]]'].dispose();
        this['[[GlobalEnv]]'] = void 0;
        this.container = void 0;
        this.logger = void 0;
    }
    GetIdentifierReference(lex, name, strict) {
        const intrinsics = this['[[Intrinsics]]'];
        if (lex.isNull) {
            return new $Reference(this, intrinsics.undefined, name, strict, intrinsics.undefined);
        }
        const envRec = lex;
        const exists = envRec.HasBinding(this.stack.top, name);
        if (exists.isAbrupt) {
            return exists;
        }
        if (exists.isTruthy) {
            return new $Reference(this, envRec, name, strict, intrinsics.undefined);
        }
        else {
            const outer = lex.outer;
            return this.GetIdentifierReference(outer, name, strict);
        }
    }
}
class ExecutionContextStack extends Array {
    constructor(logger) {
        super();
        this.logger = logger;
        this.logger = logger.root.scopeTo('ExecutionContextStack');
    }
    get top() {
        return this[this.length - 1];
    }
    push(context) {
        this.logger.debug(`push(#${context.id}) - new stack size: ${this.length + 1}`);
        return super.push(context);
    }
    pop() {
        this.logger.debug(`pop(#${this.top.id}) - new stack size: ${this.length - 1}`);
        return super.pop();
    }
    toString() {
        let str = '';
        for (let i = 0; i < this.length; ++i) {
            const fn = this[i].Function;
            if (fn === void 0 || fn.isNull) {
                str = `${str}  at NULL\n`;
            }
            else {
                str = `${str}  at ${fn.toString()}\n`;
            }
        }
        return str;
    }
    dispose() {
        this.forEach(x => { x.dispose(); });
        this.length = 0;
        this.logger = void 0;
    }
}
class ExecutionContext {
    constructor(Realm) {
        this.Realm = Realm;
        this.Generator = void 0;
        this.onResume = void 0;
        this.suspended = false;
        this.activityTimestamp = Date.now();
        this.activeTime = 0;
        this.timeoutCheck = 0;
        this.id = ++Realm.contextId;
        this.logger = Realm['logger'].root.scopeTo(`ExecutionContext #${this.id}`);
        this.logger.debug(`constructor()`);
    }
    checkTimeout() {
        if (!this.suspended) {
            if (++this.timeoutCheck === 100) {
                this.timeoutCheck = 0;
                this.activeTime += (Date.now() - this.activityTimestamp);
                this.activityTimestamp = Date.now();
                if (this.activeTime >= this.Realm.timeout) {
                    throw new Error(`Operation timed out`);
                }
            }
        }
    }
    resume() {
        this.logger.debug(`resume()`);
        if (!this.suspended) {
            throw new Error('ExecutionContext is not suspended');
        }
        if (this.Realm.stack.top !== this) {
            throw new Error('ExecutionContext is not at the top of the stack');
        }
        this.suspended = false;
        this.activityTimestamp = Date.now();
    }
    suspend() {
        this.logger.debug(`suspend()`);
        if (this.suspended) {
            throw new Error('ExecutionContext is already suspended');
        }
        if (this.Realm.stack.top !== this) {
            throw new Error('ExecutionContext is not at the top of the stack');
        }
        this.suspended = true;
        this.activeTime += (Date.now() - this.activityTimestamp);
    }
    makeCopy() {
        const ctx = new ExecutionContext(this.Realm);
        ctx.Function = this.Function;
        ctx.ScriptOrModule = this.ScriptOrModule;
        ctx.LexicalEnvironment = this.LexicalEnvironment;
        ctx.VariableEnvironment = this.VariableEnvironment;
        ctx.Generator = this.Generator;
        ctx.onResume = this.onResume;
        ctx.suspended = this.suspended;
        return ctx;
    }
    dispose() {
        this.Function = void 0;
        this.ScriptOrModule.dispose();
        this.ScriptOrModule = void 0;
        this.LexicalEnvironment.dispose();
        this.LexicalEnvironment = void 0;
        this.VariableEnvironment.dispose();
        this.VariableEnvironment = void 0;
        this.Generator = void 0;
        this.Realm = void 0;
        this.logger = void 0;
    }
}

const ISourceFileProvider = kernel.DI.createInterface('ISourceFileProvider');
class Agent {
    constructor(logger) {
        this.logger = logger;
        this.ScriptJobs = new JobQueue(logger, 'Script');
        this.PromiseJobs = new JobQueue(logger, 'Promise');
    }
    async RunJobs(container) {
        const realm = Realm.Create(container, this.PromiseJobs);
        const intrinsics = realm['[[Intrinsics]]'];
        const stack = realm.stack;
        const rootCtx = stack.top;
        const sfProvider = container.get(ISourceFileProvider);
        const files = await sfProvider.GetSourceFiles(rootCtx);
        for (const file of files) {
            if (file.isScript) {
                this.ScriptJobs.EnqueueJob(rootCtx, new ScriptEvaluationJob(realm, file));
            }
            else {
                this.ScriptJobs.EnqueueJob(rootCtx, new TopLevelModuleEvaluationJob(realm, file));
            }
        }
        const ctx = rootCtx;
        let lastFile = null;
        while (true) {
            if (ctx !== rootCtx) {
                ctx.suspend();
                stack.pop();
            }
            let nextPending;
            if (this.ScriptJobs.isEmpty) {
                if (this.PromiseJobs.isEmpty) {
                    this.logger.debug(`Finished successfully`);
                    return new $Empty(realm, 1, intrinsics.empty, lastFile);
                }
                else {
                    nextPending = this.PromiseJobs.queue.shift();
                }
            }
            else {
                nextPending = this.ScriptJobs.queue.shift();
            }
            const newContext = new ExecutionContext(nextPending['[[Realm]]']);
            newContext.Function = intrinsics.null;
            lastFile = newContext.ScriptOrModule = nextPending['[[ScriptOrModule]]'];
            stack.push(newContext);
            const result = nextPending.Run(newContext);
            if (result.isAbrupt) {
                this.logger.debug(`Job completed with errors`);
                return result;
            }
        }
    }
    dispose() {
        this.PromiseJobs.dispose();
        this.ScriptJobs.dispose();
        this.PromiseJobs = void 0;
        this.ScriptJobs = void 0;
        this.logger = void 0;
    }
}
class TopLevelModuleEvaluationJob extends Job {
    constructor(realm, mos) {
        super(realm.logger.scopeTo('TopLevelModuleEvaluationJob'), realm, mos);
    }
    Run(ctx) {
        this.logger.debug(`Run(#${ctx.id})`);
        const m = this['[[ScriptOrModule]]'];
        const result = m.Instantiate(ctx);
        if (result.isAbrupt) {
            return result;
        }
        return m.EvaluateModule(ctx);
    }
}
class ScriptEvaluationJob extends Job {
    constructor(realm, mos) {
        super(realm.logger.scopeTo('ScriptEvaluationJob'), realm, mos);
    }
    Run(ctx) {
        this.logger.debug(`Run(#${ctx.id})`);
        const m = this['[[ScriptOrModule]]'];
        return m.EvaluateScript(ctx);
    }
}

function countSlashes(path) {
    let count = 0;
    const len = path.length;
    for (let i = 0; i < len; ++i) {
        if (path.charCodeAt(i) === 47) {
            ++count;
        }
    }
    return count;
}
function createFileComparer(preferredNames) {
    const len = preferredNames.length;
    let name = '';
    return function compareFiles(a, b) {
        const aName = path.basename(a.path);
        const bName = path.basename(b.path);
        const aDepth = countSlashes(a.path);
        const bDepth = countSlashes(b.path);
        if (aDepth === bDepth) {
            for (let i = 0; i < len; ++i) {
                name = preferredNames[i];
                if (aName === name) {
                    return -1;
                }
                if (bName === name) {
                    return 1;
                }
            }
            return aName < bName ? -1 : aName > bName ? 1 : 0;
        }
        if (aName === bName) {
            return aDepth - bDepth;
        }
        if (preferredNames.includes(aName)) {
            if (preferredNames.includes(bName)) {
                return aDepth - bDepth;
            }
            return -1;
        }
        if (preferredNames.includes(bName)) {
            return 1;
        }
        return aDepth - bDepth;
    };
}
const compareExternalModuleEntryFile = createFileComparer([
    'index.js',
    'app.js',
    'server.js',
]);
const compareApplicationEntryFile = createFileComparer([
    'index.ts',
    'index.js',
    'startup.ts',
    'startup.js',
    'main.ts',
    'main.js',
]);
function determineEntryFileByConvention(files, isPrimaryEntryPoint) {
    if (isPrimaryEntryPoint) {
        return files.slice().sort(compareApplicationEntryFile)[0];
    }
    return files.slice().sort(compareExternalModuleEntryFile)[0];
}
class NPMPackageLoader {
    static get inject() { return [kernel.IContainer, kernel.ILogger, IFileSystem]; }
    constructor(container, logger, fs) {
        this.container = container;
        this.logger = logger;
        this.fs = fs;
        this.pkgCache = new Map();
        this.pkgPromiseCache = new Map();
        this.pkgResolveCache = new Map();
        this.pkgResolvePromiseCache = new Map();
        this.logger = logger.root.scopeTo('NPMPackageLoader');
    }
    async loadEntryPackage(projectDir) {
        const start = Date.now();
        this.logger.info(`load()`);
        projectDir = normalizePath(projectDir);
        const entryPkg = await this.loadPackageCore(projectDir, null);
        await entryPkg.loadDependencies();
        this.pkgPromiseCache.clear();
        const end = Date.now();
        const packages = Array.from(this.pkgCache.values());
        const pkgCount = packages.length;
        const fileCount = packages.reduce((count, pkg) => count + pkg.files.length, 0);
        this.logger.info(`Discovered ${fileCount} files across ${pkgCount} packages in ${Math.round(end - start)}ms`);
        for (const pkg of packages) {
            this.logger.info(`- ${pkg.pkgName}: ${pkg.files.length} files`);
        }
        return entryPkg;
    }
    getCachedPackage(refName) {
        const pkg = this.pkgCache.get(refName);
        if (pkg === void 0) {
            throw new Error(`Cannot resolve package ${refName}`);
        }
        return pkg;
    }
    async loadPackage(issuer) {
        const pkgPromiseCache = this.pkgPromiseCache;
        let pkgPromise = pkgPromiseCache.get(issuer.refName);
        if (pkgPromise === void 0) {
            pkgPromise = this.loadPackageCore(null, issuer);
            pkgPromiseCache.set(issuer.refName, pkgPromise);
        }
        return pkgPromise;
    }
    async loadPackageCore(dir, issuer) {
        this.logger.info(`loadPackageCore(\n  dir: ${dir},\n  issuer: ${issuer === null ? 'null' : issuer.issuer.pkgName}\n)`);
        const fs = this.fs;
        const pkgCache = this.pkgCache;
        const refName = dir === null ? issuer.refName : dir;
        let pkg = pkgCache.get(refName);
        if (pkg === void 0) {
            if (dir === null) {
                dir = await this.resolvePackagePath(issuer);
            }
            const pkgPath = joinPath(dir, 'package.json');
            const files = await fs.getFiles(dir);
            const pkgJsonFile = files.find(x => x.path === pkgPath);
            if (pkgJsonFile === void 0) {
                throw new Error(`No package.json found at "${pkgPath}"`);
            }
            const pkgJsonFileContent = await pkgJsonFile.getContent();
            pkg = new NPMPackage(this, files, issuer, pkgJsonFile, dir, pkgJsonFileContent);
            pkgCache.set(refName, pkg);
        }
        return pkg;
    }
    async resolvePackagePath(dep) {
        const pkgResolvePromiseCache = this.pkgResolvePromiseCache;
        const refName = dep.refName;
        let resolvePromise = pkgResolvePromiseCache.get(refName);
        if (resolvePromise === void 0) {
            resolvePromise = this.resolvePackagePathCore(dep);
            pkgResolvePromiseCache.set(refName, resolvePromise);
        }
        return resolvePromise;
    }
    async resolvePackagePathCore(dep) {
        const fs = this.fs;
        const pkgResolveCache = this.pkgResolveCache;
        const refName = dep.refName;
        let resolvedPath = pkgResolveCache.get(refName);
        if (resolvedPath === void 0) {
            let dir = dep.issuer.dir;
            while (true) {
                resolvedPath = joinPath(dir, 'node_modules', refName, 'package.json');
                if (await fs.isReadable(resolvedPath)) {
                    break;
                }
                const parent = normalizePath(path.dirname(dir));
                if (parent === dir) {
                    throw new Error(`Unable to resolve npm dependency "${refName}"`);
                }
                dir = parent;
            }
            const realPath = normalizePath(await fs.getRealPath(resolvedPath));
            if (realPath === resolvedPath) {
                this.logger.debug(`resolved "${refName}" directly to "${path.dirname(realPath)}"`);
            }
            else {
                this.logger.debug(`resolved "${refName}" to "${path.dirname(realPath)}" via symlink "${path.dirname(resolvedPath)}"`);
            }
            resolvedPath = normalizePath(path.dirname(realPath));
            pkgResolveCache.set(refName, resolvedPath);
        }
        return resolvedPath;
    }
}
class NPMPackage {
    constructor(loader, files, issuer, pkgJsonFile, dir, pkgJsonFileContent) {
        this.loader = loader;
        this.files = files;
        this.issuer = issuer;
        this.pkgJsonFile = pkgJsonFile;
        this.dir = dir;
        this.container = loader.container;
        const pkgJson = this.pkgJson = JSON.parse(pkgJsonFileContent);
        const pkgName = this.pkgName = typeof pkgJson.name === 'string' ? pkgJson.name : dir.slice(dir.lastIndexOf('/') + 1);
        const pkgModuleOrMain = typeof pkgJson.module === 'string' ? pkgJson.module : pkgJson.main;
        const isAureliaPkg = this.isAureliaPkg = pkgName.startsWith('@aurelia');
        const isEntryPoint = this.isEntryPoint = issuer === null;
        let entryFilePath = isAureliaPkg ? 'src/index.ts' : pkgModuleOrMain;
        let entryFile;
        if (entryFilePath === void 0) {
            entryFile = determineEntryFileByConvention(files, isEntryPoint);
        }
        else {
            if (entryFilePath.startsWith('.')) {
                entryFilePath = entryFilePath.slice(1);
            }
            entryFile = files.find(x => x.path.endsWith(entryFilePath));
            if (entryFile === void 0) {
                const withJs = `${entryFilePath}.js`;
                entryFile = files.find(x => x.path.endsWith(withJs));
                if (entryFile === void 0) {
                    const withIndexJs = joinPath(entryFilePath, 'index.js');
                    entryFile = files.find(x => x.path.endsWith(withIndexJs));
                }
            }
        }
        if (entryFile === void 0) {
            throw new Error(`No entry file could be located for package ${pkgName}`);
        }
        this.entryFile = entryFile;
        if (pkgJson.dependencies instanceof Object) {
            this.deps = Object.keys(pkgJson.dependencies).map(name => new NPMPackageDependency(this, name));
        }
        else {
            this.deps = kernel.emptyArray;
        }
    }
    async loadDependencies() {
        await Promise.all(this.deps.map(loadDependency));
    }
}
async function loadDependency(dep) {
    await dep.load();
    await dep.pkg.loadDependencies();
}
class NPMPackageDependency {
    get pkg() {
        const pkg = this._pkg;
        if (pkg === void 0) {
            throw new Error(`Package ${this.refName} is not yet loaded`);
        }
        return pkg;
    }
    constructor(issuer, refName) {
        this.issuer = issuer;
        this.refName = refName;
        this._pkg = void 0;
        this.loadPromise = void 0;
    }
    async load() {
        if (this._pkg === void 0) {
            if (this.loadPromise === void 0) {
                this.loadPromise = this.loadCore();
            }
            return this.loadPromise;
        }
    }
    async loadCore() {
        this._pkg = await this.issuer.loader.loadPackage(this);
        this.loadPromise = void 0;
        Object.freeze(this);
    }
}

const lookup = new WeakMap();
class PatternMatcher {
    constructor(logger, compilerOptions) {
        this.logger = logger;
        this.compilerOptions = compilerOptions;
        this.logger = logger.scopeTo(this.constructor.name);
        this.rootDir = resolvePath(compilerOptions.__dirname);
        this.basePath = joinPath(this.rootDir, compilerOptions.baseUrl);
        this.sources = Object.keys(compilerOptions.paths).map(x => new PatternSource(this.logger, this, x));
    }
    findMatch(files, specifier) {
        const sources = this.sources;
        const len = sources.length;
        let match;
        for (let i = 0; i < len; ++i) {
            match = sources[i].findMatch(files, specifier);
            if (match === null) {
                this.logger.trace(`Source pattern "${sources[i].pattern}" (path "${sources[i].patternPath}") is NOT a match for specifier "${specifier}"`);
            }
            else {
                this.logger.debug(`Source pattern "${sources[i].pattern}" is a match for specifier "${specifier}"`);
                return match;
            }
        }
        throw new Error(`Cannot resolve "${specifier}:`);
    }
    static getOrCreate(compilerOptions, container) {
        let matcher = lookup.get(compilerOptions);
        if (matcher === void 0) {
            if (compilerOptions.baseUrl !== void 0 && compilerOptions.paths !== void 0) {
                const logger = container.get(kernel.ILogger);
                matcher = new PatternMatcher(logger, compilerOptions);
            }
            else {
                matcher = null;
            }
            lookup.set(compilerOptions, matcher);
        }
        return matcher;
    }
}
class PatternSource {
    constructor(logger, matcher, pattern) {
        this.logger = logger;
        this.matcher = matcher;
        this.pattern = pattern;
        this.logger = logger.scopeTo(this.constructor.name);
        if (pattern.endsWith('*')) {
            this.hasWildcard = true;
            this.patternPath = pattern.slice(0, -1);
        }
        else {
            this.hasWildcard = false;
            this.patternPath = pattern;
        }
        this.isWildcard = pattern === '*';
        this.targets = matcher.compilerOptions.paths[pattern].map(x => new PatternTarget(this.logger, this, x));
    }
    findMatch(files, specifier) {
        if (this.isWildcard) {
            return this.findMatchCore(files, specifier);
        }
        if (this.hasWildcard) {
            if (specifier.startsWith(this.patternPath)) {
                return this.findMatchCore(files, specifier.replace(this.patternPath, ''));
            }
            return null;
        }
        if (this.patternPath === specifier) {
            return this.findMatchCore(files, specifier);
        }
        return null;
    }
    findMatchCore(files, specifier) {
        const targets = this.targets;
        const len = targets.length;
        let target;
        let match = null;
        for (let i = 0; i < len; ++i) {
            target = targets[i];
            match = target.findMatch(files, specifier);
            if (match !== null) {
                return match;
            }
        }
        return null;
    }
}
class PatternTarget {
    constructor(logger, source, pattern) {
        this.logger = logger;
        this.source = source;
        this.pattern = pattern;
        this.logger = logger.scopeTo(this.constructor.name);
        if (pattern.endsWith('*')) {
            this.hasWildcard = true;
            this.patternPath = joinPath(source.matcher.basePath, pattern.slice(0, -1));
        }
        else {
            this.hasWildcard = false;
            this.patternPath = joinPath(source.matcher.basePath, pattern);
        }
    }
    findMatch(files, specifier) {
        const targetPath = this.hasWildcard ? joinPath(this.patternPath, specifier) : this.patternPath;
        const len = files.length;
        let file;
        for (let i = 0; i < len; ++i) {
            file = files[i];
            if (file.shortPath === targetPath || file.path === targetPath) {
                return file;
            }
        }
        return null;
    }
}

function comparePathLength(a, b) {
    return a.path.length - b.path.length;
}
class SpecificSourceFileProvider {
    constructor(host, file, mode) {
        this.host = host;
        this.file = file;
        this.mode = mode;
    }
    async GetSourceFiles(ctx) {
        return [
            await this.host.loadSpecificFile(ctx, this.file, this.mode),
        ];
    }
}
class EntrySourceFileProvider {
    constructor(host, dir) {
        this.host = host;
        this.dir = dir;
    }
    async GetSourceFiles(ctx) {
        return [
            await this.host.loadEntryFile(ctx, this.dir),
        ];
    }
}
class ServiceHost {
    get jsdom() {
        let jsdom$1 = this._jsdom;
        if (jsdom$1 === null) {
            jsdom$1 = this._jsdom = new jsdom.JSDOM('');
        }
        return jsdom$1;
    }
    constructor(container, logger = container.get(kernel.ILogger), fs = container.get(IFileSystem)) {
        this.container = container;
        this.logger = logger;
        this.fs = fs;
        this._jsdom = null;
        this.compilerOptionsCache = new Map();
        this.moduleCache = new Map();
        this.scriptCache = new Map();
        this.agent = new Agent(logger);
    }
    async loadEntryFile(ctx, dir) {
        this.logger.info(`Loading entry file at: ${dir}`);
        const pkg = await this.loadEntryPackage(dir);
        this.logger.info(`Finished loading entry file`);
        return this.getESModule(ctx, pkg.entryFile, pkg);
    }
    async loadSpecificFile(ctx, file, mode) {
        if (mode === 'module') {
            return this.getESModule(ctx, file, null);
        }
        else {
            return this.getESScript(ctx, file);
        }
    }
    executeEntryFile(dir) {
        const container = this.container.createChild();
        container.register(kernel.Registration.instance(ISourceFileProvider, new EntrySourceFileProvider(this, dir)));
        return this.agent.RunJobs(container);
    }
    executeSpecificFile(file, mode) {
        const container = this.container.createChild();
        container.register(kernel.Registration.instance(ISourceFileProvider, new SpecificSourceFileProvider(this, file, mode)));
        return this.agent.RunJobs(container);
    }
    executeProvider(provider) {
        const container = this.container.createChild();
        container.register(kernel.Registration.instance(ISourceFileProvider, provider));
        return this.agent.RunJobs(container);
    }
    ResolveImportedModule(ctx, referencingModule, $specifier) {
        const specifier = normalizePath($specifier['[[Value]]']);
        const isRelative = isRelativeModulePath(specifier);
        const pkg = referencingModule.pkg;
        if (pkg === null) {
            if (!isRelative) {
                throw new Error(`Absolute module resolution not yet implemented for single-file scenario.`);
            }
            const dir = referencingModule.$file.dir;
            const ext = '';
            const name = path.basename(specifier);
            const shortName = name.slice(0, -3);
            const path$1 = joinPath(dir, name);
            const file = new File(this.fs, path$1, dir, specifier, name, shortName, ext);
            return this.getESModule(ctx, file, null);
        }
        if (isRelative) {
            this.logger.debug(`[ResolveImport] resolving internal relative module: '${$specifier['[[Value]]']}' for ${referencingModule.$file.name}`);
            const filePath = resolvePath(path.dirname(referencingModule.$file.path), specifier);
            const files = pkg.files.filter(x => x.shortPath === filePath || x.path === filePath).sort(comparePathLength);
            if (files.length === 0) {
                throw new Error(`Cannot find file "${filePath}" (imported as "${specifier}" by "${referencingModule.$file.name}")`);
            }
            let file = files.find(x => x.kind === 1);
            if (file === void 0) {
                file = files.find(x => x.kind === 2);
                if (file === void 0) {
                    file = files[0];
                    let deferred = this.moduleCache.get(file.path);
                    if (deferred === void 0) {
                        deferred = new DeferredModule(file, ctx.Realm);
                        this.moduleCache.set(file.path, deferred);
                    }
                    return deferred;
                }
                return this.getHTMLModule(ctx, file, pkg);
            }
            return this.getESModule(ctx, file, pkg);
        }
        else {
            const pkgDep = pkg.deps.find(n => n.refName === specifier || specifier.startsWith(`${n.refName}/`));
            if (pkgDep === void 0) {
                this.logger.debug(`[ResolveImport] resolving internal absolute module: '${$specifier['[[Value]]']}' for ${referencingModule.$file.name}`);
                const matcher = PatternMatcher.getOrCreate(referencingModule.compilerOptions, this.container);
                if (matcher !== null) {
                    const file = matcher.findMatch(pkg.files, specifier);
                    return this.getESModule(ctx, file, pkg);
                }
                else {
                    throw new Error(`Cannot resolve absolute file path without path mappings in tsconfig`);
                }
            }
            else {
                this.logger.debug(`[ResolveImport] resolving external absolute module: '${$specifier['[[Value]]']}' for ${referencingModule.$file.name}`);
                const externalPkg = pkg.loader.getCachedPackage(pkgDep.refName);
                if (pkgDep.refName !== specifier) {
                    if (externalPkg.entryFile.shortName === specifier) {
                        return this.getESModule(ctx, externalPkg.entryFile, externalPkg);
                    }
                    let file = externalPkg.files.find(x => x.shortPath === externalPkg.dir && x.ext === '.js');
                    if (file === void 0) {
                        const indexModulePath = joinPath(externalPkg.dir, 'index');
                        file = externalPkg.files.find(f => f.shortPath === indexModulePath && f.ext === '.js');
                        if (file === void 0) {
                            const partialAbsolutePath = joinPath('node_modules', specifier);
                            file = externalPkg.files.find(f => f.shortPath.endsWith(partialAbsolutePath) && f.ext === '.js');
                            if (file === void 0) {
                                throw new Error(`Unable to resolve file "${externalPkg.dir}" or "${indexModulePath}" (refName="${pkgDep.refName}", entryFile="${externalPkg.entryFile.shortPath}", specifier=${specifier})`);
                            }
                        }
                    }
                    return this.getESModule(ctx, file, externalPkg);
                }
                else {
                    return this.getESModule(ctx, externalPkg.entryFile, externalPkg);
                }
            }
        }
    }
    dispose() {
        this.agent.dispose();
        this.agent = void 0;
        this.compilerOptionsCache.clear();
        this.compilerOptionsCache = void 0;
        for (const mod of this.moduleCache.values()) {
            mod.dispose();
        }
        this.moduleCache.clear();
        this.moduleCache = void 0;
        this.container = void 0;
    }
    loadEntryPackage(dir) {
        this.logger.trace(`loadEntryPackage(${dir})`);
        const loader = this.container.get(NPMPackageLoader);
        return loader.loadEntryPackage(dir);
    }
    getHTMLModule(ctx, file, pkg) {
        let hm = this.moduleCache.get(file.path);
        if (hm === void 0) {
            const sourceText = file.getContentSync();
            const template = this.jsdom.window.document.createElement('template');
            template.innerHTML = sourceText;
            hm = new $DocumentFragment(this.logger, file, template.content, ctx.Realm, pkg);
            this.moduleCache.set(file.path, hm);
        }
        return hm;
    }
    getESScript(ctx, file) {
        let script = this.scriptCache.get(file.path);
        if (script === void 0) {
            const sourceText = file.getContentSync();
            const sf = typescript.createSourceFile(file.path, sourceText, typescript.ScriptTarget.Latest, false);
            script = new $ESScript(this.logger, file, sf, ctx.Realm);
            this.scriptCache.set(file.path, script);
        }
        return script;
    }
    getESModule(ctx, file, pkg) {
        let esm = this.moduleCache.get(file.path);
        if (esm === void 0) {
            const compilerOptions = this.getCompilerOptions(file.path, pkg);
            const sourceText = file.getContentSync();
            const sf = typescript.createSourceFile(file.path, sourceText, typescript.ScriptTarget.Latest, false);
            esm = new $ESModule(this.logger, file, sf, ctx.Realm, pkg, this, compilerOptions);
            this.moduleCache.set(file.path, esm);
        }
        return esm;
    }
    getCompilerOptions(path$1, pkg) {
        path$1 = normalizePath(path$1);
        let compilerOptions = this.compilerOptionsCache.get(path$1);
        if (compilerOptions === void 0) {
            const dir = normalizePath(path.dirname(path$1));
            if (dir === path$1 || pkg === null) {
                compilerOptions = {
                    __dirname: '',
                };
            }
            else {
                const tsConfigPath = joinPath(path$1, 'tsconfig.json');
                const tsConfigFile = pkg.files.find(x => x.path === tsConfigPath);
                if (tsConfigFile === void 0) {
                    compilerOptions = this.getCompilerOptions(dir, pkg);
                }
                else {
                    const tsConfigText = tsConfigFile.getContentSync();
                    const tsConfigObj = new Function(`return ${tsConfigText}`)();
                    compilerOptions = tsConfigObj.compilerOptions;
                    if (compilerOptions === null || typeof compilerOptions !== 'object') {
                        compilerOptions = {
                            __dirname: tsConfigFile.dir,
                        };
                    }
                    else {
                        compilerOptions.__dirname = tsConfigFile.dir;
                    }
                }
            }
            this.compilerOptionsCache.set(path$1, compilerOptions);
        }
        return compilerOptions;
    }
}

exports.$Boolean = $Boolean;
exports.$DocumentFragment = $DocumentFragment;
exports.$ESModule = $ESModule;
exports.$ESScript = $ESScript;
exports.$Empty = $Empty;
exports.$Error = $Error;
exports.$Null = $Null;
exports.$Number = $Number;
exports.$Object = $Object;
exports.$RangeError = $RangeError;
exports.$ReferenceError = $ReferenceError;
exports.$String = $String;
exports.$Symbol = $Symbol;
exports.$SyntaxError = $SyntaxError;
exports.$TypeError = $TypeError;
exports.$URIError = $URIError;
exports.$Undefined = $Undefined;
exports.DeferredModule = DeferredModule;
exports.ExecutionContext = ExecutionContext;
exports.IFileSystem = IFileSystem;
exports.ISourceFileProvider = ISourceFileProvider;
exports.Job = Job;
exports.Realm = Realm;
exports.ServiceHost = ServiceHost;
//# sourceMappingURL=index.cjs.map
