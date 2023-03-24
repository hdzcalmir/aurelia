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
import { DI, IContainer, newInstanceForScope } from '@aurelia/kernel';
import { Aurelia, bindable, customElement, CustomElement } from '@aurelia/runtime-html';
import { assert, createFixture, TestContext } from '@aurelia/testing';
describe('3-runtime-html/di-resolutions.spec.ts', function () {
    describe('@newInstanceForScope', function () {
        it('resolves different instances for each scoped registration', async function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            let ListItem = class ListItem {
                constructor(model) {
                    this.model = model;
                }
            };
            ListItem.inject = [Model];
            ListItem = __decorate([
                customElement({ name: 'list-item', template: `\${model.id}` }),
                __metadata("design:paramtypes", [Model])
            ], ListItem);
            let List = class List {
                constructor(context) {
                    this.context = context;
                }
            };
            List = __decorate([
                customElement({ name: 'list', template: '<list-item>', dependencies: [ListItem] }),
                __param(0, newInstanceForScope(Model)),
                __metadata("design:paramtypes", [Model])
            ], List);
            // act
            const { component, startPromise, tearDown } = createFixture(`<list view-model.ref="list1"></list><list view-model.ref="list2"></list>`, class App {
            }, [List]);
            await startPromise;
            const listEl1 = component.list1.$controller.host;
            const listEl2 = component.list2.$controller.host;
            assert.strictEqual(id, 2);
            assert.visibleTextEqual(listEl1, '1');
            assert.visibleTextEqual(listEl2, '2');
            await tearDown();
        });
        // TODO
        // A skipped test for the most intuitive behavior: @newInstanceForScope(Interface_With_Default)
        //
        // Ideally it probably shouldn't require any registration
        // to invoke an interface with default resolution provided,
        //
        // THOUGH, this may not be implemented, for the sake of consistency
        // with the way normal .get on interface
        //
        // eslint-disable-next-line mocha/no-skipped-tests
        it.skip('resolves dependency with: Interface + @newInstanceForScope + default resolver + no registration', async function () {
            // arrange
            let contextCallCount = 0;
            const IListboxContext = DI.createInterface('IListboxContext', x => x.singleton(class ListboxContext {
                constructor() {
                    this.open = false;
                    contextCallCount++;
                }
            }));
            let ListboxItem = class ListboxItem {
                constructor(context) {
                    this.context = context;
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
                }),
                __param(0, IListboxContext),
                __metadata("design:paramtypes", [Object])
            ], ListboxItem);
            let Listbox = class Listbox {
                constructor(context) {
                    this.context = context;
                }
            };
            Listbox = __decorate([
                customElement({
                    name: 'list-box',
                    template: '<listbox-item repeat.for="i of 5" value.bind="i">',
                    dependencies: [IListboxContext, ListboxItem]
                }),
                __param(0, newInstanceForScope(IListboxContext)),
                __metadata("design:paramtypes", [Object])
            ], Listbox);
            // act
            const { component, startPromise, tearDown } = createFixture(`<list-box view-model.ref="listbox">`, class App {
            }, [Listbox]);
            await startPromise;
            // assert
            assert.strictEqual(component.listbox.context.open, false);
            assert.strictEqual(contextCallCount, 1);
            await tearDown();
        });
    });
    describe('definition.injectable', function () {
        it('resolves injectable', async function () {
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
            const { appHost, startPromise, tearDown } = createFixture('<parent>', CustomElement.define({
                name: 'app',
            }, class App {
            }), [Parent]);
            await startPromise;
            const child = CustomElement.for(appHost.querySelector('child')).viewModel;
            const parent = CustomElement.for(appHost.querySelector('parent')).viewModel;
            assert.strictEqual(parent, child.parent1);
            assert.strictEqual(parent, child.parent2);
            await tearDown();
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
    describe('local dependency inheritance', function () {
        function createFixture() {
            const ctx = TestContext.create();
            const au = new Aurelia(ctx.container);
            const host = ctx.createElement('div');
            return { ctx, au, host };
        }
        async function verifyHostText(au, host, expected) {
            await au.start();
            const outerHtmlAfterStart1 = host.outerHTML;
            assert.visibleTextEqual(host, expected, 'after start #1');
            await au.stop();
            const outerHtmlAfterStop1 = host.outerHTML;
            assert.visibleTextEqual(host, '', 'after stop #1');
            await au.start();
            const outerHtmlAfterStart2 = host.outerHTML;
            assert.visibleTextEqual(host, expected, 'after start #2');
            await au.stop();
            const outerHtmlAfterStop2 = host.outerHTML;
            assert.visibleTextEqual(host, '', 'after stop #2');
            assert.strictEqual(outerHtmlAfterStart1, outerHtmlAfterStart2, 'outerHTML after start #1 / #2');
            assert.strictEqual(outerHtmlAfterStop1, outerHtmlAfterStop2, 'outerHTML after stop #1 / #2');
        }
        function verifyResourceRegistrations(container, ...keys) {
            for (const key of keys) {
                verifyResourceRegistration(container, key);
                const resourceKey = CustomElement.getDefinition(key).key;
                if (container.has(resourceKey, true)) {
                    verifyResourceRegistration(container, CustomElement.getDefinition(key).key);
                }
            }
        }
        function verifyResourceRegistration(container, key) {
            const instance1 = container.get(key);
            const instance2 = container.get(key);
            assert.isCustomElementType(instance1.constructor);
            assert.isCustomElementType(instance2.constructor);
            assert.notStrictEqual(instance1, instance2, `two resolved resources should not be the same instance since they're transient (${key})`);
        }
        it('only compiles resources that were registered in the root, but can still resolve all inherited ones directly', async function () {
            const { au, host } = createFixture();
            const C7 = CustomElement.define({
                name: 'c-7',
                template: `7<c-1></c-1><c-2></c-2><c-3></c-3><c-4></c-4><c-5></c-5><c-6></c-6>`, // c1-c6 don't propagate here, so they should equate empty text
            }, class C7 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    // C4 is spawned from C1, so it should see C1 in its path
                    assert.strictEqual(this.container.get(C1), this.container.get(C1));
                    // C7 is spawn from C4, so it should see a single C4 in its path
                    assert.strictEqual(this.container.get(C4), this.container.get(C4));
                    assert.strictEqual(this.container.get(C7), this.container.get(C7));
                    verifyResourceRegistrations(this.container, C2, C3, C5, C6, C8, C9);
                }
            });
            const C8 = CustomElement.define({
                name: 'c-8',
                template: `8<c-1></c-1><c-2></c-2><c-3></c-3><c-4></c-4><c-5></c-5><c-6></c-6>`, // c1-c6 don't propagate here, so they should equate empty text
            }, class C8 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    // C5 is used from C2, so it should see C2 in its path
                    assert.strictEqual(this.container.get(C2), this.container.get(C2));
                    // C8 is spawn from C5, so it should see a single C5 in its path
                    assert.strictEqual(this.container.get(C5), this.container.get(C5));
                    assert.strictEqual(this.container.get(C8), this.container.get(C8));
                    verifyResourceRegistrations(this.container, C1, C3, C4, C6, C7, C9);
                }
            });
            const C9 = CustomElement.define({
                name: 'c-9',
                template: `9<c-1></c-1><c-2></c-2><c-3></c-3><c-4></c-4><c-5></c-5><c-6></c-6>`, // c1-c6 don't propagate here, so they should equate empty text
            }, class C9 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    // C9 is used from C3, so it should see C3 in its path
                    assert.strictEqual(this.container.get(C3), this.container.get(C3));
                    // C9 is used from C6, so it should see C6 in its path
                    assert.strictEqual(this.container.get(C6), this.container.get(C6));
                    assert.strictEqual(this.container.get(C9), this.container.get(C9));
                    verifyResourceRegistrations(this.container, C1, C2, C4, C5, C7, C8);
                }
            });
            const C4 = CustomElement.define({
                name: 'c-4',
                template: `4<c-7></c-7><c-1></c-1><c-2></c-2><c-3></c-3><c-5></c-5><c-6></c-6>`, // c1-c3 + c5-c6 don't propagate here, so they should equate empty text
            }, class C4 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    // C4 is spawned from C1, so it should see C1 in its path
                    assert.strictEqual(this.container.get(C1), this.container.get(C1));
                    // C4 should see itself
                    assert.strictEqual(this.container.get(C4), this.container.get(C4));
                    verifyResourceRegistrations(this.container, C2, C3, C5, C6, C7, C8, C9);
                }
            });
            const C5 = CustomElement.define({
                name: 'c-5',
                template: `5<c-8></c-8><c-1></c-1><c-2></c-2><c-3></c-3><c-4></c-4><c-6></c-6>`, // c1-c4 + c6 don't propagate here, so they should equate empty text
            }, class C5 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    // C5 is used from C2, so it should see C2 in its path
                    assert.strictEqual(this.container.get(C2), this.container.get(C2));
                    assert.strictEqual(this.container.get(C5), this.container.get(C5));
                    verifyResourceRegistrations(this.container, C1, C3, C4, C6, C7, C8, C9);
                }
            });
            const C6 = CustomElement.define({
                name: 'c-6',
                template: `6<c-9></c-9><c-1></c-1><c-2></c-2><c-3></c-3><c-4></c-4><c-5></c-5>`, // c1-c5 don't propagate here, so they should equate empty text
            }, class C6 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    // C6 is spawned from C3, so it should see C3 in its path
                    assert.strictEqual(this.container.get(C3), this.container.get(C3));
                    assert.strictEqual(this.container.get(C6), this.container.get(C6));
                    verifyResourceRegistrations(this.container, C1, C2, C4, C5, C7, C8, C9);
                }
            });
            const C1 = CustomElement.define({
                name: 'c-1',
                template: `1<c-4></c-4><c-2></c-2><c-3></c-3>`,
                dependencies: [C4],
            }, class C1 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    assert.strictEqual(this.container.get(C1), this.container.get(C1));
                    verifyResourceRegistrations(this.container, C2, C3, C4, C5, C6, C7, C8, C9);
                }
            });
            const C2 = CustomElement.define({
                name: 'c-2',
                template: `2<c-5></c-5><c-1></c-1><c-3></c-3>`,
                dependencies: [C5],
            }, class C2 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    assert.strictEqual(this.container.get(C2), this.container.get(C2));
                    verifyResourceRegistrations(this.container, C1, C3, C4, C5, C6, C7, C8, C9);
                }
            });
            const C3 = CustomElement.define({
                name: 'c-3',
                template: `3<c-6></c-6><c-1></c-1><c-2></c-2>`,
                dependencies: [C6],
            }, class C3 {
                static get inject() { return [IContainer]; }
                constructor(container) {
                    this.container = container;
                }
                binding() {
                    assert.strictEqual(this.container.get(C3), this.container.get(C3));
                    verifyResourceRegistrations(this.container, C1, C2, C4, C5, C6, C7, C8, C9);
                }
            });
            const component = CustomElement.define({
                name: 'app',
                template: `<c-1></c-1><c-2></c-2><c-3></c-3>`,
                dependencies: [C1, C2, C3]
            });
            au.register(C7, C8, C9).app({ host, component });
            await verifyHostText(au, host, `147258369`);
            au.dispose();
        });
    });
});
//# sourceMappingURL=di-resolutions.spec.js.map