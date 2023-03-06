var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CustomElement, customElement, INode, IRenderLocation, } from '@aurelia/runtime-html';
import { assert, createFixture, } from '@aurelia/testing';
describe('3-runtime-html/au-compose.spec.ts', function () {
    describe('view', function () {
        it('works with literal string', async function () {
            const { appHost, startPromise, tearDown } = createFixture('<au-compose view="<div>hello world</div>">');
            await startPromise;
            assert.strictEqual(appHost.textContent, 'hello world');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        // this test is a different with the rest, where the view is being recreated
        // and the composition happens again.
        // Instead of the bindings getting notified by the changes in the view model
        it('works with dynamic view + interpolation', async function () {
            const { ctx, component, appHost, startPromise, tearDown } = createFixture(`<au-compose view="<div>\${message}</div>">`, class App {
                constructor() {
                    this.message = 'hello world';
                }
            });
            await startPromise;
            assert.strictEqual(appHost.textContent, 'hello world');
            component.message = 'hello';
            const auComponentVm = CustomElement.for(appHost.querySelector('au-compose')).viewModel;
            assert.strictEqual(auComponentVm.view, '<div>hello</div>');
            assert.strictEqual(appHost.textContent, 'hello');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, 'hello');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('works with view string from view model', async function () {
            const { ctx, component, appHost, startPromise, tearDown } = createFixture('<au-compose view.bind="view">', class App {
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
            const { ctx, component, appHost, startPromise, tearDown } = createFixture('<au-compose view.bind="view" scope-behavior="scoped">', class App {
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
            const auComponentVm = CustomElement.for(appHost.querySelector('au-compose')).viewModel;
            auComponentVm.composition.controller.scope.bindingContext['message'] = 'hello';
            assert.strictEqual(appHost.textContent, '');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, 'hello');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('understands view promise', async function () {
            const { ctx, component, appHost, startPromise, tearDown } = createFixture('<au-compose view.bind="getView()" scope-behavior="scoped">', class App {
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
            const auComponentVm = CustomElement.for(appHost.querySelector('au-compose')).viewModel;
            auComponentVm.composition.controller.scope.bindingContext['message'] = 'hello';
            assert.strictEqual(appHost.textContent, '');
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.textContent, 'hello');
            await tearDown();
            assert.strictEqual(appHost.textContent, '');
        });
        it('throws on invalid scope-behavior value', async function () {
            const { component, startPromise, tearDown } = createFixture('<au-compose view.bind="view" scope-behavior.bind="behavior">', class App {
                constructor() {
                    this.message = 'hello world';
                    this.view = `<div>\${message}</div>`;
                    this.behavior = "auto";
                }
            });
            await startPromise;
            assert.throws(() => component.behavior = 'scope', 'Invalid scope behavior');
            await tearDown();
        });
    });
    describe('view-model', function () {
        it('works with literal object', async function () {
            const { appHost, tearDown } = createFixture(`\${message}<au-compose view-model.bind="{ activate }">`, class App {
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
            const { appHost, tearDown } = createFixture('<au-compose view-model.bind="fieldVm">', class App {
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
            const { appHost, tearDown } = await createFixture('<au-compose view-model.bind="getVm()">', class App {
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
        it('passes model to activate method', async function () {
            const models = [];
            const model = { a: 1, b: Symbol() };
            createFixture(`<au-compose view-model.bind="{ activate }" model.bind="model">`, class App {
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
            const { startPromise, tearDown } = createFixture(`<au-compose view-model.bind="{ activate }" view.bind="view">`, class App {
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
            await tearDown();
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
            const { ctx, component } = createFixture(`<au-compose view-model.bind="vm" model.bind="model">`, class App {
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
            const { appHost } = createFixture(`<au-compose repeat.for="i of 5" view.bind="getView()">`, class App {
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
            createFixture(`<au-compose repeat.for="i of 5" view-model.bind="{ activate }" model.bind="{ index: i }">`, class App {
                constructor() {
                    this.activate = (model) => {
                        models.push(model);
                    };
                }
            });
            assert.deepStrictEqual(models, Array.from({ length: 5 }, (_, index) => ({ index })));
        });
        it('deactivates when collection changes', async function () {
            const { component, appHost } = createFixture(`<au-compose repeat.for="i of items" view.bind="getView()">`, class App {
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
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose repeat.for="i of 5" view.bind="getView()">`, class App {
                getMessage(i) {
                    return `Hello ${i}`;
                }
                getView() {
                    return `<au-compose view.bind="getInnerView()">`;
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
        it('injects newly created host when composing custom element', async function () {
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
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = El;
                }
            });
            await startPromise;
            assert.visibleTextEqual(appHost, 'Hello world from El');
            assert.html.innerEqual(appHost, '<el><div>Hello world from El</div></el>');
            const el = CustomElement.for(appHost.querySelector('el'), { name: 'el' }).viewModel;
            assert.strictEqual(el.node, appHost.querySelector('el'));
            await tearDown();
        });
        it('injects newly created host when composing different custom element', async function () {
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
            const { ctx, appHost, component, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = Child;
                }
            });
            await startPromise;
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
            await tearDown();
        });
        it('injects <au-compose/> element itself when composing POJO classes', async function () {
            let node;
            class El {
                constructor(el) {
                    this.el = el;
                    node = el;
                }
            }
            El.inject = [INode];
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" view="<div>Hello</div>" model.bind="{ index: 0 }">`, class App {
                constructor() {
                    this.El = El;
                }
            });
            await startPromise;
            assert.visibleTextEqual(appHost, 'Hello');
            assert.html.innerEqual(appHost, '<au-compose class="au"><div>Hello</div></au-compose>');
            assert.strictEqual(node, appHost.querySelector('au-compose'));
            await tearDown();
        });
        it('injects render location when composing POJO classes with <au-compose containerless/>', async function () {
            let loc;
            class El {
                constructor(l) {
                    loc = l;
                }
            }
            El.inject = [IRenderLocation];
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" view="<div>Hello</div>" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = El;
                }
            });
            await startPromise;
            assert.visibleTextEqual(appHost, 'Hello');
            assert.html.innerEqual(appHost, '<div>Hello</div>');
            assert.strictEqual(loc, appHost.lastChild);
            assert.strictEqual(appHost.innerHTML, '<!--au-start--><div>Hello</div><!--au-end-->');
            await tearDown();
        });
    });
    describe('containerless on usage: <au-compose containerless />', function () {
        it('works with containerless on the host element', async function () {
            const models = [];
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="{ activate }" view="<div>Hello world</div>" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.activate = (model) => {
                        models.push(model);
                    };
                }
            });
            await startPromise;
            assert.deepStrictEqual(models, [{ index: 0 }]);
            assert.visibleTextEqual(appHost, 'Hello world');
            assert.html.innerEqual(appHost, '<div>Hello world</div>');
            await tearDown();
        });
        it('composes non-custom element mutiple times', async function () {
            const models = [];
            const { appHost, component, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="{ activate }" view.bind="view" model.bind="{ index: 0 }" containerless>`, class App {
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
            const { appHost, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
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
            const { appHost, ctx, component, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
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
        it('-> composes containerless custom element', async function () {
            let El = class El {
            };
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<div>Hello world from El</div>',
                    containerless: true,
                })
            ], El);
            const { appHost, start } = createFixture(`<au-compose view-model.bind="El" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = El;
                }
            }, [], false);
            let ex;
            try {
                await start();
            }
            catch (e) {
                ex = e;
            }
            assert.instanceOf(ex, Error);
            // assert.includes(String(ex), 'Containerless custom element is not supported by <au-compose/>');
            assert.includes(String(ex), 'AUR0806');
            appHost.remove();
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
            const { appHost, ctx, component, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" view.bind="view" model.bind="{ index: 0 }" containerless>`, class App {
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
        it('discards stale composition', async function () {
            const { appHost, ctx, component, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="El" view.bind="\`<div>$\\{text}</div>\`" model.bind="{ index: 0 }" containerless>`, class App {
                constructor() {
                    this.El = { text: 'Hello' };
                }
            });
            await startPromise;
            assert.visibleTextEqual(appHost, 'Hello');
            assert.html.innerEqual(appHost, '<div>Hello</div>');
            component.El = { text: 'Hello 22' };
            component.El = { text: 'Hello 33' };
            ctx.platform.domWriteQueue.flush();
            assert.visibleTextEqual(appHost, 'Hello 33');
            assert.html.innerEqual(appHost, '<div>Hello 33</div>');
            await tearDown();
        });
    });
    describe('multi updates + <Promise>', function () {
        it('works with [multiple successive updates] + [activate<Promise>]', async function () {
            const baseTimeout = 75;
            let timeout = baseTimeout;
            const { appHost, component, startPromise, tearDown } = createFixture(`\${message}<au-compose view-model.bind="{ activate, value: i }" view.bind="view" view-model.ref="auCompose" containerless>`, class App {
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
            const auCompose = component.auCompose;
            await auCompose.pending;
            assert.strictEqual(appHost.textContent, `hello world38`);
            assert.html.innerEqual(appHost, 'hello world<div>38</div>');
            await tearDown();
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
        const { appHost, component, startPromise, tearDown } = createFixture(`\${message}<au-compose view-model.bind="vm" model.bind="message" view-model.ref="auCompose" containerless>`, class App {
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
        const auCompose = component.auCompose;
        await auCompose.pending;
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
        const { appHost, component, startPromise, tearDown } = createFixture(`\${message}<au-compose view-model.bind="vm" model.bind="message" view-model.ref="auCompose" containerless>`, class App {
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
        const auCompose = component.auCompose;
        await auCompose.pending;
        await tearDown();
        assert.strictEqual(appHost.textContent, '');
    });
    it('works with [au-slot] when composing custom element', async function () {
        const El1 = CustomElement.define({
            name: 'el1',
            template: `<p><au-slot>`
        }, class Element1 {
        });
        const { appHost, startPromise, tearDown } = createFixture(`<au-compose view-model.bind="vm"><input value.bind="message" au-slot>`, class App {
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
        const { appHost, startPromise } = createFixture(`<au-compose repeat.for="i of 3" view-model.bind="vm"><input value.to-view="message + i" au-slot>`, class App {
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
                    return this.host.animate([{ color: 'red' }, { color: 'blue' }], 50).finished;
                }
                async detaching() {
                    return this.host.animate([{ color: 'blue' }, { color: 'green' }], { duration: 50 }).finished;
                }
            });
            const { component, startPromise, tearDown } = createFixture(`<au-compose repeat.for="vm of components" view-model.bind="vm">`, class App {
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
            await tearDown();
        });
    }
});
//# sourceMappingURL=au-compose.spec.js.map