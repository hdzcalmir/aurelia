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
import { kebabCase, ILogConfig, Registration, noop, inject } from '@aurelia/kernel';
import { assert, TestContext } from '@aurelia/testing';
import { RouterConfiguration, IRouter, IRouteContext, route, IRouterOptions, Router, IRouterEvents, RouterOptions, RouteContext } from '@aurelia/router-lite';
import { Aurelia, valueConverter, customElement, CustomElement, IHistory, ILocation, INode, IPlatform, IWindow, StandardConfiguration, watch } from '@aurelia/runtime-html';
import { getLocationChangeHandlerRegistration, TestRouterConfiguration } from './_shared/configuration.js';
import { start } from './_shared/create-fixture.js';
import { isNode } from '../util.js';
function vp(count) {
    return '<au-viewport></au-viewport>'.repeat(count);
}
function getText(spec) {
    return spec.map(function (x) {
        if (x instanceof Array) {
            return getText(x);
        }
        return kebabCase(x.name);
    }).join('');
}
function assertComponentsVisible(host, spec, msg = '') {
    assert.strictEqual(host.textContent, getText(spec), msg);
}
function assertIsActive(router, instruction, context, expected, assertId) {
    const isActive = router.isActive(instruction, context);
    assert.strictEqual(isActive, expected, `expected isActive to return ${expected} (assertId ${assertId})`);
}
async function createFixture(Component, deps, level = 5 /* LogLevel.fatal */) {
    const ctx = TestContext.create();
    const { container, platform } = ctx;
    container.register(TestRouterConfiguration.for(level));
    container.register(RouterConfiguration);
    container.register(...deps);
    const component = container.get(Component);
    const router = container.get(IRouter);
    const au = new Aurelia(container);
    const host = ctx.createElement('div');
    au.app({ component, host });
    await au.start();
    assertComponentsVisible(host, [Component]);
    const logConfig = container.get(ILogConfig);
    return {
        ctx,
        au,
        host,
        component,
        platform,
        container,
        router,
        startTracing() {
            logConfig.level = 0 /* LogLevel.trace */;
        },
        stopTracing() {
            logConfig.level = level;
        },
        async tearDown() {
            assert.areTaskQueuesEmpty();
            await au.stop(true);
        }
    };
}
describe('router-lite/smoke-tests.spec.ts', function () {
    let A01 = class A01 {
    };
    A01 = __decorate([
        customElement({ name: 'a01', template: `a01${vp(0)}` })
    ], A01);
    let A02 = class A02 {
    };
    A02 = __decorate([
        customElement({ name: 'a02', template: `a02${vp(0)}` })
    ], A02);
    const A0 = [A01, A02];
    let A11 = class A11 {
    };
    A11 = __decorate([
        route({
            routes: [
                { path: 'a01', component: A01, transitionPlan: 'invoke-lifecycles' },
                { path: 'a02', component: A02, transitionPlan: 'invoke-lifecycles' },
            ]
        }),
        customElement({ name: 'a11', template: `a11${vp(1)}` })
    ], A11);
    let A12 = class A12 {
    };
    A12 = __decorate([
        route({
            routes: [
                { path: 'a01', component: A01, transitionPlan: 'invoke-lifecycles' },
                { path: 'a02', component: A02, transitionPlan: 'invoke-lifecycles' },
                { path: 'a11', component: A11, transitionPlan: 'invoke-lifecycles' },
            ]
        }),
        customElement({ name: 'a12', template: `a12${vp(1)}` })
    ], A12);
    const A1 = [A11, A12];
    let A21 = class A21 {
    };
    A21 = __decorate([
        customElement({ name: 'a21', template: `a21${vp(2)}` })
    ], A21);
    let A22 = class A22 {
    };
    A22 = __decorate([
        customElement({ name: 'a22', template: `a22${vp(2)}` })
    ], A22);
    const A2 = [A21, A22];
    const A = [...A0, ...A1, ...A2];
    let B01 = class B01 {
        async canUnload(_next, _current) {
            await new Promise(function (resolve) { setTimeout(resolve, 0); });
            return true;
        }
    };
    B01 = __decorate([
        customElement({ name: 'b01', template: `b01${vp(0)}` })
    ], B01);
    let B02 = class B02 {
        async canUnload(_next, _current) {
            await new Promise(function (resolve) { setTimeout(resolve, 0); });
            return false;
        }
    };
    B02 = __decorate([
        customElement({ name: 'b02', template: `b02${vp(0)}` })
    ], B02);
    const B0 = [B01, B02];
    let B11 = class B11 {
        async canUnload(_next, _current) {
            await new Promise(function (resolve) { setTimeout(resolve, 0); });
            return true;
        }
    };
    B11 = __decorate([
        route({
            routes: [
                { path: 'a01', component: A01, transitionPlan: 'invoke-lifecycles' },
                { path: 'a02', component: A02, transitionPlan: 'invoke-lifecycles' },
                { path: 'b01', component: B01, transitionPlan: 'invoke-lifecycles' },
                { path: 'b02', component: B02, transitionPlan: 'invoke-lifecycles' },
            ]
        }),
        customElement({ name: 'b11', template: `b11${vp(1)}` })
    ], B11);
    let B12 = class B12 {
        async canUnload(_next, _current) {
            await new Promise(function (resolve) { setTimeout(resolve, 0); });
            return false;
        }
    };
    B12 = __decorate([
        route({
            routes: [
                { path: 'a01', component: A01, transitionPlan: 'invoke-lifecycles' },
                { path: 'a02', component: A02, transitionPlan: 'invoke-lifecycles' },
                { path: 'b01', component: B01, transitionPlan: 'invoke-lifecycles' },
                { path: 'b02', component: B02, transitionPlan: 'invoke-lifecycles' },
            ]
        }),
        customElement({ name: 'b12', template: `b12${vp(1)}` })
    ], B12);
    const B1 = [B11, B12];
    const B = [...B0, ...B1];
    const Z = [...A, ...B];
    let Root1 = class Root1 {
    };
    Root1 = __decorate([
        route({
            routes: [
                { path: 'a01', component: A01, transitionPlan: 'invoke-lifecycles' },
                { path: 'a02', component: A02, transitionPlan: 'invoke-lifecycles' },
                { path: 'a11', component: A11, transitionPlan: 'invoke-lifecycles' },
                { path: 'a12', component: A12, transitionPlan: 'invoke-lifecycles' },
                { path: 'b11', component: B11, transitionPlan: 'invoke-lifecycles' },
                { path: 'b12', component: B12, },
            ]
        }),
        customElement({ name: 'root1', template: `root1${vp(1)}` })
    ], Root1);
    let Root2 = class Root2 {
    };
    Root2 = __decorate([
        route({
            routes: [
                { path: 'a01', component: A01, transitionPlan: 'invoke-lifecycles' },
                { path: 'a02', component: A02, transitionPlan: 'invoke-lifecycles' },
                { path: 'a11', component: A11, transitionPlan: 'invoke-lifecycles' },
                { path: 'a12', component: A12, transitionPlan: 'invoke-lifecycles' },
            ]
        }),
        customElement({ name: 'root2', template: `root2${vp(2)}` })
    ], Root2);
    // Start with a broad sample of non-generated tests that are easy to debug and mess around with.
    it(`root1 can load a01 as a string and can determine if it's active`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load('a01');
        assertComponentsVisible(host, [Root1, A01]);
        assertIsActive(router, 'a01', router.routeTree.root.context, true, 1);
        await tearDown();
    });
    it(`root1 can load a01 as a type and can determine if it's active`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load(A01);
        assertComponentsVisible(host, [Root1, A01]);
        assertIsActive(router, A01, router.routeTree.root.context, true, 1);
        await tearDown();
    });
    it(`root1 can load a01 as a ViewportInstruction and can determine if it's active`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load({ component: A01 });
        assertComponentsVisible(host, [Root1, A01]);
        assertIsActive(router, { component: A01 }, router.routeTree.root.context, true, 1);
        await tearDown();
    });
    it(`root1 can load a01 as a CustomElementDefinition and can determine if it's active`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load(CustomElement.getDefinition(A01));
        assertComponentsVisible(host, [Root1, A01]);
        assertIsActive(router, CustomElement.getDefinition(A01), router.routeTree.root.context, true, 1);
        await tearDown();
    });
    it(`root1 can load a01,a02 in order and can determine if it's active`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load('a01');
        assertComponentsVisible(host, [Root1, A01]);
        assertIsActive(router, 'a01', router.routeTree.root.context, true, 1);
        await router.load('a02');
        assertComponentsVisible(host, [Root1, A02]);
        assertIsActive(router, 'a02', router.routeTree.root.context, true, 2);
        await tearDown();
    });
    it(`root1 can load a11,a11/a02 in order with context and can determine if it's active`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load(A11);
        assertComponentsVisible(host, [Root1, A11]);
        assertIsActive(router, A11, router.routeTree.root.context, true, 1);
        const context = router.routeTree.root.children[0].context;
        await router.load(A02, { context });
        assertComponentsVisible(host, [Root1, A11, A02]);
        assertIsActive(router, A02, context, true, 2);
        assertIsActive(router, A02, router.routeTree.root.context, false, 3);
        assertIsActive(router, A11, router.routeTree.root.context, true, 3);
        await tearDown();
    });
    it('root can load sibling components and can determine if it\'s active', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            route('c1'),
            customElement({ name: 'c-1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            route('c2'),
            customElement({ name: 'c-2', template: 'c2' })
        ], C2);
        let Root = class Root {
        };
        Root = __decorate([
            route({ routes: [C1, C2] }),
            customElement({ name: 'ro-ot', template: '<au-viewport name="$1"></au-viewport> <au-viewport name="$2"></au-viewport>' })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assert.html.textContent(host, '', 'init');
        await router.load('c1+c2');
        assert.html.textContent(host, 'c1 c2', 'init');
        const ctx = router.routeTree.root.context;
        assertIsActive(router, 'c1+c2', ctx, true, 1);
        assertIsActive(router, 'c1@$1+c2@$2', ctx, true, 2);
        assertIsActive(router, 'c2@$1+c1@$2', ctx, false, 3);
        assertIsActive(router, 'c1@$2+c2@$1', ctx, false, 4);
        assertIsActive(router, 'c2+c1', ctx, false, 5);
        assertIsActive(router, 'c2$2+c1$1', ctx, false, 6); // the contains check is not order-invariant.
        await au.stop(true);
    });
    it(`root1 can load a11/a01,a11/a02 in order with context`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load({ component: A11, children: [A01] });
        assertComponentsVisible(host, [Root1, A11, A01]);
        const context = router.routeTree.root.children[0].context;
        await router.load(A02, { context });
        assertComponentsVisible(host, [Root1, A11, A02]);
        await tearDown();
    });
    it(`root1 correctly handles canUnload with load b11/b01,a01 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        let result = await router.load({ component: B11, children: [B01] });
        assertComponentsVisible(host, [Root1, B11, B01]);
        assert.strictEqual(result, true, '#1 result===true');
        result = await router.load({ component: B11, children: [A01] });
        assertComponentsVisible(host, [Root1, B11, A01]);
        assert.strictEqual(result, true, '#2 result===true');
        await tearDown();
    });
    it(`root1 correctly handles canUnload with load b11/b02,a01 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        let result = await router.load({ component: B11, children: [B02] });
        assertComponentsVisible(host, [Root1, B11, B02]);
        assert.strictEqual(result, true, '#1 result===true');
        result = await router.load(A01);
        assertComponentsVisible(host, [Root1, B11, B02]);
        assert.strictEqual(result, false, '#2 result===false');
        await tearDown();
    });
    it(`root1 correctly handles canUnload with load b11/b02,a01,a02 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        let result = await router.load({ component: B11, children: [B02] });
        assertComponentsVisible(host, [Root1, B11, B02], '#1');
        assert.strictEqual(result, true, '#1 result===true');
        result = await router.load(A01);
        assertComponentsVisible(host, [Root1, B11, B02], '#2');
        assert.strictEqual(result, false, '#2 result===false');
        result = await router.load(A02);
        assertComponentsVisible(host, [Root1, B11, B02], '#3');
        assert.strictEqual(result, false, '#3 result===false');
        await tearDown();
    });
    it(`root1 correctly handles canUnload with load b11/b02,b11/a02 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        let result = await router.load(`b11/b02`);
        assertComponentsVisible(host, [Root1, B11, [B02]]);
        assert.strictEqual(result, true, '#1 result===true');
        result = await router.load(`b11/a02`);
        assertComponentsVisible(host, [Root1, B11, [B02]]);
        assert.strictEqual(result, false, '#2 result===false');
        await tearDown();
    });
    it(`root1 correctly handles canUnload with load b12/b01,b11/b01 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        let result = await router.load(`b12/b01`);
        assertComponentsVisible(host, [Root1, B12, [B01]]);
        assert.strictEqual(result, true, '#1 result===true');
        result = await router.load(`b11/b01`);
        assertComponentsVisible(host, [Root1, B12, [B01]]);
        assert.strictEqual(result, false, '#2 result===false');
        await tearDown();
    });
    it(`root1 correctly handles canUnload with load b12/b01,b12/a01 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        let result = await router.load(`b12/b01`);
        assertComponentsVisible(host, [Root1, B12, [B01]], '#1 text');
        assert.strictEqual(result, true, '#1 result===true');
        result = await router.load(`b12/a01`);
        assertComponentsVisible(host, [Root1, B12, [A01]], '#2 text');
        assert.strictEqual(result, true, '#2 result===true');
        await tearDown();
    });
    it(`root1 can load a11/a01 as a string`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load(`a11/a01`);
        assertComponentsVisible(host, [Root1, A11, A01]);
        await tearDown();
    });
    it(`root1 can load a11/a01 as a ViewportInstruction`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load({ component: A11, children: [A01] });
        assertComponentsVisible(host, [Root1, A11, A01]);
        await tearDown();
    });
    it(`root1 can load a11/a01,a11/a02 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root1, Z);
        await router.load(`a11/a01`);
        assertComponentsVisible(host, [Root1, A11, A01]);
        await router.load(`a11/a02`);
        assertComponentsVisible(host, [Root1, A11, A02]);
        await tearDown();
    });
    it(`root2 can load a01+a02 as a string`, async function () {
        const { router, host, tearDown } = await createFixture(Root2, Z);
        await router.load(`a01+a02`);
        assertComponentsVisible(host, [Root2, A01, A02]);
        await tearDown();
    });
    it(`root2 can load a01+a02 as an array of strings`, async function () {
        const { router, host, tearDown } = await createFixture(Root2, Z);
        await router.load(['a01', 'a02']);
        assertComponentsVisible(host, [Root2, A01, A02]);
        await tearDown();
    });
    it(`root2 can load a01+a02 as an array of types`, async function () {
        const { router, host, tearDown } = await createFixture(Root2, Z);
        await router.load([A01, A02]);
        assertComponentsVisible(host, [Root2, A01, A02]);
        await tearDown();
    });
    it(`root2 can load a01+a02 as a mixed array type and string`, async function () {
        const { router, host, tearDown } = await createFixture(Root2, Z);
        await router.load([A01, 'a02']);
        assertComponentsVisible(host, [Root2, A01, A02]);
        await tearDown();
    });
    it(`root2 can load a01+a02,a02+a01 in order`, async function () {
        const { router, host, tearDown } = await createFixture(Root2, Z);
        await router.load(`a01+a02`);
        assertComponentsVisible(host, [Root2, A01, A02]);
        await router.load(`a02+a01`);
        assertComponentsVisible(host, [Root2, A02, A01]);
        await tearDown();
    });
    it(`root2 can load a12/a11/a01+a12/a01,a11/a12/a01+a12/a11/a01,a11/a12/a02+a12/a11/a01 in order with context`, async function () {
        const { router, host, tearDown } = await createFixture(Root2, Z);
        await router.load(`a12/a11/a01+a12/a01`);
        assertComponentsVisible(host, [Root2, [A12, [A11, [A01]]], [A12, [A01]]], '#1');
        let context = router.routeTree.root.children[1].context;
        await router.load(`a11/a01`, { context });
        assertComponentsVisible(host, [Root2, [A12, [A11, [A01]]], [A12, [A11, [A01]]]], '#2');
        context = router.routeTree.root.children[0].children[0].context;
        await router.load(`a02`, { context });
        assertComponentsVisible(host, [Root2, [A12, [A11, [A02]]], [A12, [A11, [A01]]]], '#3');
        await tearDown();
    });
    // Now generate stuff
    const $1vp = {
        // [x]
        [`a01`]: [A01],
        [`a02`]: [A02],
        // [x/x]
        [`a11/a01`]: [A11, [A01]],
        [`a11/a02`]: [A11, [A02]],
        [`a12/a01`]: [A12, [A01]],
        [`a12/a02`]: [A12, [A02]],
        // [x/x/x]
        [`a12/a11/a01`]: [A12, [A11, [A01]]],
        [`a12/a11/a02`]: [A12, [A11, [A02]]],
    };
    const $1vpKeys = Object.keys($1vp);
    for (let i = 0, ii = $1vpKeys.length; i < ii; ++i) {
        const key11 = $1vpKeys[i];
        const value11 = $1vp[key11];
        it(`root1 can load ${key11}`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z);
            await router.load(key11);
            assertComponentsVisible(host, [Root1, value11]);
            await tearDown();
        });
        if (i >= 1) {
            const key11prev = $1vpKeys[i - 1];
            const value11prev = $1vp[key11prev];
            it(`root1 can load ${key11prev},${key11} in order`, async function () {
                const { router, host, tearDown } = await createFixture(Root1, Z);
                await router.load(key11prev);
                assertComponentsVisible(host, [Root1, value11prev]);
                await router.load(key11);
                assertComponentsVisible(host, [Root1, value11]);
                await tearDown();
            });
            it(`root1 can load ${key11},${key11prev} in order`, async function () {
                const { router, host, tearDown } = await createFixture(Root1, Z);
                await router.load(key11);
                assertComponentsVisible(host, [Root1, value11]);
                await router.load(key11prev);
                assertComponentsVisible(host, [Root1, value11prev]);
                await tearDown();
            });
        }
    }
    const $2vps = {
        // [x+x]
        [`a01+a02`]: [[A01], [A02]],
        [`a02+a01`]: [[A02], [A01]],
        // [x/x+x]
        [`a11/a01+a02`]: [[A11, [A01]], [A02]],
        [`a11/a02+a01`]: [[A11, [A02]], [A01]],
        [`a12/a01+a02`]: [[A12, [A01]], [A02]],
        [`a12/a02+a01`]: [[A12, [A02]], [A01]],
        // [x+x/x]
        [`a01+a11/a02`]: [[A01], [A11, [A02]]],
        [`a02+a11/a01`]: [[A02], [A11, [A01]]],
        [`a01+a12/a02`]: [[A01], [A12, [A02]]],
        [`a02+a12/a01`]: [[A02], [A12, [A01]]],
        // [x/x+x/x]
        [`a11/a01+a12/a02`]: [[A11, [A01]], [A12, [A02]]],
        [`a11/a02+a12/a01`]: [[A11, [A02]], [A12, [A01]]],
        [`a12/a01+a11/a02`]: [[A12, [A01]], [A11, [A02]]],
        [`a12/a02+a11/a01`]: [[A12, [A02]], [A11, [A01]]],
    };
    const $2vpsKeys = Object.keys($2vps);
    for (let i = 0, ii = $2vpsKeys.length; i < ii; ++i) {
        const key21 = $2vpsKeys[i];
        const value21 = $2vps[key21];
        it(`root2 can load ${key21}`, async function () {
            const { router, host, tearDown } = await createFixture(Root2, Z);
            await router.load(key21);
            assertComponentsVisible(host, [Root2, value21]);
            await tearDown();
        });
        if (i >= 1) {
            const key21prev = $2vpsKeys[i - 1];
            const value21prev = $2vps[key21prev];
            it(`root2 can load ${key21prev},${key21} in order`, async function () {
                const { router, host, tearDown } = await createFixture(Root2, Z);
                await router.load(key21prev);
                assertComponentsVisible(host, [Root2, value21prev]);
                await router.load(key21);
                assertComponentsVisible(host, [Root2, value21]);
                await tearDown();
            });
            it(`root2 can load ${key21},${key21prev} in order`, async function () {
                const { router, host, tearDown } = await createFixture(Root2, Z);
                await router.load(key21);
                assertComponentsVisible(host, [Root2, value21]);
                await router.load(key21prev);
                assertComponentsVisible(host, [Root2, value21prev]);
                await tearDown();
            });
        }
    }
    it('can load single anonymous default at the root', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'a', template: 'a' })
        ], A);
        let B = class B {
        };
        B = __decorate([
            customElement({ name: 'b', template: 'b' })
        ], B);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                    { path: 'b', component: B, transitionPlan: 'invoke-lifecycles' },
                ]
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport default="a"></au-viewport>`,
                dependencies: [A, B],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('b');
        assertComponentsVisible(host, [Root, [B]]);
        await router.load('');
        assertComponentsVisible(host, [Root, [A]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('can load a named default with one sibling at the root', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'a', template: 'a' })
        ], A);
        let B = class B {
        };
        B = __decorate([
            customElement({ name: 'b', template: 'b' })
        ], B);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                    { path: 'b', component: B, transitionPlan: 'invoke-lifecycles' },
                ]
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport name="a" default="a"></au-viewport><au-viewport name="b"></au-viewport>`,
                dependencies: [A, B],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [A]], '1');
        await router.load('b@b');
        assertComponentsVisible(host, [Root, [A, B]], '2');
        await router.load('');
        assertComponentsVisible(host, [Root, [A]], '3');
        await router.load('a@a+b@b');
        assertComponentsVisible(host, [Root, [A, B]], '4');
        await router.load('b@a');
        assertComponentsVisible(host, [Root, [B]], '5');
        await router.load('');
        assertComponentsVisible(host, [Root, [A]], '6');
        await router.load('b@a+a@b');
        assertComponentsVisible(host, [Root, [B, A]], '7');
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('can load a named default with one sibling at a child', async function () {
        let B = class B {
        };
        B = __decorate([
            customElement({ name: 'b', template: 'b' })
        ], B);
        let C = class C {
        };
        C = __decorate([
            customElement({ name: 'c', template: 'c' })
        ], C);
        let A = class A {
        };
        A = __decorate([
            route({
                routes: [
                    { path: 'b', component: B, transitionPlan: 'invoke-lifecycles' },
                    { path: 'c', component: C, transitionPlan: 'invoke-lifecycles' },
                ]
            }),
            customElement({
                name: 'a',
                template: 'a<au-viewport name="b" default="b"></au-viewport><au-viewport name="c"></au-viewport>',
                dependencies: [B, C],
            })
        ], A);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                ]
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport default="a">`,
                dependencies: [A],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [A, [B]]], '1');
        await router.load('a/c@c');
        assertComponentsVisible(host, [Root, [A, [B, C]]], '2');
        await router.load('');
        assertComponentsVisible(host, [Root, [A, [B]]], '3');
        await router.load('a/(b@b+c@c)');
        assertComponentsVisible(host, [Root, [A, [B, C]]], '4');
        await router.load('a/c@b');
        assertComponentsVisible(host, [Root, [A, [C]]], '5');
        await router.load('');
        assertComponentsVisible(host, [Root, [A, [B]]], '6');
        await router.load('a/(c@b+b@c)');
        assertComponentsVisible(host, [Root, [A, [C, B]]], '7');
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    for (const [name, fallback] of [['ce name', 'ce-a'], ['route', 'a'], ['route-id', 'r1']]) {
        it(`will load the fallback when navigating to a non-existing route - with ${name} - viewport`, async function () {
            let A = class A {
            };
            A = __decorate([
                customElement({ name: 'ce-a', template: 'a' })
            ], A);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { id: 'r1', path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                    ]
                }),
                customElement({
                    name: 'root',
                    template: `root<au-viewport fallback="${fallback}">`,
                })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, A);
            const component = container.get(Root);
            const router = container.get(IRouter);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            au.app({ component, host });
            await au.start();
            assertComponentsVisible(host, [Root]);
            await router.load('b');
            assertComponentsVisible(host, [Root, [A]]);
            await au.stop(true);
            assert.areTaskQueuesEmpty();
        });
        it(`will load the global-fallback when navigating to a non-existing route - with ${name}`, async function () {
            let A = class A {
            };
            A = __decorate([
                customElement({ name: 'ce-a', template: 'a' })
            ], A);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { id: 'r1', path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                    ],
                    fallback,
                }),
                customElement({
                    name: 'root',
                    template: `root<au-viewport>`,
                })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, A);
            const component = container.get(Root);
            const router = container.get(IRouter);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            au.app({ component, host });
            await au.start();
            assertComponentsVisible(host, [Root]);
            await router.load('b');
            assertComponentsVisible(host, [Root, [A]]);
            await au.stop(true);
            assert.areTaskQueuesEmpty();
        });
        it(`will load the global-fallback when navigating to a non-existing route - sibling - with ${name}`, async function () {
            let A = class A {
            };
            A = __decorate([
                customElement({ name: 'ce-a', template: 'a' })
            ], A);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { id: 'r1', path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                    ],
                    fallback,
                }),
                customElement({
                    name: 'root',
                    template: `root<au-viewport></au-viewport><au-viewport></au-viewport>`,
                })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, A);
            const component = container.get(Root);
            const router = container.get(IRouter);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            au.app({ component, host });
            await au.start();
            assertComponentsVisible(host, [Root]);
            await router.load('b+c');
            assertComponentsVisible(host, [Root, [A, A]]);
            await au.stop(true);
            assert.areTaskQueuesEmpty();
        });
    }
    it('will load the global-fallback when navigating to a non-existing route - with ce-name - with empty route', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF = class NF {
        };
        NF = __decorate([
            customElement({ name: 'n-f', template: 'nf' })
        ], NF);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A, transitionPlan: 'invoke-lifecycles' },
                    { id: 'r2', path: ['nf'], component: NF, transitionPlan: 'invoke-lifecycles' },
                ],
                fallback: 'n-f',
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, NF);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('b');
        assertComponentsVisible(host, [Root, [NF]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('will load the global-fallback when navigating to a non-existing route - parent-child', async function () {
        let Ac01 = class Ac01 {
        };
        Ac01 = __decorate([
            customElement({ name: 'ce-a01', template: 'ac01' })
        ], Ac01);
        let Ac02 = class Ac02 {
        };
        Ac02 = __decorate([
            customElement({ name: 'ce-a02', template: 'ac02' })
        ], Ac02);
        let A = class A {
        };
        A = __decorate([
            route({
                routes: [
                    { id: 'rc1', path: 'ac01', component: Ac01, transitionPlan: 'invoke-lifecycles' },
                    { id: 'rc2', path: 'ac02', component: Ac02, transitionPlan: 'invoke-lifecycles' },
                ],
                fallback: 'rc1',
            }),
            customElement({ name: 'ce-a', template: 'a<au-viewport>', dependencies: [Ac01, Ac02] })
        ], A);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                ],
                fallback: 'r1',
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
                dependencies: [A],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root]);
        await router.load('a/b');
        assertComponentsVisible(host, [Root, [A, [Ac01]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('will load the global-fallback when navigating to a non-existing route - sibling + parent-child', async function () {
        let Ac01 = class Ac01 {
        };
        Ac01 = __decorate([
            customElement({ name: 'ce-a01', template: 'ac01' })
        ], Ac01);
        let Ac02 = class Ac02 {
        };
        Ac02 = __decorate([
            customElement({ name: 'ce-a02', template: 'ac02' })
        ], Ac02);
        let A = class A {
        };
        A = __decorate([
            route({
                routes: [
                    { id: 'rc1', path: 'ac01', component: Ac01, transitionPlan: 'invoke-lifecycles' },
                    { id: 'rc2', path: 'ac02', component: Ac02, transitionPlan: 'invoke-lifecycles' },
                ],
                fallback: 'rc1',
            }),
            customElement({ name: 'ce-a', template: 'a<au-viewport>', dependencies: [Ac01, Ac02] })
        ], A);
        let Bc01 = class Bc01 {
        };
        Bc01 = __decorate([
            customElement({ name: 'ce-b01', template: 'bc01' })
        ], Bc01);
        let Bc02 = class Bc02 {
        };
        Bc02 = __decorate([
            customElement({ name: 'ce-b02', template: 'bc02' })
        ], Bc02);
        let B = class B {
        };
        B = __decorate([
            route({
                routes: [
                    { id: 'rc1', path: 'bc01', component: Bc01, transitionPlan: 'invoke-lifecycles' },
                    { id: 'rc2', path: 'bc02', component: Bc02, transitionPlan: 'invoke-lifecycles' },
                ],
                fallback: 'rc2',
            }),
            customElement({ name: 'ce-b', template: 'b<au-viewport>', dependencies: [Bc01, Bc02] })
        ], B);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                    { id: 'r2', path: 'b', component: B, transitionPlan: 'invoke-lifecycles' },
                ],
                fallback: 'r1',
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport></au-viewport><au-viewport></au-viewport>`,
                dependencies: [A, B],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root]);
        await router.load('a/ac02+b/u');
        assertComponentsVisible(host, [Root, [A, [Ac02]], [B, [Bc02]]]);
        await router.load('a/u+b/bc01');
        assertComponentsVisible(host, [Root, [A, [Ac01]], [B, [Bc01]]]);
        await router.load('a/u+b/u');
        assertComponentsVisible(host, [Root, [A, [Ac01]], [B, [Bc02]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('au-viewport#fallback precedes global fallback', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let B = class B {
        };
        B = __decorate([
            customElement({ name: 'ce-b', template: 'b' })
        ], B);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: 'a', component: A, transitionPlan: 'invoke-lifecycles' },
                    { id: 'r2', path: 'b', component: B, transitionPlan: 'invoke-lifecycles' },
                ],
                fallback: 'r1',
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport name="1"></au-viewport><au-viewport name="2" fallback="r2"></au-viewport>`,
                dependencies: [A, B],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root]);
        await router.load('u1@1+u2@2');
        assertComponentsVisible(host, [Root, [A, B]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function as fallback is supported - route configuration', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF1 },
                    { id: 'r3', path: ['nf2'], component: NF2 },
                ],
                fallback(vi, _rn, _ctx) {
                    return vi.component.value === 'foo' ? 'r2' : 'r3';
                },
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, NF1);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF1]]);
        await router.load('bar');
        assertComponentsVisible(host, [Root, [NF2]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function as fallback is supported - route configuration - hierarchical', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport></au-viewport>' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
                fallback(vi, rn, _ctx) {
                    return rn.component.Type === P1 ? 'n-f-1' : 'n-f-2';
                },
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, NF1, NF2);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function as fallback is supported - viewport', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
            fallback(vi, _rn, _ctx) {
                return vi.component.value === 'foo' ? 'r2' : 'r3';
            }
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF1 },
                    { id: 'r3', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport fallback.bind>`,
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, NF1);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF1]]);
        await router.load('bar');
        assertComponentsVisible(host, [Root, [NF2]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function as fallback is supported - viewport - hierarchical', async function () {
        function fallback(vi, rn, _ctx) {
            return rn.component.Type === P1 ? 'n-f-1' : 'n-f-2';
        }
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
            constructor() {
                this.fallback = fallback;
            }
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport fallback.bind></au-viewport>' })
        ], P1);
        let P2 = class P2 {
            constructor() {
                this.fallback = fallback;
            }
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport fallback.bind></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, NF1, NF2);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('class as fallback is supported - route configuration', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF = class NF {
        };
        NF = __decorate([
            customElement({ name: 'n-f', template: 'nf' })
        ], NF);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF },
                ],
                fallback: NF,
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('class as fallback is supported - route configuration - hierarchical', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport></au-viewport>' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport></au-viewport>' })
        ], P2);
        let NF = class NF {
        };
        NF = __decorate([
            customElement({ name: 'n-f', template: 'nf' })
        ], NF);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF },
                ],
                fallback: NF,
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning class as fallback is supported - route configuration', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF1 },
                    { id: 'r3', path: ['nf2'], component: NF2 },
                ],
                fallback(vi, _rn, _ctx) {
                    return vi.component.value === 'foo' ? NF1 : NF2;
                },
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF1]]);
        await router.load('bar');
        assertComponentsVisible(host, [Root, [NF2]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning class as fallback is supported - route configuration - hierarchical', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport></au-viewport>' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
                fallback(vi, rn, _ctx) {
                    return rn.component.Type === P1 ? NF1 : NF2;
                },
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('promise resolving to class as fallback is supported - route configuration', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF = class NF {
        };
        NF = __decorate([
            customElement({ name: 'n-f', template: 'nf' })
        ], NF);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF },
                ],
                fallback: Promise.resolve(NF),
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('promise resolving to class as fallback is supported - route configuration - hierarchical', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport></au-viewport>' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport></au-viewport>' })
        ], P2);
        let NF = class NF {
        };
        NF = __decorate([
            customElement({ name: 'n-f', template: 'nf' })
        ], NF);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF },
                ],
                fallback: Promise.resolve(NF),
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning a promise resolving to class as fallback is supported - route configuration', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF1 },
                    { id: 'r3', path: ['nf2'], component: NF2 },
                ],
                fallback(vi, _rn, _ctx) {
                    return Promise.resolve(vi.component.value === 'foo' ? NF1 : NF2);
                },
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF1]]);
        await router.load('bar');
        assertComponentsVisible(host, [Root, [NF2]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning a promise resolving to class as fallback is supported - route configuration - hierarchical', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport></au-viewport>' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
                fallback(vi, rn, _ctx) {
                    return Promise.resolve(rn.component.Type === P1 ? NF1 : NF2);
                },
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('class as fallback is supported - viewport', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF = class NF {
        };
        NF = __decorate([
            customElement({ name: 'n-f', template: 'nf' })
        ], NF);
        let Root = class Root {
            constructor() {
                this.fallback = NF;
            }
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport fallback.bind>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('class as fallback is supported - viewport - hierarchical', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
            constructor() {
                this.fallback = NF1;
            }
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport fallback.bind></au-viewport>' })
        ], P1);
        let P2 = class P2 {
            constructor() {
                this.fallback = NF2;
            }
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport fallback.bind></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning class as fallback is supported - viewport', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
            fallback(vi, _rn, _ctx) {
                return vi.component.value === 'foo' ? NF1 : NF2;
            }
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF1 },
                    { id: 'r3', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport fallback.bind>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF1]]);
        await router.load('bar');
        assertComponentsVisible(host, [Root, [NF2]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning class as fallback is supported - viewport - hierarchical', async function () {
        function fallback(vi, rn, _ctx) {
            return rn.component.Type === P1 ? NF1 : NF2;
        }
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
            constructor() {
                this.fallback = fallback;
            }
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport fallback.bind></au-viewport>' })
        ], P1);
        let P2 = class P2 {
            constructor() {
                this.fallback = fallback;
            }
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport fallback.bind></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('promise resolving to class as fallback is supported - viewport', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF = class NF {
        };
        NF = __decorate([
            customElement({ name: 'n-f', template: 'nf' })
        ], NF);
        let Root = class Root {
            constructor() {
                this.fallback = Promise.resolve(NF);
            }
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport fallback.bind>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('promise resolving to class as fallback is supported - viewport - hierarchical', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
            constructor() {
                this.fallback = Promise.resolve(NF1);
            }
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport fallback.bind></au-viewport>' })
        ], P1);
        let P2 = class P2 {
            constructor() {
                this.fallback = Promise.resolve(NF2);
            }
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport fallback.bind></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning a promise resolving to class as fallback is supported - viewport', async function () {
        let A = class A {
        };
        A = __decorate([
            customElement({ name: 'ce-a', template: 'a' })
        ], A);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
            fallback(vi, _rn, _ctx) {
                return Promise.resolve(vi.component.value === 'foo' ? NF1 : NF2);
            }
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'a'], component: A },
                    { id: 'r2', path: ['nf1'], component: NF1 },
                    { id: 'r3', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport fallback.bind>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [A]]);
        await router.load('foo');
        assertComponentsVisible(host, [Root, [NF1]]);
        await router.load('bar');
        assertComponentsVisible(host, [Root, [NF2]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('function returning a promise resolving to class as fallback is supported - viewport - hierarchical', async function () {
        function fallback(vi, rn, _ctx) {
            return Promise.resolve(rn.component.Type === P1 ? NF1 : NF2);
        }
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'ce-c1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'ce-c2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
            constructor() {
                this.fallback = fallback;
            }
        };
        P1 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C1 },
                ]
            }),
            customElement({ name: 'ce-p1', template: 'p1<au-viewport fallback.bind></au-viewport>' })
        ], P1);
        let P2 = class P2 {
            constructor() {
                this.fallback = fallback;
            }
        };
        P2 = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'c'], component: C2 },
                ]
            }),
            customElement({ name: 'ce-p2', template: 'p2<au-viewport fallback.bind></au-viewport>' })
        ], P2);
        let NF1 = class NF1 {
        };
        NF1 = __decorate([
            customElement({ name: 'n-f-1', template: 'nf1' })
        ], NF1);
        let NF2 = class NF2 {
        };
        NF2 = __decorate([
            customElement({ name: 'n-f-2', template: 'nf2' })
        ], NF2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'r1', path: ['', 'p1'], component: P1 },
                    { id: 'r2', path: ['p2'], component: P2 },
                    { id: 'r3', path: ['nf1'], component: NF1 },
                    { id: 'r4', path: ['nf2'], component: NF2 },
                ],
            }),
            customElement({
                name: 'root',
                template: `root<au-viewport>`,
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assertComponentsVisible(host, [Root, [P1, [C1]]]);
        await router.load('p2/foo');
        assertComponentsVisible(host, [Root, [P2, [NF2]]]);
        await router.load('p1/foo');
        assertComponentsVisible(host, [Root, [P1, [NF1]]]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    for (const attr of ['href', 'load']) {
        it(`will load the root-level fallback when navigating to a non-existing route - parent-child - children without fallback - attr: ${attr}`, async function () {
            let GrandChildOneOne = class GrandChildOneOne {
            };
            GrandChildOneOne = __decorate([
                customElement({ name: 'gc-11', template: 'gc11' })
            ], GrandChildOneOne);
            let GrandChildOneTwo = class GrandChildOneTwo {
            };
            GrandChildOneTwo = __decorate([
                customElement({ name: 'gc-12', template: 'gc12' })
            ], GrandChildOneTwo);
            let ChildOne = class ChildOne {
            };
            ChildOne = __decorate([
                route({
                    routes: [
                        { id: 'gc11', path: ['', 'gc11'], component: GrandChildOneOne },
                        { id: 'gc12', path: 'gc12', component: GrandChildOneTwo },
                    ],
                }),
                customElement({
                    name: 'c-one',
                    template: `c1 <br>
  <nav>
    <a ${attr}="gc11">gc11</a>
    <a ${attr}="gc12">gc12</a>
    <a ${attr}="c2">c2 (doesn't work)</a>
    <a ${attr}="../c2">../c2 (works)</a>
  </nav>
  <br>
  <au-viewport></au-viewport>`,
                })
            ], ChildOne);
            let GrandChildTwoOne = class GrandChildTwoOne {
            };
            GrandChildTwoOne = __decorate([
                customElement({ name: 'gc-21', template: 'gc21' })
            ], GrandChildTwoOne);
            let GrandChildTwoTwo = class GrandChildTwoTwo {
            };
            GrandChildTwoTwo = __decorate([
                customElement({ name: 'gc-22', template: 'gc22' })
            ], GrandChildTwoTwo);
            let ChildTwo = class ChildTwo {
            };
            ChildTwo = __decorate([
                route({
                    routes: [
                        { id: 'gc21', path: ['', 'gc21'], component: GrandChildTwoOne },
                        { id: 'gc22', path: 'gc22', component: GrandChildTwoTwo },
                    ],
                }),
                customElement({
                    name: 'c-two',
                    template: `c2 <br>
  <nav>
    <a ${attr}="gc21">gc21</a>
    <a ${attr}="gc22">gc22</a>
    <a ${attr}="c1">c1 (doesn't work)</a>
    <a ${attr}="../c1">../c1 (works)</a>
  </nav>
  <br>
  <au-viewport></au-viewport>`,
                })
            ], ChildTwo);
            let NotFound = class NotFound {
            };
            NotFound = __decorate([
                customElement({
                    name: 'not-found',
                    template: 'nf',
                })
            ], NotFound);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            path: ['', 'c1'],
                            component: ChildOne,
                        },
                        {
                            path: 'c2',
                            component: ChildTwo,
                        },
                        {
                            path: 'not-found',
                            component: NotFound,
                        },
                    ],
                    fallback: 'not-found',
                }),
                customElement({
                    name: 'my-app',
                    template: `<nav>
  <a ${attr}="c1">C1</a>
  <a ${attr}="c2">C2</a>
</nav>

<au-viewport></au-viewport>`
                })
            ], Root);
            const { au, container, host } = await start({
                appRoot: Root,
                registrations: [
                    NotFound,
                ]
            });
            const queue = container.get(IPlatform).domWriteQueue;
            const rootVp = host.querySelector('au-viewport');
            let childVp = rootVp.querySelector('au-viewport');
            assert.html.textContent(childVp, 'gc11');
            let [, a2, nf, f] = Array.from(rootVp.querySelectorAll('a'));
            a2.click();
            queue.flush();
            await queue.yield();
            assert.html.textContent(childVp, 'gc12');
            nf.click();
            queue.flush();
            await queue.yield();
            assert.html.textContent(childVp, 'nf');
            f.click();
            queue.flush();
            await queue.yield();
            childVp = rootVp.querySelector('au-viewport');
            assert.html.textContent(childVp, 'gc21', host.textContent);
            [, a2, nf, f] = Array.from(rootVp.querySelectorAll('a'));
            a2.click();
            queue.flush();
            await queue.yield();
            assert.html.textContent(childVp, 'gc22');
            nf.click();
            queue.flush();
            await queue.yield();
            assert.html.textContent(childVp, 'nf');
            f.click();
            queue.flush();
            await queue.yield();
            childVp = rootVp.querySelector('au-viewport');
            assert.html.textContent(childVp, 'gc11');
            await au.stop(true);
            assert.areTaskQueuesEmpty();
        });
    }
    it(`correctly parses parameters`, async function () {
        const a1Params = [];
        const a2Params = [];
        const b1Params = [];
        const b2Params = [];
        let B1 = class B1 {
            loading(params) {
                b1Params.push(params);
            }
        };
        B1 = __decorate([
            customElement({ name: 'b1', template: null })
        ], B1);
        let B2 = class B2 {
            loading(params) {
                b2Params.push(params);
            }
        };
        B2 = __decorate([
            customElement({ name: 'b2', template: null })
        ], B2);
        let A1 = class A1 {
            loading(params) {
                a1Params.push(params);
            }
        };
        A1 = __decorate([
            route({
                routes: [
                    { path: 'b1/:b', component: B1, transitionPlan: 'invoke-lifecycles' },
                ]
            }),
            customElement({
                name: 'a1',
                template: `<au-viewport></au-viewport>`,
                dependencies: [B1],
            })
        ], A1);
        let A2 = class A2 {
            loading(params) {
                a2Params.push(params);
            }
        };
        A2 = __decorate([
            route({
                routes: [
                    { path: 'b2/:d', component: B2, transitionPlan: 'invoke-lifecycles' },
                ]
            }),
            customElement({
                name: 'a2',
                template: `<au-viewport></au-viewport>`,
                dependencies: [B2],
            })
        ], A2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'a1/:a', component: A1, transitionPlan: 'invoke-lifecycles' },
                    { path: 'a2/:c', component: A2, transitionPlan: 'invoke-lifecycles' },
                ]
            }),
            customElement({
                name: 'root',
                template: `<au-viewport name="a1"></au-viewport><au-viewport name="a2"></au-viewport>`,
                dependencies: [A1, A2],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        await router.load('a1/a/b1/b+a2/c/b2/d');
        await router.load('a1/1/b1/2+a2/3/b2/4');
        assert.deepStrictEqual([
            a1Params,
            b1Params,
            a2Params,
            b2Params,
        ], [
            [
                { a: 'a' },
                { a: '1' },
            ],
            [
                { b: 'b' },
                { b: '2' },
            ],
            [
                { c: 'c' },
                { c: '3' },
            ],
            [
                { d: 'd' },
                { d: '4' },
            ],
        ]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('Router#load accepts route-id and params', async function () {
        const a1Params = [];
        const a2Params = [];
        const a1Query = [];
        const a2Query = [];
        let A1 = class A1 {
            loading(params, next) {
                a1Params.push(params);
                a1Query.push(Array.from(next.queryParams.entries()));
            }
        };
        A1 = __decorate([
            customElement({
                name: 'a1',
                template: '',
            })
        ], A1);
        let A2 = class A2 {
            loading(params, next) {
                a2Params.push(params);
                a2Query.push(Array.from(next.queryParams.entries()));
            }
        };
        A2 = __decorate([
            customElement({
                name: 'a2',
                template: '',
            })
        ], A2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'a1', path: 'a1/:a', component: A1 },
                    { id: 'a2', path: 'a2/:c', component: A2 },
                ]
            }),
            customElement({
                name: 'root',
                template: `<au-viewport></au-viewport>`,
                dependencies: [A1, A2],
            })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        const pushedUrls = [];
        container.register(Registration.instance(IHistory, {
            pushState(_, __, url) {
                pushedUrls.push(url);
            },
            replaceState: noop,
        }));
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(Root);
        const router = container.get(IRouter);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        au.app({ component, host });
        await au.start();
        await router.load({ component: 'a1', params: { a: '12' } });
        let url = pushedUrls.pop();
        assert.match(url, /a1\/12$/, 'url1');
        await router.load({ component: 'a2', params: { c: '45' } });
        url = pushedUrls.pop();
        assert.match(url, /a2\/45$/, 'url1');
        await router.load({ component: 'a1', params: { a: '21', b: '34' } });
        url = pushedUrls.pop();
        assert.match(url, /a1\/21\?b=34$/, 'url1');
        await router.load({ component: 'a2', params: { a: '67', c: '54' } });
        url = pushedUrls.pop();
        assert.match(url, /a2\/54\?a=67$/, 'url1');
        assert.deepStrictEqual([
            a1Params,
            a2Params,
        ], [
            [
                { a: '12' },
                { a: '21' },
            ],
            [
                { c: '45' },
                { c: '54' },
            ],
        ]);
        assert.deepStrictEqual([
            a1Query,
            a2Query
        ], [
            [
                [],
                [['b', '34']],
            ],
            [
                [],
                [['a', '67']],
            ],
        ]);
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('Router#load accepts viewport instructions with specific viewport name - component: class', async function () {
        let GrandChildOneOne = class GrandChildOneOne {
        };
        GrandChildOneOne = __decorate([
            customElement({ name: 'gc-11', template: 'gc11' })
        ], GrandChildOneOne);
        let GrandChildOneTwo = class GrandChildOneTwo {
        };
        GrandChildOneTwo = __decorate([
            customElement({ name: 'gc-12', template: 'gc12' })
        ], GrandChildOneTwo);
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            route({
                routes: [
                    { id: 'gc11', path: ['', 'gc11'], component: GrandChildOneOne },
                    { id: 'gc12', path: 'gc12', component: GrandChildOneTwo },
                ],
            }),
            customElement({ name: 'c-one', template: `c1 <au-viewport></au-viewport>`, })
        ], ChildOne);
        let GrandChildTwoOne = class GrandChildTwoOne {
        };
        GrandChildTwoOne = __decorate([
            customElement({ name: 'gc-21', template: 'gc21' })
        ], GrandChildTwoOne);
        let GrandChildTwoTwo = class GrandChildTwoTwo {
        };
        GrandChildTwoTwo = __decorate([
            customElement({ name: 'gc-22', template: 'gc22' })
        ], GrandChildTwoTwo);
        let ChildTwo = class ChildTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        ChildTwo = __decorate([
            route({
                routes: [
                    { id: 'gc21', path: ['', 'gc21'], component: GrandChildTwoOne },
                    { id: 'gc22', path: 'gc22', component: GrandChildTwoTwo },
                ],
            }),
            customElement({
                name: 'c-two',
                template: `c2 \${id} <au-viewport></au-viewport>`,
            })
        ], ChildTwo);
        let MyApp = class MyApp {
        };
        MyApp = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'c1'],
                        component: ChildOne,
                    },
                    {
                        path: 'c2/:id?',
                        component: ChildTwo,
                    },
                ],
            }),
            customElement({ name: 'my-app', template: '<au-viewport name="vp1"></au-viewport><au-viewport name="vp2" default.bind="null"></au-viewport>' })
        ], MyApp);
        const { au, container, host } = await start({ appRoot: MyApp });
        const router = container.get(IRouter);
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const vps = Array.from(host.querySelectorAll(':scope>au-viewport'));
        assert.html.textContent(vps[0], 'c1 gc11', 'round#1 vp1');
        assert.html.textContent(vps[1], '', 'round#1 vp2');
        await router.load([
            {
                component: ChildOne,
                children: [{ component: GrandChildOneTwo }],
                viewport: 'vp2',
            },
            {
                component: ChildTwo,
                params: { id: 21 },
                children: [{ component: GrandChildTwoTwo }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 21 gc22', 'round#2 vp1');
        assert.html.textContent(vps[1], 'c1 gc12', 'round#2 vp2');
        await router.load([
            {
                component: ChildTwo,
                viewport: 'vp2',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc11', 'round#3 vp1');
        assert.html.textContent(vps[1], 'c2 NA gc21', 'round#3 vp2');
        await au.stop(true);
    });
    it('Router#load accepts hierarchical viewport instructions with route-id', async function () {
        let GrandChildOneOne = class GrandChildOneOne {
        };
        GrandChildOneOne = __decorate([
            customElement({ name: 'gc-11', template: 'gc11' })
        ], GrandChildOneOne);
        let GrandChildOneTwo = class GrandChildOneTwo {
        };
        GrandChildOneTwo = __decorate([
            customElement({ name: 'gc-12', template: 'gc12' })
        ], GrandChildOneTwo);
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            route({
                routes: [
                    { id: 'gc11', path: ['', 'gc-11'], component: GrandChildOneOne },
                    { id: 'gc12', path: 'gc-12', component: GrandChildOneTwo },
                ],
            }),
            customElement({ name: 'c-one', template: `c1 <au-viewport></au-viewport>`, })
        ], ChildOne);
        let GrandChildTwoOne = class GrandChildTwoOne {
        };
        GrandChildTwoOne = __decorate([
            customElement({ name: 'gc-21', template: 'gc21' })
        ], GrandChildTwoOne);
        let GrandChildTwoTwo = class GrandChildTwoTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        GrandChildTwoTwo = __decorate([
            customElement({ name: 'gc-22', template: 'gc22 ${id}' })
        ], GrandChildTwoTwo);
        let ChildTwo = class ChildTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        ChildTwo = __decorate([
            route({
                routes: [
                    { id: 'gc21', path: ['', 'gc-21'], component: GrandChildTwoOne },
                    { id: 'gc22', path: 'gc-22/:id?', component: GrandChildTwoTwo },
                ],
            }),
            customElement({
                name: 'c-two',
                template: `c2 \${id} <au-viewport></au-viewport>`,
            })
        ], ChildTwo);
        let MyApp = class MyApp {
        };
        MyApp = __decorate([
            route({
                routes: [
                    {
                        id: 'c1',
                        path: ['', 'c-1'],
                        component: ChildOne,
                    },
                    {
                        id: 'c2',
                        path: 'c-2/:id?',
                        component: ChildTwo,
                    },
                ],
            }),
            customElement({ name: 'my-app', template: '<au-viewport name="vp1"></au-viewport><au-viewport name="vp2" default.bind="null"></au-viewport>' })
        ], MyApp);
        const { au, container, host } = await start({ appRoot: MyApp });
        const router = container.get(IRouter);
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const vps = Array.from(host.querySelectorAll(':scope>au-viewport'));
        assert.html.textContent(vps[0], 'c1 gc11', 'round#1 vp1');
        assert.html.textContent(vps[1], '', 'round#1 vp2');
        await router.load([
            {
                component: 'c1',
                children: [{ component: 'gc12' }],
                viewport: 'vp2',
            },
            {
                component: 'c2',
                params: { id: 21 },
                children: [{ component: 'gc22' }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 21 gc22 NA', 'round#2 vp1');
        assert.html.textContent(vps[1], 'c1 gc12', 'round#2 vp2');
        await router.load([
            {
                component: 'c2',
                viewport: 'vp2',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc11', 'round#3 vp1');
        assert.html.textContent(vps[1], 'c2 NA gc21', 'round#3 vp2');
        await router.load([
            {
                component: 'c1',
                children: [{ component: 'gc12' }],
                viewport: 'vp2',
            },
            {
                component: 'c2',
                params: { id: 21 },
                children: [{ component: 'gc22', params: { id: 42 } }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 21 gc22 42', 'round#4 vp1');
        assert.html.textContent(vps[1], 'c1 gc12', 'round#4 vp2');
        await router.load([
            {
                component: 'c1',
                children: [{ component: 'gc12' }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc12', 'round#5 vp1');
        assert.html.textContent(vps[1], '', 'round#5 vp2');
        await au.stop(true);
    });
    it('Router#load supports class-returning-function as component', async function () {
        let GrandChildOneOne = class GrandChildOneOne {
        };
        GrandChildOneOne = __decorate([
            customElement({ name: 'gc-11', template: 'gc11' })
        ], GrandChildOneOne);
        let GrandChildOneTwo = class GrandChildOneTwo {
        };
        GrandChildOneTwo = __decorate([
            customElement({ name: 'gc-12', template: 'gc12' })
        ], GrandChildOneTwo);
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            route({
                routes: [
                    { id: 'gc11', path: ['', 'gc-11'], component: GrandChildOneOne },
                    { id: 'gc12', path: 'gc-12', component: GrandChildOneTwo },
                ],
            }),
            customElement({ name: 'c-one', template: `c1 <au-viewport></au-viewport>`, })
        ], ChildOne);
        let GrandChildTwoOne = class GrandChildTwoOne {
        };
        GrandChildTwoOne = __decorate([
            customElement({ name: 'gc-21', template: 'gc21' })
        ], GrandChildTwoOne);
        let GrandChildTwoTwo = class GrandChildTwoTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        GrandChildTwoTwo = __decorate([
            customElement({ name: 'gc-22', template: 'gc22 ${id}' })
        ], GrandChildTwoTwo);
        let ChildTwo = class ChildTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        ChildTwo = __decorate([
            route({
                routes: [
                    { id: 'gc21', path: ['', 'gc-21'], component: GrandChildTwoOne },
                    { id: 'gc22', path: 'gc-22/:id?', component: GrandChildTwoTwo },
                ],
            }),
            customElement({
                name: 'c-two',
                template: `c2 \${id} <au-viewport></au-viewport>`,
            })
        ], ChildTwo);
        let MyApp = class MyApp {
        };
        MyApp = __decorate([
            route({
                routes: [
                    {
                        id: 'c1',
                        path: ['', 'c-1'],
                        component: ChildOne,
                    },
                    {
                        id: 'c2',
                        path: 'c-2/:id?',
                        component: ChildTwo,
                    },
                ],
            }),
            customElement({ name: 'my-app', template: '<au-viewport name="vp1"></au-viewport><au-viewport name="vp2" default.bind="null"></au-viewport>' })
        ], MyApp);
        const { au, container, host } = await start({ appRoot: MyApp });
        const router = container.get(IRouter);
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const vps = Array.from(host.querySelectorAll(':scope>au-viewport'));
        assert.html.textContent(vps[0], 'c1 gc11', 'round#1 vp1');
        assert.html.textContent(vps[1], '', 'round#1 vp2');
        // single
        await router.load(() => ChildTwo);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 NA gc21', 'round#2 vp1');
        assert.html.textContent(vps[1], '', 'round#2 vp2');
        // sibling
        await router.load([() => ChildTwo, () => ChildOne]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 NA gc21', 'round#3 vp1');
        assert.html.textContent(vps[1], 'c1 gc11', 'round#3 vp2');
        // viewport instruction
        await router.load([
            { component: () => ChildTwo, viewport: 'vp2' },
            { component: () => ChildOne, viewport: 'vp1' },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc11', 'round#4 vp1');
        assert.html.textContent(vps[1], 'c2 NA gc21', 'round#4 vp2');
        // viewport instruction - params
        await router.load([
            { component: () => ChildTwo, viewport: 'vp1', params: { id: 42 } },
            { component: () => ChildOne, viewport: 'vp2' },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 42 gc21', 'round#5 vp1');
        assert.html.textContent(vps[1], 'c1 gc11', 'round#5 vp2');
        // viewport instruction - children
        await router.load([
            { component: () => ChildTwo, viewport: 'vp2', children: [() => GrandChildTwoTwo] },
            { component: () => ChildOne, viewport: 'vp1', children: [() => GrandChildOneTwo] },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc12', 'round#6 vp1');
        assert.html.textContent(vps[1], 'c2 NA gc22 NA', 'round#6 vp2');
        // viewport instruction - parent-params - children
        await router.load([
            { component: () => ChildTwo, viewport: 'vp1', params: { id: 42 }, children: [() => GrandChildTwoTwo] },
            { component: () => ChildOne, viewport: 'vp2' },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 42 gc22 NA', 'round#7 vp1');
        assert.html.textContent(vps[1], 'c1 gc11', 'round#7 vp2');
        // viewport instruction - parent-params - children-params
        await router.load([
            { component: () => ChildTwo, viewport: 'vp2', params: { id: 42 }, children: [{ component: () => GrandChildTwoTwo, params: { id: 21 } }] },
            { component: () => ChildOne, viewport: 'vp1', children: [() => GrandChildOneTwo] },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc12', 'round#8 vp1');
        assert.html.textContent(vps[1], 'c2 42 gc22 21', 'round#8 vp2');
        await au.stop(true);
    });
    // Use-case: router.load(import('./class'))
    it('Router#load supports promise as component', async function () {
        let GrandChildOneOne = class GrandChildOneOne {
        };
        GrandChildOneOne = __decorate([
            customElement({ name: 'gc-11', template: 'gc11' })
        ], GrandChildOneOne);
        let GrandChildOneTwo = class GrandChildOneTwo {
        };
        GrandChildOneTwo = __decorate([
            customElement({ name: 'gc-12', template: 'gc12' })
        ], GrandChildOneTwo);
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            route({
                routes: [
                    { id: 'gc11', path: ['', 'gc-11'], component: GrandChildOneOne },
                    { id: 'gc12', path: 'gc-12', component: GrandChildOneTwo },
                ],
            }),
            customElement({ name: 'c-one', template: `c1 <au-viewport></au-viewport>`, })
        ], ChildOne);
        let GrandChildTwoOne = class GrandChildTwoOne {
        };
        GrandChildTwoOne = __decorate([
            customElement({ name: 'gc-21', template: 'gc21' })
        ], GrandChildTwoOne);
        let GrandChildTwoTwo = class GrandChildTwoTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        GrandChildTwoTwo = __decorate([
            customElement({ name: 'gc-22', template: 'gc22 ${id}' })
        ], GrandChildTwoTwo);
        let ChildTwo = class ChildTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        ChildTwo = __decorate([
            route({
                routes: [
                    { id: 'gc21', path: ['', 'gc-21'], component: GrandChildTwoOne },
                    { id: 'gc22', path: 'gc-22/:id?', component: GrandChildTwoTwo },
                ],
            }),
            customElement({
                name: 'c-two',
                template: `c2 \${id} <au-viewport></au-viewport>`,
            })
        ], ChildTwo);
        let MyApp = class MyApp {
        };
        MyApp = __decorate([
            route({
                routes: [
                    {
                        id: 'c1',
                        path: ['', 'c-1'],
                        component: ChildOne,
                    },
                    {
                        id: 'c2',
                        path: 'c-2/:id?',
                        component: ChildTwo,
                    },
                ],
            }),
            customElement({ name: 'my-app', template: '<au-viewport name="vp1"></au-viewport><au-viewport name="vp2" default.bind="null"></au-viewport>' })
        ], MyApp);
        const { au, container, host } = await start({ appRoot: MyApp });
        const router = container.get(IRouter);
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const vps = Array.from(host.querySelectorAll(':scope>au-viewport'));
        assert.html.textContent(vps[0], 'c1 gc11', 'round#1 vp1');
        assert.html.textContent(vps[1], '', 'round#1 vp2');
        // single - default
        await router.load(Promise.resolve({ default: ChildTwo }));
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 NA gc21', 'round#2 vp1');
        assert.html.textContent(vps[1], '', 'round#2 vp2');
        // single - non-default
        await router.load(Promise.resolve({ ChildOne }));
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc11', 'round#3 vp1');
        assert.html.textContent(vps[1], '', 'round#3 vp2');
        // single - chained
        await router.load(Promise.resolve({ ChildOne, ChildTwo }).then(x => x.ChildTwo));
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 NA gc21', 'round#4 vp1');
        assert.html.textContent(vps[1], '', 'round#4 vp2');
        // sibling
        await router.load([Promise.resolve({ ChildTwo }), Promise.resolve({ ChildOne })]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 NA gc21', 'round#5 vp1');
        assert.html.textContent(vps[1], 'c1 gc11', 'round#5 vp2');
        // viewport instruction
        await router.load([
            { component: Promise.resolve({ ChildTwo }), viewport: 'vp2' },
            { component: Promise.resolve({ ChildOne }), viewport: 'vp1' },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc11', 'round#6 vp1');
        assert.html.textContent(vps[1], 'c2 NA gc21', 'round#6 vp2');
        // viewport instruction - params
        await router.load([
            { component: Promise.resolve({ ChildTwo }), viewport: 'vp1', params: { id: 42 } },
            { component: Promise.resolve({ ChildOne }), viewport: 'vp2' },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 42 gc21', 'round#7 vp1');
        assert.html.textContent(vps[1], 'c1 gc11', 'round#7 vp2');
        // viewport instruction - children
        await router.load([
            { component: Promise.resolve({ ChildTwo }), viewport: 'vp2', children: [() => GrandChildTwoTwo] },
            { component: Promise.resolve({ ChildOne }), viewport: 'vp1', children: [() => GrandChildOneTwo] },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc12', 'round#8 vp1');
        assert.html.textContent(vps[1], 'c2 NA gc22 NA', 'round#8 vp2');
        // viewport instruction - parent-params - children
        await router.load([
            { component: Promise.resolve({ ChildTwo }), viewport: 'vp1', params: { id: 42 }, children: [() => GrandChildTwoTwo] },
            { component: Promise.resolve({ ChildOne }), viewport: 'vp2' },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 42 gc22 NA', 'round#9 vp1');
        assert.html.textContent(vps[1], 'c1 gc11', 'round#9 vp2');
        // viewport instruction - parent-params - children-params
        await router.load([
            { component: Promise.resolve({ ChildTwo }), viewport: 'vp2', params: { id: 42 }, children: [{ component: () => GrandChildTwoTwo, params: { id: 21 } }] },
            { component: Promise.resolve({ ChildOne }), viewport: 'vp1', children: [() => GrandChildOneTwo] },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc12', 'round#10 vp1');
        assert.html.textContent(vps[1], 'c2 42 gc22 21', 'round#10 vp2');
        await au.stop(true);
    });
    it('Router#load accepts viewport instructions with specific viewport name - component: mixed', async function () {
        let GrandChildOneOne = class GrandChildOneOne {
        };
        GrandChildOneOne = __decorate([
            customElement({ name: 'gc-11', template: 'gc11' })
        ], GrandChildOneOne);
        let GrandChildOneTwo = class GrandChildOneTwo {
        };
        GrandChildOneTwo = __decorate([
            customElement({ name: 'gc-12', template: 'gc12' })
        ], GrandChildOneTwo);
        let ChildOne = class ChildOne {
        };
        ChildOne = __decorate([
            route({
                routes: [
                    { id: 'gc11', path: ['', 'gc-11'], component: GrandChildOneOne },
                    { id: 'gc12', path: 'gc-12', component: GrandChildOneTwo },
                ],
            }),
            customElement({ name: 'c-one', template: `c1 <au-viewport></au-viewport>`, })
        ], ChildOne);
        let GrandChildTwoOne = class GrandChildTwoOne {
        };
        GrandChildTwoOne = __decorate([
            customElement({ name: 'gc-21', template: 'gc21' })
        ], GrandChildTwoOne);
        let GrandChildTwoTwo = class GrandChildTwoTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        GrandChildTwoTwo = __decorate([
            customElement({ name: 'gc-22', template: 'gc22 ${id}' })
        ], GrandChildTwoTwo);
        let ChildTwo = class ChildTwo {
            loading(params) {
                this.id = params.id ?? 'NA';
            }
        };
        ChildTwo = __decorate([
            route({
                routes: [
                    { id: 'gc21', path: ['', 'gc-21'], component: GrandChildTwoOne },
                    { id: 'gc22', path: 'gc-22/:id?', component: GrandChildTwoTwo },
                ],
            }),
            customElement({
                name: 'c-two',
                template: `c2 \${id} <au-viewport></au-viewport>`,
            })
        ], ChildTwo);
        let MyApp = class MyApp {
        };
        MyApp = __decorate([
            route({
                routes: [
                    {
                        id: 'c1',
                        path: ['', 'c-1'],
                        component: ChildOne,
                    },
                    {
                        id: 'c2',
                        path: 'c-2/:id?',
                        component: ChildTwo,
                    },
                ],
            }),
            customElement({ name: 'my-app', template: '<au-viewport name="vp1"></au-viewport><au-viewport name="vp2" default.bind="null"></au-viewport>' })
        ], MyApp);
        const { au, container, host } = await start({ appRoot: MyApp });
        const router = container.get(IRouter);
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const vps = Array.from(host.querySelectorAll(':scope>au-viewport'));
        assert.html.textContent(vps[0], 'c1 gc11', 'round#1 vp1');
        assert.html.textContent(vps[1], '', 'round#1 vp2');
        await router.load([
            {
                component: 'c1',
                children: [{ component: 'gc-12' /* path */ }],
                viewport: 'vp2',
            },
            {
                component: ChildTwo,
                params: { id: 21 },
                children: [{ component: 'gc22' /* route-id */ }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 21 gc22 NA', 'round#2 vp1');
        assert.html.textContent(vps[1], 'c1 gc12', 'round#2 vp2');
        await router.load([
            {
                component: CustomElement.getDefinition(ChildTwo),
                viewport: 'vp2',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc11', 'round#3 vp1');
        assert.html.textContent(vps[1], 'c2 NA gc21', 'round#3 vp2');
        await router.load([
            {
                component: CustomElement.getDefinition(ChildTwo),
                params: { id: 42 },
                children: [{ component: GrandChildTwoTwo /* class */, params: { id: 21 } }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 42 gc22 21', 'round#4 vp1');
        assert.html.textContent(vps[1], '', 'round#4 vp2');
        await router.load([
            {
                component: CustomElement.getDefinition(ChildTwo),
                children: [{ component: GrandChildTwoTwo /* class */ }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 NA gc22 NA', 'round#5 vp1');
        assert.html.textContent(vps[1], '', 'round#5 vp2');
        await router.load([
            {
                component: () => ChildTwo,
                params: { id: 42 },
                children: [{ component: Promise.resolve({ GrandChildTwoTwo }), params: { id: 21 } }],
                viewport: 'vp2',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c1 gc11', 'round#6 vp1');
        assert.html.textContent(vps[1], 'c2 42 gc22 21', 'round#6 vp2');
        await router.load([
            {
                component: Promise.resolve({ ChildTwo }),
                params: { id: 21 },
                children: [{ component: CustomElement.getDefinition(GrandChildTwoTwo), params: { id: 42 } }],
                viewport: 'vp1',
            },
        ]);
        await queue.yield();
        assert.html.textContent(vps[0], 'c2 21 gc22 42', 'round#7 vp1');
        assert.html.textContent(vps[1], '', 'round#7 vp2');
        await au.stop(true);
    });
    it('children are supported as residue as well as structured children array', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            route('c1'),
            customElement({ name: 'c-1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            route('c2'),
            customElement({ name: 'c-2', template: 'c2' })
        ], C2);
        let P1 = class P1 {
        };
        P1 = __decorate([
            route({ path: 'p1', routes: [C1, C2] }),
            customElement({ name: 'p-1', template: 'p1 <au-viewport name="$1"></au-viewport> <au-viewport name="$2"></au-viewport>' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            route(['', 'p2']),
            customElement({ name: 'p-2', template: 'p2' })
        ], P2);
        let Root = class Root {
        };
        Root = __decorate([
            route({ routes: [P1, P2] }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        const queue = container.get(IPlatform).taskQueue;
        assert.html.textContent(host, 'p2');
        await router.load({
            component: 'p1/c1',
            children: [{ component: C2, viewport: '$2' }]
        });
        await queue.yield();
        assert.html.textContent(host, 'p1 c1 c2');
        await au.stop(true);
    });
    // TODO(sayan): add more tests for parameter parsing with multiple route parameters including optional parameter.
    it('does not interfere with standard "href" attribute', async function () {
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */));
        container.register(RouterConfiguration);
        const component = container.get(CustomElement.define({ name: 'app', template: '<a href.bind="href">' }, class App {
            constructor() {
                this.href = 'abc';
            }
        }));
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        await au.app({ component, host }).start();
        assert.strictEqual(host.querySelector('a').getAttribute('href'), 'abc');
        component.href = null;
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(host.querySelector('a').getAttribute('href'), null);
        await au.stop(true);
    });
    // #region location URL generation
    {
        let VmA = class VmA {
            loading(params, next) {
                this.params = params;
                this.query = next.queryParams;
                this.fragment = next.fragment;
            }
        };
        VmA = __decorate([
            customElement({ name: 'vm-a', template: `view-a foo: \${params.foo} | query: \${query.toString()} | fragment: \${fragment}` })
        ], VmA);
        let VmB = class VmB {
            constructor(router) {
                this.router = router;
            }
            async redirectToPath() {
                await this.router.load('a?foo=bar');
            }
            async redirectWithQueryObj() {
                await this.router.load('a', { queryParams: { foo: 'bar' } });
            }
            async redirectWithMultivaluedQuery() {
                await this.router.load('a?foo=fizz', { queryParams: { foo: 'bar' } });
            }
            async redirectWithRouteParamAndQueryObj() {
                await this.router.load('a/fizz', { queryParams: { foo: 'bar' } });
            }
            async redirectWithClassAndQueryObj() {
                await this.router.load(VmA, { queryParams: { foo: 'bar' } });
            }
            async redirectVpInstrcAndQueryObj() {
                await this.router.load({ component: VmA, params: { foo: '42' } }, { queryParams: { foo: 'bar' } });
            }
            async redirectVpInstrcRouteIdAndQueryObj() {
                await this.router.load({ component: 'a' /** route-id */, params: { foo: '42', bar: 'foo' } }, { queryParams: { bar: 'fizz' } });
            }
            async redirectFragment() {
                await this.router.load('a#foobar');
            }
            async redirectFragmentInNavOpt() {
                await this.router.load('a', { fragment: 'foobar' });
            }
            async redirectFragmentInPathAndNavOpt() {
                await this.router.load('a#foobar', { fragment: 'fizzbuzz' });
            }
            async redirectFragmentWithVpInstrc() {
                await this.router.load({ component: 'a', params: { foo: '42' } }, { fragment: 'foobar' });
            }
            async redirectFragmentWithVpInstrcRawUrl() {
                await this.router.load({ component: 'a/42' }, { fragment: 'foobar' });
            }
            async redirectFragmentSiblingViewport() {
                await this.router.load([{ component: 'a/42' }, { component: 'a' }], { fragment: 'foobar' });
            }
            async redirectSiblingViewport() {
                await this.router.load([{ component: 'a/42' }, { component: 'a' }], { queryParams: { foo: 'bar' } });
            }
            async redirectWithQueryAndFragment() {
                await this.router.load({ component: 'a', params: { foo: '42' } }, { queryParams: { foo: 'bar' }, fragment: 'foobar' });
            }
            async redirectWithQueryAndFragmentSiblingViewport() {
                await this.router.load([{ component: 'a', params: { foo: '42' } }, { component: 'a', params: { foo: '84' } }], { queryParams: { foo: 'bar' }, fragment: 'foobar' });
            }
        };
        VmB = __decorate([
            customElement({ name: 'vm-b', template: 'view-b' }),
            __param(0, IRouter),
            __metadata("design:paramtypes", [Object])
        ], VmB);
        let AppRoot = class AppRoot {
        };
        AppRoot = __decorate([
            route({
                title: 'base',
                routes: [
                    { path: ['a', 'a/:foo'], component: VmA, title: 'A', transitionPlan: 'invoke-lifecycles', },
                    { path: ['', 'b'], component: VmB, title: 'B', transitionPlan: 'invoke-lifecycles' },
                ],
            }),
            customElement({ name: 'app-root', template: '<au-viewport></au-viewport> <au-viewport default.bind="null"></au-viewport>' })
        ], AppRoot);
        async function start(buildTitle = null) {
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration.customize({ buildTitle }));
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: AppRoot, host }).start();
            return { host, au, container };
        }
        it('queryString - #1 - query string in string routing instruction', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectToPath();
            assert.html.textContent(host, 'view-a foo: | query: foo=bar | fragment:');
            assert.match(container.get(ILocation).path, /a\?foo=bar$/);
            await au.stop(true);
        });
        it('queryString - #2 - structured query string object', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectWithQueryObj();
            assert.html.textContent(host, 'view-a foo: | query: foo=bar | fragment:');
            assert.match(container.get(ILocation).path, /a\?foo=bar$/);
            await au.stop(true);
        });
        it('queryString - #3 - multi-valued query string - value from both string path and structured query params', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectWithMultivaluedQuery();
            assert.html.textContent(host, 'view-a foo: | query: foo=fizz&foo=bar | fragment:');
            assert.match(container.get(ILocation).path, /a\?foo=fizz&foo=bar$/);
            await au.stop(true);
        });
        it('queryString - #4 - structured query string along with path parameter', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectWithRouteParamAndQueryObj();
            assert.html.textContent(host, 'view-a foo: fizz | query: foo=bar | fragment:');
            assert.match(container.get(ILocation).path, /a\/fizz\?foo=bar$/);
            await au.stop(true);
        });
        it('queryString - #5 - structured query string with class as routing instruction', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectWithClassAndQueryObj();
            assert.html.textContent(host, 'view-a foo: | query: foo=bar | fragment:');
            assert.match(container.get(ILocation).path, /a\?foo=bar$/);
            await au.stop(true);
        });
        it('queryString - #6 - structured query string with viewport instruction', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectVpInstrcAndQueryObj();
            assert.html.textContent(host, 'view-a foo: 42 | query: foo=bar | fragment:');
            assert.match(container.get(ILocation).path, /a\/42\?foo=bar$/);
            await au.stop(true);
        });
        it('queryString - #7 - structured query string with viewport instruction - route-id and multi-valued key', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectVpInstrcRouteIdAndQueryObj();
            assert.html.textContent(host, 'view-a foo: 42 | query: bar=fizz&bar=foo | fragment:');
            assert.match(container.get(ILocation).path, /a\/42\?bar=fizz&bar=foo$/);
            await au.stop(true);
        });
        it('queryString - #8 - sibling viewports', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectSiblingViewport();
            assert.html.textContent(host, 'view-a foo: 42 | query: foo=bar | fragment: view-a foo: | query: foo=bar | fragment:');
            assert.match(container.get(ILocation).path, /a\/42\+a\?foo=bar$/);
            await au.stop(true);
        });
        it('fragment - #1 - raw fragment in path', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectFragment();
            assert.html.textContent(host, 'view-a foo: | query: | fragment: foobar');
            assert.match(container.get(ILocation).path, /a#foobar$/);
            await au.stop(true);
        });
        it('fragment - #2 - fragment in navigation options', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectFragmentInNavOpt();
            assert.html.textContent(host, 'view-a foo: | query: | fragment: foobar');
            assert.match(container.get(ILocation).path, /a#foobar$/);
            await au.stop(true);
        });
        it('fragment - #3 - fragment in path always wins over the fragment in navigation options', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectFragmentInPathAndNavOpt();
            assert.html.textContent(host, 'view-a foo: | query: | fragment: foobar');
            assert.match(container.get(ILocation).path, /a#foobar$/);
            await au.stop(true);
        });
        it('fragment - #4 - with viewport instruction', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectFragmentWithVpInstrc();
            assert.html.textContent(host, 'view-a foo: 42 | query: | fragment: foobar');
            assert.match(container.get(ILocation).path, /a\/42#foobar$/);
            await au.stop(true);
        });
        it('fragment - #5 - with viewport instruction - raw url', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectFragmentWithVpInstrcRawUrl();
            assert.html.textContent(host, 'view-a foo: 42 | query: | fragment: foobar');
            assert.match(container.get(ILocation).path, /a\/42#foobar$/);
            await au.stop(true);
        });
        it('fragment - #6 - sibling viewport', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectFragmentSiblingViewport();
            assert.html.textContent(host, 'view-a foo: 42 | query: | fragment: foobar view-a foo: | query: | fragment: foobar');
            assert.match(container.get(ILocation).path, /a\/42\+a#foobar$/);
            await au.stop(true);
        });
        it('query and fragment', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectWithQueryAndFragment();
            assert.html.textContent(host, 'view-a foo: 42 | query: foo=bar | fragment: foobar');
            assert.match(container.get(ILocation).path, /a\/42\?foo=bar#foobar$/);
            await au.stop(true);
        });
        it('query and fragment - sibling viewport', async function () {
            const { host, au, container } = await start();
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectWithQueryAndFragmentSiblingViewport();
            assert.html.textContent(host, 'view-a foo: 42 | query: foo=bar | fragment: foobar view-a foo: 84 | query: foo=bar | fragment: foobar');
            assert.match(container.get(ILocation).path, /a\/42\+a\/84\?foo=bar#foobar$/);
            await au.stop(true);
        });
        it('shows title correctly', async function () {
            const { host, au, container } = await start();
            assert.strictEqual(container.get(IPlatform).document.title, 'B | base');
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectToPath();
            assert.strictEqual(container.get(IPlatform).document.title, 'A | base');
            await au.stop(true);
        });
        it('respects custom buildTitle', async function () {
            const { host, au, container } = await start((tr) => {
                const root = tr.routeTree.root;
                return `${root.context.config.title} - ${root.children.map(c => c.title).join(' - ')}`;
            });
            assert.strictEqual(container.get(IPlatform).document.title, 'base - B');
            const vmb = CustomElement.for(host.querySelector('vm-b')).viewModel;
            await vmb.redirectToPath();
            assert.strictEqual(container.get(IPlatform).document.title, 'base - A');
            await au.stop(true);
        });
    }
    it('querystring is added to the fragment when hash-based routing is used', async function () {
        let C1 = class C1 {
            loading(params, node) {
                this.id = params.id;
                this.query = node.queryParams.toString();
                this.fragment = node.fragment;
            }
        };
        C1 = __decorate([
            customElement({ name: 'c-1', template: `c1 params: \${id} query: \${query} fragment: \${fragment}` })
        ], C1);
        let App = class App {
        };
        App = __decorate([
            route({ routes: [{ id: 'c1', path: 'c1/:id', component: C1 }] }),
            customElement({ name: 'app', template: '<a load="route: c1; params.bind: {id: 42, foo: \'bar\'}"></a><au-viewport></au-viewport>' })
        ], App);
        const { host, container } = await start({ appRoot: App, useHash: true });
        const anchor = host.querySelector('a');
        assert.match(anchor.href, /#\/c1\/42\?foo=bar$/);
        anchor.click();
        await container.get(IPlatform).taskQueue.yield();
        assert.html.textContent(host, 'c1 params: 42 query: foo=bar fragment:');
        const path = container.get(ILocation).path;
        assert.match(path, /#\/c1\/42\?foo=bar$/);
        // assert the different parts of the url
        const url = new URL(path);
        assert.match(url.pathname, /\/$/);
        assert.strictEqual(url.search, '');
        assert.strictEqual(url.hash, '#/c1/42?foo=bar');
    });
    it('querystring, added to the fragment, can be parsed correctly, when hash-based routing is used', async function () {
        let C1 = class C1 {
            loading(params, node) {
                this.id = params.id;
                this.query = node.queryParams.toString();
                this.fragment = node.fragment;
            }
        };
        C1 = __decorate([
            customElement({ name: 'c-1', template: `c1 params: \${id} query: \${query} fragment: \${fragment}` })
        ], C1);
        let App = class App {
        };
        App = __decorate([
            route({ routes: [{ id: 'c1', path: 'c1/:id', component: C1 }] }),
            customElement({ name: 'app', template: '<a href="#/c1/42?foo=bar"></a><au-viewport></au-viewport>' })
        ], App);
        const { host, container } = await start({ appRoot: App, useHash: true });
        host.querySelector('a').click();
        await container.get(IPlatform).taskQueue.yield();
        assert.html.textContent(host, 'c1 params: 42 query: foo=bar fragment:');
        const path = container.get(ILocation).path;
        assert.match(path, /#\/c1\/42\?foo=bar$/);
        // assert the different parts of the url
        const url = new URL(path);
        assert.match(url.pathname, /\/$/);
        assert.strictEqual(url.search, '');
        assert.strictEqual(url.hash, '#/c1/42?foo=bar');
    });
    it('querystring, added to the fragment, can be parsed correctly, when hash-based routing is used - with fragment (nested fragment JFF)', async function () {
        let C1 = class C1 {
            loading(params, node) {
                this.id = params.id;
                this.query = node.queryParams.toString();
                this.fragment = node.fragment;
            }
        };
        C1 = __decorate([
            customElement({ name: 'c-1', template: `c1 params: \${id} query: \${query} fragment: \${fragment}` })
        ], C1);
        let App = class App {
        };
        App = __decorate([
            route({ routes: [{ id: 'c1', path: 'c1/:id', component: C1 }] }),
            customElement({ name: 'app', template: '<a href="#/c1/42?foo=bar#for-whatever-reason"></a><au-viewport></au-viewport>' })
        ], App);
        const { host, container } = await start({ appRoot: App, useHash: true });
        host.querySelector('a').click();
        await container.get(IPlatform).taskQueue.yield();
        assert.html.textContent(host, 'c1 params: 42 query: foo=bar fragment: for-whatever-reason');
        const path = container.get(ILocation).path;
        assert.match(path, /#\/c1\/42\?foo=bar#for-whatever-reason$/);
        // assert the different parts of the url
        const url = new URL(path);
        assert.match(url.pathname, /\/$/);
        assert.strictEqual(url.search, '');
        assert.strictEqual(url.hash, '#/c1/42?foo=bar#for-whatever-reason');
    });
    it('fragment is added to fragment (nested fragment JFF) when using hash-based routing', async function () {
        let C1 = class C1 {
            loading(params, node) {
                this.id = params.id;
                this.query = node.queryParams.toString();
                this.fragment = node.fragment;
            }
        };
        C1 = __decorate([
            customElement({ name: 'c-1', template: `c1 params: \${id} query: \${query} fragment: \${fragment}` })
        ], C1);
        let App = class App {
        };
        App = __decorate([
            route({ routes: [{ id: 'c1', path: 'c1/:id', component: C1 }] }),
            customElement({ name: 'app', template: '<au-viewport></au-viewport>' })
        ], App);
        const { host, container } = await start({ appRoot: App, useHash: true });
        await container.get(IRouter)
            .load({ component: 'c1', params: { id: '42' } }, { queryParams: { foo: 'bar' }, fragment: 'for-whatever-reason' });
        assert.html.textContent(host, 'c1 params: 42 query: foo=bar fragment: for-whatever-reason');
        const path = container.get(ILocation).path;
        assert.match(path, /#\/c1\/42\?foo=bar#for-whatever-reason$/);
        // assert the different parts of the url
        const url = new URL(path);
        assert.match(url.pathname, /\/$/);
        assert.strictEqual(url.search, '');
        assert.strictEqual(url.hash, '#/c1/42?foo=bar#for-whatever-reason');
    });
    // TODO(sayan): add more tests for title involving children and sibling routes
    it('root/child/grandchild/great-grandchild', async function () {
        let GGC1 = class GGC1 {
        };
        GGC1 = __decorate([
            customElement({ name: 'gcc-1', template: `gcc1` })
        ], GGC1);
        let GC1 = class GC1 {
        };
        GC1 = __decorate([
            route({
                routes: [
                    { path: '', component: GGC1 },
                ],
            }),
            customElement({ name: 'gc-1', template: `<au-viewport></au-viewport>`, })
        ], GC1);
        let C1 = class C1 {
        };
        C1 = __decorate([
            route({
                routes: [
                    { path: '', redirectTo: 'gc1' },
                    { id: 'gc1', path: 'gc1', component: GC1 },
                ],
            }),
            customElement({ name: 'c-1', template: `<au-viewport></au-viewport>`, })
        ], C1);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: '', redirectTo: 'c1' },
                    { path: 'c1', component: C1, },
                ],
            }),
            customElement({ name: 'ro-ot', template: `<au-viewport></au-viewport>`, })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root });
        assert.html.textContent(host, 'gcc1');
        assert.match(container.get(ILocation).path, /c1\/gc1$/);
        await au.stop(true);
    });
    // #endregion
    // TODO(sayan): add tests here for the location URL building in relation for viewport name
    describe('navigation model', function () {
        function getNavBarCe(hasAsyncRouteConfig = false) {
            let FirstNonEmpty = class FirstNonEmpty {
                toView(paths) {
                    for (const path of paths) {
                        if (path)
                            return path;
                    }
                }
            };
            FirstNonEmpty = __decorate([
                valueConverter('firstNonEmpty')
            ], FirstNonEmpty);
            let NavBar = class NavBar {
                constructor(routeCtx, node) {
                    this.node = node;
                    this.navModel = routeCtx.navigationModel;
                }
                binding(_initiator, _parent) {
                    if (hasAsyncRouteConfig)
                        return this.navModel?.resolve();
                }
                assert(expected, message = '') {
                    const anchors = Array.from(this.node.querySelector('nav').querySelectorAll('a'));
                    const len = anchors.length;
                    assert.strictEqual(len, expected.length, `${message} length`);
                    for (let i = 0; i < len; i++) {
                        const anchor = anchors[i];
                        const item = expected[i];
                        assert.strictEqual(anchor.href.endsWith(item.href), true, `${message} - #${i} href - actual: ${anchor.href} - expected: ${item.href}`);
                        assert.html.textContent(anchor, item.text, `${message} - #${i} text`);
                        assert.strictEqual(anchor.classList.contains('active'), !!item.active, `${message} - #${i} active`);
                    }
                }
            };
            NavBar = __decorate([
                customElement({
                    name: 'nav-bar',
                    template: `<nav if.bind="navModel">
        <ul>
          <li repeat.for="route of navModel.routes"><a href.bind="route.path | firstNonEmpty" active.class="route.isActive">\${route.title}</a></li>
        </ul>
      </nav><template else>no nav model</template>`,
                    dependencies: [FirstNonEmpty]
                }),
                __param(0, IRouteContext),
                __param(1, INode),
                __metadata("design:paramtypes", [Object, Object])
            ], NavBar);
            return NavBar;
        }
        it('route deco', async function () {
            let C11 = class C11 {
            };
            C11 = __decorate([
                customElement({ name: 'ce-c11', template: 'c11' })
            ], C11);
            let C12 = class C12 {
            };
            C12 = __decorate([
                customElement({ name: 'ce-c12', template: 'c12' })
            ], C12);
            let C21 = class C21 {
            };
            C21 = __decorate([
                customElement({ name: 'ce-c21', template: 'c21' })
            ], C21);
            let C22 = class C22 {
            };
            C22 = __decorate([
                customElement({ name: 'ce-c22', template: 'c22' })
            ], C22);
            let P1 = class P1 {
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: ['', 'c11'], component: C11, title: 'C11' },
                        { path: 'c12', component: C12, title: 'C12' },
                    ]
                }),
                customElement({ name: 'ce-p1', template: '<nav-bar></nav-bar> p1 <au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
            };
            P2 = __decorate([
                route({
                    routes: [
                        { path: 'c21', component: C21, title: 'C21' },
                        { path: ['', 'c22'], component: C22, title: 'C22' },
                    ]
                }),
                customElement({ name: 'ce-p2', template: '<nav-bar></nav-bar> p2 <au-viewport></au-viewport>' })
            ], P2);
            let P3 = class P3 {
            };
            P3 = __decorate([
                customElement({ name: 'ce-p3', template: 'p3' })
            ], P3);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'p1'], component: P1, title: 'P1' },
                        { path: 'p2', component: P2, title: 'P2' },
                        { path: 'p3', component: P3, title: 'P3', nav: false },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe();
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, C11, C12, C21, C22, P1, P2, P3, navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            // Start
            await queue.yield();
            const rootNavbar = CustomElement.for(host.querySelector('nav-bar')).viewModel;
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'start root');
            let childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: true }, { href: 'c12', text: 'C12', active: false }], 'start child navbar');
            // Round#1
            await router.load('p2');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#1 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: false }, { href: 'c22', text: 'C22', active: true }], 'round#1 child navbar');
            // Round#2
            await router.load('p1/c12');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'round#2 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: false }, { href: 'c12', text: 'C12', active: true }], 'round#2 navbar');
            // Round#3
            await router.load('p2/c21');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#3 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: true }, { href: 'c22', text: 'C22', active: false }], 'round#3 navbar');
            // Round#4 - nav:false, but routeable
            await router.load('p3');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: false }], 'round#4 root');
            assert.notEqual(host.querySelector('ce-p3'), null);
            await au.stop(true);
        });
        it('getRouteConfig hook', async function () {
            let C11 = class C11 {
            };
            C11 = __decorate([
                customElement({ name: 'ce-c11', template: 'c11' })
            ], C11);
            let C12 = class C12 {
            };
            C12 = __decorate([
                customElement({ name: 'ce-c12', template: 'c12' })
            ], C12);
            let C21 = class C21 {
            };
            C21 = __decorate([
                customElement({ name: 'ce-c21', template: 'c21' })
            ], C21);
            let C22 = class C22 {
            };
            C22 = __decorate([
                customElement({ name: 'ce-c22', template: 'c22' })
            ], C22);
            let P1 = class P1 {
                getRouteConfig(_parentDefinition, _routeNode) {
                    return {
                        routes: [
                            { path: ['', 'c11'], component: C11, title: 'C11' },
                            { path: 'c12', component: C12, title: 'C12' },
                        ]
                    };
                }
            };
            P1 = __decorate([
                customElement({ name: 'ce-p1', template: '<nav-bar></nav-bar> p1 <au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
                getRouteConfig(_parentDefinition, _routeNode) {
                    return {
                        routes: [
                            { path: 'c21', component: C21, title: 'C21' },
                            { path: ['', 'c22'], component: C22, title: 'C22' },
                        ]
                    };
                }
            };
            P2 = __decorate([
                customElement({ name: 'ce-p2', template: '<nav-bar></nav-bar> p2 <au-viewport></au-viewport>' })
            ], P2);
            let P3 = class P3 {
            };
            P3 = __decorate([
                customElement({ name: 'ce-p3', template: 'p3' })
            ], P3);
            let Root = class Root {
                async getRouteConfig(_parentDefinition, _routeNode) {
                    await new Promise((resolve) => setTimeout(resolve, 10));
                    return {
                        routes: [
                            { path: ['', 'p1'], component: P1, title: 'P1' },
                            { path: 'p2', component: P2, title: 'P2' },
                            { path: 'p3', component: P3, title: 'P3', nav: false },
                        ]
                    };
                }
            };
            Root = __decorate([
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe();
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, C11, C12, C21, C22, P1, P2, P3, navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            // Start
            await queue.yield();
            const rootNavbar = CustomElement.for(host.querySelector('nav-bar')).viewModel;
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'start root');
            let childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: true }, { href: 'c12', text: 'C12', active: false }], 'start child navbar');
            // Round#1
            await router.load('p2');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#1 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: false }, { href: 'c22', text: 'C22', active: true }], 'round#1 child navbar');
            // Round#2
            await router.load('p1/c12');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'round#2 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: false }, { href: 'c12', text: 'C12', active: true }], 'round#2 navbar');
            // Round#3
            await router.load('p2/c21');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#3 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: true }, { href: 'c22', text: 'C22', active: false }], 'round#3 navbar');
            // Round#4 - nav:false, but routeable
            await router.load('p3');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: false }], 'round#4 root');
            assert.notEqual(host.querySelector('ce-p3'), null);
            await au.stop(true);
        });
        it('async configuration', async function () {
            let C11 = class C11 {
            };
            C11 = __decorate([
                customElement({ name: 'ce-c11', template: 'c11' })
            ], C11);
            let C12 = class C12 {
            };
            C12 = __decorate([
                customElement({ name: 'ce-c12', template: 'c12' })
            ], C12);
            let C21 = class C21 {
            };
            C21 = __decorate([
                customElement({ name: 'ce-c21', template: 'c21' })
            ], C21);
            let C22 = class C22 {
            };
            C22 = __decorate([
                customElement({ name: 'ce-c22', template: 'c22' })
            ], C22);
            let P1 = class P1 {
                getRouteConfig(_parentDefinition, _routeNode) {
                    return {
                        routes: [
                            { path: ['', 'c11'], component: Promise.resolve({ C11 }), title: 'C11' },
                            { path: 'c12', component: C12, title: 'C12' },
                        ]
                    };
                }
            };
            P1 = __decorate([
                customElement({ name: 'ce-p1', template: '<nav-bar></nav-bar> p1 <au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
                getRouteConfig(_parentDefinition, _routeNode) {
                    return {
                        routes: [
                            { path: 'c21', component: Promise.resolve({ 'default': C21 }), title: 'C21' },
                            { path: ['', 'c22'], component: C22, title: 'C22' },
                        ]
                    };
                }
            };
            P2 = __decorate([
                customElement({ name: 'ce-p2', template: '<nav-bar></nav-bar> p2 <au-viewport></au-viewport>' })
            ], P2);
            let P3 = class P3 {
            };
            P3 = __decorate([
                route({ path: 'p3', title: 'P3', nav: false }),
                customElement({ name: 'ce-p3', template: 'p3' })
            ], P3);
            let Root = class Root {
                getRouteConfig(_parentDefinition, _routeNode) {
                    return {
                        routes: [
                            { path: ['', 'p1'], component: Promise.resolve({ P1, 'default': { foo: 'bar' }, 'fizz': 'buzz' }).then(x => x.P1), title: 'P1' },
                            { path: 'p2', component: P2, title: 'P2' },
                            Promise.resolve({ P3 }),
                        ]
                    };
                }
            };
            Root = __decorate([
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe(true);
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, C11, C12, C21, C22, P1, P2, P3, navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            // Start
            await queue.yield();
            const rootNavbar = CustomElement.for(host.querySelector('nav-bar')).viewModel;
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'start root');
            let childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: true }, { href: 'c12', text: 'C12', active: false }], 'start child navbar');
            // Round#1
            await router.load('p2');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#1 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: false }, { href: 'c22', text: 'C22', active: true }], 'round#1 child navbar');
            // Round#2
            await router.load('p1/c12');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'round#2 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: false }, { href: 'c12', text: 'C12', active: true }], 'round#2 navbar');
            // Round#3
            await router.load('p2/c21');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#3 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: true }, { href: 'c22', text: 'C22', active: false }], 'round#3 navbar');
            // Round#4 - nav:false, but routeable
            await router.load('p3');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: false }], 'round#4 root');
            assert.notEqual(host.querySelector('ce-p3'), null);
            await au.stop(true);
        });
        it('parameterized route', async function () {
            let C11 = class C11 {
            };
            C11 = __decorate([
                customElement({ name: 'ce-c11', template: 'c11' })
            ], C11);
            let C12 = class C12 {
            };
            C12 = __decorate([
                customElement({ name: 'ce-c12', template: 'c12' })
            ], C12);
            let C21 = class C21 {
            };
            C21 = __decorate([
                customElement({ name: 'ce-c21', template: 'c21' })
            ], C21);
            let C22 = class C22 {
            };
            C22 = __decorate([
                customElement({ name: 'ce-c22', template: 'c22' })
            ], C22);
            let P1 = class P1 {
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: ['', 'c11'], component: C11, title: 'C11' },
                        { path: ['c12/:id', 'c12'], component: C12, title: 'C12' },
                    ]
                }),
                customElement({ name: 'ce-p1', template: '<nav-bar></nav-bar> p1 <au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
            };
            P2 = __decorate([
                route({
                    routes: [
                        { path: ['c21', 'c21/:id'], component: C21, title: 'C21' },
                        { path: ['', 'c22'], component: C22, title: 'C22' },
                    ]
                }),
                customElement({ name: 'ce-p2', template: '<nav-bar></nav-bar> p2 <au-viewport></au-viewport>' })
            ], P2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'p1'], component: P1, title: 'P1' },
                        { path: ['p2/:id', 'p2'], component: P2, title: 'P2' },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe();
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            // Start
            await queue.yield();
            const rootNavbar = CustomElement.for(host.querySelector('nav-bar')).viewModel;
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2/:id', text: 'P2', active: false }], 'start root');
            let childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: true }, { href: 'c12/:id', text: 'C12', active: false }], 'start child navbar');
            // Round#2
            await router.load('p2/42');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2/:id', text: 'P2', active: true }], 'round#1 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: false }, { href: 'c22', text: 'C22', active: true }], 'round#1 child navbar');
            // Round#2
            await router.load('p1/c12');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2/:id', text: 'P2', active: false }], 'round#2 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: false }, { href: 'c12/:id', text: 'C12', active: true }], 'round#2 child navbar');
            // Round#3
            await router.load('p2');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2/:id', text: 'P2', active: true }], 'round#3 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: false }, { href: 'c22', text: 'C22', active: true }], 'round#3 child navbar');
            // Round#4
            await router.load('p1/c12/42');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2/:id', text: 'P2', active: false }], 'round#4 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: false }, { href: 'c12/:id', text: 'C12', active: true }], 'round#4 child navbar');
            // Round#5
            await router.load('p2/42/C21/21');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2/:id', text: 'P2', active: true }], 'round#5 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: true }, { href: 'c22', text: 'C22', active: false }], 'round#5 child navbar');
            await au.stop(true);
        });
        it('with redirection', async function () {
            let C11 = class C11 {
            };
            C11 = __decorate([
                customElement({ name: 'ce-c11', template: 'c11' })
            ], C11);
            let C12 = class C12 {
            };
            C12 = __decorate([
                customElement({ name: 'ce-c12', template: 'c12' })
            ], C12);
            let C21 = class C21 {
            };
            C21 = __decorate([
                customElement({ name: 'ce-c21', template: 'c21' })
            ], C21);
            let C22 = class C22 {
            };
            C22 = __decorate([
                customElement({ name: 'ce-c22', template: 'c22' })
            ], C22);
            let P1 = class P1 {
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'c11' },
                        { path: 'c11', component: C11, title: 'C11' },
                        { path: 'c12', component: C12, title: 'C12' },
                    ]
                }),
                customElement({ name: 'ce-p1', template: '<nav-bar></nav-bar> p1 <au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
            };
            P2 = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'c22' },
                        { path: 'c21', component: C21, title: 'C21' },
                        { path: 'c22', component: C22, title: 'C22' },
                    ]
                }),
                customElement({ name: 'ce-p2', template: '<nav-bar></nav-bar> p2 <au-viewport></au-viewport>' })
            ], P2);
            let P3 = class P3 {
            };
            P3 = __decorate([
                customElement({ name: 'ce-p3', template: 'p3' })
            ], P3);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'p1' },
                        { path: 'p1', component: P1, title: 'P1' },
                        { path: 'p2', component: P2, title: 'P2' },
                        { path: 'p3', component: P3, title: 'P3', nav: false },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe();
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            // Start
            await queue.yield();
            const rootNavbar = CustomElement.for(host.querySelector('nav-bar')).viewModel;
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'start root');
            let childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: true }, { href: 'c12', text: 'C12', active: false }], 'start child navbar');
            // Round#1
            await router.load('p2');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#1 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: false }, { href: 'c22', text: 'C22', active: true }], 'round#1 child navbar');
            // Round#2
            await router.load('p1/c12');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'round#2 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: false }, { href: 'c12', text: 'C12', active: true }], 'round#2 navbar');
            // Round#3
            await router.load('p2/c21');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#3 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: true }, { href: 'c22', text: 'C22', active: false }], 'round#3 navbar');
            // Round#4 - nav:false, but routeable
            await router.load('p3');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: false }], 'round#4 root');
            assert.notEqual(host.querySelector('ce-p3'), null);
            await au.stop(true);
        });
        it('with redirection - path with redirection is not shown', async function () {
            let C11 = class C11 {
            };
            C11 = __decorate([
                customElement({ name: 'ce-c11', template: 'c11' })
            ], C11);
            let C12 = class C12 {
            };
            C12 = __decorate([
                customElement({ name: 'ce-c12', template: 'c12' })
            ], C12);
            let C21 = class C21 {
            };
            C21 = __decorate([
                customElement({ name: 'ce-c21', template: 'c21' })
            ], C21);
            let C22 = class C22 {
            };
            C22 = __decorate([
                customElement({ name: 'ce-c22', template: 'c22' })
            ], C22);
            let P1 = class P1 {
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'c11' },
                        { path: 'c11', component: C11, title: 'C11' },
                        { path: 'c12', component: C12, title: 'C12' },
                    ]
                }),
                customElement({ name: 'ce-p1', template: '<nav-bar></nav-bar> p1 <au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
            };
            P2 = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'c22' },
                        { path: 'c21', component: C21, title: 'C21' },
                        { path: 'c22', component: C22, title: 'C22' },
                    ]
                }),
                customElement({ name: 'ce-p2', template: '<nav-bar></nav-bar> p2 <au-viewport></au-viewport>' })
            ], P2);
            let P3 = class P3 {
            };
            P3 = __decorate([
                customElement({ name: 'ce-p3', template: 'p3' })
            ], P3);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'p1' },
                        { path: 'p1', component: P1, title: 'P1' },
                        { path: 'p2', component: P2, title: 'P2' },
                        { path: 'p3', component: P3, title: 'P3', nav: false },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe(false);
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            // Start
            await queue.yield();
            const rootNavbar = CustomElement.for(host.querySelector('nav-bar')).viewModel;
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'start root');
            let childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: true }, { href: 'c12', text: 'C12', active: false }], 'start child navbar');
            // Round#1
            await router.load('p2');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#1 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: false }, { href: 'c22', text: 'C22', active: true }], 'round#1 child navbar');
            // Round#2
            await router.load('p1/c12');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: true }, { href: 'p2', text: 'P2', active: false }], 'round#2 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p1>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c11', text: 'C11', active: false }, { href: 'c12', text: 'C12', active: true }], 'round#2 navbar');
            // Round#3
            await router.load('p2/c21');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: true }], 'round#3 root');
            childNavBar = CustomElement.for(host.querySelector('ce-p2>nav-bar')).viewModel;
            childNavBar.assert([{ href: 'c21', text: 'C21', active: true }, { href: 'c22', text: 'C22', active: false }], 'round#3 navbar');
            // Round#4 - nav:false, but routeable
            await router.load('p3');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1', text: 'P1', active: false }, { href: 'p2', text: 'P2', active: false }], 'round#4 root');
            assert.notEqual(host.querySelector('ce-p3'), null);
            await au.stop(true);
        });
        it('parameterized redirection', async function () {
            let P1 = class P1 {
            };
            P1 = __decorate([
                customElement({ name: 'ce-p1', template: 'p1' })
            ], P1);
            let P2 = class P2 {
            };
            P2 = __decorate([
                customElement({ name: 'ce-p2', template: 'p2' })
            ], P2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 'foo/:id', redirectTo: 'p1/:id' },
                        { path: 'bar/:id', redirectTo: 'p2/:id' },
                        { path: 'p1/:id', component: P1, title: 'P1' },
                        { path: 'p2/:id', component: P2, title: 'P2' },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe();
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            // Start
            await queue.yield();
            const rootNavbar = CustomElement.for(host.querySelector('nav-bar')).viewModel;
            rootNavbar.assert([{ href: 'p1/:id', text: 'P1', active: false }, { href: 'p2/:id', text: 'P2', active: false }], 'start root');
            // Round#1
            await router.load('bar/42');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1/:id', text: 'P1', active: false }, { href: 'p2/:id', text: 'P2', active: true }], 'round#1 root');
            // Round#2
            await router.load('foo/42');
            await queue.yield();
            rootNavbar.assert([{ href: 'p1/:id', text: 'P1', active: true }, { href: 'p2/:id', text: 'P2', active: false }], 'round#2 root');
            await au.stop(true);
        });
        it('can be deactivated', async function () {
            let C11 = class C11 {
            };
            C11 = __decorate([
                customElement({ name: 'ce-c11', template: 'c11' })
            ], C11);
            let P1 = class P1 {
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: ['', 'c11'], component: C11, title: 'C11' },
                    ]
                }),
                customElement({ name: 'ce-p1', template: '<nav-bar></nav-bar> p1 <au-viewport></au-viewport>' })
            ], P1);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'p1'], component: P1, title: 'P1' },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            const navBarCe = getNavBarCe();
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration.customize({ useNavigationModel: false }), navBarCe);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const queue = container.get(IPlatform).domWriteQueue;
            await queue.yield();
            assert.html.textContent(host, 'no nav model root no nav model p1 c11');
            await au.stop(true);
        });
        class InvalidAsyncComponentTestData {
            constructor(name, component) {
                this.name = name;
                this.component = component;
            }
        }
        function* getInvalidAsyncComponentTestData() {
            yield new InvalidAsyncComponentTestData('empty', Promise.resolve({}));
            yield new InvalidAsyncComponentTestData('no-CE in module', Promise.resolve({ foo() { } }));
        }
        for (const { name, component } of getInvalidAsyncComponentTestData()) {
            it(`async configuration - invalid module - ${name}`, async function () {
                let Root = class Root {
                    getRouteConfig(_parentDefinition, _routeNode) {
                        return {
                            routes: [
                                { path: '', component, title: 'P1' },
                            ]
                        };
                    }
                };
                Root = __decorate([
                    customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
                ], Root);
                const ctx = TestContext.create();
                const { container } = ctx;
                container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration);
                const au = new Aurelia(container);
                const host = ctx.createElement('div');
                try {
                    await au.app({ component: Root, host }).start();
                    assert.fail('expected error');
                }
                catch (er) {
                    assert.match(er.message, /AUR3175/);
                }
                await au.stop(true);
            });
        }
    });
    it('isNavigating indicates router\'s navigation status', async function () {
        let P1 = class P1 {
        };
        P1 = __decorate([
            customElement({ name: 'ce-p1', template: 'p1' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            customElement({ name: 'ce-p2', template: 'p2' })
        ], P2);
        let Root = class Root {
            constructor(router) {
                this.router = router;
                this.isNavigatingLog = [];
            }
            logIsNavigating(isNavigating) {
                this.isNavigatingLog.push(isNavigating);
            }
        };
        __decorate([
            watch(root => root['router'].isNavigating),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Boolean]),
            __metadata("design:returntype", void 0)
        ], Root.prototype, "logIsNavigating", null);
        Root = __decorate([
            route({
                routes: [
                    { path: ['', 'p1'], component: P1, title: 'P1' },
                    { path: 'p2', component: P2, title: 'P2' },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<nav-bar></nav-bar> root <au-viewport></au-viewport>' }),
            __param(0, IRouter),
            __metadata("design:paramtypes", [Object])
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, P1, P2);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        await au.app({ component: Root, host }).start();
        const log = au.root.controller.viewModel.isNavigatingLog;
        assert.deepStrictEqual(log, [true, false]);
        log.length = 0;
        await container.get(IRouter).load('p2');
        assert.deepStrictEqual(log, [true, false]);
        await au.stop(true);
    });
    it('custom base path can be configured', async function () {
        let P1 = class P1 {
        };
        P1 = __decorate([
            customElement({ name: 'ce-p1', template: 'p1' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            customElement({ name: 'ce-p2', template: 'p2' })
        ], P2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'p1', component: P1, title: 'P1' },
                    { path: 'p2', component: P2, title: 'P2' },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<a load="p1"></a><a load="p2"></a><au-viewport></au-viewport>' })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        // mocked window
        container.register(Registration.instance(IWindow, {
            document: {
                baseURI: 'https://portal.example.com/',
            },
            removeEventListener() { },
            addEventListener() { },
        }));
        container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration.customize({ basePath: '/mega-dodo/guide1/' }), P1, P2);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        await au.app({ component: Root, host }).start();
        const anchors = Array.from(host.querySelectorAll('a'));
        assert.deepStrictEqual(anchors.map(a => a.href), ['https://portal.example.com/mega-dodo/guide1/p1', 'https://portal.example.com/mega-dodo/guide1/p2']);
        assert.strictEqual(host.querySelector('ce-p1'), null);
        assert.strictEqual(host.querySelector('ce-p2'), null);
        anchors[0].click();
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.notEqual(host.querySelector('ce-p1'), null);
        assert.strictEqual(host.querySelector('ce-p2'), null);
        anchors[1].click();
        await queue.yield();
        assert.strictEqual(host.querySelector('ce-p1'), null);
        assert.notEqual(host.querySelector('ce-p2'), null);
        const router = container.get(IRouter);
        await router.load('/mega-dodo/guide1/p1');
        assert.notEqual(host.querySelector('ce-p1'), null);
        assert.strictEqual(host.querySelector('ce-p2'), null);
        await router.load('/mega-dodo/guide1/p2');
        assert.strictEqual(host.querySelector('ce-p1'), null);
        assert.notEqual(host.querySelector('ce-p2'), null);
        await au.stop(true);
    });
    it('multiple paths can redirect to same path', async function () {
        let P1 = class P1 {
        };
        P1 = __decorate([
            customElement({ name: 'ce-p1', template: 'p1' })
        ], P1);
        let P2 = class P2 {
        };
        P2 = __decorate([
            customElement({ name: 'ce-p2', template: 'p2' })
        ], P2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: ['', 'foo'], redirectTo: 'p2' },
                    { path: 'p1', component: P1, title: 'P1' },
                    { path: 'p2', component: P2, title: 'P2' },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, P1, P2);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        const router = container.get(IRouter);
        await au.app({ component: Root, host }).start();
        assert.html.textContent(host, 'p2');
        const location = container.get(ILocation);
        assert.match(location.path, /p2$/);
        await router.load('p1');
        assert.html.textContent(host, 'p1');
        assert.match(location.path, /p1$/);
        await router.load('foo');
        assert.html.textContent(host, 'p2');
        assert.match(location.path, /p2$/);
        await au.stop(true);
    });
    it('parameterized redirect', async function () {
        let P1 = class P1 {
        };
        P1 = __decorate([
            customElement({ name: 'ce-p1', template: 'p1' })
        ], P1);
        let P2 = class P2 {
            loading(params, _next, _current) {
                this.id = params.id;
            }
        };
        P2 = __decorate([
            customElement({ name: 'ce-p2', template: `p2 \${id}` })
        ], P2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: '', redirectTo: 'p2' },
                    { path: 'foo', redirectTo: 'p2/42' },
                    { path: 'fizz/:bar', redirectTo: 'p2/:bar' },
                    { path: 'bar', redirectTo: 'p2/43+p2/44' },
                    { path: 'p1', component: P1, title: 'P1' },
                    { path: 'p2/:id?', component: P2, title: 'P2' },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport><au-viewport default.bind="null"></au-viewport>' })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, P1, P2);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        const router = container.get(IRouter);
        await au.app({ component: Root, host }).start();
        assert.html.textContent(host, 'p2');
        const location = container.get(ILocation);
        assert.match(location.path, /p2$/);
        await router.load('p1');
        assert.html.textContent(host, 'p1');
        assert.match(location.path, /p1$/);
        await router.load('foo');
        assert.html.textContent(host, 'p2 42');
        assert.match(location.path, /p2\/42$/);
        await router.load('fizz/21');
        assert.html.textContent(host, 'p2 21');
        assert.match(location.path, /p2\/21$/);
        try {
            await router.load('bar');
            assert.fail('Expected error for non-simple redirect.');
        }
        catch (e) {
            assert.match(e.message, /AUR3502/, 'Expected error due to unexpected path segment.');
        }
        await au.stop(true);
    });
    it('parameterized redirect - parameter rearrange', async function () {
        let P1 = class P1 {
        };
        P1 = __decorate([
            customElement({ name: 'ce-p1', template: 'p1' })
        ], P1);
        let P2 = class P2 {
            loading(params, _next, _current) {
                this.p1 = params.p1;
                this.p2 = params.p2;
            }
        };
        P2 = __decorate([
            customElement({ name: 'ce-p2', template: `p2 \${p1} \${p2}` })
        ], P2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'fizz/:foo/:bar', redirectTo: 'p2/:bar/:foo' },
                    { path: 'p2/:p1?/:p2?', component: P2, title: 'P2' },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport><au-viewport default.bind="null"></au-viewport>' })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, P1, P2);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        const router = container.get(IRouter);
        await au.app({ component: Root, host }).start();
        const location = container.get(ILocation);
        await router.load('fizz/1/2');
        assert.html.textContent(host, 'p2 2 1');
        assert.match(location.path, /p2\/2\/1$/);
        await au.stop(true);
    });
    describe('path generation', function () {
        it('at root', async function () {
            class BaseRouteViewModel {
                static assertAndClear(key, expected, message) {
                    assert.deepStrictEqual(this.paramsLog.get(key), expected, message);
                    this.paramsLog.clear();
                }
                loading(params, next, _) {
                    BaseRouteViewModel.paramsLog.set(this.constructor.name.toLowerCase(), [params, next.queryParams]);
                }
            }
            BaseRouteViewModel.paramsLog = new Map();
            let Foo = class Foo extends BaseRouteViewModel {
            };
            Foo = __decorate([
                customElement({ name: 'fo-o', template: '' })
            ], Foo);
            let Bar = class Bar extends BaseRouteViewModel {
            };
            Bar = __decorate([
                customElement({ name: 'ba-r', template: '' })
            ], Bar);
            let Fizz = class Fizz extends BaseRouteViewModel {
            };
            Fizz = __decorate([
                customElement({ name: 'fi-zz', template: '' })
            ], Fizz);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { id: 'foo', path: ['foo/:id', 'foo/:id/bar/:a', 'foo/:id/:bar?/*b'], component: Foo },
                        { id: 'bar', path: ['bar/:id'], component: Bar },
                        { id: 'fizz', path: ['fizz/:x', 'fizz/:y/:x'], component: Fizz },
                    ]
                }),
                customElement({
                    name: 'ro-ot',
                    template: `<au-viewport></au-viewport>`
                })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, Foo, Bar);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const location = container.get(ILocation);
            const router = container.get(IRouter);
            // using route-id
            assert.strictEqual(await router.load({ component: 'foo', params: { id: '1', a: '3' } }), true);
            assert.match(location.path, /foo\/1\/bar\/3$/);
            BaseRouteViewModel.assertAndClear('foo', [{ id: '1', a: '3' }, new URLSearchParams()], 'params1');
            assert.strictEqual(await router.load({ component: 'foo', params: { id: '1', c: '3' } }), true);
            assert.match(location.path, /foo\/1\?c=3$/);
            BaseRouteViewModel.assertAndClear('foo', [{ id: '1' }, new URLSearchParams({ c: '3' })], 'params2');
            assert.strictEqual(await router.load({ component: 'bar', params: { id: '1', c: '4' } }), true);
            assert.match(location.path, /bar\/1\?c=4$/);
            BaseRouteViewModel.assertAndClear('bar', [{ id: '1' }, new URLSearchParams({ c: '4' })], 'params3');
            assert.strictEqual(await router.load({ component: 'foo', params: { id: '1', b: 'awesome/possum' } }), true);
            assert.match(location.path, /foo\/1\/awesome%2Fpossum$/);
            BaseRouteViewModel.assertAndClear('foo', [{ id: '1', b: 'awesome/possum' }, new URLSearchParams()], 'params4');
            try {
                await router.load({ component: 'bar', params: { x: '1' } });
                assert.fail('expected error1');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+bar/);
            }
            try {
                await router.load({ component: 'fizz', params: { id: '1' } });
                assert.fail('expected error2');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+fizz/);
            }
            // using component
            assert.strictEqual(await router.load({ component: Foo, params: { id: '1', a: '3' } }), true);
            assert.match(location.path, /foo\/1\/bar\/3$/);
            BaseRouteViewModel.assertAndClear('foo', [{ id: '1', a: '3' }, new URLSearchParams()], 'params5');
            assert.strictEqual(await router.load({ component: Foo, params: { id: '1', c: '3' } }), true);
            assert.match(location.path, /foo\/1\?c=3$/);
            BaseRouteViewModel.assertAndClear('foo', [{ id: '1' }, new URLSearchParams({ c: '3' })], 'params6');
            try {
                await router.load({ component: Bar, params: { x: '1' } });
                assert.fail('expected error1');
            }
            catch (er) {
                assert.match(er.message, /No value for the required parameter 'id'/);
            }
            try {
                await router.load({ component: Fizz, params: { id: '1' } });
                assert.fail('expected error2');
            }
            catch (er) {
                assert.match(er.message, /required parameter 'x'.+path: 'fizz\/:x'.+required parameter 'y'.+path: 'fizz\/:y\/:x'/);
            }
            // use path (non-eager resolution)
            assert.strictEqual(await router.load('bar/1?b=3'), true);
            BaseRouteViewModel.assertAndClear('bar', [{ id: '1' }, new URLSearchParams({ b: '3' })], 'params7');
            await au.stop(true);
        });
        it('at root - with siblings', async function () {
            class BaseRouteViewModel {
                static assertAndClear(message, ...expected) {
                    const paramsLog = this.paramsLog;
                    assert.deepStrictEqual(paramsLog, new Map(expected), message);
                    paramsLog.clear();
                }
                loading(params, next, _) {
                    BaseRouteViewModel.paramsLog.set(this.constructor.name.toLowerCase(), [params, next.queryParams]);
                }
            }
            BaseRouteViewModel.paramsLog = new Map();
            let Foo = class Foo extends BaseRouteViewModel {
            };
            Foo = __decorate([
                customElement({ name: 'fo-o', template: '' })
            ], Foo);
            let Bar = class Bar extends BaseRouteViewModel {
            };
            Bar = __decorate([
                customElement({ name: 'ba-r', template: '' })
            ], Bar);
            let Fizz = class Fizz extends BaseRouteViewModel {
            };
            Fizz = __decorate([
                customElement({ name: 'fi-zz', template: '' })
            ], Fizz);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { id: 'foo', path: ['foo/:id', 'foo/:id/faa/:a'], component: Foo },
                        { id: 'bar', path: ['bar/:id'], component: Bar },
                        { id: 'fizz', path: ['fizz/:x', 'fizz/:y/:x'], component: Fizz },
                    ]
                }),
                customElement({
                    name: 'ro-ot',
                    template: `<au-viewport></au-viewport><au-viewport></au-viewport>`
                })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, Foo, Bar);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const location = container.get(ILocation);
            const router = container.get(IRouter);
            // using route-id
            assert.strictEqual(await router.load([{ component: 'foo', params: { id: '1', a: '3' } }, { component: 'bar', params: { id: '1', b: '3' } }]), true);
            assert.match(location.path, /foo\/1\/faa\/3\+bar\/1\?b=3$/);
            BaseRouteViewModel.assertAndClear('params1', ['foo', [{ id: '1', a: '3' }, new URLSearchParams({ b: '3' })]], ['bar', [{ id: '1' }, new URLSearchParams({ b: '3' })]]);
            assert.strictEqual(await router.load([{ component: 'bar', params: { id: '2' } }, { component: 'foo', params: { id: '3' } }]), true);
            assert.match(location.path, /bar\/2\+foo\/3$/);
            BaseRouteViewModel.assertAndClear('params1', ['bar', [{ id: '2' }, new URLSearchParams()]], ['foo', [{ id: '3' }, new URLSearchParams()]]);
            try {
                await router.load([{ component: 'foo', params: { id: '3' } }, { component: 'bar', params: { x: '1' } }]);
                assert.fail('expected error1');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+bar/);
            }
            try {
                await router.load([{ component: 'foo', params: { id: '3' } }, { component: 'fizz', params: { id: '1' } }]);
                assert.fail('expected error2');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+fizz/);
            }
            // using component
            assert.strictEqual(await router.load([{ component: Foo, params: { id: '1', a: '3' } }, { component: Bar, params: { id: '1', b: '3' } }]), true);
            assert.match(location.path, /foo\/1\/faa\/3\+bar\/1\?b=3$/);
            BaseRouteViewModel.assertAndClear('params3', ['foo', [{ id: '1', a: '3' }, new URLSearchParams({ b: '3' })]], ['bar', [{ id: '1' }, new URLSearchParams({ b: '3' })]]);
            assert.strictEqual(await router.load([{ component: Bar, params: { id: '2' } }, { component: Foo, params: { id: '3' } }]), true);
            assert.match(location.path, /bar\/2\+foo\/3$/);
            BaseRouteViewModel.assertAndClear('params4', ['bar', [{ id: '2' }, new URLSearchParams()]], ['foo', [{ id: '3' }, new URLSearchParams()]]);
            try {
                await router.load([{ component: Foo, params: { id: '3' } }, { component: Bar, params: { x: '1' } }]);
                assert.fail('expected error1');
            }
            catch (er) {
                assert.match(er.message, /No value for the required parameter 'id'/);
            }
            try {
                await router.load([{ component: Foo, params: { id: '3' } }, { component: Fizz, params: { id: '1' } }]);
                assert.fail('expected error2');
            }
            catch (er) {
                assert.match(er.message, /required parameter 'x'.+path: 'fizz\/:x'.+required parameter 'y'.+path: 'fizz\/:y\/:x'/);
            }
            // path that cannot be eagerly resolved
            assert.strictEqual(await router.load('foo/11+bar/21?b=3'), true);
            BaseRouteViewModel.assertAndClear('params5', ['foo', [{ id: '11' }, new URLSearchParams({ b: '3' })]], ['bar', [{ id: '21' }, new URLSearchParams({ b: '3' })]]);
            await au.stop(true);
        });
        it('with parent-child hierarchy', async function () {
            class BaseRouteViewModel {
                static assertAndClear(message, ...expected) {
                    const paramsLog = this.paramsLog;
                    assert.deepStrictEqual(paramsLog, new Map(expected), message);
                    paramsLog.clear();
                }
                loading(params, next, _) {
                    BaseRouteViewModel.paramsLog.set(this.constructor.name.toLowerCase(), [params, next.queryParams]);
                }
            }
            BaseRouteViewModel.paramsLog = new Map();
            let CeL21 = class CeL21 extends BaseRouteViewModel {
            };
            CeL21 = __decorate([
                customElement({ name: 'ce-l21', template: '' })
            ], CeL21);
            let CeL22 = class CeL22 extends BaseRouteViewModel {
            };
            CeL22 = __decorate([
                customElement({ name: 'ce-l22', template: '' })
            ], CeL22);
            let CeL23 = class CeL23 extends BaseRouteViewModel {
            };
            CeL23 = __decorate([
                customElement({ name: 'ce-l23', template: '' })
            ], CeL23);
            let CeL24 = class CeL24 extends BaseRouteViewModel {
            };
            CeL24 = __decorate([
                customElement({ name: 'ce-l24', template: '' })
            ], CeL24);
            let CeL11 = class CeL11 extends BaseRouteViewModel {
            };
            CeL11 = __decorate([
                route({
                    routes: [
                        { id: '21', path: ['21/:id', '21/:id/to/:a'], component: CeL21 },
                        { id: '22', path: ['22/:id'], component: CeL22 },
                    ]
                }),
                customElement({ name: 'ce-l11', template: '<au-viewport></au-viewport>' })
            ], CeL11);
            let CeL12 = class CeL12 extends BaseRouteViewModel {
            };
            CeL12 = __decorate([
                route({
                    routes: [
                        { id: '23', path: ['23/:id', '23/:id/tt/:a'], component: CeL23 },
                        { id: '24', path: ['24/:id'], component: CeL24 },
                    ]
                }),
                customElement({ name: 'ce-l12', template: '<au-viewport></au-viewport>' })
            ], CeL12);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { id: '11', path: ['11/:id', '11/:id/oo/:a'], component: CeL11 },
                        { id: '12', path: ['12/:id'], component: CeL12 },
                    ]
                }),
                customElement({
                    name: 'ro-ot',
                    template: `<au-viewport></au-viewport>`
                })
            ], Root);
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(StandardConfiguration, TestRouterConfiguration.for(3 /* LogLevel.warn */), RouterConfiguration, CeL11, CeL21, CeL22, CeL12, CeL23, CeL24);
            const au = new Aurelia(container);
            const host = ctx.createElement('div');
            await au.app({ component: Root, host }).start();
            const location = container.get(ILocation);
            const router = container.get(IRouter);
            // using route-id
            assert.strictEqual(await router.load({
                component: '11',
                params: { id: '1', a: '3' },
                children: [{ component: '21', params: { id: '2', a: '4' } }]
            }), true);
            assert.match(location.path, /11\/1\/oo\/3\/21\/2\/to\/4$/);
            BaseRouteViewModel.assertAndClear('params1', ['cel11', [{ id: '1', a: '3' }, new URLSearchParams()]], ['cel21', [{ id: '2', a: '4' }, new URLSearchParams()]]);
            assert.strictEqual(await router.load({
                component: '12',
                params: { id: '1', a: '3' },
                children: [{ component: '24', params: { id: '2', a: '4' } }]
            }), true);
            assert.match(location.path, /12\/1\/24\/2\?a=3&a=4$/);
            BaseRouteViewModel.assertAndClear('params2', ['cel12', [{ id: '1' }, new URLSearchParams([['a', '3']])]], ['cel24', [{ id: '2' }, new URLSearchParams([['a', '3'], ['a', '4']])]]);
            // using CE class
            assert.strictEqual(await router.load({
                component: CeL11,
                params: { id: '1', a: '3' },
                children: [{ component: CeL21, params: { id: '2', a: '4' } }]
            }), true);
            assert.match(location.path, /11\/1\/oo\/3\/21\/2\/to\/4$/);
            BaseRouteViewModel.assertAndClear('params3', ['cel11', [{ id: '1', a: '3' }, new URLSearchParams()]], ['cel21', [{ id: '2', a: '4' }, new URLSearchParams()]]);
            assert.strictEqual(await router.load({
                component: CeL12,
                params: { id: '1', a: '3' },
                children: [{ component: CeL24, params: { id: '2', a: '4' } }]
            }), true);
            assert.match(location.path, /12\/1\/24\/2\?a=3&a=4$/);
            BaseRouteViewModel.assertAndClear('params4', ['cel12', [{ id: '1' }, new URLSearchParams([['a', '3']])]], ['cel24', [{ id: '2' }, new URLSearchParams([['a', '3'], ['a', '4']])]]);
            const el12 = host.querySelector('ce-l12');
            const ce12 = CustomElement.for(el12).viewModel;
            assert.strictEqual(await router.load({ component: CeL23, params: { id: '5', a: '6' } }, { context: ce12 }), true);
            assert.match(location.path, /12\/1\/23\/5\/tt\/6$/);
            BaseRouteViewModel.assertAndClear('params5', ['cel23', [{ id: '5', a: '6' }, new URLSearchParams()]]);
            await au.stop(true);
        });
    });
    describe('transition plan', function () {
        it('replace - inherited', async function () {
            var CeOne_1;
            let CeOne = CeOne_1 = class CeOne {
                constructor() {
                    this.id1 = ++CeOne_1.id1;
                }
                canLoad() {
                    this.id2 = ++CeOne_1.id2;
                    return true;
                }
            };
            CeOne.id1 = 0;
            CeOne.id2 = 0;
            CeOne = CeOne_1 = __decorate([
                customElement({ name: 'ce-one', template: 'ce1 ${id1} ${id2}' })
            ], CeOne);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    transitionPlan: 'replace',
                    routes: [
                        {
                            id: 'ce1',
                            path: ['ce1', 'ce1/:id'],
                            component: CeOne,
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<a load="ce1"></a><a load="ce1/1"></a><au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
            const queue = container.get(IPlatform).domWriteQueue;
            host.querySelector('a').click();
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 1', 'round#1');
            host.querySelector('a:nth-of-type(2)').click();
            await queue.yield();
            assert.html.textContent(host, 'ce1 2 2', 'round#2');
            await au.stop(true);
        });
        it('replace - inherited - sibling', async function () {
            var CeOne_2, CeTwo_1;
            let CeOne = CeOne_2 = class CeOne {
                constructor() {
                    this.id1 = ++CeOne_2.id1;
                }
                canLoad() {
                    this.id2 = ++CeOne_2.id2;
                    return true;
                }
            };
            CeOne.id1 = 0;
            CeOne.id2 = 0;
            CeOne = CeOne_2 = __decorate([
                customElement({ name: 'ce-one', template: 'ce1 ${id1} ${id2}' })
            ], CeOne);
            let CeTwo = CeTwo_1 = class CeTwo {
                constructor() {
                    this.id1 = ++CeTwo_1.id1;
                }
                canLoad() {
                    this.id2 = ++CeTwo_1.id2;
                    return true;
                }
            };
            CeTwo.id1 = 0;
            CeTwo.id2 = 0;
            CeTwo = CeTwo_1 = __decorate([
                customElement({ name: 'ce-two', template: 'ce2 ${id1} ${id2}' })
            ], CeTwo);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    transitionPlan: 'replace',
                    routes: [
                        {
                            id: 'ce1',
                            path: ['ce1', 'ce1/:id'],
                            component: CeOne,
                        },
                        {
                            id: 'ce2',
                            path: ['ce2', 'ce2/:id'],
                            component: CeTwo,
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<a load="ce1@$1+ce2@$2"></a><a load="ce1/2@$1+ce2/1@$2"></a><au-viewport name="$1"></au-viewport> <au-viewport name="$2"></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
            const queue = container.get(IPlatform).domWriteQueue;
            host.querySelector('a').click();
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 1 ce2 1 1', 'round#1');
            host.querySelector('a:nth-of-type(2)').click();
            await queue.yield();
            assert.html.textContent(host, 'ce1 2 2 ce2 2 2', 'round#2');
            await au.stop(true);
        });
        it('transitionPlan function #1', async function () {
            var CeOne_3, Root_1;
            let CeOne = CeOne_3 = class CeOne {
                constructor() {
                    this.id1 = ++CeOne_3.id1;
                }
                canLoad() {
                    this.id2 = ++CeOne_3.id2;
                    return true;
                }
            };
            CeOne.id1 = 0;
            CeOne.id2 = 0;
            CeOne = CeOne_3 = __decorate([
                customElement({ name: 'ce-one', template: 'ce1 ${id1} ${id2}' })
            ], CeOne);
            let Root = Root_1 = class Root {
            };
            Root = Root_1 = __decorate([
                route({
                    transitionPlan(current, next) {
                        return next.component.Type === Root_1 ? 'replace' : 'invoke-lifecycles';
                    },
                    routes: [
                        {
                            id: 'ce1',
                            path: ['ce1', 'ce1/:id'],
                            component: CeOne,
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<a load="ce1"></a><a load="ce1/1"></a><au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            host.querySelector('a').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 1', 'round#1');
            host.querySelector('a:nth-of-type(2)').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 2', 'round#2');
            await au.stop(true);
        });
        it('transitionPlan function #2 - sibling', async function () {
            var CeTwo_2, CeOne_4;
            let CeTwo = CeTwo_2 = class CeTwo {
                constructor() {
                    this.id1 = ++CeTwo_2.id1;
                }
                canLoad() {
                    this.id2 = ++CeTwo_2.id2;
                    return true;
                }
            };
            CeTwo.id1 = 0;
            CeTwo.id2 = 0;
            CeTwo = CeTwo_2 = __decorate([
                customElement({ name: 'ce-two', template: 'ce2 ${id1} ${id2}' })
            ], CeTwo);
            let CeOne = CeOne_4 = class CeOne {
                constructor() {
                    this.id1 = ++CeOne_4.id1;
                }
                canLoad() {
                    this.id2 = ++CeOne_4.id2;
                    return true;
                }
            };
            CeOne.id1 = 0;
            CeOne.id2 = 0;
            CeOne = CeOne_4 = __decorate([
                customElement({ name: 'ce-one', template: 'ce1 ${id1} ${id2}' })
            ], CeOne);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    transitionPlan(current, next) {
                        return next.component.Type === CeTwo ? 'invoke-lifecycles' : 'replace';
                    },
                    routes: [
                        {
                            id: 'ce1',
                            path: ['ce1', 'ce1/:id'],
                            component: CeOne,
                        },
                        {
                            id: 'ce2',
                            path: ['ce2', 'ce2/:id'],
                            component: CeTwo,
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<a load="ce1@$1+ce2@$2"></a><a load="ce1/2@$1+ce2/1@$2"></a><au-viewport name="$1"></au-viewport> <au-viewport name="$2"></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            host.querySelector('a').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 1 ce2 1 1', 'round#1');
            host.querySelector('a:nth-of-type(2)').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 2 2 ce2 1 2', 'round#2');
            await au.stop(true);
        });
        it('transitionPlan function #3 - parent-child - parent:replace,child:invoke-lifecycles', async function () {
            var CeTwo_3, CeOne_5;
            let CeTwo = CeTwo_3 = class CeTwo {
                constructor() {
                    this.id1 = ++CeTwo_3.id1;
                }
                canLoad() {
                    this.id2 = ++CeTwo_3.id2;
                    return true;
                }
            };
            CeTwo.id1 = 0;
            CeTwo.id2 = 0;
            CeTwo = CeTwo_3 = __decorate([
                customElement({ name: 'ce-two', template: 'ce2 ${id1} ${id2}' })
            ], CeTwo);
            let CeOne = CeOne_5 = class CeOne {
                constructor() {
                    this.id1 = ++CeOne_5.id1;
                }
                canLoad() {
                    this.id2 = ++CeOne_5.id2;
                    return true;
                }
            };
            CeOne.id1 = 0;
            CeOne.id2 = 0;
            CeOne = CeOne_5 = __decorate([
                route({
                    routes: [
                        {
                            id: 'ce2',
                            path: ['', 'ce2'],
                            component: CeTwo,
                        },
                    ]
                }),
                customElement({ name: 'ce-one', template: 'ce1 ${id1} ${id2} <au-viewport></au-viewport>' })
            ], CeOne);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    transitionPlan(current, next) {
                        return next.component.Type === CeTwo ? 'invoke-lifecycles' : 'replace';
                    },
                    routes: [
                        {
                            id: 'ce1',
                            path: ['ce1', 'ce1/:id'],
                            component: CeOne,
                        }
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<a load="ce1"></a><a load="ce1/1"></a><au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            host.querySelector('a').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 1 ce2 1 1', 'round#1');
            host.querySelector('a:nth-of-type(2)').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 2 2 ce2 2 2', 'round#2'); // this happens as the ce-one (parent) is replaced causing replacement of child
            await au.stop(true);
        });
        it('transitionPlan function #3 - parent-child - parent:invoke-lifecycles,child:replace', async function () {
            var CeTwo_4, CeOne_6;
            let CeTwo = CeTwo_4 = class CeTwo {
                constructor() {
                    this.id1 = ++CeTwo_4.id1;
                }
                canLoad() {
                    this.id2 = ++CeTwo_4.id2;
                    return true;
                }
            };
            CeTwo.id1 = 0;
            CeTwo.id2 = 0;
            CeTwo = CeTwo_4 = __decorate([
                customElement({ name: 'ce-two', template: 'ce2 ${id1} ${id2}' })
            ], CeTwo);
            let CeOne = CeOne_6 = class CeOne {
                constructor() {
                    this.id1 = ++CeOne_6.id1;
                }
                canLoad() {
                    this.id2 = ++CeOne_6.id2;
                    return true;
                }
            };
            CeOne.id1 = 0;
            CeOne.id2 = 0;
            CeOne = CeOne_6 = __decorate([
                route({
                    routes: [
                        {
                            id: 'ce2',
                            path: ['', 'ce2'],
                            component: CeTwo,
                        },
                    ]
                }),
                customElement({ name: 'ce-one', template: 'ce1 ${id1} ${id2} <au-viewport></au-viewport>' })
            ], CeOne);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    transitionPlan(current, next) {
                        return next.component.Type === CeOne ? 'invoke-lifecycles' : 'replace';
                    },
                    routes: [
                        {
                            id: 'ce1',
                            path: ['ce1', 'ce1/:id'],
                            component: CeOne,
                        }
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<a load="ce1"></a><a load="ce1/1"></a><au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            host.querySelector('a').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 1 ce2 1 1', 'round#1');
            host.querySelector('a:nth-of-type(2)').click();
            await router.currentTr.promise;
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 2 ce2 1 1', 'round#2'); // note that as the parent is not replaced, the child is retained.
            await au.stop(true);
        });
        it('transitionPlan can be overridden per instruction basis', async function () {
            var CeTwo_5, CeOne_7;
            let CeTwo = CeTwo_5 = class CeTwo {
                constructor() {
                    this.id1 = ++CeTwo_5.id1;
                }
                canLoad(params) {
                    this.id = params.id;
                    this.id2 = ++CeTwo_5.id2;
                    return true;
                }
            };
            CeTwo.id1 = 0;
            CeTwo.id2 = 0;
            CeTwo = CeTwo_5 = __decorate([
                customElement({ name: 'ce-two', template: 'ce2 ${id1} ${id2} ${id}' })
            ], CeTwo);
            let CeOne = CeOne_7 = class CeOne {
                constructor() {
                    this.id1 = ++CeOne_7.id1;
                }
                canLoad(params) {
                    this.id = params.id;
                    this.id2 = ++CeOne_7.id2;
                    return true;
                }
            };
            CeOne.id1 = 0;
            CeOne.id2 = 0;
            CeOne = CeOne_7 = __decorate([
                customElement({ name: 'ce-one', template: 'ce1 ${id1} ${id2} ${id}' })
            ], CeOne);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    transitionPlan: 'replace',
                    routes: [
                        {
                            id: 'ce1',
                            path: ['ce1/:id'],
                            component: CeOne,
                            transitionPlan: 'invoke-lifecycles',
                        },
                        {
                            id: 'ce2',
                            path: ['ce2/:id'],
                            component: CeTwo,
                            transitionPlan: 'replace',
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root });
            const queue = container.get(IPlatform).domWriteQueue;
            const router = container.get(IRouter);
            await router.load('ce1/42');
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 1 42', 'round#1');
            await router.load('ce1/43');
            await queue.yield();
            assert.html.textContent(host, 'ce1 1 2 43', 'round#2');
            await router.load('ce1/44', { transitionPlan: 'replace' });
            await queue.yield();
            assert.html.textContent(host, 'ce1 2 3 44', 'round#3');
            await router.load('ce2/42');
            await queue.yield();
            assert.html.textContent(host, 'ce2 1 1 42', 'round#4');
            await router.load('ce2/43');
            await queue.yield();
            assert.html.textContent(host, 'ce2 2 2 43', 'round#5');
            await router.load('ce2/44', { transitionPlan: 'invoke-lifecycles' });
            await queue.yield();
            assert.html.textContent(host, 'ce2 2 3 44', 'round#6');
            await au.stop(true);
        });
    });
    describe('history strategy', function () {
        class TestData {
            constructor(strategy, expectations) {
                this.strategy = strategy;
                this.expectations = expectations;
            }
        }
        function* getTestData() {
            yield new TestData('push', [
                '#1 - len: 1 - state: {"au-nav-id":1}',
                '#2 - len: 2 - state: {"au-nav-id":2}',
                '#3 - len: 3 - state: {"au-nav-id":3}',
                '#4 - len: 4 - state: {"au-nav-id":4}',
            ]);
            yield new TestData('replace', [
                '#1 - len: 1 - state: {"au-nav-id":1}',
                '#2 - len: 1 - state: {"au-nav-id":2}',
                '#3 - len: 1 - state: {"au-nav-id":3}',
                '#4 - len: 1 - state: {"au-nav-id":4}',
            ]);
            yield new TestData('none', [
                '#1 - len: 1 - state: {"au-nav-id":1}',
                '#2 - len: 1 - state: {"au-nav-id":1}',
                '#3 - len: 1 - state: {"au-nav-id":1}',
                '#4 - len: 1 - state: {"au-nav-id":1}',
            ]);
        }
        for (const data of getTestData()) {
            it(data.strategy, async function () {
                let CeTwo = class CeTwo {
                };
                CeTwo = __decorate([
                    customElement({ name: 'ce-two', template: 'ce2' })
                ], CeTwo);
                let CeOne = class CeOne {
                };
                CeOne = __decorate([
                    customElement({ name: 'ce-one', template: 'ce1' })
                ], CeOne);
                let Root = class Root {
                    constructor(history, events) {
                        let i = 0;
                        events.subscribe('au:router:navigation-end', () => {
                            this.history = `#${++i} - len: ${history.length} - state: ${JSON.stringify(history.state)}`;
                        });
                    }
                };
                Root = __decorate([
                    route({
                        routes: [
                            {
                                id: 'ce1',
                                path: ['', 'ce1'],
                                component: CeOne,
                            },
                            {
                                id: 'ce2',
                                path: ['ce2'],
                                component: CeTwo,
                            },
                        ]
                    }),
                    customElement({ name: 'ro-ot', template: '<a load="ce1"></a><a load="ce2"></a><span id="history">${history}</span><au-viewport></au-viewport>' }),
                    __param(0, IHistory),
                    __param(1, IRouterEvents),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne, CeTwo], historyStrategy: data.strategy });
                const queue = container.get(IPlatform).domWriteQueue;
                const router = container.get(IRouter);
                const expectations = data.expectations;
                const len = expectations.length;
                await queue.yield();
                const history = host.querySelector('#history');
                assert.html.textContent(history, expectations[0], 'start');
                const anchors = Array.from(host.querySelectorAll('a'));
                for (let i = 1; i < len; i++) {
                    anchors[i % 2].click();
                    await router.currentTr.promise;
                    await queue.yield();
                    assert.html.textContent(history, expectations[i], `round#${i}`);
                }
                await au.stop(true);
            });
        }
        (isNode() ? it.skip : it)('explicit history strategy can be used for individual navigation - configured: push', async function () {
            let CeThree = class CeThree {
            };
            CeThree = __decorate([
                customElement({ name: 'ce-three', template: 'ce3' })
            ], CeThree);
            let CeTwo = class CeTwo {
            };
            CeTwo = __decorate([
                customElement({ name: 'ce-two', template: 'ce2' })
            ], CeTwo);
            let CeOne = class CeOne {
            };
            CeOne = __decorate([
                customElement({ name: 'ce-one', template: 'ce1' })
            ], CeOne);
            let Root = class Root {
                constructor(history, events) {
                    let i = 0;
                    events.subscribe('au:router:navigation-end', () => {
                        this.history = `#${++i} - len: ${history.length} - state: ${JSON.stringify(history.state)}`;
                    });
                }
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            id: 'ce1',
                            path: ['', 'ce1'],
                            component: CeOne,
                        },
                        {
                            id: 'ce2',
                            path: ['ce2'],
                            component: CeTwo,
                        },
                        {
                            id: 'ce3',
                            path: ['ce3'],
                            component: CeThree,
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<span id="history">${history}</span><au-viewport></au-viewport>' }),
                __param(0, IHistory),
                __param(1, IRouterEvents),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, historyStrategy: 'push', registrations: [getLocationChangeHandlerRegistration()] });
            const platform = container.get(IPlatform);
            const dwQueue = platform.domWriteQueue;
            await dwQueue.yield();
            const historyEl = host.querySelector('#history');
            const vp = host.querySelector('au-viewport');
            const router = container.get(IRouter);
            assert.html.textContent(vp, 'ce1', 'start - component');
            assert.html.textContent(historyEl, '#1 - len: 1 - state: {"au-nav-id":1}', 'start - history');
            await router.load('ce2');
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce2', 'round#2 - component');
            assert.html.textContent(historyEl, '#2 - len: 2 - state: {"au-nav-id":2}', 'round#2 - history');
            await router.load('ce3', { historyStrategy: 'replace' });
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce3', 'round#3 - component');
            assert.html.textContent(historyEl, '#3 - len: 2 - state: {"au-nav-id":3}', 'round#3 - history');
            // going back should load the ce1
            const history = container.get(IHistory);
            const tQueue = platform.taskQueue;
            history.back();
            await tQueue.yield();
            assert.html.textContent(vp, 'ce1', 'back - component');
            await dwQueue.yield();
            assert.html.textContent(historyEl, '#4 - len: 2 - state: {"au-nav-id":4}', 'back - history');
            // going forward should load ce3
            history.forward();
            await tQueue.yield();
            assert.html.textContent(vp, 'ce3', 'forward - component');
            await dwQueue.yield();
            assert.html.textContent(historyEl, '#5 - len: 2 - state: {"au-nav-id":5}', 'forward - history');
            // strategy: none
            await router.load('ce1', { historyStrategy: 'none' });
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce1', 'strategy: none - component');
            assert.html.textContent(historyEl, '#6 - len: 2 - state: {"au-nav-id":5}', 'strategy: none - history');
            await au.stop(true);
        });
        (isNode() ? it.skip : it)('explicit history strategy can be used for individual navigation - configured: replace', async function () {
            let CeThree = class CeThree {
            };
            CeThree = __decorate([
                customElement({ name: 'ce-three', template: 'ce3' })
            ], CeThree);
            let CeTwo = class CeTwo {
            };
            CeTwo = __decorate([
                customElement({ name: 'ce-two', template: 'ce2' })
            ], CeTwo);
            let CeOne = class CeOne {
            };
            CeOne = __decorate([
                customElement({ name: 'ce-one', template: 'ce1' })
            ], CeOne);
            let Root = class Root {
                constructor(history, events) {
                    let i = 0;
                    events.subscribe('au:router:navigation-end', () => {
                        this.history = `#${++i} - len: ${history.length} - state: ${JSON.stringify(history.state)}`;
                    });
                }
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            id: 'ce1',
                            path: ['', 'ce1'],
                            component: CeOne,
                        },
                        {
                            id: 'ce2',
                            path: ['ce2'],
                            component: CeTwo,
                        },
                        {
                            id: 'ce3',
                            path: ['ce3'],
                            component: CeThree,
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<span id="history">${history}</span><au-viewport></au-viewport>' }),
                __param(0, IHistory),
                __param(1, IRouterEvents),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, historyStrategy: 'replace', registrations: [getLocationChangeHandlerRegistration()] });
            const platform = container.get(IPlatform);
            const dwQueue = platform.domWriteQueue;
            await dwQueue.yield();
            const historyEl = host.querySelector('#history');
            const vp = host.querySelector('au-viewport');
            const router = container.get(IRouter);
            assert.html.textContent(vp, 'ce1', 'start - component');
            assert.html.textContent(historyEl, '#1 - len: 1 - state: {"au-nav-id":1}', 'start - history');
            await router.load('ce2');
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce2', 'round#2 - component');
            assert.html.textContent(historyEl, '#2 - len: 1 - state: {"au-nav-id":2}', 'round#2 - history');
            await router.load('ce3', { historyStrategy: 'push' });
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce3', 'round#3 - component');
            assert.html.textContent(historyEl, '#3 - len: 2 - state: {"au-nav-id":3}', 'round#3 - history');
            // going back should load the ce2
            const history = container.get(IHistory);
            const tQueue = platform.taskQueue;
            history.back();
            await tQueue.yield();
            assert.html.textContent(vp, 'ce2', 'back - component');
            await dwQueue.yield();
            assert.html.textContent(historyEl, '#4 - len: 2 - state: {"au-nav-id":4}', 'back - history');
            // going forward should load ce3
            history.forward();
            await tQueue.yield();
            assert.html.textContent(vp, 'ce3', 'forward - component');
            await dwQueue.yield();
            assert.html.textContent(historyEl, '#5 - len: 2 - state: {"au-nav-id":5}', 'forward - history');
            // strategy: none
            await router.load('ce1', { historyStrategy: 'none' });
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce1', 'strategy: none - component');
            assert.html.textContent(historyEl, '#6 - len: 2 - state: {"au-nav-id":5}', 'strategy: none - history');
            await au.stop(true);
        });
        (isNode() ? it.skip : it)('explicit history strategy can be used for individual navigation - configured: none', async function () {
            let CeThree = class CeThree {
            };
            CeThree = __decorate([
                customElement({ name: 'ce-three', template: 'ce3' })
            ], CeThree);
            let CeTwo = class CeTwo {
            };
            CeTwo = __decorate([
                customElement({ name: 'ce-two', template: 'ce2' })
            ], CeTwo);
            let CeOne = class CeOne {
            };
            CeOne = __decorate([
                customElement({ name: 'ce-one', template: 'ce1' })
            ], CeOne);
            let Root = class Root {
                constructor(history, events) {
                    let i = 0;
                    events.subscribe('au:router:navigation-end', () => {
                        this.history = `#${++i} - len: ${history.length} - state: ${JSON.stringify(history.state)}`;
                    });
                }
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            id: 'ce1',
                            path: ['', 'ce1'],
                            component: CeOne,
                        },
                        {
                            id: 'ce2',
                            path: ['ce2'],
                            component: CeTwo,
                        },
                        {
                            id: 'ce3',
                            path: ['ce3'],
                            component: CeThree,
                        },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<span id="history">${history}</span><au-viewport></au-viewport>' }),
                __param(0, IHistory),
                __param(1, IRouterEvents),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, historyStrategy: 'none', registrations: [getLocationChangeHandlerRegistration()] });
            const platform = container.get(IPlatform);
            const dwQueue = platform.domWriteQueue;
            await dwQueue.yield();
            const historyEl = host.querySelector('#history');
            const vp = host.querySelector('au-viewport');
            const router = container.get(IRouter);
            assert.html.textContent(vp, 'ce1', 'start - component');
            assert.html.textContent(historyEl, '#1 - len: 1 - state: {"au-nav-id":1}', 'start - history');
            await router.load('ce2');
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce2', 'round#2 - component');
            assert.html.textContent(historyEl, '#2 - len: 1 - state: {"au-nav-id":1}', 'round#2 - history');
            await router.load('ce3', { historyStrategy: 'push' });
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce3', 'round#3 - component');
            assert.html.textContent(historyEl, '#3 - len: 2 - state: {"au-nav-id":3}', 'round#3 - history');
            // going back should load the ce1
            const history = container.get(IHistory);
            const tQueue = platform.taskQueue;
            history.back();
            await tQueue.yield();
            assert.html.textContent(vp, 'ce1', 'back - component');
            await dwQueue.yield();
            assert.html.textContent(historyEl, '#4 - len: 2 - state: {"au-nav-id":4}', 'back - history');
            // going forward should load ce3
            history.forward();
            await tQueue.yield();
            assert.html.textContent(vp, 'ce3', 'forward - component');
            await dwQueue.yield();
            assert.html.textContent(historyEl, '#5 - len: 2 - state: {"au-nav-id":5}', 'forward - history');
            await router.load('ce2', { historyStrategy: 'replace' });
            await dwQueue.yield();
            assert.html.textContent(vp, 'ce2', 'round#4 - component');
            assert.html.textContent(historyEl, '#6 - len: 2 - state: {"au-nav-id":6}', 'round#4 - history');
            await au.stop(true);
        });
    });
    it('navigate repeatedly to parent route from child route works - GH 1701', async function () {
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'c-1', template: 'c1 <a load="../c2"></a>' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'c-2', template: 'c2 <a load="route: p; context.bind: null"></a>' })
        ], C2);
        let P1 = class P1 {
        };
        P1 = __decorate([
            route({
                routes: [
                    { path: '', component: C1 },
                    { path: 'c2', component: C2 },
                ]
            }),
            customElement({ name: 'p-1', template: '<au-viewport></au-viewport>' })
        ], P1);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: '', redirectTo: 'p' },
                    { path: 'p', component: P1 },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const queue = container.get(IPlatform).taskQueue;
        assert.html.textContent(host, 'c1', 'initial');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'c2', 'round#1 of loading c2');
        host.querySelector('a').click(); // <- go to parent #1
        await queue.yield();
        // round#2
        assert.html.textContent(host, 'c1', 'navigate to parent from c2 #1');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'c2', 'round#2 of loading c2');
        host.querySelector('a').click(); // <- go to parent #2
        await queue.yield();
        // round#3
        assert.html.textContent(host, 'c1', 'navigate to parent from c2 #2');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'c2', 'round#3 of loading c2');
        host.querySelector('a').click(); // <- go to parent #3
        await queue.yield();
        assert.html.textContent(host, 'c1', 'navigate to parent from c2 #3');
        await au.stop(true);
    });
    describe('multiple configurations for same component', function () {
        it('multiple configurations for the same component under the same parent', async function () {
            var C1_1;
            let C1 = C1_1 = class C1 {
                constructor() {
                    this.id = ++C1_1.id;
                }
                loading(_params, next, _current) {
                    this.data = next.data;
                }
            };
            C1.id = 0;
            C1 = C1_1 = __decorate([
                customElement({ name: 'c-1', template: 'c1 ${id}' })
            ], C1);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: '', component: C1, title: 't1', data: { foo: 'bar' } },
                        { path: 'c1/:id', component: C1, title: 't2', data: { awesome: 'possum' } },
                    ],
                    transitionPlan: 'replace'
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, host, container } = await start({ appRoot: Root });
            const doc = container.get(IPlatform).document;
            const router = container.get(IRouter);
            assert.html.textContent(host, 'c1 1');
            assert.strictEqual(doc.title, 't1');
            let ce = CustomElement.for(host.querySelector('c-1')).viewModel;
            assert.deepStrictEqual(ce.data, { foo: 'bar' });
            await router.load('c1/1');
            assert.html.textContent(host, 'c1 2');
            assert.strictEqual(doc.title, 't2');
            ce = CustomElement.for(host.querySelector('c-1')).viewModel;
            assert.deepStrictEqual(ce.data, { awesome: 'possum' });
            await au.stop(true);
        });
        it('same component is added under different parents', async function () {
            let C1 = class C1 {
                loading(_params, next, _current) {
                    this.data = next.data;
                }
            };
            C1 = __decorate([
                customElement({ name: 'c-1', template: 'c1' })
            ], C1);
            let P1 = class P1 {
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: '', component: C1, title: 'p1c1', data: { foo: 'bar' } }
                    ]
                }),
                customElement({ name: 'p-1', template: '<au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
            };
            P2 = __decorate([
                route({
                    routes: [
                        { path: '', component: C1, title: 'p2c1', data: { awesome: 'possum' } }
                    ]
                }),
                customElement({ name: 'p-2', template: '<au-viewport></au-viewport>' })
            ], P2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'p1'], component: P1 },
                        { path: 'p2', component: P2 },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, host, container } = await start({ appRoot: Root });
            const doc = container.get(IPlatform).document;
            const router = container.get(IRouter);
            assert.html.textContent(host, 'c1');
            assert.strictEqual(doc.title, 'p1c1');
            let ce = CustomElement.for(host.querySelector('c-1')).viewModel;
            assert.deepStrictEqual(ce.data, { foo: 'bar' });
            await router.load('p2');
            assert.html.textContent(host, 'c1');
            assert.strictEqual(doc.title, 'p2c1');
            ce = CustomElement.for(host.querySelector('c-1')).viewModel;
            assert.deepStrictEqual(ce.data, { awesome: 'possum' });
            await au.stop(true);
        });
        for (const config of ['c1', { path: 'c1' }]) {
            it(`component defines its own path - with redirect - config: ${JSON.stringify(config)}`, async function () {
                let C1 = class C1 {
                    constructor(ctx) {
                        this.parent = ctx.parent.component.name;
                    }
                };
                C1 = __decorate([
                    route(config),
                    customElement({ name: 'c-1', template: '${parent}/c1' }),
                    __param(0, IRouteContext),
                    __metadata("design:paramtypes", [Object])
                ], C1);
                let P1 = class P1 {
                };
                P1 = __decorate([
                    route({
                        routes: [
                            { path: '', redirectTo: 'c1' },
                            C1,
                        ]
                    }),
                    customElement({ name: 'p-1', template: '<au-viewport></au-viewport>' })
                ], P1);
                let P2 = class P2 {
                };
                P2 = __decorate([
                    route({
                        routes: [
                            { path: '', redirectTo: 'c1' },
                            C1,
                        ]
                    }),
                    customElement({ name: 'p-2', template: '<au-viewport></au-viewport>' })
                ], P2);
                let Root = class Root {
                };
                Root = __decorate([
                    route({
                        routes: [
                            { path: ['', 'p1'], component: P1 },
                            { path: 'p2', component: P2 },
                        ]
                    }),
                    customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
                ], Root);
                const { au, host, container } = await start({ appRoot: Root });
                const router = container.get(IRouter);
                assert.html.textContent(host, 'p-1/c1');
                await router.load('p2');
                assert.html.textContent(host, 'p-2/c1');
                await au.stop(true);
            });
            it(`component defines its own path - without redirect - config: ${JSON.stringify(config)}`, async function () {
                let C1 = class C1 {
                    constructor(ctx) {
                        this.parent = ctx.parent.component.name;
                    }
                };
                C1 = __decorate([
                    route(config),
                    customElement({ name: 'c-1', template: '${parent}/c1' }),
                    __param(0, IRouteContext),
                    __metadata("design:paramtypes", [Object])
                ], C1);
                let P1 = class P1 {
                };
                P1 = __decorate([
                    route({
                        routes: [
                            C1,
                        ]
                    }),
                    customElement({ name: 'p-1', template: '<au-viewport></au-viewport>' })
                ], P1);
                let P2 = class P2 {
                };
                P2 = __decorate([
                    route({
                        routes: [
                            C1,
                        ]
                    }),
                    customElement({ name: 'p-2', template: '<au-viewport></au-viewport>' })
                ], P2);
                let Root = class Root {
                };
                Root = __decorate([
                    route({
                        routes: [
                            { path: ['', 'p1'], component: P1 },
                            { path: 'p2', component: P2 },
                        ]
                    }),
                    customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
                ], Root);
                const { au, host, container } = await start({ appRoot: Root });
                const router = container.get(IRouter);
                await router.load('p1/c1');
                assert.html.textContent(host, 'p-1/c1');
                await router.load('p2/c1');
                assert.html.textContent(host, 'p-2/c1');
                await au.stop(true);
            });
        }
        it(`component defines transition plan - parent overloads`, async function () {
            var C1_2;
            let C1 = C1_2 = class C1 {
                constructor(ctx) {
                    this.instanceId = ++C1_2.instanceId;
                    this.activationId = 0;
                    this.parent = ctx.parent.component.name;
                }
                canLoad(params) {
                    this.activationId = ++C1_2.activationId;
                    this.routeId = params.id;
                    return true;
                }
            };
            C1.instanceId = 0;
            C1.activationId = 0;
            C1 = C1_2 = __decorate([
                route({ path: 'c1/:id', transitionPlan: 'replace' }),
                customElement({ name: 'c-1', template: '${parent}/c1 - ${routeId} - ${instanceId} - ${activationId}' }),
                __param(0, IRouteContext),
                __metadata("design:paramtypes", [Object])
            ], C1);
            let P1 = class P1 {
            };
            P1 = __decorate([
                route({
                    routes: [
                        C1,
                    ]
                }),
                customElement({ name: 'p-1', template: '<au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
            };
            P2 = __decorate([
                route({
                    routes: [
                        { component: C1, transitionPlan: 'invoke-lifecycles' },
                    ]
                }),
                customElement({ name: 'p-2', template: '<au-viewport></au-viewport>' })
            ], P2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'p1'], component: P1 },
                        { path: 'p2', component: P2 },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, host, container } = await start({ appRoot: Root });
            const router = container.get(IRouter);
            await router.load('p1/c1/42');
            assert.html.textContent(host, 'p-1/c1 - 42 - 1 - 1');
            await router.load('p1/c1/24');
            assert.html.textContent(host, 'p-1/c1 - 24 - 2 - 2');
            await router.load('p2/c1/42');
            assert.html.textContent(host, 'p-2/c1 - 42 - 3 - 3');
            await router.load('p2/c1/24');
            await container.get(IPlatform).domWriteQueue.yield();
            assert.html.textContent(host, 'p-2/c1 - 24 - 3 - 4');
            await au.stop(true);
        });
        it('distributed configuration', async function () {
            let C1 = class C1 {
                constructor(ctx) {
                    this.parent = ctx.parent.component.name;
                }
            };
            C1 = __decorate([
                route('c1'),
                customElement({ name: 'c-1', template: '${parent}/c1' }),
                __param(0, IRouteContext),
                __metadata("design:paramtypes", [Object])
            ], C1);
            let P1 = class P1 {
                getRouteConfig(_parentConfig, _routeNode) {
                    return {
                        routes: [C1]
                    };
                }
            };
            P1 = __decorate([
                route('p1'),
                customElement({ name: 'p-1', template: '<au-viewport></au-viewport>' })
            ], P1);
            let P2 = class P2 {
                getRouteConfig(_parentConfig, _routeNode) {
                    return {
                        routes: [C1]
                    };
                }
            };
            P2 = __decorate([
                route('p2'),
                customElement({ name: 'p-2', template: '<au-viewport></au-viewport>' })
            ], P2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        P1,
                        P2,
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, host, container } = await start({ appRoot: Root });
            const router = container.get(IRouter);
            await router.load('p1/c1');
            assert.html.textContent(host, 'p-1/c1');
            await router.load('p2/c1');
            assert.html.textContent(host, 'p-2/c1');
            await au.stop(true);
        });
    });
    describe('custom element aliases as routing instruction', function () {
        it('using the aliases as path works', async function () {
            let C1 = class C1 {
            };
            C1 = __decorate([
                customElement({ name: 'c-1', template: 'c1', aliases: ['c-a', 'c-one'] })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                customElement({ name: 'c-2', template: 'c2', aliases: ['c-b', 'c-two'] })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [C1, C2]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root });
            const router = container.get(IRouter);
            assert.html.textContent(host, '');
            await router.load('c-a');
            assert.html.textContent(host, 'c1');
            await router.load('c-b');
            assert.html.textContent(host, 'c2');
            await router.load('c-1');
            assert.html.textContent(host, 'c1');
            await router.load('c-2');
            assert.html.textContent(host, 'c2');
            await router.load('c-one');
            assert.html.textContent(host, 'c1');
            await router.load('c-two');
            assert.html.textContent(host, 'c2');
            await au.stop();
        });
        it('order of route decorator and the customElement decorator does not matter', async function () {
            let C1 = class C1 {
            };
            C1 = __decorate([
                route({ title: 'c1' }),
                customElement({ name: 'c-1', template: 'c1', aliases: ['c-a', 'c-one'] })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                customElement({ name: 'c-2', template: 'c2', aliases: ['c-b', 'c-two'] }),
                route({ title: 'c2' })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [C1, C2]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root });
            const router = container.get(IRouter);
            const doc = container.get(IPlatform).document;
            assert.html.textContent(host, '');
            await router.load('c-a');
            assert.html.textContent(host, 'c1');
            assert.strictEqual(doc.title, 'c1');
            await router.load('c-b');
            assert.html.textContent(host, 'c2');
            assert.strictEqual(doc.title, 'c2');
            await router.load('c-1');
            assert.html.textContent(host, 'c1');
            assert.strictEqual(doc.title, 'c1');
            await router.load('c-2');
            assert.html.textContent(host, 'c2');
            assert.strictEqual(doc.title, 'c2');
            await router.load('c-one');
            assert.html.textContent(host, 'c1');
            assert.strictEqual(doc.title, 'c1');
            await router.load('c-two');
            assert.html.textContent(host, 'c2');
            assert.strictEqual(doc.title, 'c2');
            await au.stop();
        });
        it('explicitly defined paths always override CE name or aliases', async function () {
            let C1 = class C1 {
            };
            C1 = __decorate([
                route('c1'),
                customElement({ name: 'c-1', template: 'c1', aliases: ['c-a'] })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                customElement({ name: 'c-2', template: 'c2', aliases: ['c-b'] })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [C1, { path: 'c2', component: C2 }]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root });
            const router = container.get(IRouter);
            assert.html.textContent(host, '');
            await router.load('c1');
            assert.html.textContent(host, 'c1');
            await router.load('c2');
            assert.html.textContent(host, 'c2');
            try {
                await router.load('c-1');
                assert.fail('expected error 1');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+c-1/);
            }
            try {
                await router.load('c-a');
                assert.fail('expected error 2');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+c-a/);
            }
            try {
                await router.load('c-2');
                assert.fail('expected error 3');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+c-2/);
            }
            try {
                await router.load('c-b');
                assert.fail('expected error 4');
            }
            catch (er) {
                assert.match(er.message, /AUR3401.+c-b/);
            }
            await au.stop();
        });
    });
    it('local dependencies of the routed view model works', async function () {
        let C11 = class C11 {
        };
        C11 = __decorate([
            customElement({ name: 'c-11', template: 'c11' })
        ], C11);
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'c-1', template: 'c1 <c-11></c-11>', dependencies: [C11] })
        ], C1);
        let C21 = class C21 {
        };
        C21 = __decorate([
            customElement({ name: 'c-21', template: 'c21' })
        ], C21);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'c-2', template: 'c2 <c-21></c-21>', dependencies: [C21] })
        ], C2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'c1', component: C1 },
                    { path: 'c2', component: C2 },
                ]
            }),
            customElement({ name: 'root', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assert.html.textContent(host, '');
        await router.load('c1');
        assert.html.textContent(host, 'c1 c11');
        await router.load('c2');
        assert.html.textContent(host, 'c2 c21');
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    // use-case: master page
    it('custom element containing au-viewport works', async function () {
        let MasterPage = class MasterPage {
        };
        MasterPage = __decorate([
            customElement({ name: 'master-page', template: 'mp <au-viewport></au-viewport>' })
        ], MasterPage);
        let C1 = class C1 {
        };
        C1 = __decorate([
            customElement({ name: 'c-1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            customElement({ name: 'c-2', template: 'c2' })
        ], C2);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: 'c1', component: C1 },
                    { path: 'c2', component: C2 },
                ]
            }),
            customElement({ name: 'root', template: '<master-page></master-page>' })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [MasterPage] });
        const router = container.get(IRouter);
        assert.html.textContent(host, 'mp');
        await router.load('c1');
        assert.html.textContent(host, 'mp c1');
        await router.load('c2');
        assert.html.textContent(host, 'mp c2');
        await au.stop(true);
        assert.areTaskQueuesEmpty();
    });
    it('Alias registrations work', async function () {
        let C1 = class C1 {
            constructor(router, routerOptions, ctx, ictx) {
                this.router = router;
                this.routerOptions = routerOptions;
                this.ctx = ctx;
                this.ictx = ictx;
            }
        };
        C1 = __decorate([
            route(''),
            inject(Router, RouterOptions, RouteContext),
            customElement({ name: 'c-1', template: 'c1' }),
            __param(3, IRouteContext),
            __metadata("design:paramtypes", [Router,
                RouterOptions,
                RouteContext, Object])
        ], C1);
        let Root = class Root {
            constructor(router, routerOptions) {
                this.router = router;
                this.routerOptions = routerOptions;
            }
        };
        Root = __decorate([
            route({ routes: [C1] }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' }),
            __param(0, IRouter),
            __param(1, IRouterOptions),
            __metadata("design:paramtypes", [Object, Object])
        ], Root);
        const { au, host, container, rootVm } = await start({ appRoot: Root });
        assert.html.textContent(host, 'c1');
        const c1vm = CustomElement.for(host.querySelector('c-1')).viewModel;
        const router = container.get(IRouter);
        assert.strictEqual(Object.is(router, rootVm.router), true, 'router != root Router');
        assert.strictEqual(Object.is(router, c1vm.router), true, 'router != c1 router');
        const routerOptions = container.get(IRouterOptions);
        assert.strictEqual(Object.is(routerOptions, rootVm.routerOptions), true, 'options != root options');
        assert.strictEqual(Object.is(routerOptions, c1vm.routerOptions), true, 'options != c1 options');
        assert.strictEqual(Object.is(c1vm.ctx, c1vm.ictx), true, 'RouteCtx != IRouteCtx');
        await au.stop(true);
    });
    it('supports routing instruction with parenthesized parameters', async function () {
        let C1 = class C1 {
            loading(params, _next, _current) {
                this.id1 = params.id1;
                this.id2 = params.id2;
            }
        };
        C1 = __decorate([
            route('c1/:id1/:id2?'),
            customElement({ name: 'c-1', template: 'c1 ${id1} ${id2}' })
        ], C1);
        let Root = class Root {
        };
        Root = __decorate([
            route({ routes: [{ id: 'c1', component: C1 }] }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root });
        const router = container.get(Router);
        assert.html.textContent(host, '', 'init');
        await router.load('c1(id1=1)');
        assert.html.textContent(host, 'c1 1', 'round#1');
        await router.load('c1(id1=2,id2=3)');
        assert.html.textContent(host, 'c1 2 3', 'round#2');
        await au.stop(true);
    });
    it('self-referencing routing configuration', async function () {
        var P1_1;
        let C1 = class C1 {
        };
        C1 = __decorate([
            route(''),
            customElement({ name: 'c-1', template: 'c1' })
        ], C1);
        let C2 = class C2 {
        };
        C2 = __decorate([
            route('c2'),
            customElement({ name: 'c-2', template: 'c2' })
        ], C2);
        let P1 = P1_1 = class P1 {
            getRouteConfig(_parentConfig, _routeNode) {
                return {
                    routes: [
                        C1,
                        C2,
                        P1_1,
                    ]
                };
            }
        };
        P1 = P1_1 = __decorate([
            customElement({ name: 'p-1', template: 'p1 <au-viewport></au-viewport>', aliases: ['p1'] })
        ], P1);
        let Root = class Root {
        };
        Root = __decorate([
            route({ routes: [{ path: ['', 'p1'], component: P1 }] }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assert.html.textContent(host, 'p1 c1', 'init');
        await router.load('p1/p1');
        assert.html.textContent(host, 'p1 p1 c1', 'round#1');
        await router.load('p1/p1/p1/c2');
        assert.html.textContent(host, 'p1 p1 p1 c2', 'round#2');
        await au.stop(true);
    });
    it('handles slash in router parameter value', async function () {
        let CeOne = class CeOne {
            loading(params, _next, _current) {
                this.id = params.id;
            }
        };
        CeOne = __decorate([
            customElement({ name: 'c-1', template: 'c1 ${id}' })
        ], CeOne);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'c1', path: 'c1/:id', component: CeOne },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { container, host, au } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        const location = container.get(ILocation);
        assert.html.textContent(host, '');
        await router.load('c1/abc%2Fdef');
        assert.html.textContent(host, 'c1 abc/def');
        assert.match(location.path, /c1\/abc%2Fdef$/);
        await router.load({ component: 'c1', params: { id: '123/456' } });
        assert.html.textContent(host, 'c1 123/456');
        assert.match(location.path, /c1\/123%2F456$/);
        await au.stop(true);
    });
    it('handles slash in router parameter name', async function () {
        let CeOne = class CeOne {
            loading(params, _next, _current) {
                this.id = params['foo%2Fbar'];
            }
        };
        CeOne = __decorate([
            customElement({ name: 'c-1', template: 'c1 ${id}' })
        ], CeOne);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'c1', path: 'c1/:foo%2Fbar', component: CeOne },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { container, host, au } = await start({ appRoot: Root });
        const router = container.get(IRouter);
        assert.html.textContent(host, '');
        await router.load('c1(foo%2Fbar=fizzbuzz)');
        assert.html.textContent(host, 'c1 fizzbuzz');
        await router.load({ component: 'c1', params: { 'foo%2Fbar': 'awesome possum' } });
        assert.html.textContent(host, 'c1 awesome possum');
        await au.stop(true);
    });
});
//# sourceMappingURL=smoke-tests.spec.js.map