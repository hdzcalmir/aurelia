"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferedFileSink = void 0;
const kernel_1 = require("@aurelia/kernel");
const aot_1 = require("@aurelia/aot");
const path_1 = require("path");
const fs_1 = require("fs");
class TestMetadataNegative {
    constructor(phase, type) {
        this.phase = phase;
        this.type = type;
    }
}
class TestMetadata {
    constructor(negative, features, flags) {
        this.negative = negative;
        this.features = features;
        this.flags = flags;
    }
    static from(content) {
        const start = content.indexOf('/*---');
        const end = content.indexOf('---*/');
        if (start >= 0 && end >= start) {
            const banner = content.slice(start + '/*---'.length, end);
            const lines = banner.split('\n');
            let negative = null;
            const negativeIndex = lines.findIndex(l => l.startsWith('negative:'));
            if (negativeIndex >= 0) {
                const [, phase] = lines[negativeIndex + 1].split(': ');
                const [, type] = lines[negativeIndex + 2].split(': ');
                negative = new TestMetadataNegative(phase, type);
            }
            let features = [];
            const featuresIndex = lines.findIndex(l => l.startsWith('features: '));
            if (featuresIndex >= 0) {
                const featureList = lines[featuresIndex].split(': ');
                features = featureList[1].slice(1, -2).split(', ');
            }
            let flags = [];
            const flagsIndex = lines.findIndex(l => l.startsWith('flags: '));
            if (flagsIndex >= 0) {
                const flagList = lines[flagsIndex].split(': ');
                flags = flagList[1].slice(1, -2).split(', ');
            }
            return new TestMetadata(negative, features, flags);
        }
        return null;
    }
}
const excludedFeatures = [
    'import.meta',
    // Not yet implemented, see https://tc39.es/proposal-dynamic-import
    'dynamic-import',
];
class TestCase {
    get host() {
        let host = this._host;
        if (host === null) {
            host = this._host = new aot_1.ServiceHost(this.container);
        }
        return host;
    }
    constructor(container, logger, file, prerequisites) {
        this.container = container;
        this.logger = logger;
        this.file = file;
        this.prerequisites = prerequisites;
        this._host = null;
        this.meta = TestMetadata.from(file.getContentSync());
        this.files = [...prerequisites, file];
    }
    async GetSourceFiles(ctx) {
        const host = this.host;
        return Promise.all(this.files.map(x => host.loadSpecificFile(ctx, x, 'script'))); // TODO: decide this based on meta
    }
    run() {
        return this.host.executeProvider(this);
    }
    dispose() {
        this.meta = void 0;
        this.files = void 0;
        if (this['_host'] !== null) {
            this['_host'].dispose();
            this['_host'] = void 0;
        }
        this.container = void 0;
        this.logger = void 0;
        this.file = void 0;
        this.prerequisites = void 0;
    }
}
function compareFiles(a, b) {
    const aPath = a.path.toLowerCase();
    const bPath = b.path.toLowerCase();
    const aLen = aPath.length;
    const bLen = bPath.length;
    let aCh = 0;
    let bCh = 0;
    for (let i = 0; i < aLen; ++i) {
        if (i <= bLen) {
            aCh = aPath.charCodeAt(i);
            bCh = bPath.charCodeAt(i);
            if (aCh < bCh) {
                return -1;
            }
            else if (aCh > bCh) {
                return 1;
            }
        }
        else {
            return 1;
        }
    }
    return -1;
}
class TestStats {
    get $pass() { return this.pass.toString().padStart(4, ' '); }
    get $fail() { return this.fail.toString().padStart(4, ' '); }
    get $error() { return this.error.toString().padStart(4, ' '); }
    get $skip() { return this.skip.toString().padStart(4, ' '); }
    get isDone() {
        return this.pass + this.fail + this.error + this.skip === this.total;
    }
    get isPass() {
        return this.fail === 0 && this.error === 0;
    }
    constructor(dir, name) {
        this.dir = dir;
        this.name = name;
        this.pass = 0;
        this.fail = 0;
        this.error = 0;
        this.skip = 0;
        this.total = 0;
    }
    toString() {
        return `${this.isPass ? kernel_1.format.green('PASS') : kernel_1.format.red('FAIL')} - [pass:${this.$pass} fail:${this.$fail} error:${this.$error} skip:${this.$skip}] - ${this.name}`;
    }
}
class TestReporter {
    constructor(logger) {
        this.logger = logger;
        this.dirs = {};
        this.totals = new TestStats('', 'Total');
    }
    register(tc) {
        const dirs = this.dirs;
        const totals = this.totals;
        const file = tc.file;
        let stats = dirs[file.dir];
        if (stats === void 0) {
            stats = dirs[file.dir] = new TestStats(file.dir, file.rootlessPath.split('/').slice(0, -1).join('/'));
        }
        ++totals.total;
        ++stats.total;
        return tc;
    }
    pass(tc) {
        this.progress(tc, 'pass');
    }
    fail(tc) {
        this.progress(tc, 'fail');
    }
    error(tc) {
        this.progress(tc, 'error');
    }
    skip(tc) {
        this.progress(tc, 'skip');
    }
    progress(tc, type) {
        const stats = this.dirs[tc.file.dir];
        const totals = this.totals;
        ++stats[type];
        ++totals[type];
        if (stats.isDone) {
            this.report(stats);
        }
        if (totals.isDone) {
            this.reportTotals(totals);
        }
    }
    report(stats) {
        this.logger.info(stats.toString());
    }
    reportTotals(stats) {
        this.logger.info(`------ FINISHED -------`);
        this.logger.info(stats.toString());
    }
}
function toString(x) {
    return x.toString();
}
const utf8Encoding = { encoding: 'utf8' };
class BufferedFileSink {
    constructor() {
        this.buffer = [];
        this.queued = false;
    }
    emit(event) {
        const buffer = this.buffer;
        buffer.push(event);
        if (buffer.length > 100) {
            this.flush(false);
        }
        else if (!this.queued) {
            this.queued = true;
            process.nextTick(this.flush, true);
        }
    }
    flush(fromTick) {
        const buffer = this.buffer;
        if (fromTick) {
            this.queued = false;
        }
        if (buffer.length > 0) {
            const output = buffer.map(toString).join('\n');
            buffer.length = 0;
            (0, fs_1.appendFileSync)('aot.log', output, utf8Encoding);
        }
    }
}
__decorate([
    kernel_1.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], BufferedFileSink.prototype, "flush", null);
