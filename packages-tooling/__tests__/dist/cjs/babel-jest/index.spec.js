"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_conventions_1 = require("@aurelia/plugin-conventions");
const babel_jest_1 = require("@aurelia/babel-jest");
const { _createTransformer } = babel_jest_1.default;
const testing_1 = require("@aurelia/testing");
const config_1 = require("../jest-test-utils/config");
function makePreprocess(_fileExists) {
    return function (unit, options) {
        return (0, plugin_conventions_1.preprocess)(unit, options, _fileExists);
    };
}
function babelProcess(sourceText, _sourcePath, _transformOptions) {
    return { code: sourceText };
}
const options = {
    config: (0, config_1.makeProjectConfig)(),
    configString: JSON.stringify((0, config_1.makeProjectConfig)()),
    instrument: false,
    cacheFS: new Map(),
    transformerConfig: {},
    supportsDynamicImport: false,
    supportsTopLevelAwait: false,
    supportsExportNamespaceFrom: true,
    supportsStaticESM: true,
};
describe('babel-jest', function () {
    it('transforms html file', function () {
        const html = '<template></template>';
        const expected = `import { CustomElement } from '@aurelia/runtime-html';
export const name = "foo-bar";
export const template = "<template></template>";
export default template;
export const dependencies = [  ];
export const bindables = [];
let _e;
export function register(container) {
  if (!_e) {
    _e = CustomElement.define({ name, template, dependencies, bindables });
  }
  container.register(_e);
}
`;
        const t = _createTransformer({ hmr: false }, makePreprocess(() => false), babelProcess);
        const result = t.process(html, 'src/foo-bar.html', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('transforms html file with shadowOptions', function () {
        const html = '<template></template>';
        const expected = `import { CustomElement } from '@aurelia/runtime-html';
import { shadowCSS } from '@aurelia/runtime-html';
import d0 from "./foo-bar.less";
export const name = "foo-bar";
export const template = "<template></template>";
export default template;
export const dependencies = [ shadowCSS(d0) ];
export const shadowOptions = { mode: 'open' };
export const bindables = [];
let _e;
export function register(container) {
  if (!_e) {
    _e = CustomElement.define({ name, template, dependencies, shadowOptions, bindables });
  }
  container.register(_e);
}
`;
        const t = _createTransformer({ defaultShadowOptions: { mode: 'open' }, hmr: false }, makePreprocess((u, p) => p === './foo-bar.less'), babelProcess);
        const result = t.process(html, 'src/foo-bar.html', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('transforms html file with cssModules', function () {
        const html = '<template></template>';
        const expected = `import { CustomElement } from '@aurelia/runtime-html';
import { cssModules } from '@aurelia/runtime-html';
import d0 from "./foo-bar.scss";
export const name = "foo-bar";
export const template = "<template></template>";
export default template;
export const dependencies = [ cssModules(d0) ];
export const bindables = [];
let _e;
export function register(container) {
  if (!_e) {
    _e = CustomElement.define({ name, template, dependencies, bindables });
  }
  container.register(_e);
}
`;
        const t = _createTransformer({ useCSSModule: true, hmr: false }, makePreprocess((u, p) => p === './foo-bar.scss'), babelProcess);
        const result = t.process(html, 'src/foo-bar.html', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('transforms js file with html pair', function () {
        const js = 'export class FooBar {}\n';
        const expected = `import { CustomElement } from '@aurelia/runtime-html';
import * as __au2ViewDef from './foo-bar.html';
export class FooBar {}
CustomElement.define(__au2ViewDef, FooBar);

`;
        const t = _createTransformer({ hmr: false }, makePreprocess((u, p) => p === './foo-bar.html'), babelProcess);
        const result = t.process(js, 'src/foo-bar.js', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('ignores js file without html pair', function () {
        const js = 'export class FooBar {}\n';
        const expected = `export class FooBar {}
`;
        const t = _createTransformer({}, makePreprocess(() => false), babelProcess);
        const result = t.process(js, 'src/foo-bar.js', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
});
//# sourceMappingURL=index.spec.js.map