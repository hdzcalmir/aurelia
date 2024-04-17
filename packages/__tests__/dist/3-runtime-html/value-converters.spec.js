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
import { alias, valueConverter, bindable, customAttribute, INode, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
import { resolve } from '@aurelia/kernel';
// TemplateCompiler - value converter integration
describe('3-runtime-html/value-converters.spec.ts', function () {
    // custom elements
    describe('01. Aliases', function () {
        let WootConverter = (() => {
            let _classDecorators = [valueConverter({ name: 'woot1', aliases: ['woot13'] }), alias(...['woot11', 'woot12'])];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var WootConverter = _classThis = class {
                toView() {
                    return 'wOOt1';
                }
            };
            __setFunctionName(_classThis, "WootConverter");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                WootConverter = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return WootConverter = _classThis;
        })();
        let WootConverter2 = (() => {
            let _classDecorators = [valueConverter({ name: 'woot2', aliases: ['woot23'] }), alias('woot21', 'woot22')];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var WootConverter2 = _classThis = class {
                toView() {
                    return 'wOOt1';
                }
            };
            __setFunctionName(_classThis, "WootConverter2");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                WootConverter2 = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return WootConverter2 = _classThis;
        })();
        let FooAttribute = (() => {
            let _classDecorators = [customAttribute({ name: 'foo5', aliases: ['foo53'] }), alias(...['foo51', 'foo52'])];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _value_decorators;
            let _value_initializers = [];
            let _value_extraInitializers = [];
            var FooAttribute = _classThis = class {
                constructor() {
                    this.value = __runInitializers(this, _value_initializers, void 0);
                    this.element = (__runInitializers(this, _value_extraInitializers), resolve(INode));
                }
                bound() {
                    this.element.setAttribute('test', this.value);
                }
            };
            __setFunctionName(_classThis, "FooAttribute");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _value_decorators = [bindable({ primary: true })];
                __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                FooAttribute = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return FooAttribute = _classThis;
        })();
        let FooAttribute2 = (() => {
            let _classDecorators = [customAttribute({ name: 'foo4', aliases: ['foo43'] }), alias('foo41', 'foo42')];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _value_decorators;
            let _value_initializers = [];
            let _value_extraInitializers = [];
            var FooAttribute2 = _classThis = class {
                constructor() {
                    this.value = __runInitializers(this, _value_initializers, void 0);
                    this.element = (__runInitializers(this, _value_extraInitializers), resolve(INode));
                }
                bound() {
                    this.element.setAttribute('test', this.value);
                }
            };
            __setFunctionName(_classThis, "FooAttribute2");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _value_decorators = [bindable({ primary: true })];
                __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                FooAttribute2 = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return FooAttribute2 = _classThis;
        })();
        const resources = [WootConverter, WootConverter2, FooAttribute2, FooAttribute];
        const app = class {
            constructor() {
                this.value = 'wOOt';
            }
        };
        it('Simple spread Alias doesn\'t break def alias works on value converter', async function () {
            const options = createFixture('<template> <div foo53.bind="value | woot13"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple spread Alias (1st position) works on value converter', async function () {
            const options = createFixture('<template> <div foo51.bind="value | woot11"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple spread Alias (2nd position) works on value converter', async function () {
            const options = createFixture('<template> <div foo52.bind="value | woot12"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple spread Alias doesn\'t break original value converter', async function () {
            const options = createFixture('<template> <div foo5.bind="value | woot2"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias doesn\'t break def alias works on value converter', async function () {
            const options = createFixture('<template> <div foo43.bind="value | woot23"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias (1st position) works on value converter', async function () {
            const options = createFixture('<template> <div foo41.bind="value | woot21"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias (2nd position) works on value converter', async function () {
            const options = createFixture('<template> <div foo42.bind="value | woot22"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias doesn\'t break original value converter', async function () {
            const options = createFixture('<template> <div foo4.bind="value | woot2"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
    });
});
//# sourceMappingURL=value-converters.spec.js.map