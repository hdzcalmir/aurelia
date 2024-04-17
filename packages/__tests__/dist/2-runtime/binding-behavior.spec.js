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
import { DI } from '@aurelia/kernel';
import { bindingBehavior, BindingBehavior } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
describe(`2-runtime/binding-behavior.spec.ts`, function () {
    let container;
    beforeEach(function () {
        container = DI.createContainer();
    });
    let FooBindingBehavior = (() => {
        let _classDecorators = [bindingBehavior('foo')];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var FooBindingBehavior = _classThis = class {
        };
        __setFunctionName(_classThis, "FooBindingBehavior");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FooBindingBehavior = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return FooBindingBehavior = _classThis;
    })();
    it(`should define the binding behavior`, function () {
        const definition = BindingBehavior.getDefinition(FooBindingBehavior);
        assert.strictEqual(definition.name, 'foo', `definition.name`);
        container.register(FooBindingBehavior);
        const instance = container.get(BindingBehavior.keyFrom('foo'));
        assert.instanceOf(instance, FooBindingBehavior, `instance`);
    });
    it('resolves to the same instance when impl was retrieved before registration', function () {
        const i1 = container.get(FooBindingBehavior);
        container.register(FooBindingBehavior);
        const i2 = container.get(BindingBehavior.keyFrom('foo'));
        const i3 = BindingBehavior.get(container, 'foo');
        assert.strictEqual(i1, i2);
        assert.strictEqual(i1, i3);
        const [_, i4] = container.getAll(FooBindingBehavior);
        assert.strictEqual(i4, undefined);
    });
    it('resolves to the same instance when impl was retrieved after registration', function () {
        container.register(FooBindingBehavior);
        const i1 = container.get(FooBindingBehavior);
        const i2 = container.get(BindingBehavior.keyFrom('foo'));
        const i3 = BindingBehavior.get(container, 'foo');
        assert.strictEqual(i1, i2);
        assert.strictEqual(i1, i3);
        const [_, i4] = container.getAll(FooBindingBehavior);
        assert.strictEqual(i4, undefined);
    });
    it('does not retrieve the intermediate container value converter registration', function () {
        const child1 = container.createChild();
        const child2 = child1.createChild();
        let id = 0;
        let Foo1 = (() => {
            let _classDecorators = [bindingBehavior('foo1')];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var Foo1 = _classThis = class {
                constructor() {
                    this.id = ++id;
                }
            };
            __setFunctionName(_classThis, "Foo1");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                Foo1 = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return Foo1 = _classThis;
        })();
        child1.register(Foo1);
        container.register(Foo1);
        BindingBehavior.get(child2, 'foo1');
        assert.strictEqual(id, 1, `should create binding behavior only once`);
        BindingBehavior.get(child1, 'foo1');
        assert.strictEqual(id, 2, `should create another binding behavior in the middle layer container`);
    });
});
//# sourceMappingURL=binding-behavior.spec.js.map