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
import { CustomElement, lifecycleHooks, LifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.resolve.spec.ts', function () {
    it('retrieves global hooks at root', async function () {
        class Hooks {
            attaching() { }
        }
        const { au, startPromise, tearDown } = createFixture(`\${message}`, class App {
        }, [LifecycleHooks.define({}, Hooks)]);
        await startPromise;
        const hooks = au.root.controller.lifecycleHooks;
        assert.strictEqual(hooks.attaching.length, 1);
        await tearDown();
    });
    it('retrieves global hooks at child', async function () {
        class Hooks {
            attaching() { }
        }
        const { au, component, startPromise, tearDown } = createFixture(`<el component.ref="el">`, class App {
        }, [
            CustomElement.define({
                name: 'el',
                dependencies: []
            }),
            LifecycleHooks.define({}, Hooks)
        ]);
        await startPromise;
        const hooks = au.root.controller.lifecycleHooks;
        assert.strictEqual(hooks.attaching.length, 1);
        const childHooks = component.el.$controller.lifecycleHooks;
        assert.strictEqual(childHooks.attaching.length, 1);
        await tearDown();
    });
    it('retrieves local hooks at child', async function () {
        class Hooks {
            attaching() { }
        }
        const { au, component, startPromise, tearDown } = createFixture(`<el component.ref="el">`, class App {
        }, [
            CustomElement.define({
                name: 'el',
                dependencies: [
                    LifecycleHooks.define({}, Hooks)
                ]
            }),
        ]);
        await startPromise;
        const hooks = au.root.controller.lifecycleHooks;
        assert.notStrictEqual(hooks.attaching?.length, 0);
        const childHooks = component.el.$controller.lifecycleHooks;
        assert.strictEqual(childHooks.attaching.length, 1);
        await tearDown();
    });
    describe('<App/> -> <Child/> -> <Grand Child/>', function () {
        it('does not retrieve hooks in the middle layer', async function () {
            class Hooks {
                attaching() {
                    // empty
                }
            }
            class Hooks2 {
                attaching() {
                    // empty
                }
            }
            class DifferentHooks {
                attaching() {
                    // empty
                }
            }
            class DifferentHooks2 {
                attaching() {
                    // empty
                }
            }
            const { au, component } = await createFixture(`<el component.ref="el">`, class App {
            }, [
                CustomElement.define({
                    name: 'el',
                    template: '<el-child component.ref="elChild">',
                    dependencies: [
                        LifecycleHooks.define({}, Hooks),
                        LifecycleHooks.define({}, Hooks2),
                        CustomElement.define({
                            name: 'el-child',
                            dependencies: [
                                LifecycleHooks.define({}, DifferentHooks),
                                LifecycleHooks.define({}, DifferentHooks2)
                            ]
                        })
                    ]
                }),
            ]).started;
            const hooks = au.root.controller.lifecycleHooks;
            assert.notStrictEqual(hooks.attaching?.length, 0);
            const childHooks = component.el.$controller.lifecycleHooks;
            assert.strictEqual(childHooks.attaching.length, 2);
            const grandChildHooks = component.el.elChild.$controller.lifecycleHooks;
            assert.strictEqual(grandChildHooks.attaching.length, 2);
            assert.strictEqual(childHooks.attaching.every(x => x.instance instanceof Hooks || x.instance instanceof Hooks2), true);
            assert.strictEqual(grandChildHooks.attaching.every(x => x.instance instanceof DifferentHooks || x.instance instanceof DifferentHooks2), true);
        });
        it('retrieves the same hooks Type twice as declaration', async function () {
            let Hooks = (() => {
                let _classDecorators = [lifecycleHooks()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Hooks = _classThis = class {
                    attaching() {
                        // empty
                    }
                };
                __setFunctionName(_classThis, "Hooks");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Hooks = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Hooks = _classThis;
            })();
            let Hooks2 = (() => {
                let _classDecorators = [lifecycleHooks()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Hooks2 = _classThis = class {
                    attaching() {
                        // empty
                    }
                };
                __setFunctionName(_classThis, "Hooks2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Hooks2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Hooks2 = _classThis;
            })();
            let DifferentHooks = (() => {
                let _classDecorators = [lifecycleHooks()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DifferentHooks = _classThis = class {
                    attaching() {
                        // empty
                    }
                };
                __setFunctionName(_classThis, "DifferentHooks");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DifferentHooks = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DifferentHooks = _classThis;
            })();
            let DifferentHooks2 = (() => {
                let _classDecorators = [lifecycleHooks()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DifferentHooks2 = _classThis = class {
                    attaching() {
                        // empty
                    }
                };
                __setFunctionName(_classThis, "DifferentHooks2");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DifferentHooks2 = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DifferentHooks2 = _classThis;
            })();
            const { au, component } = await createFixture(`<el component.ref="el">`, class App {
            }, [
                CustomElement.define({
                    name: 'el',
                    template: '<el-child component.ref="elChild">',
                    dependencies: [
                        Hooks,
                        Hooks2,
                        Hooks,
                        Hooks2,
                        CustomElement.define({
                            name: 'el-child',
                            dependencies: [
                                DifferentHooks,
                                DifferentHooks2,
                                DifferentHooks,
                                DifferentHooks2,
                            ]
                        })
                    ]
                }),
            ]).started;
            const hooks = au.root.controller.lifecycleHooks;
            assert.notStrictEqual(hooks.attaching?.length, 0);
            const childHooks = component.el.$controller.lifecycleHooks;
            assert.strictEqual(childHooks.attaching.length, 4);
            const grandChildHooks = component.el.elChild.$controller.lifecycleHooks;
            assert.strictEqual(grandChildHooks.attaching.length, 4);
            assert.strictEqual(childHooks.attaching.every(x => x.instance instanceof Hooks || x.instance instanceof Hooks2), true);
            assert.strictEqual(grandChildHooks.attaching.every(x => x.instance instanceof DifferentHooks || x.instance instanceof DifferentHooks2), true);
        });
    });
});
//# sourceMappingURL=lifecycle-hooks.resolve.spec.js.map