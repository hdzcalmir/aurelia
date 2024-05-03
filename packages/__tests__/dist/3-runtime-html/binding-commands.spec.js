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
import { alias, } from '@aurelia/runtime-html';
import { bindingCommand, OneTimeBindingCommand, BindingCommand, } from '@aurelia/template-compiler';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/binding-commands.spec.ts', function () {
    describe('registration & resolution', function () {
        let container;
        beforeEach(function () {
            container = DI.createContainer();
        });
        let FooBindingCommand = (() => {
            let _classDecorators = [bindingCommand('foo')];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var FooBindingCommand = _classThis = class {
            };
            __setFunctionName(_classThis, "FooBindingCommand");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                FooBindingCommand = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return FooBindingCommand = _classThis;
        })();
        it('resolves to the same instance when impl was retrieved before registration', function () {
            const i1 = container.get(FooBindingCommand);
            container.register(FooBindingCommand);
            const i2 = container.get(BindingCommand.keyFrom('foo'));
            const i3 = BindingCommand.get(container, 'foo');
            assert.strictEqual(i1, i2);
            assert.strictEqual(i1, i3);
            const [_, i4] = container.getAll(FooBindingCommand);
            assert.strictEqual(i4, undefined);
        });
        it('resolves to the same instance when impl was retrieved after registration', function () {
            container.register(FooBindingCommand);
            const i1 = container.get(FooBindingCommand);
            const i2 = container.get(BindingCommand.keyFrom('foo'));
            const i3 = BindingCommand.get(container, 'foo');
            assert.strictEqual(i1, i2);
            assert.strictEqual(i1, i3);
            const [_, i4] = container.getAll(FooBindingCommand);
            assert.strictEqual(i4, undefined);
        });
        it('does not retrieve the intermediate container value converter registration', function () {
            const child1 = container.createChild();
            const child2 = child1.createChild();
            let id = 0;
            let Foo1 = (() => {
                let _classDecorators = [bindingCommand('foo1')];
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
            BindingCommand.get(child2, 'foo1');
            assert.strictEqual(id, 1, `should create value converter only once`);
            BindingCommand.get(child1, 'foo1');
            assert.strictEqual(id, 2, `should create another value converter in the middle layer container`);
        });
    });
    describe('aliases', function () {
        const app = class {
            constructor() {
                this.value = 'wOOt';
            }
        };
        let WootCommand = (() => {
            let _classDecorators = [bindingCommand({ name: 'woot1', aliases: ['woot13'] }), alias(...['woot11', 'woot12'])];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var WootCommand = _classThis = class {
                constructor(oneTimeCmd) {
                    this.oneTimeCmd = oneTimeCmd;
                    this.ignoreAttr = false;
                    this.name = 'woot1';
                }
                build(info, parser, mapper) {
                    return this.oneTimeCmd.build(info, parser, mapper);
                }
            };
            __setFunctionName(_classThis, "WootCommand");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                WootCommand = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            })();
            _classThis.inject = [OneTimeBindingCommand];
            (() => {
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return WootCommand = _classThis;
        })();
        let WootCommand2 = (() => {
            let _classDecorators = [bindingCommand({ name: 'woot2', aliases: ['woot23'] }), alias('woot21', 'woot22')];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var WootCommand2 = _classThis = class {
                constructor(oneTimeCmd) {
                    this.oneTimeCmd = oneTimeCmd;
                    this.ignoreAttr = false;
                    this.name = 'woot2';
                }
                build(info, parser, mapper) {
                    return this.oneTimeCmd.build(info, parser, mapper);
                }
            };
            __setFunctionName(_classThis, "WootCommand2");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                WootCommand2 = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            })();
            _classThis.inject = [OneTimeBindingCommand];
            (() => {
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return WootCommand2 = _classThis;
        })();
        const resources = [WootCommand, WootCommand2];
        it('Simple spread Alias doesn\'t break def alias works on binding command', function () {
            const options = createFixture('<template> <a href.woot1="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple spread Alias (1st position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot11="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple spread Alias (2nd position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot12="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple spread Alias doesn\'t break original binding command', function () {
            const options = createFixture('<template> <a href.woot13="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias doesn\'t break def alias works on binding command', function () {
            const options = createFixture('<template> <a href.woot23="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias (1st position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot21="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias (2nd position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot22="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias doesn\'t break original binding command', function () {
            const options = createFixture('<template> <a href.woot2="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
    });
});
//# sourceMappingURL=binding-commands.spec.js.map