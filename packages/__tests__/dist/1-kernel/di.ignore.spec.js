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
import { DI, ignore, inject, resolve } from '@aurelia/kernel';
import { assert } from '@aurelia/testing';
describe('1-kernel/di.ignore.spec.ts', function () {
    it('resolve(ignore)', function () {
        class A {
        }
        class C {
        }
        class B {
            constructor() {
                this.a = resolve(ignore);
                this.c = resolve(C);
            }
        }
        const container = DI.createContainer();
        container.register(A, C);
        const b = container.get(B);
        assert.strictEqual(b.a, undefined);
        assert.instanceOf(b.c, C);
    });
    it('inject(ignore)', function () {
        class A {
        }
        class C {
        }
        let B = (() => {
            let _classDecorators = [inject(ignore, C)];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var B = _classThis = class {
                constructor(a, c) {
                    this.a = a;
                    this.c = c;
                }
            };
            __setFunctionName(_classThis, "B");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                B = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return B = _classThis;
        })();
        const container = DI.createContainer();
        container.register(A, C);
        const b = container.get(B);
        assert.strictEqual(b.a, undefined);
        assert.instanceOf(b.c, C);
    });
    it('inject = [ignore]', function () {
        class A {
        }
        class C {
        }
        class B {
            constructor(a, c) {
                this.a = a;
                this.c = c;
            }
        }
        B.inject = [ignore, C];
        const container = DI.createContainer();
        container.register(A, C);
        const b = container.get(B);
        assert.strictEqual(b.a, undefined);
        assert.instanceOf(b.c, C);
    });
    it('inject(ignore) - with optional param - null', function () {
        class A {
        }
        class C {
        }
        let B = (() => {
            let _classDecorators = [inject(ignore, C)];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var B = _classThis = class {
                constructor(a = null, c) {
                    this.a = a;
                    this.c = c;
                }
            };
            __setFunctionName(_classThis, "B");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                B = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return B = _classThis;
        })();
        const container = DI.createContainer();
        container.register(A, C);
        const b = container.get(B);
        assert.strictEqual(b.a, null);
        assert.instanceOf(b.c, C);
    });
    it('inject = [ignore] - with optional param - null', function () {
        class A {
        }
        class C {
        }
        class B {
            constructor(a = null, c) {
                this.a = a;
                this.c = c;
            }
        }
        B.inject = [ignore, C];
        const container = DI.createContainer();
        container.register(A, C);
        const b = container.get(B);
        assert.strictEqual(b.a, null);
        assert.instanceOf(b.c, C);
    });
    it('inject(ignore) - with optional param - truthy', function () {
        class A {
        }
        class C {
        }
        let B = (() => {
            let _classDecorators = [inject(ignore, C)];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var B = _classThis = class {
                constructor(a = new A(), c) {
                    this.a = a;
                    this.c = c;
                }
            };
            __setFunctionName(_classThis, "B");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                B = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return B = _classThis;
        })();
        const container = DI.createContainer();
        container.register(A, C);
        const b = container.get(B);
        assert.instanceOf(b.a, A);
        assert.instanceOf(b.c, C);
    });
    it('inject = [ignore] - with optional param - truthy', function () {
        class A {
        }
        class C {
        }
        class B {
            constructor(a = new A(), c) {
                this.a = a;
                this.c = c;
            }
        }
        B.inject = [ignore, C];
        const container = DI.createContainer();
        container.register(A, C);
        const b = container.get(B);
        assert.instanceOf(b.a, A);
        assert.instanceOf(b.c, C);
    });
});
//# sourceMappingURL=di.ignore.spec.js.map