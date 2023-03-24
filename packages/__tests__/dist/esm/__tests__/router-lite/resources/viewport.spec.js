var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IRouter, route } from '@aurelia/router-lite';
import { CustomElement, customElement, IPlatform } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
import { start } from '../_shared/create-fixture.js';
describe('router-lite/resources/viewport.spec.ts', function () {
    function assertText(vps, expected) {
        for (let i = 0; i < expected.length; i++) {
            assert.html.textContent(vps[i], expected[i], `content #${i + 1}`);
        }
    }
    it('sibling viewports with non-default routes are supported by binding the default property to null', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: 'ce2' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'ce-one'],
                        component: CeOne,
                    },
                    {
                        path: 'ce-two',
                        component: CeTwo,
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport name="$1"></au-viewport>
                <au-viewport name="$2" default.bind="null"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const [vp1, vp2] = Array.from(host.querySelectorAll('au-viewport'));
        const vm1 = CustomElement.for(vp1).viewModel;
        const vm2 = CustomElement.for(vp2).viewModel;
        assert.strictEqual(vm1.name, '$1');
        assert.strictEqual(vm2.name, '$2');
        assert.html.textContent(vp1, 'ce1');
        assert.html.textContent(vp2, '');
        await router.load('ce-two');
        await queue.yield();
        assert.html.textContent(vp1, 'ce2');
        assert.html.textContent(vp2, '');
        await router.load('ce-one');
        await queue.yield();
        assert.html.textContent(vp1, 'ce1');
        assert.html.textContent(vp2, '');
        await router.load('ce-two@$1+ce-one@$2');
        await queue.yield();
        assert.html.textContent(vp1, 'ce2');
        assert.html.textContent(vp2, 'ce1');
        await au.stop();
    });
    it('sibling viewports in children with non-default routes are supported by binding the default property to null', async function () {
        let CeOneOne = class CeOneOne {
        };
        CeOneOne = __decorate([
            customElement({ name: 'ce-11', template: `ce11` })
        ], CeOneOne);
        let CeTwoOne = class CeTwoOne {
        };
        CeTwoOne = __decorate([
            customElement({ name: 'ce-21', template: `ce21` })
        ], CeTwoOne);
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'ce-11'],
                        component: CeOneOne,
                    }
                ]
            }),
            customElement({
                name: 'ce-one', template: `ce1
        <au-viewport name="$1"></au-viewport>
        <au-viewport name="$2" default.bind="null"></au-viewport>`
            })
        ], CeOne);
        let CeTwo = class CeTwo {
        };
        CeTwo = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'ce-21'],
                        component: CeTwoOne,
                    }
                ]
            }),
            customElement({
                name: 'ce-two', template: `ce2
    <au-viewport name="$1"></au-viewport>
    <au-viewport name="$2" default.bind="null"></au-viewport>`
            })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'ce-one'],
                        component: CeOne,
                    },
                    {
                        path: 'ce-two',
                        component: CeTwo,
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport name="$1"></au-viewport>
                <au-viewport name="$2" default.bind="null"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        assert.html.textContent(host, 'ce1 ce11');
        await router.load('ce-two');
        await queue.yield();
        assert.html.textContent(host, 'ce2 ce21');
        await router.load('ce-one/ce-11');
        await queue.yield();
        assert.html.textContent(host, 'ce1 ce11');
        await router.load('ce-two@$1+ce-one@$2');
        await queue.yield();
        assert.html.textContent(host, 'ce2 ce21 ce1 ce11');
        await au.stop();
    });
    it('sibling viewports in children with non-default routes are supported by binding the default property to null - transition plan: invoke-lifecycle', async function () {
        let CeTwoOne = class CeTwoOne {
        };
        CeTwoOne = __decorate([
            customElement({ name: 'ce-21', template: `ce21` })
        ], CeTwoOne);
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({
                name: 'ce-one', template: `ce1`
            })
        ], CeOne);
        let CeTwo = class CeTwo {
        };
        CeTwo = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'ce-21'],
                        component: CeTwoOne,
                    }
                ]
            }),
            customElement({
                name: 'ce-two', template: `ce2
    <au-viewport name="$1"></au-viewport>
    <au-viewport name="$2" default.bind="null"></au-viewport>`
            })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'ce-one'],
                        component: CeOne,
                    },
                    {
                        path: 'ce-two',
                        component: CeTwo,
                    },
                ],
                transitionPlan() { return 'invoke-lifecycles'; }
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport name="$1"></au-viewport>
                <au-viewport name="$2" default.bind="null"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const [vp1, vp2] = Array.from(host.querySelectorAll('au-viewport'));
        const vm1 = CustomElement.for(vp1).viewModel;
        const vm2 = CustomElement.for(vp2).viewModel;
        assert.strictEqual(vm1.name, '$1');
        assert.strictEqual(vm2.name, '$2');
        assert.html.textContent(vp1, 'ce1');
        assert.html.textContent(vp2, '');
        await router.load('ce-two/ce-21');
        await queue.yield();
        assert.html.textContent(vp1, 'ce2 ce21');
        assert.html.textContent(vp2, '');
        await router.load('ce-two@$2+ce-one@$1');
        await queue.yield();
        assert.html.textContent(vp1, 'ce1');
        assert.html.textContent(vp2, 'ce2 ce21');
        await au.stop();
    });
    it('sibling viewports - load non-empty-route@non-default-vp+empty-alias-route@default-vp', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
            canLoad(params) {
                this.id = params.id;
                return true;
            }
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: 'ce2 ${id}' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        path: ['', 'ce-one'],
                        component: CeOne,
                    },
                    {
                        path: 'ce-two/:id',
                        component: CeTwo,
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport name="$1"></au-viewport>
                <au-viewport name="$2" default.bind="null"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        assert.html.textContent(host, 'ce1');
        await router.load('ce-two/42@$2+ce-one@$1');
        await queue.yield();
        assert.html.textContent(host, 'ce1 ce2 42');
        await au.stop();
    });
    // precondition: exists a mixture of named and unnamed viewports
    // action: components are attempted to be loaded into named viewports
    // expectation: components are loaded into named viewports
    it('targeted components can be loaded into named viewports even when default viewports are present', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
            canLoad(params) {
                this.id = params.id;
                return true;
            }
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: 'ce2 ${id}' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        path: 'ce-one',
                        component: CeOne,
                    },
                    {
                        path: 'ce-two/:id',
                        component: CeTwo,
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport></au-viewport>
                <au-viewport name="$1"></au-viewport>
                <au-viewport></au-viewport>
                <au-viewport name="$2"></au-viewport>
                <au-viewport></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const vps = Array.from(host.querySelectorAll('au-viewport'));
        const vms = vps.map(vp => CustomElement.for(vp).viewModel);
        assert.deepStrictEqual(vms.map(vm => vm.name), ['default', '$1', 'default', '$2', 'default']);
        await router.load('ce-one@$1');
        await queue.yield();
        assertText(vps, ['', 'ce1', '', '', '']);
        await router.load('ce-one@$2+ce-two/42@$1');
        await queue.yield();
        assertText(vps, ['', 'ce2 42', '', 'ce1', '']);
        await router.load('ce-one+ce-two/42');
        await queue.yield();
        assertText(vps, ['ce1', 'ce2 42', '', '', '']);
        await au.stop();
    });
    it('viewport configuration for route is respected', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
            canLoad(params) {
                this.id = params.id;
                return true;
            }
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: 'ce2 ${id}' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        path: 'ce-one',
                        component: CeOne,
                        viewport: '$2',
                    },
                    {
                        path: 'ce-two/:id',
                        component: CeTwo,
                        viewport: '$1',
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport></au-viewport>
                <au-viewport name="$1"></au-viewport>
                <au-viewport></au-viewport>
                <au-viewport name="$2"></au-viewport>
                <au-viewport></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const vps = Array.from(host.querySelectorAll('au-viewport'));
        const vms = vps.map(vp => CustomElement.for(vp).viewModel);
        assert.deepStrictEqual(vms.map(vm => vm.name), ['default', '$1', 'default', '$2', 'default']);
        await router.load('ce-one');
        await queue.yield();
        assertText(vps, ['', '', '', 'ce1', '']);
        await router.load('ce-one+ce-two/42');
        await queue.yield();
        assertText(vps, ['', 'ce2 42', '', 'ce1', '']);
        try {
            await router.load('ce-one@$1');
            assert.fail('expected error for loading ce-one@$1');
        }
        catch {
            /** ignore */
        }
        try {
            await router.load('ce-two/42@$2');
            assert.fail('expected error for loading ce-two/42@$2');
        }
        catch {
            /** ignore */
        }
        await au.stop();
    });
    it('multiple routes can use the same viewport', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
            canLoad(params) {
                this.id = params.id;
                return true;
            }
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: 'ce2 ${id}' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        path: 'ce-one',
                        component: CeOne,
                        viewport: '$1',
                    },
                    {
                        path: 'ce-two/:id',
                        component: CeTwo,
                        viewport: '$1',
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport></au-viewport>
                <au-viewport name="$1"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const vps = Array.from(host.querySelectorAll('au-viewport'));
        const vms = vps.map(vp => CustomElement.for(vp).viewModel);
        assert.deepStrictEqual(vms.map(vm => vm.name), ['default', '$1']);
        await router.load('ce-one');
        await queue.yield();
        assertText(vps, ['', 'ce1']);
        await router.load('ce-two/42');
        await queue.yield();
        assertText(vps, ['', 'ce2 42']);
        try {
            await router.load('ce-one+ce-two/42');
            assert.fail('expected error for loading ce-one+ce-two/42');
        }
        catch {
            /** ignore */
        }
        await au.stop();
    });
    it('used-by is respected', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
            canLoad(params) {
                this.id1 = params.id1;
                this.id2 = params.id2;
                return true;
            }
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: '${id1} ce2 ${id2}' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        id: 'ce1',
                        path: 'ce-one',
                        component: CeOne,
                    },
                    {
                        id: 'ce2',
                        path: ':id1/foo/:id2',
                        component: CeTwo,
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport used-by="whatever"></au-viewport>
                <au-viewport used-by="ce-two"></au-viewport>
                <au-viewport used-by="ce-one"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const vps = Array.from(host.querySelectorAll('au-viewport'));
        await router.load('ce-one');
        await queue.yield();
        assertText(vps, ['', '', 'ce1']);
        await router.load('42/foo/43');
        await queue.yield();
        assertText(vps, ['', '42 ce2 43', '']);
        await router.load('ce1+43/foo/42');
        await queue.yield();
        assertText(vps, ['', '43 ce2 42', 'ce1']);
        await au.stop();
    });
    it('comma-separated used-by is respected', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
            canLoad(params) {
                this.id1 = params.id1;
                this.id2 = params.id2;
                return true;
            }
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: '${id1} ce2 ${id2}' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        id: 'ce1',
                        path: 'ce-one',
                        component: CeOne,
                    },
                    {
                        id: 'ce2',
                        path: ':id1/foo/:id2',
                        component: CeTwo,
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport used-by="whatever"></au-viewport>
                <au-viewport used-by="ce-one,ce-two"></au-viewport>
                <au-viewport used-by="ce-one"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const vps = Array.from(host.querySelectorAll('au-viewport'));
        await router.load('ce-one');
        await queue.yield();
        assertText(vps, ['', 'ce1', '']);
        await router.load('42/foo/43');
        await queue.yield();
        assertText(vps, ['', '42 ce2 43', '']);
        await router.load('43/foo/42+ce1');
        await queue.yield();
        assertText(vps, ['', '43 ce2 42', 'ce1']);
        try {
            await router.load('ce1+43/foo/42');
            assert.fail('expected failure due to no free viewport to handle "43/foo/42" from the instruction "ce1+43/foo/42"');
        }
        catch {
            /* ignore */
        }
        await au.stop();
    });
    it('a preceding default (without used-by) can load components', async function () {
        let CeOne = class CeOne {
        };
        CeOne = __decorate([
            customElement({ name: 'ce-one', template: 'ce1' })
        ], CeOne);
        let CeTwo = class CeTwo {
            canLoad(params) {
                this.id1 = params.id1;
                this.id2 = params.id2;
                return true;
            }
        };
        CeTwo = __decorate([
            customElement({ name: 'ce-two', template: '${id1} ce2 ${id2}' })
        ], CeTwo);
        let Root = class Root {
        };
        Root = __decorate([
            route({
                routes: [
                    {
                        id: 'ce1',
                        path: 'ce-one',
                        component: CeOne,
                    },
                    {
                        id: 'ce2',
                        path: ':id1/foo/:id2',
                        component: CeTwo,
                    },
                ]
            }),
            customElement({
                name: 'ro-ot',
                template: `
                <au-viewport></au-viewport>
                <au-viewport used-by="ce-one,ce-two"></au-viewport>
            `
            })
        ], Root);
        const { au, container, host } = await start({ appRoot: Root, registrations: [CeOne] });
        const queue = container.get(IPlatform).domWriteQueue;
        const router = container.get(IRouter);
        await queue.yield();
        const vps = Array.from(host.querySelectorAll('au-viewport'));
        await router.load('ce-one');
        await queue.yield();
        assertText(vps, ['ce1', '']);
        await router.load('42/foo/43');
        await queue.yield();
        assertText(vps, ['42 ce2 43', '']);
        await router.load('43/foo/42+ce1');
        await queue.yield();
        assertText(vps, ['43 ce2 42', 'ce1']);
        await au.stop();
    });
});
//# sourceMappingURL=viewport.spec.js.map