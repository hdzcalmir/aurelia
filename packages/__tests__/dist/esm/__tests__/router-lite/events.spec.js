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
import { DI, noop } from '@aurelia/kernel';
import { IRouter, IRouterEvents, RouterConfiguration, route } from '@aurelia/router-lite';
import { AppTask, Aurelia, customElement } from '@aurelia/runtime-html';
import { TestContext, assert } from '@aurelia/testing';
import { TestRouterConfiguration } from './_shared/configuration.js';
describe('router-lite/events.spec.ts', function () {
    async function start({ appRoot, registrations = [] }) {
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, ...registrations, IRouterEventLoggerService, AppTask.creating(IRouterEventLoggerService, noop), // force the service creation
        AppTask.deactivating(IRouterEventLoggerService, service => service.dispose()));
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        await au.app({ component: appRoot, host }).start();
        const rootVm = au.root.controller.viewModel;
        return { host, au, container, rootVm };
    }
    const IRouterEventLoggerService = DI.createInterface('IRouterEventLoggerService', x => x.singleton(RouterEventLoggerService));
    let RouterEventLoggerService = class RouterEventLoggerService {
        constructor(events) {
            this.log = [];
            this.subscriptions = [
                events.subscribe('au:router:navigation-start', (event) => {
                    this.log.push(`${event.name} - ${event.id} - '${event.instructions.toUrl(false, false)}'`);
                }),
                events.subscribe('au:router:navigation-end', (event) => {
                    this.log.push(`${event.name} - ${event.id} - '${event.instructions.toUrl(false, false)}'`);
                }),
                events.subscribe('au:router:navigation-cancel', (event) => {
                    this.log.push(`${event.name} - ${event.id} - '${event.instructions.toUrl(false, false)}' - ${String(event.reason)}`);
                }),
                events.subscribe('au:router:navigation-error', (event) => {
                    this.log.push(`${event.name} - ${event.id} - '${event.instructions.toUrl(false, false)}' - ${String(event.error)}`);
                }),
            ];
        }
        clear() {
            this.log.length = 0;
        }
        dispose() {
            const subscriptions = this.subscriptions;
            this.subscriptions.length = 0;
            const len = subscriptions.length;
            for (let i = 0; i < len; i++) {
                subscriptions[i].dispose();
            }
        }
    };
    RouterEventLoggerService = __decorate([
        __param(0, IRouterEvents),
        __metadata("design:paramtypes", [Object])
    ], RouterEventLoggerService);
    it('successful navigation', async function () {
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            customElement({ name: 'c-1', template: 'c1' })
        ], ChildOne);
        let ChildTwo = class ChildTwo {
        };
        ChildTwo = __decorate([
            customElement({ name: 'c-2', template: 'c2' })
        ], ChildTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c1'], component: ChildOne },
                    { id: 'r2', path: 'c2', component: ChildTwo },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const service = container.get(IRouterEventLoggerService);
        const router = container.get(IRouter);
        // init
        assert.html.textContent(host, 'c1');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 1 - \'\'',
            'au:router:navigation-end - 1 - \'\'',
        ]);
        // round#1
        service.clear();
        await router.load('c2');
        assert.html.textContent(host, 'c2');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 2 - \'c2\'',
            'au:router:navigation-end - 2 - \'c2\'',
        ]);
        // round#2
        service.clear();
        await router.load('c1');
        assert.html.textContent(host, 'c1');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 3 - \'c1\'',
            'au:router:navigation-end - 3 - \'c1\'',
        ]);
        await au.stop(true);
    });
    it('cancelled navigation - canLoad', async function () {
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            customElement({ name: 'c-1', template: 'c1' })
        ], ChildOne);
        let ChildTwo = class ChildTwo {
            canLoad(params) {
                return Number(params.id) % 2 === 0;
            }
        };
        ChildTwo = __decorate([
            customElement({ name: 'c-2', template: 'c2' })
        ], ChildTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: ['', 'c1'], component: ChildOne },
                    { path: 'c2/:id', component: ChildTwo },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const service = container.get(IRouterEventLoggerService);
        const router = container.get(IRouter);
        // init
        assert.html.textContent(host, 'c1');
        // round#1
        service.clear();
        await router.load('c2/43');
        assert.html.textContent(host, 'c1');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 2 - \'c2/43\'',
            'au:router:navigation-cancel - 2 - \'c2/43\' - guardsResult is false',
        ]);
        // round#2
        service.clear();
        await router.load('c2/42');
        assert.html.textContent(host, 'c2');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 3 - \'c2/42\'',
            'au:router:navigation-end - 3 - \'c2/42\'',
        ]);
        await au.stop(true);
    });
    it('cancelled navigation - canUnload', async function () {
        let ChildOne = class ChildOne {
            canUnload() { return false; }
        };
        ChildOne = __decorate([
            customElement({ name: 'c-1', template: 'c1' })
        ], ChildOne);
        let ChildTwo = class ChildTwo {
        };
        ChildTwo = __decorate([
            customElement({ name: 'c-2', template: 'c2' })
        ], ChildTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: ['', 'c1'], component: ChildOne },
                    { path: 'c2', component: ChildTwo },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const service = container.get(IRouterEventLoggerService);
        const router = container.get(IRouter);
        // init
        assert.html.textContent(host, 'c1');
        // round#1
        service.clear();
        await router.load('c2');
        assert.html.textContent(host, 'c1');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 2 - \'c2\'',
            'au:router:navigation-cancel - 2 - \'c2\' - guardsResult is false',
        ]);
        await au.stop(true);
    });
    it('cancelled navigation - unknown route', async function () {
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            customElement({ name: 'c-1', template: 'c1' })
        ], ChildOne);
        let ChildTwo = class ChildTwo {
        };
        ChildTwo = __decorate([
            customElement({ name: 'c-2', template: 'c2' })
        ], ChildTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c1'], component: ChildOne },
                    { id: 'r2', path: 'c2', component: ChildTwo },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const service = container.get(IRouterEventLoggerService);
        const router = container.get(IRouter);
        // init
        assert.html.textContent(host, 'c1');
        // round#1
        service.clear();
        try {
            await router.load('c3');
            assert.fail('expected error due to unknown path');
        }
        catch (e) {
            /* noop */
        }
        assert.html.textContent(host, 'c1');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 2 - \'c3\'',
            'au:router:navigation-cancel - 2 - \'c3\' - guardsResult is true',
            'au:router:navigation-start - 3 - \'\'',
            'au:router:navigation-end - 3 - \'\'',
        ]);
        await au.stop(true);
    });
    it('erred navigation - without recovery', async function () {
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            customElement({ name: 'c-1', template: 'c1' })
        ], ChildOne);
        let ChildTwo = class ChildTwo {
            loading() {
                throw new Error('synthetic test error');
            }
        };
        ChildTwo = __decorate([
            customElement({ name: 'c-2', template: 'c2' })
        ], ChildTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c1'], component: ChildOne },
                    { id: 'r2', path: 'c2', component: ChildTwo },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const service = container.get(IRouterEventLoggerService);
        const router = container.get(IRouter);
        // init
        assert.html.textContent(host, 'c1');
        // round#1
        service.clear();
        try {
            await router.load('c2');
            assert.fail('expected error');
        }
        catch (e) {
            /* noop */
        }
        assert.html.textContent(host, 'c1');
        assert.deepStrictEqual(service.log, [
            'au:router:navigation-start - 2 - \'c2\'',
            'au:router:navigation-error - 2 - \'c2\' - Error: synthetic test error',
            'au:router:navigation-cancel - 2 - \'c2\' - guardsResult is true',
            'au:router:navigation-start - 3 - \'\'',
            'au:router:navigation-end - 3 - \'\'',
        ]);
        await au.stop(true);
    });
});
//# sourceMappingURL=events.spec.js.map