exports.BufferedFileSink = BufferedFileSink;
class TestRunner {
    constructor() {
        const container = this.container = kernel_1.DI.createContainer();
        container.register(kernel_1.Registration.instance(kernel_1.ILogConfig, new kernel_1.LogConfig(0 /* ColorOptions.noColors */, 2 /* LogLevel.info */)), kernel_1.Registration.instance(kernel_1.ISink, new BufferedFileSink()), kernel_1.ConsoleSink, kernel_1.Registration.singleton(aot_1.IFileSystem, aot_1.NodeFileSystem));
        this.fs = container.get(aot_1.IFileSystem);
        this.logger = container.get(kernel_1.ILogger).scopeTo('TestRunner');
    }
    async load() {
        var _a, _b;
        const fs = this.fs;
        const logger = this.logger;
        const root = (0, path_1.resolve)(__dirname, '..', '..', '..', 'test262');
        const testDir = (0, path_1.join)(root, 'test');
        const _annexBDir = (0, path_1.join)(testDir, 'annexB');
        const _builtInsDir = (0, path_1.join)(testDir, 'built-ins', 'Array');
        const _intl402Dir = (0, path_1.join)(testDir, 'intl402');
        const languageDir = (0, path_1.join)(testDir, 'language');
        const harnessDir = (0, path_1.join)(root, 'harness');
        const harnessFiles = await fs.getFiles(harnessDir, true);
        const staFile = harnessFiles.find(x => x.name === 'sta.js');
        const assertFile = harnessFiles.find(x => x.name === 'assert.js');
        const prerequisites = [staFile, assertFile];
        const now = Date.now();
        const files = [
        // ...(await fs.getFiles(join(languageDir, 'eval-code', 'indirect'), true)).filter(x => x.shortName.endsWith('realm'))
        ];
        for (const dir of [
            // annexBDir,
            // builtInsDir,
            // intl402Dir,
            languageDir,
        ]) {
            logger.info(`Loading test files from ${dir}`);
            // eslint-disable-next-line no-await-in-loop
            files.push(...(await fs.getFiles(dir, true)).filter(x => !x.shortName.endsWith('FIXTURE')));
        }
        logger.info(`Discovered ${files.length} test files in ${Math.round(Date.now() - now)}ms`);
        const reporter = new TestReporter(logger);
        let testCases = files
            .slice()
            .sort(compareFiles)
            .map(x => reporter.register(new TestCase(this.container, logger, x, prerequisites)));
        testCases = testCases
            .filter(tc => {
            var _a, _b, _c;
            switch ((_c = (_b = (_a = tc.meta) === null || _a === void 0 ? void 0 : _a.negative) === null || _b === void 0 ? void 0 : _b.phase) === null || _c === void 0 ? void 0 : _c.trim()) {
                case 'early':
                case 'parse':
                    // These error types should be caught by typescript
                    reporter.skip(tc);
                    tc.dispose();
                    return false;
            }
            if (excludedFeatures.some(x => tc.meta.features.includes(x))) {
                reporter.skip(tc);
                tc.dispose();
                return false;
            }
            return true;
        });
        for (const tc of testCases) {
            try {
                // eslint-disable-next-line no-await-in-loop
                const result = await tc.run();
                if (tc.meta.negative === null) {
                    if (result.isAbrupt) {
                        reporter.fail(tc);
                        let message;
                        let stack;
                        let type;
                        const value = result['[[Value]]'];
                        if (value instanceof Error) {
                            message = value.message;
                            stack = value.stack;
                            type = value.name;
                        }
                        else {
                            message = value;
                            stack = result.stack;
                            type = result.Type;
                        }
                        logger.error(`${kernel_1.format.red('FAIL')} - ${tc.file.rootlessPath}\n  Expected no error, but got: ${type}: ${message}\n${stack}\n`);
                    }
                    else {
                        reporter.pass(tc);
                        logger.debug(`${kernel_1.format.green('PASS')} - ${tc.file.rootlessPath}`);
                    }
                }
                else {
                    if (result.isAbrupt) {
                        if (result['[[Value]]'].name === tc.meta.negative.type) {
                            reporter.pass(tc);
                            logger.debug(`${kernel_1.format.green('PASS')} - ${tc.file.rootlessPath}`);
                        }
                        else {
                            reporter.fail(tc);
                            logger.error(`${kernel_1.format.red('FAIL')} - ${tc.file.rootlessPath} (expected error ${tc.meta.negative.type}, but got: ${result['[[Value]]'].name})`);
                        }
                    }
                    else {
                        reporter.fail(tc);
                        logger.error(`${kernel_1.format.red('FAIL')} - ${tc.file.rootlessPath} (expected error ${tc.meta.negative.type}, but got none)`);
                    }
                }
            }
            catch (err) {
                reporter.error(tc);
                logger.fatal(`${kernel_1.format.red('Host error')}: ${err.message}\n${err.stack}\n\nTest file: ${tc.file.rootlessPath}\n${(_b = (_a = tc.meta) === null || _a === void 0 ? void 0 : _a.negative) === null || _b === void 0 ? void 0 : _b.phase}`);
            }
            finally {
                tc.dispose();
            }
        }
    }
}
(async function () {
    const runner = new TestRunner();
    await runner.load();
})().catch(err => {
    console.error(err);
    process.exit(-1);
});
//# sourceMappingURL=setup-test262.js.map