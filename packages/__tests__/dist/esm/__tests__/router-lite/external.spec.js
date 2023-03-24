var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { route } from '@aurelia/router-lite';
import { customElement } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
import { createFixture } from './_shared/create-fixture.js';
describe('router-lite/external.spec.ts', function () {
    for (const attr of ['external', 'data-external']) {
        it(`recognizes "${attr}" attribute`, async function () {
            let A11 = class A11 {
            };
            A11 = __decorate([
                customElement({ name: 'a11', template: `a11${vp(1)}` })
            ], A11);
            let A12 = class A12 {
            };
            A12 = __decorate([
                customElement({ name: 'a12', template: `a12${vp(1)}` })
            ], A12);
            let Root1 = class Root1 {
                constructor() {
                    this.httpLink = 'https://google.com';
                    this.compLink = 'a11';
                }
            };
            Root1 = __decorate([
                route({
                    routes: [
                        {
                            path: 'a11',
                            component: A11,
                        },
                        {
                            path: 'a12',
                            component: A12,
                        },
                    ]
                }),
                customElement({
                    name: 'root1',
                    template: `<a href.bind="compLink"></a><a href.bind="httpLink" external></a><span href="a12"></span>${vp(1)}`
                })
            ], Root1);
            const { router, host, tearDown } = await createFixture(Root1, [A11, A12], getDefaultHIAConfig, () => ({}));
            const anchors = Array.from(host.querySelectorAll('a'));
            const loadArgs = [];
            router.load = (fn => function (...args) {
                loadArgs.push(args);
                return fn.apply(router, args);
            })(router.load);
            const [internalLink, externalLink] = anchors;
            const spanWithHref = host.querySelector('span');
            let externalLinkClick = 0;
            host.addEventListener('click', function (e) {
                const target = e.target;
                if (target.hasAttribute('external') || target.hasAttribute('data-external')) {
                    // prevent browser navigate
                    e.preventDefault();
                    externalLinkClick++;
                }
            });
            assert.strictEqual(host.textContent, '');
            internalLink.click();
            await router['currentTr'].promise;
            assert.strictEqual(loadArgs.length, 1);
            assert.strictEqual(host.textContent, 'a11');
            externalLink.click();
            assert.strictEqual(loadArgs.length, 1);
            assert.strictEqual(externalLinkClick, 1);
            assert.strictEqual(host.textContent, 'a11');
            await router['currentTr'].promise;
            assert.strictEqual(loadArgs.length, 1);
            assert.strictEqual(externalLinkClick, 1);
            assert.strictEqual(host.textContent, 'a11');
            spanWithHref.click();
            assert.strictEqual(loadArgs.length, 1);
            await tearDown();
        });
    }
});
function vp(count) {
    return '<au-viewport></au-viewport>'.repeat(count);
}
function getDefaultHIAConfig() {
    return {
        resolveTimeoutMs: 100,
        resolveLabels: [],
    };
}
//# sourceMappingURL=external.spec.js.map