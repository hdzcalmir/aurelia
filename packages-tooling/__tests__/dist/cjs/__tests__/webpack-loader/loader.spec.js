"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@aurelia/testing");
const webpack_loader_1 = require("@aurelia/webpack-loader");
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
describe('webpack-loader', function () {
    it('transforms html file', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.html content';
        const context = {
            async: () => function (err, code, map) {
                if (err) {
                    done(err);
                    return;
                }
                testing_1.assert.equal(code, expected);
                testing_1.assert.equal(map.version, 3);
                done();
            },
            resourcePath: 'src/foo-bar.html'
        };
        webpack_loader_1.loader.call(context, content, preprocess);
    });
    it('transforms html file in shadowDOM mode', function (done) {
        const content = 'content';
        const expected = 'processed {"mode":"open"} src/foo-bar.html content';
        const context = {
            async: () => function (err, code, map) {
                if (err) {
                    done(err);
                    return;
                }
                testing_1.assert.equal(code, expected);
                testing_1.assert.equal(map.version, 3);
                done();
            },
            query: { defaultShadowOptions: { mode: 'open' } },
            resourcePath: 'src/foo-bar.html'
        };
        webpack_loader_1.loader.call(context, content, preprocess);
    });
    it('transforms html file in CSSModule mode', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.html content';
        const context = {
            async: () => function (err, code, map) {
                if (err) {
                    done(err);
                    return;
                }
                testing_1.assert.equal(code, expected);
                testing_1.assert.equal(map.version, 3);
                done();
            },
            query: { useCSSModule: true },
            resourcePath: 'src/foo-bar.html'
        };
        webpack_loader_1.loader.call(context, content, preprocess);
    });
    it('transforms html file in shadowDOM mode ignoring CSSModule mode', function (done) {
        const content = 'content';
        const expected = 'processed {"mode":"open"} src/foo-bar.html content';
        const context = {
            async: () => function (err, code, map) {
                if (err) {
                    done(err);
                    return;
                }
                testing_1.assert.equal(code, expected);
                testing_1.assert.equal(map.version, 3);
                done();
            },
            query: { defaultShadowOptions: { mode: 'open' }, useCSSModule: true },
            resourcePath: 'src/foo-bar.html'
        };
        webpack_loader_1.loader.call(context, content, preprocess);
    });
    it('transforms js file', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.js content';
        const context = {
            async: () => function (err, code, map) {
                if (err) {
                    done(err);
                    return;
                }
                testing_1.assert.equal(code, expected);
                testing_1.assert.equal(map.version, 3);
                done();
            },
            resourcePath: 'src/foo-bar.js'
        };
        webpack_loader_1.loader.call(context, content, preprocess);
    });
    it('transforms ts file', function (done) {
        const content = 'content';
        const expected = 'processed src/foo-bar.ts content';
        const context = {
            async: () => function (err, code, map) {
                if (err) {
                    done(err);
                    return;
                }
                testing_1.assert.equal(code, expected);
                testing_1.assert.equal(map.version, 3);
                done();
            },
            resourcePath: 'src/foo-bar.ts'
        };
        webpack_loader_1.loader.call(context, content, preprocess);
    });
    it('bypass other file', function (done) {
        const content = 'content';
        // const notExpected = 'processed src/foo-bar.css content';
        const context = {
            async: () => function (err, code, map) {
                if (err) {
                    done(err);
                    return;
                }
                testing_1.assert.equal(code, content);
                testing_1.assert.equal(map, undefined);
                done();
            },
            resourcePath: 'src/foo-bar.css'
        };
        webpack_loader_1.loader.call(context, content, preprocess);
    });
});
//# sourceMappingURL=loader.spec.js.map