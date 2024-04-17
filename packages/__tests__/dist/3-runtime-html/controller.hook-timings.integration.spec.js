var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Registration, DI, resolve } from '@aurelia/kernel';
import { Aurelia, customElement, IPlatform, } from '@aurelia/runtime-html';
import { assert, TestContext } from '@aurelia/testing';
function createFixture() {
    const ctx = TestContext.create();
    const cfg = new NotifierConfig([], 100);
    const { container } = ctx;
    container.register(Registration.instance(INotifierConfig, cfg));
    const mgr = container.get(INotifierManager);
    const p = container.get(IPlatform);
    const host = ctx.createElement('div');
    const au = new Aurelia(container);
    return { mgr, p, au, host };
}
describe('3-runtime-html/controller.hook-timings.integration.spec.ts', function () {
    const allSyncSpecs = {
        binding: (mgr, p) => DelayedInvoker.binding(mgr, p),
        bound: (mgr, p) => DelayedInvoker.bound(mgr, p),
        attaching: (mgr, p) => DelayedInvoker.attaching(mgr, p),
        attached: (mgr, p) => DelayedInvoker.attached(mgr, p),
        detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p),
        unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p),
        dispose: (mgr, p) => DelayedInvoker.dispose(mgr, p),
        toString() { return 'allSync'; },
    };
    function getAllAsyncSpecs(ticks) {
        return {
            binding: (mgr, p) => DelayedInvoker.binding(mgr, p, ticks),
            bound: (mgr, p) => DelayedInvoker.bound(mgr, p, ticks),
            attaching: (mgr, p) => DelayedInvoker.attaching(mgr, p, ticks),
            attached: (mgr, p) => DelayedInvoker.attached(mgr, p, ticks),
            detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, ticks),
            unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, ticks),
            dispose: (mgr, p) => DelayedInvoker.dispose(mgr, p),
            toString() { return 'allAsync'; },
        };
    }
    describe('basic single child component', function () {
        function $(prefix) {
            switch (prefix) {
                case 'start': return function (component) {
                    return function (hook) {
                        switch (hook) {
                            case void 0: return [
                                `start.${component}.binding.enter`,
                                `start.${component}.binding.leave`,
                                `start.${component}.bound.enter`,
                                `start.${component}.bound.leave`,
                                `start.${component}.attaching.enter`,
                                `start.${component}.attaching.leave`,
                                `start.${component}.attached.enter`,
                                `start.${component}.attached.leave`,
                            ];
                            default: return [
                                `${prefix}.${component}.${hook}.enter`,
                                `${prefix}.${component}.${hook}.leave`,
                            ];
                        }
                    };
                };
                case 'stop': return function (component) {
                    return function (hook) {
                        return [
                            `${prefix}.${component}.${hook}.enter`,
                            `${prefix}.${component}.${hook}.leave`,
                        ];
                    };
                };
            }
        }
        const stop_allSync = [
            ...$('stop')('a-1')('detaching'),
            ...$('stop')('app')('detaching'),
            ...$('stop')('a-1')('unbinding'),
            ...$('stop')('app')('unbinding'),
            ...$('stop')('app')('dispose'),
            ...$('stop')('a-1')('dispose'),
        ];
        const start_allSync = [
            ...$('start')('app')('binding'),
            ...$('start')('app')('bound'),
            ...$('start')('app')('attaching'),
            ...$('start')('a-1')(),
            ...$('start')('app')('attached'),
        ];
        const allSync = [
            ...start_allSync,
            ...stop_allSync,
        ];
        const syncLikeSpecs = [
            {
                app: allSyncSpecs,
                a1: allSyncSpecs,
                expected: allSync,
            },
            {
                app: allSyncSpecs,
                a1: {
                    ...allSyncSpecs,
                    binding: (mgr, p) => DelayedInvoker.binding(mgr, p, 1),
                    toString() { return 'async_binding'; },
                },
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    `start.a-1.binding.enter`,
                    `start.a-1.binding.tick(1)`,
                    `start.a-1.binding.leave`,
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    binding: (mgr, p) => DelayedInvoker.binding(mgr, p, 1),
                    toString() { return 'async_binding'; },
                },
                a1: allSyncSpecs,
                expected: [
                    `start.app.binding.enter`,
                    `start.app.binding.tick(1)`,
                    `start.app.binding.leave`,
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    binding: (mgr, p) => DelayedInvoker.binding(mgr, p, 1),
                    toString() { return 'async_binding'; },
                },
                a1: {
                    ...allSyncSpecs,
                    binding: (mgr, p) => DelayedInvoker.binding(mgr, p, 1),
                    toString() { return 'async_binding'; },
                },
                expected: [
                    `start.app.binding.enter`,
                    `start.app.binding.tick(1)`,
                    `start.app.binding.leave`,
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    `start.a-1.binding.enter`,
                    `start.a-1.binding.tick(1)`,
                    `start.a-1.binding.leave`,
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: allSyncSpecs,
                a1: {
                    ...allSyncSpecs,
                    bound: (mgr, p) => DelayedInvoker.bound(mgr, p, 1),
                    toString() { return 'async_bound'; },
                },
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    `start.a-1.bound.enter`,
                    `start.a-1.bound.tick(1)`,
                    `start.a-1.bound.leave`,
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    bound: (mgr, p) => DelayedInvoker.bound(mgr, p, 1),
                    toString() { return 'async_bound'; },
                },
                a1: allSyncSpecs,
                expected: [
                    ...$('start')('app')('binding'),
                    `start.app.bound.enter`,
                    `start.app.bound.tick(1)`,
                    `start.app.bound.leave`,
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    bound: (mgr, p) => DelayedInvoker.bound(mgr, p, 1),
                    toString() { return 'async_bound'; },
                },
                a1: {
                    ...allSyncSpecs,
                    bound: (mgr, p) => DelayedInvoker.bound(mgr, p, 1),
                    toString() { return 'async_bound'; },
                },
                expected: [
                    ...$('start')('app')('binding'),
                    `start.app.bound.enter`,
                    `start.app.bound.tick(1)`,
                    `start.app.bound.leave`,
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    `start.a-1.bound.enter`,
                    `start.a-1.bound.tick(1)`,
                    `start.a-1.bound.leave`,
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: allSyncSpecs,
                a1: {
                    ...allSyncSpecs,
                    attaching: (mgr, p) => DelayedInvoker.attaching(mgr, p, 1),
                    toString() { return 'async_attaching'; },
                },
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    `start.a-1.attaching.enter`,
                    `start.a-1.attaching.tick(1)`,
                    `start.a-1.attaching.leave`,
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    attaching: (mgr, p) => DelayedInvoker.attaching(mgr, p, 1),
                    toString() { return 'async_attaching'; },
                },
                a1: allSyncSpecs,
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    `start.app.attaching.enter`,
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    `start.app.attaching.tick(1)`,
                    `start.app.attaching.leave`,
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    attaching: (mgr, p) => DelayedInvoker.attaching(mgr, p, 1),
                    toString() { return 'async_attaching'; },
                },
                a1: {
                    ...allSyncSpecs,
                    attaching: (mgr, p) => DelayedInvoker.attaching(mgr, p, 1),
                    toString() { return 'async_attaching'; },
                },
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    `start.app.attaching.enter`,
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    `start.a-1.attaching.enter`,
                    `start.app.attaching.tick(1)`,
                    `start.app.attaching.leave`,
                    `start.a-1.attaching.tick(1)`,
                    `start.a-1.attaching.leave`,
                    ...$('start')('a-1')('attached'),
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: allSyncSpecs,
                a1: {
                    ...allSyncSpecs,
                    attached: (mgr, p) => DelayedInvoker.attached(mgr, p, 1),
                    toString() { return 'async_attached'; },
                },
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    `start.a-1.attached.enter`,
                    `start.a-1.attached.tick(1)`,
                    `start.a-1.attached.leave`,
                    ...$('start')('app')('attached'),
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    attached: (mgr, p) => DelayedInvoker.attached(mgr, p, 1),
                    toString() { return 'async_attached'; },
                },
                a1: allSyncSpecs,
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    ...$('start')('a-1')('attached'),
                    `start.app.attached.enter`,
                    `start.app.attached.tick(1)`,
                    `start.app.attached.leave`,
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    attached: (mgr, p) => DelayedInvoker.attached(mgr, p, 1),
                    toString() { return 'async_attached'; },
                },
                a1: {
                    ...allSyncSpecs,
                    attached: (mgr, p) => DelayedInvoker.attached(mgr, p, 1),
                    toString() { return 'async_attached'; },
                },
                expected: [
                    ...$('start')('app')('binding'),
                    ...$('start')('app')('bound'),
                    ...$('start')('app')('attaching'),
                    ...$('start')('a-1')('binding'),
                    ...$('start')('a-1')('bound'),
                    ...$('start')('a-1')('attaching'),
                    `start.a-1.attached.enter`,
                    `start.a-1.attached.tick(1)`,
                    `start.a-1.attached.leave`,
                    `start.app.attached.enter`,
                    `start.app.attached.tick(1)`,
                    `start.app.attached.leave`,
                    ...stop_allSync,
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    toString() { return 'async_detaching'; },
                },
                a1: allSyncSpecs,
                expected: [
                    ...start_allSync,
                    ...$('stop')('a-1')('detaching'),
                    `stop.app.detaching.enter`,
                    `stop.app.detaching.tick(1)`,
                    `stop.app.detaching.leave`,
                    ...$('stop')('a-1')('unbinding'),
                    ...$('stop')('app')('unbinding'),
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: allSyncSpecs,
                a1: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    toString() { return 'async_detaching'; },
                },
                expected: [
                    ...start_allSync,
                    `stop.a-1.detaching.enter`,
                    ...$('stop')('app')('detaching'),
                    `stop.a-1.detaching.tick(1)`,
                    `stop.a-1.detaching.leave`,
                    ...$('stop')('a-1')('unbinding'),
                    ...$('stop')('app')('unbinding'),
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    toString() { return 'async_detaching'; },
                },
                a1: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    toString() { return 'async_detaching'; },
                },
                expected: [
                    ...start_allSync,
                    `stop.a-1.detaching.enter`,
                    `stop.app.detaching.enter`,
                    `stop.a-1.detaching.tick(1)`,
                    `stop.a-1.detaching.leave`,
                    `stop.app.detaching.tick(1)`,
                    `stop.app.detaching.leave`,
                    ...$('stop')('a-1')('unbinding'),
                    ...$('stop')('app')('unbinding'),
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_unbinding'; },
                },
                a1: allSyncSpecs,
                expected: [
                    ...start_allSync,
                    ...$('stop')('a-1')('detaching'),
                    ...$('stop')('app')('detaching'),
                    ...$('stop')('a-1')('unbinding'),
                    `stop.app.unbinding.enter`,
                    `stop.app.unbinding.tick(1)`,
                    `stop.app.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: allSyncSpecs,
                a1: {
                    ...allSyncSpecs,
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_unbinding'; },
                },
                expected: [
                    ...start_allSync,
                    ...$('stop')('a-1')('detaching'),
                    ...$('stop')('app')('detaching'),
                    `stop.a-1.unbinding.enter`,
                    ...$('stop')('app')('unbinding'),
                    `stop.a-1.unbinding.tick(1)`,
                    `stop.a-1.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_unbinding'; },
                },
                a1: {
                    ...allSyncSpecs,
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_unbinding'; },
                },
                expected: [
                    ...start_allSync,
                    ...$('stop')('a-1')('detaching'),
                    ...$('stop')('app')('detaching'),
                    `stop.a-1.unbinding.enter`,
                    `stop.app.unbinding.enter`,
                    `stop.a-1.unbinding.tick(1)`,
                    `stop.a-1.unbinding.leave`,
                    `stop.app.unbinding.tick(1)`,
                    `stop.app.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                a1: allSyncSpecs,
                expected: [
                    ...start_allSync,
                    ...$('stop')('a-1')('detaching'),
                    `stop.app.detaching.enter`,
                    `stop.app.detaching.tick(1)`,
                    `stop.app.detaching.leave`,
                    ...$('stop')('a-1')('unbinding'),
                    `stop.app.unbinding.enter`,
                    `stop.app.unbinding.tick(1)`,
                    `stop.app.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: allSyncSpecs,
                a1: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                expected: [
                    ...start_allSync,
                    `stop.a-1.detaching.enter`,
                    ...$('stop')('app')('detaching'),
                    `stop.a-1.detaching.tick(1)`,
                    `stop.a-1.detaching.leave`,
                    `stop.a-1.unbinding.enter`,
                    ...$('stop')('app')('unbinding'),
                    `stop.a-1.unbinding.tick(1)`,
                    `stop.a-1.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                a1: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    toString() { return 'async_detaching'; },
                },
                expected: [
                    ...start_allSync,
                    `stop.a-1.detaching.enter`,
                    `stop.app.detaching.enter`,
                    `stop.a-1.detaching.tick(1)`,
                    `stop.a-1.detaching.leave`,
                    `stop.app.detaching.tick(1)`,
                    `stop.app.detaching.leave`,
                    ...$('stop')('a-1')('unbinding'),
                    `stop.app.unbinding.enter`,
                    `stop.app.unbinding.tick(1)`,
                    `stop.app.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                a1: {
                    ...allSyncSpecs,
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_unbinding'; },
                },
                expected: [
                    ...start_allSync,
                    ...$('stop')('a-1')('detaching'),
                    `stop.app.detaching.enter`,
                    `stop.app.detaching.tick(1)`,
                    `stop.app.detaching.leave`,
                    `stop.a-1.unbinding.enter`,
                    `stop.app.unbinding.enter`,
                    `stop.a-1.unbinding.tick(1)`,
                    `stop.a-1.unbinding.leave`,
                    `stop.app.unbinding.tick(1)`,
                    `stop.app.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    toString() { return 'async_detaching'; },
                },
                a1: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                expected: [
                    ...start_allSync,
                    `stop.a-1.detaching.enter`,
                    `stop.app.detaching.enter`,
                    `stop.a-1.detaching.tick(1)`,
                    `stop.a-1.detaching.leave`,
                    `stop.app.detaching.tick(1)`,
                    `stop.app.detaching.leave`,
                    `stop.a-1.unbinding.enter`,
                    ...$('stop')('app')('unbinding'),
                    `stop.a-1.unbinding.tick(1)`,
                    `stop.a-1.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_unbinding'; },
                },
                a1: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                expected: [
                    ...start_allSync,
                    `stop.a-1.detaching.enter`,
                    ...$('stop')('app')('detaching'),
                    `stop.a-1.detaching.tick(1)`,
                    `stop.a-1.detaching.leave`,
                    `stop.a-1.unbinding.enter`,
                    `stop.app.unbinding.enter`,
                    `stop.a-1.unbinding.tick(1)`,
                    `stop.a-1.unbinding.leave`,
                    `stop.app.unbinding.tick(1)`,
                    `stop.app.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
            {
                app: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                a1: {
                    ...allSyncSpecs,
                    detaching: (mgr, p) => DelayedInvoker.detaching(mgr, p, 1),
                    unbinding: (mgr, p) => DelayedInvoker.unbinding(mgr, p, 1),
                    toString() { return 'async_detaching+unbinding'; },
                },
                expected: [
                    ...start_allSync,
                    `stop.a-1.detaching.enter`,
                    `stop.app.detaching.enter`,
                    `stop.a-1.detaching.tick(1)`,
                    `stop.a-1.detaching.leave`,
                    `stop.app.detaching.tick(1)`,
                    `stop.app.detaching.leave`,
                    `stop.a-1.unbinding.enter`,
                    `stop.app.unbinding.enter`,
                    `stop.a-1.unbinding.tick(1)`,
                    `stop.a-1.unbinding.leave`,
                    `stop.app.unbinding.tick(1)`,
                    `stop.app.unbinding.leave`,
                    ...$('stop')('app')('dispose'),
                    ...$('stop')('a-1')('dispose'),
                ],
            },
        ];
        for (const { app, a1, expected } of syncLikeSpecs) {
            it(`app ${app}, a-1 ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 if.bind ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 if.bind="true"></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 else ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 if.bind="false"></a-1><a-1 else></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 with ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 with.bind="{}"></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 repeat.for ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 repeat.for="i of 1"></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 switch.bind case.bind ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 switch.bind="1" case.bind="1"></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 switch.bind default-case ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 switch.bind="1" default-case></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 flags ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 flags></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
            it(`app ${app}, a-1 portal ${a1}`, async function () {
                const { mgr, p, au, host } = createFixture();
                let A1 = (() => {
                    let _classDecorators = [customElement({ name: 'a-1', template: null })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var A1 = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, a1); }
                    };
                    __setFunctionName(_classThis, "A1");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        A1 = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return A1 = _classThis;
                })();
                let App = (() => {
                    let _classDecorators = [customElement({ name: 'app', template: '<a-1 portal></a-1>', dependencies: [A1] })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _classSuper = TestVM;
                    var App = _classThis = class extends _classSuper {
                        constructor() { super(mgr, p, app); }
                    };
                    __setFunctionName(_classThis, "App");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        App = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return App = _classThis;
                })();
                au.app({ host, component: App });
                mgr.setPrefix('start');
                await au.start();
                mgr.setPrefix('stop');
                await au.stop(true);
                verifyInvocationsEqual(mgr.fullNotifyHistory, expected);
            });
        }
    });
    // Note: these tests don't necessarily test scenarios that aren't covered elsewhere - their purpose is to provide an easy to understand
    // set of smoke tests for how the controllers deal with async hooks in various arrangements.
    // Therefore, the assertions are intentionally verbose and hand-coded to make them as easy as possible to understand,
    // even if this comes at a cost of making them harder to maintain/modify (which is not really supposed to happen anyway).
    describe('parallelism', function () {
        it(`parent 'attaching' can overlap with grandchild 'attached'`, async function () {
            const { mgr, p, au, host } = createFixture();
            const appSpec = {
                ...allSyncSpecs,
                attaching: () => DelayedInvoker.attaching(mgr, p, 1),
            };
            const parentSpec = {
                ...allSyncSpecs,
            };
            const childSpec = {
                ...allSyncSpecs,
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, childSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let P1 = (() => {
                let _classDecorators = [customElement({ name: 'p-1', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, parentSpec); }
                };
                __setFunctionName(_classThis, "P1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P1 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<p-1></p-1>', dependencies: [P1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, appSpec); }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                'start.app.binding.enter',
                'start.app.binding.leave',
                'start.app.bound.enter',
                'start.app.bound.leave',
                'start.app.attaching.enter',
                'start.p-1.binding.enter',
                'start.p-1.binding.leave',
                'start.p-1.bound.enter',
                'start.p-1.bound.leave',
                'start.p-1.attaching.enter',
                'start.p-1.attaching.leave',
                'start.c-1.binding.enter',
                'start.c-1.binding.leave',
                'start.c-1.bound.enter',
                'start.c-1.bound.leave',
                'start.c-1.attaching.enter',
                'start.c-1.attaching.leave',
                'start.c-1.attached.enter',
                'start.c-1.attached.leave',
                'start.p-1.attached.enter',
                'start.p-1.attached.leave',
                // app.'attaching' still ongoing after c-1.'attached' finished
                'start.app.attaching.tick(1)',
                'start.app.attaching.leave',
                'start.app.attached.enter',
                'start.app.attached.leave',
                // nothing of interest here: all of these are synchronous and do not demonstrate parallelism (not part of this test)
                'stop.c-1.detaching.enter',
                'stop.c-1.detaching.leave',
                'stop.p-1.detaching.enter',
                'stop.p-1.detaching.leave',
                'stop.app.detaching.enter',
                'stop.app.detaching.leave',
                'stop.c-1.unbinding.enter',
                'stop.c-1.unbinding.leave',
                'stop.p-1.unbinding.enter',
                'stop.p-1.unbinding.leave',
                'stop.app.unbinding.enter',
                'stop.app.unbinding.leave',
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.p-1.dispose.enter',
                'stop.p-1.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
            ]);
        });
        it(`'attaching' is awaited before 'attached' starts, and child 'attached' is awaited before parent 'attached' starts`, async function () {
            const { mgr, p, au, host } = createFixture();
            const appSpec = {
                ...allSyncSpecs,
            };
            const childSpec = {
                ...allSyncSpecs,
                attaching: () => DelayedInvoker.attaching(mgr, p, 1),
                attached: () => DelayedInvoker.attached(mgr, p, 1),
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, childSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, appSpec); }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                'start.app.binding.enter',
                'start.app.binding.leave',
                'start.app.bound.enter',
                'start.app.bound.leave',
                'start.app.attaching.enter',
                'start.app.attaching.leave',
                'start.c-1.binding.enter',
                'start.c-1.binding.leave',
                'start.c-1.bound.enter',
                'start.c-1.bound.leave',
                'start.c-1.attaching.enter',
                'start.c-1.attaching.tick(1)',
                'start.c-1.attaching.leave',
                'start.c-1.attached.enter',
                'start.c-1.attached.tick(1)',
                'start.c-1.attached.leave',
                'start.app.attached.enter',
                'start.app.attached.leave',
                // nothing of interest here: all of these are synchronous and do not demonstrate parallelism (not part of this test)
                'stop.c-1.detaching.enter',
                'stop.c-1.detaching.leave',
                'stop.app.detaching.enter',
                'stop.app.detaching.leave',
                'stop.c-1.unbinding.enter',
                'stop.c-1.unbinding.leave',
                'stop.app.unbinding.enter',
                'stop.app.unbinding.leave',
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
            ]);
        });
        it(`parent and child 'attaching' can overlap`, async function () {
            const { mgr, p, au, host } = createFixture();
            const hookSpec = {
                ...allSyncSpecs,
                attaching: () => DelayedInvoker.attaching(mgr, p, 2),
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                'start.app.binding.enter',
                'start.app.binding.leave',
                'start.app.bound.enter',
                'start.app.bound.leave',
                'start.app.attaching.enter',
                'start.c-1.binding.enter',
                'start.c-1.binding.leave',
                'start.c-1.bound.enter',
                'start.c-1.bound.leave',
                'start.c-1.attaching.enter',
                'start.app.attaching.tick(1)',
                'start.c-1.attaching.tick(1)',
                'start.app.attaching.tick(2)',
                'start.app.attaching.leave',
                'start.c-1.attaching.tick(2)',
                'start.c-1.attaching.leave',
                'start.c-1.attached.enter',
                'start.c-1.attached.leave',
                'start.app.attached.enter',
                'start.app.attached.leave',
                // nothing of interest here: all of these are synchronous and do not demonstrate parallelism (not part of this test)
                'stop.c-1.detaching.enter',
                'stop.c-1.detaching.leave',
                'stop.app.detaching.enter',
                'stop.app.detaching.leave',
                'stop.c-1.unbinding.enter',
                'stop.c-1.unbinding.leave',
                'stop.app.unbinding.enter',
                'stop.app.unbinding.leave',
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
            ]);
        });
        it(`'binding' and 'bound' are sequential relative to each other and across parent-child hierarchies`, async function () {
            const { mgr, p, au, host } = createFixture();
            const hookSpec = {
                ...allSyncSpecs,
                binding: () => DelayedInvoker.binding(mgr, p, 1),
                bound: () => DelayedInvoker.bound(mgr, p, 1),
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                'start.app.binding.enter',
                'start.app.binding.tick(1)',
                'start.app.binding.leave',
                'start.app.bound.enter',
                'start.app.bound.tick(1)',
                'start.app.bound.leave',
                'start.app.attaching.enter',
                'start.app.attaching.leave',
                'start.c-1.binding.enter',
                'start.c-1.binding.tick(1)',
                'start.c-1.binding.leave',
                'start.c-1.bound.enter',
                'start.c-1.bound.tick(1)',
                'start.c-1.bound.leave',
                'start.c-1.attaching.enter',
                'start.c-1.attaching.leave',
                'start.c-1.attached.enter',
                'start.c-1.attached.leave',
                'start.app.attached.enter',
                'start.app.attached.leave',
                // nothing of interest here: all of these are synchronous and do not demonstrate parallelism (not part of this test)
                'stop.c-1.detaching.enter',
                'stop.c-1.detaching.leave',
                'stop.app.detaching.enter',
                'stop.app.detaching.leave',
                'stop.c-1.unbinding.enter',
                'stop.c-1.unbinding.leave',
                'stop.app.unbinding.enter',
                'stop.app.unbinding.leave',
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
            ]);
        });
        it(`'detaching' and 'unbinding' are individually awaited bottom-up in parallel`, async function () {
            const { mgr, p, au, host } = createFixture();
            const hookSpec = {
                ...allSyncSpecs,
                detaching: () => DelayedInvoker.detaching(mgr, p, 2),
                unbinding: () => DelayedInvoker.unbinding(mgr, p, 2),
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let P1 = (() => {
                let _classDecorators = [customElement({ name: 'p-1', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "P1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P1 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<p-1></p-1>', dependencies: [P1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                'start.app.binding.enter',
                'start.app.binding.leave',
                'start.app.bound.enter',
                'start.app.bound.leave',
                'start.app.attaching.enter',
                'start.app.attaching.leave',
                'start.p-1.binding.enter',
                'start.p-1.binding.leave',
                'start.p-1.bound.enter',
                'start.p-1.bound.leave',
                'start.p-1.attaching.enter',
                'start.p-1.attaching.leave',
                'start.c-1.binding.enter',
                'start.c-1.binding.leave',
                'start.c-1.bound.enter',
                'start.c-1.bound.leave',
                'start.c-1.attaching.enter',
                'start.c-1.attaching.leave',
                'start.c-1.attached.enter',
                'start.c-1.attached.leave',
                'start.p-1.attached.enter',
                'start.p-1.attached.leave',
                'start.app.attached.enter',
                'start.app.attached.leave',
                // all 3 'detaching' started bottom-up in parallel, and awaited before 'unbinding' is started
                'stop.c-1.detaching.enter',
                'stop.p-1.detaching.enter',
                'stop.app.detaching.enter',
                'stop.c-1.detaching.tick(1)',
                'stop.p-1.detaching.tick(1)',
                'stop.app.detaching.tick(1)',
                'stop.c-1.detaching.tick(2)',
                'stop.c-1.detaching.leave',
                'stop.p-1.detaching.tick(2)',
                'stop.p-1.detaching.leave',
                'stop.app.detaching.tick(2)',
                'stop.app.detaching.leave',
                // all 3 'unbinding' started bottom-up in parallel, and awaited before 'dispose' is started
                'stop.c-1.unbinding.enter',
                'stop.p-1.unbinding.enter',
                'stop.app.unbinding.enter',
                'stop.c-1.unbinding.tick(1)',
                'stop.p-1.unbinding.tick(1)',
                'stop.app.unbinding.tick(1)',
                'stop.c-1.unbinding.tick(2)',
                'stop.c-1.unbinding.leave',
                'stop.p-1.unbinding.tick(2)',
                'stop.p-1.unbinding.leave',
                'stop.app.unbinding.tick(2)',
                'stop.app.unbinding.leave',
                // 'dispose' runs top-down (and is always synchronous)
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.p-1.dispose.enter',
                'stop.p-1.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
            ]);
        });
        it(`all hooks are arranged as expected in a complex tree when all are async with the same timings`, async function () {
            const { mgr, p, au, host } = createFixture();
            const hookSpec = {
                ...getAllAsyncSpecs(1),
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let C2 = (() => {
                let _classDecorators = [customElement({ name: 'c-2', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C2 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "C2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C2 = _classThis;
            })();
            let P1 = (() => {
                let _classDecorators = [customElement({ name: 'p-1', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "P1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P1 = _classThis;
            })();
            let P2 = (() => {
                let _classDecorators = [customElement({ name: 'p-2', template: '<c-2></c-2>', dependencies: [C2] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P2 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "P2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P2 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<p-1></p-1><p-2></p-2>', dependencies: [P1, P2] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                'start.app.binding.enter',
                'start.app.binding.tick(1)',
                'start.app.binding.leave',
                'start.app.bound.enter',
                'start.app.bound.tick(1)',
                'start.app.bound.leave',
                'start.app.attaching.enter',
                // parent 'attaching' starts in parallel with child activation
                'start.p-1.binding.enter',
                'start.p-2.binding.enter',
                'start.app.attaching.tick(1)',
                'start.app.attaching.leave',
                'start.p-1.binding.tick(1)',
                'start.p-1.binding.leave',
                'start.p-2.binding.tick(1)',
                'start.p-2.binding.leave',
                'start.p-1.bound.enter',
                'start.p-2.bound.enter',
                'start.p-1.bound.tick(1)',
                'start.p-1.bound.leave',
                'start.p-2.bound.tick(1)',
                'start.p-2.bound.leave',
                'start.p-1.attaching.enter',
                // parent 'attaching' starts in parallel with child activation
                'start.c-1.binding.enter',
                'start.p-2.attaching.enter',
                // parent 'attaching' starts in parallel with child activation
                'start.c-2.binding.enter',
                'start.p-1.attaching.tick(1)',
                'start.p-1.attaching.leave',
                'start.c-1.binding.tick(1)',
                'start.c-1.binding.leave',
                'start.p-2.attaching.tick(1)',
                'start.p-2.attaching.leave',
                'start.c-2.binding.tick(1)',
                'start.c-2.binding.leave',
                'start.c-1.bound.enter',
                'start.c-2.bound.enter',
                'start.c-1.bound.tick(1)',
                'start.c-1.bound.leave',
                'start.c-2.bound.tick(1)',
                'start.c-2.bound.leave',
                'start.c-1.attaching.enter',
                'start.c-2.attaching.enter',
                'start.c-1.attaching.tick(1)',
                'start.c-1.attaching.leave',
                'start.c-2.attaching.tick(1)',
                'start.c-2.attaching.leave',
                // 'attached' runs bottom-up and children are awaited before parents
                'start.c-1.attached.enter',
                'start.c-2.attached.enter',
                'start.c-1.attached.tick(1)',
                'start.c-1.attached.leave',
                'start.c-2.attached.tick(1)',
                'start.c-2.attached.leave',
                'start.p-1.attached.enter',
                'start.p-2.attached.enter',
                'start.p-1.attached.tick(1)',
                'start.p-1.attached.leave',
                'start.p-2.attached.tick(1)',
                'start.p-2.attached.leave',
                'start.app.attached.enter',
                'start.app.attached.tick(1)',
                'start.app.attached.leave',
                // all 'detaching' hooks are started bottom-up in parallel, and all awaited before any 'unbinding' hooks are started
                'stop.c-1.detaching.enter',
                'stop.p-1.detaching.enter',
                'stop.c-2.detaching.enter',
                'stop.p-2.detaching.enter',
                'stop.app.detaching.enter',
                'stop.c-1.detaching.tick(1)',
                'stop.c-1.detaching.leave',
                'stop.p-1.detaching.tick(1)',
                'stop.p-1.detaching.leave',
                'stop.c-2.detaching.tick(1)',
                'stop.c-2.detaching.leave',
                'stop.p-2.detaching.tick(1)',
                'stop.p-2.detaching.leave',
                'stop.app.detaching.tick(1)',
                'stop.app.detaching.leave',
                // all 'unbinding' hooks are started bottom-up in parallel, and all awaited before any 'dispose' hooks are started
                'stop.c-1.unbinding.enter',
                'stop.p-1.unbinding.enter',
                'stop.c-2.unbinding.enter',
                'stop.p-2.unbinding.enter',
                'stop.app.unbinding.enter',
                'stop.c-1.unbinding.tick(1)',
                'stop.c-1.unbinding.leave',
                'stop.p-1.unbinding.tick(1)',
                'stop.p-1.unbinding.leave',
                'stop.c-2.unbinding.tick(1)',
                'stop.c-2.unbinding.leave',
                'stop.p-2.unbinding.tick(1)',
                'stop.p-2.unbinding.leave',
                'stop.app.unbinding.tick(1)',
                'stop.app.unbinding.leave',
                // all 'dispose' hooks are run top-down
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.p-1.dispose.enter',
                'stop.p-1.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
                'stop.p-2.dispose.enter',
                'stop.p-2.dispose.leave',
                'stop.c-2.dispose.enter',
                'stop.c-2.dispose.leave',
            ]);
        });
        it(`activation hooks are arranged as expected in a complex tree when all are async but 'attaching' taking much longer than the rest`, async function () {
            const { mgr, p, au, host } = createFixture();
            const hookSpec = {
                ...allSyncSpecs,
                binding: () => DelayedInvoker.binding(mgr, p, 1),
                bound: () => DelayedInvoker.bound(mgr, p, 1),
                attaching: () => DelayedInvoker.attaching(mgr, p, 10),
                attached: () => DelayedInvoker.attached(mgr, p, 1),
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let C2 = (() => {
                let _classDecorators = [customElement({ name: 'c-2', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C2 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "C2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C2 = _classThis;
            })();
            let P1 = (() => {
                let _classDecorators = [customElement({ name: 'p-1', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "P1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P1 = _classThis;
            })();
            let P2 = (() => {
                let _classDecorators = [customElement({ name: 'p-2', template: '<c-2></c-2>', dependencies: [C2] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P2 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "P2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P2 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<p-1></p-1><p-2></p-2>', dependencies: [P1, P2] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, hookSpec); }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                // app.'binding' is awaited before starting app.'bound'
                'start.app.binding.enter',
                'start.app.binding.tick(1)',
                'start.app.binding.leave',
                // app.'bound' is awaited before starting app.'attaching'
                'start.app.bound.enter',
                'start.app.bound.tick(1)',
                'start.app.bound.leave',
                // app.'attaching' is awaited in parallel with p-1 & p-2 activation before starting app.'attached'
                'start.app.attaching.enter',
                'start.p-1.binding.enter',
                'start.p-2.binding.enter',
                'start.app.attaching.tick(1)',
                'start.p-1.binding.tick(1)',
                'start.p-1.binding.leave',
                'start.p-2.binding.tick(1)',
                'start.p-2.binding.leave',
                'start.app.attaching.tick(2)',
                'start.p-1.bound.enter',
                'start.p-2.bound.enter',
                'start.app.attaching.tick(3)',
                'start.p-1.bound.tick(1)',
                'start.p-1.bound.leave',
                'start.p-2.bound.tick(1)',
                'start.p-2.bound.leave',
                'start.app.attaching.tick(4)',
                //   p-1.'attaching' is awaited in parallel with its children (c-1) activation before starting p-1.'attached'
                'start.p-1.attaching.enter',
                'start.c-1.binding.enter',
                //   p-2.'attaching' is awaited in parallel with its children (c-2) activation before starting p-2.'attached'
                'start.p-2.attaching.enter',
                'start.c-2.binding.enter',
                'start.app.attaching.tick(5)',
                'start.p-1.attaching.tick(1)',
                'start.c-1.binding.tick(1)',
                'start.c-1.binding.leave',
                'start.p-2.attaching.tick(1)',
                'start.c-2.binding.tick(1)',
                'start.c-2.binding.leave',
                'start.app.attaching.tick(6)',
                'start.p-1.attaching.tick(2)',
                'start.c-1.bound.enter',
                'start.p-2.attaching.tick(2)',
                'start.c-2.bound.enter',
                'start.app.attaching.tick(7)',
                'start.p-1.attaching.tick(3)',
                'start.c-1.bound.tick(1)',
                'start.c-1.bound.leave',
                'start.p-2.attaching.tick(3)',
                'start.c-2.bound.tick(1)',
                'start.c-2.bound.leave',
                'start.app.attaching.tick(8)',
                'start.p-1.attaching.tick(4)',
                //     c-1.'attaching' is awaited before starting c-1.'attached'
                'start.c-1.attaching.enter',
                'start.p-2.attaching.tick(4)',
                //     c-2.'attaching' is awaited before starting c-2.'attached'
                'start.c-2.attaching.enter',
                'start.app.attaching.tick(9)',
                'start.p-1.attaching.tick(5)',
                'start.c-1.attaching.tick(1)',
                'start.p-2.attaching.tick(5)',
                'start.c-2.attaching.tick(1)',
                'start.app.attaching.tick(10)',
                // app.'attaching' is now done, but p-1/c-1 & p-2/c-2 activation is still ongoing so not starting app.'attached' yet
                'start.app.attaching.leave',
                'start.p-1.attaching.tick(6)',
                'start.c-1.attaching.tick(2)',
                'start.p-2.attaching.tick(6)',
                'start.c-2.attaching.tick(2)',
                'start.p-1.attaching.tick(7)',
                'start.c-1.attaching.tick(3)',
                'start.p-2.attaching.tick(7)',
                'start.c-2.attaching.tick(3)',
                'start.p-1.attaching.tick(8)',
                'start.c-1.attaching.tick(4)',
                'start.p-2.attaching.tick(8)',
                'start.c-2.attaching.tick(4)',
                'start.p-1.attaching.tick(9)',
                'start.c-1.attaching.tick(5)',
                'start.p-2.attaching.tick(9)',
                'start.c-2.attaching.tick(5)',
                'start.p-1.attaching.tick(10)',
                // p-1.'attaching' is now done, but c-1 activation is still ongoing so not starting p-1.'attached' yet
                'start.p-1.attaching.leave',
                'start.c-1.attaching.tick(6)',
                'start.p-2.attaching.tick(10)',
                // p-2.'attaching' is now done, but c-2 activation is still ongoing so not starting p-2.'attached' yet
                'start.p-2.attaching.leave',
                'start.c-2.attaching.tick(6)',
                'start.c-1.attaching.tick(7)',
                'start.c-2.attaching.tick(7)',
                'start.c-1.attaching.tick(8)',
                'start.c-2.attaching.tick(8)',
                'start.c-1.attaching.tick(9)',
                'start.c-2.attaching.tick(9)',
                // c-1.'attaching' and c-2.'attaching' are now done
                'start.c-1.attaching.tick(10)',
                'start.c-1.attaching.leave',
                'start.c-2.attaching.tick(10)',
                'start.c-2.attaching.leave',
                // c-1 and c-2 'attaching' finished, starting c-1 and c-2 'attached'
                'start.c-1.attached.enter',
                'start.c-2.attached.enter',
                'start.c-1.attached.tick(1)',
                'start.c-1.attached.leave',
                'start.c-2.attached.tick(1)',
                'start.c-2.attached.leave',
                // c-1 and c-2 'attached' (last part of activation) finished, starting p-1 and p-2 'attached'
                'start.p-1.attached.enter',
                'start.p-2.attached.enter',
                'start.p-1.attached.tick(1)',
                'start.p-1.attached.leave',
                'start.p-2.attached.tick(1)',
                'start.p-2.attached.leave',
                // p-1 and p-2 'attached' (last part of activation) finished, starting app 'attached'
                'start.app.attached.enter',
                'start.app.attached.tick(1)',
                'start.app.attached.leave',
                // nothing of interest here: all of these are synchronous and do not demonstrate parallelism (not part of this test)
                'stop.c-1.detaching.enter',
                'stop.c-1.detaching.leave',
                'stop.p-1.detaching.enter',
                'stop.p-1.detaching.leave',
                'stop.c-2.detaching.enter',
                'stop.c-2.detaching.leave',
                'stop.p-2.detaching.enter',
                'stop.p-2.detaching.leave',
                'stop.app.detaching.enter',
                'stop.app.detaching.leave',
                'stop.c-1.unbinding.enter',
                'stop.c-1.unbinding.leave',
                'stop.p-1.unbinding.enter',
                'stop.p-1.unbinding.leave',
                'stop.c-2.unbinding.enter',
                'stop.c-2.unbinding.leave',
                'stop.p-2.unbinding.enter',
                'stop.p-2.unbinding.leave',
                'stop.app.unbinding.enter',
                'stop.app.unbinding.leave',
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.p-1.dispose.enter',
                'stop.p-1.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
                'stop.p-2.dispose.enter',
                'stop.p-2.dispose.leave',
                'stop.c-2.dispose.enter',
                'stop.c-2.dispose.leave',
            ]);
        });
        it(`separate activate + deactivate can be aligned on attaching/detaching`, async function () {
            const { mgr, p, au, host } = createFixture();
            const componentSpec = {
                ...allSyncSpecs,
                attaching: () => DelayedInvoker.attaching(mgr, p, 3),
                detaching: () => DelayedInvoker.detaching(mgr, p, 3),
            };
            const appSpec = {
                ...allSyncSpecs,
            };
            let C1 = (() => {
                let _classDecorators = [customElement({ name: 'c-1', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, componentSpec); }
                };
                __setFunctionName(_classThis, "C1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C1 = _classThis;
            })();
            let C2 = (() => {
                let _classDecorators = [customElement({ name: 'c-2', template: null })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var C2 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, componentSpec); }
                };
                __setFunctionName(_classThis, "C2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    C2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return C2 = _classThis;
            })();
            let P1 = (() => {
                let _classDecorators = [customElement({ name: 'p-1', template: '<c-1></c-1>', dependencies: [C1] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P1 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, componentSpec); }
                };
                __setFunctionName(_classThis, "P1");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P1 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P1 = _classThis;
            })();
            let P2 = (() => {
                let _classDecorators = [customElement({ name: 'p-2', template: '<c-2></c-2>', dependencies: [C2] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var P2 = _classThis = class extends _classSuper {
                    constructor() { super(mgr, p, componentSpec); }
                };
                __setFunctionName(_classThis, "P2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    P2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return P2 = _classThis;
            })();
            let App = (() => {
                let _classDecorators = [customElement({ name: 'app', template: '<p-1 if.bind="n===1"></p-1><p-2 if.bind="n===2"></p-2>', dependencies: [P1, P2] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _classSuper = TestVM;
                var App = _classThis = class extends _classSuper {
                    constructor() {
                        super(mgr, p, appSpec);
                        this.n = 1;
                    }
                };
                __setFunctionName(_classThis, "App");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    App = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return App = _classThis;
            })();
            au.app({ host, component: App });
            const app = au.root.controller.viewModel;
            mgr.setPrefix('start');
            await au.start();
            mgr.setPrefix('swap');
            app.n = 2;
            await waitForTick(6);
            mgr.setPrefix('stop');
            await au.stop(true);
            verifyInvocationsEqual(mgr.fullNotifyHistory, [
                'start.app.binding.enter',
                'start.app.binding.leave',
                'start.app.bound.enter',
                'start.app.bound.leave',
                'start.app.attaching.enter',
                'start.app.attaching.leave',
                'start.p-1.binding.enter',
                'start.p-1.binding.leave',
                'start.p-1.bound.enter',
                'start.p-1.bound.leave',
                'start.p-1.attaching.enter',
                'start.c-1.binding.enter',
                'start.c-1.binding.leave',
                'start.c-1.bound.enter',
                'start.c-1.bound.leave',
                'start.c-1.attaching.enter',
                'start.p-1.attaching.tick(1)',
                'start.c-1.attaching.tick(1)',
                'start.p-1.attaching.tick(2)',
                'start.c-1.attaching.tick(2)',
                'start.p-1.attaching.tick(3)',
                'start.p-1.attaching.leave',
                'start.c-1.attaching.tick(3)',
                'start.c-1.attaching.leave',
                'start.c-1.attached.enter',
                'start.c-1.attached.leave',
                'start.p-1.attached.enter',
                'start.p-1.attached.leave',
                'start.app.attached.enter',
                'start.app.attached.leave',
                'swap.c-1.detaching.enter',
                'swap.p-1.detaching.enter',
                'swap.p-2.binding.enter',
                'swap.p-2.binding.leave',
                'swap.p-2.bound.enter',
                'swap.p-2.bound.leave',
                'swap.p-2.attaching.enter',
                'swap.c-2.binding.enter',
                'swap.c-2.binding.leave',
                'swap.c-2.bound.enter',
                'swap.c-2.bound.leave',
                'swap.c-2.attaching.enter',
                // start of the part that's relevant to this test
                'swap.c-1.detaching.tick(1)',
                'swap.p-1.detaching.tick(1)',
                'swap.p-2.attaching.tick(1)',
                'swap.c-2.attaching.tick(1)',
                'swap.c-1.detaching.tick(2)',
                'swap.p-1.detaching.tick(2)',
                'swap.p-2.attaching.tick(2)',
                'swap.c-2.attaching.tick(2)',
                'swap.c-1.detaching.tick(3)',
                'swap.c-1.detaching.leave',
                'swap.p-1.detaching.tick(3)',
                'swap.p-1.detaching.leave',
                'swap.p-2.attaching.tick(3)',
                'swap.p-2.attaching.leave',
                'swap.c-2.attaching.tick(3)',
                'swap.c-2.attaching.leave',
                // end of the part that's relevant to this test
                'swap.c-1.unbinding.enter',
                'swap.c-1.unbinding.leave',
                'swap.p-1.unbinding.enter',
                'swap.p-1.unbinding.leave',
                'swap.c-2.attached.enter',
                'swap.c-2.attached.leave',
                'swap.p-2.attached.enter',
                'swap.p-2.attached.leave',
                'stop.c-2.detaching.enter',
                'stop.p-2.detaching.enter',
                'stop.app.detaching.enter',
                'stop.app.detaching.leave',
                'stop.c-2.detaching.tick(1)',
                'stop.p-2.detaching.tick(1)',
                'stop.c-2.detaching.tick(2)',
                'stop.p-2.detaching.tick(2)',
                'stop.c-2.detaching.tick(3)',
                'stop.c-2.detaching.leave',
                'stop.p-2.detaching.tick(3)',
                'stop.p-2.detaching.leave',
                'stop.c-2.unbinding.enter',
                'stop.c-2.unbinding.leave',
                'stop.p-2.unbinding.enter',
                'stop.p-2.unbinding.leave',
                'stop.app.unbinding.enter',
                'stop.app.unbinding.leave',
                'stop.app.dispose.enter',
                'stop.app.dispose.leave',
                'stop.p-1.dispose.enter',
                'stop.p-1.dispose.leave',
                'stop.c-1.dispose.enter',
                'stop.c-1.dispose.leave',
                'stop.p-2.dispose.enter',
                'stop.p-2.dispose.leave',
                'stop.c-2.dispose.enter',
                'stop.c-2.dispose.leave',
            ]);
        });
    });
});
async function waitForTick(count) {
    while (count-- > 0) {
        await Promise.resolve();
    }
}
const hookNames = ['binding', 'bound', 'attaching', 'attached', 'detaching', 'unbinding'];
class TestVM {
    get name() { return this.$controller.definition.name; }
    constructor(mgr, p, { binding, bound, attaching, attached, detaching, unbinding, dispose }) {
        this.bindingDI = binding(mgr, p);
        this.boundDI = bound(mgr, p);
        this.attachingDI = attaching(mgr, p);
        this.attachedDI = attached(mgr, p);
        this.detachingDI = detaching(mgr, p);
        this.unbindingDI = unbinding(mgr, p);
        this.disposeDI = dispose(mgr, p);
    }
    binding(i, p) { return this.bindingDI.invoke(this, () => { this.$binding(i, p); }); }
    bound(i, p) { return this.boundDI.invoke(this, () => { this.$bound(i, p); }); }
    attaching(i, p) { return this.attachingDI.invoke(this, () => { this.$attaching(i, p); }); }
    attached(i) { return this.attachedDI.invoke(this, () => { this.$attached(i); }); }
    detaching(i, p) { return this.detachingDI.invoke(this, () => { this.$detaching(i, p); }); }
    unbinding(i, p) { return this.unbindingDI.invoke(this, () => { this.$unbinding(i, p); }); }
    dispose() { void this.disposeDI.invoke(this, () => { this.$dispose(); }); }
    $binding(_i, _p) { }
    $bound(_i, _p) { }
    $attaching(_i, _p) { }
    $attached(_i) { }
    $detaching(_i, _p) { }
    $unbinding(_i, _p) { }
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
class NotifierManager {
    constructor() {
        this.entryNotifyHistory = [];
        this.fullNotifyHistory = [];
        this.prefix = '';
        this.p = resolve(IPlatform);
        this.binding = new Notifier(this, 'binding');
        this.bound = new Notifier(this, 'bound');
        this.attaching = new Notifier(this, 'attaching');
        this.attached = new Notifier(this, 'attached');
        this.detaching = new Notifier(this, 'detaching');
        this.unbinding = new Notifier(this, 'unbinding');
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
        this.$dispose = void 0;
    }
}
class DelayedInvoker {
    constructor(mgr, p, name, ticks) {
        this.mgr = mgr;
        this.p = p;
        this.name = name;
        this.ticks = ticks;
    }
    static binding(mgr, p, ticks = null) { return new DelayedInvoker(mgr, p, 'binding', ticks); }
    static bound(mgr, p, ticks = null) { return new DelayedInvoker(mgr, p, 'bound', ticks); }
    static attaching(mgr, p, ticks = null) { return new DelayedInvoker(mgr, p, 'attaching', ticks); }
    static attached(mgr, p, ticks = null) { return new DelayedInvoker(mgr, p, 'attached', ticks); }
    static detaching(mgr, p, ticks = null) { return new DelayedInvoker(mgr, p, 'detaching', ticks); }
    static unbinding(mgr, p, ticks = null) { return new DelayedInvoker(mgr, p, 'unbinding', ticks); }
    static dispose(mgr, p, ticks = null) { return new DelayedInvoker(mgr, p, 'dispose', ticks); }
    invoke(vm, cb) {
        if (this.ticks === null) {
            this.mgr[this.name].enter(vm);
            cb();
            this.mgr[this.name].leave(vm);
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
                    cb();
                    this.mgr[this.name].leave(vm);
                    resolve();
                }
            };
            next();
            return p;
        }
    }
    toString() {
        let str = this.name;
        if (this.ticks !== null) {
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
            const $actual = actual[i];
            const $expected = expected[i];
            if ($actual === $expected) {
                errors.push(`    OK : ${$actual}`);
            }
            else {
                errors.push(`NOT OK : ${$actual} (expected: ${$expected})`);
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
//# sourceMappingURL=controller.hook-timings.integration.spec.js.map