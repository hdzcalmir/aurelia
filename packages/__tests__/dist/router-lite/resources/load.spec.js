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
import { IRouteContext, route } from '@aurelia/router-lite';
import { CustomElement, customElement, ILocation, IPlatform } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
import { start } from '../_shared/create-fixture.js';
describe('router-lite/resources/load.spec.ts', function () {
    function assertAnchors(anchors, expected, message = '', assertActive = true) {
        const len = anchors.length;
        assert.strictEqual(len, expected.length, `${message} length`);
        for (let i = 0; i < len; i++) {
            const anchor = anchors[i];
            const item = expected[i];
            assert.strictEqual(anchor.href.endsWith(item.href), true, `${message} - #${i} href - actual: ${anchor.href} - expected: ${item.href}`);
            if (!assertActive)
                continue;
            assert.strictEqual(anchor.classList.contains('active'), !!item.active, `${message} - #${i} active`);
        }
    }
    it('active status works correctly', async function () {
        let Foo = class Foo {
        };
        Foo = __decorate([
            customElement({ name: 'fo-o', template: '' })
        ], Foo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'foo', path: 'foo/:id', component: Foo }
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
    <a load="route:foo; params.bind:{id: 1}; active.bind:active1" active.class="active1"></a>
    <a load="route:foo/2; active.bind:active2" active.class="active2"></a>
    <au-viewport></au-viewport>`
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Foo] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchors = host.querySelectorAll('a');
        const a1 = { href: 'foo/1', active: false };
        const a2 = { href: 'foo/2', active: false };
        assertAnchors(anchors, [a1, a2], 'round#1');
        anchors[1].click();
        await queue.yield();
        a2.active = true;
        assertAnchors(anchors, [a1, a2], 'round#2');
        anchors[0].click();
        await queue.yield();
        a1.active = true;
        a2.active = false;
        assertAnchors(anchors, [a1, a2], 'round#3');
        await au.stop(true);
    });
    it('adds activeClass when configured', async function () {
        var Foo_1;
        let Foo = Foo_1 = class Foo {
            constructor() {
                this.instanceId = ++Foo_1.instanceId;
            }
            loading(params) {
                this.id = params.id;
            }
        };
        Foo.instanceId = 0;
        Foo = Foo_1 = __decorate([
            customElement({ name: 'fo-o', template: '${instanceId} ${id}' })
        ], Foo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                transitionPlan: 'replace',
                routes: [
                    { id: 'foo', path: 'foo/:id', component: Foo }
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
    <a load="route:foo; params.bind:{id: 1}"></a>
    <a load="route:foo/2"></a>
    <au-viewport></au-viewport>`
            })
        ], Root);
        const activeClass = 'au-rl-active';
        const { au, host, container } = await start({ appRoot: Root, registrations: [Foo], activeClass });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchors = host.querySelectorAll('a');
        const a1 = { href: 'foo/1', active: false };
        const a2 = { href: 'foo/2', active: false };
        assertAnchorsWithClass(anchors, [a1, a2], activeClass, 'round#1');
        anchors[1].click();
        await queue.yield();
        a2.active = true;
        assertAnchorsWithClass(anchors, [a1, a2], activeClass, 'round#2');
        assert.html.textContent(host, '1 2', 'round#2 - text');
        anchors[1].click();
        await queue.yield();
        assertAnchorsWithClass(anchors, [a1, a2], activeClass, 'round#3');
        assert.html.textContent(host, '1 2', 'round#3 - text');
        anchors[0].click();
        await queue.yield();
        a1.active = true;
        a2.active = false;
        assertAnchorsWithClass(anchors, [a1, a2], activeClass, 'round#4');
        assert.html.textContent(host, '2 1', 'round#4 - text');
        anchors[0].click();
        await queue.yield();
        assertAnchorsWithClass(anchors, [a1, a2], activeClass, 'round#5');
        assert.html.textContent(host, '2 1', 'round#5 - text');
        await au.stop(true);
        function assertAnchorsWithClass(anchors, expected, activeClass = null, message = '') {
            const len = anchors.length;
            assert.strictEqual(len, expected.length, `${message} length`);
            for (let i = 0; i < len; i++) {
                const anchor = anchors[i];
                const item = expected[i];
                assert.strictEqual(anchor.href.endsWith(item.href), true, `${message} - #${i} href - actual: ${anchor.href} - expected: ${item.href}`);
                assert.strictEqual(anchor.classList.contains(activeClass), !!item.active, `${message} - #${i} active`);
            }
        }
    });
    it('does not add activeClass when not configured', async function () {
        let Foo = class Foo {
        };
        Foo = __decorate([
            customElement({ name: 'fo-o', template: '' })
        ], Foo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'foo', path: 'foo/:id', component: Foo }
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
    <a load="route:foo; params.bind:{id: 1}"></a>
    <a load="route:foo/2"></a>
    <au-viewport></au-viewport>`
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Foo] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchors = host.querySelectorAll('a');
        const a1 = { href: 'foo/1', active: false };
        const a2 = { href: 'foo/2', active: false };
        assertAnchorsWithoutClass(anchors, [a1, a2], 'round#1');
        anchors[1].click();
        await queue.yield();
        a2.active = true;
        assertAnchorsWithoutClass(anchors, [a1, a2], 'round#2');
        anchors[0].click();
        await queue.yield();
        a1.active = true;
        a2.active = false;
        assertAnchorsWithoutClass(anchors, [a1, a2], 'round#3');
        await au.stop(true);
        function assertAnchorsWithoutClass(anchors, expected, message = '') {
            const len = anchors.length;
            assert.strictEqual(len, expected.length, `${message} length`);
            for (let i = 0; i < len; i++) {
                const anchor = anchors[i];
                const item = expected[i];
                assert.strictEqual(anchor.href.endsWith(item.href), true, `${message} - #${i} href - actual: ${anchor.href} - expected: ${item.href}`);
            }
        }
    });
    it('un-configured parameters are added to the querystring', async function () {
        let Foo = class Foo {
        };
        Foo = __decorate([
            customElement({ name: 'fo-o', template: '' })
        ], Foo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'foo', path: 'foo/:id', component: Foo }
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `<a load="route:foo; params.bind:{id: 3, a: 2};"></a><au-viewport></au-viewport>`
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Foo] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchor = host.querySelector('a');
        assert.match(anchor.href, /foo\/3\?a=2/);
        await au.stop(true);
    });
    it('the most matched path is generated', async function () {
        let Foo = class Foo {
        };
        Foo = __decorate([
            customElement({ name: 'fo-o', template: 'foo' })
        ], Foo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'foo', path: ['foo/:id', 'foo/:id/bar/:a', 'bar/fizz'], component: Foo }
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `<a load="route:foo; params.bind:{id: 3, a: 2};"></a><a load="route:foo; params.bind:{id: 3, b: 2};"></a><a load="bar/fizz"></a><au-viewport></au-viewport>`
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Foo] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchors = Array.from(host.querySelectorAll('a'));
        const hrefs = anchors.map(a => a.href);
        assert.match(hrefs[0], /foo\/3\/bar\/2/);
        assert.match(hrefs[1], /foo\/3\?b=2/); // this one ensures the rejection of non-monotonically increment in the parameter consumption
        assert.match(hrefs[2], /bar\/fizz/);
        anchors[2].click();
        await queue.yield();
        assert.html.textContent(host, 'foo');
        await au.stop(true);
    });
    it('allow navigating to route defined in parent context using ../ prefix', async function () {
        let Product = class Product {
            canLoad(params, _next, _current) {
                this.id = params.id;
                return true;
            }
        };
        Product = __decorate([
            customElement({ name: 'pro-duct', template: `product \${id} <a load="../products"></a>` })
        ], Product);
        let Products = class Products {
        };
        Products = __decorate([
            customElement({ name: 'pro-ducts', template: `<a load="../product/1"></a><a load="../product/2"></a> products` })
        ], Products);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'products', path: ['', 'products'], component: Products },
                    { id: 'product', path: 'product/:id', component: Product },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Products, Product] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'products');
        const anchors = Array.from(host.querySelectorAll('a'));
        const hrefs = anchors.map(a => a.href);
        assert.match(hrefs[0], /product\/1$/);
        assert.match(hrefs[1], /product\/2$/);
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'product 1');
        // go back
        const back = host.querySelector('a');
        assert.match(back.href, /products$/);
        back.click();
        await queue.yield();
        assert.html.textContent(host, 'products');
        // 2nd round
        host.querySelector('a:nth-of-type(2)').click();
        await queue.yield();
        assert.html.textContent(host, 'product 2');
        // go back
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'products');
        await au.stop(true);
    });
    it('allow navigating to route defined in parent context using ../ prefix - with parameters', async function () {
        let Product = class Product {
            canLoad(params, _next, _current) {
                this.id = params.id;
                return true;
            }
        };
        Product = __decorate([
            customElement({ name: 'pro-duct', template: `product \${id} <a load="../products"></a>` })
        ], Product);
        let Products = class Products {
        };
        Products = __decorate([
            customElement({ name: 'pro-ducts', template: `<a load="route:../product; params.bind:{id:'1'}"></a><a load="route:../product; params.bind:{id:'2'}"></a> products` })
        ], Products);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'products', path: ['', 'products'], component: Products },
                    { id: 'product', path: 'product/:id', component: Product },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Products, Product] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'products');
        const anchors = Array.from(host.querySelectorAll('a'));
        const hrefs = anchors.map(a => a.href);
        assert.match(hrefs[0], /product\/1$/);
        assert.match(hrefs[1], /product\/2$/);
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'product 1');
        // go back
        const back = host.querySelector('a');
        assert.match(back.href, /products$/);
        back.click();
        await queue.yield();
        assert.html.textContent(host, 'products');
        // 2nd round
        host.querySelector('a:nth-of-type(2)').click();
        await queue.yield();
        assert.html.textContent(host, 'product 2');
        // go back
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'products');
        await au.stop(true);
    });
    it('allow navigating to route defined in parent context using explicit routing context', async function () {
        let Product = class Product {
            canLoad(params, next, _current) {
                this.id = params.id;
                this.rtCtx = next.context;
                return true;
            }
        };
        Product = __decorate([
            customElement({ name: 'pro-duct', template: `product \${id} <a load="route:products; context.bind:rtCtx.parent"></a>` })
        ], Product);
        let Products = class Products {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        Products = __decorate([
            customElement({ name: 'pro-ducts', template: `<a load="route:product/1; context.bind:rtCtx.parent"></a><a load="route:product; params.bind:{id: 2}; context.bind:rtCtx.parent"></a> products` })
        ], Products);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'products', path: ['', 'products'], component: Products },
                    { id: 'product', path: 'product/:id', component: Product },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Products, Product] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'products');
        const anchors = Array.from(host.querySelectorAll('a'));
        const hrefs = anchors.map(a => a.href);
        assert.match(hrefs[0], /product\/1$/);
        assert.match(hrefs[1], /product\/2$/);
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'product 1');
        // go back
        const back = host.querySelector('a');
        assert.match(back.href, /products$/);
        back.click();
        await queue.yield();
        assert.html.textContent(host, 'products');
        // 2nd round
        host.querySelector('a:nth-of-type(2)').click();
        await queue.yield();
        assert.html.textContent(host, 'product 2');
        // go back
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'products');
        await au.stop(true);
    });
    it('allow navigating to route defined in grand-parent context using ../../ prefix', async function () {
        let L21 = class L21 {
        };
        L21 = __decorate([
            customElement({ name: 'l-21', template: `l21 <a load="../../l12"></a>` })
        ], L21);
        let L22 = class L22 {
        };
        L22 = __decorate([
            customElement({ name: 'l-22', template: `l22 <a load="../../l11"></a>` })
        ], L22);
        let L11 = class L11 {
        };
        L11 = __decorate([
            route({
                routes: [
                    { id: 'l21', path: ['', 'l21'], component: L21 },
                ]
            }),
            customElement({ name: 'l-11', template: `l11 <au-viewport></au-viewport>` })
        ], L11);
        let L12 = class L12 {
        };
        L12 = __decorate([
            route({
                routes: [
                    { id: 'l22', path: ['', 'l22'], component: L22 },
                ]
            }),
            customElement({ name: 'l-12', template: `l12 <au-viewport></au-viewport>` })
        ], L12);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'l11', path: ['', 'l11'], component: L11 },
                    { id: 'l12', path: 'l12', component: L12 },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [L11, L12, L21, L22] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'l11 l21');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l12 l22');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l11 l21');
        await au.stop(true);
    });
    it('allow navigating to route defined in grand-parent context using ../../ prefix - with parameters', async function () {
        let L21 = class L21 {
        };
        L21 = __decorate([
            customElement({ name: 'l-21', template: `l21 <a load="route:../../l12; params.bind:{id: '42'}"></a>` })
        ], L21);
        let L22 = class L22 {
        };
        L22 = __decorate([
            customElement({ name: 'l-22', template: `l22 <a load="route:../../l11; params.bind:{id: '42'}"></a>` })
        ], L22);
        let L11 = class L11 {
        };
        L11 = __decorate([
            route({
                routes: [
                    { id: 'l21', path: ['', 'l21'], component: L21 },
                ]
            }),
            customElement({ name: 'l-11', template: `l11 <au-viewport></au-viewport>` })
        ], L11);
        let L12 = class L12 {
        };
        L12 = __decorate([
            route({
                routes: [
                    { id: 'l22', path: ['', 'l22'], component: L22 },
                ]
            }),
            customElement({ name: 'l-12', template: `l12 <au-viewport></au-viewport>` })
        ], L12);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { path: '', redirectTo: 'l11/42' },
                    { id: 'l11', path: 'l11/:id', component: L11 },
                    { id: 'l12', path: 'l12/:id', component: L12 },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [L11, L12, L21, L22] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'l11 l21');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l12 l22');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l11 l21');
        await au.stop(true);
    });
    it('allow navigating to route defined in grand-parent context using explicit routing context', async function () {
        let L21 = class L21 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L21 = __decorate([
            customElement({ name: 'l-21', template: `l21 <a load="route:l12; context.bind:rtCtx.parent.parent"></a>` })
        ], L21);
        let L22 = class L22 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L22 = __decorate([
            customElement({ name: 'l-22', template: `l22 <a load="route:l11; context.bind:rtCtx.parent.parent"></a>` })
        ], L22);
        let L11 = class L11 {
        };
        L11 = __decorate([
            route({
                routes: [
                    { id: 'l21', path: ['', 'l21'], component: L21 },
                ]
            }),
            customElement({ name: 'l-11', template: `l11 <au-viewport></au-viewport>` })
        ], L11);
        let L12 = class L12 {
        };
        L12 = __decorate([
            route({
                routes: [
                    { id: 'l22', path: ['', 'l22'], component: L22 },
                ]
            }),
            customElement({ name: 'l-12', template: `l12 <au-viewport></au-viewport>` })
        ], L12);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'l11', path: ['', 'l11'], component: L11 },
                    { id: 'l12', path: 'l12', component: L12 },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [L11, L12, L21, L22] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'l11 l21');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l12 l22');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l11 l21');
        await au.stop(true);
    });
    it('allow explicitly binding the routing context to null to perform navigation from root', async function () {
        let L21 = class L21 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L21 = __decorate([
            customElement({ name: 'l-21', template: `l21 <a load="route:l22; context.bind:rtCtx.parent"></a>` })
        ], L21);
        let L22 = class L22 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L22 = __decorate([
            customElement({ name: 'l-22', template: `l22 <a load="route:l12; context.bind:null"></a>` })
        ], L22);
        let L23 = class L23 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L23 = __decorate([
            customElement({ name: 'l-23', template: `l23 <a load="route:l24; context.bind:rtCtx.parent"></a>` })
        ], L23);
        let L24 = class L24 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L24 = __decorate([
            customElement({ name: 'l-24', template: `l24 <a load="route:l11; context.bind:null"></a>` })
        ], L24);
        let L11 = class L11 {
        };
        L11 = __decorate([
            route({
                routes: [
                    { id: 'l21', path: ['', 'l21'], component: L21 },
                    { id: 'l22', path: 'l22', component: L22 },
                ]
            }),
            customElement({ name: 'l-11', template: `l11 <au-viewport></au-viewport>` })
        ], L11);
        let L12 = class L12 {
        };
        L12 = __decorate([
            route({
                routes: [
                    { id: 'l23', path: ['', 'l23'], component: L23 },
                    { id: 'l24', path: 'l24', component: L24 },
                ]
            }),
            customElement({ name: 'l-12', template: `l12 <au-viewport></au-viewport>` })
        ], L12);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'l11', path: ['', 'l11'], component: L11 },
                    { id: 'l12', path: 'l12', component: L12 },
                ]
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [L11, L12, L21, L22, L23, L24] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'l11 l21', 'init');
        // l21 -> l22
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l11 l22', '#2 l21 -> l22');
        // l22 -> l12
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l12 l23', '#3 l22 -> l12');
        // l23 -> l24
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l12 l24', '#4 l23 -> l24');
        // l24 -> l11
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'l11 l21', '#5 l24 -> l11');
        await au.stop(true);
    });
    it('adds hash correctly to the href when useUrlFragmentHash is set', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: `ce1` })
        ], CeOne);
        let CeTwo = class CeTwo {
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: `ce2` })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            customElement({
                name: 'ro-ot',
                template: `
      <a load="#ce-one"></a>
      <a load="#ce-two"></a>
      <a load="ce-two"></a>
      <au-viewport></au-viewport>
      `
            }),
            route({
                routes: [
                    {
                        path: 'ce-one',
                        component: CeOne,
                    },
                    {
                        path: 'ce-two',
                        component: CeTwo,
                    },
                ]
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, useHash: true, registrations: [CeOne, CeTwo] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchors = Array.from(host.querySelectorAll('a'));
        assert.deepStrictEqual(anchors.map(a => a.getAttribute('href')), ['/#/ce-one', '/#/ce-two', '/#/ce-two']);
        anchors[1].click();
        await queue.yield();
        assert.html.textContent(host, 'ce2');
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'ce1');
        anchors[2].click();
        await queue.yield();
        assert.html.textContent(host, 'ce2');
        await au.stop(true);
    });
    class HrefGenerationForChildComponentTestData {
        constructor(name, templates, expectedHrefs) {
            this.name = name;
            this.templates = templates;
            this.expectedHrefs = expectedHrefs;
        }
    }
    function* getHrefGenerationForChildComponentTestData() {
        yield new HrefGenerationForChildComponentTestData('using path', [
            `
    <a load="c1">C1</a>
    <a load="c2">C2</a>
    <au-viewport></au-viewport>`,
            `c1
    <a load="gc11">gc11</a>
    <a load="gc12">gc12</a>
    <a load="route: c2; context.bind: parentCtx">c2</a>
    <au-viewport></au-viewport>`,
            `c2
    <a load="gc21">gc21</a>
    <a load="gc22">gc22</a>
    <a load="route: c1; context.bind: parentCtx">c1</a>
    <au-viewport></au-viewport>`
        ], [
            [
                { href: 'c1' },
                { href: 'c2' },
                { href: 'c1/gc11' },
                { href: 'c1/gc12' },
                { href: 'c2' },
            ],
            [
                { href: 'c1' },
                { href: 'c2' },
                { href: 'c2/gc21' },
                { href: 'c2/gc22' },
                { href: 'c1' },
            ]
        ]);
        yield new HrefGenerationForChildComponentTestData('using route-id', [
            `
    <a load="r1">C1</a>
    <a load="r2">C2</a>
    <au-viewport></au-viewport>`,
            `c1
    <a load="r1">gc11</a>
    <a load="r2">gc12</a>
    <a load="route: r2; context.bind: parentCtx">c2</a>
    <au-viewport></au-viewport>`,
            `c2
    <a load="r1">gc21</a>
    <a load="r2">gc22</a>
    <a load="route: r1; context.bind: parentCtx">c1</a>
    <au-viewport></au-viewport>`
        ], [
            [
                { href: 'r1' },
                { href: 'r2' },
                { href: 'c1/r1' },
                { href: 'c1/r2' },
                { href: 'r2' },
            ],
            [
                { href: 'r1' },
                { href: 'r2' },
                { href: 'c2/r1' },
                { href: 'c2/r2' },
                { href: 'r1' },
            ]
        ]);
    }
    for (const { name, templates: [rt, t1, t2], expectedHrefs: [expectations1, expectations2] } of getHrefGenerationForChildComponentTestData()) {
        it(`href attribute value is correctly generated for child components - ${name}`, async function () {
            let GrandChildOneOne = class GrandChildOneOne {
            };
            GrandChildOneOne = __decorate([
                customElement({ name: 'gc-11', template: 'gc11' })
            ], GrandChildOneOne);
            let GrandChildOneTwo = class GrandChildOneTwo {
            };
            GrandChildOneTwo = __decorate([
                customElement({ name: 'gc-12', template: 'gc12' })
            ], GrandChildOneTwo);
            let ChildOne = class ChildOne {
                constructor(ctx) {
                    this.parentCtx = ctx.parent;
                }
            };
            ChildOne = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'gc11' },
                        { id: 'r1', path: 'gc11', component: GrandChildOneOne },
                        { id: 'r2', path: 'gc12', component: GrandChildOneTwo },
                    ],
                }),
                customElement({ name: 'c-one', template: t1 }),
                __param(0, IRouteContext),
                __metadata("design:paramtypes", [Object])
            ], ChildOne);
            let GrandChildTwoOne = class GrandChildTwoOne {
            };
            GrandChildTwoOne = __decorate([
                customElement({ name: 'gc-21', template: 'gc21' })
            ], GrandChildTwoOne);
            let GrandChildTwoTwo = class GrandChildTwoTwo {
            };
            GrandChildTwoTwo = __decorate([
                customElement({ name: 'gc-22', template: 'gc22' })
            ], GrandChildTwoTwo);
            let ChildTwo = class ChildTwo {
                constructor(ctx) {
                    this.parentCtx = ctx.parent;
                }
            };
            ChildTwo = __decorate([
                route({
                    routes: [
                        { path: '', redirectTo: 'gc21' },
                        { id: 'r1', path: 'gc21', component: GrandChildTwoOne },
                        { id: 'r2', path: 'gc22', component: GrandChildTwoTwo },
                    ],
                }),
                customElement({ name: 'c-two', template: t2 }),
                __param(0, IRouteContext),
                __metadata("design:paramtypes", [Object])
            ], ChildTwo);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            path: '',
                            redirectTo: 'c1',
                        },
                        {
                            id: 'r1',
                            path: 'c1',
                            component: ChildOne,
                        },
                        {
                            id: 'r2',
                            path: 'c2',
                            component: ChildTwo,
                        },
                    ],
                }),
                customElement({ name: 'my-app', template: rt })
            ], Root);
            const { au, host, container } = await start({ appRoot: Root });
            const location = container.get(ILocation);
            const queue = container.get(IPlatform).domWriteQueue;
            await queue.yield();
            let anchors = host.querySelectorAll('a');
            assertAnchors(anchors, expectations1, 'round#1 - anchors', false);
            assert.match(location.path, /c1\/gc11$/, 'round#1 - location.path');
            anchors[3].click();
            await queue.yield();
            assertAnchors(anchors, expectations1, 'round#2 - anchors', false);
            assert.match(location.path, /c1\/gc12$/, 'round#2 - location.path');
            anchors[2].click();
            await queue.yield();
            assertAnchors(anchors, expectations1, 'round#3 - anchors', false);
            assert.match(location.path, /c1\/gc11$/, 'round#3 - location.path');
            anchors[1].click();
            await queue.yield();
            anchors = host.querySelectorAll('a');
            assertAnchors(anchors, expectations2, 'round#4', false);
            assert.match(location.path, /c2\/gc21$/, 'round#4 - location.path');
            anchors[3].click();
            await queue.yield();
            assertAnchors(anchors, expectations2, 'round#5 - anchors', false);
            assert.match(location.path, /c2\/gc22$/, 'round#5 - location.path');
            anchors[2].click();
            await queue.yield();
            assertAnchors(anchors, expectations2, 'round#6 - anchors', false);
            assert.match(location.path, /c2\/gc21$/, 'round#6 - location.path');
            anchors[4].click();
            await queue.yield();
            anchors = host.querySelectorAll('a');
            assertAnchors(anchors, expectations1, 'round#7', false);
            assert.match(location.path, /c1\/gc11$/, 'round#7 - location.path');
            await au.stop(true);
        });
    }
    class HrefGenerationForChildComponentSiblingTestData {
        constructor(name, templates, expectedHrefs) {
            this.name = name;
            this.templates = templates;
            this.expectedHrefs = expectedHrefs;
        }
    }
    function* getHrefGenerationForChildComponentSiblingTestData() {
        yield new HrefGenerationForChildComponentSiblingTestData('using path', [
            `
    <a load="c1">C1</a>
    <a load="c2">C2</a>
    <au-viewport></au-viewport>`,
            `c1
    <a load="gc11+gc12">gc11+gc12</a>
    <a load="gc12+gc13">gc12+gc13</a>
    <a load="gc13+gc11">gc13+gc11</a>
    <au-viewport default.bind="null"></au-viewport><au-viewport default.bind="null"></au-viewport>`,
            `c2
    <a load="gc21+gc22">gc21+gc22</a>
    <a load="gc22+gc23">gc22+gc23</a>
    <a load="gc23+gc21">gc23+gc21</a>
    <au-viewport default.bind="null"></au-viewport><au-viewport default.bind="null"></au-viewport>`
        ], [
            [
                { href: 'c1' },
                { href: 'c2' },
                { href: 'c1/gc11+gc12' },
                { href: 'c1/gc12+gc13' },
                { href: 'c1/gc13+gc11' },
            ],
            [
                { href: 'c1' },
                { href: 'c2' },
                { href: 'c2/gc21+gc22' },
                { href: 'c2/gc22+gc23' },
                { href: 'c2/gc23+gc21' },
            ]
        ]);
        yield new HrefGenerationForChildComponentSiblingTestData('using route-id', [
            `
    <a load="r1">C1</a>
    <a load="r2">C2</a>
    <au-viewport></au-viewport>`,
            `c1
    <a load="r1+r2">gc11+gc12</a>
    <a load="r2+r3">gc12+gc13</a>
    <a load="r3+r1">gc13+gc11</a>
    <au-viewport default.bind="null"></au-viewport><au-viewport default.bind="null"></au-viewport>`,
            `c2
    <a load="r1+r2">gc21+gc22</a>
    <a load="r2+r3">gc22+gc23</a>
    <a load="r3+r1">gc23+gc21</a>
    <au-viewport default.bind="null"></au-viewport><au-viewport default.bind="null"></au-viewport>`
        ], [
            [
                { href: 'r1' },
                { href: 'r2' },
                { href: 'c1/r1+r2' },
                { href: 'c1/r2+r3' },
                { href: 'c1/r3+r1' },
            ],
            [
                { href: 'r1' },
                { href: 'r2' },
                { href: 'c2/r1+r2' },
                { href: 'c2/r2+r3' },
                { href: 'c2/r3+r1' },
            ]
        ]);
    }
    for (const { name, templates: [rt, t1, t2], expectedHrefs: [expectations1, expectations2] } of getHrefGenerationForChildComponentSiblingTestData()) {
        it(`href attribute value is correctly generated for child components - sibling instructions - ${name}`, async function () {
            let GrandChildOneOne = class GrandChildOneOne {
            };
            GrandChildOneOne = __decorate([
                customElement({ name: 'gc-11', template: 'gc11' })
            ], GrandChildOneOne);
            let GrandChildOneTwo = class GrandChildOneTwo {
            };
            GrandChildOneTwo = __decorate([
                customElement({ name: 'gc-12', template: 'gc12' })
            ], GrandChildOneTwo);
            let GrandChildOneThree = class GrandChildOneThree {
            };
            GrandChildOneThree = __decorate([
                customElement({ name: 'gc-13', template: 'gc13' })
            ], GrandChildOneThree);
            let ChildOne = class ChildOne {
                constructor(ctx) {
                    this.parentCtx = ctx.parent;
                }
            };
            ChildOne = __decorate([
                route({
                    routes: [
                        { id: 'r1', path: 'gc11', component: GrandChildOneOne },
                        { id: 'r2', path: 'gc12', component: GrandChildOneTwo },
                        { id: 'r3', path: 'gc13', component: GrandChildOneThree },
                    ],
                }),
                customElement({ name: 'c-one', template: t1 }),
                __param(0, IRouteContext),
                __metadata("design:paramtypes", [Object])
            ], ChildOne);
            let GrandChildTwoOne = class GrandChildTwoOne {
            };
            GrandChildTwoOne = __decorate([
                customElement({ name: 'gc-21', template: 'gc21' })
            ], GrandChildTwoOne);
            let GrandChildTwoTwo = class GrandChildTwoTwo {
            };
            GrandChildTwoTwo = __decorate([
                customElement({ name: 'gc-22', template: 'gc22' })
            ], GrandChildTwoTwo);
            let GrandChildTwoThree = class GrandChildTwoThree {
            };
            GrandChildTwoThree = __decorate([
                customElement({ name: 'gc-23', template: 'gc23' })
            ], GrandChildTwoThree);
            let ChildTwo = class ChildTwo {
                constructor(ctx) {
                    this.parentCtx = ctx.parent;
                }
            };
            ChildTwo = __decorate([
                route({
                    routes: [
                        { id: 'r1', path: 'gc21', component: GrandChildTwoOne },
                        { id: 'r2', path: 'gc22', component: GrandChildTwoTwo },
                        { id: 'r3', path: 'gc23', component: GrandChildTwoThree },
                    ],
                }),
                customElement({ name: 'c-two', template: t2 }),
                __param(0, IRouteContext),
                __metadata("design:paramtypes", [Object])
            ], ChildTwo);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        {
                            path: '',
                            redirectTo: 'c1',
                        },
                        {
                            id: 'r1',
                            path: 'c1',
                            component: ChildOne,
                        },
                        {
                            id: 'r2',
                            path: 'c2',
                            component: ChildTwo,
                        },
                    ],
                }),
                customElement({ name: 'my-app', template: rt })
            ], Root);
            const { au, host, container } = await start({ appRoot: Root });
            const location = container.get(ILocation);
            const queue = container.get(IPlatform).domWriteQueue;
            await queue.yield();
            let anchors = host.querySelectorAll('a');
            assertAnchors(anchors, expectations1, 'round#1 - anchors', false);
            assert.match(location.path, /c1$/, 'round#1 - location.path');
            anchors[2].click();
            await queue.yield();
            assert.match(location.path, /c1\/gc11\+gc12$/, 'round#2 - location.path');
            anchors[3].click();
            await queue.yield();
            assert.match(location.path, /c1\/gc12\+gc13$/, 'round#3 - location.path');
            anchors[4].click();
            await queue.yield();
            assert.match(location.path, /c1\/gc13\+gc11$/, 'round#4 - location.path');
            anchors[1].click();
            await queue.yield();
            anchors = host.querySelectorAll('a');
            assertAnchors(anchors, expectations2, 'round#5 - anchors', false);
            assert.match(location.path, /c2$/, 'round#5 - location.path');
            anchors[2].click();
            await queue.yield();
            assert.match(location.path, /c2\/gc21\+gc22$/, 'round#6 - location.path');
            anchors[3].click();
            await queue.yield();
            assert.match(location.path, /c2\/gc22\+gc23$/, 'round#7 - location.path');
            anchors[4].click();
            await queue.yield();
            assert.match(location.path, /c2\/gc23\+gc21$/, 'round#8 - location.path');
            anchors[0].click();
            await queue.yield();
            anchors = host.querySelectorAll('a');
            assertAnchors(anchors, expectations1, 'round#9 - anchors', false);
            assert.match(location.path, /c1$/, 'round#9 - location.path');
            await au.stop(true);
        });
    }
    it('supports routing instruction with parenthesized parameters', async function () {
        let C1 = class C1 {
            loading(params, _next, _current) {
                this.id1 = params.id1;
                this.id2 = params.id2;
            }
        };
        C1 = __decorate([
            route('c1/:id1/:id2?'),
            customElement({ name: 'c-1', template: 'c1 ${id1} ${id2}' })
        ], C1);
        let Root = class Root {
        };
        Root = __decorate([
            route({ routes: [{ id: 'c1', component: C1 }] }),
            customElement({ name: 'ro-ot', template: '<a load="c1(id1=1)"></a> <a load="c1(id1=2,id2=3)"></a> <au-viewport></au-viewport>' })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root });
        const queue = container.get(IPlatform).domWriteQueue;
        assert.html.textContent(host, '', 'init');
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'c1 1', 'round#1');
        host.querySelector('a:nth-of-type(2)').click();
        await queue.yield();
        assert.html.textContent(host, 'c1 2 3', 'round#2');
        await au.stop(true);
    });
    it('allow navigating to route defined in parent context using ../ prefix with replace transitionPlan and child viewport', async function () {
        let Product = class Product {
            canLoad(params, _next, _current) {
                this.id = params.id;
                return true;
            }
        };
        Product = __decorate([
            customElement({ name: 'product-details', template: `product \${id} <a load="../../products"></a>` })
        ], Product);
        let ProductInit = class ProductInit {
        };
        ProductInit = __decorate([
            customElement({ name: 'product-init', template: `product init <a load="../product/1"></a><a load="../product/2"></a>` })
        ], ProductInit);
        let Products = class Products {
        };
        Products = __decorate([
            route({
                routes: [
                    { path: '', component: ProductInit },
                    { path: 'product/:id', component: Product },
                ]
            }),
            customElement({ name: 'pro-ducts', template: `<au-viewport name="products"></au-viewport>` })
        ], Products);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    { id: 'products', path: ['', 'products'], component: Products },
                ],
                transitionPlan: 'replace',
            }),
            customElement({ name: 'ro-ot', template: '<au-viewport name="root"></au-viewport>' })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, registrations: [Products, Product] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        assert.html.textContent(host, 'product init');
        const anchors = Array.from(host.querySelectorAll('a'));
        const hrefs = anchors.map(a => a.href);
        assert.match(hrefs[0], /product\/1$/);
        assert.match(hrefs[1], /product\/2$/);
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'product 1', 'round#1');
        // go back
        const back = host.querySelector('a');
        assert.match(back.href, /products$/, 'round#1 - back - href');
        back.click();
        await queue.yield();
        assert.html.textContent(host, 'product init', 'round#1 - back - text');
        // 2nd round
        host.querySelector('a:nth-of-type(2)').click();
        await queue.yield();
        assert.html.textContent(host, 'product 2', 'round#2');
        // go back
        host.querySelector('a').click();
        await queue.yield();
        assert.html.textContent(host, 'product init', 'round#2 - back - text');
        await au.stop(true);
    });
    for (const value of [null, undefined]) {
        it(`${value} value for a query-string param is ignored`, async function () {
            let Product = class Product {
                canLoad(_params, _next, _current) {
                    this.query = _next.queryParams;
                    return true;
                }
            };
            Product = __decorate([
                route('product'),
                customElement({ name: 'pro-duct', template: `product` })
            ], Product);
            let Root = class Root {
                constructor() {
                    this.value = value;
                }
            };
            Root = __decorate([
                route({
                    routes: [
                        Product,
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<a load="route:product; params.bind: {id: value}"></a><au-viewport></au-viewport>' })
            ], Root);
            const { au, host, container } = await start({ appRoot: Root, registrations: [Product] });
            const queue = container.get(IPlatform).domWriteQueue;
            await queue.yield();
            host.querySelector('a').click();
            await queue.yield();
            const product = CustomElement.for(host.querySelector('pro-duct')).viewModel;
            const query = product.query;
            assert.strictEqual(query.get('id'), null);
            assert.deepStrictEqual(Array.from(query.keys()), []);
            await au.stop(true);
        });
    }
    it('respects constrained routes', async function () {
        let NotFound = class NotFound {
        };
        NotFound = __decorate([
            route('nf'),
            customElement({ name: 'not-found', template: `nf` })
        ], NotFound);
        let Product = class Product {
            canLoad(params, _next, _current) {
                this.id = params.id;
                return true;
            }
        };
        Product = __decorate([
            route({ id: 'product', path: 'product/:id{{^\\d+$}}' }),
            customElement({ name: 'pro-duct', template: `product \${id}` })
        ], Product);
        let Root = class Root {
        };
        Root = __decorate([
            route({ routes: [Product, NotFound], fallback: 'nf' }),
            customElement({
                name: 'ro-ot',
                template: `
        <a load="route:product; params.bind:{id: 42}"></a>
        <a load="route:product; params.bind:{id: foo}"></a>
        <a load="product/bar"></a>
        <au-viewport></au-viewport>
      `
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchors = Array.from(host.querySelectorAll('a'));
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'product 42');
        anchors[1].click();
        await queue.yield();
        assert.html.textContent(host, 'nf');
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'product 42');
        anchors[2].click();
        await queue.yield();
        assert.html.textContent(host, 'nf');
        await au.stop(true);
    });
});
//# sourceMappingURL=load.spec.js.map