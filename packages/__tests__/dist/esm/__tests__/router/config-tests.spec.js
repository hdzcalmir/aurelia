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
import { customElement } from '@aurelia/runtime-html';
import { route, Routes, routes } from '@aurelia/router';
import { assert } from '@aurelia/testing';
import { IHookInvocationAggregator } from './_shared/hook-invocation-tracker.js';
import { HookSpecs, TestRouteViewModelBase } from './_shared/view-models.js';
import { hookSpecsMap, verifyInvocationsEqual } from './_shared/hook-spec.js';
import { createFixture, IActivityTracker, translateOptions } from './_shared/create-fixture.js';
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
export function* prependDeferrable(prefix, component, deferUntil, ...calls) {
    if (deferUntil === 'none') {
        yield `${prefix}.${component}.canLoad`;
        yield `${prefix}.${component}.loading`;
    }
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
describe('router/config-tests.spec.ts', function () {
    describe('monomorphic timings', function () {
        const deferUntils = [
            'none',
            'load-hooks',
        ];
        const swapStrategies = [
            'parallel-remove-first',
            'sequential-add-first',
            'sequential-remove-first',
        ];
        const routerOptionsSpecs = [];
        for (const deferUntil of deferUntils) {
            for (const swapStrategy of swapStrategies) {
                routerOptionsSpecs.push({
                    deferUntil,
                    swapStrategy,
                    toString() {
                        return `deferUntil:'${deferUntil}',swapStrategy:'${swapStrategy}'`;
                    },
                });
            }
        }
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
                customElement({ name: 'root1', template: vp(1) }),
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
                for (const routerOptionsSpec of routerOptionsSpecs) {
                    const getRouterOptions = () => translateOptions(routerOptionsSpec);
                    describe(`${routerOptionsSpec}`, function () {
                        describe('single', function () {
                            function runTest(spec) {
                                const { t1: [t1, t1c], t2: [t2, t2c], t3: [t3, t3c], t4: [t4, t4c] } = spec;
                                spec.configure();
                                it(`'${t1}' -> '${t2}' -> '${t3}' -> '${t4}'`, async function () {
                                    const { router, hia, host, tearDown } = await createFixture(Root1, A, getDefaultHIAConfig, getRouterOptions);
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
                                            yield `start.root1.binding`;
                                            yield `start.root1.bound`;
                                            yield `start.root1.attaching`;
                                            yield `start.root1.attached`;
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
                                                switch (routerOptionsSpec.swapStrategy) {
                                                    case 'parallel-remove-first':
                                                        switch (componentSpec.kind) {
                                                            case 'all-sync':
                                                                yield* prepend(phase, $t1c, 'detaching', 'unbinding', 'dispose');
                                                                yield* prepend(phase, $t2c, 'binding', 'bound', 'attaching', 'attached');
                                                                break;
                                                            case 'all-async':
                                                                yield* interleave(prepend(phase, $t1c, 'detaching', 'unbinding', '', 'dispose'), prepend(phase, $t2c, 'binding', 'bound', 'attaching', 'attached'));
                                                                break;
                                                        }
                                                        break;
                                                    case 'sequential-remove-first':
                                                        yield* prepend(phase, $t1c, 'detaching', 'unbinding', 'dispose');
                                                        yield* prepend(phase, $t2c, 'binding', 'bound', 'attaching', 'attached');
                                                        break;
                                                    case 'sequential-add-first':
                                                        yield* prepend(phase, $t2c, 'binding', 'bound', 'attaching', 'attached');
                                                        yield* prepend(phase, $t1c, 'detaching', 'unbinding', 'dispose');
                                                        break;
                                                }
                                            }
                                            yield* interleave(prepend('stop', t4c, 'detaching', 'unbinding'), prepend('stop', 'root1', 'detaching', 'unbinding'));
                                            yield* prepend('stop', 'root1', 'dispose');
                                            yield* prepend('stop', t4c, 'dispose');
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
                                        Routes.configure([
                                            {
                                                path: '1',
                                                component: A01,
                                            },
                                            {
                                                path: '2',
                                                component: A02,
                                            },
                                        ], Root1);
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
        }
    });
    for (const inDependencies of [true, false]) {
        describe(`inDependencies: ${inDependencies}`, function () {
            for (const routingMode of ['configured-first', 'configured-only']) {
                describe(`routingMode: '${routingMode}'`, function () {
                    it(`can load a configured child route with direct path and explicit component`, async function () {
                        let A01 = class A01 extends SimpleActivityTrackingVMBase {
                        };
                        A01 = __decorate([
                            customElement({ name: 'a01', template: null })
                        ], A01);
                        let Root = class Root extends SimpleActivityTrackingVMBase {
                        };
                        Root = __decorate([
                            routes([{ path: 'a', component: A01 }]),
                            customElement({ name: 'root', template: vp(1), dependencies: inDependencies ? [A01] : [] })
                        ], Root);
                        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => translateOptions({ routingMode }));
                        await router.load('a');
                        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
                        await tearDown();
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
                            routes([A01]),
                            customElement({ name: 'root', template: vp(1), dependencies: inDependencies ? [A01] : [] })
                        ], Root);
                        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => translateOptions({ routingMode }));
                        await router.load('a');
                        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
                        await tearDown();
                    });
                });
            }
        });
    }
    it(`can load a direct route by name which is listed as a dependency when routingMode is 'configured-first'`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            customElement({ name: 'root', template: vp(1), dependencies: [A01] })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => translateOptions({ routingMode: 'configured-first' }));
        await router.load('a01');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
        await tearDown();
    });
    it(`can load a configured child route by name when routingMode is 'configured-first'`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            routes([A01]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => translateOptions({ routingMode: 'configured-first' }));
        await router.load('a01');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
        await tearDown();
    });
    it(`can load a configured child route by name when routingMode is 'configured-only'`, async function () {
        let A01 = class A01 extends SimpleActivityTrackingVMBase {
        };
        A01 = __decorate([
            customElement({ name: 'a01', template: null })
        ], A01);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            routes([A01]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => translateOptions({ routingMode: 'configured-only' }));
        await router.load('a01');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
        await tearDown();
    });
    it(`can navigate to deep dependencies as long as they are declared`, async function () {
        let C01 = class C01 extends SimpleActivityTrackingVMBase {
        };
        C01 = __decorate([
            customElement({ name: 'c01', template: null })
        ], C01);
        let B11 = class B11 extends SimpleActivityTrackingVMBase {
        };
        B11 = __decorate([
            customElement({ name: 'b11', template: vp(1), dependencies: [C01] })
        ], B11);
        let A11 = class A11 extends SimpleActivityTrackingVMBase {
        };
        A11 = __decorate([
            customElement({ name: 'a11', template: vp(1), dependencies: [B11] })
        ], A11);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            customElement({ name: 'root', template: vp(1), dependencies: [A11] })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a11/b11/c01');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a11', 'b11', 'c01']);
        await tearDown();
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
            routes([{ path: 'a/x', component: A01 }]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
        await tearDown();
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
            routes([{ path: 'a/:x', component: A01 }]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/1');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
        await tearDown();
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
            routes([{ path: 'b', component: B01 }]),
            customElement({ name: 'a11', template: vp(1) })
        ], A11);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            routes([{ path: 'a/x', component: A11 }]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/x/b');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a11', 'b01']);
        await tearDown();
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
            routes([{ path: 'b/x', component: B01 }]),
            customElement({ name: 'a11', template: vp(1) })
        ], A11);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            routes([{ path: 'a/x', component: A11 }]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/x/b/x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a11', 'b01']);
        await tearDown();
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
            routes([{ path: 'b/x', component: B01 }]),
            customElement({ name: 'a11', template: vp(1) })
        ], A11);
        let Root = class Root extends SimpleActivityTrackingVMBase {
        };
        Root = __decorate([
            routes([{ path: 'a', component: A11 }]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('a/b/x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a11', 'b01']);
        await tearDown();
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
            routes([{ path: '', redirectTo: 'a' }, { path: 'a', component: A01 }]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        // '' is loaded automatically when starting router
        // await router.load('');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
        await tearDown();
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
            routes([{ path: 'x', redirectTo: 'a' }, { path: 'a', component: A01 }]),
            customElement({ name: 'root', template: vp(1) })
        ], Root);
        const { router, activityTracker, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, () => ({}));
        await router.load('x');
        verifyInvocationsEqual(activityTracker.activeVMs, ['root', 'a01']);
        await tearDown();
    });
    describe.skip(`throw error when`, function () {
        function getErrorMsg({ routingMode, isRegistered, instruction, parent, parentPath, }) {
            switch (routingMode) {
                case 'configured-first':
                    return `'${instruction}' did not match any configured route or registered component name - did you forget to add the component '${instruction}' to the dependencies or to register it as a global dependency?`;
                // return `'${instruction}' did not match any configured route or registered component name at '${parentPath}' - did you forget to add the component '${instruction}' to the dependencies of '${parent}' or to register it as a global dependency?`;
                case 'configured-only':
                    if (isRegistered) {
                        return `'${instruction}' did not match any configured route, but it does match a registered component name at '${parentPath}' - did you forget to add a @route({ path: '${instruction}' }) decorator to '${instruction}' or unintentionally set routingMode to 'configured-only'?`;
                    }
                    else {
                        return `'${instruction}' did not match any configured route or registered component name at '${parentPath}' - did you forget to add '${instruction}' to the children list of the route decorator of '${parent}'?`;
                    }
            }
        }
        for (const routingMode of ['configured-first', 'configured-only']) {
            // In these cases, whatever fails in 'configured-first' should also fail in 'configured-only',
            // so we could run these with only 'configured-first', but just to make sure we just loop through both modes for all cases.
            describe(`routingMode is '${routingMode}'`, function () {
                const routerOptions = translateOptions({ routingMode });
                const getRouterOptions = () => routerOptions;
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
                        routes([A01]),
                        customElement({ name: 'root', template: vp(1) })
                    ], Root);
                    const { router, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, getRouterOptions);
                    let e = null;
                    try {
                        await router.load('a01');
                    }
                    catch (err) {
                        e = err;
                    }
                    assert.notStrictEqual(e, null);
                    assert.strictEqual(e.message, getErrorMsg({
                        routingMode,
                        isRegistered: false,
                        instruction: 'a01',
                        parent: 'root',
                        parentPath: 'root',
                    }));
                    await tearDown();
                });
                it(`load a direct route by indirect path when listed only as a dependency`, async function () {
                    let A01 = class A01 extends SimpleActivityTrackingVMBase {
                    };
                    A01 = __decorate([
                        route({ path: 'a' }),
                        customElement({ name: 'a01', template: null })
                    ], A01);
                    let Root = class Root extends SimpleActivityTrackingVMBase {
                    };
                    Root = __decorate([
                        customElement({ name: 'root', template: vp(1), dependencies: [A01] })
                    ], Root);
                    const { router, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, getRouterOptions);
                    let e = null;
                    try {
                        await router.load('a');
                    }
                    catch (err) {
                        e = err;
                    }
                    assert.notStrictEqual(e, null);
                    assert.strictEqual(e.message, getErrorMsg({
                        routingMode,
                        isRegistered: false,
                        instruction: 'a',
                        parent: 'root',
                        parentPath: 'root',
                    }));
                    await tearDown();
                });
            });
        }
        describe(`routingMode is 'configured-first'`, function () {
            const routerOptions = translateOptions({ routingMode: 'configured-first' });
            const getRouterOptions = () => routerOptions;
            it(`navigate to deep dependencies that are indirectly circular`, async function () {
                let B11 = class B11 extends SimpleActivityTrackingVMBase {
                };
                B11 = __decorate([
                    customElement({ name: 'b11', template: vp(1) })
                ], B11);
                let A11 = class A11 extends SimpleActivityTrackingVMBase {
                };
                A11 = __decorate([
                    customElement({ name: 'a11', template: vp(1), dependencies: [B11] })
                ], A11);
                let Root = class Root extends SimpleActivityTrackingVMBase {
                };
                Root = __decorate([
                    customElement({ name: 'root', template: vp(1), dependencies: [A11] })
                ], Root);
                const { router, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, getRouterOptions);
                let e = null;
                try {
                    await router.load('a11/b11/a11');
                }
                catch (err) {
                    e = err;
                }
                assert.notStrictEqual(e, null);
                assert.strictEqual(e.message, getErrorMsg({
                    routingMode: 'configured-first',
                    isRegistered: false,
                    instruction: 'a11',
                    parent: 'b11',
                    parentPath: 'root/a11/b11',
                }));
                await tearDown();
            });
        });
        describe(`routingMode is 'configured-only'`, function () {
            const routerOptions = translateOptions({ routingMode: 'configured-only' });
            const getRouterOptions = () => routerOptions;
            it(`load a direct route by name which is listed as a dependency`, async function () {
                let A01 = class A01 extends SimpleActivityTrackingVMBase {
                };
                A01 = __decorate([
                    customElement({ name: 'a01', template: null })
                ], A01);
                let Root = class Root extends SimpleActivityTrackingVMBase {
                };
                Root = __decorate([
                    customElement({ name: 'root', template: vp(1), dependencies: [A01] })
                ], Root);
                const { router, tearDown } = await createFixture(Root, [], getDefaultHIAConfig, getRouterOptions);
                let e = null;
                try {
                    await router.load('a01');
                }
                catch (err) {
                    e = err;
                }
                assert.notStrictEqual(e, null);
                assert.strictEqual(e.message, getErrorMsg({
                    routingMode: 'configured-only',
                    isRegistered: true,
                    instruction: 'a01',
                    parent: 'root',
                    parentPath: 'root',
                }));
                await tearDown();
            });
        });
    });
});
function join(sep, ...parts) {
    return parts.filter(function (x) {
        return x && x.split('@')[0];
    }).join(sep);
}
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