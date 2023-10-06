"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_conventions_1 = require("@aurelia/plugin-conventions");
const testing_1 = require("@aurelia/testing");
describe('nameConvention', function () {
    it('complains about empty input', function () {
        testing_1.assert.throws(() => (0, plugin_conventions_1.nameConvention)(''));
    });
    it('gets custom element like resource', function () {
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FooBar'), {
            name: 'foo-bar',
            type: 'customElement'
        });
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('UAFoo'), {
            name: 'ua-foo',
            type: 'customElement'
        });
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('PREFIXFooBar'), {
            name: 'prefix-foo-bar',
            type: 'customElement'
        });
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FooBarCustomElement'), {
            name: 'foo-bar',
            type: 'customElement'
        });
    });
    it('gets custom attribute like resource', function () {
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FooBarCustomAttribute'), {
            name: 'foo-bar',
            type: 'customAttribute'
        });
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FOOBarCustomAttribute'), {
            name: 'foo-bar',
            type: 'customAttribute'
        });
    });
    it('gets value converter like resource', function () {
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FooBarValueConverter'), {
            name: 'fooBar',
            type: 'valueConverter'
        });
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FOOBarValueConverter'), {
            name: 'fooBar',
            type: 'valueConverter'
        });
    });
    it('gets binding behavior like resource', function () {
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FooBarBindingBehavior'), {
            name: 'fooBar',
            type: 'bindingBehavior'
        });
    });
    it('gets binding command like resource', function () {
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FooBarBindingCommand'), {
            name: 'foo-bar',
            type: 'bindingCommand'
        });
    });
    it('gets template controller like resource', function () {
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FooBarTemplateController'), {
            name: 'foo-bar',
            type: 'templateController'
        });
        testing_1.assert.deepEqual((0, plugin_conventions_1.nameConvention)('FOOBarTemplateController'), {
            name: 'foo-bar',
            type: 'templateController'
        });
    });
});
//# sourceMappingURL=name-convention.spec.js.map