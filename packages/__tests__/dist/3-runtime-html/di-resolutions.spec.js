var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { DI, newInstanceForScope, resolve } from '@aurelia/kernel';
import { Aurelia, bindable, BindingBehavior, customElement, CustomElement, ValueConverter } from '@aurelia/runtime-html';
import { assert, createFixture, TestContext } from '@aurelia/testing';
describe('3-runtime-html/di-resolutions.spec.ts', function () {
    describe('@newInstanceForScope', function () {
        it('resolves different instances for each scoped registration', function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            let ListItem = class ListItem {
                constructor() {
                    this.model = resolve(Model);
                }
            };
            ListItem = __decorate([
                customElement({ name: 'list-item', template: `\${model.id}` })
            ], ListItem);
            let List = class List {
                constructor() {
                    this.context = resolve(newInstanceForScope(Model));
                }
            };
            List = __decorate([
                customElement({ name: 'list', template: '<list-item>', dependencies: [ListItem] })
            ], List);
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
            let ListboxItem = class ListboxItem {
                constructor() {
                    this.context = resolve(IListboxContext);
                }
            };
            __decorate([
                bindable,
                __metadata("design:type", Number)
            ], ListboxItem.prototype, "value", void 0);
            ListboxItem = __decorate([
                customElement({
                    name: 'listbox-item',
                    template: `listbox item \${i}`,
                })
            ], ListboxItem);
            let Listbox = class Listbox {
                constructor() {
                    this.context = resolve(newInstanceForScope(IListboxContext));
                }
            };
            Listbox = __decorate([
                customElement({
                    name: 'list-box',
                    template: '<listbox-item repeat.for="i of 5" value.bind="i">',
                    dependencies: [IListboxContext, ListboxItem]
                })
            ], Listbox);
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
            let Child = class Child {
                static get inject() { return [InjectableParent, Parent]; }
                constructor(parent1, parent2) {
                    this.parent1 = parent1;
                    this.parent2 = parent2;
                }
            };
            Child = __decorate([
                customElement({
                    name: 'child',
                }),
                __metadata("design:paramtypes", [Object, Object])
            ], Child);
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({ name: 'parent', template: '<child>', injectable: InjectableParent, dependencies: [Child] })
            ], Parent);
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
            var Parent_1, Child_1;
            const IRoot = CustomElement.createInjectable();
            const IParent = CustomElement.createInjectable();
            const IChild = CustomElement.createInjectable();
            let Root = class Root {
            };
            Root = __decorate([
                customElement({
                    name: 'root',
                    template: `<parent></parent><parent></parent>`,
                    injectable: IRoot,
                })
            ], Root);
            let parentId = 0;
            let Parent = Parent_1 = class Parent {
                constructor(root, parent) {
                    this.root = root;
                    this.parent = parent;
                    this.id = ++parentId;
                    assert.instanceOf(root, Root);
                    if (parent !== null) {
                        assert.instanceOf(parent, Parent_1);
                    }
                }
            };
            Parent = Parent_1 = __decorate([
                customElement({
                    name: 'parent',
                    template: ` P(\${id}<child></child><child></child>)<parent if.bind="parent === null"></parent>`,
                    injectable: IParent,
                }),
                __param(0, IRoot),
                __param(1, IParent),
                __metadata("design:paramtypes", [Root,
                    Parent])
            ], Parent);
            let childId = 0;
            let Child = Child_1 = class Child {
                constructor(root, parent, child) {
                    this.root = root;
                    this.parent = parent;
                    this.child = child;
                    this.id = ++childId;
                    assert.instanceOf(root, Root);
                    assert.instanceOf(parent, Parent);
                    if (child !== null) {
                        assert.instanceOf(child, Child_1);
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
            Child = Child_1 = __decorate([
                customElement({
                    name: 'child',
                    template: ` C(\${id})<child if.bind="child === null"></child>`,
                    injectable: IChild,
                }),
                __param(0, IRoot),
                __param(1, IParent),
                __param(2, IChild),
                __metadata("design:paramtypes", [Root,
                    Parent,
                    Child])
            ], Child);
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