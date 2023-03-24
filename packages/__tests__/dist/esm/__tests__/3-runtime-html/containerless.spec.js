var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Aurelia, containerless, customElement, IPlatform } from '@aurelia/runtime-html';
import { assert, TestContext } from '@aurelia/testing';
import { createSpecFunction } from '../util.js';
describe('3-runtime-html/containerless.spec.ts', function () {
    async function runTest(testFunction, { appType, registrations = [] }) {
        const ctx = TestContext.create();
        const container = ctx.container;
        const host = ctx.doc.createElement('app');
        ctx.doc.body.appendChild(host);
        const au = new Aurelia(container);
        await au
            .register(registrations)
            .app({ host, component: appType })
            .start();
        const app = au.root.controller.viewModel;
        await testFunction({ app, host, container, platform: container.get(IPlatform), ctx });
        await au.stop();
        ctx.doc.body.removeChild(host);
        au.dispose();
    }
    const $it = createSpecFunction(runTest);
    {
        let CeFoo = class CeFoo {
        };
        CeFoo = __decorate([
            containerless(),
            customElement({
                name: 'ce-foo',
                template: 'ce-foo content'
            })
        ], CeFoo);
        let App = class App {
            constructor() {
                this.message = 'Hello World!';
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                template: '<ce-foo></ce-foo>',
            })
        ], App);
        $it('execution order: customElement -> containerless', function ({ host }) {
            assert.html.textContent(host, 'ce-foo content');
            assert.strictEqual(host.querySelector('ce-foo'), null);
        }, { appType: App, registrations: [CeFoo] });
    }
    {
        let CeFoo = class CeFoo {
        };
        CeFoo = __decorate([
            customElement({
                name: 'ce-foo',
                template: 'ce-foo content'
            }),
            containerless()
        ], CeFoo);
        let App = class App {
            constructor() {
                this.message = 'Hello World!';
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                template: '<ce-foo></ce-foo>',
            })
        ], App);
        $it('execution order: containerless -> customElement', function ({ host }) {
            assert.html.textContent(host, 'ce-foo content');
            assert.strictEqual(host.querySelector('ce-foo'), null);
        }, { appType: App, registrations: [CeFoo] });
    }
});
//# sourceMappingURL=containerless.spec.js.map