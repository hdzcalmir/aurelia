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
import { capture, customElement, CustomElement, CustomElementDefinition } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
describe('3-runtime-html/custom-elements.decorator.spec.ts', function () {
    describe('@capture', function () {
        it('retrieves capture on class annonated', function () {
            let El = (() => {
                let _classDecorators = [capture()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var El = _classThis = class {
                };
                __setFunctionName(_classThis, "El");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    El = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return El = _classThis;
            })();
            const { capture: $capture } = CustomElementDefinition.create('el', El);
            assert.deepStrictEqual($capture, true);
        });
        it('retries capture on class annotated with filter function', function () {
            const filter = () => true;
            let El = (() => {
                let _classDecorators = [capture(filter)];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var El = _classThis = class {
                };
                __setFunctionName(_classThis, "El");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    El = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return El = _classThis;
            })();
            const { capture: $capture } = CustomElementDefinition.create('el', El);
            assert.deepStrictEqual($capture, filter);
        });
        it('setups the right value when decorated before @customElement', function () {
            let El = (() => {
                let _classDecorators = [capture(), customElement({ name: 'el' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var El = _classThis = class {
                };
                __setFunctionName(_classThis, "El");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    El = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return El = _classThis;
            })();
            const { capture: $capture } = CustomElement.getDefinition(El);
            assert.deepStrictEqual($capture, true);
        });
        it('setups the right value when decorated after @customElement', function () {
            let El = (() => {
                let _classDecorators = [customElement({ name: 'el' }), capture()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var El = _classThis = class {
                };
                __setFunctionName(_classThis, "El");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    El = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return El = _classThis;
            })();
            const { capture: $capture } = CustomElement.getDefinition(El);
            assert.deepStrictEqual($capture, true);
        });
    });
});
//# sourceMappingURL=custom-elements.decorator.spec.js.map