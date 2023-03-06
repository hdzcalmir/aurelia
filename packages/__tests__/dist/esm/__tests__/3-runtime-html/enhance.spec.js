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
// This is to test for some intrinsic properties of enhance which is otherwise difficult to test in Data-driven tests parallel to `.app`
import { BrowserPlatform } from '@aurelia/platform-browser';
import { DI, IContainer, Registration } from '@aurelia/kernel';
import { CustomElement, IPlatform, Aurelia, customElement, bindable, StandardConfiguration, IAurelia, ValueConverter, } from '@aurelia/runtime-html';
import { assert, TestContext, createFixture } from '@aurelia/testing';
import { createSpecFunction } from '../util.js';
import { delegateSyntax } from '@aurelia/compat-v1';
describe('3-runtime-html/enhance.spec.ts', function () {
    class EnhanceTestExecutionContext {
        constructor(ctx, container, host, app, childNode) {
            this.ctx = ctx;
            this.container = container;
            this.host = host;
            this.app = app;
            this.childNode = childNode;
        }
        get platform() { return this._scheduler ?? (this._scheduler = this.container.get(IPlatform)); }
    }
    async function testEnhance(testFunction, { getComponent, template, childIndex, beforeHydration } = {}) {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        host.innerHTML = template;
        ctx.doc.body.appendChild(host);
        const child = childIndex !== void 0
            ? host.childNodes.item(childIndex)
            : null;
        if (typeof beforeHydration === 'function') {
            beforeHydration(host, child);
        }
        const container = ctx.container;
        const au = new Aurelia(container);
        const controller = await au.enhance({ host, component: getComponent() });
        const app = controller.scope.bindingContext;
        await testFunction(new EnhanceTestExecutionContext(ctx, container, host, app, child));
        await au.stop();
        await controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
        ctx.doc.body.removeChild(host);
        au.dispose();
    }
    const $it = createSpecFunction(testEnhance);
    class App1 {
        constructor() {
            this.foo = 'Bar';
        }
    }
    for (const { text, getComponent } of [
        { text: 'class', getComponent: () => CustomElement.define("app", App1) },
        { text: 'instance', getComponent: () => new App1() },
        { text: 'raw object', getComponent: () => ({ foo: 'Bar' }) },
    ]) {
        $it(`hydrates the root - ${text}`, function ({ host }) {
            assert.html.textContent('span', 'Bar', 'span.text', host);
        }, { getComponent, template: `<span>\${foo}</span>` });
        let handled = false;
        $it(`preserves the element reference - ${text}`, function ({ host, platform }) {
            handled = false;
            host.querySelector('span').click();
            platform.domReadQueue.flush();
            assert.equal(handled, true);
        }, {
            getComponent,
            template: `<span>\${foo}</span>`,
            childIndex: 0,
            beforeHydration(host, child) {
                child.addEventListener('click', function () { handled = true; });
            }
        });
    }
    for (const initialMethod of ['app', 'enhance']) {
        it(`can be applied on an unhydrated inner node after initial hydration - ${initialMethod} - new container`, async function () {
            const message = "Awesome Possum";
            const template = `
    <button click.delegate="enhance()"></button>
    <div ref="r1" innerhtml.bind="'<div>\${message}</div>'"></div>
    <div ref="r2" innerhtml.bind="'<div>\${message}</div>'"></div>
    `;
            let App2 = class App2 {
                constructor(container) {
                    this.container = container;
                }
                async attaching() {
                    await this.enhance(this.r1);
                }
                async enhance(host = this.r2) {
                    await new Aurelia(TestContext.create().container)
                        .enhance({ host: host.querySelector('div'), component: { message } });
                }
            };
            App2 = __decorate([
                __param(0, IContainer),
                __metadata("design:paramtypes", [Object])
            ], App2);
            const ctx = TestContext.create();
            const host = ctx.doc.createElement('div');
            ctx.doc.body.appendChild(host);
            const container = ctx.container;
            const au = new Aurelia(container);
            container.register(delegateSyntax);
            let component;
            let dispose;
            if (initialMethod === 'app') {
                component = CustomElement.define({ name: 'app', template }, App2);
                await au.app({ host, component }).start();
            }
            else {
                host.innerHTML = template;
                component = CustomElement.define('app', App2);
                const controller = await au.enhance({ host, component });
                dispose = () => controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
            }
            assert.html.textContent('div', message, 'div', host);
            host.querySelector('button').click();
            ctx.platform.domReadQueue.flush();
            assert.html.textContent('div:nth-of-type(2)', message, 'div:nth-of-type(2)', host);
            await au.stop();
            await dispose?.();
            ctx.doc.body.removeChild(host);
            au.dispose();
        });
    }
    it(`respects the hooks in raw object component`, async function () {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        host.innerHTML = '<span></span>';
        ctx.doc.body.appendChild(host);
        const component = {
            eventLog: [],
            define() { this.eventLog.push('define'); },
            hydrating() { this.eventLog.push('hydrating'); },
            hydrated() { this.eventLog.push('hydrated'); },
            created() { this.eventLog.push('created'); },
            binding() { this.eventLog.push('binding'); },
            bound() { this.eventLog.push('bound'); },
            attaching() { this.eventLog.push('attaching'); },
            attached() { this.eventLog.push('attached'); },
        };
        const container = ctx.container;
        const au = new Aurelia(container);
        const controller = await au.enhance({ host, component });
        await au.stop();
        await controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
        ctx.doc.body.removeChild(host);
        assert.deepStrictEqual(component.eventLog, [
            'define',
            'hydrating',
            'hydrated',
            'created',
            'binding',
            'bound',
            'attaching',
            'attached',
        ]);
        au.dispose();
    });
    it(`enhance works on detached node`, async function () {
        let MyElement = class MyElement {
        };
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], MyElement.prototype, "value", void 0);
        MyElement = __decorate([
            customElement({ name: 'my-element', template: '<span>${value}</span>' })
        ], MyElement);
        let App = class App {
            async bound() {
                const _host = this.enhancedHost = new ctx.DOMParser().parseFromString('<div><my-element value.bind="42.toString()"></my-element></div>', 'text/html').body.firstElementChild;
                // this.container.appendChild(this.enhancedHost);
                const _au = new Aurelia(DI.createContainer()
                    .register(Registration.instance(IPlatform, BrowserPlatform.getOrCreate(globalThis)), StandardConfiguration));
                this.enhanceView = await _au
                    .register(MyElement) // in real app, there should be more
                    .enhance({ host: _host, component: CustomElement.define({ name: 'enhance' }, class EnhanceRoot {
                    }) });
                assert.html.innerEqual(_host, '<my-element class="au"><span>42</span></my-element>', 'enhanced.innerHtml');
                assert.html.innerEqual(this.container, '', 'container.innerHtml - before attach');
            }
            attaching() {
                this.container.appendChild(this.enhancedHost);
            }
            // The inverse order of the stop and detaching is intentional
            async detaching() {
                await this.enhanceView.deactivate(this.enhanceView, null, 0 /* LifecycleFlags.none */);
                assert.html.innerEqual(this.enhancedHost, '<my-element class="au"></my-element>', 'enhanced.innerHtml');
                assert.html.innerEqual(this.container, '<div><my-element class="au"></my-element></div>', 'enhanced.innerHtml');
            }
            unbinding() {
                this.enhancedHost.remove();
            }
        };
        App = __decorate([
            customElement({
                name: 'app',
                isStrictBinding: true,
                template: '<div ref="container" id="container"></div>'
            })
        ], App);
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        ctx.doc.body.appendChild(host);
        const container = ctx.container;
        const au = new Aurelia(container);
        await au
            .app({ host, component: App })
            .start();
        assert.html.innerEqual(host.querySelector('#container'), '<div><my-element class="au"><span>42</span></my-element></div>', 'container.innerHTML - after attach');
        await au.stop();
        assert.html.innerEqual(host, '', 'post-stop host.innerHTML');
        ctx.doc.body.removeChild(host);
        au.dispose();
    });
    it('can re-activate an enhancement result', async function () {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        const container = ctx.container;
        const au = new Aurelia(container);
        host.innerHTML = `<div repeat.for="i of 3">\${i}</div>`;
        const controller = await au.enhance({ host, component: { message: 'hello world' } });
        assert.html.textContent(host, '012');
        assert.strictEqual(host.querySelectorAll('div').length, 3);
        await controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
        assert.html.textContent(host, '');
        await controller.activate(controller, null, 0 /* LifecycleFlags.none */);
        assert.html.textContent(host, '012');
        assert.strictEqual(host.querySelectorAll('div').length, 3);
    });
    it('can connect with parent controller if any', async function () {
        var _a;
        let parentController;
        const { appHost, component, start, tearDown } = createFixture('<my-el html.bind="html" controller.ref="myElController">', class App {
            constructor() {
                this.html = `<div>\${message}</div>`;
            }
        }, [
            CustomElement.define({
                name: 'my-el',
                template: '<div innerhtml.bind="html" ref="div">',
                bindables: ['html']
            }, (_a = class MyEl {
                    constructor(au$) {
                        this.au$ = au$;
                    }
                    async attaching() {
                        this.div.removeAttribute('class');
                        this.enhancedView = await this.au$.enhance({
                            host: this.div,
                            component: {
                                message: 'Hello _div_',
                                attaching(_, parent) {
                                    parentController = parent;
                                }
                            }
                        }, this.$controller);
                    }
                    detaching() {
                        void this.enhancedView.deactivate(this.enhancedView, null, 0 /* LifecycleFlags.none */);
                        parentController = void 0;
                    }
                },
                _a.inject = [IAurelia],
                _a)),
        ], false);
        await start();
        assert.notStrictEqual(parentController, void 0);
        assert.strictEqual(component.myElController === parentController, true);
        assert.html.innerEqual(appHost, '<my-el class="au"><div><div>Hello _div_</div></div></my-el>');
        await tearDown();
        assert.strictEqual(parentController, void 0);
        assert.strictEqual(component.myElController, null);
        assert.html.innerEqual(appHost, '');
    });
    it('uses resources in existing root container', async function () {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        const container = ctx.container.register(ValueConverter.define('x2', class X2 {
            toView(val) {
                return Number(val) * 2;
            }
        }));
        const au = new Aurelia(container);
        host.innerHTML = '<div data-id.bind="1 | x2 | plus10"></div>';
        const controller = await au.enhance({
            host,
            component: {},
            container: container.createChild().register(ValueConverter.define('plus10', class Plus10 {
                toView(val) {
                    return Number(val) + 10;
                }
            }))
        });
        assert.strictEqual(host.innerHTML, '<div class="au" data-id="12"></div>');
        await controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
    });
    it('uses resources given in the container', async function () {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        const container = ctx.container;
        const au = new Aurelia(container);
        const I = DI.createInterface('I');
        host.innerHTML = '<div data-id.bind="i | plus10"></div>';
        const controller = await au.enhance({
            host,
            component: { i: 1 },
            container: container.createChild().register(ValueConverter.define('plus10', class Plus10 {
                toView(v) {
                    return Number(v) + 10;
                }
            }))
        });
        assert.strictEqual(host.innerHTML, '<div class="au" data-id="11"></div>');
        assert.strictEqual(container.find(ValueConverter, 'plus10'), null, 'It should register resources with child contaienr only.');
        await controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
    });
    it('throws on template with a predefined "au"', async function () {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        const container = ctx.container;
        const au = new Aurelia(container);
        host.innerHTML = '<div class="au"></div>';
        let ex;
        try {
            await au.enhance({ host, component: { id: 1 } });
        }
        catch (e) {
            ex = e;
        }
        assert.instanceOf(ex, Error);
        assert.strictEqual(host.innerHTML, '<div class="au"></div>');
    });
    it('throws on re-enhancement of a node that has an element with class="au"', async function () {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        const container = ctx.container;
        const au = new Aurelia(container);
        host.innerHTML = `<div><div repeat.for="i of 3" data-id.bind="i">\${i}</div></div>`;
        const controller = await au.enhance({ host, component: { id: 1 } });
        assert.html.textContent(host, '012');
        assert.throws(() => au.enhance({ host, component: {} }));
        await controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
    });
    it('does not throw on enhancement that did not result in "au" class', async function () {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        const container = ctx.container;
        const au = new Aurelia(container);
        host.innerHTML = `<div><div repeat.for="i of 3">\${i}</div></div>`;
        const controller = await au.enhance({ host, component: { id: 1 } });
        assert.html.textContent(host, '012');
        const controller2 = await au.enhance({ host, component: {} });
        await controller2.deactivate(controller2, null, 0 /* LifecycleFlags.none */);
        await controller.deactivate(controller, null, 0 /* LifecycleFlags.none */);
    });
});
//# sourceMappingURL=enhance.spec.js.map