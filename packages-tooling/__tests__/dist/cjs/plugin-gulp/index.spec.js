"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const plugin_gulp_1 = require("@aurelia/plugin-gulp");
const testing_1 = require("@aurelia/testing");
const v = require("vinyl");
const slash = process.platform === 'win32' ? '\\' : '/';
const Vinyl = (v.default || v);
function preprocess(unit, options) {
    if (unit.path.endsWith('.css'))
        return;
    const { defaultShadowOptions, stringModuleWrap } = options;
    const shadowOptionsString = defaultShadowOptions ? (`${JSON.stringify(defaultShadowOptions)} `) : '';
    const stringModuleWrapString = defaultShadowOptions && stringModuleWrap ? stringModuleWrap(unit.path) : unit.path;
    return {
        code: `processed ${shadowOptionsString}${stringModuleWrapString} ${unit.contents}`,
        map: { version: 3 }
    };
}
describe('plugin-gulp', function () {
    it('complains about stream mode', function (done) {
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, {}, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', (error) => {
            testing_1.assert.equal(files.length, 0);
            testing_1.assert.includes(error.message, '@aurelia/plugin-gulp: Streaming is not supported');
            done();
        });
        t.end(new Vinyl({
            path: 'test/foo-bar.html',
            contents: new stream_1.Readable()
        }));
    });
    it('bypass other file', function (done) {
        const css = '.a { color: red; }';
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, {}, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', done);
        t.on('end', () => {
            testing_1.assert.equal(files.length, 1);
            testing_1.assert.equal(files[0].relative, 'test/foo.css'.replace('/', slash));
            testing_1.assert.equal(files[0].contents.toString(), css);
            testing_1.assert.equal(files[0].sourceMap, undefined);
            done();
        });
        t.end(new Vinyl({
            path: 'test/foo.css',
            contents: Buffer.from(css)
        }));
    });
    it('transforms html file', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.html content'.replace('/', slash);
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, {}, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', done);
        t.on('end', () => {
            testing_1.assert.equal(files.length, 1);
            testing_1.assert.equal(files[0].relative, 'src/foo-bar.html.js'.replace('/', slash));
            testing_1.assert.equal(files[0].contents.toString(), expected);
            testing_1.assert.equal(files[0].sourceMap, undefined);
            done();
        });
        t.end(new Vinyl({
            path: 'src/foo-bar.html',
            contents: Buffer.from(content)
        }));
    });
    it('transforms html file in shadowDOM mode', function (done) {
        const content = 'content';
        const expected = 'processed {"mode":"open"} text!src/foo-bar.html content'.replace('/', slash);
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, {
            defaultShadowOptions: { mode: 'open' },
            stringModuleWrap: (id) => `text!${id}`
        }, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', done);
        t.on('end', () => {
            testing_1.assert.equal(files.length, 1);
            testing_1.assert.equal(files[0].relative, 'src/foo-bar.html.js'.replace('/', slash));
            testing_1.assert.equal(files[0].contents.toString(), expected);
            testing_1.assert.equal(files[0].sourceMap.version, 3);
            done();
        });
        t.end(new Vinyl({
            path: 'src/foo-bar.html',
            contents: Buffer.from(content),
            sourceMap: {}
        }));
    });
    it('transforms html file in CSSModule mode', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.html content'.replace('/', slash);
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, { useCSSModule: true }, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', done);
        t.on('end', () => {
            testing_1.assert.equal(files.length, 1);
            testing_1.assert.equal(files[0].relative, 'src/foo-bar.html.js'.replace('/', slash));
            testing_1.assert.equal(files[0].contents.toString(), expected);
            testing_1.assert.equal(files[0].sourceMap.version, 3);
            done();
        });
        t.end(new Vinyl({
            path: 'src/foo-bar.html',
            contents: Buffer.from(content),
            sourceMap: {}
        }));
    });
    it('transforms html file in shadowDOM mode ignoring CSSModule mode', function (done) {
        const content = 'content';
        const expected = 'processed {"mode":"open"} text!src/foo-bar.html content'.replace('/', slash);
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, {
            defaultShadowOptions: { mode: 'open' },
            stringModuleWrap: (id) => `text!${id}`,
            useCSSModule: true
        }, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', done);
        t.on('end', () => {
            testing_1.assert.equal(files.length, 1);
            testing_1.assert.equal(files[0].relative, 'src/foo-bar.html.js'.replace('/', slash));
            testing_1.assert.equal(files[0].contents.toString(), expected);
            testing_1.assert.equal(files[0].sourceMap.version, 3);
            done();
        });
        t.end(new Vinyl({
            path: 'src/foo-bar.html',
            contents: Buffer.from(content),
            sourceMap: {}
        }));
    });
    it('transforms js file', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.js content'.replace('/', slash);
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, {}, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', done);
        t.on('end', () => {
            testing_1.assert.equal(files.length, 1);
            testing_1.assert.equal(files[0].relative, 'src/foo-bar.js'.replace('/', slash));
            testing_1.assert.equal(files[0].contents.toString(), expected);
            testing_1.assert.equal(files[0].sourceMap, undefined);
            done();
        });
        t.end(new Vinyl({
            path: 'src/foo-bar.js',
            contents: Buffer.from(content)
        }));
    });
    it('transforms ts file', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.ts content'.replace('/', slash);
        const files = [];
        const t = plugin_gulp_1.plugin.call(undefined, {}, preprocess);
        t.pipe(new stream_1.Writable({
            objectMode: true,
            write(file, enc, cb) {
                files.push(file);
                cb();
            }
        }));
        t.on('error', done);
        t.on('end', () => {
            testing_1.assert.equal(files.length, 1);
            testing_1.assert.equal(files[0].relative, 'src/foo-bar.ts'.replace('/', slash));
            testing_1.assert.equal(files[0].contents.toString(), expected);
            testing_1.assert.equal(files[0].sourceMap, undefined);
            done();
        });
        t.end(new Vinyl({
            path: 'src/foo-bar.ts',
            contents: Buffer.from(content)
        }));
    });
});
//# sourceMappingURL=index.spec.js.map