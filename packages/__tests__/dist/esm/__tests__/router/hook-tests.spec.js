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
import { IRouter, RouterConfiguration, } from '@aurelia/router';
import { assert, TestContext } from '@aurelia/testing';
import { translateOptions } from './_shared/create-fixture.js';
import { TestRouterConfiguration } from './_shared/configuration.js';
describe('router/hook-tests.spec.ts', function () {
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
    class HookSpecs {
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
            this.loadingDI = specs.loading.create(mgr, p);
            this.canUnloadDI = specs.canUnload.create(mgr, p);
            this.unloadingDI = specs.unloading.create(mgr, p);
            this.disposeDI = specs.dispose.create(mgr, p);
        }
        binding(i, p, f) { return this.bindingDI.invoke(this, () => { return this.$binding(i, p, f); }); }
        bound(i, p, f) { return this.boundDI.invoke(this, () => { return this.$bound(i, p, f); }); }
        attaching(i, p, f) { return this.attachingDI.invoke(this, () => { return this.$attaching(i, p, f); }); }
        attached(i, f) { return this.attachedDI.invoke(this, () => { return this.$attached(i, f); }); }
        detaching(i, p, f) { return this.detachingDI.invoke(this, () => { return this.$detaching(i, p, f); }); }
        unbinding(i, p, f) { return this.unbindingDI.invoke(this, () => { return this.$unbinding(i, p, f); }); }
        canLoad(p, n, c) { return this.canLoadDI.invoke(this, () => { return this.$canLoad(p, n, c); }); }
        loading(p, n, c) { return this.loadingDI.invoke(this, () => { return this.$loading(p, n, c); }); }
        canUnload(n, c) { return this.canUnloadDI.invoke(this, () => { return this.$canUnload(n, c); }); }
        unloading(n, c) { return this.unloadingDI.invoke(this, () => { return this.$unloading(n, c); }); }
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
    function verifyInvocationsEqual(actualRaw, expectedRaw) {
        let actual = actualRaw.map(value => value.endsWith('>') ? value.slice(0, -1) : value);
        let expected = expectedRaw.map(value => value.endsWith('>') ? value.slice(0, -1) : value).filter(value => value.length > 0);
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
    function vp(count, name = '') {
        if (count === 1) {
            return `<au-viewport${name.length > 0 ? ` name="${name}"` : ''}></au-viewport>`;
        }
        let template = '';
        for (let i = 0; i < count; ++i) {
            template = `${template}<au-viewport name="${name}$${i}"></au-viewport>`;
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
            for (let call of calls) {
                if (call === '') {
                    if (component.length > 0) {
                        yield '';
                    }
                }
                else if (typeof call === 'string') {
                    if (component.length > 0) {
                        if (!call.includes('.')) {
                            const includeNext = call.endsWith('>') ? '>' : '';
                            if (includeNext.length > 0) {
                                call = call.slice(0, -1);
                            }
                            yield component !== '-' ? `${prefix}.${component}.${call}.enter` : '';
                            if (call !== 'dispose') {
                                for (let i = 1; i <= ticks; ++i) {
                                    if (i === ticks) {
                                        yield component !== '-' ? `${prefix}.${component}.${call}.tick(${i})>` : '>';
                                    }
                                    else {
                                        yield component !== '-' ? `${prefix}.${component}.${call}.tick(${i})` : '';
                                    }
                                }
                            }
                            yield component !== '-' ? `${prefix}.${component}.${call}.leave${includeNext}` : `${includeNext}`;
                        }
                        else {
                            yield component !== '-' ? `${prefix}.${component}.${call}` : '';
                        }
                    }
                }
                else if (call != null) {
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
                    let value = next.value;
                    if (value != null) {
                        if (value.endsWith('>')) {
                            while (value.endsWith('>')) {
                                yield value;
                                value = gen.next().value;
                            }
                            yield value;
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
    async function createFixture(Component, deps, routerOptions, level = 3 /* LogLevel.warn */) {
        const ctx = TestContext.create();
        const cfg = new NotifierConfig([], 100);
        const { container, platform } = ctx;
        container.register(TestRouterConfiguration.for(ctx, level));
        container.register(Registration.instance(INotifierConfig, cfg));
        container.register(RouterConfiguration.customize(translateOptions({ ...routerOptions })));
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
    function $forEachRouterOptions(cb) {
        return function () {
            for (const resolutionMode of [
                'dynamic',
                'static',
            ]) {
                for (const swapStrategy of [
                    'parallel-remove-first',
                    'sequential-add-first',
                    'sequential-remove-first',
                ]) {
                    describe(`resolution:'${resolutionMode}', swap:'${swapStrategy}'`, function () {
                        cb({
                            resolutionMode,
                            swapStrategy,
                        });
                    });
                }
            }
        };
    }
    function forEachRouterOptions(title, cb) {
        describe(title, $forEachRouterOptions(cb));
    }
    forEachRouterOptions.skip = function (title, cb) {
        describe.skip(title, $forEachRouterOptions(cb));
    };
    forEachRouterOptions.only = function (title, cb) {
        describe.only(title, $forEachRouterOptions(cb));
    };
    describe('router hooks', function () {
        forEachRouterOptions('monomorphic timings', function (opts) {
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
                    customElement({ name: 'root1', template: vp(1, 'root1') }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], Root1);
                let A11 = class A11 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                A11 = __decorate([
                    customElement({ name: 'a11', template: vp(1, 'in-a11') }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A11);
                let A12 = class A12 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                A12 = __decorate([
                    customElement({ name: 'a12', template: vp(1, 'in-a12') }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A12);
                let A13 = class A13 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                A13 = __decorate([
                    customElement({ name: 'a13', template: vp(1, 'in-a13') }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A13);
                let A14 = class A14 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                A14 = __decorate([
                    customElement({ name: 'a14', template: vp(1, 'in-a14') }),
                    __param(0, INotifierManager),
                    __param(1, IPlatform),
                    __metadata("design:paramtypes", [Object, Object])
                ], A14);
                const A1 = [A11, A12, A13, A14];
                let Root2 = class Root2 extends TestVM {
                    constructor(mgr, p) { super(mgr, p, hookSpec); }
                };
                Root2 = __decorate([
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
                                const { router, mgr, tearDown } = await createFixture(Root1, A, opts);
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
                                                yield* $('start', 'root1', ticks, 'binding', 'bound', 'attaching', 'attached');
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
                                                    switch (opts.swapStrategy) {
                                                        case 'parallel-remove-first':
                                                        case 'sequential-remove-first':
                                                            yield* $(phase, $t1, ticks, 'detaching', 'unbinding', 'dispose');
                                                            yield* $(phase, $t2, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                            break;
                                                        case 'sequential-add-first':
                                                            yield* $(phase, $t2, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                            yield* $(phase, $t1, ticks, 'detaching', 'unbinding', 'dispose');
                                                            break;
                                                    }
                                                }
                                                yield* $('stop', [t4, 'root1'], ticks, 'detaching');
                                                yield* $('stop', [t4, 'root1'], ticks, 'unbinding');
                                                yield* $('stop', ['root1', t4], ticks, 'dispose');
                                                break;
                                            case 1:
                                                yield* $('start', 'root1', ticks, 'binding', 'bound', 'attaching', 'attached');
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
                                                    switch (opts.swapStrategy) {
                                                        case 'parallel-remove-first':
                                                            yield* interleave($(phase, $t1, ticks, 'detaching', 'unbinding', 'dispose'), $(phase, $t2, ticks, 'binding', 'bound', 'attaching', 'attached'));
                                                            break;
                                                        case 'sequential-remove-first':
                                                            yield* $(phase, $t1, ticks, 'detaching', 'unbinding', 'dispose');
                                                            yield* $(phase, $t2, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                            break;
                                                        case 'sequential-add-first':
                                                            yield* $(phase, $t2, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                            yield* $(phase, $t1, ticks, 'detaching', 'unbinding', 'dispose');
                                                            break;
                                                    }
                                                }
                                                yield* interleave($('stop', t4, ticks, 'detaching', 'unbinding'), $('stop', 'root1', ticks, 'detaching', 'unbinding'));
                                                yield* $('stop', 'root1', ticks, 'dispose');
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
                                const { router, mgr, tearDown } = await createFixture(Root2, A, opts);
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
                                                switch (opts.resolutionMode) {
                                                    case 'dynamic':
                                                        yield* $(phase1, [t1.vp0, t1.vp1], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                        break;
                                                    case 'static':
                                                        yield* $(phase1, [t1.vp0, t1.vp1], ticks, 'canLoad');
                                                        yield* $(phase1, [t1.vp0, t1.vp1], ticks, 'loading');
                                                        yield* $(phase1, [t1.vp0, t1.vp1], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                        break;
                                                }
                                                for (const [phase, { $t1, $t2 }] of [
                                                    [phase2, { $t1: t1, $t2: t2 }],
                                                    [phase3, { $t1: t2, $t2: t1 }],
                                                    [phase4, { $t1: t1, $t2: t2 }],
                                                ]) {
                                                    const firstVp = $t2.vp0 ? 'vp0' : 'vp1';
                                                    const secondVp = { vp0: 'vp1', vp1: 'vp0' }[firstVp];
                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                        yield* $(phase, $t1[firstVp], ticks, 'canUnload');
                                                    }
                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                        yield* $(phase, $t1[secondVp], ticks, 'canUnload');
                                                    }
                                                    switch (opts.resolutionMode) {
                                                        case 'dynamic':
                                                            if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t2[firstVp], ticks, 'canLoad');
                                                            }
                                                            if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t1[firstVp], ticks, 'unloading');
                                                            }
                                                            if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t2[firstVp], ticks, 'loading');
                                                            }
                                                            switch (opts.swapStrategy) {
                                                                case 'parallel-remove-first':
                                                                case 'sequential-remove-first':
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    break;
                                                                case 'sequential-add-first':
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    break;
                                                            }
                                                            if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t2[secondVp], ticks, 'canLoad');
                                                            }
                                                            if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t1[secondVp], ticks, 'unloading');
                                                            }
                                                            if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t2[secondVp], ticks, 'loading');
                                                            }
                                                            switch (opts.swapStrategy) {
                                                                case 'parallel-remove-first':
                                                                case 'sequential-remove-first':
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    break;
                                                                case 'sequential-add-first':
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    break;
                                                            }
                                                            break;
                                                        case 'static':
                                                            if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t2[firstVp], ticks, 'canLoad');
                                                            }
                                                            if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t2[secondVp], ticks, 'canLoad');
                                                            }
                                                            if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t1[firstVp], ticks, 'unloading');
                                                            }
                                                            if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t1[secondVp], ticks, 'unloading');
                                                            }
                                                            if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t2[firstVp], ticks, 'loading');
                                                            }
                                                            if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t2[secondVp], ticks, 'loading');
                                                            }
                                                            switch (opts.swapStrategy) {
                                                                case 'parallel-remove-first':
                                                                case 'sequential-remove-first':
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    break;
                                                                case 'sequential-add-first':
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    break;
                                                            }
                                                            switch (opts.swapStrategy) {
                                                                case 'parallel-remove-first':
                                                                case 'sequential-remove-first':
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    break;
                                                                case 'sequential-add-first':
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    }
                                                                    if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    }
                                                                    break;
                                                            }
                                                            break;
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
                                                    const firstVp = $t2.vp0 && ($t1.vp0 !== $t2.vp0) ? 'vp0' : 'vp1';
                                                    const secondVp = { vp0: 'vp1', vp1: 'vp0' }[firstVp];
                                                    yield* interleave((function* () { if ($t1[firstVp] !== $t2[firstVp]) {
                                                        yield* $(phase, $t1[firstVp], ticks, 'canUnload');
                                                    } })(), (function* () { if ($t1[secondVp] !== $t2[secondVp]) {
                                                        yield* $(phase, $t1[secondVp], ticks, 'canUnload');
                                                    } })());
                                                    switch (opts.resolutionMode) {
                                                        case 'dynamic':
                                                            switch (opts.swapStrategy) {
                                                                case 'parallel-remove-first': {
                                                                    function* routingHooks(vp, action) {
                                                                        const t1 = action === 'remove' ? $t1[vp] : ($t1[vp] ? '-' : '');
                                                                        const t2 = action === 'add' ? $t2[vp] : ($t2[vp] ? '-' : '');
                                                                        if ($t1[vp] !== $t2[vp]) {
                                                                            yield* $(phase, t2, ticks, 'canLoad');
                                                                        }
                                                                        if ($t1[vp] !== $t2[vp]) {
                                                                            yield* $(phase, t1, ticks, 'unloading');
                                                                        }
                                                                        if ($t1[vp] !== $t2[vp]) {
                                                                            yield* $(phase, t2, ticks, 'loading');
                                                                        }
                                                                    }
                                                                    yield* interleave((function* () {
                                                                        yield* routingHooks(firstVp, 'remove');
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                    })(), (function* () {
                                                                        yield* routingHooks(firstVp, 'add');
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                    })(), (function* () {
                                                                        yield* routingHooks(secondVp, 'remove');
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                    })(), (function* () {
                                                                        yield* routingHooks(secondVp, 'add');
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                    })());
                                                                    break;
                                                                }
                                                                case 'sequential-remove-first':
                                                                    yield* interleave((function* () {
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'canLoad');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t1[firstVp], ticks, 'unloading');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'loading');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                    })(), (function* () {
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'canLoad');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t1[secondVp], ticks, 'unloading');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'loading');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                    })());
                                                                    break;
                                                                case 'sequential-add-first':
                                                                    yield* interleave((function* () {
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'canLoad');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t1[firstVp], ticks, 'unloading');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'loading');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                    })(), (function* () {
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'canLoad');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t1[secondVp], ticks, 'unloading');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'loading');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                    })());
                                                                    break;
                                                            }
                                                            break;
                                                        case 'static':
                                                            yield* interleave((function* () { if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t2[firstVp], ticks, 'canLoad');
                                                            } })(), (function* () { if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t2[secondVp], ticks, 'canLoad');
                                                            } })());
                                                            yield* interleave((function* () { if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t1[firstVp], ticks, 'unloading');
                                                            } })(), (function* () { if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t1[secondVp], ticks, 'unloading');
                                                            } })());
                                                            yield* interleave((function* () { if ($t1[firstVp] !== $t2[firstVp]) {
                                                                yield* $(phase, $t2[firstVp], ticks, 'loading');
                                                            } })(), (function* () { if ($t1[secondVp] !== $t2[secondVp]) {
                                                                yield* $(phase, $t2[secondVp], ticks, 'loading');
                                                            } })());
                                                            switch (opts.swapStrategy) {
                                                                case 'parallel-remove-first':
                                                                    yield* interleave((function* () { if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    } })(), (function* () { if ($t1[firstVp] !== $t2[firstVp]) {
                                                                        yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    } })(), (function* () { if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                    } })(), (function* () { if ($t1[secondVp] !== $t2[secondVp]) {
                                                                        yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                    } })());
                                                                    break;
                                                                case 'sequential-remove-first':
                                                                    yield* interleave((function* () {
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                    })(), (function* () {
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                    })());
                                                                    break;
                                                                case 'sequential-add-first':
                                                                    yield* interleave((function* () {
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t2[firstVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                        if ($t1[firstVp] !== $t2[firstVp]) {
                                                                            yield* $(phase, $t1[firstVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                    })(), (function* () {
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t2[secondVp], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        }
                                                                        if ($t1[secondVp] !== $t2[secondVp]) {
                                                                            yield* $(phase, $t1[secondVp], ticks, 'detaching', 'unbinding', 'dispose');
                                                                        }
                                                                    })());
                                                                    break;
                                                            }
                                                            break;
                                                    }
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
                        for (const { t1, t2 } of [
                            // Only parent changes with every nav
                            { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a13', c: 'a12' } },
                            { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a12', c: 'a12' } },
                            { t1: { p: 'a12', c: 'a12' }, t2: { p: 'a11', c: 'a12' } },
                            // Only child changes with every nav
                            { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a11', c: 'a02' } },
                            { t1: { p: 'a11', c: '' }, t2: { p: 'a11', c: 'a02' } },
                            { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a11', c: '' } },
                            { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a11', c: 'a02' } },
                            { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a11', c: '' } },
                            { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a11', c: 'a11' } },
                            { t1: { p: 'a11', c: '' }, t2: { p: 'a11', c: 'a11' } },
                            // Both parent and child change with every nav
                            { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a12', c: 'a02' } },
                            { t1: { p: 'a11', c: '' }, t2: { p: 'a12', c: 'a02' } },
                            { t1: { p: 'a11', c: 'a01' }, t2: { p: 'a12', c: '' } },
                            { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a12', c: 'a02' } },
                            { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a12', c: 'a12' } },
                            { t1: { p: 'a11', c: 'a11' }, t2: { p: 'a12', c: '' } },
                            { t1: { p: 'a12', c: 'a02' }, t2: { p: 'a11', c: 'a11' } },
                            { t1: { p: 'a12', c: 'a12' }, t2: { p: 'a11', c: 'a11' } },
                            { t1: { p: 'a12', c: '' }, t2: { p: 'a11', c: 'a11' } },
                            { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a13', c: 'a14' } },
                            { t1: { p: 'a11', c: 'a12' }, t2: { p: 'a13', c: 'a11' } },
                            { t1: { p: 'a13', c: 'a14' }, t2: { p: 'a11', c: 'a12' } },
                            { t1: { p: 'a13', c: 'a11' }, t2: { p: 'a11', c: 'a12' } },
                        ]) {
                            const instr1 = join('/', t1.p, t1.c);
                            const instr2 = join('/', t2.p, t2.c);
                            it(`${instr1}' -> '${instr2}' -> '${instr1}' -> '${instr2}'`, async function () {
                                const { router, mgr, tearDown } = await createFixture(Root1, A, opts);
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
                                                yield* $('start', 'root1', ticks, 'binding', 'bound', 'attaching', 'attached');
                                                switch (opts.resolutionMode) {
                                                    case 'dynamic':
                                                        yield* $(phase1, [t1.p, t1.c], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                        break;
                                                    case 'static':
                                                        yield* $(phase1, [t1.p, t1.c], ticks, 'canLoad');
                                                        yield* $(phase1, [t1.p, t1.c], ticks, 'loading');
                                                        yield* $(phase1, [t1.p, t1.c], ticks, 'binding', 'bound', 'attaching', 'attached');
                                                        break;
                                                }
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
                                                        switch (opts.swapStrategy) {
                                                            case 'parallel-remove-first':
                                                            case 'sequential-remove-first':
                                                                yield* $(phase, $t1.c, ticks, 'detaching', 'unbinding', 'dispose');
                                                                yield* $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                break;
                                                            case 'sequential-add-first':
                                                                yield* $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                yield* $(phase, $t1.c, ticks, 'detaching', 'unbinding', 'dispose');
                                                                break;
                                                        }
                                                    }
                                                    else {
                                                        yield* $(phase, [$t1.c, $t1.p], ticks, 'canUnload');
                                                        yield* $(phase, $t2.p, ticks, 'canLoad');
                                                        switch (opts.resolutionMode) {
                                                            case 'dynamic':
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'unloading');
                                                                yield* $(phase, $t2.p, ticks, 'loading');
                                                                break;
                                                            case 'static':
                                                                yield* $(phase, $t2.c, ticks, 'canLoad');
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'unloading');
                                                                yield* $(phase, [$t2.p, $t2.c], ticks, 'loading');
                                                                break;
                                                        }
                                                        switch (opts.swapStrategy) {
                                                            case 'parallel-remove-first':
                                                            case 'sequential-remove-first':
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'detaching');
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'unbinding');
                                                                yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                                yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                break;
                                                            case 'sequential-add-first':
                                                                yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'detaching');
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'unbinding');
                                                                yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                                break;
                                                        }
                                                        switch (opts.resolutionMode) {
                                                            case 'dynamic':
                                                                yield* $(phase, $t2.c, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                                break;
                                                            case 'static':
                                                                yield* $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                break;
                                                        }
                                                    }
                                                }
                                                yield* $('stop', [t2.c, t2.p, 'root1'], ticks, 'detaching');
                                                yield* $('stop', [t2.c, t2.p, 'root1'], ticks, 'unbinding');
                                                yield* $('stop', ['root1', t2.p, t2.c], ticks, 'dispose');
                                                break;
                                            case 1:
                                                yield* $('start', 'root1', ticks, 'binding', 'bound', 'attaching', 'attached');
                                                switch (opts.resolutionMode) {
                                                    case 'dynamic':
                                                        yield* $(phase1, [t1.p, t1.c], ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                        break;
                                                    case 'static':
                                                        yield* $(phase1, [t1.p, t1.c], ticks, 'canLoad');
                                                        yield* $(phase1, [t1.p, t1.c], ticks, 'loading');
                                                        yield* $(phase1, t1.p, ticks, 'binding', 'bound', 'attaching');
                                                        yield* interleave($(phase1, t1.c, ticks, 'binding', 'bound', 'attaching', 'attached'), $(phase1, t1.p, ticks, 'attached'));
                                                        break;
                                                }
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
                                                        switch (opts.swapStrategy) {
                                                            case 'parallel-remove-first':
                                                                yield* interleave($(phase, $t1.c, ticks, 'detaching', 'unbinding', 'dispose'), $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached'));
                                                                break;
                                                            case 'sequential-remove-first':
                                                                yield* $(phase, $t1.c, ticks, 'detaching', 'unbinding', 'dispose');
                                                                yield* $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                break;
                                                            case 'sequential-add-first':
                                                                yield* $(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                yield* $(phase, $t1.c, ticks, 'detaching', 'unbinding', 'dispose');
                                                                break;
                                                        }
                                                    }
                                                    else {
                                                        yield* $(phase, [$t1.c, $t1.p], ticks, 'canUnload');
                                                        yield* $(phase, $t2.p, ticks, 'canLoad');
                                                        switch (opts.resolutionMode) {
                                                            case 'dynamic':
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'unloading');
                                                                yield* $(phase, $t2.p, ticks, 'loading');
                                                                break;
                                                            case 'static':
                                                                yield* $(phase, $t2.c, ticks, 'canLoad');
                                                                yield* $(phase, [$t1.c, $t1.p], ticks, 'unloading');
                                                                yield* $(phase, [$t2.p, $t2.c], ticks, 'loading');
                                                                break;
                                                        }
                                                        switch (opts.swapStrategy) {
                                                            case 'parallel-remove-first':
                                                                yield* interleave($(phase, $t1.c, ticks, 'detaching'), $(phase, $t1.p, ticks, 'detaching'), $(phase, $t2.p, ticks, 'binding'));
                                                                yield* interleave($(phase, $t1.c, ticks, 'unbinding'), $(phase, $t1.p, ticks, 'unbinding'), $(phase, $t2.p, ticks, 'bound'));
                                                                switch (opts.resolutionMode) {
                                                                    case 'dynamic':
                                                                        yield* interleave($(phase, $t1.p, ticks, 'dispose'), $(phase, $t1.c, ticks, 'dispose'), $(phase, $t2.p, ticks, 'attaching'));
                                                                        yield* $(phase, $t2.p, ticks, 'attached');
                                                                        yield* $(phase, $t2.c, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                                        break;
                                                                    case 'static':
                                                                        yield* interleave($(phase, $t1.p, ticks, 'dispose'), $(phase, $t1.c, ticks, 'dispose'), $(phase, $t2.p, ticks, 'attaching'));
                                                                        yield* interleave($(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached'), $(phase, $t2.p, ticks, 'attached'));
                                                                        break;
                                                                }
                                                                break;
                                                            case 'sequential-remove-first':
                                                                switch (opts.resolutionMode) {
                                                                    case 'dynamic':
                                                                        yield* interleave($(phase, $t1.c, ticks, 'detaching', 'unbinding'), $(phase, $t1.p, ticks, 'detaching', 'unbinding'));
                                                                        yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                                        yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        yield* $(phase, $t2.c, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                                        break;
                                                                    case 'static':
                                                                        yield* interleave($(phase, $t1.c, ticks, 'detaching', 'unbinding'), $(phase, $t1.p, ticks, 'detaching', 'unbinding'));
                                                                        yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                                        yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching');
                                                                        yield* interleave($(phase, $t2.c, ticks, 'binding', 'bound', 'attaching', 'attached'), $(phase, $t2.p, ticks, 'attached'));
                                                                        break;
                                                                }
                                                                break;
                                                            case 'sequential-add-first':
                                                                switch (opts.resolutionMode) {
                                                                    case 'dynamic':
                                                                        yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching', 'attached');
                                                                        yield* interleave($(phase, $t1.c, ticks, 'detaching', 'unbinding'), $(phase, $t1.p, ticks, 'detaching', 'unbinding'));
                                                                        yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                                        yield* $(phase, $t2.c, ticks, 'canLoad', 'loading', 'binding', 'bound', 'attaching', 'attached');
                                                                        break;
                                                                    case 'static':
                                                                        yield* $(phase, $t2.p, ticks, 'binding', 'bound', 'attaching');
                                                                        yield* interleave($(phase, $t2.c, ticks, 'binding', 'bound'), $(phase, $t2.p, ticks, 'attached'));
                                                                        yield* interleave($(phase, $t1.c, ticks, 'detaching', 'unbinding'), $(phase, $t1.p, ticks, 'detaching', 'unbinding'), $(phase, $t2.c, ticks, 'attaching', 'attached'));
                                                                        yield* $(phase, [$t1.p, $t1.c], ticks, 'dispose');
                                                                        break;
                                                                }
                                                                break;
                                                        }
                                                    }
                                                }
                                                yield* interleave($('stop', t2.c, ticks, 'detaching', 'unbinding'), $('stop', t2.p, ticks, 'detaching', 'unbinding'), $('stop', 'root1', ticks, 'detaching', 'unbinding'));
                                                yield* $('stop', ['root1', t2.p, t2.c], ticks, 'dispose');
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
        forEachRouterOptions('parent-child timings', function (opts) {
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
                    let Root = class Root extends TestVM {
                        constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                    };
                    Root = __decorate([
                        customElement({ name: 'root', template: '<au-viewport name="in-root"></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], Root);
                    let A = class A extends TestVM {
                        constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                    };
                    A = __decorate([
                        customElement({ name: 'a', template: '<au-viewport name="in-a"></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], A);
                    let B = class B extends TestVM {
                        constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                    };
                    B = __decorate([
                        customElement({ name: 'b', template: '<au-viewport name="in-b"></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], B);
                    let C = class C extends TestVM {
                        constructor(mgr, p) { super(mgr, p, hookSpec); }
                    };
                    C = __decorate([
                        customElement({ name: 'c', template: '<au-viewport name="in-c"></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], C);
                    let D = class D extends TestVM {
                        constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                    };
                    D = __decorate([
                        customElement({ name: 'd', template: null }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], D);
                    const { router, mgr, tearDown } = await createFixture(Root, [A, B, C, D], opts);
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
                            switch (opts.resolutionMode) {
                                case 'dynamic':
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
                                    break;
                                case 'static':
                                    switch (hookName) {
                                        case 'canLoad':
                                            yield* $(phase1, ['a', 'b'], 0, 'canLoad');
                                            yield* $(phase1, 'c', 1, 'canLoad');
                                            yield* $(phase1, 'd', 0, 'canLoad');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'loading');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'binding', 'bound', 'attaching', 'attached');
                                            break;
                                        case 'loading':
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'canLoad');
                                            yield* $(phase1, ['a', 'b'], 0, 'loading');
                                            yield* $(phase1, 'c', 1, 'loading');
                                            yield* $(phase1, 'd', 0, 'loading');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'binding', 'bound', 'attaching', 'attached');
                                            break;
                                        case 'binding':
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'canLoad');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'loading');
                                            yield* $(phase1, ['a', 'b'], 0, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, 'c', 1, 'binding');
                                            yield* $(phase1, 'c', 0, 'bound', 'attaching', 'attached');
                                            yield* $(phase1, 'd', 0, 'binding', 'bound', 'attaching', 'attached');
                                            break;
                                        case 'bound':
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'canLoad');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'loading');
                                            yield* $(phase1, ['a', 'b'], 0, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, 'c', 0, 'binding');
                                            yield* $(phase1, 'c', 1, 'bound');
                                            yield* $(phase1, 'c', 0, 'attaching', 'attached');
                                            yield* $(phase1, 'd', 0, 'binding', 'bound', 'attaching', 'attached');
                                            break;
                                        case 'attaching':
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'canLoad');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'loading');
                                            yield* $(phase1, ['a', 'b'], 0, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, 'c', 0, 'binding', 'bound');
                                            yield* $(phase1, 'c', 0, 'attaching.enter');
                                            yield* $(phase1, 'd', 0, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, 'c', 0, 'attaching.tick(1)', 'attaching.leave', 'attached');
                                            break;
                                        case 'attached':
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'canLoad');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'loading');
                                            yield* $(phase1, ['a', 'b'], 0, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, 'c', 0, 'binding', 'bound', 'attaching');
                                            yield* $(phase1, 'c', 0, 'attached.enter');
                                            yield* $(phase1, 'd', 0, 'binding', 'bound', 'attaching', 'attached');
                                            yield* $(phase1, 'c', 0, 'attached.tick(1)', 'attached.leave');
                                            break;
                                        default:
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'canLoad');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'loading');
                                            yield* $(phase1, ['a', 'b', 'c', 'd'], 0, 'binding', 'bound', 'attaching', 'attached');
                                            break;
                                    }
                                    break;
                            }
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
        forEachRouterOptions('single incoming sibling transition', function (opts) {
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
                    let Root = class Root extends TestVM {
                        constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                    };
                    Root = __decorate([
                        customElement({ name: 'root', template: '<au-viewport name="$0"></au-viewport><au-viewport name="$1"></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], Root);
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
                    const { router, mgr, tearDown } = await createFixture(Root, [A, B], opts);
                    const phase1 = `('' -> 'a$0+b$1')`;
                    mgr.setPrefix(phase1);
                    await router.load('a@$0+b@$1');
                    await tearDown();
                    const expected = [...(function* () {
                            yield* $(`start`, 'root', 0, 'binding', 'bound', 'attaching', 'attached');
                            switch (opts.resolutionMode) {
                                case 'dynamic':
                                    yield* interleave((function* () {
                                        yield* $(phase1, 'a', aCanLoad, 'canLoad');
                                        yield* $(phase1, 'a', aLoad, 'loading');
                                        yield* $(phase1, 'a', 1, 'binding', 'bound', 'attaching', 'attached');
                                    })(), (function* () {
                                        yield* $(phase1, 'b', bCanLoad, 'canLoad');
                                        yield* $(phase1, 'b', bLoad, 'loading');
                                        yield* $(phase1, 'b', 1, 'binding', 'bound', 'attaching', 'attached');
                                    })());
                                    break;
                                case 'static':
                                    yield* interleave($(phase1, 'a', aCanLoad, 'canLoad'), $(phase1, 'b', bCanLoad, 'canLoad'));
                                    yield* interleave($(phase1, 'a', aLoad, 'loading'), $(phase1, 'b', bLoad, 'loading'));
                                    yield* interleave($(phase1, 'a', 1, 'binding', 'bound', 'attaching', 'attached'), $(phase1, 'b', 1, 'binding', 'bound', 'attaching', 'attached'));
                                    break;
                            }
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
        forEachRouterOptions('single incoming parent-child transition', function (opts) {
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
                    let Root = class Root extends TestVM {
                        constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                    };
                    Root = __decorate([
                        customElement({ name: 'root', template: '<au-viewport></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], Root);
                    let A1 = class A1 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, a1); }
                    };
                    A1 = __decorate([
                        customElement({ name: 'a1', template: '<au-viewport></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], A1);
                    let A2 = class A2 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, a2); }
                    };
                    A2 = __decorate([
                        customElement({ name: 'a2', template: null }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], A2);
                    const { router, mgr, tearDown } = await createFixture(Root, [A1, A2], opts);
                    const phase1 = `('' -> 'a1/a2')`;
                    mgr.setPrefix(phase1);
                    await router.load('a1/a2');
                    await tearDown();
                    const expected = [...(function* () {
                            yield* $(`start`, 'root', 0, 'binding', 'bound', 'attaching', 'attached');
                            switch (opts.resolutionMode) {
                                case 'dynamic':
                                    yield* $(phase1, 'a1', a1CanLoad, 'canLoad');
                                    yield* $(phase1, 'a1', a1Load, 'loading');
                                    yield* $(phase1, 'a1', 1, 'binding', 'bound', 'attaching', 'attached');
                                    yield* $(phase1, 'a2', a2CanLoad, 'canLoad');
                                    yield* $(phase1, 'a2', a2Load, 'loading');
                                    yield* $(phase1, 'a2', 1, 'binding', 'bound', 'attaching', 'attached');
                                    break;
                                case 'static':
                                    yield* $(phase1, 'a1', a1CanLoad, 'canLoad');
                                    yield* $(phase1, 'a2', a2CanLoad, 'canLoad');
                                    yield* $(phase1, 'a1', a1Load, 'loading');
                                    yield* $(phase1, 'a2', a2Load, 'loading');
                                    yield* $(phase1, 'a1', 1, 'binding', 'bound', 'attaching');
                                    yield* interleave($(phase1, 'a2', 1, 'binding', 'bound', 'attaching', 'attached'), $(phase1, 'a1', 1, 'attached'));
                                    break;
                            }
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
        forEachRouterOptions('single incoming parentsiblings-childsiblings transition', function (opts) {
            for (const [a1CanLoad, a2CanLoad, b1CanLoad, b2CanLoad, a1Load, a2Load, b1Load, b2Load,] of [
                // a1.canLoad
                [
                    2, 1, 1, 1,
                    1, 1, 1, 1,
                ],
                [
                    4, 1, 1, 1,
                    1, 1, 1, 1,
                ],
                [
                    8, 1, 1, 1,
                    1, 1, 1, 1,
                ],
                // b1.canLoad
                [
                    1, 1, 2, 1,
                    1, 1, 1, 1,
                ],
                [
                    1, 1, 4, 1,
                    1, 1, 1, 1,
                ],
                [
                    1, 1, 8, 1,
                    1, 1, 1, 1,
                ],
                // a1.load
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
                // b1.load
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
                // a2.load
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
                // b2.load
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
                    let Root = class Root extends TestVM {
                        constructor(mgr, p) { super(mgr, p, HookSpecs.create(0)); }
                    };
                    Root = __decorate([
                        customElement({ name: 'root', template: '<au-viewport name="$0"></au-viewport><au-viewport name="$1"></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], Root);
                    let A1 = class A1 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, a1); }
                    };
                    A1 = __decorate([
                        customElement({ name: 'a1', template: '<au-viewport></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], A1);
                    let A2 = class A2 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, a2); }
                    };
                    A2 = __decorate([
                        customElement({ name: 'a2', template: null }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], A2);
                    let B1 = class B1 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, b1); }
                    };
                    B1 = __decorate([
                        customElement({ name: 'b1', template: '<au-viewport></au-viewport>' }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], B1);
                    let B2 = class B2 extends TestVM {
                        constructor(mgr, p) { super(mgr, p, b2); }
                    };
                    B2 = __decorate([
                        customElement({ name: 'b2', template: null }),
                        __param(0, INotifierManager),
                        __param(1, IPlatform),
                        __metadata("design:paramtypes", [Object, Object])
                    ], B2);
                    const { router, mgr, tearDown } = await createFixture(Root, [A1, A2, B1, B2], opts);
                    const phase1 = `('' -> 'a1@$0/a2+b1@$1/b2')`;
                    mgr.setPrefix(phase1);
                    await router.load('a1@$0/a2+b1@$1/b2');
                    await tearDown();
                    const expected = [...(function* () {
                            yield* $(`start`, 'root', 0, 'binding', 'bound', 'attaching', 'attached');
                            switch (opts.resolutionMode) {
                                case 'dynamic':
                                    yield* interleave((function* () {
                                        yield* $(phase1, 'a1', a1CanLoad, 'canLoad');
                                        yield* $(phase1, 'a1', a1Load, 'loading');
                                        yield* $(phase1, 'a1', 1, 'binding', 'bound', 'attaching', 'attached');
                                    })(), (function* () {
                                        yield* $(phase1, 'b1', b1CanLoad, 'canLoad');
                                        yield* $(phase1, 'b1', b1Load, 'loading');
                                        yield* $(phase1, 'b1', 1, 'binding', 'bound', 'attaching', 'attached');
                                    })());
                                    yield* interleave((function* () {
                                        yield* $(phase1, 'a2', a2CanLoad, 'canLoad');
                                        yield* $(phase1, 'a2', a2Load, 'loading');
                                        yield* $(phase1, 'a2', 1, 'binding', 'bound', 'attaching', 'attached');
                                    })(), (function* () {
                                        yield* $(phase1, 'b2', b2CanLoad, 'canLoad');
                                        yield* $(phase1, 'b2', b2Load, 'loading');
                                        yield* $(phase1, 'b2', 1, 'binding', 'bound', 'attaching', 'attached');
                                    })());
                                    break;
                                case 'static':
                                    yield* interleave((function* () {
                                        yield* $(phase1, 'a1', a1CanLoad, 'canLoad');
                                    })(), (function* () {
                                        yield* $(phase1, 'b1', b1CanLoad, 'canLoad');
                                    })(), (function* () {
                                        yield* $(phase1, '-', a1CanLoad, 'canLoad');
                                        yield* $(phase1, 'a2', a2CanLoad, 'canLoad');
                                    })(), (function* () {
                                        yield* $(phase1, '-', b1CanLoad, 'canLoad');
                                        if (a1CanLoad > 2) {
                                            yield '';
                                        }
                                        yield* $(phase1, 'b2', b2CanLoad, 'canLoad');
                                    })());
                                    yield* interleave((function* () {
                                        yield* $(phase1, 'a1', a1Load, 'loading');
                                    })(), (function* () {
                                        yield* $(phase1, 'b1', b1Load, 'loading');
                                    })(), (function* () {
                                        yield* $(phase1, '-', a1Load, 'loading');
                                        yield* $(phase1, 'a2', a2Load, 'loading');
                                    })(), (function* () {
                                        yield* $(phase1, '-', b1Load, 'loading');
                                        if (a1Load > 2) {
                                            yield '';
                                        }
                                        yield* $(phase1, 'b2', b2Load, 'loading');
                                    })());
                                    yield* interleave($(phase1, 'a1', 1, 'binding', 'bound'), $(phase1, 'b1', 1, 'binding', 'bound'));
                                    yield* interleave($(phase1, 'a1', 1, 'attaching', 'attached'), $(phase1, 'a2', 1, '', 'binding', 'bound', 'attaching', 'attached'), $(phase1, 'b1', 1, 'attaching', 'attached'), $(phase1, 'b2', 1, '', 'binding', 'bound', 'attaching', 'attached'));
                                    break;
                            }
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
        forEachRouterOptions('error handling', function (opts) {
            function runTest(spec) {
                it.skip(`re-throws ${spec}`, async function () {
                    let Root = class Root {
                    };
                    Root = __decorate([
                        customElement({ name: 'root', template: '<au-viewport></au-viewport>' })
                    ], Root);
                    const { router, container, tearDown } = await createFixture(Root, [], opts);
                    let err = void 0;
                    try {
                        await spec.action(router, container);
                    }
                    catch ($err) {
                        err = $err;
                    }
                    if (err === void 0) {
                        assert.fail(`Expected an error, but no error was thrown`);
                    }
                    else {
                        assert.match(err.message, spec.messageMatcher, `Expected message to match`);
                        assert.match(err.stack, spec.stackMatcher, `Expected stack to match`);
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
                    async action(router, container) {
                        const target = CustomElement.define({ name: 'a', template: null }, class Target {
                            async [hookName]() {
                                throw new Error(`error in ${hookName}`);
                            }
                        });
                        container.register(target);
                        await router.load(target);
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
                    async action(router, container) {
                        const target1 = CustomElement.define({ name: 'a', template: null }, class Target1 {
                            async [hookName]() {
                                throw new Error(`error in ${hookName}`);
                            }
                        });
                        const target2 = CustomElement.define({ name: 'a', template: null }, class Target2 {
                            async binding() { throw new Error(`error in binding`); }
                            async bound() { throw new Error(`error in bound`); }
                            async attaching() { throw new Error(`error in attaching`); }
                            async attached() { throw new Error(`error in attached`); }
                            async canLoad() { throw new Error(`error in canLoad`); }
                            async loading() { throw new Error(`error in load`); }
                        });
                        container.register(target1, target2);
                        await router.load(target1);
                        await router.load(target2);
                    },
                    messageMatcher: new RegExp(`error in ${throwsInTarget1 ? hookName : 'canLoad'}`),
                    stackMatcher: new RegExp(`${throwsInTarget1 ? 'Target1' : 'Target2'}.${throwsInTarget1 ? hookName : 'canLoad'}`),
                    toString() {
                        return `${String(this.messageMatcher)} with canLoad,load,binding,bound,attaching`;
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
                    async action(router, container) {
                        const target1 = CustomElement.define({ name: 'a', template: null }, class Target1 {
                            async [hookName]() {
                                throw new Error(`error in ${hookName}`);
                            }
                        });
                        const target2 = CustomElement.define({ name: 'a', template: null }, class Target2 {
                            async binding() { throw new Error(`error in binding`); }
                            async bound() { throw new Error(`error in bound`); }
                            async attaching() { throw new Error(`error in attaching`); }
                            async attached() { throw new Error(`error in attached`); }
                            async loading() { throw new Error(`error in load`); }
                        });
                        container.register(target1, target2);
                        await router.load(target1);
                        await router.load(target2);
                    },
                    messageMatcher: new RegExp(`error in ${throwsInTarget1 ? hookName : 'loading'}`),
                    stackMatcher: new RegExp(`${throwsInTarget1 ? 'Target1' : 'Target2'}.${throwsInTarget1 ? hookName : 'loading'}`),
                    toString() {
                        return `${String(this.messageMatcher)} with load,binding,bound,attaching`;
                    },
                });
            }
            for (const hookName of [
                'detaching',
                'unbinding',
            ]) {
                let throwsInTarget1;
                switch (opts.swapStrategy) {
                    case 'sequential-add-first':
                        throwsInTarget1 = false;
                        break;
                    case 'sequential-remove-first':
                        throwsInTarget1 = true;
                        break;
                    case 'parallel-remove-first':
                        // Would be hookName === 'detaching' if things were async
                        throwsInTarget1 = true;
                        break;
                }
                runTest({
                    async action(router, container) {
                        const target1 = CustomElement.define({ name: 'a', template: null }, class Target1 {
                            async [hookName]() {
                                throw new Error(`error in ${hookName}`);
                            }
                        });
                        const target2 = CustomElement.define({ name: 'a', template: null }, class Target2 {
                            async binding() { throw new Error(`error in binding`); }
                            async bound() { throw new Error(`error in bound`); }
                            async attaching() { throw new Error(`error in attaching`); }
                            async attached() { throw new Error(`error in attached`); }
                        });
                        container.register(target1, target2);
                        await router.load(target1);
                        await router.load(target2);
                    },
                    messageMatcher: new RegExp(`error in ${throwsInTarget1 ? hookName : 'binding'}`),
                    stackMatcher: new RegExp(`${throwsInTarget1 ? 'Target1' : 'Target2'}.${throwsInTarget1 ? hookName : 'binding'}`),
                    toString() {
                        return `${String(this.messageMatcher)} with binding,bound,attaching`;
                    },
                });
            }
        });
    });
});
//# sourceMappingURL=hook-tests.spec.js.map