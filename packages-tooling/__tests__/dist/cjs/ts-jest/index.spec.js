"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_conventions_1 = require("@aurelia/plugin-conventions");
const ts_jest_1 = require("@aurelia/ts-jest");
const { _createTransformer } = ts_jest_1.default;
const testing_1 = require("@aurelia/testing");
const config_1 = require("../jest-test-utils/config");
function makePreprocess(_fileExists) {
    return function (unit, options) {
        return (0, plugin_conventions_1.preprocess)(unit, options, _fileExists);
    };
}
function tsProcess(sourceText, _sourcePath, _transformOptions) {
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
describe('ts-jest', function () {
    it('transforms html file', function () {
        const html = '<template></template>';
        const expected = `// @ts-nocheck
import { CustomElement } from '@aurelia/runtime-html';
export const name = "foo-bar";
export const template = "<template></template>";
export default template;
export const dependencies = [  ];
let _e;
export function register(container) {
  if (!_e) {
    _e = CustomElement.define({ name, template, dependencies });
  }
  container.register(_e);
}
`;
        const t = _createTransformer({ hmr: false }, makePreprocess(() => false), tsProcess);
        const result = t.process(html, 'src/foo-bar.html', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('transforms html file with shadowOptions', function () {
        const html = '<template></template>';
        const expected = `// @ts-nocheck
import { CustomElement } from '@aurelia/runtime-html';
import { shadowCSS } from '@aurelia/runtime-html';
import d0 from "./foo-bar.less";
export const name = "foo-bar";
export const template = "<template></template>";
export default template;
export const dependencies = [ shadowCSS(d0) ];
export const shadowOptions = { mode: 'open' };
let _e;
export function register(container) {
  if (!_e) {
    _e = CustomElement.define({ name, template, dependencies, shadowOptions });
  }
  container.register(_e);
}
`;
        const t = _createTransformer({ defaultShadowOptions: { mode: 'open' }, hmr: false }, makePreprocess((u, p) => p === './foo-bar.less'), tsProcess);
        const result = t.process(html, 'src/foo-bar.html', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('transforms html file with cssModules', function () {
        const html = '<template></template>';
        const expected = `// @ts-nocheck
import { CustomElement } from '@aurelia/runtime-html';
import { cssModules } from '@aurelia/runtime-html';
import d0 from "./foo-bar.scss";
export const name = "foo-bar";
export const template = "<template></template>";
export default template;
export const dependencies = [ cssModules(d0) ];
let _e;
export function register(container) {
  if (!_e) {
    _e = CustomElement.define({ name, template, dependencies });
  }
  container.register(_e);
}
`;
        const t = _createTransformer({ useCSSModule: true, hmr: false }, makePreprocess((u, p) => p === './foo-bar.scss'), tsProcess);
        const result = t.process(html, 'src/foo-bar.html', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('transforms js file with html pair', function () {
        const js = 'export class FooBar {}\n';
        const expected = `import { customElement } from '@aurelia/runtime-html';
import * as __au2ViewDef from './foo-bar.html';
@customElement(__au2ViewDef)
export class FooBar {}
`;
        const t = _createTransformer({ hmr: false }, makePreprocess((u, p) => p === './foo-bar.html'), tsProcess);
        const result = t.process(js, 'src/foo-bar.js', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
    it('ignores js file without html pair', function () {
        const js = 'export class FooBar {}\n';
        const expected = `export class FooBar {}
`;
        const t = _createTransformer({ hmr: false }, makePreprocess(() => false), tsProcess);
        const result = t.process(js, 'src/foo-bar.js', options);
        testing_1.assert.deepEqual(result, { code: expected });
    });
});
//# sourceMappingURL=index.spec.js.map