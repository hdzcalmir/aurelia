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
import { DI, ILogConfig, Registration } from '@aurelia/kernel';
import { CustomElement, customElement, IPlatform, Aurelia, } from '@aurelia/runtime-html';
import { IRouter, RouterConfiguration, route, } from '@aurelia/router-lite';
import { assert, TestContext } from '@aurelia/testing';
import { TestRouterConfiguration } from './_shared/configuration.js';
import { isFirefox } from '../util.js';
function join(sep, ...parts) {
    return parts.filter(function (x) {
        return x?.split('@')[0];
    }).join(sep);
}
const hookNames = ['binding', 'bound', 'attaching', 'attached', 'detaching', 'unbinding', 'canLoad', 'loading', 'canUnload', 'unloading'];
class DelayedInvokerFactory {
    constructor(name, ticks) {
        this.name = name;
        this.ticks = ticks;
    }
    create(mgr, p) {
        return new DelayedInvoker(mgr, p, this.name, this.ticks);
    }
    toString() {
        return `${this.name}(${this.ticks})`;
    }
}
export class HookSpecs {
    constructor(binding, bound, attaching, attached, detaching, unbinding, dispose, canLoad, loading, canUnload, unloading, ticks) {
        this.binding = binding;
        this.bound = bound;
        this.attaching = attaching;
        this.attached = attached;
        this.detaching = detaching;
        this.unbinding = unbinding;
        this.dispose = dispose;
        this.canLoad = canLoad;
        this.loading = loading;
        this.canUnload = canUnload;
        this.unloading = unloading;
        this.ticks = ticks;
    }
    static create(ticks, input = {}) {
        return new HookSpecs(input.binding || DelayedInvoker.binding(ticks), input.bound || DelayedInvoker.bound(ticks), input.attaching || DelayedInvoker.attaching(ticks), input.attached || DelayedInvoker.attached(ticks), input.detaching || DelayedInvoker.detaching(ticks), input.unbinding || DelayedInvoker.unbinding(ticks), DelayedInvoker.dispose(), input.canLoad || DelayedInvoker.canLoad(ticks), input.loading || DelayedInvoker.loading(ticks), input.canUnload || DelayedInvoker.canUnload(ticks), input.unloading || DelayedInvoker.unloading(ticks), ticks);
    }
    $dispose() {
        const $this = this;
        $this.binding = void 0;
        $this.bound = void 0;
        $this.attaching = void 0;
        $this.attached = void 0;
        $this.detaching = void 0;
        $this.unbinding = void 0;
        $this.dispose = void 0;
        $this.canLoad = void 0;
        $this.loading = void 0;
        $this.canUnload = void 0;
        $this.unloading = void 0;
    }
    toString(exclude = this.ticks) {
        const strings = [];
        for (const k of hookNames) {
            const factory = this[k];
            if (factory.ticks !== exclude) {
                strings.push(factory.toString());
            }
        }
        return strings.length > 0 ? strings.join(',') : '';
    }
}
class TestVM {
    get name() { return this.$controller.definition.name; }
    constructor(mgr, p, specs) {
        this.bindingDI = specs.binding.create(mgr, p);
        this.boundDI = specs.bound.create(mgr, p);
        this.attachingDI = specs.attaching.create(mgr, p);
        this.attachedDI = specs.attached.create(mgr, p);
        this.detachingDI = specs.detaching.create(mgr, p);
        this.unbindingDI = specs.unbinding.create(mgr, p);
        this.canLoadDI = specs.canLoad.create(mgr, p);
        this.loadDI = specs.loading.create(mgr, p);
        this.canUnloadDI = specs.canUnload.create(mgr, p);
        this.unloadDI = specs.unloading.create(mgr, p);
        this.disposeDI = specs.dispose.create(mgr, p);
    }
    binding(i, p, f) { return this.bindingDI.invoke(this, () => { return this.$binding(i, p, f); }); }
    bound(i, p, f) { return this.boundDI.invoke(this, () => { return this.$bound(i, p, f); }); }
    attaching(i, p, f) { return this.attachingDI.invoke(this, () => { return this.$attaching(i, p, f); }); }
    attached(i, f) { return this.attachedDI.invoke(this, () => { return this.$attached(i, f); }); }
    detaching(i, p, f) { return this.detachingDI.invoke(this, () => { return this.$detaching(i, p, f); }); }
    unbinding(i, p, f) { return this.unbindingDI.invoke(this, () => { return this.$unbinding(i, p, f); }); }
    canLoad(p, n, c) { return this.canLoadDI.invoke(this, () => { return this.$canLoad(p, n, c); }); }
    loading(p, n, c) { return this.loadDI.invoke(this, () => { return this.$loading(p, n, c); }); }
    canUnload(n, c) { return this.canUnloadDI.invoke(this, () => { return this.$canUnload(n, c); }); }
    unloading(n, c) { return this.unloadDI.invoke(this, () => { return this.$unloading(n, c); }); }
    dispose() { void this.disposeDI.invoke(this, () => { this.$dispose(); }); }
    $binding(_i, _p, _f) { }
    $bound(_i, _p, _f) { }
    $attaching(_i, _p, _f) { }
    $attached(_i, _f) { }
    $detaching(_i, _p, _f) { }
    $unbinding(_i, _p, _f) { }
    $canLoad(_p, _n, _c) { return true; }
    $loading(_p, _n, _c) { }
    $canUnload(_n, _c) { return true; }
    $unloading(_n, _c) { }
    $dispose() {
        this.bindingDI = void 0;
        this.boundDI = void 0;
        this.attachingDI = void 0;
        this.attachedDI = void 0;
        this.detachingDI = void 0;
        this.unbindingDI = void 0;
        this.disposeDI = void 0;
    }
}
class Notifier {
    constructor(mgr, name) {
        this.mgr = mgr;
        this.name = name;
        this.entryHistory = [];
        this.fullHistory = [];
        this.p = mgr.p;
    }
    enter(vm) {
        this.entryHistory.push(vm.name);
        this.fullHistory.push(`${vm.name}.enter`);
        this.mgr.enter(vm, this);
    }
    leave(vm) {
        this.fullHistory.push(`${vm.name}.leave`);
        this.mgr.leave(vm, this);
    }
    tick(vm, i) {
        this.fullHistory.push(`${vm.name}.tick(${i})`);
        this.mgr.tick(vm, this, i);
    }
    dispose() {
        this.entryHistory = void 0;
        this.fullHistory = void 0;
        this.p = void 0;
        this.mgr = void 0;
    }
}
const INotifierConfig = DI.createInterface('INotifierConfig');
class NotifierConfig {
    constructor(resolveLabels, resolveTimeoutMs) {
        this.resolveLabels = resolveLabels;
        this.resolveTimeoutMs = resolveTimeoutMs;
    }
}
const INotifierManager = DI.createInterface('INotifierManager', x => x.singleton(NotifierManager));
let NotifierManager = class NotifierManager {
    constructor(p) {
        this.p = p;
        this.entryNotifyHistory = [];
        this.fullNotifyHistory = [];
        this.prefix = '';
        this.binding = new Notifier(this, 'binding');
        this.bound = new Notifier(this, 'bound');
        this.attaching = new Notifier(this, 'attaching');
        this.attached = new Notifier(this, 'attached');
        this.detaching = new Notifier(this, 'detaching');
        this.unbinding = new Notifier(this, 'unbinding');
        this.canLoad = new Notifier(this, 'canLoad');
        this.loading = new Notifier(this, 'loading');
        this.canUnload = new Notifier(this, 'canUnload');
        this.unloading = new Notifier(this, 'unloading');
        this.dispose = new Notifier(this, 'dispose');
    }
    enter(vm, tracker) {
        const label = `${this.prefix}.${vm.name}.${tracker.name}`;
        this.entryNotifyHistory.push(label);
        this.fullNotifyHistory.push(`${label}.enter`);
    }
    leave(vm, tracker) {
        const label = `${this.prefix}.${vm.name}.${tracker.name}`;
        this.fullNotifyHistory.push(`${label}.leave`);
    }
    tick(vm, tracker, i) {
        const label = `${this.prefix}.${vm.name}.${tracker.name}`;
        this.fullNotifyHistory.push(`${label}.tick(${i})`);
    }
    setPrefix(prefix) {
        this.prefix = prefix;
    }
    $dispose() {
        this.binding.dispose();
        this.bound.dispose();
        this.attaching.dispose();
        this.attached.dispose();
        this.detaching.dispose();
        this.unbinding.dispose();
        this.canLoad.dispose();
        this.loading.dispose();
        this.canUnload.dispose();
        this.unloading.dispose();
        this.dispose.dispose();
        this.entryNotifyHistory = void 0;
        this.fullNotifyHistory = void 0;
        this.p = void 0;
        this.binding = void 0;
        this.bound = void 0;
        this.attaching = void 0;
        this.attached = void 0;
        this.detaching = void 0;
        this.unbinding = void 0;
        this.canLoad = void 0;
        this.loading = void 0;
        this.canUnload = void 0;
        this.unloading = void 0;
        this.$dispose = void 0;
    }
};
NotifierManager = __decorate([
    __param(0, IPlatform),
    __metadata("design:paramtypes", [Object])
], NotifierManager);
class DelayedInvoker {
    constructor(mgr, p, name, ticks) {
        this.mgr = mgr;
        this.p = p;
        this.name = name;
        this.ticks = ticks;
    }
    static binding(ticks = 0) { return new DelayedInvokerFactory('binding', ticks); }
    static bound(ticks = 0) { return new DelayedInvokerFactory('bound', ticks); }
    static attaching(ticks = 0) { return new DelayedInvokerFactory('attaching', ticks); }
    static attached(ticks = 0) { return new DelayedInvokerFactory('attached', ticks); }
    static detaching(ticks = 0) { return new DelayedInvokerFactory('detaching', ticks); }
    static unbinding(ticks = 0) { return new DelayedInvokerFactory('unbinding', ticks); }
    static canLoad(ticks = 0) { return new DelayedInvokerFactory('canLoad', ticks); }
    static loading(ticks = 0) { return new DelayedInvokerFactory('loading', ticks); }
    static canUnload(ticks = 0) { return new DelayedInvokerFactory('canUnload', ticks); }
    static unloading(ticks = 0) { return new DelayedInvokerFactory('unloading', ticks); }
    static dispose(ticks = 0) { return new DelayedInvokerFactory('dispose', ticks); }
    invoke(vm, cb) {
        if (this.ticks === 0) {
            this.mgr[this.name].enter(vm);
            const value = cb();
            this.mgr[this.name].leave(vm);
            return value;
        }
        else {
            let i = -1;
            let resolve;
            const p = new Promise(r => {
                resolve = r;
            });
            const next = () => {
                if (++i === 0) {
                    this.mgr[this.name].enter(vm);
                }
                else {
                    this.mgr[this.name].tick(vm, i);
                }
                if (i < this.ticks) {
                    void Promise.resolve().then(next);
                }
                else {
                    const value = cb();
                    this.mgr[this.name].leave(vm);
                    resolve(value);
                }
            };
            next();
            return p;
        }
    }
    toString() {
        let str = this.name;
        if (this.ticks !== 0) {
            str = `${str}.${this.ticks}t`;
        }
        return str;
    }
}
function verifyInvocationsEqual(actual, expected) {
    const groupNames = new Set();
    actual.forEach(x => groupNames.add(x.slice(0, x.indexOf('.'))));
    expected.forEach(x => groupNames.add(x.slice(0, x.indexOf('.'))));
    const expectedGroups = {};
    const actualGroups = {};
    for (const groupName of groupNames) {
        expectedGroups[groupName] = expected.filter(x => x.startsWith(`${groupName}.`));
        actualGroups[groupName] = actual.filter(x => x.startsWith(`${groupName}.`));
    }
    const errors = [];
    for (const prefix in expectedGroups) {
        expected = expectedGroups[prefix];
        actual = actualGroups[prefix];
        const len = Math.max(actual.length, expected.length);
        for (let i = 0; i < len; ++i) {
            const $actual = actual[i] ?? '';
            const $expected = (expected[i] ?? '').replace(/>$/, '');
            if ($actual === $expected) {
                errors.push(`    OK : ${$actual}`);
            }
            else {
                errors.push(`NOT OK : ${$actual}          (expected: ${$expected})`);
            }
        }
    }
    if (errors.some(e => e.startsWith('N'))) {
        throw new Error(`Failed assertion: invocation mismatch\n  - ${errors.join('\n  - ')})`);
    }
    else {
        // fallback just to make sure there's no bugs in this function causing false positives
        assert.deepStrictEqual(actual, expected);
    }
}
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
function* $(prefix, component, ticks, ...calls) {
    if (component instanceof Array) {
        for (const c of component) {
            yield* $(prefix, c, ticks, ...calls);
        }
    }
    else {
        for (const call of calls) {
            if (call === '') {
                if (component.length > 0) {
                    yield '';
                }
            }
            else if (typeof call === 'string') {
                if (component.length > 0) {
                    if (!call.includes('.')) {
                        yield `${prefix}.${component}.${call}.enter`;
                        if (call !== 'dispose') {
                            for (let i = 1; i <= ticks; ++i) {
                                if (i === ticks) {
                                    yield `${prefix}.${component}.${call}.tick(${i})>`;
                                }
                                else {
                                    yield `${prefix}.${component}.${call}.tick(${i})`;
                                }
                            }
                        }
                        yield `${prefix}.${component}.${call}.leave`;
                    }
                    else {
                        yield `${prefix}.${component}.${call}`;
                    }
                }
            }
            else {
                yield* call;
            }
        }
    }
}
function* interleave(...generators) {
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
                    if (value.endsWith('>')) {
                        yield value.slice(0, -1);
                        yield gen.next().value;
                    }
                    else if (value.endsWith('dispose.enter')) {
                        yield value;
                        yield gen.next().value;
                    }
                    else {
                        yield value;
                    }
                }
            }
        }
    }
}
async function createFixture(Component, deps, level = 5 /* LogLevel.fatal */) {
    const ctx = TestContext.create();
    const cfg = new NotifierConfig([], 100);
    const { container, platform } = ctx;
    container.register(TestRouterConfiguration.for(level));
    container.register(Registration.instance(INotifierConfig, cfg));
    container.register(RouterConfiguration);
    container.register(...deps);
    const mgr = container.get(INotifierManager);
    const router = container.get(IRouter);
    const component = container.get(Component);
    const au = new Aurelia(container);
    const host = ctx.createElement('div');
    const logConfig = container.get(ILogConfig);
    au.app({ component, host });
    mgr.setPrefix('start');
    await au.start();
    return {
        ctx,
        container,
        au,
        host,
        mgr,
        component,
        platform,
        router,
        startTracing() {
            logConfig.level = 0 /* LogLevel.trace */;
        },
        stopTracing() {
            logConfig.level = level;
        },
        async tearDown() {
            mgr.setPrefix('stop');
            await au.stop(true);
        },
    };
}
describe('router-lite/hook-tests.spec.ts', function () {
    describe('monomorphic timings', function () {
        for (const ticks of [
            0,
            1,
        ]) {
            const hookSpec = HookSpecs.create(ticks);
            let A01 = class A01 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A01 = __decorate([
                customElement({ name: 'a01', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A01);
            let A02 = class A02 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A02 = __decorate([
                customElement({ name: 'a02', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A02);
            let A03 = class A03 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A03 = __decorate([
                customElement({ name: 'a03', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A03);
            let A04 = class A04 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A04 = __decorate([
                customElement({ name: 'a04', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A04);
            const A0 = [A01, A02, A03, A04];
            let Root1 = class Root1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root1 = __decorate([
                customElement({ name: 'root1', template: vp(1) })
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ,
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root1);
            let A11 = class A11 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A11 = __decorate([
                customElement({ name: 'a11', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A11);
            let A12 = class A12 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A12 = __decorate([
                customElement({ name: 'a12', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A12);
            let A13 = class A13 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A13 = __decorate([
                customElement({ name: 'a13', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A13);
            let A14 = class A14 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A14 = __decorate([
                customElement({ name: 'a14', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A14);
            const A1 = [A11, A12, A13, A14];
            let Root2 = class Root2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root2 = __decorate([
                route({
                    routes: [
                        { path: 'a01', component: A01 },
                        { path: 'a02', component: A02 },
                        { path: 'a03', component: A03 },
                        { path: 'a04', component: A04 },
                    ]
                }),
                customElement({ name: 'root2', template: vp(2) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root2);
            let A21 = class A21 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A21 = __decorate([
                customElement({ name: 'a21', template: vp(2) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A21);
            let A22 = class A22 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A22 = __decorate([
                customElement({ name: 'a22', template: vp(2) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A22);
            const A2 = [A21, A22];
            const A = [...A0, ...A1, ...A2];
            describe(`ticks: ${ticks}`, function () {
                describe('single', function () {
                    for (const spec of [
                        { t1: 'a01', t2: 'a02', t3: 'a01', t4: 'a02' },
                        { t1: 'a01', t2: 'a02', t3: 'a03', t4: 'a01' },
                        { t1: 'a01', t2: 'a02', t3: 'a01', t4: 'a04' },
                    ]) {
                        const { t1, t2, t3, t4 } = spec;
                        it(`'${t1}' -> '${t2}' -> '${t3}' -> '${t4}'`, async function () {
                            const { router, mgr, tearDown } = await createFixture(Root2, A);
                            const phase1 = `('' -> '${t1}')#1`;
                            const phase2 = `('${t1}' -> '${t2}')#2`;
                            const phase3 = `('${t2}' -> '${t3}')#3`;
                            const phase4 = `('${t3}' -> '${t4}')#4`;
                            mgr.setPrefix(phase1);
                            await router.load(t1);
                            mgr.setPrefix(phase2);
                            await router.load(t2);
                            mgr.setPrefix(phase3);
                            await router.load(t3);
                            mgr.setPrefix(phase4);
                            await router.load(t4);
                            await tearDown();
                            const expected = [...(function* () {
                                    switch (ticks) {
                                        case 0:
                                            yield* $('start', 'root2', ticks, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, t1, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                            for (const [phase, { $t1, $t2 }] of [
                                                [phase2, { $t1: t1, $t2: t2 }],
                                                [phase3, { $t1: t2, $t2: t3 }],
                                                [phase4, { $t1: t3, $t2: t4 }],
                                            ]) {
                                                yield* $(phase, $t1, ticks, 'canUnload');
                                                yield* $(phase, $t2, ticks, 'canLoad');
                                                yield* $(phase, $t1, ticks, 'unloading');
                                                yield* $(phase, $t2, ticks, 'loading');
                                                yield* $(phase, $t1, ticks, 'detaching', 'unbinding', 'dispose');
                                                yield* $(phase, $t2, ticks, 'binding', 'bound', 'attaching', 'attached');
                                            }
                                            yield* $('stop', [t4, 'root2'], ticks, 'detaching');
                                            yield* $('stop', [t4, 'root2'], ticks, 'unbinding');
                                            yield* $('stop', ['root2', t4], ticks, 'dispose');
                                            break;
                                        case 1:
                                            yield* $('start', 'root2', ticks, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, t1, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                            for (const [phase, { $t1, $t2 }] of [
                                                [phase2, { $t1: t1, $t2: t2 }],
                                                [phase3, { $t1: t2, $t2: t3 }],
                                                [phase4, { $t1: t3, $t2: t4 }],
                                            ]) {
                                                yield* $(phase, $t1, ticks, 'canUnload');
                                                yield* $(phase, $t2, ticks, 'canLoad');
                                                yield* $(phase, $t1, ticks, 'unloading');
                                                yield* $(phase, $t2, ticks, 'loading');
                                                yield* $(phase, $t1, ticks, 'detaching', 'unbinding', 'dispose');
                                                yield* $(phase, $t2, ticks, 'binding', 'bound', 'attaching', 'attached');
                                            }
                                            yield* interleave($('stop', t4, ticks, 'detaching', 'unbinding'), $('stop', 'root2', ticks, 'detaching', 'unbinding'));
                                            yield* $('stop', 'root2', ticks, 'dispose');
                                            yield* $('stop', t4, ticks, 'dispose');
                                            break;
                                    }
                                })()];
                            verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
                            mgr.$dispose();
                        });
                    }
                });
                describe('siblings', function () {
                    for (const { t1, t2 } of [
                        // Only $0 changes with every nav
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a03', vp1: 'a02' } },
                        { t1: { vp0: '', vp1: 'a02' }, t2: { vp0: 'a03', vp1: 'a02' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: '', vp1: 'a02' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a02', vp1: 'a02' } },
                        { t1: { vp0: '', vp1: 'a02' }, t2: { vp0: 'a02', vp1: 'a02' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: '', vp1: 'a02' } },
                        { t1: { vp0: 'a02', vp1: 'a02' }, t2: { vp0: 'a01', vp1: 'a02' } },
                        { t1: { vp0: '', vp1: 'a02' }, t2: { vp0: 'a01', vp1: 'a02' } },
                        { t1: { vp0: 'a02', vp1: 'a02' }, t2: { vp0: '', vp1: 'a02' } },
                        // Only $1 changes with every nav
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a01', vp1: 'a03' } },
                        { t1: { vp0: 'a01', vp1: '' }, t2: { vp0: 'a01', vp1: 'a03' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a01', vp1: '' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a01', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: '' }, t2: { vp0: 'a01', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a01', vp1: '' } },
                        { t1: { vp0: 'a01', vp1: 'a01' }, t2: { vp0: 'a01', vp1: 'a02' } },
                        { t1: { vp0: 'a01', vp1: '' }, t2: { vp0: 'a01', vp1: 'a02' } },
                        { t1: { vp0: 'a01', vp1: 'a01' }, t2: { vp0: 'a01', vp1: '' } },
                        // Both $0 and $1 change with every nav
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a03', vp1: 'a04' } },
                        { t1: { vp0: '', vp1: 'a02' }, t2: { vp0: 'a03', vp1: 'a04' } },
                        { t1: { vp0: 'a01', vp1: '' }, t2: { vp0: 'a03', vp1: 'a04' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: '', vp1: 'a04' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a03', vp1: '' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a02', vp1: 'a01' } },
                        { t1: { vp0: '', vp1: 'a02' }, t2: { vp0: 'a02', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: '' }, t2: { vp0: 'a02', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: '', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a02', vp1: '' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a04', vp1: 'a01' } },
                        { t1: { vp0: '', vp1: 'a02' }, t2: { vp0: 'a04', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: '' }, t2: { vp0: 'a04', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: '', vp1: 'a01' } },
                        { t1: { vp0: 'a01', vp1: 'a02' }, t2: { vp0: 'a04', vp1: '' } },
                    ]) {
                        const instr1 = join('+', `${t1.vp0}@$0`, `${t1.vp1}@$1`);
                        const instr2 = join('+', `${t2.vp0}@$0`, `${t2.vp1}@$1`);
                        it(`${instr1}' -> '${instr2}' -> '${instr1}' -> '${instr2}'`, async function () {
                            const { router, mgr, tearDown } = await createFixture(Root2, A);
                            const phase1 = `('' -> '${instr1}')#1`;
                            const phase2 = `('${instr1}' -> '${instr2}')#2`;
                            const phase3 = `('${instr2}' -> '${instr1}')#3`;
                            const phase4 = `('${instr1}' -> '${instr2}')#4`;
                            mgr.setPrefix(phase1);
                            await router.load(instr1);
                            mgr.setPrefix(phase2);
                            await router.load(instr2);
                            mgr.setPrefix(phase3);
                            await router.load(instr1);
                            mgr.setPrefix(phase4);
                            await router.load(instr2);
                            await tearDown();
                            const expected = [...(function* () {
                                    switch (ticks) {
                                        case 0:
                                            yield* $('start', 'root2', ticks, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, [t1.vp0, t1.vp1], ticks, 'canLoad');
                                            yield* $(phase1, [t1.vp0, t1.vp1], ticks, 'loading');
                                            yield* $(phase1, [t1.vp0, t1.vp1], ticks, 'binding', 'bound', 'attaching', 'attached');
                                            for (const [phase, { $t1, $t2 }] of [
                                                [phase2, { $t1: t1, $t2: t2 }],
                                                [phase3, { $t1: t2, $t2: t1 }],
                                                [phase4, { $t1: t1, $t2: t2 }],
                                            ]) {
                                                if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t1.vp0, ticks, 'canUnload');
                                                }
                                                if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t1.vp1, ticks, 'canUnload');
                                                }
                                                if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t2.vp0, ticks, 'canLoad');
                                                }
                                                if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t2.vp1, ticks, 'canLoad');
                                                }
                                                if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t1.vp0, ticks, 'unloading');
                                                }
                                                if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t1.vp1, ticks, 'unloading');
                                                }
                                                if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t2.vp0, ticks, 'loading');
                                                }
                                                if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t2.vp1, ticks, 'loading');
                                                }
                                                if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t1.vp0, ticks, 'detaching', 'unbinding', 'dispose');
                                                }
                                                if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t2.vp0, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                }
                                                if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t1.vp1, ticks, 'detaching', 'unbinding', 'dispose');
                                                }
                                                if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t2.vp1, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                }
                                            }
                                            yield* $('stop', [t2.vp0, t2.vp1, 'root2'], ticks, 'detaching');
                                            yield* $('stop', [t2.vp0, t2.vp1, 'root2'], ticks, 'unbinding');
                                            yield* $('stop', ['root2', t2.vp0, t2.vp1], ticks, 'dispose');
                                            break;
                                        case 1:
                                            yield* $('start', 'root2', ticks, 'binding', 'bound', 'attaching', 'attached');
                                            yield* interleave($(phase1, t1.vp0, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'), $(phase1, t1.vp1, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'));
                                            for (const [phase, { $t1, $t2 }] of [
                                                [phase2, { $t1: t1, $t2: t2 }],
                                                [phase3, { $t1: t2, $t2: t1 }],
                                                [phase4, { $t1: t1, $t2: t2 }],
                                            ]) {
                                                yield* interleave((function* () { if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t1.vp0, ticks, 'canUnload');
                                                } })(), (function* () { if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t1.vp1, ticks, 'canUnload');
                                                } })());
                                                yield* interleave((function* () { if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t2.vp0, ticks, 'canLoad');
                                                } })(), (function* () { if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t2.vp1, ticks, 'canLoad');
                                                } })());
                                                yield* interleave((function* () { if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t1.vp0, ticks, 'unloading');
                                                } })(), (function* () { if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t1.vp1, ticks, 'unloading');
                                                } })());
                                                yield* interleave((function* () { if ($t1.vp0 !== $t2.vp0) {
                                                    yield* $(phase, $t2.vp0, ticks, 'loading');
                                                } })(), (function* () { if ($t1.vp1 !== $t2.vp1) {
                                                    yield* $(phase, $t2.vp1, ticks, 'loading');
                                                } })());
                                                yield* interleave((function* () {
                                                    if ($t1.vp0 !== $t2.vp0) {
                                                        yield* $(phase, $t1.vp0, ticks, 'detaching', 'unbinding', 'dispose');
                                                    }
                                                    if ($t1.vp0 !== $t2.vp0) {
                                                        yield* $(phase, $t2.vp0, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                    }
                                                })(), (function* () {
                                                    if ($t1.vp1 !== $t2.vp1) {
                                                        yield* $(phase, $t1.vp1, ticks, 'detaching', 'unbinding', 'dispose');
                                                    }
                                                    if ($t1.vp1 !== $t2.vp1) {
                                                        yield* $(phase, $t2.vp1, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                    }
                                                })());
                                            }
                                            yield* interleave($('stop', t2.vp0, ticks, 'detaching', 'unbinding'), $('stop', t2.vp1, ticks, 'detaching', 'unbinding'), $('stop', 'root2', ticks, 'detaching', 'unbinding'));
                                            yield* $('stop', ['root2', t2.vp0, t2.vp1], ticks, 'dispose');
                                            break;
                                    }
                                })()];
                            verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
                            mgr.$dispose();
                        });
                    }
                });
                describe('parent-child', function () {
                    let PcA01 = class PcA01 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    PcA01 = __decorate([
                        customElement({ name: 'a01', template: null }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], PcA01);
                    let PcA02 = class PcA02 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    PcA02 = __decorate([
                        customElement({ name: 'a02', template: null }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], PcA02);
                    let PcA12 = class PcA12 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    PcA12 = __decorate([
                        route({
                            routes: [
                                { path: 'a02', component: PcA02 },
                            ]
                        }),
                        customElement({ name: 'a12', template: vp(1) }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], PcA12);
                    let PcA11 = class PcA11 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    PcA11 = __decorate([
                        route({
                            routes: [
                                { path: 'a01', component: PcA01 },
                                { path: 'a02', component: PcA02 },
                                { path: 'a12', component: PcA12 },
                            ]
                        }),
                        customElement({ name: 'a11', template: vp(1) }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], PcA11);
                    let PcA14 = class PcA14 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    PcA14 = __decorate([
                        customElement({ name: 'a14', template: vp(1) }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], PcA14);
                    let PcA13 = class PcA13 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    PcA13 = __decorate([
                        route({
                            routes: [
                                { path: 'a11', component: PcA11 },
                                { path: 'a12', component: PcA12 },
                                { path: 'a14', component: PcA14 },
                            ]
                        }),
                        customElement({ name: 'a13', template: vp(1) }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], PcA13);
                    let PcRoot = class PcRoot extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    PcRoot = __decorate([
                        route({
                            routes: [
                                { path: 'a11', component: PcA11 },
                                { path: 'a12', component: PcA12 },
                                { path: 'a13', component: PcA13 },
                            ]
                        }),
                        customElement({ name: 'root2', template: vp(2) }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], PcRoot);
                    const deps = [PcA01, PcA02, PcA11, PcA12, PcA13, PcA14];
                    for (const { t1, t2 } of [
                        // Only parent changes with every nav
                        { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a13', c: 'a12' } },
                        // the following routes self reference components as child. do we want to support this as configured route? TODO(sayan).
                        // { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a12', c: 'a12' } },
                        // { t1: { p: 'a12', c: 'a12' }, t2: { p: 'a11', c: 'a12' } },
                        // Only child changes with every nav
                        { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a11', c: 'a02' } },
                        { t1: { p: 'a11', c: '' }, t2: { p: 'a11', c: 'a02' } },
                        { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a11', c: '' } },
                        // the following routes self reference components as child. do we want to support this as configured route? TODO(sayan).
                        // { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a11', c: 'a02' } },
                        // { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a11', c: ''    } },
                        // { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a11', c: 'a11' } },
                        // { t1: { p: 'a11', c: ''    }, t2: { p: 'a11', c: 'a11' } },
                        // Both parent and child change with every nav
                        { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a12', c: 'a02' } },
                        { t1: { p: 'a11', c: '' }, t2: { p: 'a12', c: 'a02' } },
                        { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a12', c: '' } },
                        // the following routes self reference components as child. do we want to support this as configured route? TODO(sayan).
                        // { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a12', c: 'a02' } },
                        // { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a12', c: 'a12' } },
                        // { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a12', c: ''    } },
                        // { t1: { p: 'a12', c: 'a02' }, t2: { p: 'a11', c: 'a11' } },
                        // { t1: { p: 'a12', c: 'a12' }, t2: { p: 'a11', c: 'a11' } },
                        // { t1: { p: 'a12', c: ''    }, t2: { p: 'a11', c: 'a11' } },
                        { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a13', c: 'a14' } },
                        { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a13', c: 'a11' } },
                        { t1: { p: 'a13', c: 'a14' }, t2: { p: 'a11', c: 'a12' } },
                        { t1: { p: 'a13', c: 'a11' }, t2: { p: 'a11', c: 'a12' } },
                    ]) {
                        const instr1 = join('/', t1.p, t1.c);
                        const instr2 = join('/', t2.p, t2.c);
                        it(`${instr1}' -> '${instr2}' -> '${instr1}' -> '${instr2}'`, async function () {
                            const { router, mgr, tearDown } = await createFixture(PcRoot, deps);
                            const phase1 = `('' -> '${instr1}')#1`;
                            const phase2 = `('${instr1}' -> '${instr2}')#2`;
                            const phase3 = `('${instr2}' -> '${instr1}')#3`;
                            const phase4 = `('${instr1}' -> '${instr2}')#4`;
                            mgr.setPrefix(phase1);
                            await router.load(instr1);
                            mgr.setPrefix(phase2);
                            await router.load(instr2);
                            mgr.setPrefix(phase3);
                            await router.load(instr1);
                            mgr.setPrefix(phase4);
                            await router.load(instr2);
                            await tearDown();
                            const expected = [...(function* () {
                                    switch (ticks) {
                                        case 0:
                                            yield* $('start', 'root2', ticks, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, [t1.p, t1.c], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                            for (const [phase, { $t1, $t2 }] of [
                                                [phase2, { $t1: t1, $t2: t2 }],
                                                [phase3, { $t1: t2, $t2: t1 }],
                                                [phase4, { $t1: t1, $t2: t2 }],
                                            ]) {
                                                // When parents are equal, this becomes like an ordinary single component transition
                                                if ($t1.p === $t2.p) {
                                                    yield* $(phase, $t1.c, ticks, 'canUnload');
                                                    yield* $(phase, $t2.c, ticks, 'canLoad');
                                                    yield* $(phase, $t1.c, ticks, 'unloading');
                                                    yield* $(phase, $t2.c, ticks, 'loading');
                                                    yield* $(phase, $t1.c, ticks, 'detaching', 'unbinding', 'dispose');
                                                    yield* $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                }
                                                else {
                                                    yield* $(phase, [$t1.c, $t1.p], ticks, 'canUnload');
                                                    yield* $(phase, $t2.p, ticks, 'canLoad');
                                                    yield* $(phase, [$t1.c, $t1.p], ticks, 'unloading');
                                                    yield* $(phase, $t2.p, ticks, 'loading');
                                                    yield* $(phase, [$t1.c, $t1.p], ticks, 'detaching');
                                                    yield* $(phase, [$t1.c, $t1.p], ticks, 'unbinding');
                                                    yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                    yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching');
                                                    yield* $(phase, $t2.p, ticks, 'attached');
                                                    yield* $(phase, $t2.c, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                }
                                            }
                                            yield* $('stop', [t2.c, t2.p, 'root2'], ticks, 'detaching');
                                            yield* $('stop', [t2.c, t2.p, 'root2'], ticks, 'unbinding');
                                            yield* $('stop', ['root2', t2.p, t2.c], ticks, 'dispose');
                                            break;
                                        case 1:
                                            yield* $('start', 'root2', ticks, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, [t1.p, t1.c], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                            for (const [phase, { $t1, $t2 }] of [
                                                [phase2, { $t1: t1, $t2: t2 }],
                                                [phase3, { $t1: t2, $t2: t1 }],
                                                [phase4, { $t1: t1, $t2: t2 }],
                                            ]) {
                                                // When parents are equal, this becomes like an ordinary single component transition
                                                if ($t1.p === $t2.p) {
                                                    yield* $(phase, $t1.c, ticks, 'canUnload');
                                                    yield* $(phase, $t2.c, ticks, 'canLoad');
                                                    yield* $(phase, $t1.c, ticks, 'unloading');
                                                    yield* $(phase, $t2.c, ticks, 'loading');
                                                    yield* $(phase, $t1.c, ticks, 'detaching', 'unbinding', 'dispose');
                                                    yield* $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                }
                                                else {
                                                    yield* $(phase, [$t1.c, $t1.p], ticks, 'canUnload');
                                                    yield* $(phase, $t2.p, ticks, 'canLoad');
                                                    yield* $(phase, [$t1.c, $t1.p], ticks, 'unloading');
                                                    yield* $(phase, $t2.p, ticks, 'loading');
                                                    yield* interleave($(phase, $t1.c, ticks, 'detaching', 'unbinding'), $(phase, $t1.p, ticks, 'detaching', 'unbinding'));
                                                    yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                    yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                    yield* $(phase, $t2.c, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                }
                                            }
                                            yield* interleave($('stop', t2.c, ticks, 'detaching', 'unbinding'), $('stop', t2.p, ticks, 'detaching', 'unbinding'), $('stop', 'root2', ticks, 'detaching', 'unbinding'));
                                            yield* $('stop', ['root2', t2.p, t2.c], ticks, 'dispose');
                                            break;
                                    }
                                })()];
                            verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
                            mgr.$dispose();
                        });
                    }
                });
            });
        }
    });
    describe('parent-child timings', function () {
        for (const hookSpec of [
            HookSpecs.create(0, {
                canUnload: DelayedInvoker.canUnload(1),
            }),
            HookSpecs.create(0, {
                unloading: DelayedInvoker.unloading(1),
            }),
            HookSpecs.create(0, {
                canLoad: DelayedInvoker.canLoad(1),
            }),
            HookSpecs.create(0, {
                loading: DelayedInvoker.loading(1),
            }),
            HookSpecs.create(0, {
                binding: DelayedInvoker.binding(1),
            }),
            HookSpecs.create(0, {
                bound: DelayedInvoker.bound(1),
            }),
            HookSpecs.create(0, {
                attaching: DelayedInvoker.attaching(1),
            }),
            HookSpecs.create(0, {
                attached: DelayedInvoker.attached(1),
            }),
            HookSpecs.create(0, {
                detaching: DelayedInvoker.detaching(1),
            }),
            HookSpecs.create(0, {
                unbinding: DelayedInvoker.unbinding(1),
            }),
        ]) {
            it(`'a/b/c/d' -> 'a' (c.hookSpec:${hookSpec})`, async function () {
                let D = class D extends TestVM {
                    constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                };
                D = __decorate([
                    customElement({ name: 'd', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], D);
                let C = class C extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                C = __decorate([
                    route({ routes: [{ path: 'd', component: D }] }),
                    customElement({ name: 'c', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], C);
                let B = class B extends TestVM {
                    constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                };
                B = __decorate([
                    route({ routes: [{ path: 'c', component: C }] }),
                    customElement({ name: 'b', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], B);
                let A = class A extends TestVM {
                    constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                };
                A = __decorate([
                    route({ routes: [{ path: 'b', component: B }] }),
                    customElement({ name: 'a', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                };
                Root = __decorate([
                    route({ routes: [{ path: 'a', component: A }] }),
                    customElement({ name: 'root', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [A, B, C, D]);
                const phase1 = `('' -> 'a/b/c/d')`;
                mgr.setPrefix(phase1);
                await router.load('a/b/c/d');
                const phase2 = `('a/b/c/d' -> 'a')`;
                mgr.setPrefix(phase2);
                await router.load('a');
                await tearDown();
                const expected = [...(function* () {
                        yield* $('start', 'root', 0, 'binding', 'bound', 'attaching', 'attached');
                        const hookName = hookSpec.toString().slice(0, -3);
                        yield* $(phase1, ['a', 'b'], 0, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                        switch (hookName) {
                            case 'canLoad':
                                yield* $(phase1, 'c', 1, 'canLoad');
                                yield* $(phase1, 'c', 0, 'loading', 'binding', 'bound', 'attaching', 'attached');
                                break;
                            case 'loading':
                                yield* $(phase1, 'c', 0, 'canLoad');
                                yield* $(phase1, 'c', 1, 'loading');
                                yield* $(phase1, 'c', 0, 'binding', 'bound', 'attaching', 'attached');
                                break;
                            case 'binding':
                                yield* $(phase1, 'c', 0, 'canLoad', 'loading');
                                yield* $(phase1, 'c', 1, 'binding');
                                yield* $(phase1, 'c', 0, 'bound', 'attaching', 'attached');
                                break;
                            case 'bound':
                                yield* $(phase1, 'c', 0, 'canLoad', 'loading', 'binding');
                                yield* $(phase1, 'c', 1, 'bound');
                                yield* $(phase1, 'c', 0, 'attaching', 'attached');
                                break;
                            case 'attaching':
                                yield* $(phase1, 'c', 0, 'canLoad', 'loading', 'binding', 'bound');
                                yield* $(phase1, 'c', 1, 'attaching');
                                yield* $(phase1, 'c', 0, 'attached');
                                break;
                            case 'attached':
                                yield* $(phase1, 'c', 0, 'canLoad', 'loading', 'binding', 'bound', 'attaching');
                                yield* $(phase1, 'c', 1, 'attached');
                                break;
                            default:
                                yield* $(phase1, 'c', 0, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                break;
                        }
                        yield* $(phase1, 'd', 0, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                        switch (hookName) {
                            case 'canUnload':
                                yield* $(phase2, 'd', 0, 'canUnload');
                                yield* $(phase2, 'c', 1, 'canUnload');
                                yield* $(phase2, 'b', 0, 'canUnload');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unloading');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'detaching');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unbinding');
                                break;
                            case 'unloading':
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'canUnload');
                                yield* $(phase2, 'd', 0, 'unloading');
                                yield* $(phase2, 'c', 1, 'unloading');
                                yield* $(phase2, 'b', 0, 'unloading');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'detaching');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unbinding');
                                break;
                            case 'detaching':
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'canUnload');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unloading');
                                yield* $(phase2, 'd', 0, 'detaching');
                                yield* $(phase2, 'c', 0, 'detaching.enter');
                                yield* $(phase2, 'b', 0, 'detaching');
                                yield* $(phase2, 'c', 0, 'detaching.tick(1)');
                                yield* $(phase2, 'c', 0, 'detaching.leave');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unbinding');
                                break;
                            case 'unbinding':
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'canUnload');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unloading');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'detaching');
                                yield* $(phase2, 'd', 0, 'unbinding');
                                yield* $(phase2, 'c', 0, 'unbinding.enter');
                                yield* $(phase2, 'b', 0, 'unbinding');
                                yield* $(phase2, 'c', 0, 'unbinding.tick(1)');
                                yield* $(phase2, 'c', 0, 'unbinding.leave');
                                break;
                            default:
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'canUnload');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unloading');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'detaching');
                                yield* $(phase2, ['d', 'c', 'b'], 0, 'unbinding');
                                break;
                        }
                        yield* $(phase2, ['b', 'c', 'd'], 0, 'dispose');
                        yield* $('stop', ['a', 'root'], 0, 'detaching');
                        yield* $('stop', ['a', 'root'], 0, 'unbinding');
                        yield* $('stop', ['root', 'a'], 0, 'dispose');
                    })()];
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
                mgr.$dispose();
            });
        }
    });
    describe('single incoming sibling transition', function () {
        for (const [aCanLoad, bCanLoad, aLoad, bLoad] of [
            [1, 1, 1, 2],
            [1, 1, 1, 3],
            [1, 1, 1, 4],
            [1, 1, 1, 5],
            [1, 1, 1, 6],
            [1, 1, 1, 7],
            [1, 1, 1, 8],
            [1, 1, 1, 9],
            [1, 1, 1, 10],
            [1, 1, 2, 1],
            [1, 1, 3, 1],
            [1, 1, 4, 1],
            [1, 1, 5, 1],
            [1, 1, 6, 1],
            [1, 1, 7, 1],
            [1, 1, 8, 1],
            [1, 1, 9, 1],
            [1, 1, 10, 1],
            [1, 5, 1, 2],
            [1, 5, 1, 10],
            [1, 5, 2, 1],
            [1, 5, 10, 1],
            [5, 1, 1, 2],
            [5, 1, 1, 10],
            [5, 1, 2, 1],
            [5, 1, 10, 1],
        ]) {
            const spec = {
                a: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(aCanLoad),
                    loading: DelayedInvoker.loading(aLoad),
                }),
                b: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(bCanLoad),
                    loading: DelayedInvoker.loading(bLoad),
                }),
            };
            const title = Object.keys(spec).map(key => `${key}:${spec[key]}`).filter(x => x.length > 2).join(',');
            it(title, async function () {
                const { a, b } = spec;
                let A = class A extends TestVM {
                    constructor(mgr, p) { super(mgr, p, a); }
                };
                A = __decorate([
                    customElement({ name: 'a', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A);
                let B = class B extends TestVM {
                    constructor(mgr, p) { super(mgr, p, b); }
                };
                B = __decorate([
                    customElement({ name: 'b', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], B);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                };
                Root = __decorate([
                    route({
                        routes: [
                            { path: 'a', component: A },
                            { path: 'b', component: B },
                        ]
                    }),
                    customElement({ name: 'root', template: '<au-viewport name="$0"></au-viewport><au-viewport name="$1"></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [A, B]);
                const phase1 = `('' -> 'a$0+b$1')`;
                mgr.setPrefix(phase1);
                await router.load('a@$0+b@$1');
                await tearDown();
                const expected = [...(function* () {
                        yield* $(`start`, 'root', 0, 'binding', 'bound', 'attaching', 'attached');
                        yield* interleave($(phase1, 'a', aCanLoad, 'canLoad'), $(phase1, 'b', bCanLoad, 'canLoad'));
                        yield* interleave($(phase1, 'a', aLoad, 'loading'), $(phase1, 'b', bLoad, 'loading'));
                        yield* interleave($(phase1, 'a', 1, 'binding', 'bound', 'attaching', 'attached'), $(phase1, 'b', 1, 'binding', 'bound', 'attaching', 'attached'));
                        yield* interleave($('stop', 'a', 0, 'detaching.enter'), $('stop', 'b', 0, 'detaching.enter'), $('stop', 'root', 0, 'detaching'));
                        yield* $('stop', ['a', 'b'], 0, 'detaching.tick(1)', 'detaching.leave');
                        yield* interleave($('stop', 'a', 0, 'unbinding.enter'), $('stop', 'b', 0, 'unbinding.enter'), $('stop', 'root', 0, 'unbinding'));
                        yield* $('stop', ['a', 'b'], 0, 'unbinding.tick(1)', 'unbinding.leave');
                        yield* $('stop', ['root', 'a', 'b'], 0, 'dispose');
                    }())];
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
                mgr.$dispose();
            });
        }
    });
    describe('single incoming parent-child transition', function () {
        for (const [a1CanLoad, a2CanLoad, a1Load, a2Load] of [
            [1, 5, 1, 5],
            [1, 5, 5, 1],
            [5, 1, 1, 5],
            [5, 1, 5, 1],
        ]) {
            const spec = {
                a1: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(a1CanLoad),
                    loading: DelayedInvoker.loading(a1Load),
                }),
                a2: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(a2CanLoad),
                    loading: DelayedInvoker.loading(a2Load),
                }),
            };
            const title = Object.keys(spec).map(key => `${key}:${spec[key]}`).filter(x => x.length > 2).join(',');
            it(title, async function () {
                const { a1, a2 } = spec;
                let A2 = class A2 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, a2); }
                };
                A2 = __decorate([
                    customElement({ name: 'a2', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A2);
                let A1 = class A1 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, a1); }
                };
                A1 = __decorate([
                    route({ routes: [{ path: 'a2', component: A2 }] }),
                    customElement({ name: 'a1', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A1);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                };
                Root = __decorate([
                    route({ routes: [{ path: 'a1', component: A1 }] }),
                    customElement({ name: 'root', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [A1, A2]);
                const phase1 = `('' -> 'a1/a2')`;
                mgr.setPrefix(phase1);
                await router.load('a1/a2');
                await tearDown();
                const expected = [...(function* () {
                        yield* $(`start`, 'root', 0, 'binding', 'bound', 'attaching', 'attached');
                        yield* $(phase1, 'a1', a1CanLoad, 'canLoad');
                        yield* $(phase1, 'a1', a1Load, 'loading');
                        yield* $(phase1, 'a1', 1, 'binding', 'bound', 'attaching', 'attached');
                        yield* $(phase1, 'a2', a2CanLoad, 'canLoad');
                        yield* $(phase1, 'a2', a2Load, 'loading');
                        yield* $(phase1, 'a2', 1, 'binding', 'bound', 'attaching', 'attached');
                        yield* $('stop', ['a2', 'a1'], 0, 'detaching.enter');
                        yield* $('stop', 'root', 0, 'detaching');
                        yield* $('stop', ['a2', 'a1'], 0, 'detaching.tick(1)', 'detaching.leave');
                        yield* $('stop', ['a2', 'a1'], 0, 'unbinding.enter');
                        yield* $('stop', 'root', 0, 'unbinding');
                        yield* $('stop', ['a2', 'a1'], 0, 'unbinding.tick(1)', 'unbinding.leave');
                        yield* $('stop', ['root', 'a1', 'a2'], 0, 'dispose');
                    })()];
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
                mgr.$dispose();
            });
        }
    });
    describe('single incoming parentsiblings-childsiblings transition', function () {
        for (const [a1CanLoad, a2CanLoad, b1CanLoad, b2CanLoad, a1Load, a2Load, b1Load, b2Load,] of [
            // a1.canLoad
            [
                2, 1, 1, 1,
                1, 1, 1, 1,
            ],
            // more involved tests are moved to lifecycle-hooks.spec.ts in more simplified form.
            // b1.canLoad
            // tests are moved to lifecycle-hooks.spec.ts in more simplified form.
            // a1.loading
            [
                1, 1, 1, 1,
                2, 1, 1, 1,
            ],
            [
                1, 1, 1, 1,
                4, 1, 1, 1,
            ],
            [
                1, 1, 1, 1,
                8, 1, 1, 1,
            ],
            // b1.loading
            [
                1, 1, 1, 1,
                1, 1, 2, 1,
            ],
            [
                1, 1, 1, 1,
                1, 1, 4, 1,
            ],
            [
                1, 1, 1, 1,
                1, 1, 8, 1,
            ],
            // a2.canLoad
            [
                1, 2, 1, 1,
                1, 1, 1, 1,
            ],
            [
                1, 4, 1, 1,
                1, 1, 1, 1,
            ],
            [
                1, 8, 1, 1,
                1, 1, 1, 1,
            ],
            // b2.canLoad
            [
                1, 1, 1, 2,
                1, 1, 1, 1,
            ],
            [
                1, 1, 1, 4,
                1, 1, 1, 1,
            ],
            [
                1, 1, 1, 8,
                1, 1, 1, 1,
            ],
            // a2.loading
            [
                1, 1, 1, 1,
                1, 2, 1, 1,
            ],
            [
                1, 1, 1, 1,
                1, 4, 1, 1,
            ],
            [
                1, 1, 1, 1,
                1, 8, 1, 1,
            ],
            // b2.loading
            [
                1, 1, 1, 1,
                1, 1, 1, 2,
            ],
            [
                1, 1, 1, 1,
                1, 1, 1, 4,
            ],
            [
                1, 1, 1, 1,
                1, 1, 1, 8,
            ],
        ]) {
            const spec = {
                a1: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(a1CanLoad),
                    loading: DelayedInvoker.loading(a1Load),
                }),
                a2: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(a2CanLoad),
                    loading: DelayedInvoker.loading(a2Load),
                }),
                b1: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(b1CanLoad),
                    loading: DelayedInvoker.loading(b1Load),
                }),
                b2: HookSpecs.create(1, {
                    canLoad: DelayedInvoker.canLoad(b2CanLoad),
                    loading: DelayedInvoker.loading(b2Load),
                }),
            };
            const title = Object.keys(spec).map(key => `${key}:${spec[key]}`).filter(x => x.length > 2).join(',');
            it(title, async function () {
                const { a1, a2, b1, b2 } = spec;
                let A2 = class A2 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, a2); }
                };
                A2 = __decorate([
                    customElement({ name: 'a2', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A2);
                let A1 = class A1 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, a1); }
                };
                A1 = __decorate([
                    route({ routes: [{ path: 'a2', component: A2 }] }),
                    customElement({ name: 'a1', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A1);
                let B2 = class B2 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, b2); }
                };
                B2 = __decorate([
                    customElement({ name: 'b2', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], B2);
                let B1 = class B1 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, b1); }
                };
                B1 = __decorate([
                    route({ routes: [{ path: 'b2', component: B2 }] }),
                    customElement({ name: 'b1', template: '<au-viewport></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], B1);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                };
                Root = __decorate([
                    route({
                        routes: [
                            { path: 'a1', component: A1 },
                            { path: 'b1', component: B1 },
                        ]
                    }),
                    customElement({ name: 'root', template: '<au-viewport name="$0"></au-viewport><au-viewport name="$1"></au-viewport>' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [A1, A2, B1, B2]);
                const phase1 = `('' -> 'a1@$0/a2+b1@$1/b2')`;
                mgr.setPrefix(phase1);
                await router.load('a1@$0/a2+b1@$1/b2');
                await tearDown();
                const expected = [...(function* () {
                        yield* $(`start`, 'root', 0, 'binding', 'bound', 'attaching', 'attached');
                        yield* interleave($(phase1, 'a1', a1CanLoad, 'canLoad'), $(phase1, 'b1', b1CanLoad, 'canLoad'));
                        yield* interleave($(phase1, 'a1', a1Load, 'loading'), $(phase1, 'b1', b1Load, 'loading'));
                        yield* interleave((function* () {
                            yield* $(phase1, 'a1', 1, 'binding', 'bound', 'attaching', 'attached');
                            yield* $(phase1, 'a2', a2CanLoad, 'canLoad');
                            yield* $(phase1, 'a2', a2Load, 'loading');
                            yield* $(phase1, 'a2', 1, 'binding', 'bound', 'attaching', 'attached');
                        })(), (function* () {
                            yield* $(phase1, 'b1', 1, 'binding', 'bound', 'attaching', 'attached');
                            yield* $(phase1, 'b2', b2CanLoad, 'canLoad');
                            yield* $(phase1, 'b2', b2Load, 'loading');
                            yield* $(phase1, 'b2', 1, 'binding', 'bound', 'attaching', 'attached');
                        })());
                        yield* interleave($('stop', ['a2', 'b2'], 0, 'detaching.enter'), $('stop', ['a1', 'b1'], 0, 'detaching.enter'));
                        yield* $('stop', 'root', 0, 'detaching');
                        yield* interleave($('stop', ['a2', 'a1', 'b2', 'b1'], 0, 'detaching.tick(1)'), $('stop', ['a2', 'a1', 'b2', 'b1'], 0, 'detaching.leave'));
                        yield* interleave($('stop', ['a2', 'b2'], 0, 'unbinding.enter'), $('stop', ['a1', 'b1'], 0, 'unbinding.enter'));
                        yield* $('stop', 'root', 0, 'unbinding');
                        yield* interleave($('stop', ['a2', 'a1', 'b2', 'b1'], 0, 'unbinding.tick(1)'), $('stop', ['a2', 'a1', 'b2', 'b1'], 0, 'unbinding.leave'));
                        yield* $('stop', ['root', 'a1', 'a2', 'b1', 'b2'], 0, 'dispose');
                    })()];
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
                mgr.$dispose();
            });
        }
    });
    // TODO: make these pass in firefox (firefox for some reason uses different type of stack trace - see https://app.circleci.com/pipelines/github/aurelia/aurelia/7569/workflows/60a7fb9f-e8b0-47e4-b753-eaa9b5da42c2/jobs/64147)
    if (!isFirefox()) {
        describe('error handling', function () {
            function runTest(spec) {
                it(`re-throws ${spec}`, async function () {
                    const components = spec.createCes();
                    let Root = class Root {
                    };
                    Root = __decorate([
                        route({ routes: components.map(component => ({ path: CustomElement.getDefinition(component).name, component })) }),
                        customElement({ name: 'root', template: '<au-viewport></au-viewport>' })
                    ], Root);
                    const { router, tearDown } = await createFixture(Root, components);
                    let err = void 0;
                    try {
                        await spec.action(router);
                    }
                    catch ($err) {
                        err = $err;
                    }
                    if (err === void 0) {
                        assert.fail(`Expected an error, but no error was thrown`);
                    }
                    else {
                        assert.match(err.message, spec.messageMatcher, `Expected message to match (${err.message}) matches Regexp(${spec.messageMatcher})`);
                        assert.match(err.stack, spec.stackMatcher, `Expected stack to match (${err.stack}) matches Regex(${spec.stackMatcher})`);
                    }
                    try {
                        await tearDown();
                    }
                    catch ($err) {
                        if ($err.message.includes('error in')) {
                            // The router should by default "remember" the last error and propagate it once again from the first deactivated viewport
                            // on the next shutdown attempt.
                            // This is the error we expect, so ignore it
                        }
                        else {
                            // Re-throw anything else which would not be an expected error (e.g. "unexpected state" shouldn't happen if the router handled
                            // the last error)
                            throw $err;
                        }
                    }
                });
            }
            for (const hookName of [
                'binding',
                'bound',
                'attaching',
                'attached',
                'canLoad',
                'loading',
            ]) {
                runTest({
                    createCes() {
                        return [CustomElement.define({ name: 'a', template: null }, class Target {
                                async [hookName]() {
                                    throw new Error(`error in ${hookName}`);
                                }
                            })];
                    },
                    async action(router) {
                        await router.load('a');
                    },
                    messageMatcher: new RegExp(`error in ${hookName}`),
                    stackMatcher: new RegExp(`Target.${hookName}`),
                    toString() {
                        return String(this.messageMatcher);
                    },
                });
            }
            for (const hookName of [
                'detaching',
                'unbinding',
                'canUnload',
                'unloading',
            ]) {
                const throwsInTarget1 = ['canUnload'].includes(hookName);
                runTest({
                    createCes() {
                        const target1 = CustomElement.define({ name: 'a', template: null }, class Target1 {
                            async [hookName]() {
                                throw new Error(`error in ${hookName}`);
                            }
                        });
                        const target2 = CustomElement.define({ name: 'b', template: null }, class Target2 {
                            async binding() { throw new Error(`error in binding`); }
                            async bound() { throw new Error(`error in bound`); }
                            async attaching() { throw new Error(`error in attaching`); }
                            async attached() { throw new Error(`error in attached`); }
                            async canLoad() { throw new Error(`error in canLoad`); }
                            async loading() { throw new Error(`error in loading`); }
                        });
                        return [target1, target2];
                    },
                    async action(router) {
                        await router.load('a');
                        await router.load('b');
                    },
                    messageMatcher: new RegExp(`error in ${throwsInTarget1 ? hookName : 'canLoad'}`),
                    stackMatcher: new RegExp(`${throwsInTarget1 ? 'Target1' : 'Target2'}.${throwsInTarget1 ? hookName : 'canLoad'}`),
                    toString() {
                        return `${String(this.messageMatcher)} with canLoad,loading,binding,bound,attaching`;
                    },
                });
            }
            for (const hookName of [
                'detaching',
                'unbinding',
                'canUnload',
                'unloading',
            ]) {
                const throwsInTarget1 = ['canUnload', 'unloading'].includes(hookName);
                runTest({
                    createCes() {
                        const target1 = CustomElement.define({ name: 'a', template: null }, class Target1 {
                            async [hookName]() {
                                throw new Error(`error in ${hookName}`);
                            }
                        });
                        const target2 = CustomElement.define({ name: 'b', template: null }, class Target2 {
                            async binding() { throw new Error(`error in binding`); }
                            async bound() { throw new Error(`error in bound`); }
                            async attaching() { throw new Error(`error in attaching`); }
                            async attached() { throw new Error(`error in attached`); }
                            async loading() { throw new Error(`error in loading`); }
                        });
                        return [target1, target2];
                    },
                    async action(router) {
                        await router.load('a');
                        await router.load('b');
                    },
                    messageMatcher: new RegExp(`error in ${throwsInTarget1 ? hookName : 'loading'}`),
                    stackMatcher: new RegExp(`${throwsInTarget1 ? 'Target1' : 'Target2'}.${throwsInTarget1 ? hookName : 'loading'}`),
                    toString() {
                        return `${String(this.messageMatcher)} with loading,binding,bound,attaching`;
                    },
                });
            }
            for (const hookName of [
                'detaching',
                'unbinding',
            ]) {
                runTest({
                    createCes() {
                        const target1 = CustomElement.define({ name: 'a', template: null }, class Target1 {
                            async [hookName]() {
                                throw new Error(`error in ${hookName}`);
                            }
                        });
                        const target2 = CustomElement.define({ name: 'b', template: null }, class Target2 {
                            async binding() { throw new Error(`error in binding`); }
                            async bound() { throw new Error(`error in bound`); }
                            async attaching() { throw new Error(`error in attaching`); }
                            async attached() { throw new Error(`error in attached`); }
                        });
                        return [target1, target2];
                    },
                    async action(router) {
                        await router.load('a');
                        await router.load('b');
                    },
                    messageMatcher: new RegExp(`error in ${hookName}`),
                    stackMatcher: new RegExp(`Target1.${hookName}`),
                    toString() {
                        return `${String(this.messageMatcher)} with binding,bound,attaching`;
                    },
                });
            }
        });
    }
    describe('unconfigured route', function () {
        for (const { name, routes, withInitialLoad } of [
            {
                name: 'without empty route',
                routes(...[A, B]) {
                    return [
                        { path: 'a', component: A },
                        { path: 'b', component: B },
                    ];
                },
                withInitialLoad: false,
            },
            {
                name: 'with empty route',
                routes(...[A, B]) {
                    return [
                        { path: ['', 'a'], component: A },
                        { path: 'b', component: B },
                    ];
                },
                withInitialLoad: true,
            },
            {
                name: 'with empty route - explicit redirect',
                routes(...[A, B]) {
                    return [
                        { path: '', redirectTo: 'a' },
                        { path: 'a', component: A },
                        { path: 'b', component: B },
                    ];
                },
                withInitialLoad: true,
            },
        ]) {
            it(`without fallback - single viewport - ${name}`, async function () {
                const ticks = 0;
                const hookSpec = HookSpecs.create(ticks);
                let A = class A extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                A = __decorate([
                    customElement({ name: 'a', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A);
                let B = class B extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                B = __decorate([
                    customElement({ name: 'b', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], B);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                Root = __decorate([
                    route({ routes: routes(A, B) }),
                    customElement({ name: 'root', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [A, B] /* , LogLevel.trace */);
                let phase = 'start';
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached'),
                    ...(withInitialLoad ? $(phase, 'a', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached') : [])
                ]);
                // phase 1: load unconfigured
                phase = 'phase1';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await assert.rejects(() => router.load('unconfigured'), /Neither the route 'unconfigured' matched any configured route/);
                verifyInvocationsEqual(mgr.fullNotifyHistory, []);
                // phase 2: load configured
                mgr.fullNotifyHistory.length = 0;
                phase = 'phase2';
                mgr.setPrefix(phase);
                await router.load('b');
                verifyInvocationsEqual(mgr.fullNotifyHistory, withInitialLoad
                    ? [
                        ...$(phase, 'a', ticks, 'canUnload'),
                        ...$(phase, 'b', ticks, 'canLoad'),
                        ...$(phase, 'a', ticks, 'unloading'),
                        ...$(phase, 'b', ticks, 'loading'),
                        ...$(phase, 'a', ticks, 'detaching', 'unbinding', 'dispose'),
                        ...$(phase, 'b', ticks, 'binding', 'bound', 'attaching', 'attached'),
                    ]
                    : [...$(phase, 'b', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached')]);
                // phase 3: load unconfigured1/unconfigured2
                phase = 'phase3';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await assert.rejects(() => router.load('unconfigured1/unconfigured2'), /Neither the route 'unconfigured1' matched any configured route/);
                verifyInvocationsEqual(mgr.fullNotifyHistory, []);
                // phase 4: load configured
                phase = 'phase4';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('a');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'b', ticks, 'canUnload'),
                    ...$(phase, 'a', ticks, 'canLoad'),
                    ...$(phase, 'b', ticks, 'unloading'),
                    ...$(phase, 'a', ticks, 'loading'),
                    ...$(phase, 'b', ticks, 'detaching', 'unbinding', 'dispose'),
                    ...$(phase, 'a', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // phase 5: load unconfigured/configured
                phase = 'phase5';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await assert.rejects(() => router.load('unconfigured/b'), /Neither the route 'unconfigured' matched any configured route/);
                verifyInvocationsEqual(mgr.fullNotifyHistory, []);
                // phase 6: load configured
                phase = 'phase6';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('b');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'a', ticks, 'canUnload'),
                    ...$(phase, 'b', ticks, 'canLoad'),
                    ...$(phase, 'a', ticks, 'unloading'),
                    ...$(phase, 'b', ticks, 'loading'),
                    ...$(phase, 'a', ticks, 'detaching', 'unbinding', 'dispose'),
                    ...$(phase, 'b', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // stop
                mgr.fullNotifyHistory.length = 0;
                phase = 'stop';
                await tearDown();
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, ['b', 'root'], ticks, 'detaching'),
                    ...$(phase, ['b', 'root'], ticks, 'unbinding'),
                    ...$(phase, ['root', 'b'], ticks, 'dispose'),
                ]);
                mgr.$dispose();
            });
            it(`with fallback - single viewport - ${name}`, async function () {
                const ticks = 0;
                const hookSpec = HookSpecs.create(ticks);
                let A = class A extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                A = __decorate([
                    customElement({ name: 'a', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A);
                let B = class B extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                B = __decorate([
                    customElement({ name: 'b', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], B);
                let C = class C extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                C = __decorate([
                    customElement({ name: 'c', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], C);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                Root = __decorate([
                    route({ routes: [...routes(A, B), { path: 'c', component: C }], fallback: 'c' }),
                    customElement({ name: 'root', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [A, B, C] /* , LogLevel.trace */);
                let phase = 'start';
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached'),
                    ...(withInitialLoad ? $(phase, 'a', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached') : [])
                ]);
                // phase 1: load unconfigured
                phase = 'phase1';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('unconfigured');
                verifyInvocationsEqual(mgr.fullNotifyHistory, withInitialLoad
                    ? [
                        ...$(phase, 'a', ticks, 'canUnload'),
                        ...$(phase, 'c', ticks, 'canLoad'),
                        ...$(phase, 'a', ticks, 'unloading'),
                        ...$(phase, 'c', ticks, 'loading'),
                        ...$(phase, 'a', ticks, 'detaching', 'unbinding', 'dispose'),
                        ...$(phase, 'c', ticks, 'binding', 'bound', 'attaching', 'attached'),
                    ]
                    : [...$(phase, 'c', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached')]);
                // phase 2: load configured
                mgr.fullNotifyHistory.length = 0;
                phase = 'phase2';
                mgr.setPrefix(phase);
                await router.load('b');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'c', ticks, 'canUnload'),
                    ...$(phase, 'b', ticks, 'canLoad'),
                    ...$(phase, 'c', ticks, 'unloading'),
                    ...$(phase, 'b', ticks, 'loading'),
                    ...$(phase, 'c', ticks, 'detaching', 'unbinding', 'dispose'),
                    ...$(phase, 'b', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // phase 3: load unconfigured1/unconfigured2
                phase = 'phase3';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('unconfigured1/unconfigured2'); // unconfigured2 will be discarded.
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'b', ticks, 'canUnload'),
                    ...$(phase, 'c', ticks, 'canLoad'),
                    ...$(phase, 'b', ticks, 'unloading'),
                    ...$(phase, 'c', ticks, 'loading'),
                    ...$(phase, 'b', ticks, 'detaching', 'unbinding', 'dispose'),
                    ...$(phase, 'c', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // phase 4: load configured
                phase = 'phase4';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('a');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'c', ticks, 'canUnload'),
                    ...$(phase, 'a', ticks, 'canLoad'),
                    ...$(phase, 'c', ticks, 'unloading'),
                    ...$(phase, 'a', ticks, 'loading'),
                    ...$(phase, 'c', ticks, 'detaching', 'unbinding', 'dispose'),
                    ...$(phase, 'a', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // phase 5: load unconfigured/configured
                phase = 'phase5';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('unconfigured/b'); // the configured 'b' doesn't matter due to fail-fast strategy
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'a', ticks, 'canUnload'),
                    ...$(phase, 'c', ticks, 'canLoad'),
                    ...$(phase, 'a', ticks, 'unloading'),
                    ...$(phase, 'c', ticks, 'loading'),
                    ...$(phase, 'a', ticks, 'detaching', 'unbinding', 'dispose'),
                    ...$(phase, 'c', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // phase 6: load configured
                phase = 'phase6';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('b');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, 'c', ticks, 'canUnload'),
                    ...$(phase, 'b', ticks, 'canLoad'),
                    ...$(phase, 'c', ticks, 'unloading'),
                    ...$(phase, 'b', ticks, 'loading'),
                    ...$(phase, 'c', ticks, 'detaching', 'unbinding', 'dispose'),
                    ...$(phase, 'b', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // stop
                mgr.fullNotifyHistory.length = 0;
                phase = 'stop';
                try {
                    await tearDown();
                }
                catch (e) {
                    console.log('caught post stop', e);
                }
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, ['b', 'root'], ticks, 'detaching'),
                    ...$(phase, ['b', 'root'], ticks, 'unbinding'),
                    ...$(phase, ['root', 'b'], ticks, 'dispose'),
                ]);
                mgr.$dispose();
            });
        }
        // this test sort of asserts the current "incorrect" behavior, until the "undo" (refer ViewportAgent#cancelUpdate) is implemented. TODO(sayan): implement "undo" later and refactor this test.
        it(`without fallback - sibling viewport`, async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let S1 = class S1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S1 = __decorate([
                customElement({ name: 's1', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S1);
            let S2 = class S2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S2 = __decorate([
                customElement({ name: 's2', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S2);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 's1', component: S1 },
                        { path: 's2', component: S2 },
                    ]
                }),
                customElement({ name: 'root', template: vp(2) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown } = await createFixture(Root, [S1, S2] /* , LogLevel.trace */);
            let phase = 'start';
            verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached')]);
            // phase 1: load unconfigured
            phase = 'phase1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await assert.rejects(() => router.load('s1@$1+unconfigured@$2'), /Neither the route 'unconfigured' matched any configured route/);
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            // phase 2: load configured
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase2';
            mgr.setPrefix(phase);
            await assert.rejects(() => router.load('s1@$1+s2@$2'), /Failed to resolve VR/);
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            // stop
            mgr.fullNotifyHistory.length = 0;
            phase = 'stop';
            try {
                await tearDown();
            }
            catch (e) {
                console.error(e);
            }
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['root'], ticks, 'detaching'),
                ...$(phase, ['root'], ticks, 'unbinding'),
                ...$(phase, ['root'], ticks, 'dispose'),
            ]);
            mgr.$dispose();
        });
        it(`with fallback - single-level parent/child viewport`, async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let C1 = class C1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            C1 = __decorate([
                customElement({ name: 'c1', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], C1);
            let C2 = class C2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            C2 = __decorate([
                customElement({ name: 'c2', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], C2);
            let P = class P extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            P = __decorate([
                route({
                    routes: [
                        { path: 'c1', component: C1 },
                        { path: 'c2', component: C2 },
                    ],
                    fallback: 'c2'
                }),
                customElement({ name: 'p', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], P);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            path: 'p',
                            component: P
                        }
                    ]
                }),
                customElement({ name: 'root', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown } = await createFixture(Root, [C1, C2, P] /* , LogLevel.trace */);
            let phase = 'start';
            verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached')]);
            // phase 1: load unconfigured
            phase = 'phase1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p/unconfigured');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, ['p', 'c2'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached')]);
            // phase 2: load configured
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase2';
            mgr.setPrefix(phase);
            await router.load('p/c1');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'c2', ticks, 'canUnload'),
                ...$(phase, 'c1', ticks, 'canLoad'),
                ...$(phase, 'c2', ticks, 'unloading'),
                ...$(phase, 'c1', ticks, 'loading'),
                ...$(phase, 'c2', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'c1', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 3: load unconfigured1/unconfigured2
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase3';
            mgr.setPrefix(phase);
            await router.load('p/unconfigured1/unconfigured2');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'c1', ticks, 'canUnload'),
                ...$(phase, 'c2', ticks, 'canLoad'),
                ...$(phase, 'c1', ticks, 'unloading'),
                ...$(phase, 'c2', ticks, 'loading'),
                ...$(phase, 'c1', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'c2', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 3: load configured
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase2';
            mgr.setPrefix(phase);
            await router.load('p/c1');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'c2', ticks, 'canUnload'),
                ...$(phase, 'c1', ticks, 'canLoad'),
                ...$(phase, 'c2', ticks, 'unloading'),
                ...$(phase, 'c1', ticks, 'loading'),
                ...$(phase, 'c2', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'c1', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // stop
            mgr.fullNotifyHistory.length = 0;
            phase = 'stop';
            await tearDown();
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['c1', 'p', 'root'], ticks, 'detaching'),
                ...$(phase, ['c1', 'p', 'root'], ticks, 'unbinding'),
                ...$(phase, ['root', 'p', 'c1'], ticks, 'dispose'),
            ]);
            mgr.$dispose();
        });
        it(`with fallback - multi-level parent/child viewport`, async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let GC11 = class GC11 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC11 = __decorate([
                customElement({ name: 'gc11', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC11);
            let GC12 = class GC12 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC12 = __decorate([
                customElement({ name: 'gc12', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC12);
            let GC21 = class GC21 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC21 = __decorate([
                customElement({ name: 'gc21', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC21);
            let GC22 = class GC22 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC22 = __decorate([
                customElement({ name: 'gc22', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC22);
            let C1 = class C1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            C1 = __decorate([
                route({
                    routes: [
                        { path: 'gc11', component: GC11 },
                        { path: 'gc12', component: GC12 },
                    ],
                    fallback: 'gc11'
                }),
                customElement({ name: 'c1', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], C1);
            let C2 = class C2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            C2 = __decorate([
                route({
                    routes: [
                        { path: 'gc21', component: GC21 },
                        { path: 'gc22', component: GC22 },
                    ],
                    fallback: 'gc22'
                }),
                customElement({ name: 'c2', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], C2);
            let P = class P extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            P = __decorate([
                route({
                    routes: [
                        { path: 'c1', component: C1 },
                        { path: 'c2', component: C2 },
                    ],
                    fallback: 'c2'
                }),
                customElement({ name: 'p', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], P);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            path: 'p',
                            component: P
                        }
                    ]
                }),
                customElement({ name: 'root', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown } = await createFixture(Root, [GC11, GC12, GC21, GC22, C1, C2, P] /* , LogLevel.trace */);
            let phase = 'start';
            verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached')]);
            // phase 1: load unconfigured
            phase = 'phase1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p/unconfigured');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, ['p', 'c2'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached')]);
            // phase 2: load configured1/unconfigured
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase2';
            mgr.setPrefix(phase);
            await router.load('p/c1/unconfigured');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'c2', ticks, 'canUnload'),
                ...$(phase, 'c1', ticks, 'canLoad'),
                ...$(phase, 'c2', ticks, 'unloading'),
                ...$(phase, 'c1', ticks, 'loading'),
                ...$(phase, 'c2', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'c1', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 'gc11', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 3: load configured1/configured
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase3';
            mgr.setPrefix(phase);
            await router.load('p/c1/gc12');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc11', 'c1'], ticks, 'canUnload'),
                ...$(phase, 'gc12', ticks, 'canLoad'),
                ...$(phase, 'gc11', ticks, 'unloading'),
                ...$(phase, 'gc12', ticks, 'loading'),
                ...$(phase, 'gc11', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'gc12', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 4: load configured2/unconfigured
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase4';
            mgr.setPrefix(phase);
            await router.load('p/c2/unconfigured');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc12', 'c1'], ticks, 'canUnload'),
                ...$(phase, 'c2', ticks, 'canLoad'),
                ...$(phase, ['gc12', 'c1'], ticks, 'unloading'),
                ...$(phase, 'c2', ticks, 'loading'),
                ...$(phase, ['gc12', 'c1'], ticks, 'detaching'),
                ...$(phase, ['gc12', 'c1'], ticks, 'unbinding'),
                ...$(phase, ['c1', 'gc12'], ticks, 'dispose'),
                ...$(phase, 'c2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 'gc22', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 5: load configured2/configured
            mgr.fullNotifyHistory.length = 0;
            phase = 'phase5';
            mgr.setPrefix(phase);
            await router.load('p/c2/gc21');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc22', 'c2'], ticks, 'canUnload'),
                ...$(phase, 'gc21', ticks, 'canLoad'),
                ...$(phase, 'gc22', ticks, 'unloading'),
                ...$(phase, 'gc21', ticks, 'loading'),
                ...$(phase, 'gc22', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'gc21', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // stop
            mgr.fullNotifyHistory.length = 0;
            phase = 'stop';
            await tearDown();
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc21', 'c2', 'p', 'root'], ticks, 'detaching'),
                ...$(phase, ['gc21', 'c2', 'p', 'root'], ticks, 'unbinding'),
                ...$(phase, ['root', 'p', 'c2', 'gc21'], ticks, 'dispose'),
            ]);
            mgr.$dispose();
        });
        it(`with fallback - sibling viewport`, async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let S1 = class S1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S1 = __decorate([
                customElement({ name: 's1', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S1);
            let S2 = class S2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S2 = __decorate([
                customElement({ name: 's2', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S2);
            let S3 = class S3 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S3 = __decorate([
                customElement({ name: 's3', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S3);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 's1', component: S1 },
                        { path: 's2', component: S2 },
                        { path: 's3', component: S3 },
                    ],
                    fallback: 's2',
                }),
                customElement({ name: 'root', template: vp(2) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown } = await createFixture(Root, [S1, S2, S3] /* , LogLevel.trace */);
            let phase = 'start';
            verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached')]);
            // phase 1: load configured+unconfigured
            phase = 'phase1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('s1@$0+unconfigured@$1');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['s1', 's2'], ticks, 'canLoad'),
                ...$(phase, ['s1', 's2'], ticks, 'loading'),
                ...$(phase, ['s1', 's2'], ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 2: load unconfigured+configured
            phase = 'phase2';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('unconfigured@$0+s1@$1');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['s1', 's2'], ticks, 'canUnload'),
                ...$(phase, ['s2', 's1'], ticks, 'canLoad'),
                ...$(phase, ['s1', 's2'], ticks, 'unloading'),
                ...$(phase, ['s2', 's1'], ticks, 'loading'),
                ...$(phase, 's1', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 's2', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's1', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 3: load configured+configured
            phase = 'phase3';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('s3@$0+s2@$1');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['s2', 's1'], ticks, 'canUnload'),
                ...$(phase, ['s3', 's2'], ticks, 'canLoad'),
                ...$(phase, ['s2', 's1'], ticks, 'unloading'),
                ...$(phase, ['s3', 's2'], ticks, 'loading'),
                ...$(phase, 's2', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's3', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 's1', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's2', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // stop
            mgr.fullNotifyHistory.length = 0;
            phase = 'stop';
            await tearDown();
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['s3', 's2', 'root'], ticks, 'detaching'),
                ...$(phase, ['s3', 's2', 'root'], ticks, 'unbinding'),
                ...$(phase, ['root', 's3', 's2'], ticks, 'dispose'),
            ]);
            mgr.$dispose();
        });
        it(`with fallback - sibling + parent/child viewport`, async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let GC11 = class GC11 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC11 = __decorate([
                customElement({ name: 'gc11', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC11);
            let GC12 = class GC12 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC12 = __decorate([
                customElement({ name: 'gc12', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC12);
            let GC21 = class GC21 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC21 = __decorate([
                customElement({ name: 'gc21', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC21);
            let GC22 = class GC22 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            GC22 = __decorate([
                customElement({ name: 'gc22', template: null }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], GC22);
            let C1 = class C1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            C1 = __decorate([
                route({
                    routes: [
                        { path: 'gc11', component: GC11 },
                        { path: 'gc12', component: GC12 },
                    ],
                    fallback: 'gc11'
                }),
                customElement({ name: 'c1', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], C1);
            let C2 = class C2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            C2 = __decorate([
                route({
                    routes: [
                        { path: 'gc21', component: GC21 },
                        { path: 'gc22', component: GC22 },
                    ],
                    fallback: 'gc22'
                }),
                customElement({ name: 'c2', template: vp(1) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], C2);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 'c1', component: C1 },
                        { path: 'c2', component: C2 },
                    ],
                }),
                customElement({ name: 'root', template: vp(2) }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown } = await createFixture(Root, [C1, C2, GC11, GC12, GC21, GC22] /* , LogLevel.trace */);
            let phase = 'start';
            verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached')]);
            // phase 1
            phase = 'phase1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('c1/gc12+c2/unconfigured');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['c1', 'c2'], ticks, 'canLoad'),
                ...$(phase, ['c1', 'c2'], ticks, 'loading'),
                ...$(phase, ['c1', 'c2'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc12', 'gc22'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 2
            phase = 'phase2';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('c2/gc21+c1/unconfigured');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc12', 'gc22', 'c1', 'c2'], ticks, 'canUnload'),
                ...$(phase, ['c2', 'c1'], ticks, 'canLoad'),
                ...$(phase, ['gc12', 'c1', 'gc22', 'c2'], ticks, 'unloading'),
                ...$(phase, ['c2', 'c1'], ticks, 'loading'),
                ...$(phase, ['gc12', 'c1'], ticks, 'detaching'),
                ...$(phase, ['gc12', 'c1'], ticks, 'unbinding'),
                ...$(phase, ['c1', 'gc12'], ticks, 'dispose'),
                ...$(phase, 'c2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc22', 'c2'], ticks, 'detaching'),
                ...$(phase, ['gc22', 'c2'], ticks, 'unbinding'),
                ...$(phase, ['c2', 'gc22'], ticks, 'dispose'),
                ...$(phase, 'c1', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc21', 'gc11'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // phase 3
            phase = 'phase3';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('c1/gc12+c2/gc21');
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc21', 'gc11', 'c2', 'c1'], ticks, 'canUnload'),
                ...$(phase, ['c1', 'c2'], ticks, 'canLoad'),
                ...$(phase, ['gc21', 'c2', 'gc11', 'c1'], ticks, 'unloading'),
                ...$(phase, ['c1', 'c2'], ticks, 'loading'),
                ...$(phase, ['gc21', 'c2'], ticks, 'detaching'),
                ...$(phase, ['gc21', 'c2'], ticks, 'unbinding'),
                ...$(phase, ['c2', 'gc21'], ticks, 'dispose'),
                ...$(phase, 'c1', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc11', 'c1'], ticks, 'detaching'),
                ...$(phase, ['gc11', 'c1'], ticks, 'unbinding'),
                ...$(phase, ['c1', 'gc11'], ticks, 'dispose'),
                ...$(phase, 'c2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc12', 'gc21'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // stop
            mgr.fullNotifyHistory.length = 0;
            phase = 'stop';
            await tearDown();
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc12', 'c1', 'gc21', 'c2', 'root'], ticks, 'detaching'),
                ...$(phase, ['gc12', 'c1', 'gc21', 'c2', 'root'], ticks, 'unbinding'),
                ...$(phase, ['root', 'c1', 'gc12', 'c2', 'gc21'], ticks, 'dispose'),
            ]);
            mgr.$dispose();
        });
        for (const [name, fallback] of [['fallback same as CE name', 'nf'], ['fallback different as CE name', 'not-found']]) {
            it(`fallback defined on root - single-level parent/child viewport - ${name}`, async function () {
                const ticks = 0;
                const hookSpec = HookSpecs.create(ticks);
                let C1 = class C1 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                C1 = __decorate([
                    customElement({ name: 'c1', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], C1);
                let C2 = class C2 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                C2 = __decorate([
                    customElement({ name: 'c2', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], C2);
                let P = class P extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                P = __decorate([
                    route({
                        routes: [
                            { path: 'c1', component: C1 },
                            { path: 'c2', component: C2 },
                        ],
                    }),
                    customElement({ name: 'p', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], P);
                let NF = class NF extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                NF = __decorate([
                    customElement({ name: 'nf' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], NF);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                Root = __decorate([
                    route({
                        routes: [
                            { path: 'p', component: P },
                            { path: fallback, component: NF },
                        ],
                        fallback,
                    }),
                    customElement({ name: 'root', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [C1, C2, P, NF] /* , LogLevel.trace */);
                let phase = 'start';
                verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached')]);
                phase = 'phase1';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('p/unconfigured');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, ['p', 'nf'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached')]);
                // stop
                mgr.fullNotifyHistory.length = 0;
                phase = 'stop';
                await tearDown();
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, ['nf', 'p', 'root'], ticks, 'detaching'),
                    ...$(phase, ['nf', 'p', 'root'], ticks, 'unbinding'),
                    ...$(phase, ['root', 'p', 'nf'], ticks, 'dispose'),
                ]);
                mgr.$dispose();
            });
            it(`fallback defined on root but missing on some nodes on downstream - multi-level parent/child viewport - ${name}`, async function () {
                const ticks = 0;
                const hookSpec = HookSpecs.create(ticks);
                let GC1 = class GC1 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                GC1 = __decorate([
                    customElement({ name: 'gc1', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], GC1);
                let GC21 = class GC21 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                GC21 = __decorate([
                    customElement({ name: 'gc21', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], GC21);
                let GC22 = class GC22 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                GC22 = __decorate([
                    customElement({ name: 'gc22', template: null }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], GC22);
                let C1 = class C1 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                C1 = __decorate([
                    route({
                        routes: [
                            { path: 'gc1', component: GC1 },
                        ]
                    }),
                    customElement({ name: 'c1', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], C1);
                let C2 = class C2 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                C2 = __decorate([
                    route({
                        routes: [
                            { path: 'gc21', component: GC21 },
                            { path: 'gc22', component: GC22 },
                        ],
                        fallback: 'gc22'
                    }),
                    customElement({ name: 'c2', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], C2);
                let P = class P extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                P = __decorate([
                    route({
                        routes: [
                            { path: 'c1', component: C1 },
                            { path: 'c2', component: C2 },
                        ],
                    }),
                    customElement({ name: 'p', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], P);
                let NF = class NF extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                NF = __decorate([
                    customElement({ name: 'nf' }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], NF);
                let Root = class Root extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                Root = __decorate([
                    route({
                        routes: [
                            { path: 'p', component: P },
                            { path: fallback, component: NF },
                        ],
                        fallback,
                    }),
                    customElement({ name: 'root', template: vp(1) }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root);
                const { router, mgr, tearDown } = await createFixture(Root, [GC1, GC21, GC22, C1, C2, P, NF] /* , LogLevel.trace */);
                let phase = 'start';
                verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, 'root', ticks, 'binding', 'bound', 'attaching', 'attached')]);
                phase = 'phase1';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('p/c1/unconfigured');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [...$(phase, ['p', 'c1', 'nf'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached')]);
                phase = 'phase2';
                mgr.fullNotifyHistory.length = 0;
                mgr.setPrefix(phase);
                await router.load('p/c2/unconfigured');
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, ['nf', 'c1'], ticks, 'canUnload'),
                    ...$(phase, 'c2', ticks, 'canLoad'),
                    ...$(phase, ['nf', 'c1'], ticks, 'unloading'),
                    ...$(phase, 'c2', ticks, 'loading'),
                    ...$(phase, ['nf', 'c1'], ticks, 'detaching'),
                    ...$(phase, ['nf', 'c1'], ticks, 'unbinding'),
                    ...$(phase, ['c1', 'nf'], ticks, 'dispose'),
                    ...$(phase, 'c2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                    ...$(phase, 'gc22', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
                ]);
                // stop
                mgr.fullNotifyHistory.length = 0;
                phase = 'stop';
                await tearDown();
                verifyInvocationsEqual(mgr.fullNotifyHistory, [
                    ...$(phase, ['gc22', 'c2', 'p', 'root'], ticks, 'detaching'),
                    ...$(phase, ['gc22', 'c2', 'p', 'root'], ticks, 'unbinding'),
                    ...$(phase, ['root', 'p', 'c2', 'gc22'], ticks, 'dispose'),
                ]);
                mgr.$dispose();
            });
        }
    });
    describe('error recovery from unconfigured route', function () {
        it('single level - single viewport', async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let A = class A extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            A = __decorate([
                customElement({ name: 'ce-a', template: 'a' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], A);
            let B = class B extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            B = __decorate([
                customElement({ name: 'ce-b', template: 'b' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], B);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'a'], component: A, title: 'A' },
                        { path: 'b', component: B, title: 'B' },
                    ]
                }),
                customElement({
                    name: 'my-app',
                    template: `
        <a href="a"></a>
        <a href="b"></a>
        <a href="c"></a>
        <au-viewport></au-viewport>
        `
                }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown, host, platform } = await createFixture(Root, [A, B] /* , LogLevel.trace */);
            const queue = platform.domWriteQueue;
            const [anchorA, anchorB, anchorC] = Array.from(host.querySelectorAll('a'));
            assert.html.textContent(host, 'a', 'load');
            let phase = 'round#1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            anchorC.click();
            await queue.yield();
            try {
                await router['currentTr'].promise;
                assert.fail('expected error');
            }
            catch { /* noop */ }
            assert.html.textContent(host, 'a', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            phase = 'round#2';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            anchorB.click();
            await queue.yield();
            await router['currentTr'].promise; // actual wait is done here
            assert.html.textContent(host, 'b', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'ce-a', ticks, 'canUnload'),
                ...$(phase, 'ce-b', ticks, 'canLoad'),
                ...$(phase, 'ce-a', ticks, 'unloading'),
                ...$(phase, 'ce-b', ticks, 'loading'),
                ...$(phase, 'ce-a', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'ce-b', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            phase = 'round#3';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            anchorC.click();
            await queue.yield();
            try {
                await router['currentTr'].promise;
                assert.fail('expected error');
            }
            catch { /* noop */ }
            assert.html.textContent(host, 'b', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            phase = 'round#4';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            anchorA.click();
            await queue.yield();
            await router['currentTr'].promise; // actual wait is done here
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'ce-b', ticks, 'canUnload'),
                ...$(phase, 'ce-a', ticks, 'canLoad'),
                ...$(phase, 'ce-b', ticks, 'unloading'),
                ...$(phase, 'ce-a', ticks, 'loading'),
                ...$(phase, 'ce-b', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'ce-a', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            phase = 'round#5';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('c');
                assert.fail('expected error');
            }
            catch { /* noop */ }
            assert.html.textContent(host, 'a', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            phase = 'round#6';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            anchorB.click();
            await router.load('b');
            assert.html.textContent(host, 'b', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'ce-a', ticks, 'canUnload'),
                ...$(phase, 'ce-b', ticks, 'canLoad'),
                ...$(phase, 'ce-a', ticks, 'unloading'),
                ...$(phase, 'ce-b', ticks, 'loading'),
                ...$(phase, 'ce-a', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'ce-b', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            await tearDown();
        });
        it('parent-child', async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let Gc11 = class Gc11 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc11 = __decorate([
                customElement({ name: 'gc-11', template: 'gc-11' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc11);
            let Gc12 = class Gc12 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc12 = __decorate([
                customElement({ name: 'gc-12', template: 'gc-12' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc12);
            let Gc21 = class Gc21 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc21 = __decorate([
                customElement({ name: 'gc-21', template: 'gc-21' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc21);
            let Gc22 = class Gc22 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc22 = __decorate([
                customElement({ name: 'gc-22', template: 'gc-22' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc22);
            let P1 = class P1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: 'gc-11', component: Gc11 },
                        { path: 'gc-12', component: Gc12 },
                    ]
                }),
                customElement({ name: 'p-1', template: 'p1 <au-viewport></au-viewport>' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], P1);
            let P2 = class P2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            P2 = __decorate([
                route({
                    routes: [
                        { path: 'gc-21', component: Gc21 },
                        { path: 'gc-22', component: Gc22 },
                    ]
                }),
                customElement({ name: 'p-2', template: 'p2 <au-viewport></au-viewport>' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], P2);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 'p1', component: P1 },
                        { path: 'p2', component: P2 },
                    ]
                }),
                customElement({
                    name: 'my-app',
                    template: '<au-viewport></au-viewport>'
                }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown, host, platform } = await createFixture(Root, [P1, Gc11] /* , LogLevel.trace */);
            const queue = platform.domWriteQueue;
            // load p1/gc-11
            let phase = 'round#1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p1/gc-11');
            assert.html.textContent(host, 'p1 gc-11', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['p-1', 'gc-11'], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load unconfigured
            phase = 'round#2';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('unconfigured');
                assert.fail(`${phase} - expected error`);
            }
            catch { /* noop */ }
            assert.html.textContent(host, 'p1 gc-11', `${phase} - text`);
            /**
             * Justification:
             * This is a single segment unrecognized path.
             * After the failure with recognition, the previous instruction tree is queued again.
             * As the previous path is a multi-segment path, in bottom up fashion, canUnload will be invoked,
             * because at this point the knowledge about child node is not available, as it is the case for non-eager recognition.
             * This explains the canUnload invocation.
             * On the other hand, as this is a reentry without any mismatch of parameters, the reentry behavior is set to `none`,
             * which avoids invoking further hooks.
             */
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'gc-11', ticks, 'canUnload'),
            ]);
            // load p1/gc-12
            phase = 'round#3';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p1/gc-12');
            assert.html.textContent(host, 'p1 gc-12', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'gc-11', ticks, 'canUnload'),
                ...$(phase, 'gc-12', ticks, 'canLoad'),
                ...$(phase, 'gc-11', ticks, 'unloading'),
                ...$(phase, 'gc-12', ticks, 'loading'),
                ...$(phase, 'gc-11', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'gc-12', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load p1/unconfigured
            phase = 'round#4';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('p1/unconfigured');
                assert.fail(`${phase} - expected error`);
            }
            catch { /* noop */ }
            assert.html.textContent(host, 'p1 gc-12', `${phase} - text`);
            /**
             * Justification:
             * This is a multi-segment path where the first segment is recognized (and the same one with the current route) but the next one is unrecognized.
             * Thus, the after the first recognition, the `canUnload` hook is called on the previous child (gc-12).
             * This explains the first `canUnload` invocation.
             *
             * Next, the error is thrown due to the unconfigured 2nd segment of the path.
             * The rest is exactly same as the case explained for round#2, which explains the 2nd `canUnload` invocation as well as absence of other hook invocations.
             */
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'gc-12', ticks, 'canUnload'),
                ...$(phase, 'gc-12', ticks, 'canUnload'),
            ]);
            // load p1/gc-11
            phase = 'round#5';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p1/gc-11');
            assert.html.textContent(host, 'p1 gc-11', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 'gc-12', ticks, 'canUnload'),
                ...$(phase, 'gc-11', ticks, 'canLoad'),
                ...$(phase, 'gc-12', ticks, 'unloading'),
                ...$(phase, 'gc-11', ticks, 'loading'),
                ...$(phase, 'gc-12', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'gc-11', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load p2/unconfigured
            phase = 'round#6';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('p2/unconfigured');
                assert.fail(`${phase} - expected error`);
            }
            catch { /* noop */ }
            await queue.yield(); // wait a frame for the new transition as it is not the same promise
            assert.html.textContent(host, 'p1 gc-11', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-11', 'p-1'], ticks, 'canUnload'),
                ...$(phase, 'p-2', ticks, 'canLoad'),
                ...$(phase, ['gc-11', 'p-1'], ticks, 'unloading'),
                ...$(phase, 'p-2', ticks, 'loading'),
                ...$(phase, ['gc-11', 'p-1'], ticks, 'detaching'),
                ...$(phase, ['gc-11', 'p-1'], ticks, 'unbinding'),
                ...$(phase, ['p-1', 'gc-11'], ticks, 'dispose'),
                ...$(phase, 'p-2', ticks, /* activation -> */ 'binding', 'bound', 'attaching', 'attached', /* deactivation -> */ 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 'p-1', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 'gc-11', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load p2/gc-21
            phase = 'round#7';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('p2/gc-21');
                assert.fail(`${phase} - expected error`);
            }
            catch { /* noop */ }
            assert.html.textContent(host, 'p2 gc-21', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-11', 'p-1'], ticks, 'canUnload'),
                ...$(phase, 'p-2', ticks, 'canLoad'),
                ...$(phase, ['gc-11', 'p-1'], ticks, 'unloading'),
                ...$(phase, 'p-2', ticks, 'loading'),
                ...$(phase, ['gc-11', 'p-1'], ticks, 'detaching'),
                ...$(phase, ['gc-11', 'p-1'], ticks, 'unbinding'),
                ...$(phase, ['p-1', 'gc-11'], ticks, 'dispose'),
                ...$(phase, 'p-2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 'gc-21', ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached'),
            ]);
            await tearDown();
        });
        it('siblings', async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let S1 = class S1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S1 = __decorate([
                customElement({ name: 's1', template: 's1' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S1);
            let S2 = class S2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S2 = __decorate([
                customElement({ name: 's2', template: 's2' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S2);
            let S3 = class S3 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            S3 = __decorate([
                customElement({ name: 's3', template: 's3' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], S3);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 's1', component: S1 },
                        { path: 's2', component: S2 },
                        { path: 's3', component: S3 },
                    ]
                }),
                customElement({ name: 'root', template: 'root <au-viewport name="$1"></au-viewport><au-viewport name="$2"></au-viewport>' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, host, tearDown } = await createFixture(Root, [S1, S2, S3] /* , LogLevel.trace */);
            // load s1@$1+s2@$2
            let phase = 'round#1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('s1@$1+s2@$2');
            assert.html.textContent(host, 'root s1s2', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['s1', 's2'], ticks, 'canLoad'),
                ...$(phase, ['s1', 's2'], ticks, 'loading'),
                ...$(phase, ['s1', 's2'], ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load s1@$1+unconfigured@$2
            phase = 'round#2';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('s1@$1+unconfigured@$2');
                assert.fail('expected error');
            }
            catch (e) { /* noop */ }
            assert.html.textContent(host, 'root s1s2', `${phase} - text`);
            /**
             * Justification: Because of the reentry behavior set to none (due to the fact the previous instruction tree is queued again), the hooks invocations are skipped.
             */
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            // load s1@$1+s3@$2
            phase = 'round#3';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('s1@$1+s3@$2');
            assert.html.textContent(host, 'root s1s3', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, 's2', ticks, 'canUnload'),
                ...$(phase, 's3', ticks, 'canLoad'),
                ...$(phase, 's2', ticks, 'unloading'),
                ...$(phase, 's3', ticks, 'loading'),
                ...$(phase, 's2', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's3', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load unconfigured@$1+s2@$2
            phase = 'round#4';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('unconfigured@$1+s2@$2');
                assert.fail('expected error');
            }
            catch (e) { /* noop */ }
            assert.html.textContent(host, 'root s1s3', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            // load s3@$1+s2@$2
            phase = 'round#5';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('s3@$1+s2@$2');
            assert.html.textContent(host, 'root s3s2', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['s1', 's3'], ticks, 'canUnload'),
                ...$(phase, ['s3', 's2'], ticks, 'canLoad'),
                ...$(phase, ['s1', 's3'], ticks, 'unloading'),
                ...$(phase, ['s3', 's2'], ticks, 'loading'),
                ...$(phase, 's1', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's3', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 's3', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's2', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load unconfigured
            phase = 'round#6';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('unconfigured');
                assert.fail('expected error');
            }
            catch (e) { /* noop */ }
            assert.html.textContent(host, 'root s3s2', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, []);
            // load s2@$1+s1@$2
            phase = 'round#7';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('s2@$1+s1@$2');
            assert.html.textContent(host, 'root s2s1', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['s3', 's2'], ticks, 'canUnload'),
                ...$(phase, ['s2', 's1'], ticks, 'canLoad'),
                ...$(phase, ['s3', 's2'], ticks, 'unloading'),
                ...$(phase, ['s2', 's1'], ticks, 'loading'),
                ...$(phase, 's3', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, 's2', ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, 's1', ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            await tearDown();
        });
        it('parentsiblings-childsiblings', async function () {
            const ticks = 0;
            const hookSpec = HookSpecs.create(ticks);
            let Gc11 = class Gc11 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc11 = __decorate([
                customElement({ name: 'gc-11', template: 'gc-11' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc11);
            let Gc12 = class Gc12 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc12 = __decorate([
                customElement({ name: 'gc-12', template: 'gc-12' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc12);
            let Gc13 = class Gc13 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc13 = __decorate([
                customElement({ name: 'gc-13', template: 'gc-13' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc13);
            let Gc21 = class Gc21 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc21 = __decorate([
                customElement({ name: 'gc-21', template: 'gc-21' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc21);
            let Gc22 = class Gc22 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc22 = __decorate([
                customElement({ name: 'gc-22', template: 'gc-22' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc22);
            let Gc23 = class Gc23 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Gc23 = __decorate([
                customElement({ name: 'gc-23', template: 'gc-23' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Gc23);
            let P1 = class P1 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            P1 = __decorate([
                route({
                    routes: [
                        { path: 'gc-11', component: Gc11 },
                        { path: 'gc-12', component: Gc12 },
                        { path: 'gc-13', component: Gc13 },
                    ]
                }),
                customElement({ name: 'p-1', template: 'p1 <au-viewport name="$1"></au-viewport><au-viewport name="$2"></au-viewport>' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], P1);
            let P2 = class P2 extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            P2 = __decorate([
                route({
                    routes: [
                        { path: 'gc-21', component: Gc21 },
                        { path: 'gc-22', component: Gc22 },
                        { path: 'gc-23', component: Gc23 },
                    ]
                }),
                customElement({ name: 'p-2', template: 'p2 <au-viewport name="$1"></au-viewport><au-viewport name="$2"></au-viewport>' }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], P2);
            let Root = class Root extends TestVM {
                constructor(mgr, p) { super(mgr, p, hookSpec); }
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 'p1', component: P1 },
                        { path: 'p2', component: P2 },
                    ]
                }),
                customElement({
                    name: 'my-app',
                    template: '<au-viewport name="$1"></au-viewport> <au-viewport name="$2"></au-viewport>'
                }),
                __param(0, INotifierManager),
                __param(1, IPlatform),
                __metadata("design:paramtypes", [Object, Object])
            ], Root);
            const { router, mgr, tearDown, host, platform } = await createFixture(Root, [P1, Gc11] /* , LogLevel.trace */);
            const queue = platform.domWriteQueue;
            // load p1@$1/(gc-11@$1+gc-12@$2)+p2@$2/(gc-21@$1+gc-22@$2)
            let phase = 'round#1';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p1@$1/(gc-11@$1+gc-12@$2)+p2@$2/(gc-21@$1+gc-22@$2)');
            assert.html.textContent(host, 'p1 gc-11gc-12 p2 gc-21gc-22', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['p-1', 'p-2'], ticks, 'canLoad'),
                ...$(phase, ['p-1', 'p-2'], ticks, 'loading'),
                ...$(phase, ['p-1', 'p-2'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'canLoad'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'loading'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-21', 'gc-22'], ticks, 'canLoad'),
                ...$(phase, ['gc-21', 'gc-22'], ticks, 'loading'),
                ...$(phase, ['gc-21', 'gc-22'], ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load unconfigured
            phase = 'round#2';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('unconfigured');
                assert.fail(`${phase} - expected error`);
            }
            catch { /* noop */ }
            assert.html.textContent(host, 'p1 gc-11gc-12 p2 gc-21gc-22', `${phase} - text`);
            /**
             * Justification:
             * This is a single segment unrecognized path.
             * After the failure with recognition, the previous instruction tree is queued again.
             * As the previous path is a multi-segment path, in bottom up fashion, canUnload will be invoked,
             * because at this point the knowledge about child node is not available, as it is the case for non-eager recognition.
             * This explains the canUnload invocation.
             * On the other hand, as this is a reentry without any mismatch of parameters, the reentry behavior is set to `none`,
             * which avoids invoking further hooks.
             */
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-11', 'gc-12', 'gc-21', 'gc-22'], ticks, 'canUnload'),
            ]);
            // load p2@$1/(gc-22@$1+gc-21@$2)+p1@$2/(gc-12@$1+gc-11@$2)
            phase = 'round#3';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p2@$1/(gc-22@$1+gc-21@$2)+p1@$2/(gc-12@$1+gc-11@$2)');
            assert.html.textContent(host, 'p2 gc-22gc-21 p1 gc-12gc-11', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-11', 'gc-12', 'gc-21', 'gc-22', 'p-1', 'p-2'], ticks, 'canUnload'),
                ...$(phase, ['p-2', 'p-1'], ticks, 'canLoad'),
                ...$(phase, ['gc-11', 'gc-12', 'p-1', 'gc-21', 'gc-22', 'p-2'], ticks, 'unloading'),
                ...$(phase, ['p-2', 'p-1'], ticks, 'loading'),
                ...$(phase, ['gc-11', 'gc-12', 'p-1'], ticks, 'detaching'),
                ...$(phase, ['gc-11', 'gc-12', 'p-1'], ticks, 'unbinding'),
                ...$(phase, ['p-1', 'gc-11', 'gc-12'], ticks, 'dispose'),
                ...$(phase, 'p-2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-21', 'gc-22', 'p-2'], ticks, 'detaching'),
                ...$(phase, ['gc-21', 'gc-22', 'p-2'], ticks, 'unbinding'),
                ...$(phase, ['p-2', 'gc-21', 'gc-22'], ticks, 'dispose'),
                ...$(phase, 'p-1', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'canLoad'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'loading'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'canLoad'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'loading'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load p1@$1/(gc-11@$1+gc-12@$2)+p2@$2/(gc-21@$1+unconfigured@$2)
            phase = 'round#4';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('p1@$1/(gc-11@$1+gc-12@$2)+p2@$2/(gc-21@$1+unconfigured@$2)');
                assert.fail(`${phase} - expected error`);
            }
            catch { /* noop */ }
            await queue.yield(); // wait a frame for the new transition as it is not the same promise
            assert.html.textContent(host, 'p2 gc-22gc-21 p1 gc-12gc-11', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-22', 'gc-21', 'gc-12', 'gc-11', 'p-2', 'p-1'], ticks, 'canUnload'),
                ...$(phase, ['p-1', 'p-2'], ticks, 'canLoad'),
                ...$(phase, ['gc-22', 'gc-21', 'p-2', 'gc-12', 'gc-11', 'p-1'], ticks, 'unloading'),
                ...$(phase, ['p-1', 'p-2'], ticks, 'loading'),
                ...$(phase, ['gc-22', 'gc-21', 'p-2'], ticks, 'detaching'),
                ...$(phase, ['gc-22', 'gc-21', 'p-2'], ticks, 'unbinding'),
                ...$(phase, ['p-2', 'gc-22', 'gc-21'], ticks, 'dispose'),
                ...$(phase, 'p-1', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-12', 'gc-11', 'p-1'], ticks, 'detaching'),
                ...$(phase, ['gc-12', 'gc-11', 'p-1'], ticks, 'unbinding'),
                ...$(phase, ['p-1', 'gc-12', 'gc-11'], ticks, 'dispose'),
                ...$(phase, 'p-2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'canLoad'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'loading'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-11', 'gc-12', 'p-1', 'p-2'], ticks, 'detaching', 'unbinding', 'dispose'),
                ...$(phase, ['p-2', 'p-1'], ticks, 'canLoad'),
                ...$(phase, ['p-2', 'p-1'], ticks, 'loading'),
                ...$(phase, ['p-2', 'p-1'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'canLoad'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'loading'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'canLoad'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'loading'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load p1@$1/(gc-11@$1+gc-12@$2)+p2@$2/(gc-21@$1+gc-22@$2)
            phase = 'round#5';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p1@$1/(gc-11@$1+gc-12@$2)+p2@$2/(gc-21@$1+gc-22@$2)');
            assert.html.textContent(host, 'p1 gc-11gc-12 p2 gc-21gc-22', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-22', 'gc-21', 'gc-12', 'gc-11', 'p-2', 'p-1'], ticks, 'canUnload'),
                ...$(phase, ['p-1', 'p-2'], ticks, 'canLoad'),
                ...$(phase, ['gc-22', 'gc-21', 'p-2', 'gc-12', 'gc-11', 'p-1'], ticks, 'unloading'),
                ...$(phase, ['p-1', 'p-2'], ticks, 'loading'),
                ...$(phase, ['gc-22', 'gc-21', 'p-2'], ticks, 'detaching'),
                ...$(phase, ['gc-22', 'gc-21', 'p-2'], ticks, 'unbinding'),
                ...$(phase, ['p-2', 'gc-22', 'gc-21'], ticks, 'dispose'),
                ...$(phase, 'p-1', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-12', 'gc-11', 'p-1'], ticks, 'detaching'),
                ...$(phase, ['gc-12', 'gc-11', 'p-1'], ticks, 'unbinding'),
                ...$(phase, ['p-1', 'gc-12', 'gc-11'], ticks, 'dispose'),
                ...$(phase, 'p-2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'canLoad'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'loading'),
                ...$(phase, ['gc-11', 'gc-12'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-21', 'gc-22'], ticks, 'canLoad'),
                ...$(phase, ['gc-21', 'gc-22'], ticks, 'loading'),
                ...$(phase, ['gc-21', 'gc-22'], ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            // load p2@$1/(gc-21@$1+gc-22@$2)+unconfigured@$2
            phase = 'round#6';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            try {
                await router.load('p2@$1/(gc-21@$1+gc-22@$2)+unconfigured@$2');
                assert.fail(`${phase} - expected error`);
            }
            catch { /* noop */ }
            await queue.yield(); // wait a frame for the new transition as it is not the same promise
            assert.html.textContent(host, 'p1 gc-11gc-12 p2 gc-21gc-22', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-11', 'gc-12', 'gc-21', 'gc-22'], ticks, 'canUnload'),
            ]);
            // load p2@$1/(gc-22@$1+gc-21@$2)+p1@$2/(gc-12@$1+gc-11@$2)
            phase = 'round#7';
            mgr.fullNotifyHistory.length = 0;
            mgr.setPrefix(phase);
            await router.load('p2@$1/(gc-22@$1+gc-21@$2)+p1@$2/(gc-12@$1+gc-11@$2)');
            assert.html.textContent(host, 'p2 gc-22gc-21 p1 gc-12gc-11', `${phase} - text`);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                ...$(phase, ['gc-11', 'gc-12', 'gc-21', 'gc-22', 'p-1', 'p-2'], ticks, 'canUnload'),
                ...$(phase, ['p-2', 'p-1'], ticks, 'canLoad'),
                ...$(phase, ['gc-11', 'gc-12', 'p-1', 'gc-21', 'gc-22', 'p-2'], ticks, 'unloading'),
                ...$(phase, ['p-2', 'p-1'], ticks, 'loading'),
                ...$(phase, ['gc-11', 'gc-12', 'p-1'], ticks, 'detaching'),
                ...$(phase, ['gc-11', 'gc-12', 'p-1'], ticks, 'unbinding'),
                ...$(phase, ['p-1', 'gc-11', 'gc-12'], ticks, 'dispose'),
                ...$(phase, 'p-2', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-21', 'gc-22', 'p-2'], ticks, 'detaching'),
                ...$(phase, ['gc-21', 'gc-22', 'p-2'], ticks, 'unbinding'),
                ...$(phase, ['p-2', 'gc-21', 'gc-22'], ticks, 'dispose'),
                ...$(phase, 'p-1', ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'canLoad'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'loading'),
                ...$(phase, ['gc-22', 'gc-21'], ticks, 'binding', 'bound', 'attaching', 'attached'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'canLoad'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'loading'),
                ...$(phase, ['gc-12', 'gc-11'], ticks, 'binding', 'bound', 'attaching', 'attached'),
            ]);
            await tearDown();
        });
    });
});
//# sourceMappingURL=hook-tests.spec.js.map