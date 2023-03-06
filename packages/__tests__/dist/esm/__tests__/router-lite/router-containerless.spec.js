var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { route } from '@aurelia/router-lite';
import { containerless, customElement, IPlatform } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
import { start } from './_shared/create-fixture.js';
describe('router-lite/router-containerless.spec.ts', function () {
    it('does not render container when the routable component has @containerless', async function () {
        let Foo = class Foo {
        };
        Foo = __decorate([
            containerless(),
            customElement({
                name: 'foo',
                template: 'foo'
            })
        ], Foo);
        let App = class App {
        };
        App = __decorate([
            route({
                routes: [
                    { id: 'foo', path: '', component: Foo },
                ]
            }),
            customElement({
                name: 'root',
                template: 'root <au-viewport>'
            })
        ], App);
        const { host } = await start({ appRoot: App });
        assert.strictEqual(null, host.querySelector('foo'));
    });
    it('cleans up when rendering another component after a containerless component', async function () {
        let Foo = class Foo {
        };
        Foo = __decorate([
            containerless(),
            customElement({ name: 'foo', template: 'foo' })
        ], Foo);
        let NormalFoo = class NormalFoo {
        };
        NormalFoo = __decorate([
            customElement({ name: 'normal-foo', template: 'normal-foo' })
        ], NormalFoo);
        let App = class App {
        };
        App = __decorate([
            route({
                routes: [
                    { id: 'foo', path: '', component: Foo },
                    { id: 'normal-foo', path: 'normal-foo', component: NormalFoo },
                ]
            }),
            customElement({
                name: 'root',
                template: 'root <a href="./normal-foo"></a><au-viewport>'
            })
        ], App);
        const { host, container } = await start({ appRoot: App });
        assert.strictEqual(null, host.querySelector('foo'));
        assert.html.textContent(host.querySelector('au-viewport'), 'foo');
        host.querySelector('a').click();
        await container.get(IPlatform).domWriteQueue.yield();
        assert.html.textContent(host.querySelector('au-viewport'), 'normal-foo');
        assert.notIncludes(host.innerHTML, '<!--au-start-->');
        assert.includes(host.innerHTML, '<normal-foo>normal-foo</normal-foo>');
    });
});
//# sourceMappingURL=router-containerless.spec.js.map