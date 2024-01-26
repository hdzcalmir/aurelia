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
import { Aurelia, CustomElement, customElement } from '@aurelia/runtime-html';
import { IRouter, route, Route, RouterConfiguration } from '@aurelia/router-lite';
import { assert, TestContext } from '@aurelia/testing';
import { IHookInvocationAggregator } from './_shared/hook-invocation-tracker.js';
import { HookSpecs, TestRouteViewModelBase } from './_shared/view-models.js';
import { hookSpecsMap, verifyInvocationsEqual } from './_shared/hook-spec.js';
import { createFixture, IActivityTracker } from './_shared/create-fixture.js';
import { LogLevel } from '@aurelia/kernel';
import { TestRouterConfiguration } from './_shared/configuration.js';
function vp(count) {
    if (count === 1) {
        return `<au-viewport></au-viewport>`;
    }
    let template = '';
    for (let i = 0; i < count; ++i) {
        template = `${template}<au-viewport name="$${i}"></au-viewport>`;
    }
    return template;
}
function getDefaultHIAConfig() {
    return {
        resolveTimeoutMs: 100,
        resolveLabels: [],
    };
}
export function* prepend(prefix, component, ...calls) {
    for (const call of calls) {
        if (call === '') {
            yield '';
        }
        else {
            yield `${prefix}.${component}.${call}`;
        }
    }
}
export function* interleave(...generators) {
    while (generators.length > 0) {
        for (let i = 0, ii = generators.length; i < ii; ++i) {
            const gen = generators[i];
            const next = gen.next();
            if (next.done) {
                generators.splice(i, 1);
                --i;
                --ii;
            }
            else {
                const value = next.value;
                if (value) {
                    yield value;
                }
            }
        }
    }
}
let SimpleActivityTrackingVMBase = class SimpleActivityTrackingVMBase {
    constructor(tracker) {
        this.tracker = tracker;
    }
    attached() {
        this.tracker.setActive(this.$controller.definition.name);
    }
    setNonActive() {
        this.tracker.setActive(this.$controller.definition.name);
    }
};
SimpleActivityTrackingVMBase = __decorate([
    __param(0, IActivityTracker),
    __metadata("design:paramtypes", [Object])
], SimpleActivityTrackingVMBase);
export { SimpleActivityTrackingVMBase };
describe('router-lite/config-tests.spec.ts', function () {
    describe('monomorphic timings', function () {
        const componentSpecs = [
            {
                kind: 'all-sync',
                hookSpecs: HookSpecs.create({
                    binding: hookSpecsMap.binding.sync,
                    bound: hookSpecsMap.bound.sync,
                    attaching: hookSpecsMap.attaching.sync,
                    attached: hookSpecsMap.attached.sync,
                    detaching: hookSpecsMap.detaching.sync,
                    unbinding: hookSpecsMap.unbinding.sync,
                    canLoad: hookSpecsMap.canLoad.sync,
                    loading: hookSpecsMap.loading.sync,
                    canUnload: hookSpecsMap.canUnload.sync,
                    unloading: hookSpecsMap.unloading.sync,
                }),
            },
            {
                kind: 'all-async',
                hookSpecs: getAllAsyncSpecs(1),
            },
        ];
        for (const componentSpec of componentSpecs) {
            const { kind, hookSpecs } = componentSpec;
            let A01 = class A01 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A01 = __decorate([
                customElement({ name: 'a01', template: null }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A01);
            let A02 = class A02 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A02 = __decorate([
                customElement({ name: 'a02', template: null }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A02);
            let A03 = class A03 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A03 = __decorate([
                customElement({ name: 'a03', template: null }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A03);
            let A04 = class A04 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A04 = __decorate([
                customElement({ name: 'a04', template: null }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A04);
            const A0 = [A01, A02, A03, A04];
            let Root1 = class Root1 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            Root1 = __decorate([
                customElement({ name: 'root1', template: vp(1) })
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ,
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], Root1);
            let A11 = class A11 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A11 = __decorate([
                customElement({ name: 'a11', template: vp(1) }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A11);
            let A12 = class A12 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A12 = __decorate([
                customElement({ name: 'a12', template: vp(1) }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A12);
            let A13 = class A13 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A13 = __decorate([
                customElement({ name: 'a13', template: vp(1) }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A13);
            let A14 = class A14 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A14 = __decorate([
                customElement({ name: 'a14', template: vp(1) }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A14);
            const A1 = [A11, A12, A13, A14];
            let Root2 = class Root2 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            Root2 = __decorate([
                customElement({ name: 'root2', template: vp(2) }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], Root2);
            let A21 = class A21 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A21 = __decorate([
                customElement({ name: 'a21', template: vp(2) }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A21);
            let A22 = class A22 extends TestRouteViewModelBase {
                constructor(hia) { super(hia, hookSpecs); }
            };
            A22 = __decorate([
                customElement({ name: 'a22', template: vp(2) }),
                __param(0, IHookInvocationAggregator),
                __metadata("design:paramtypes", [Object])
            ], A22);
            const A2 = [A21, A22];
            const A = [...A0, ...A1, ...A2];
            describe(`componentSpec.kind:'${kind}'`, function () {
                describe('single', function () {
                    function runTest(spec) {
                        const { t1: [t1, t1c], t2: [t2, t2c], t3: [t3, t3c], t4: [t4, t4c] } = spec;
                        spec.configure();
                        it(`'${t1}' -> '${t2}' -> '${t3}' -> '${t4}'`, async function () {
                            const { router, hia, tearDown } = await createFixture(Root2, A, getDefaultHIAConfig);
                            const phase1 = `('' -> '${t1}')#1`;
                            const phase2 = `('${t1}' -> '${t2}')#2`;
                            const phase3 = `('${t2}' -> '${t3}')#3`;
                            const phase4 = `('${t3}' -> '${t4}')#4`;
                            hia.setPhase(phase1);
                            await router.load(t1);
                            hia.setPhase(phase2);
                            await router.load(t2);
                            hia.setPhase(phase3);
                            await router.load(t3);
                            hia.setPhase(phase4);
                            await router.load(t4);
                            await tearDown();
                            const expected = [...(function* () {
                                    yield `start.root2.binding`;
                                    yield `start.root2.bound`;
                                    yield `start.root2.attaching`;
                                    yield `start.root2.attached`;
                                    yield* prepend(phase1, t1c, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                    for (const [phase, { $t1c, $t2c }] of [
                                        [phase2, { $t1c: t1c, $t2c: t2c }],
                                        [phase3, { $t1c: t2c, $t2c: t3c }],
                                        [phase4, { $t1c: t3c, $t2c: t4c }],
                                    ]) {
                                        yield `${phase}.${$t1c}.canUnload`;
                                        yield `${phase}.${$t2c}.canLoad`;
                                        yield `${phase}.${$t1c}.unloading`;
                                        yield `${phase}.${$t2c}.loading`;
                                        yield* prepend(phase, $t1c, 'detaching', 'unbinding', 'dispose');
                                        yield* prepend(phase, $t2c, 'binding', 'bound', 'attaching', 'attached');
                                    }
                                    yield `stop.${t4c}.detaching`;
                                    yield `stop.root2.detaching`;
                                    yield `stop.${t4c}.unbinding`;
                                    yield `stop.root2.unbinding`;
                                    yield `stop.root2.dispose`;
                                    yield `stop.${t4c}.dispose`;
                                })()];
                            verifyInvocationsEqual(hia.notifyHistory, expected);
                            hia.dispose();
                        });
                    }
                    const specs = [
                        {
                            t1: ['1', 'a01'],
                            t2: ['2', 'a02'],
                            t3: ['1', 'a01'],
                            t4: ['2', 'a02'],
                            configure() {
                                Route.configure({
                                    routes: [
                                        {
                                            path: '1',
                                            component: A01,
                                        },
                                        {
                                            path: '2',
                                            component: A02,
                                        },
                                    ],
                                }, Root2);
                            },
                        },
                    ];
                    for (const spec of specs) {
                        runTest(spec);
                    }
                });
            });
        }
    });
    for (const inDependencies of [true, false]) {
        describe(`inDependencies: ${inDependencies}`, function () {
            it(`can load a configured child route with direct path and explicit component`, async function () {
                let A01 = class A01 extends SimpleActivityTrackingVMBase {
                };
                A01 = __decorate([
                    customElement({ name: 'a01', template: null })
                ], A01);
                let Root = class Root extends SimpleActivityTrackingVMBase {
                };
                Root = __decorate([
                    route({ routes: [{ path: 'a', component: A01 }] }),
                    customElement({ name: 'root', template: vp(1), dependencies: inDependencies ? [A01] : [] })
                ], Root);
                const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig);
                await router.load('a');
                verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
            });
            it(`can load a configured child route with indirect path and explicit component`, async function () {
                let A01 = class A01 extends SimpleActivityTrackingVMBase {
                };
                A01 = __decorate([
                    route({ path: 'a' }),
                    customElement({ name: 'a01', template: null })
                ], A01);
                let Root = class Root extends SimpleActivityTrackingVMBase {
                };
                Root = __decorate([
                    route({ routes: [A01] }),
                    customElement({ name: 'root', template: vp(1), dependencies: inDependencies ? [A01] : [] })
                ], Root);
                const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig);
                await router.load('a');
                verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
            });
        });
    }
    it(`can load a configured child route by name`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [A01] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig);
        await router.load('a01');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
    });
    it(`works with single multi segment static path`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [{ path: 'a/x', component: A01 }] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
    });
    it(`works with single multi segment dynamic path`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [{ path: 'a/:x', component: A01 }] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/1');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
    });
    it(`works with single multi segment static path with single child`, async function () {
        let B01 = class B01 extends SimpleActivityTrackingVMBase {
        };
        B01 = __decorate([
            customElement({ name: 'b01', template: null })
        ], B01);
        let A11 = class A11 extends SimpleActivityTrackingVMBase {
        };
        A11 = __decorate([
            route({ routes: [{ path: 'b', component: B01 }] }),
            customElement({ name: 'a11', template: vp(1) })
        ], A11);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [{ path: 'a/x', component: A11 }] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/x/b');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a11', 'b01']);
    });
    it(`works with single multi segment static path with single multi segment static child`, async function () {
        let B01 = class B01 extends SimpleActivityTrackingVMBase {
        };
        B01 = __decorate([
            customElement({ name: 'b01', template: null })
        ], B01);
        let A11 = class A11 extends SimpleActivityTrackingVMBase {
        };
        A11 = __decorate([
            route({ routes: [{ path: 'b/x', component: B01 }] }),
            customElement({ name: 'a11', template: vp(1) })
        ], A11);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [{ path: 'a/x', component: A11 }] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/x/b/x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a11', 'b01']);
    });
    it(`works with single static path with single multi segment static child`, async function () {
        let B01 = class B01 extends SimpleActivityTrackingVMBase {
        };
        B01 = __decorate([
            customElement({ name: 'b01', template: null })
        ], B01);
        let A11 = class A11 extends SimpleActivityTrackingVMBase {
        };
        A11 = __decorate([
            route({ routes: [{ path: 'b/x', component: B01 }] }),
            customElement({ name: 'a11', template: vp(1) })
        ], A11);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [{ path: 'a', component: A11 }] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/b/x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a11', 'b01']);
    });
    it(`works with single empty static path redirect`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [{ path: '', redirectTo: 'a' }, { path: 'a', component: A01 }] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
    });
    it(`works with single static path redirect`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            route({ routes: [{ path: 'x', redirectTo: 'a' }, { path: 'a', component: A01 }] }),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
    });
    describe(`throw error when`, function () {
        it(`load a configured child route with indirect path by name`, async function () {
            let A01 = class A01 extends SimpleActivityTrackingVMBase {
            };
            A01 = __decorate([
                route({ path: 'a' }),
                customElement({ name: 'a01', template: null })
            ], A01);
            let Root = class Root extends SimpleActivityTrackingVMBase {
            };
            Root = __decorate([
                route({ routes: [A01] }),
                customElement({ name: 'root', template: vp(1) })
            ], Root);
            const { router } = await createFixture(Root, [], getDefaultHIAConfig);
            let e = null;
            try {
                await router.load('a01');
            }
            catch (err) {
                e = err;
            }
            assert.notStrictEqual(e, null);
            assert.match(e.message, /AUR3401/);
        });
    });
    it('routes can be configured using the getRouteConfig hook', async function () {
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
        let P = class P {
            constructor() {
                this.getRouteConfigCalled = 0;
            }
            async getRouteConfig(parentDefinition, routeNode) {
                assert.notEqual(parentDefinition, null, 'P parentDefinition');
                assert.notEqual(routeNode, null, 'P routeNode');
                assert.strictEqual(this.getRouteConfigCalled, 0);
                this.getRouteConfigCalled++;
                await new Promise((resolve) => setTimeout(resolve, 10));
                return {
                    routes: [
                        { path: 'c1', component: C1 },
                        { path: 'c2', component: C2 },
                    ]
                };
            }
        };
        P = __decorate([
            customElement({ name: 'ce-p', template: 'p <au-viewport></au-viewport>' })
        ], P);
        let Root = class Root {
            constructor() {
                this.getRouteConfigCalled = 0;
            }
            getRouteConfig(parentDefinition, routeNode) {
                assert.strictEqual(parentDefinition, null, 'root parentDefinition');
                assert.strictEqual(routeNode, null, 'root routeNode');
                assert.strictEqual(this.getRouteConfigCalled, 0);
                this.getRouteConfigCalled++;
                return {
                    routes: [
                        { path: 'p', component: P }
                    ]
                };
            }
        };
        Root = __decorate([
            customElement({ name: 'ro-ot', template: 'root <au-viewport></au-viewport>' })
        ], Root);
        const ctx = TestContext.create();
        const { container } = ctx;
        container.register(TestRouterConfiguration.for(LogLevel.warn), RouterConfiguration, C1, C2, P, Root);
        const au = new Aurelia(container);
        const host = ctx.createElement('div');
        await au.app({ component: Root, host }).start();
        const router = container.get(IRouter);
        await router.load('p/c1');
        assert.html.textContent(host, 'root p c1');
        await router.load('p/c2');
        assert.html.textContent(host, 'root p c2');
        assert.strictEqual(au.root.controller.viewModel.getRouteConfigCalled, 1);
        assert.strictEqual(CustomElement.for(host.querySelector('ce-p')).viewModel.getRouteConfigCalled, 1);
        await au.stop(true);
    });
});
function getAllAsyncSpecs(count) {
    return HookSpecs.create({
        binding: hookSpecsMap.binding.async(count),
        bound: hookSpecsMap.bound.async(count),
        attaching: hookSpecsMap.attaching.async(count),
        attached: hookSpecsMap.attached.async(count),
        detaching: hookSpecsMap.detaching.async(count),
        unbinding: hookSpecsMap.unbinding.async(count),
        canLoad: hookSpecsMap.canLoad.async(count),
        loading: hookSpecsMap.loading.async(count),
        canUnload: hookSpecsMap.canUnload.async(count),
        unloading: hookSpecsMap.unloading.async(count),
    });
}
//# sourceMappingURL=config-tests.spec.js.map