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
import { DI, newInstanceForScope, resolve } from '@aurelia/kernel';
import { Aurelia, BindingBehavior, CustomElement, ValueConverter, bindable, customElement } from '@aurelia/runtime-html';
import { TestContext, assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/di-resolutions.spec.ts', function () {
    describe('@newInstanceForScope', function () {
        it('resolves different instances for each scoped registration', function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            let ListItem = (() => {
                let _classDecorators = [customElement({ name: 'list-item', template: `\${model.id}` })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var ListItem = _classThis = class {
                    constructor() {
                        this.model = resolve(Model);
                    }
                };
                __setFunctionName(_classThis, "ListItem");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    ListItem = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return ListItem = _classThis;
            })();
            let List = (() => {
                let _classDecorators = [customElement({ name: 'list', template: '<list-item>', dependencies: [ListItem] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var List = _classThis = class {
                    constructor() {
                        this.context = resolve(newInstanceForScope(Model));
                    }
                };
                __setFunctionName(_classThis, "List");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    List = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return List = _classThis;
            })();
            // act
            const { component } = createFixture(`<list component.ref="list1"></list><list component.ref="list2"></list>`, class App {
            }, [List]);
            const listEl1 = component.list1.$controller.host;
            const listEl2 = component.list2.$controller.host;
            assert.strictEqual(id, 2);
            assert.visibleTextEqual(listEl1, '1');
            assert.visibleTextEqual(listEl2, '2');
        });
        it('resolves dependency with: Interface + @newInstanceForScope + default resolver + no registration', function () {
            // arrange
            let contextCallCount = 0;
            const IListboxContext = DI.createInterface('IListboxContext', x => x.singleton(class ListboxContext {
                constructor() {
                    this.open = false;
                    contextCallCount++;
                }
            }));
            let ListboxItem = (() => {
                let _classDecorators = [customElement({
                        name: 'listbox-item',
                        template: `listbox item \${i}`,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                let _value_decorators;
                let _value_initializers = [];
                let _value_extraInitializers = [];
                var ListboxItem = _classThis = class {
                    constructor() {
                        this.value = __runInitializers(this, _value_initializers, void 0);
                        this.context = (__runInitializers(this, _value_extraInitializers), resolve(IListboxContext));
                    }
                };
                __setFunctionName(_classThis, "ListboxItem");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _value_decorators = [bindable];
                    __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    ListboxItem = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return ListboxItem = _classThis;
            })();
            let Listbox = (() => {
                let _classDecorators = [customElement({
                        name: 'list-box',
                        template: '<listbox-item repeat.for="i of 5" value.bind="i">',
                        dependencies: [IListboxContext, ListboxItem]
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Listbox = _classThis = class {
                    constructor() {
                        this.context = resolve(newInstanceForScope(IListboxContext));
                    }
                };
                __setFunctionName(_classThis, "Listbox");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Listbox = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Listbox = _classThis;
            })();
            // act
            const { component } = createFixture(`<list-box component.ref="listbox">`, class App {
            }, [Listbox]);
            // assert
            assert.strictEqual(component.listbox.context.open, false);
            assert.strictEqual(contextCallCount, 1);
        });
    });
    describe('definition.injectable', function () {
        it('resolves injectable', function () {
            const InjectableParent = DI.createInterface('injectable');
            let Child = (() => {
                let _classDecorators = [customElement({
                        name: 'child',
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Child = _classThis = class {
                    static get inject() { return [InjectableParent, Parent]; }
                    constructor(parent1, parent2) {
                        this.parent1 = parent1;
                        this.parent2 = parent2;
                    }
                };
                __setFunctionName(_classThis, "Child");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Child = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Child = _classThis;
            })();
            let Parent = (() => {
                let _classDecorators = [customElement({ name: 'parent', template: '<child>', injectable: InjectableParent, dependencies: [Child] })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Parent = _classThis = class {
                };
                __setFunctionName(_classThis, "Parent");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Parent = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Parent = _classThis;
            })();
            const { appHost } = createFixture('<parent>', CustomElement.define({
                name: 'app',
            }, class App {
            }), [Parent]);
            const child = CustomElement.for(appHost.querySelector('child')).viewModel;
            const parent = CustomElement.for(appHost.querySelector('parent')).viewModel;
            assert.strictEqual(parent, child.parent1);
            assert.strictEqual(parent, child.parent2);
        });
    });
    describe('CustomElement.createInjectable', function () {
        it('properly links parent-child', async function () {
            const IRoot = CustomElement.createInjectable();
            const IParent = CustomElement.createInjectable();
            const IChild = CustomElement.createInjectable();
            let Root = (() => {
                let _classDecorators = [customElement({
                        name: 'root',
                        template: `<parent></parent><parent></parent>`,
                        injectable: IRoot,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Root = _classThis = class {
                };
                __setFunctionName(_classThis, "Root");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Root = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Root = _classThis;
            })();
            let parentId = 0;
            let Parent = (() => {
                let _classDecorators = [customElement({
                        name: 'parent',
                        template: ` P(\${id}<child></child><child></child>)<parent if.bind="parent === null"></parent>`,
                        injectable: IParent,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Parent = _classThis = class {
                    constructor(root = resolve(IRoot), parent = resolve(IParent)) {
                        this.root = root;
                        this.parent = parent;
                        this.id = ++parentId;
                        assert.instanceOf(root, Root);
                        if (parent !== null) {
                            assert.instanceOf(parent, Parent);
                        }
                    }
                };
                __setFunctionName(_classThis, "Parent");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Parent = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Parent = _classThis;
            })();
            let childId = 0;
            let Child = (() => {
                let _classDecorators = [customElement({
                        name: 'child',
                        template: ` C(\${id})<child if.bind="child === null"></child>`,
                        injectable: IChild,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var Child = _classThis = class {
                    constructor(root = resolve(IRoot), parent = resolve(IParent), child = resolve(IChild)) {
                        this.root = root;
                        this.parent = parent;
                        this.child = child;
                        this.id = ++childId;
                        assert.instanceOf(root, Root);
                        assert.instanceOf(parent, Parent);
                        if (child !== null) {
                            assert.instanceOf(child, Child);
                        }
                        switch (this.id) {
                            case 1:
                            case 5:
                            case 2:
                            case 6:
                                assert.strictEqual(parent.id, 1, `expected parent.id to be 1 at child.id ${this.id}, but got: ${parent.id}`);
                                break;
                            case 7:
                            case 9:
                            case 8:
                            case 10:
                                assert.strictEqual(parent.id, 3, `expected parent.id to be 3 at child.id ${this.id}, but got: ${parent.id}`);
                                break;
                            case 3:
                            case 11:
                            case 4:
                            case 12:
                                assert.strictEqual(parent.id, 2, `expected parent.id to be 2 at child.id ${this.id}, but got: ${parent.id}`);
                                break;
                            case 13:
                            case 15:
                            case 14:
                            case 16:
                                assert.strictEqual(parent.id, 4, `expected parent.id to be 4 at child.id ${this.id}, but got: ${parent.id}`);
                                break;
                        }
                    }
                };
                __setFunctionName(_classThis, "Child");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    Child = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return Child = _classThis;
            })();
            const ctx = TestContext.create();
            const host = ctx.createElement('div');
            const component = new Root();
            const au = new Aurelia(ctx.container).register(Parent, Child).app({ host, component });
            await au.start();
            assert.visibleTextEqual(host, ' P(1 C(1) C(5) C(2) C(6)) P(3 C(7) C(9) C(8) C(10)) P(2 C(3) C(11) C(4) C(12)) P(4 C(13) C(15) C(14) C(16))');
            await au.stop();
            au.dispose();
        });
    });
    describe('singleton resources', function () {
        it('resolves to a single value converter instance', function () {
            let id = 0;
            const Pipe = ValueConverter.define('pipe', class {
                constructor() {
                    this.i = ++id;
                }
            });
            createFixture('${message | pipe}', class {
                constructor() {
                    this.pipe = resolve(Pipe);
                }
            }, [Pipe]);
            assert.strictEqual(id, 1);
        });
        it('resolves to a single binding behavior instance', function () {
            let id = 0;
            const BB = BindingBehavior.define('bb', class {
                constructor() {
                    this.i = ++id;
                }
            });
            createFixture('${message & bb}', class {
                constructor() {
                    this.pipe = resolve(BB);
                }
            }, [BB]);
            assert.strictEqual(id, 1);
        });
    });
});
//# sourceMappingURL=di-resolutions.spec.js.map