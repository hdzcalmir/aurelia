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
import { Aurelia, containerless, customElement, IPlatform } from '@aurelia/runtime-html';
import { assert, TestContext } from '@aurelia/testing';
import { createSpecFunction } from '../util.js';
describe('3-runtime-html/containerless.spec.ts', function () {
    async function runTest(testFunction, { appType, registrations = [] }) {
        const ctx = TestContext.create();
        const container = ctx.container;
        const host = ctx.doc.createElement('app');
        ctx.doc.body.appendChild(host);
        const au = new Aurelia(container);
        await au
            .register(registrations)
            .app({ host, component: appType })
            .start();
        const app = au.root.controller.viewModel;
        await testFunction({ app, host, container, platform: container.get(IPlatform), ctx });
        await au.stop();
        ctx.doc.body.removeChild(host);
        au.dispose();
    }
    const $it = createSpecFunction(runTest);
    {
        let CeFoo = (() => {
            let _classDecorators = [containerless(), customElement({
                    name: 'ce-foo',
                    template: 'ce-foo content'
                })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var CeFoo = _classThis = class {
            };
            __setFunctionName(_classThis, "CeFoo");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                CeFoo = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return CeFoo = _classThis;
        })();
        let App = (() => {
            let _classDecorators = [customElement({
                    name: 'app',
                    template: '<ce-foo></ce-foo>',
                })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var App = _classThis = class {
                constructor() {
                    this.message = 'Hello World!';
                }
            };
            __setFunctionName(_classThis, "App");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                App = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return App = _classThis;
        })();
        $it('execution order: customElement -> containerless', function ({ host }) {
            assert.html.textContent(host, 'ce-foo content');
            assert.strictEqual(host.querySelector('ce-foo'), null);
        }, { appType: App, registrations: [CeFoo] });
    }
    {
        let CeFoo = (() => {
            let _classDecorators = [customElement({
                    name: 'ce-foo',
                    template: 'ce-foo content'
                }), containerless()];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var CeFoo = _classThis = class {
            };
            __setFunctionName(_classThis, "CeFoo");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                CeFoo = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return CeFoo = _classThis;
        })();
        let App = (() => {
            let _classDecorators = [customElement({
                    name: 'app',
                    template: '<ce-foo></ce-foo>',
                })];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var App = _classThis = class {
                constructor() {
                    this.message = 'Hello World!';
                }
            };
            __setFunctionName(_classThis, "App");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                App = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return App = _classThis;
        })();
        $it('execution order: containerless -> customElement', function ({ host }) {
            assert.html.textContent(host, 'ce-foo content');
            assert.strictEqual(host.querySelector('ce-foo'), null);
        }, { appType: App, registrations: [CeFoo] });
    }
});
//# sourceMappingURL=containerless.spec.js.map