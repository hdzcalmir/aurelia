var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { route } from '@aurelia/router-lite';
import { customElement, IPlatform } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
import { start } from '../_shared/create-fixture.js';
describe('router-lite/resources/href.spec.ts', function () {
    it('allow navigating to route defined in parent context using ../ prefix', async function () {
        let Product = class Product {
            canLoad(params, _next, _current) {
                this.id = params.id;
                return true;
            }
        };
        Product = __decorate([
            customElement({ name: 'pro-duct', template: `product \${id} <a href="../products"></a>` })
        ], Product);
        let Products = class Products {
        };
        Products = __decorate([
            customElement({ name: 'pro-ducts', template: `<a href="../product/1"></a><a href="../product/2"></a> products` })
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
            customElement({ name: 'l-21', template: `l21 \${id} <a href="../../l12"></a>` })
        ], L21);
        let L22 = class L22 {
        };
        L22 = __decorate([
            customElement({ name: 'l-22', template: `l22 \${id} <a href="../../l11"></a>` })
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
    // slightly more complex use-case
    it('cross children navigation with multiple hierarchical routing configuration', async function () {
        let L21 = class L21 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L21 = __decorate([
            customElement({ name: 'l-21', template: `l21 <a href="../l22"></a>` })
        ], L21);
        let L22 = class L22 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L22 = __decorate([
            customElement({ name: 'l-22', template: `l22 <a href="../../l12"></a>` })
        ], L22);
        let L23 = class L23 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L23 = __decorate([
            customElement({ name: 'l-23', template: `l23 <a href="../l24"></a>` })
        ], L23);
        let L24 = class L24 {
            canLoad(params, next, _current) {
                this.rtCtx = next.context;
                return true;
            }
        };
        L24 = __decorate([
            customElement({ name: 'l-24', template: `l24 <a href="../../l11"></a>` })
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
        let CeThreeChild = class CeThreeChild {
        };
        CeThreeChild = __decorate([
            customElement({ name: 'ce-three-child', template: `ce3child` })
        ], CeThreeChild);
        let CeThree = class CeThree {
        };
        CeThree = __decorate([
            customElement({ name: 'ce-three', template: `ce3 <a id="ce3a1" href="../ce-one"></a> <a id="ce3a2" href="ce-three-child"></a> <au-viewport></au-viewport>` }),
            route({
                routes: [
                    {
                        path: 'ce-three-child',
                        component: CeThreeChild,
                    },
                ]
            })
        ], CeThree);
        let Root = class Root {
        };
        Root = __decorate([
            customElement({
                name: 'ro-ot',
                template: `
      <a href="#ce-one"></a>
      <a href="#ce-two"></a>
      <a href="ce-two"></a>
      <a href="./ce-three"></a>
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
                    {
                        path: 'ce-three',
                        component: CeThree,
                    },
                ]
            })
        ], Root);
        const { au, host, container } = await start({ appRoot: Root, useHash: true, registrations: [CeOne, CeTwo, CeThree] });
        const queue = container.get(IPlatform).domWriteQueue;
        await queue.yield();
        const anchors = Array.from(host.querySelectorAll('a'));
        assert.deepStrictEqual(anchors.map(a => a.getAttribute('href')), ['#ce-one', '#ce-two', '#ce-two', './ce-three']);
        anchors[1].click();
        await queue.yield();
        assert.html.textContent(host, 'ce2');
        anchors[0].click();
        await queue.yield();
        assert.html.textContent(host, 'ce1');
        anchors[2].click();
        await queue.yield();
        assert.html.textContent(host, 'ce2');
        anchors[3].click();
        await queue.yield();
        assert.html.textContent(host, 'ce3');
        let anchor = host.querySelector('a#ce3a1');
        assert.strictEqual(anchor.getAttribute('href'), '../ce-one');
        anchor.click();
        await queue.yield();
        assert.html.textContent(host, 'ce1');
        anchors[3].click();
        await queue.yield();
        assert.html.textContent(host, 'ce3');
        anchor = host.querySelector('a#ce3a2');
        assert.strictEqual(anchor.getAttribute('href'), 'ce-three-child');
        anchor.click();
        await queue.yield();
        assert.html.textContent(host, 'ce3 ce3child');
        await au.stop(true);
    });
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
            customElement({ name: 'ro-ot', template: '<a href="c1(id1=1)"></a> <a href="c1(id1=2,id2=3)"></a> <au-viewport></au-viewport>' })
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
        <a href="product/42"></a>
        <a href="product/bar"></a>
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
        assert.html.textContent(host, 'product 42', 'round#1');
        anchors[1].click();
        await queue.yield();
        assert.html.textContent(host, 'nf', 'round#2');
        await au.stop(true);
    });
});
//# sourceMappingURL=href.spec.js.map