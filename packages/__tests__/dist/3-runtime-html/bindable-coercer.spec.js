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
import { DI, noop, Registration } from '@aurelia/kernel';
import { Aurelia, bindable, customElement, CustomElement, IPlatform, coercer, customAttribute, CustomAttribute, StandardConfiguration } from '@aurelia/runtime-html';
import { assert, PLATFORMRegistration, TestContext } from '@aurelia/testing';
import { createSpecFunction } from '../util.js';
describe('3-runtime-html/bindable-coercer.spec.ts', function () {
    const $it = createSpecFunction(testRepeatForCustomElement);
    async function testRepeatForCustomElement(testFunction, { template, registrations = [], app, enableCoercion = true, coerceNullish = false, }) {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        ctx.doc.body.appendChild(host);
        const container = ctx['_container'] = DI.createContainer();
        container.register(StandardConfiguration
            .customize((opt) => {
            opt.coercingOptions.enableCoercion = enableCoercion;
            opt.coercingOptions.coerceNullish = coerceNullish;
        }), Registration.instance(TestContext, ctx), ...registrations);
        if (container.has(IPlatform, true) === false) {
            container.register(PLATFORMRegistration);
        }
        const au = new Aurelia(container);
        await au
            .app({
            host,
            component: CustomElement.define({ name: 'app', template }, app ?? class {
            })
        })
            .start();
        const component = au.root.controller.viewModel;
        await testFunction({ app: component, container, ctx, host, platform: container.get(IPlatform) });
        await au.stop();
        assert.strictEqual(host.textContent, '', `host.textContent`);
        ctx.doc.body.removeChild(host);
    }
    function getTypeSpecification(type) {
        return type === undefined ? 'implicit type from TS metadata' : 'explicit type';
    }
    // Implicit type from TS metadata won't work, because with TC39 decorator proposal, TS does not emit the design metadata.
    // Refer: https://github.com/microsoft/TypeScript/issues/55788
    for (const type of [/* undefined, */ Number]) {
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _num_decorators;
                let _num_initializers = [];
                let _num_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.num = __runInitializers(this, _num_initializers, void 0);
                        __runInitializers(this, _num_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _num_decorators = [bindable({ type })];
                    __esDecorate(null, null, _num_decorators, { kind: "field", name: "num", static: false, private: false, access: { has: obj => "num" in obj, get: obj => obj.num, set: (obj, value) => { obj.num = value; } }, metadata: _metadata }, _num_initializers, _num_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
            }
            $it(`number - numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 42);
            }, { app: App, template: `<my-el component.ref="myEl" num="42"></my-el>`, registrations: [MyEl] });
            $it(`number - numeric string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 42);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`number - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 42);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`number - non-numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(Number.isNaN(ctx.app.myEl.num), true);
            }, { app: App, template: `<my-el component.ref="myEl" num="forty-two"></my-el>`, registrations: [MyEl] });
            $it(`number - non-numeric string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(Number.isNaN(ctx.app.myEl.num), true);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="'forty-two'"></my-el>`, registrations: [MyEl] });
            $it(`number - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 1);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`number - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 0);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`number - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, undefined);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`number - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, null);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`number - object - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(Number.isNaN(ctx.app.myEl.num), true);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="{}"></my-el>`, registrations: [MyEl] });
            $it(`number - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.num, undefined);
                app.prop = null;
                assert.strictEqual(myEl.num, null);
                app.prop = '0';
                assert.strictEqual(myEl.num, 0);
                app.prop = '42';
                assert.strictEqual(myEl.num, 42);
                app.prop = 0;
                assert.strictEqual(myEl.num, 0);
                app.prop = 84;
                assert.strictEqual(myEl.num, 84);
                app.prop = true;
                assert.strictEqual(myEl.num, 1);
                app.prop = 'true';
                assert.strictEqual(Number.isNaN(myEl.num), true);
                app.prop = {};
                assert.strictEqual(Number.isNaN(myEl.num), true);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _num_decorators;
                let _num_initializers = [];
                let _num_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.num = __runInitializers(this, _num_initializers, void 0);
                        __runInitializers(this, _num_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _num_decorators = [bindable({ nullable: false, type })];
                    __esDecorate(null, null, _num_decorators, { kind: "field", name: "num", static: false, private: false, access: { has: obj => "num" in obj, get: obj => obj.num, set: (obj, value) => { obj.num = value; } }, metadata: _metadata }, _num_initializers, _num_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
            }
            $it(`not-nullable number - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(Number.isNaN(myEl.num), true);
                app.prop = null;
                assert.strictEqual(myEl.num, 0);
                app.prop = '42';
                assert.strictEqual(myEl.num, 42);
                app.prop = 0;
                assert.strictEqual(myEl.num, 0);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    // Implicit type from TS metadata won't work, because with TC39 decorator proposal, TS does not emit the design metadata.
    // Refer: https://github.com/microsoft/TypeScript/issues/55788
    for (const type of [/* undefined,  */ String]) {
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _str_decorators;
                let _str_initializers = [];
                let _str_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.str = __runInitializers(this, _str_initializers, void 0);
                        __runInitializers(this, _str_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _str_decorators = [bindable({ type })];
                    __esDecorate(null, null, _str_decorators, { kind: "field", name: "str", static: false, private: false, access: { has: obj => "str" in obj, get: obj => obj.str, set: (obj, value) => { obj.str = value; } }, metadata: _metadata }, _str_initializers, _str_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
            }
            $it(`string - string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '42');
            }, { app: App, template: `<my-el component.ref="myEl" str="42"></my-el>`, registrations: [MyEl] });
            $it(`string - string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '42');
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`string - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '42');
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, 'true');
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, 'false');
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`string - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, undefined);
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`string - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, null);
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`string - object - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '[object Object]');
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="{}"></my-el>`, registrations: [MyEl] });
            $it(`string - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.str, undefined);
                app.prop = null;
                assert.strictEqual(myEl.str, null);
                app.prop = '0';
                assert.strictEqual(myEl.str, '0');
                app.prop = '42';
                assert.strictEqual(myEl.str, '42');
                app.prop = 0;
                assert.strictEqual(myEl.str, '0');
                app.prop = 42;
                assert.strictEqual(myEl.str, '42');
                app.prop = true;
                assert.strictEqual(myEl.str, 'true');
                app.prop = false;
                assert.strictEqual(myEl.str, 'false');
                app.prop = {};
                assert.strictEqual(myEl.str, '[object Object]');
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _str_decorators;
                let _str_initializers = [];
                let _str_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.str = __runInitializers(this, _str_initializers, void 0);
                        __runInitializers(this, _str_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _str_decorators = [bindable({ nullable: false, type })];
                    __esDecorate(null, null, _str_decorators, { kind: "field", name: "str", static: false, private: false, access: { has: obj => "str" in obj, get: obj => obj.str, set: (obj, value) => { obj.str = value; } }, metadata: _metadata }, _str_initializers, _str_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
            }
            $it(`not-nullable string - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.str, 'undefined');
                app.prop = null;
                assert.strictEqual(myEl.str, 'null');
                app.prop = '42';
                assert.strictEqual(myEl.str, '42');
                app.prop = 0;
                assert.strictEqual(myEl.str, '0');
            }, { app: App, template: `<my-el component.ref="myEl" str.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    // Implicit type from TS metadata won't work, because with TC39 decorator proposal, TS does not emit the design metadata.
    // Refer: https://github.com/microsoft/TypeScript/issues/55788
    for (const type of [/* undefined,  */ Boolean]) {
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _bool_decorators;
                let _bool_initializers = [];
                let _bool_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.bool = __runInitializers(this, _bool_initializers, void 0);
                        __runInitializers(this, _bool_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _bool_decorators = [bindable({ type })];
                    __esDecorate(null, null, _bool_decorators, { kind: "field", name: "bool", static: false, private: false, access: { has: obj => "bool" in obj, get: obj => obj.bool, set: (obj, value) => { obj.bool = value; } }, metadata: _metadata }, _bool_initializers, _bool_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
            }
            $it(`string - boolean true string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool="true"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean false string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool="false"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean true string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean false string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, false);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`string - number 1 literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="1"></my-el>`, registrations: [MyEl] });
            $it(`string -number 0 literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, false);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="0"></my-el>`, registrations: [MyEl] });
            $it(`string - numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool="42"></my-el>`, registrations: [MyEl] });
            $it(`string - string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`string - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`string - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, undefined);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`string - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, null);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`string - object - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="{}"></my-el>`, registrations: [MyEl] });
            $it(`string - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.bool, undefined);
                app.prop = null;
                assert.strictEqual(myEl.bool, null);
                app.prop = '0';
                assert.strictEqual(myEl.bool, true);
                app.prop = '1';
                assert.strictEqual(myEl.bool, true);
                app.prop = '42';
                assert.strictEqual(myEl.bool, true);
                app.prop = 0;
                assert.strictEqual(myEl.bool, false);
                app.prop = 1;
                assert.strictEqual(myEl.bool, true);
                app.prop = 42;
                assert.strictEqual(myEl.bool, true);
                app.prop = true;
                assert.strictEqual(myEl.bool, true);
                app.prop = false;
                assert.strictEqual(myEl.bool, false);
                app.prop = 'true';
                assert.strictEqual(myEl.bool, true);
                app.prop = 'false';
                assert.strictEqual(myEl.bool, true);
                app.prop = {};
                assert.strictEqual(myEl.bool, true);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _bool_decorators;
                let _bool_initializers = [];
                let _bool_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.bool = __runInitializers(this, _bool_initializers, void 0);
                        __runInitializers(this, _bool_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _bool_decorators = [bindable({ nullable: false, type })];
                    __esDecorate(null, null, _bool_decorators, { kind: "field", name: "bool", static: false, private: false, access: { has: obj => "bool" in obj, get: obj => obj.bool, set: (obj, value) => { obj.bool = value; } }, metadata: _metadata }, _bool_initializers, _bool_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
            }
            $it(`not-nullable boolean - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.bool, false);
                app.prop = null;
                assert.strictEqual(myEl.bool, false);
                app.prop = '42';
                assert.strictEqual(myEl.bool, true);
                app.prop = 0;
                assert.strictEqual(myEl.bool, false);
            }, { app: App, template: `<my-el component.ref="myEl" bool.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    // Implicit type from TS metadata won't work, because with TC39 decorator proposal, TS does not emit the design metadata.
    // Refer: https://github.com/microsoft/TypeScript/issues/55788
    for (const type of [/* undefined, */ BigInt]) {
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _num_decorators;
                let _num_initializers = [];
                let _num_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.num = __runInitializers(this, _num_initializers, void 0);
                        __runInitializers(this, _num_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _num_decorators = [bindable({ type })];
                    __esDecorate(null, null, _num_decorators, { kind: "field", name: "num", static: false, private: false, access: { has: obj => "num" in obj, get: obj => obj.num, set: (obj, value) => { obj.num = value; } }, metadata: _metadata }, _num_initializers, _num_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
            }
            $it(`bigint - numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(42));
            }, { app: App, template: `<my-el component.ref="myEl" num="42"></my-el>`, registrations: [MyEl] });
            $it(`bigint - numeric string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(42));
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`bigint - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(42));
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`bigint - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(1));
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`bigint - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(0));
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`bigint - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, undefined);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`bigint - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, null);
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`bigint - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.num, undefined);
                app.prop = null;
                assert.strictEqual(myEl.num, null);
                app.prop = '0';
                assert.strictEqual(myEl.num, BigInt(0));
                app.prop = '42';
                assert.strictEqual(myEl.num, BigInt(42));
                app.prop = 0;
                assert.strictEqual(myEl.num, BigInt(0));
                app.prop = 84;
                assert.strictEqual(myEl.num, BigInt(84));
                app.prop = true;
                assert.strictEqual(myEl.num, BigInt(1));
                assert.throws(() => {
                    app.prop = 'true';
                });
                assert.throws(() => {
                    app.prop = {};
                });
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _num_decorators;
                let _num_initializers = [];
                let _num_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.num = __runInitializers(this, _num_initializers, void 0);
                        __runInitializers(this, _num_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _num_decorators = [bindable({ nullable: false, type })];
                    __esDecorate(null, null, _num_decorators, { kind: "field", name: "num", static: false, private: false, access: { has: obj => "num" in obj, get: obj => obj.num, set: (obj, value) => { obj.num = value; } }, metadata: _metadata }, _num_initializers, _num_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
                constructor() {
                    this.prop = 42;
                }
            }
            $it(`not-nullable number - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.num, BigInt(42));
                assert.throws(() => {
                    app.prop = null;
                });
                assert.throws(() => {
                    app.prop = undefined;
                });
                app.prop = 0;
                assert.strictEqual(myEl.num, BigInt(0));
            }, { app: App, template: `<my-el component.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }
    }
    Person.coerced = 0;
    function createPerson(value) {
        if (value instanceof this)
            return value;
        this.coerced++;
        if (typeof value === 'string') {
            try {
                const json = JSON.parse(value);
                return new this(json.name, json.age);
            }
            catch {
                return new this(value, null);
            }
        }
        if (typeof value === 'number') {
            return new this(null, value);
        }
        if (typeof value === 'object' && value != null) {
            return new this(value.name, value.age);
        }
        return new this(null, null);
    }
    /* eslint-disable no-useless-escape */
    {
        class Person1 extends Person {
        }
        Person1.coerce = createPerson.bind(Person1);
        // Implicit type from TS metadata won't work, because with TC39 decorator proposal, TS does not emit the design metadata.
        // Refer: https://github.com/microsoft/TypeScript/issues/55788
        for (const type of [/* undefined,  */ Person1]) {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _person_decorators;
                let _person_initializers = [];
                let _person_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.person = __runInitializers(this, _person_initializers, void 0);
                        __runInitializers(this, _person_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _person_decorators = [bindable({ type })];
                    __esDecorate(null, null, _person_decorators, { kind: "field", name: "person", static: false, private: false, access: { has: obj => "person" in obj, get: obj => obj.person, set: (obj, value) => { obj.person = value; } }, metadata: _metadata }, _person_initializers, _person_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            {
                class App {
                }
                $it(`class with static coercer - string literal - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1('john', null));
                }, { app: App, template: `<my-el component.ref="myEl" person="john"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(null, 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="42"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - json string - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person='{\"name\":\"john\",\"age\":42}'></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - object literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="{name:'john',age:42}"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(null, null));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="true"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(null, null));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="false"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, undefined);
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="undefined"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - null - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, null);
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="null"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - object - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(void 0, void 0));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="{}"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.strictEqual(myEl.person, undefined);
                    app.prop = null;
                    assert.strictEqual(myEl.person, null);
                    app.prop = 'john';
                    assert.deepStrictEqual(myEl.person, new Person1('john', null));
                    app.prop = JSON.stringify(new Person1('john', 42));
                    assert.deepStrictEqual(myEl.person, new Person1('john', 42));
                    app.prop = 42;
                    assert.deepStrictEqual(myEl.person, new Person1(null, 42));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
            {
                let MyEl = (() => {
                    let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _person_decorators;
                    let _person_initializers = [];
                    let _person_extraInitializers = [];
                    var MyEl = _classThis = class {
                        constructor() {
                            this.person = __runInitializers(this, _person_initializers, void 0);
                            __runInitializers(this, _person_extraInitializers);
                        }
                    };
                    __setFunctionName(_classThis, "MyEl");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        _person_decorators = [bindable({ nullable: false, type })];
                        __esDecorate(null, null, _person_decorators, { kind: "field", name: "person", static: false, private: false, access: { has: obj => "person" in obj, get: obj => obj.person, set: (obj, value) => { obj.person = value; } }, metadata: _metadata }, _person_initializers, _person_extraInitializers);
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        MyEl = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return MyEl = _classThis;
                })();
                class App {
                }
                $it(`not-nullable - class with static coercer - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.deepStrictEqual(myEl.person, new Person1(null, null));
                    app.prop = null;
                    assert.deepStrictEqual(myEl.person, new Person1(null, null));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
        }
    }
    {
        beforeEach(function () { Person2.coerced = 0; });
        let Person2 = (() => {
            var _a;
            let _classSuper = Person;
            let _staticExtraInitializers = [];
            let _static_createPerson_decorators;
            return _a = class Person2 extends _classSuper {
                    static createPerson(value) { return createPerson.bind(_a)(value); }
                },
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    _static_createPerson_decorators = [coercer];
                    __esDecorate(_a, null, _static_createPerson_decorators, { kind: "method", name: "createPerson", static: true, private: false, access: { has: obj => "createPerson" in obj, get: obj => obj.createPerson }, metadata: _metadata }, null, _staticExtraInitializers);
                    if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_a, _staticExtraInitializers);
                })(),
                _a;
        })();
        // Implicit type from TS metadata won't work, because with TC39 decorator proposal, TS does not emit the design metadata.
        // Refer: https://github.com/microsoft/TypeScript/issues/55788
        for (const type of [/* undefined, */ Person2]) {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _person_decorators;
                let _person_initializers = [];
                let _person_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.person = __runInitializers(this, _person_initializers, void 0);
                        __runInitializers(this, _person_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _person_decorators = [bindable({ type })];
                    __esDecorate(null, null, _person_decorators, { kind: "field", name: "person", static: false, private: false, access: { has: obj => "person" in obj, get: obj => obj.person, set: (obj, value) => { obj.person = value; } }, metadata: _metadata }, _person_initializers, _person_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            {
                class App {
                }
                $it(`class with coercer decorator - string literal - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2('john', null));
                }, { app: App, template: `<my-el component.ref="myEl" person="john"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(null, 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="42"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - json string - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person='{\"name\":\"john\",\"age\":42}'></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - object literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="{name:'john',age:42}"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(null, null));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="true"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(null, null));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="false"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, undefined);
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="undefined"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - null - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, null);
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="null"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - object - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(void 0, void 0));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="{}"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.strictEqual(myEl.person, undefined);
                    app.prop = null;
                    assert.strictEqual(myEl.person, null);
                    app.prop = 'john';
                    assert.deepStrictEqual(myEl.person, new Person2('john', null));
                    app.prop = JSON.stringify(new Person2('john', 42));
                    assert.deepStrictEqual(myEl.person, new Person2('john', 42));
                    app.prop = 42;
                    assert.deepStrictEqual(myEl.person, new Person2(null, 42));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
            {
                let MyEl = (() => {
                    let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    let _person_decorators;
                    let _person_initializers = [];
                    let _person_extraInitializers = [];
                    var MyEl = _classThis = class {
                        constructor() {
                            this.person = __runInitializers(this, _person_initializers, void 0);
                            __runInitializers(this, _person_extraInitializers);
                        }
                    };
                    __setFunctionName(_classThis, "MyEl");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        _person_decorators = [bindable({ nullable: false, type })];
                        __esDecorate(null, null, _person_decorators, { kind: "field", name: "person", static: false, private: false, access: { has: obj => "person" in obj, get: obj => obj.person, set: (obj, value) => { obj.person = value; } }, metadata: _metadata }, _person_initializers, _person_extraInitializers);
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        MyEl = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return MyEl = _classThis;
                })();
                class App {
                }
                $it(`not-nullable - class with coercer decorator - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.deepStrictEqual(myEl.person, new Person2(null, null));
                    app.prop = null;
                    assert.deepStrictEqual(myEl.person, new Person2(null, null));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el component.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
        }
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _person_decorators;
                let _person_initializers = [];
                let _person_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.person = __runInitializers(this, _person_initializers, void 0);
                        __runInitializers(this, _person_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _person_decorators = [bindable({ type: Person2 })];
                    __esDecorate(null, null, _person_decorators, { kind: "field", name: "person", static: false, private: false, access: { has: obj => "person" in obj, get: obj => obj.person, set: (obj, value) => { obj.person = value; } }, metadata: _metadata }, _person_initializers, _person_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
                constructor() {
                    this.prop = { name: 'john', age: 42 };
                }
            }
            $it(`change propagation - class`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.deepStrictEqual(myEl.person, new Person2('john', 42), 'error1');
                assert.strictEqual(Person2.coerced, 1, 'error2');
                app.prop.age = 84;
                assert.deepStrictEqual(myEl.person, new Person2('john', 42), 'error3');
                assert.strictEqual(Person2.coerced, 1, 'error4');
                const person = app.prop = new Person2('john', 84);
                assert.strictEqual(myEl.person, person, 'error5');
                assert.strictEqual(Person2.coerced, 1, 'error6');
                person.age = 42;
                assert.strictEqual(myEl.person.age, 42, 'error7');
                assert.strictEqual(Person2.coerced, 1, 'error8');
            }, { app: App, template: `<my-el component.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = (() => {
                let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _person_decorators;
                let _person_initializers = [];
                let _person_extraInitializers = [];
                var MyEl = _classThis = class {
                    constructor() {
                        this.person = __runInitializers(this, _person_initializers, void 0);
                        __runInitializers(this, _person_extraInitializers);
                    }
                };
                __setFunctionName(_classThis, "MyEl");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _person_decorators = [bindable({ type: Person2 })];
                    __esDecorate(null, null, _person_decorators, { kind: "field", name: "person", static: false, private: false, access: { has: obj => "person" in obj, get: obj => obj.person, set: (obj, value) => { obj.person = value; } }, metadata: _metadata }, _person_initializers, _person_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    MyEl = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return MyEl = _classThis;
            })();
            class App {
                constructor() {
                    this.prop = { name: 'john', age: 42 };
                }
            }
            $it(`change propagation - class - two-way`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.deepStrictEqual(myEl.person, new Person2('john', 42), 'error1');
                assert.strictEqual(Person2.coerced, 1, 'error2');
                assert.notInstanceOf(app.prop, Person2);
                const person = myEl.person = new Person2('foo', 42);
                assert.strictEqual(app.prop, person);
            }, { app: App, template: `<my-el component.ref="myEl" person.two-way="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    /* eslint-enable no-useless-escape */
    {
        let MyEl = (() => {
            let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _prop_decorators;
            let _prop_initializers = [];
            let _prop_extraInitializers = [];
            var MyEl = _classThis = class {
                constructor() {
                    this.prop = __runInitializers(this, _prop_initializers, void 0);
                    __runInitializers(this, _prop_extraInitializers);
                }
            };
            __setFunctionName(_classThis, "MyEl");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _prop_decorators = [bindable];
                __esDecorate(null, null, _prop_decorators, { kind: "field", name: "prop", static: false, private: false, access: { has: obj => "prop" in obj, get: obj => obj.prop, set: (obj, value) => { obj.prop = value; } }, metadata: _metadata }, _prop_initializers, _prop_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MyEl = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return MyEl = _classThis;
        })();
        class App {
        }
        $it('auto-coercing does not work for type union', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: `<my-el component.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = (() => {
            let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _prop_decorators;
            let _prop_initializers = [];
            let _prop_extraInitializers = [];
            var MyEl = _classThis = class {
                constructor() {
                    this.prop = __runInitializers(this, _prop_initializers, void 0);
                    __runInitializers(this, _prop_extraInitializers);
                }
            };
            __setFunctionName(_classThis, "MyEl");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _prop_decorators = [bindable({ type: Number })];
                __esDecorate(null, null, _prop_decorators, { kind: "field", name: "prop", static: false, private: false, access: { has: obj => "prop" in obj, get: obj => obj.prop, set: (obj, value) => { obj.prop = value; } }, metadata: _metadata }, _prop_initializers, _prop_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MyEl = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return MyEl = _classThis;
        })();
        class App {
        }
        $it('auto-coercing can be coerced with explicit type for type union', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, 1);
        }, { app: App, template: `<my-el component.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = (() => {
            let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _prop_decorators;
            let _prop_initializers = [];
            let _prop_extraInitializers = [];
            var MyEl = _classThis = class {
                constructor() {
                    this.prop = __runInitializers(this, _prop_initializers, void 0);
                    __runInitializers(this, _prop_extraInitializers);
                }
            };
            __setFunctionName(_classThis, "MyEl");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _prop_decorators = [bindable({ type: Object })];
                __esDecorate(null, null, _prop_decorators, { kind: "field", name: "prop", static: false, private: false, access: { has: obj => "prop" in obj, get: obj => obj.prop, set: (obj, value) => { obj.prop = value; } }, metadata: _metadata }, _prop_initializers, _prop_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MyEl = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return MyEl = _classThis;
        })();
        class App {
        }
        $it('auto-coercing can be disabled with explicit Object type', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: `<my-el component.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = (() => {
            let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _prop_decorators;
            let _prop_initializers = [];
            let _prop_extraInitializers = [];
            var MyEl = _classThis = class {
                constructor() {
                    this.prop = __runInitializers(this, _prop_initializers, void 0);
                    __runInitializers(this, _prop_extraInitializers);
                }
            };
            __setFunctionName(_classThis, "MyEl");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _prop_decorators = [bindable({ set: noop })];
                __esDecorate(null, null, _prop_decorators, { kind: "field", name: "prop", static: false, private: false, access: { has: obj => "prop" in obj, get: obj => obj.prop, set: (obj, value) => { obj.prop = value; } }, metadata: _metadata }, _prop_initializers, _prop_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MyEl = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return MyEl = _classThis;
        })();
        class App {
        }
        $it('auto-coercing can be disabled with explicit noop set interceptor function', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: `<my-el component.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = (() => {
            let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _prop_decorators;
            let _prop_initializers = [];
            let _prop_extraInitializers = [];
            var MyEl = _classThis = class {
                constructor() {
                    this.prop = __runInitializers(this, _prop_initializers, void 0);
                    __runInitializers(this, _prop_extraInitializers);
                }
            };
            __setFunctionName(_classThis, "MyEl");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _prop_decorators = [bindable({ type: Number })];
                __esDecorate(null, null, _prop_decorators, { kind: "field", name: "prop", static: false, private: false, access: { has: obj => "prop" in obj, get: obj => obj.prop, set: (obj, value) => { obj.prop = value; } }, metadata: _metadata }, _prop_initializers, _prop_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MyEl = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return MyEl = _classThis;
        })();
        class App {
        }
        $it('auto-coercion can be disabled globally', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: '<my-el component.ref="myEl" prop.bind="true"></my-el>', registrations: [MyEl], enableCoercion: false });
    }
    {
        let MyEl = (() => {
            let _classDecorators = [customElement({ name: 'my-el', template: 'irrelevant' })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _prop_decorators;
            let _prop_initializers = [];
            let _prop_extraInitializers = [];
            var MyEl = _classThis = class {
                constructor() {
                    this.prop = __runInitializers(this, _prop_initializers, void 0);
                    __runInitializers(this, _prop_extraInitializers);
                }
            };
            __setFunctionName(_classThis, "MyEl");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _prop_decorators = [bindable({ type: Number })];
                __esDecorate(null, null, _prop_decorators, { kind: "field", name: "prop", static: false, private: false, access: { has: obj => "prop" in obj, get: obj => obj.prop, set: (obj, value) => { obj.prop = value; } }, metadata: _metadata }, _prop_initializers, _prop_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MyEl = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return MyEl = _classThis;
        })();
        class App {
        }
        $it('auto-coercion of null-like values can be enforced globally', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, 0);
        }, { app: App, template: '<my-el component.ref="myEl" prop.bind="null"></my-el>', registrations: [MyEl], coerceNullish: true });
    }
    {
        let MyAttr = (() => {
            let _classDecorators = [customAttribute({ name: 'my-attr' })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            let _value_decorators;
            let _value_initializers = [];
            let _value_extraInitializers = [];
            var MyAttr = _classThis = class {
                constructor() {
                    this.value = __runInitializers(this, _value_initializers, void 0);
                    __runInitializers(this, _value_extraInitializers);
                }
            };
            __setFunctionName(_classThis, "MyAttr");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _value_decorators = [bindable({ type: Number })];
                __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MyAttr = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return MyAttr = _classThis;
        })();
        class App {
        }
        $it('auto-coercion works for custom element', async function (ctx) {
            const myAttr = CustomAttribute.for(ctx.host.querySelector('div'), 'my-attr').viewModel;
            assert.strictEqual(myAttr.value, 42);
        }, { app: App, template: `<div my-attr="42"></div>`, registrations: [MyAttr] });
    }
});
//# sourceMappingURL=bindable-coercer.spec.js.map