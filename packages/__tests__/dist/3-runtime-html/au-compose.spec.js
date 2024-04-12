var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { resolve } from '@aurelia/kernel';
import { CustomElement, customElement, INode, IRenderLocation, bindable, } from '@aurelia/runtime-html';
import { assert, createFixture, createSpy, } from '@aurelia/testing';
import { isNode } from '../util.js';
describe('3-runtime-html/au-compose.spec.ts', function () {
    describe('view', function () {
        it('works with literal string', function () {
            const { appHost, stop } = createFixture('<au-compose template="<div>hello world</div>">');
            assert.strictEqual(appHost.textContent, 'hello world');
            void stop(true);
            assert.strictEqual(appHost.textContent, '');
        });
        // this test is a different with the rest, where the view is being recreated
        // and the composition happens again.
        // Instead of the bindings getting notified by the changes in the view model
        it('works with dynamic view + interpolation', async function () {
            const { ctx, component, appHost, startPromise, tearDown } = createFixture(`<au-compose template="<div>\${message}</div>">`, class App {
                constructor() {
                    this.message = 'hello world';
                }
            });
            await startPromise;
            assert.strictEqual(appHost.textContent, 'hello world');
            component.message = 'hello';
            assert.strictEqual(appHost.textContent, 'hello');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, 'hello');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('works with view string from view model', async function () {
            const { ctx, component, appHost, startPromise, tearDown } = createFixture('<au-compose template.bind="view">', class App {
                constructor() {
                    this.message = 'hello world';
                    this.view = `<div>\${message}</div>`;
                }
            });
            await startPromise;
            assert.strictEqual(appHost.textContent, 'hello world');
            component.message = 'hello';
            assert.strictEqual(appHost.textContent, 'hello world');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, 'hello');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('understands non-inherit scope config', async function () {
            const { ctx, component, appHost, startPromise, tearDown } = createFixture('<au-compose template.bind="view" scope-behavior="scoped" composition.bind="composition">', class App {
                constructor() {
                    this.message = 'hello world';
                    this.view = `<div>\${message}</div>`;
                }
            });
            await startPromise;
            assert.strictEqual(appHost.textContent, '');
            component.message = 'hello';
            assert.strictEqual(appHost.textContent, '');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, '');
            component.composition.controller.scope.bindingContext['message'] = 'hello';
            assert.strictEqual(appHost.textContent, '');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, 'hello');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('understands view promise', async function () {
            const { ctx, component, appHost, startPromise, tearDown } = createFixture('<au-compose template.bind="getView()" scope-behavior="scoped" composition.bind="composition">', class App {
                constructor() {
                    this.message = 'hello world';
                    this.view = `<div>\${message}</div>`;
                }
                getView() {
                    return Promise.resolve(this.view);
                }
            });
            await startPromise;
            assert.strictEqual(appHost.textContent, '');
            component.message = 'hello';
            assert.strictEqual(appHost.textContent, '');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, '');
            component.composition.controller.scope.bindingContext['message'] = 'hello';
            assert.strictEqual(appHost.textContent, '');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, 'hello');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('throws on invalid scope-behavior value', function () {
            const { component } = createFixture('<au-compose template.bind="view" scope-behavior.bind="behavior">', class App {
                constructor() {
                    this.message = 'hello world';
                    this.view = `<div>\${message}</div>`;
                    this.behavior = "auto";
                }
            });
            assert.throws(() => component.behavior = 'scope', 'Invalid scope behavior');
        });
    });
    describe('.component', function () {
        it('works with literal object', async function () {
            const { appHost, tearDown } = createFixture(`\${message}<au-compose component.bind="{ activate }">`, class App {
                constructor() {
                    this.message = 'hello world';
                    this.view = `<div>\${message}</div>`;
                    this.behavior = "auto";
                    this.activate = () => {
                        this.message = 'Aurelia!!';
                    };
                }
            });
            assert.strictEqual(appHost.textContent, 'Aurelia!!');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('works with custom element', async function () {
            let activateCallCount = 0;
            const { appHost, tearDown } = createFixture('<au-compose component.bind="fieldVm">', class App {
                constructor() {
                    this.message = 'hello world';
                    this.fieldVm = CustomElement.define({ name: 'input-field', template: '<input value.bind="value">' }, class InputField {
                        constructor() {
                            this.value = 'hello';
                        }
                        activate() {
                            activateCallCount++;
                        }
                    });
                }
            });
            assert.strictEqual(appHost.textContent, '');
            assert.strictEqual(appHost.querySelector('input').value, 'hello');
            assert.strictEqual(activateCallCount, 1);
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
            assert.strictEqual(appHost.querySelector('input'), null);
        });
        it('works with promise of custom element', async function () {
            let activateCallCount = 0;
            const { appHost, tearDown } = await createFixture('<au-compose component.bind="getVm()">', class App {
                getVm() {
                    return Promise.resolve(CustomElement.define({ name: 'input-field', template: '<input value.bind="value">' }, class InputField {
                        constructor() {
                            this.value = 'hello';
                        }
                        activate() {
                            activateCallCount++;
                        }
                    }));
                }
            }).started;
            assert.strictEqual(appHost.textContent, '');
            assert.strictEqual(appHost.querySelector('input').value, 'hello');
            assert.strictEqual(activateCallCount, 1);
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
            assert.strictEqual(appHost.querySelector('input'), null);
        });
        it('passes model to activate method', function () {
            const models = [];
            const model = { a: 1, b: Symbol() };
            createFixture(`<au-compose component.bind="{ activate }" model.bind="model">`, class App {
                constructor() {
                    this.model = model;
                    this.activate = (model) => {
                        models.push(model);
                    };
                }
            });
            assert.deepStrictEqual(models, [model]);
        });
        it('waits for activate promise', async function () {
            let resolve;
            let attachedCallCount = 0;
            const { startPromise } = createFixture(`<au-compose component.bind="{ activate }" template.bind="view">`, class App {
                constructor() {
                    this.activate = () => {
                        return new Promise(r => {
                            resolve = r;
                        });
                    };
                }
                attached() {
                    attachedCallCount++;
                }
            });
            await Promise.race([
                new Promise(r => setTimeout(r, 50)),
                startPromise
            ]);
            assert.strictEqual(attachedCallCount, 0);
            resolve();
            await Promise.race([
                new Promise(r => setTimeout(r)),
                startPromise
            ]);
            assert.strictEqual(attachedCallCount, 1);
        });
        it('does not re-compose when only model is updated', function () {
            let constructorCallCount = 0;
            let model = { a: 1, b: Symbol() };
            const models1 = [model];
            const models2 = [];
            class PlainViewModelClass {
                constructor() {
                    constructorCallCount++;
                }
                activate(model) {
                    models2.push(model);
                }
            }
            const { ctx, component } = createFixture(`<au-compose component.bind="vm" model.bind="model">`, class App {
                constructor() {
                    this.model = model;
                    this.vm = PlainViewModelClass;
                }
            });
            assert.strictEqual(constructorCallCount, 1);
            assert.deepStrictEqual(models1, models2);
            model = { a: 2, b: Symbol() };
            models1.push(model);
            component.model = model;
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(constructorCallCount, 1);
            assert.strictEqual(models2.length, 2);
            assert.deepStrictEqual(models1, models2);
        });
    });
    describe('integration with repeat', function () {
        it('works with repeat in view only composition', function () {
            const { appHost } = createFixture(`<au-compose repeat.for="i of 5" template.bind="getView()">`, class App {
                getMessage(i) {
                    return `Hello ${i}`;
                }
                getView() {
                    return `<div>div \${i}: \${getMessage(i)}</div>`;
                }
            });
            const divs = Array.from(appHost.querySelectorAll('div'));
            assert.strictEqual(divs.length, 5);
            divs.forEach((div, i) => {
                assert.strictEqual(div.textContent, `div ${i}: Hello ${i}`);
            });
        });
        it('works with repeat in literal object composition', function () {
            const models = [];
            createFixture(`<au-compose repeat.for="i of 5" component.bind="{ activate }" model.bind="{ index: i }">`, class App {
                constructor() {
                    this.activate = (model) => {
                        models.push(model);
                    };
                }
            });
            assert.deepStrictEqual(models, Array.from({ length: 5 }, (_, index) => ({ index })));
        });
        it('deactivates when collection changes', async function () {
            const { component, appHost } = createFixture(`<au-compose repeat.for="i of items" template.bind="getView()">`, class App {
                constructor() {
                    this.items = 5;
                }
                getMessage(i) {
                    return `Hello ${i}`;
                }
                getView() {
                    return `<div>div \${i}: \${getMessage(i)}</div>`;
                }
            });
            let divs = Array.from(appHost.querySelectorAll('div'));
            assert.strictEqual(divs.length, 5);
            divs.forEach((div, i) => {
                assert.strictEqual(div.textContent, `div ${i}: Hello ${i}`);
            });
            component.items = 3;
            divs = Array.from(appHost.querySelectorAll('div'));
            assert.strictEqual(divs.length, 3);
            divs.forEach((div, i) => {
                assert.strictEqual(div.textContent, `div ${i}: Hello ${i}`);
            });
        });
    });
    describe('multi au-compose', function () {
        it('composes au-compose', async function () {
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose repeat.for="i of 5" template.bind="getView()">`, class App {
                getMessage(i) {
                    return `Hello ${i}`;
                }
                getView() {
                    return `<au-compose template.bind="getInnerView()">`;
                }
                getInnerView() {
                    return `<div>div \${i}: \${getMessage(i)}</div>`;
                }
            });
            await startPromise;
            const divs = Array.from(appHost.querySelectorAll('div'));
            assert.strictEqual(divs.length, 5);
            divs.forEach((div, i) => {
                assert.strictEqual(div.textContent, `div ${i}: Hello ${i}`);
            });
            await tearDown();
            assert.strictEqual(appHost.querySelectorAll('div').length, 0);
        });
    });
    // the tests in the 3 describes below
    // are only temporary indicators of composition capability/behaviors
    // they may change and should the tests.
    // The tests below shouldn't dictate the direction of <au-compose/>
    describe('host/renderlocation injection', function () {
        it('injects newly created host when composing custom element', function () {
            let El = class El {
                constructor(node) {
                    this.node = node;
                }
            };
            El.inject = [INode];
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<div>Hello world from El</div>'
                }),
                __metadata("design:paramtypes", [Object])
            ], El);
            const { appHost } = createFixture(`<au-compose component.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = El;
                }
            });
            assert.visibleTextEqual(appHost, 'Hello world from El');
            assert.html.innerEqual(appHost, '<el><div>Hello world from El</div></el>');
            const el = CustomElement.for(appHost.querySelector('el'), { name: 'el' }).viewModel;
            assert.strictEqual(el.node, appHost.querySelector('el'));
        });
        it('injects newly created host when composing different custom element', function () {
            let Child = class Child {
                constructor(node) {
                    this.node = node;
                }
            };
            Child.inject = [INode];
            Child = __decorate([
                customElement({
                    name: 'child',
                    template: '<div>Hello world from Child</div>'
                }),
                __metadata("design:paramtypes", [Object])
            ], Child);
            let Parent = class Parent {
                constructor(node) {
                    this.node = node;
                }
            };
            Parent.inject = [INode];
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<div>Hello world from Parent</div>'
                }),
                __metadata("design:paramtypes", [Object])
            ], Parent);
            const { ctx, appHost, component } = createFixture(`<au-compose component.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = Child;
                }
            });
            assert.visibleTextEqual(appHost, 'Hello world from Child');
            assert.html.innerEqual(appHost, '<child><div>Hello world from Child</div></child>');
            const childElHost = appHost.querySelector('child');
            const child = CustomElement.for(childElHost, { name: 'child' }).viewModel;
            assert.strictEqual(child.node, childElHost);
            component.El = Parent;
            ctx.platform.domWriteQueue.flush();
            assert.visibleTextEqual(appHost, 'Hello world from Parent');
            assert.html.innerEqual(appHost, '<parent><div>Hello world from Parent</div></parent>');
            const parentElHost = appHost.querySelector('parent');
            const parent = CustomElement.for(parentElHost, { name: 'parent' }).viewModel;
            assert.strictEqual(parent.node, parentElHost);
        });
        it('injects render location when composing POJO classes with <au-compose containerless/>', function () {
            let loc;
            class El {
                constructor(l) {
                    loc = l;
                }
            }
            El.inject = [IRenderLocation];
            const { appHost, assertHtml } = createFixture(`<au-compose component.bind="El" template="<div>Hello</div>" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = El;
                }
            });
            assert.visibleTextEqual(appHost, 'Hello');
            assert.strictEqual(loc, appHost.lastChild.previousSibling);
            assertHtml('<!--au-start--><!--au-start--><div>Hello</div><!--au-end--><!--au-end-->');
        });
        it('injects newly created element when composing POJO with tag bindable', function () {
            let host;
            class El {
                constructor() {
                    host = resolve(INode);
                }
            }
            const { appHost, assertHtml, assertText } = createFixture(`<au-compose tag="p" component.bind="El" template="<div>Hello</div>" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = El;
                }
            });
            assertText('Hello');
            assert.strictEqual(host, appHost.querySelector('p'));
            assertHtml('<!--au-start--><p><div>Hello</div></p><!--au-end-->');
        });
        it('injects different host for POJO when tag binding changes', function () {
            let host;
            class El {
                constructor() {
                    host = resolve(INode);
                }
            }
            const { component, appHost, assertHtml, assertText } = createFixture(`<au-compose tag.bind="i ? 'h2' : 'h1'" component.bind="El" template="<div>Hello</div>" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.i = 0;
                    this.El = El;
                }
            });
            assertText('Hello');
            assert.strictEqual(host, appHost.querySelector('h1'));
            assertHtml('<!--au-start--><h1><div>Hello</div></h1><!--au-end-->');
            component.i = 1;
            assert.strictEqual(host, appHost.querySelector('h2'));
            assertHtml('<!--au-start--><h2><div>Hello</div></h2><!--au-end-->');
        });
        it('ignores tag binding change when composing custom element', function () {
            let compositionCount = 0;
            let El = class El {
            };
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<div>Hello world from El</div>'
                })
            ], El);
            const { component, assertHtml, assertText } = createFixture(`<au-compose tag.bind="i ? 'h2' : 'h1'" component.bind="El" model.bind="{ index: 0 }" containerless composition.bind="composed">`, class App {
                constructor() {
                    this.i = 0;
                    this.El = El;
                }
                set composed(_value) {
                    compositionCount++;
                }
            });
            assertText('Hello world from El');
            assertHtml('<!--au-start--><el><div>Hello world from El</div></el><!--au-end-->');
            // initial binding 1 + initial composition 1
            assert.strictEqual(compositionCount, 2);
            component.i = 1;
            assert.strictEqual(compositionCount, 2);
        });
    });
    describe('composition scenarios', function () {
        it('calls activate with the right model', function () {
            const models = [];
            const { appHost } = createFixture(`<au-compose component.bind="{ activate }" template="<div>Hello world</div>" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.activate = (model) => {
                        models.push(model);
                    };
                }
            });
            assert.deepStrictEqual(models, [{ index: 0 }]);
            assert.visibleTextEqual(appHost, 'Hello world');
            assert.html.innerEqual(appHost, '<div>Hello world</div>');
        });
        it('composes non-custom element mutiple times', async function () {
            const models = [];
            const { appHost, component, startPromise, tearDown } = createFixture(`<au-compose component.bind="{ activate }" template.bind="view" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.activate = (model) => {
                        models.push(model);
                    };
                    this.view = '<div>Hello world</div>';
                }
            });
            await startPromise;
            assert.deepStrictEqual(models, [{ index: 0 }]);
            assert.visibleTextEqual(appHost, 'Hello world');
            assert.html.innerEqual(appHost, '<div>Hello world</div>');
            component.view = '<b>Hello</b>';
            assert.html.innerEqual(appHost, '<b>Hello</b>');
            assert.deepStrictEqual(models, [{ index: 0 }, { index: 0 }]);
            assert.visibleTextEqual(appHost, 'Hello');
            assert.html.innerEqual(appHost, '<b>Hello</b>');
            await tearDown();
        });
        it('works with containerless composing custom element', async function () {
            let El = class El {
            };
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<div>Hello world from El</div>'
                })
            ], El);
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose component.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = El;
                }
            });
            await startPromise;
            assert.visibleTextEqual(appHost, 'Hello world from El');
            assert.html.innerEqual(appHost, '<el><div>Hello world from El</div></el>');
            await tearDown();
        });
        it('composes custom element mutiple times', async function () {
            let Child = class Child {
            };
            Child = __decorate([
                customElement({
                    name: 'child',
                    template: '<div>Hello world from Child</div>'
                })
            ], Child);
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<div>Hello world from Parent</div>'
                })
            ], Parent);
            const { appHost, ctx, component, startPromise, tearDown } = createFixture(`<au-compose component.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = Child;
                }
            });
            await startPromise;
            assert.visibleTextEqual(appHost, 'Hello world from Child');
            assert.html.innerEqual(appHost, '<child><div>Hello world from Child</div></child>');
            component.El = Parent;
            ctx.platform.domWriteQueue.flush();
            assert.visibleTextEqual(appHost, 'Hello world from Parent');
            assert.html.innerEqual(appHost, '<parent><div>Hello world from Parent</div></parent>');
            await tearDown();
        });
        it('switches POJO -> custom element -> POJO', async function () {
            let Child = class Child {
            };
            Child = __decorate([
                customElement({
                    name: 'child',
                    template: '<div>Hello world from Child</div>'
                })
            ], Child);
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<div>Hello world from Parent</div>'
                })
            ], Parent);
            const { appHost, ctx, component, startPromise, tearDown } = createFixture(`<au-compose component.bind="El" template.bind="view" model.bind="{ index: 0 }">`, class App {
                constructor() {
                    this.message = 'app';
                    this.El = { message: 'POJO' };
                    this.view = `<div>Hello world from \${message}</div>`;
                }
            });
            await startPromise;
            assert.visibleTextEqual(appHost, 'Hello world from POJO');
            assert.html.innerEqual(appHost, '<div>Hello world from POJO</div>');
            component.El = Parent;
            ctx.platform.domWriteQueue.flush();
            assert.visibleTextEqual(appHost, 'Hello world from Parent');
            assert.html.innerEqual(appHost, '<parent><div>Hello world from Parent</div></parent>');
            component.El = { message: 'POJO2' };
            ctx.platform.domWriteQueue.flush();
            assert.visibleTextEqual(appHost, 'Hello world from POJO2');
            assert.html.innerEqual(appHost, '<div>Hello world from POJO2</div>');
            component.El = Child;
            ctx.platform.domWriteQueue.flush();
            assert.visibleTextEqual(appHost, 'Hello world from Child');
            assert.strictEqual(appHost.innerHTML, '<!--au-start--><child><div>Hello world from Child</div></child><!--au-end-->');
            await tearDown();
            assert.strictEqual(appHost.innerHTML, '');
        });
        it('discards stale composition', function () {
            const { appHost, ctx, component } = createFixture(`<au-compose component.bind="El" template.bind="\`<div>$\\{text}</div>\`" model.bind="{ index: 0 }">`, class App {
                constructor() {
                    this.El = { text: 'Hello' };
                }
            });
            assert.visibleTextEqual(appHost, 'Hello');
            assert.html.innerEqual(appHost, '<div>Hello</div>');
            component.El = { text: 'Hello 22' };
            component.El = { text: 'Hello 33' };
            ctx.platform.domWriteQueue.flush();
            assert.visibleTextEqual(appHost, 'Hello 33');
            assert.html.innerEqual(appHost, '<div>Hello 33</div>');
        });
        it('composes string as component', function () {
            const { assertHtml } = createFixture('<au-compose component="el">', class {
            }, [CustomElement.define({ name: 'el', template: 'from string' })]);
            assertHtml('<el>from string</el>', { compact: true });
        });
        it('throws when component name is specified but cannot be found', function () {
            assert.throws(() => createFixture('<au-compose component="el">'));
        });
        it('composes string promise', async function () {
            const { assertHtml } = await createFixture('<au-compose component.bind="elPromise">', class {
                constructor() {
                    this.elPromise = Promise.resolve('el');
                }
            }, [CustomElement.define({ name: 'el', template: 'from string' })]).started;
            assertHtml('<el>from string</el>', { compact: true });
        });
        it('does not find element beside local or global registries', function () {
            let El1 = class El1 {
            };
            El1 = __decorate([
                customElement({ name: 'el1', template: '<au-compose component="el2">' })
            ], El1);
            let El2 = class El2 {
            };
            El2 = __decorate([
                customElement({ name: 'el2', template: 'el2 <el1>' })
            ], El2);
            let El3 = class El3 {
            };
            El3 = __decorate([
                customElement({ name: 'el3', template: 'el3 <el2>', dependencies: [El1, El2] })
            ], El3);
            assert.throws(() => createFixture('<el3></el3>', class {
            }, [El1, El3]));
        });
        it('switches POJO -> string', function () {
            const { assertHtml, component } = createFixture(`<au-compose component.bind="El" template.bind="view" model.bind="{ index: 0 }">`, class App {
                constructor() {
                    this.message = 'app';
                    this.El = { message: 'POJO' };
                    this.view = `<div>Hello world from \${message}</div>`;
                }
            }, [CustomElement.define({ name: 'my-el', template: 'Hello world from ce' })]);
            assertHtml('<div>Hello world from POJO</div>', { compact: true });
            component.El = 'my-el';
            assertHtml('<my-el>Hello world from ce</my-el>', { compact: true });
        });
        it('switches from CE -> string (in local registry)', function () {
            var Child_1;
            let Child = Child_1 = class Child {
                constructor() {
                    this.id = ++Child_1.id;
                }
            };
            Child.id = 0;
            Child = Child_1 = __decorate([
                customElement({ name: 'child', template: 'Hello world from child ${id}' })
            ], Child);
            let Parent = class Parent {
                constructor() {
                    this.c = Child;
                }
            };
            Parent = __decorate([
                customElement({ name: 'parent', template: '<au-compose component.bind="c">', dependencies: [Child] })
            ], Parent);
            const { assertHtml, component } = createFixture(`<parent component.ref=parent>`, class App {
            }, [Parent]);
            assertHtml('<parent><child>Hello world from child 1</child></parent>', { compact: true });
            component.parent.c = 'child';
            assertHtml('<parent><child>Hello world from child 2</child></parent>', { compact: true });
        });
    });
    describe('multi updates + <Promise>', function () {
        it('works with [multiple successive updates] + [activate<Promise>]', async function () {
            const baseTimeout = 75;
            let timeout = baseTimeout;
            const { appHost, component, startPromise, stop } = createFixture(`\${message}<au-compose component.bind="{ activate, value: i }" template.bind="view" composing.bind="pendingPromise" containerless>`, class App {
                constructor() {
                    this.i = 0;
                    this.message = 'hello world';
                    this.view = `<div>\${value}</div>`;
                    this.activate = () => {
                        if (timeout === baseTimeout) {
                            timeout--;
                            return;
                        }
                        return new Promise(r => setTimeout(r, Math.random() * timeout--));
                    };
                }
            });
            await startPromise;
            assert.strictEqual(appHost.textContent, 'hello world0');
            component.i++;
            component.i++;
            while (component.i < timeout) {
                component.i++;
                timeout--;
                assert.strictEqual(appHost.textContent, 'hello world0');
            }
            await component.pendingPromise;
            assert.strictEqual(appHost.textContent, `hello world38`);
            assert.html.innerEqual(appHost, 'hello world<div>38</div>');
            void stop();
            assert.strictEqual(appHost.textContent, '');
        });
    });
    it('works with [multiple successive updates] + [binding<Promise>]', async function () {
        const baseTimeout = 75;
        let timeout = baseTimeout;
        const El1 = CustomElement.define({
            name: 'el1',
            template: `<div>\${value} 1</div>`
        }, class El {
            activate(model) {
                this.value = model;
            }
            binding() {
                if (timeout === baseTimeout) {
                    timeout--;
                    return;
                }
                return new Promise(r => setTimeout(r, Math.random() * timeout--));
            }
        });
        const El2 = CustomElement.define({
            name: 'el2',
            template: `<p>\${value} 2</p>`
        }, class El {
            activate(model) {
                this.value = model;
            }
            binding() {
                if (timeout === baseTimeout) {
                    timeout--;
                    return;
                }
                return new Promise(r => setTimeout(r, Math.random() * timeout--));
            }
        });
        const { appHost, component, startPromise, tearDown } = createFixture(`\${message}<au-compose component.bind="vm" model.bind="message" composing.bind="pendingPromise" containerless>`, class App {
            constructor() {
                this.i = 0;
                this.message = 'hello world';
                this.vm = El1;
            }
        });
        await startPromise;
        assert.strictEqual(appHost.textContent, 'hello worldhello world 1');
        component.vm = El2;
        component.vm = El1;
        component.vm = El2;
        assert.strictEqual(appHost.textContent, `hello worldhello world 1`);
        // in the interim before a composition is completely disposed, on the fly host created will be in the doc
        assert.html.innerEqual(appHost, 'hello world<el1><div>hello world 1</div></el1><el2></el2>');
        await component.pendingPromise;
        assert.strictEqual(appHost.textContent, `hello worldhello world 2`);
        assert.html.innerEqual(appHost, 'hello world<el2><p>hello world 2</p></el2>');
        await tearDown();
        assert.strictEqual(appHost.textContent, '');
    });
    // todo:
    // in the future, if we ever add ability to control swapping order of compose
    // this test may need changes
    it('invokes lifecycle in reasonable manner', async function () {
        const lifecyclesCalls = [];
        const El1 = CustomElement.define({
            name: 'el1',
            template: `<div>\${value} 1</div>`
        }, class El {
            activate() {
                lifecyclesCalls.push('1.activate');
            }
            binding() {
                lifecyclesCalls.push('1.binding');
            }
            bound() {
                lifecyclesCalls.push('1.bound');
            }
            attaching() {
                lifecyclesCalls.push('1.attaching');
            }
            attached() {
                lifecyclesCalls.push('1.attached');
            }
            detaching() {
                lifecyclesCalls.push('1.detaching');
            }
            unbinding() {
                lifecyclesCalls.push('1.unbinding');
            }
        });
        const El2 = CustomElement.define({
            name: 'el2',
            template: `<p>\${value} 2</p>`
        }, class El {
            activate() {
                lifecyclesCalls.push('2.activate');
            }
            binding() {
                lifecyclesCalls.push('2.binding');
            }
            bound() {
                lifecyclesCalls.push('2.bound');
            }
            attaching() {
                lifecyclesCalls.push('2.attaching');
            }
            attached() {
                lifecyclesCalls.push('2.attached');
            }
            detaching() {
                lifecyclesCalls.push('2.detaching');
            }
            unbinding() {
                lifecyclesCalls.push('2.unbinding');
            }
        });
        const { appHost, component, startPromise, tearDown } = createFixture(`\${message}<au-compose component.bind="vm" model.bind="message" composing.bind="pendingPromise" containerless>`, class App {
            constructor() {
                this.i = 0;
                this.message = 'hello world';
                this.vm = El1;
            }
        });
        await startPromise;
        assert.deepStrictEqual(lifecyclesCalls, [
            '1.activate',
            '1.binding',
            '1.bound',
            '1.attaching',
            '1.attached',
        ]);
        // 1.1
        component.vm = El2;
        // 1.2
        component.vm = El1;
        // 1.3
        component.vm = El2;
        assert.deepStrictEqual(lifecyclesCalls, [
            '1.activate',
            '1.binding',
            '1.bound',
            '1.attaching',
            '1.attached',
            // activation before detactivation
            // 1.1 starts
            '2.activate',
            '2.binding',
            '2.bound',
            '2.attaching',
            '2.attached',
            '1.detaching',
            '1.unbinding',
            // 1.1 ends
            // 1.2 starts
            '1.activate',
            '1.binding',
            '1.bound',
            '1.attaching',
            '1.attached',
            '2.detaching',
            '2.unbinding',
            // 1.2 ends
            // 1.3 starts
            '2.activate',
            '2.binding',
            '2.bound',
            '2.attaching',
            '2.attached',
            '1.detaching',
            '1.unbinding',
            // 1.3 ends
        ]);
        await component.pendingPromise;
        await tearDown();
        assert.strictEqual(appHost.textContent, '');
    });
    it('works with [au-slot] when composing custom element', async function () {
        const El1 = CustomElement.define({
            name: 'el1',
            template: `<p><au-slot>`
        }, class Element1 {
        });
        const { appHost, startPromise, tearDown } = createFixture(`<au-compose component.bind="vm"><input value.bind="message" au-slot>`, class App {
            constructor() {
                this.message = 'Aurelia';
                this.vm = El1;
            }
        });
        await startPromise;
        assert.strictEqual(appHost.querySelector('p input').value, 'Aurelia');
        await tearDown();
    });
    it('works with [au-slot] + [repeat] when composing custom element', async function () {
        const El1 = CustomElement.define({
            name: 'el1',
            template: `<p><au-slot>`
        }, class Element1 {
        });
        const { appHost, startPromise } = createFixture(`<au-compose repeat.for="i of 3" component.bind="vm"><input value.to-view="message + i" au-slot>`, class App {
            constructor() {
                this.message = 'Aurelia';
                this.vm = El1;
            }
        });
        await startPromise;
        assert.deepStrictEqual(Array.from(appHost.querySelectorAll('p input')).map((i) => i.value), ['Aurelia0', 'Aurelia1', 'Aurelia2']);
    });
    if (typeof window !== 'undefined') {
        it('works with promise in attach/detach', async function () {
            const El1 = CustomElement.define({
                name: 'el1',
                template: `<template ref="host"><p>Heollo??`
            }, class Element1 {
                async attaching() {
                    return new Promise(r => setTimeout(r, 50));
                }
                async detaching() {
                    return new Promise(r => setTimeout(r, 50));
                }
            });
            const { component, startPromise } = createFixture(`<au-compose repeat.for="vm of components" component.bind="vm">`, class App {
                constructor() {
                    this.message = 'Aurelia';
                    this.components = [];
                    this.vm = El1;
                }
                render() {
                    this.components.push(El1);
                }
                remove() {
                    this.components.pop();
                }
            });
            await startPromise;
            component.render();
            await new Promise(r => setTimeout(r, 100));
            component.render();
            await new Promise(r => setTimeout(r, 100));
            component.remove();
            await new Promise(r => setTimeout(r, 150));
        });
    }
    describe('containerless', function () {
        it('composes containerless', function () {
            const { appHost, component } = createFixture('<au-compose component.bind="comp">', class {
                constructor() {
                    this.comp = CustomElement.define({
                        name: 'my-button',
                        template: '<button>click me',
                        containerless: true,
                    });
                }
            });
            assert.strictEqual(appHost.innerHTML, '<!--au-start--><!--au-start--><button>click me</button><!--au-end--><!--au-end-->');
            component.comp = {};
            // when there's no template it'll just add a render location for the composition
            // and doesn't do anything beside that
            assert.strictEqual(appHost.innerHTML, '<!--au-start--><!--au-start--><!--au-end--><!--au-end-->');
        });
        it('composes containerless inside a containerless <au-compose>', function () {
            const { appHost, component } = createFixture('<au-compose component.bind="comp" containerless>', class {
                constructor() {
                    this.comp = CustomElement.define({
                        name: 'my-button',
                        template: '<button>click me',
                        containerless: true,
                    });
                }
            });
            assert.strictEqual(appHost.innerHTML, '<!--au-start--><!--au-start--><button>click me</button><!--au-end--><!--au-end-->');
            component.comp = {};
            // when there's no template it'll just add a render location for the composition
            // and doesn't do anything beside that
            assert.strictEqual(appHost.innerHTML, '<!--au-start--><!--au-start--><!--au-end--><!--au-end-->');
        });
    });
    describe('pass through props', function () {
        it('passes plain attributes', function () {
            let El = class El {
            };
            El = __decorate([
                customElement('el')
            ], El);
            const { assertAttr } = createFixture('<au-compose style="width: 20%" component.bind="comp" component.ref="el">', class {
                constructor() {
                    this.comp = El;
                }
            });
            assertAttr('el', 'style', 'width: 20%;');
        });
        it('transfers attrs when composing non custom element', function () {
            const { assertAttr } = createFixture('<au-compose style="width: 20%" tag="p" component.bind="{}">', class {
            });
            assertAttr('p', 'style', 'width: 20%;');
        });
        it('passes through ref binding', function () {
            let El = class El {
            };
            El = __decorate([
                customElement('el')
            ], El);
            const { component } = createFixture('<au-compose component.bind="comp" component.ref="el">', class {
                constructor() {
                    this.comp = El;
                }
            });
            assert.instanceOf(component.el, El);
        });
        it('passes through attribute as bindable', function () {
            let El = class El {
            };
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], El.prototype, "message", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '${message}'
                })
            ], El);
            const { assertText, assertHtml } = createFixture('<au-compose component.bind="comp" message.bind="msg">', class {
                constructor() {
                    this.comp = El;
                    this.msg = 'hello world';
                }
            });
            assertText('hello world');
            assertHtml('<!--au-start--><el>hello world</el><!--au-end-->');
        });
        it('passes through combination of normal and bindable attrs', function () {
            let El = class El {
            };
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], El.prototype, "message", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '${message}'
                })
            ], El);
            const { assertText, assertHtml } = createFixture('<au-compose component.bind="comp" id.bind="1" message.bind="msg" class="el">', class {
                constructor() {
                    this.comp = El;
                    this.msg = 'hello world';
                }
            });
            assertText('hello world');
            // .bind on id.bind causes the value to be set during .bind
            // which is after class attr, which is during rendering (composition)
            assertHtml('<!--au-start--><el class="el" id="1">hello world</el><!--au-end-->');
        });
        it('switches & cleans up after switching custom element view model', function () {
            let el1MessageCount = 0;
            let El1 = class El1 {
                messageChanged() {
                    el1MessageCount++;
                }
            };
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], El1.prototype, "message", void 0);
            El1 = __decorate([
                customElement({
                    name: 'el-1',
                    template: '${message}'
                })
            ], El1);
            let El2 = class El2 {
            };
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], El2.prototype, "message", void 0);
            __decorate([
                bindable,
                __metadata("design:type", Object)
            ], El2.prototype, "id", void 0);
            El2 = __decorate([
                customElement({
                    name: 'el-2',
                    template: '${id} hey there ${message}'
                })
            ], El2);
            const { component, assertText, assertHtml } = createFixture('<au-compose component.bind="comp" id.bind="1" message.bind="msg" class="el">', class {
                constructor() {
                    this.comp = El1;
                    this.msg = 'hello world';
                }
            });
            assertText('hello world');
            assert.strictEqual(el1MessageCount, 0);
            component.comp = El2;
            assertText('1 hey there hello world');
            assertHtml('<!--au-start--><el-2 class="el">1 hey there hello world</el-2><!--au-end-->');
            // all bindings to old vm were unbound
            assert.strictEqual(el1MessageCount, 0);
        });
        it('spreads the right attribute on non-custom-element composition tag change', function () {
            const { component, assertHtml } = createFixture('<au-compose tag.bind="i ? `a` : `b`" component.bind="{ }" download.bind="download">', class {
                constructor() {
                    this.i = 0;
                    this.download = true;
                }
            });
            assertHtml('<!--au-start--><b></b><!--au-end-->');
            component.i = 1;
            assertHtml('<!--au-start--><a download="true"></a><!--au-end-->');
        });
        // surrogate is not supported on non custom element composition
        // eslint-disable-next-line mocha/no-skipped-tests
        it.skip('binds attributes with right scope on non custom element composition tag change', function () {
            const { component, assertHtml } = createFixture('<au-compose tag.bind="i ? `a` : `b`" component.bind="{ d: download }" template.bind="view">', class {
                constructor() {
                    this.i = 0;
                    this.download = true;
                    this.view = '<template download.bind=d>Hey';
                }
            });
            assertHtml('<!--au-start--><b>Hey</b><!--au-end-->');
            component.i = 1;
            assertHtml('<!--au-start--><a download="true">Hey</a><!--au-end-->');
        });
        if (!isNode()) {
            it('does not pass through when no tag is specified in non custom element composition', function () {
                let i = 0;
                let hostEl;
                const originalCreateElement = document.createElement;
                const spied = createSpy(document, 'createElement', (name) => {
                    const el = originalCreateElement.call(document, name);
                    if (name === 'div') {
                        i++;
                        hostEl = el;
                    }
                    return el;
                });
                const { assertHtml } = createFixture('<au-compose template="hey" class="el">', class {
                    constructor() {
                        this.download = true;
                    }
                    hydrated() {
                        i = 0;
                        hostEl = null;
                    }
                });
                assertHtml('<!--au-start--><!--au-start-->hey<!--au-end--><!--au-end-->');
                assert.strictEqual(i, 1);
                assert.notStrictEqual(hostEl, null);
                assert.notStrictEqual(hostEl.getAttribute('class'), 'el');
                spied.restore();
            });
        }
        it('passes attributes into ...$attrs', function () {
            let MyInput = class MyInput {
            };
            MyInput = __decorate([
                customElement({
                    name: 'my-input',
                    capture: true,
                    template: '<input ...$attrs />'
                })
            ], MyInput);
            const { assertValue } = createFixture('<au-compose component.bind="comp" value.bind="message" />', class {
                constructor() {
                    this.comp = MyInput;
                    this.message = 'hello world';
                }
            }, [MyInput]);
            assertValue('input', 'hello world');
        });
        it('passes ...$attrs on <au-compose>', function () {
            let MyInput = class MyInput {
            };
            MyInput = __decorate([
                customElement({
                    name: 'my-input',
                    capture: true,
                    template: '<input ...$attrs />'
                })
            ], MyInput);
            let Field = class Field {
                constructor() {
                    this.comp = MyInput;
                }
            };
            Field = __decorate([
                customElement({
                    name: 'field',
                    capture: true,
                    template: '<au-compose component.bind="comp" ...$attrs >'
                })
            ], Field);
            const { assertValue, component, type } = createFixture('<field value.bind="message" />', class {
                constructor() {
                    this.message = 'hello world';
                }
            }, [Field]);
            assertValue('input', 'hello world');
            type('input', 'hey');
            assert.strictEqual(component.message, 'hey');
        });
        it('transfers through ...$attrs', function () {
            let MyInput = class MyInput {
            };
            MyInput = __decorate([
                customElement({
                    name: 'my-input',
                    capture: true,
                    template: '<input ...$attrs />'
                })
            ], MyInput);
            let Field = class Field {
            };
            Field = __decorate([
                customElement({
                    name: 'field',
                    capture: true,
                    template: '<my-input ...$attrs />',
                    dependencies: [MyInput]
                })
            ], Field);
            const { assertAttr, assertValue, component, type } = createFixture('<au-compose component.bind="comp" value.bind="message" id="i1" >', class {
                constructor() {
                    this.comp = Field;
                    this.message = 'hello world';
                }
            }, [Field]);
            assertValue('input', 'hello world');
            assertAttr('input', 'id', 'i1');
            type('input', 'hey');
            assert.strictEqual(component.message, 'hey');
        });
    });
    describe('comparison with normal rendering', function () {
        it('renders similar output', function () {
            let El = class El {
            };
            __decorate([
                bindable,
                __metadata("design:type", Object)
            ], El.prototype, "v", void 0);
            El = __decorate([
                customElement({
                    name: 'my-el',
                    template: '<p>hey ${v}</p>'
                })
            ], El);
            const { assertHtml } = createFixture(`<div id=d1>
          <au-compose component.bind="el" style="width: 20%;" v="aurelia"></au-compose>
        </div>
        <div id=d2>
          <my-el style="width: 20%;" v="aurelia"></my-el>
        </div>
        <div id=d3>
          <au-compose component="my-el" style="width: 20%;" v="aurelia"></au-compose>
        </div>
        `, class {
                constructor() {
                    this.el = El;
                }
            }, [El]);
            assertHtml('#d1', '<my-el style="width: 20%;"><p>hey aurelia</p></my-el>', { compact: true });
            assertHtml('#d2', '<my-el style="width: 20%;"><p>hey aurelia</p></my-el>', { compact: true });
            assertHtml('#d3', '<my-el style="width: 20%;"><p>hey aurelia</p></my-el>', { compact: true });
        });
        it('renders similar output for containerless element', function () {
            let El = class El {
            };
            __decorate([
                bindable,
                __metadata("design:type", Object)
            ], El.prototype, "v", void 0);
            El = __decorate([
                customElement({
                    name: 'my-el',
                    template: '<p>hey ${v}</p>',
                    containerless: true,
                })
            ], El);
            const { assertHtml } = createFixture(`<div id=d1>
          <au-compose component.bind="el" style="width: 20%;" v="aurelia"></au-compose>
        </div>
        <div id=d2>
          <my-el style="width: 20%;" v="aurelia"></my-el>
        </div>
        <div id=d3>
          <au-compose component="my-el" style="width: 20%;" v="aurelia"></au-compose>
        </div>
        `, class {
                constructor() {
                    this.el = El;
                }
            }, [El]);
            assertHtml('#d1', '<p>hey aurelia</p>', { compact: true });
            assertHtml('#d2', '<p>hey aurelia</p>', { compact: true });
            assertHtml('#d3', '<p>hey aurelia</p>', { compact: true });
        });
    });
});
//# sourceMappingURL=au-compose.spec.js.map