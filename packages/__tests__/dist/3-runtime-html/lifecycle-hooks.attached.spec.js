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
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.attached.spec.ts', function () {
    describe('[synchronous]', function () {
        const hookSymbol = Symbol();
        class LifeycyleTracker {
            constructor() {
                this.attached = 0;
                this.controllers = [];
            }
        }
        let tracker = null;
        this.beforeEach(function () {
            tracker = new LifeycyleTracker();
        });
        let AttachedLoggingHook = (() => {
            let _classDecorators = [lifecycleHooks()];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var AttachedLoggingHook = _classThis = class {
                attached(vm, initiator) {
                    vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                    tracker.attached++;
                    tracker.controllers.push(initiator);
                }
            };
            __setFunctionName(_classThis, "AttachedLoggingHook");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                AttachedLoggingHook = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return AttachedLoggingHook = _classThis;
        })();
        it('invokes global attached hooks', async function () {
            const { component } = await createFixture
                .html `\${message}`
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.attached, 1);
        });
        it('invokes when registered both globally and locally', async function () {
            const { component } = await createFixture
                .component(CustomElement.define({ name: 'app', dependencies: [AttachedLoggingHook] }))
                .html `\${message}`
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.attached, 2);
            assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
        });
        it('invokes before the view model lifecycle', async function () {
            let attachedCallCount = 0;
            await createFixture
                .component(class App {
                attached() {
                    assert.strictEqual(this[hookSymbol], hookSymbol);
                    attachedCallCount++;
                }
            })
                .html ``
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(attachedCallCount, 1);
        });
        it('invokes global attached hooks for Custom attribute controller', async function () {
            let current = null;
            let Square = (() => {
                let _classDecorators = [customAttribute('square')];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Square = _classThis = class {
                    created() { current = this; }
                };
                __setFunctionName(_classThis, "Square");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Square = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Square = _classThis;
            })();
            await createFixture
                .html `<div square>`
                .deps(AttachedLoggingHook, Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.attached, 2);
        });
        it('invokes attached hooks on Custom attribute', async function () {
            let current = null;
            let Square = (() => {
                let _classDecorators = [customAttribute({ name: 'square', dependencies: [AttachedLoggingHook] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Square = _classThis = class {
                    created() { current = this; }
                };
                __setFunctionName(_classThis, "Square");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Square = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Square = _classThis;
            })();
            await createFixture
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.attached, 1);
        });
        it('does not invokes attached hooks on synthetic controller of repeat', async function () {
            await createFixture
                .html('<div repeat.for="i of 2">')
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(tracker.attached, /* root CE + repeat CA */ 2);
        });
    });
    describe('[asynchronous]', function () {
        const hookSymbol = Symbol();
        let tracker = null;
        this.beforeEach(function () {
            tracker = new AsyncLifeycyleTracker();
        });
        let AttachedLoggingHook = (() => {
            let _classDecorators = [lifecycleHooks()];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var AttachedLoggingHook = _classThis = class {
                async attached(vm, initiator) {
                    vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                    tracker.trace('lch.start');
                    return waitForTicks(5).then(() => tracker.trace('lch.end'));
                }
            };
            __setFunctionName(_classThis, "AttachedLoggingHook");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                AttachedLoggingHook = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return AttachedLoggingHook = _classThis;
        })();
        it('invokes global hook in parallel', async function () {
            await createFixture
                .component(class {
                attached() {
                    tracker.trace('comp.start');
                    return waitForTicks(1).then(() => tracker.trace('comp.end'));
                }
            })
                .html ``
                .deps(AttachedLoggingHook)
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
            ]);
        });
        it('invokes local hooks in parallel', async function () {
            var _a;
            await createFixture
                .component((_a = class {
                    attached() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [AttachedLoggingHook],
                _a))
                .html ``
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
            ]);
        });
        it('invokes global hooks in parallel for CA', async function () {
            var _a;
            let Square = (() => {
                let _classDecorators = [customAttribute('square')];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Square = _classThis = class {
                    attached() {
                        tracker.trace('square.start');
                        return waitForTicks(1).then(() => tracker.trace('square.end'));
                    }
                };
                __setFunctionName(_classThis, "Square");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Square = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Square = _classThis;
            })();
            await createFixture
                .component((_a = class {
                    attached() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [AttachedLoggingHook],
                _a))
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                // parents (root component) attached should
                // only be called after all children attached (square attr)
                // have been called
                'square.start',
                'square.end',
                // then at the root level
                // lch and component are started in parallel
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
            ]);
        });
        const waitForTicks = async (count) => {
            while (count-- > 0) {
                await Promise.resolve();
            }
        };
        class AsyncLifeycyleTracker {
            constructor() {
                this.logs = [];
            }
            trace(msg) {
                this.logs.push(msg);
            }
        }
    });
});
//# sourceMappingURL=lifecycle-hooks.attached.spec.js.map