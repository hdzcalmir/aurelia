var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { IContainer } from '@aurelia/kernel';
import { CustomElement } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
import { createFixture } from './_shared/create-fixture.js';
describe('router/viewport.spec.ts', function () {
    it('can be created', async function () {
        const App = CustomElement.define({ name: 'app', template: '<au-viewport></au-viewport>' });
        const { router, tearDown } = await createFixture(App);
        const viewport = router.allEndpoints('Viewport').filter(vp => vp.name === 'default')[0];
        assert.strictEqual(viewport.name, 'default', `name === 'default'`);
        await tearDown();
    });
    it('can understand exist attributes', async function () {
        const App = CustomElement.define({ name: 'app', template: '<au-viewport no-link></au-viewport>' });
        const { router, tearDown } = await createFixture(App);
        const viewport = router.allEndpoints('Viewport').filter(vp => vp.name === 'default')[0];
        assert.strictEqual(viewport.options.noLink, true, `noLink === true`);
        await tearDown();
    });
    it('loads default component', async function () {
        const One = CustomElement.define({ name: 'one', template: '!one!' });
        const App = CustomElement.define({ name: 'app', template: '<au-viewport default="one"></au-viewport>', dependencies: [One] });
        const { host, tearDown } = await createFixture(App);
        assert.strictEqual(host.textContent, '!one!', `default="one" loaded`);
        await tearDown();
    });
    it('loads sibling default components', async function () {
        const One = CustomElement.define({ name: 'one', template: '!one!' });
        const Two = CustomElement.define({ name: 'two', template: '!two!' });
        const App = CustomElement.define({
            name: 'app', dependencies: [One, Two],
            template: '<au-viewport name="left" default="one"></au-viewport><au-viewport name="right" default="two"></au-viewport>',
        });
        const { host, tearDown } = await createFixture(App);
        assert.strictEqual(host.textContent, '!one!!two!', `default="one" default="two" loaded`);
        await tearDown();
    });
    it('loads recursive default components', async function () {
        const One = CustomElement.define({ name: 'one', template: '!one!<au-viewport default="two"></au-viewport>' });
        const Two = CustomElement.define({ name: 'two', template: '!two!' });
        const App = CustomElement.define({
            name: 'app', dependencies: [One, Two],
            template: '<au-viewport name="left" default="one"></au-viewport>',
        });
        const { host, tearDown } = await createFixture(App);
        assert.strictEqual(host.textContent, '!one!!two!', `default="one" default="two" loaded`);
        await tearDown();
    });
    it('loads component with correct container', async function () {
        let testContainer, testController;
        let OneClass = class OneClass {
            constructor(container) {
                this.container = container;
                testContainer = container;
            }
            created(controller) {
                testController = controller;
            }
        };
        OneClass = __decorate([
            __param(0, IContainer),
            __metadata("design:paramtypes", [Object])
        ], OneClass);
        const One = CustomElement.define({ name: 'one', template: '!one!' }, OneClass);
        const App = CustomElement.define({ name: 'app', template: '<au-viewport default="one"></au-viewport>', dependencies: [One] });
        const { host, tearDown } = await createFixture(App);
        assert.strictEqual(host.textContent, '!one!', `default="one" loaded`);
        assert.strictEqual(testContainer, testController.container, `injected container equals controller container`);
        await tearDown();
    });
});
//# sourceMappingURL=viewport.spec.js.map