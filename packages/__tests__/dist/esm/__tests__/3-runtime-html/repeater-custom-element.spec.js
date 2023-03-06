var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BindingBehavior, customElement, bindable, CustomElement, Aurelia, IPlatform, } from '@aurelia/runtime-html';
import { assert, getVisibleText, TestContext, } from '@aurelia/testing';
import { createSpecFunction, } from '../util.js';
describe('3-runtime-html/repeater-custom-element.spec.ts', function () {
    var Bar_1;
    async function testRepeatForCustomElement(testFunction, { template, registrations = [], app, }) {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        ctx.doc.body.appendChild(host);
        const container = ctx.container;
        const au = new Aurelia(container);
        await au.register(...registrations, BindingBehavior.define('keyed', class NoopKeyedBindingBehavior {
        }))
            .app({
            host,
            component: CustomElement.define({ name: 'app', isStrictBinding: true, template }, app ?? class {
            })
        })
            .start();
        const component = au.root.controller.viewModel;
        await testFunction({ app: component, container, ctx, host, platform: container.get(IPlatform) });
        await au.stop();
        assert.strictEqual(host.textContent, '', `host.textContent`);
        ctx.doc.body.removeChild(host);
    }
    const $it = createSpecFunction(testRepeatForCustomElement);
    // repeater with custom element
    {
        let Foo = class Foo {
        };
        Foo = __decorate([
            customElement({ name: 'foo', template: 'a' })
        ], Foo);
        class App {
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count"></foo>`,
        };
        $it('static child content', async function ({ app, platform, host }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            const q = platform.domWriteQueue;
            await q.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], Foo.prototype, "prop", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '${prop}' })
        ], Foo);
        class App {
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<template>
          <template repeat.for="i of 3">
            <foo prop.bind="i"></foo>
          </template>
        </template>`,
        };
        $it('dynamic child content', async function ({ platform, host }) {
            const q = platform.domWriteQueue;
            await q.yield();
            assert.html.innerEqual(host, '<foo class="au">0</foo> <foo class="au">1</foo> <foo class="au">2</foo>', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], Foo.prototype, "prop", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '${prop}' })
        ], Foo);
        class App {
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<let items.bind="[{p: 1}, {p: 2}, {p: 3}]"></let>` +
                `<template repeat.for="item of items">
          <foo prop.bind="item.p"></foo>
        </template>`,
        };
        $it('let integration', async function ({ platform, host }) {
            const q = platform.domWriteQueue;
            await q.yield();
            assert.html.innerEqual(host, '<foo class="au">1</foo> <foo class="au">2</foo> <foo class="au">3</foo>', `host.textContent`);
        }, setup);
    }
    {
        let Bar = Bar_1 = class Bar {
            constructor() {
                this.id = Bar_1.id++;
            }
        };
        Bar.id = 1;
        __decorate([
            bindable,
            __metadata("design:type", Number)
        ], Bar.prototype, "id", void 0);
        Bar = Bar_1 = __decorate([
            customElement({ name: 'bar', template: 'bar' })
        ], Bar);
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], Foo.prototype, "prop", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '${prop}' })
        ], Foo);
        class App {
        }
        const setup = {
            app: App,
            registrations: [Bar, Foo],
            template: `<template>
          <template repeat.for="i of 2">
            <let id.bind="null"></let>
            <bar id.from-view="id"></bar>
            <foo prop.bind="id"></foo>
          </template>
        </template>`,
        };
        $it('from-view integration', async function ({ platform, host }) {
            const q = platform.domWriteQueue;
            await q.yield();
            assert.html.innerEqual(host, '<bar class="au">bar</bar> <foo class="au">1</foo> <bar class="au">bar</bar> <foo class="au">2</foo>', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.theText = 'b';
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo text.bind="theText" repeat.for="i of count"></foo>`,
        };
        $it('repeater with custom element + inner bindable with different name than outer property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.theText = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.text = 'b';
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo text.bind="text" repeat.for="i of count"></foo>`,
        };
        $it('repeater with custom element + inner bindable with same name as outer property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.text = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count" text.bind="theText"></foo>`,
        };
        $it('repeater with custom element + inner bindable with different name than outer property, reversed - uninitialized property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.theText = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count" text.bind="text"></foo>`,
        };
        $it('repeater with custom element + inner bindable with same name as outer property, reversed - uninitialized property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.text = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.theText = 'a';
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count" text.bind="theText"></foo>`,
        };
        $it('repeater with custom element + inner bindable with different name than outer property, reversed - initialized property', async function ({ platform, host }) {
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.theText = 'a';
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count" text.bind="theText"></foo>`,
        };
        $it('repeater with custom element + inner bindable with same name as outer property, reversed - initialized property', async function ({ platform, host }) {
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Array)
        ], Foo.prototype, "todos", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div repeat.for="item of todos">${item}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.todos = ['a', 'b', 'c'];
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count" todos.bind="todos"></foo>`,
        };
        $it('repeater with custom element with repeater', async function ({ platform, host, app }) {
            const q = platform.domWriteQueue;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabc', `host.textContent`);
            app.count = 1;
            await q.yield();
            assert.strictEqual(host.textContent, 'abc', `host.textContent`);
            app.count = 3;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabc', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Array)
        ], Foo.prototype, "todos", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div repeat.for="innerTodos of todos"><div repeat.for="item of innerTodos">${item}</div></div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.todos = [['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'b', 'c']];
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count" todos.bind="todos"></foo>`,
        };
        $it('repeater with custom element with repeater, nested arrays', async function ({ platform, host, app }) {
            const q = platform.domWriteQueue;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabcabcabcabcabcabcabc', `host.textContent`);
            app.count = 1;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabc', `host.textContent`);
            app.count = 3;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabcabcabcabcabcabcabc', `host.textContent`);
        }, setup);
    }
    {
        let childrenCount = 0;
        let FooEl = class FooEl {
            attached() {
                childrenCount += this.$controller.children.length;
            }
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "cnt", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "max", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "cur", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "txt", void 0);
        FooEl = __decorate([
            customElement({
                name: 'foo-el',
                template: `\${txt}<foo-el if.bind="cur<max" cnt.bind="cnt" max.bind="max" cur.bind="cur+1" txt.bind="txt" repeat.for="i of cnt"></foo-el>`,
                shadowOptions: { mode: 'open' }
            })
        ], FooEl);
        let App = class App {
            constructor() {
                this.cnt = 10;
                this.max = 3;
                this.txt = 'a';
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                shadowOptions: { mode: 'open' }
            })
        ], App);
        const setup = {
            app: App,
            registrations: [FooEl],
            template: `<foo-el cnt.bind="cnt" max.bind="max" cur="0" txt.bind="txt" repeat.for="i of cnt" ref.bind="'foo'+i"></foo-el>`,
        };
        $it('repeater with custom element and children observer', async function ({ host, app }) {
            const content = getVisibleText(host, true);
            let expectedCount = 10 + 10 ** 2 + 10 ** 3;
            assert.strictEqual(content.length, expectedCount, `getVisibleText(au, host).length`);
            assert.strictEqual(content, 'a'.repeat(expectedCount), `getVisibleText(au, host)`);
            assert.strictEqual(childrenCount, expectedCount, `childrenCount #1`);
            assert.strictEqual(app.$controller.children.length, 1, `app['$children'].length #1`);
            app.cnt = 11;
            await Promise.resolve();
            // TODO: find out why this shadow dom mutation observer thing doesn't work correctly in jsdom
            if (typeof window !== 'undefined') {
                expectedCount = 11 + 11 ** 2 + 11 ** 3;
                assert.strictEqual(app.$controller.children.length, 1, `app['$children'].length #2`);
                assert.strictEqual(childrenCount, expectedCount, `childrenCount #2`);
            }
        }, setup);
    }
    {
        let childrenCount = 0;
        let FooEl = class FooEl {
            attached() {
                childrenCount += this.$controller.children.length;
            }
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "cnt", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "max", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "cur", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "txt", void 0);
        FooEl = __decorate([
            customElement({
                name: 'foo-el',
                template: `\${txt}<foo-el if.bind="cur<max" cnt.bind="cnt" max.bind="max" cur.bind="cur+1" txt.bind="txt" repeat.for="i of cnt;key:n"></foo-el>`,
                shadowOptions: { mode: 'open' }
            })
        ], FooEl);
        let App = class App {
            constructor() {
                this.cnt = Array(10).fill(null).map((v, i) => ({ n: i }));
                this.max = 3;
                this.txt = 'a';
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                shadowOptions: { mode: 'open' }
            })
        ], App);
        const setup = {
            app: App,
            registrations: [FooEl],
            template: `<foo-el cnt.bind="cnt" max.bind="max" cur="0" txt.bind="txt" repeat.for="i of cnt;key:n" ref.bind="'foo'+i.n"></foo-el>`,
        };
        $it('repeater with custom element and children observer', async function ({ host, app }) {
            const content = getVisibleText(host, true);
            let expectedCount = 10 + 10 ** 2 + 10 ** 3;
            assert.strictEqual(content.length, expectedCount, `getVisibleText(au, host).length`);
            assert.strictEqual(content, 'a'.repeat(expectedCount), `getVisibleText(au, host)`);
            assert.strictEqual(childrenCount, expectedCount, `childrenCount #1`);
            assert.strictEqual(app.$controller.children.length, 1, `app['$children'].length #1`);
            app.cnt = Array(11).fill(null).map((v, i) => ({ n: i }));
            await Promise.resolve();
            // TODO: find out why this shadow dom mutation observer thing doesn't work correctly in jsdom
            if (typeof window !== 'undefined') {
                expectedCount = 11 + 11 ** 2 + 11 ** 3;
                assert.strictEqual(app.$controller.children.length, 1, `app['$children'].length #2`);
                assert.strictEqual(childrenCount, expectedCount, `childrenCount #2`);
            }
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        Foo = __decorate([
            customElement({ name: 'foo', template: 'a', instructions: [] })
        ], Foo);
        class App {
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count & keyed"></foo>`,
        };
        $it('repeater with custom element', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.theText = 'b';
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo text.bind="theText" repeat.for="i of count & keyed"></foo>`,
        };
        $it('repeater with custom element + inner bindable with different name than outer property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.theText = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.text = 'b';
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo text.bind="text" repeat.for="i of count & keyed"></foo>`,
        };
        $it('repeater with custom element + inner bindable with same name as outer property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.text = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.theText = 'b';
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count & keyed" text.bind="theText"></foo>`,
        };
        $it('repeater with custom element + inner bindable with different name than outer property, reversed, uninitialized property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.theText = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.text = 'b';
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count & keyed" text.bind="text"></foo>`,
        };
        $it('repeater with custom element + inner bindable with same name as outer property, reversed, uninitialized property', async function ({ platform, host, app }) {
            assert.strictEqual(host.textContent, '', `host.textContent`);
            app.count = 3;
            app.text = 'a';
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.theText = 'a';
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count & keyed" text.bind="theText"></foo>`,
        };
        $it('repeater with custom element + inner bindable with different name than outer property, reversed', async function ({ platform, host }) {
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], Foo.prototype, "text", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div>${text}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.theText = 'a';
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count & keyed" text.bind="theText"></foo>`,
        };
        $it('repeater with custom element + inner bindable with same name as outer property, reversed', async function ({ platform, host }) {
            await platform.domWriteQueue.yield();
            assert.strictEqual(host.textContent, 'aaa', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Array)
        ], Foo.prototype, "todos", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div repeat.for="item of todos & keyed">${item}</div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.todos = ['a', 'b', 'c'];
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count & keyed" todos.bind="todos"></foo>`,
        };
        $it('repeater with custom element with repeater', async function ({ platform, host, app }) {
            const q = platform.domWriteQueue;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabc', `host.textContent`);
            app.count = 1;
            await q.yield();
            assert.strictEqual(host.textContent, 'abc', `host.textContent`);
            app.count = 3;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabc', `host.textContent`);
        }, setup);
    }
    {
        let Foo = class Foo {
        };
        __decorate([
            bindable,
            __metadata("design:type", Array)
        ], Foo.prototype, "todos", void 0);
        Foo = __decorate([
            customElement({ name: 'foo', template: '<div repeat.for="innerTodos of todos & keyed"><div repeat.for="item of innerTodos & keyed">${item}</div></div>', instructions: [] })
        ], Foo);
        class App {
            constructor() {
                this.todos = [['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'b', 'c']];
                this.count = 3;
            }
        }
        const setup = {
            app: App,
            registrations: [Foo],
            template: `<foo repeat.for="i of count & keyed" todos.bind="todos"></foo>`,
        };
        $it('repeater with custom element with repeater, nested arrays', async function ({ platform, host, app }) {
            const q = platform.domWriteQueue;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabcabcabcabcabcabcabc', `host.textContent`);
            app.count = 1;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabc', `host.textContent`);
            app.count = 3;
            await q.yield();
            assert.strictEqual(host.textContent, 'abcabcabcabcabcabcabcabcabc', `host.textContent`);
        }, setup);
    }
    // TODO: figure out why repeater in keyed mode gives different numbers
    {
        let childrenCount = 0;
        let FooEl = class FooEl {
            attached() {
                childrenCount += this.$controller.children.length;
            }
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "cnt", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "max", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "cur", void 0);
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], FooEl.prototype, "txt", void 0);
        FooEl = __decorate([
            customElement({
                name: 'foo-el',
                template: `\${txt}<foo-el if.bind="cur<max" cnt.bind="cnt" max.bind="max" cur.bind="cur+1" txt.bind="txt" repeat.for="i of cnt"></foo-el>`,
                shadowOptions: { mode: 'open' }
            })
        ], FooEl);
        let App = class App {
            constructor() {
                this.cnt = 10;
                this.max = 3;
                this.txt = 'a';
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                shadowOptions: { mode: 'open' }
            })
        ], App);
        const setup = {
            app: App,
            registrations: [FooEl],
            template: `<foo-el cnt.bind="cnt" max.bind="max" cur="0" txt.bind="txt" repeat.for="i of cnt" ref.bind="'foo'+i"></foo-el>`,
        };
        $it('repeater with custom element and children observer', async function ({ host, app }) {
            const content = getVisibleText(host, true);
            let expectedCount = 10 + 10 ** 2 + 10 ** 3;
            assert.strictEqual(content.length, expectedCount, `getVisibleText(au, host).length`);
            assert.strictEqual(content, 'a'.repeat(expectedCount), `getVisibleText(au, host)`);
            assert.strictEqual(childrenCount, expectedCount, `childrenCount - #1`);
            assert.strictEqual(app.$controller.children.length, 1, `app['$children'].length - #1`);
            app['cnt'] = 11;
            await Promise.resolve();
            // TODO: find out why this shadow dom mutation observer thing doesn't work correctly in jsdom
            if (typeof window !== 'undefined') {
                expectedCount = 11 + 11 ** 2 + 11 ** 3;
                assert.strictEqual(app.$controller.children.length, 1, `app['$children'].length - #2`);
                assert.strictEqual(childrenCount, expectedCount, `childrenCount - #2`);
            }
        }, setup);
    }
});
//# sourceMappingURL=repeater-custom-element.spec.js.map