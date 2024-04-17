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
describe('3-runtime-html/lifecycle-hooks.created.spec.ts', function () {
    const hookSymbol = Symbol();
    let tracker = null;
    this.beforeEach(function () {
        tracker = new LifeycyleTracker();
    });
    let CreatedLoggingHook = (() => {
        let _classDecorators = [lifecycleHooks()];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var CreatedLoggingHook = _classThis = class {
            created(vm, controller) {
                vm[hookSymbol] = controller[hookSymbol] = hookSymbol;
                tracker.created++;
                tracker.controllers.push(controller);
            }
        };
        __setFunctionName(_classThis, "CreatedLoggingHook");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CreatedLoggingHook = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return CreatedLoggingHook = _classThis;
    })();
    describe('custom elements', function () {
        it('invokes global created hooks', async function () {
            const { component } = await createFixture
                .html `\${message}`
                .deps(CreatedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.created, 1);
        });
        it('invokes when registered both globally and locally', async function () {
            const { component } = await createFixture
                .component(CustomElement.define({ name: 'app', dependencies: [CreatedLoggingHook] }))
                .html `\${message}`
                .deps(CreatedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.created, 2);
            assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
        });
        it('invokes before the view model lifecycle', async function () {
            let createdCall = 0;
            await createFixture
                .component(class App {
                created() {
                    assert.strictEqual(this[hookSymbol], hookSymbol);
                    createdCall++;
                }
            })
                .html ``
                .deps(CreatedLoggingHook)
                .build().started;
            assert.strictEqual(createdCall, 1);
        });
    });
    describe('custom attributes', function () {
        const caHooksSymbol = Symbol();
        let current = null;
        this.beforeEach(function () {
            current = null;
        });
        let Square = (() => {
            let _classDecorators = [customAttribute('square')];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var Square = _classThis = class {
                created() {
                    this[caHooksSymbol] = true;
                    current = this;
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
        it('invokes global created hooks', async function () {
            await createFixture
                .html `<div square>`
                .deps(Square, CreatedLoggingHook)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(current[hookSymbol], hookSymbol);
            assert.strictEqual(current?.[caHooksSymbol], true);
        });
        it('does not invokes created hooks on owning CE', async function () {
            await createFixture
                .html `<square>`
                .deps(CustomElement.define({
                name: 'square',
                template: '<div square>',
                dependencies: [Square]
            }))
                .build().started;
            assert.instanceOf(current, Square);
            assert.notStrictEqual(current[hookSymbol], hookSymbol);
            assert.strictEqual(current?.[caHooksSymbol], true);
        });
        it('invokes own created hooks deps', async function () {
            let attr;
            let Attr = (() => {
                let _classDecorators = [customAttribute({
                        name: 'attr',
                        dependencies: [CreatedLoggingHook]
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Attr = _classThis = class {
                    created() {
                        attr = this;
                    }
                };
                __setFunctionName(_classThis, "Attr");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Attr = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Attr = _classThis;
            })();
            await createFixture
                .html `<div attr>`
                .deps(Attr)
                .build().started;
            assert.instanceOf(attr, Attr);
            assert.strictEqual(attr[hookSymbol], hookSymbol);
        });
    });
    class LifeycyleTracker {
        constructor() {
            this.created = 0;
            this.controllers = [];
        }
    }
});
//# sourceMappingURL=lifecycle-hooks.created.spec.js.map