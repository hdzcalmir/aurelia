"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_conventions_1 = require("@aurelia/plugin-conventions");
const testing_1 = require("@aurelia/testing");
describe('resourceName', function () {
    it('returns resource name based on file name', function () {
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('foo.js'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('Foo.js'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('foo-bar.js'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('fooBar.js'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('FooBar.ts'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('foo_bar.ts'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/foo.html'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/Foo.html'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/foo-bar.html'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/fooBar.html'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/FooBar.md'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/foo_bar.md'), 'foo-bar');
    });
    it('supports Nodejs index file', function () {
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('foo/index.js'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('Foo/index.js'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('foo-bar/index.js'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('fooBar/index.js'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('FooBar/index.ts'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('foo_bar/index.ts'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/foo/index.html'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/Foo/index.html'), 'foo');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/foo-bar/index.html'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/fooBar/index.html'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/FooBar/index.md'), 'foo-bar');
        testing_1.assert.equal((0, plugin_conventions_1.resourceName)('a/b/foo_bar/index.md'), 'foo-bar');
    });
});
//# sourceMappingURL=resource-name.spec.js.map