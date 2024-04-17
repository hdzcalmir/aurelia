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
import { Aurelia, customElement, IPlatform, Controller, CustomElement, } from '@aurelia/runtime-html';
import { assert, TestContext } from '@aurelia/testing';
describe('3-runtime-html/controller.host-sharing.integration.spec.ts', function () {
    function createFixture() {
        const ctx = TestContext.create();
        const { container } = ctx;
        const p = container.get(IPlatform);
        const host = ctx.createElement('div');
        const au = new Aurelia(container);
        return { p, au, host };
    }
    const specs = [
        {
            // nothing (control test)
            toString() { return `nothing`; },
        },
        {
            shadowOptions: { mode: 'open' },
            toString() { return `shadowOptions: { mode: 'open' }`; },
        },
        {
            shadowOptions: { mode: 'closed' },
            toString() { return `shadowOptions: { mode: 'closed' }`; },
        },
        {
            containerless: true,
            toString() { return `containerless: true`; },
        },
    ];
    for (const parentSpec of specs) {
        describe(`parentSpec: ${parentSpec}`, function () {
            for (const childSpec of specs) {
                describe(`childSpec: ${childSpec}`, function () {
                    it(`can activate/deactivate twice with the same outcomes`, async function () {
                        const { au, host } = createFixture();
                        let TheChild = (() => {
                            let _classDecorators = [customElement({ ...childSpec, name: 'the-child', template: `child` })];
                            let _classDescriptor;
                            let _classExtraInitializers = [];
                            let _classThis;
                            var TheChild = _classThis = class {
                            };
                            __setFunctionName(_classThis, "TheChild");
                            (() => {
                                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                TheChild = _classThis = _classDescriptor.value;
                                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                __runInitializers(_classThis, _classExtraInitializers);
                            })();
                            return TheChild = _classThis;
                        })();
                        let TheParent = (() => {
                            let _classDecorators = [customElement({ ...parentSpec, name: 'the-parent', template: `parent`, dependencies: [TheChild] })];
                            let _classDescriptor;
                            let _classExtraInitializers = [];
                            let _classThis;
                            var TheParent = _classThis = class {
                                created(controller) {
                                    const container = controller.container;
                                    this.childController = Controller.$el(container, container.get(CustomElement.keyFrom('the-child')), controller.host, null);
                                }
                                attaching(initiator) {
                                    // No async hooks so all of these are synchronous.
                                    void this.childController.activate(initiator, this.$controller);
                                }
                                detaching(initiator) {
                                    void this.childController.deactivate(initiator, this.$controller);
                                }
                                activateChild() {
                                    void this.childController.activate(this.childController, this.$controller);
                                }
                                deactivateChild() {
                                    void this.childController.deactivate(this.childController, this.$controller);
                                }
                            };
                            __setFunctionName(_classThis, "TheParent");
                            (() => {
                                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                TheParent = _classThis = _classDescriptor.value;
                                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                __runInitializers(_classThis, _classExtraInitializers);
                            })();
                            return TheParent = _classThis;
                        })();
                        let TheApp = (() => {
                            let _classDecorators = [customElement({ name: 'the-app', template: `<the-parent></the-parent>`, dependencies: [TheParent] })];
                            let _classDescriptor;
                            let _classExtraInitializers = [];
                            let _classThis;
                            var TheApp = _classThis = class {
                            };
                            __setFunctionName(_classThis, "TheApp");
                            (() => {
                                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                TheApp = _classThis = _classDescriptor.value;
                                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                __runInitializers(_classThis, _classExtraInitializers);
                            })();
                            return TheApp = _classThis;
                        })();
                        au.app({ host, component: TheApp });
                        const theApp = au.root.controller.children[0].viewModel;
                        await au.start();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after start() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #1`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #2`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #2`);
                        await au.stop();
                        assert.visibleTextEqual(host, ``, `visible text after stop() #1`);
                        await au.start();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after start() #2`);
                        assert.visibleTextEqual(host, `parentchild`, `visible text after start() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #1`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #2`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #2`);
                        await au.stop(true);
                    });
                });
            }
        });
    }
});
//# sourceMappingURL=controller.host-sharing.integration.spec.js.map