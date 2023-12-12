var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Metadata } from '@aurelia/metadata';
import { alias, Aurelia, customAttribute, CustomAttributeDefinition, customElement } from '@aurelia/runtime-html';
import { assert, TestContext } from "@aurelia/testing";
function startAndStop(component) {
    const ctx = TestContext.create();
    const container = ctx.container;
    const au = new Aurelia(container);
    const host = ctx.createElement('div');
    au.app({ host, component });
    void au.start();
    void au.stop();
    au.dispose();
}
function getMetadataAsObject(target) {
    return Metadata.getKeys(target).reduce(function (obj, key) {
        obj[key] = Metadata.get(key, target);
        return obj;
    }, {});
}
describe('3-runtime-html/resources.spec.ts', function () {
    it('works in the most basic scenario', function () {
        let created = false;
        let AuAttr = class AuAttr {
            constructor() { created = true; }
        };
        AuAttr = __decorate([
            customAttribute('au-name'),
            __metadata("design:paramtypes", [])
        ], AuAttr);
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: '<div au-name></div>', dependencies: [AuAttr] })
        ], App);
        startAndStop(App);
        assert.strictEqual(created, true, 'created');
        const $class = getMetadataAsObject(AuAttr);
        const $proto = getMetadataAsObject(AuAttr.prototype);
        assert.deepStrictEqual($class['au:annotation'], [
            'au:annotation:di:dependencies',
        ], `$class['au:annotation']`);
        assert.deepStrictEqual($class['au:resource'], [
            'au:resource:custom-attribute',
        ], `$class['au:resource']`);
        assert.deepStrictEqual($class['au:resource:custom-attribute'], CustomAttributeDefinition.create({
            name: 'au-name',
        }, AuAttr), `$class['au:resource:custom-attribute']`);
        assert.deepStrictEqual($proto, {}, `$proto`);
    });
    // xit('works with alias decorator before customAttribute decorator', function () {
    //   let created = false;
    //   @alias('au-alias')
    //   @customAttribute('au-name')
    //   class AuAttr {
    //     public constructor() { created = true; }
    //   }
    //   @customElement({ name: 'app', template: '<div au-alias></div>', dependencies: [AuAttr] })
    //   class App {}
    //   startAndStop(App);
    //   assert.strictEqual(created, true, 'created');
    // });
    it('works with alias decorator after customAttribute decorator', function () {
        let created = false;
        let AuAttr = class AuAttr {
            constructor() { created = true; }
        };
        AuAttr = __decorate([
            customAttribute('au-name'),
            alias('au-alias'),
            __metadata("design:paramtypes", [])
        ], AuAttr);
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: '<div au-alias></div>', dependencies: [AuAttr] })
        ], App);
        startAndStop(App);
        assert.strictEqual(created, true, 'created');
        const $class = getMetadataAsObject(AuAttr);
        const $proto = getMetadataAsObject(AuAttr.prototype);
        assert.deepStrictEqual($class['au:annotation'], [
            'au:annotation:di:dependencies',
        ], `$class['au:annotation']`);
        assert.deepStrictEqual($class['au:resource'], [
            'au:resource:custom-attribute',
        ], `$class['au:resource']`);
        assert.deepStrictEqual($class['au:resource:custom-attribute'], CustomAttributeDefinition.create({
            name: 'au-name',
        }, AuAttr), `$class['au:resource:custom-attribute']`);
        assert.deepStrictEqual($proto, {}, `$proto`);
    });
    it('works with alias property in customAttribute decorator', function () {
        let created = false;
        let AuAttr = class AuAttr {
            constructor() { created = true; }
        };
        AuAttr = __decorate([
            customAttribute({ name: 'au-name', aliases: ['au-alias'] }),
            __metadata("design:paramtypes", [])
        ], AuAttr);
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: '<div au-alias></div>', dependencies: [AuAttr] })
        ], App);
        startAndStop(App);
        assert.strictEqual(created, true, 'created');
    });
    it('works with aliases static property', function () {
        let created = false;
        let AuAttr = class AuAttr {
            constructor() { created = true; }
        };
        AuAttr.aliases = ['au-alias'];
        AuAttr = __decorate([
            customAttribute('au-name'),
            __metadata("design:paramtypes", [])
        ], AuAttr);
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: '<div au-alias></div>', dependencies: [AuAttr] })
        ], App);
        startAndStop(App);
        assert.strictEqual(created, true, 'created');
    });
});
//# sourceMappingURL=resources.spec.js.map