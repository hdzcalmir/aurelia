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
import { Registration } from '@aurelia/kernel';
import { CustomElement, CustomElementDefinition, ITemplateCompilerHooks, templateCompilerHooks, TemplateCompilerHooks, } from '@aurelia/runtime-html';
import { assert, createFixture, TestContext } from '@aurelia/testing';
describe('3-runtime-html/template-compiler.hooks.spec.ts', function () {
    it('compiles with child hooks', async function () {
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: [TemplateCompilerHooks.define(class {
                        compiling(template) {
                            template.content.querySelector('input').setAttribute('value.bind', 'value');
                        }
                    })]
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            })
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').value, 'hello');
        await tearDown();
    });
    it('compiles with root hooks', async function () {
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: []
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            }),
            TemplateCompilerHooks.define(class {
                compiling(template) {
                    template.content.querySelector('input')?.setAttribute('value.bind', 'value');
                }
            })
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').value, 'hello');
        await tearDown();
    });
    it('does not compiles with hooks from parent', async function () {
        const { appHost, startPromise, tearDown } = createFixture(`<parent>`, class App {
        }, [
            CustomElement.define({
                name: 'parent',
                template: '<child>',
                dependencies: [
                    TemplateCompilerHooks.define(class {
                        compiling(template) {
                            template.content.querySelector('input')?.setAttribute('value.bind', 'value');
                        }
                    }),
                    CustomElement.define({
                        name: 'child',
                        template: '<input>',
                        dependencies: [
                            TemplateCompilerHooks.define(class {
                                compiling(template) {
                                    assert.strictEqual(template.content.querySelector('input').getAttribute('value.bind'), null);
                                    template.content.querySelector('input')?.setAttribute('value.bind', 'value2');
                                }
                            }),
                        ]
                    }, class Child {
                        constructor() {
                            this.value = 'hello';
                            this.value2 = 'hello 2';
                        }
                    })
                ]
            }, class Parent {
            }),
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').value, 'hello 2');
        await tearDown();
    });
    it('gets all hooks registered in child', async function () {
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: [
                    TemplateCompilerHooks.define(class {
                        compiling(template) {
                            template.content.querySelector('input').setAttribute('value.bind', 'value');
                        }
                    }),
                    TemplateCompilerHooks.define(class {
                        compiling(template) {
                            template.content.querySelector('input').setAttribute('id.bind', 'value');
                        }
                    }),
                ]
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            })
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').value, 'hello');
        assert.strictEqual(appHost.querySelector('input').id, 'hello');
        await tearDown();
    });
    it('gets all hooks registered in root', async function () {
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: []
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            }),
            TemplateCompilerHooks.define(class {
                compiling(template) {
                    template.content.querySelector('input')?.setAttribute('value.bind', 'value');
                }
            }),
            TemplateCompilerHooks.define(class {
                compiling(template) {
                    template.content.querySelector('input')?.setAttribute('id.bind', 'value');
                }
            }),
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').value, 'hello');
        assert.strictEqual(appHost.querySelector('input').id, 'hello');
        await tearDown();
    });
    it('gets all hooks registered in root and child', async function () {
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: [
                    TemplateCompilerHooks.define(class {
                        compiling(template) {
                            template.content.querySelector('input')?.setAttribute('data-id-1.bind', 'value');
                        }
                    }),
                    TemplateCompilerHooks.define(class {
                        compiling(template) {
                            template.content.querySelector('input')?.setAttribute('data-id-2.bind', 'value');
                        }
                    }),
                ]
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            }),
            TemplateCompilerHooks.define(class {
                compiling(template) {
                    template.content.querySelector('input')?.setAttribute('data-id-3.bind', 'value');
                }
            }),
            TemplateCompilerHooks.define(class {
                compiling(template) {
                    template.content.querySelector('input')?.setAttribute('data-id-4.bind', 'value');
                }
            }),
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').getAttribute('data-id-1'), 'hello');
        assert.strictEqual(appHost.querySelector('input').getAttribute('data-id-2'), 'hello');
        assert.strictEqual(appHost.querySelector('input').getAttribute('data-id-3'), 'hello');
        assert.strictEqual(appHost.querySelector('input').getAttribute('data-id-4'), 'hello');
        await tearDown();
    });
    it('calls hooks in child before root', async function () {
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: [
                    TemplateCompilerHooks.define(class {
                        compiling(template) {
                            template.content.querySelector('input')?.setAttribute('data-id-2.bind', 'value');
                        }
                    }),
                ]
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            }),
            TemplateCompilerHooks.define(class {
                compiling(template) {
                    const input = template.content.querySelector('input');
                    input?.setAttribute('data-id-1.bind', 'value');
                    if (input) {
                        assert.strictEqual(input.getAttribute('data-id-2.bind'), 'value');
                    }
                }
            }),
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').getAttribute('data-id-1'), 'hello');
        assert.strictEqual(appHost.querySelector('input').getAttribute('data-id-2'), 'hello');
        await tearDown();
    });
    it('works with decorator @templateCompilerHooks (no paren)', async function () {
        let Hooks = (() => {
            let _classDecorators = [templateCompilerHooks];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var Hooks = _classThis = class {
                compiling(template) {
                    template.content.querySelector('input').setAttribute('value.bind', 'value');
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
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: [Hooks]
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            })
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').value, 'hello');
        await tearDown();
    });
    it('works with decorator @templateCompilerHooks() (with paren)', async function () {
        let Hooks = (() => {
            let _classDecorators = [templateCompilerHooks()];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var Hooks = _classThis = class {
                compiling(template) {
                    template.content.querySelector('input').setAttribute('value.bind', 'value');
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
        const { appHost, startPromise, tearDown } = createFixture(`<my-el>`, class App {
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<input >',
                dependencies: [Hooks]
            }, class MyEll {
                constructor() {
                    this.value = 'hello';
                }
            })
        ]);
        await startPromise;
        assert.strictEqual(appHost.querySelector('input').value, 'hello');
        await tearDown();
    });
    describe('[UNIT]', function () {
        function createFixture() {
            const ctx = TestContext.create();
            const container = ctx.container;
            const sut = ctx.templateCompiler;
            return { ctx, container, sut };
        }
        it('invokes before compile hooks', function () {
            const template = `<template></template>`;
            const { container, sut } = createFixture();
            let hookCallCount = 0;
            container.register(Registration.instance(ITemplateCompilerHooks, {
                compiling(template) {
                    hookCallCount++;
                    template.setAttribute('data-hello', 'world');
                }
            }));
            const definition = sut.compile(CustomElementDefinition.create({ name: 'lorem-ipsum', template }), container, null);
            assert.strictEqual(hookCallCount, 1);
            assert.strictEqual(definition.template.getAttribute('data-hello'), 'world');
        });
        it('invokes all hooks', function () {
            const template = `<template></template>`;
            const { container, sut } = createFixture();
            let hookCallCount = 0;
            container.register(Registration.instance(ITemplateCompilerHooks, {
                compiling(template) {
                    hookCallCount++;
                    template.setAttribute('data-hello', 'world');
                }
            }));
            container.register(Registration.instance(ITemplateCompilerHooks, {
                compiling(template) {
                    hookCallCount++;
                    template.setAttribute('data-world', 'hello');
                }
            }));
            const definition = sut.compile(CustomElementDefinition.create({ name: 'lorem-ipsum', template }), container, null);
            assert.strictEqual(hookCallCount, 2);
            assert.strictEqual(definition.template.getAttribute('data-hello'), 'world');
            assert.strictEqual(definition.template.getAttribute('data-world'), 'hello');
        });
        it('does not throw if the compile hooks does not have any hooks', function () {
            const template = `<template></template>`;
            const { container, sut } = createFixture();
            container.register(Registration.instance(ITemplateCompilerHooks, {}));
            assert.doesNotThrow(() => sut.compile(CustomElementDefinition.create({ name: 'lorem-ipsum', template }), container, null));
        });
        it('invokes hooks with resources semantic - only leaf', function () {
            const template = `<template></template>`;
            const { container, sut } = createFixture();
            let hookCallCount = 0;
            const createResolver = () => Registration.instance(ITemplateCompilerHooks, {
                compiling(template) {
                    hookCallCount++;
                    template.setAttribute('data-hello', 'world');
                }
            });
            const middleContainer = container.createChild();
            const leafContainer = middleContainer.createChild();
            middleContainer.register(createResolver());
            leafContainer.register(createResolver());
            const definition = sut.compile(CustomElementDefinition.create({ name: 'lorem-ipsum', template }), leafContainer, null);
            assert.strictEqual(hookCallCount, 1);
            assert.strictEqual(definition.template.getAttribute('data-hello'), 'world');
        });
        it('invokes hooks with resources semantic - leaf + root', function () {
            const template = `<template></template>`;
            const { container, sut } = createFixture();
            let hookCallCount = 0;
            const createResolver = (value) => Registration.instance(ITemplateCompilerHooks, {
                compiling(template) {
                    hookCallCount++;
                    template.setAttribute(`data-${value}`, value);
                }
            });
            const middleContainer = container.createChild();
            const leafContainer = middleContainer.createChild();
            container.register(createResolver('root'));
            middleContainer.register(createResolver('middle'));
            leafContainer.register(createResolver('leaf'));
            const definition = sut.compile(CustomElementDefinition.create({ name: 'lorem-ipsum', template }), leafContainer, null);
            assert.strictEqual(hookCallCount, 2);
            assert.strictEqual(definition.template.getAttribute('data-root'), 'root');
            assert.strictEqual(definition.template.getAttribute('data-middle'), null);
            assert.strictEqual(definition.template.getAttribute('data-leaf'), 'leaf');
        });
    });
});
//# sourceMappingURL=template-compiler.hooks.spec.js.map