var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IRouter, RouterConfiguration } from '@aurelia/router';
import { Aurelia, CustomElement, lifecycleHooks } from '@aurelia/runtime-html';
import { MockBrowserHistoryLocation, TestContext, assert } from '@aurelia/testing';
describe('router/router.lifecycle-hooks.spec.ts', function () {
    function getModifiedRouter(container) {
        const router = container.get(IRouter);
        const mockBrowserHistoryLocation = new MockBrowserHistoryLocation();
        mockBrowserHistoryLocation.changeCallback = async (ev) => { router.viewer.handlePopStateEvent(ev); };
        router.viewer.history = mockBrowserHistoryLocation;
        router.viewer.location = mockBrowserHistoryLocation;
        return router;
    }
    function spyNavigationStates(router, spy) {
        let _pushState;
        let _replaceState;
        if (spy) {
            _pushState = router.viewer.location.pushState;
            router.viewer.location.pushState = function (data, title, path) {
                spy('push', data, title, path);
                _pushState.call(router.viewer.location, data, title, path);
            };
            _replaceState = router.viewer.location.replaceState;
            router.viewer.location.replaceState = function (data, title, path) {
                spy('replace', data, title, path);
                _replaceState.call(router.viewer.location, data, title, path);
            };
        }
        return { _pushState, _replaceState };
    }
    function unspyNavigationStates(router, _push, _replace) {
        if (_push) {
            router.viewer.location.pushState = _push;
            router.viewer.location.replaceState = _replace;
        }
    }
    async function $setup(config, dependencies = [], routes = [], stateSpy = void 0) {
        var _a;
        const ctx = TestContext.create();
        const { container, platform } = ctx;
        const App = CustomElement.define({
            name: 'app',
            template: '<au-viewport name="app"></au-viewport>',
            dependencies
        }, (_a = class {
            },
            _a.routes = routes,
            _a));
        const host = ctx.doc.createElement('div');
        ctx.doc.body.appendChild(host);
        const au = new Aurelia(container)
            .register(RouterConfiguration.customize(config ?? {}), App)
            .app({ host: host, component: App });
        const router = getModifiedRouter(container);
        const { _pushState, _replaceState } = spyNavigationStates(router, stateSpy);
        await au.start();
        async function $teardown() {
            unspyNavigationStates(router, _pushState, _replaceState);
            RouterConfiguration.customize();
            await au.stop(true);
            ctx.doc.body.removeChild(host);
            au.dispose();
        }
        return { ctx, container, platform, host, au, router, $teardown, App };
    }
    describe('[sync] lifecycleHooks', function () {
        this.timeout(5000);
        function _elements(config, calledHooks) {
            let Hooks = class Hooks {
                constructor() {
                    this.name = 'Hooks';
                }
                canLoad(vm) { calledHooks.push(`${this.name}:${vm.name}:canLoad`); return config.Hooks_canLoad; }
                loading(vm) { calledHooks.push(`${this.name}:${vm.name}:loading`); }
                canUnload(vm) { calledHooks.push(`${this.name}:${vm.name}:canUnload`); return config.Hooks_canUnload; }
                unloading(vm) { calledHooks.push(`${this.name}:${vm.name}:unloading`); }
            };
            Hooks = __decorate([
                lifecycleHooks()
            ], Hooks);
            const One = CustomElement.define({ name: 'my-one', template: '!my-one!<au-viewport></au-viewport>', dependencies: [Hooks] }, class {
                constructor() {
                    this.name = 'my-one';
                }
                canLoad() { calledHooks.push(`VM:${this.name}:canLoad`); return config.One_canLoad; }
                loading() { calledHooks.push(`VM:${this.name}:loading`); }
                canUnload() { calledHooks.push(`VM:${this.name}:canUnload`); return config.One_canUnload; }
                unloading() { calledHooks.push(`VM:${this.name}:unloading`); }
                binding() { calledHooks.push(`VM:${this.name}:binding`); }
            });
            const Two = CustomElement.define({ name: 'my-two', template: '!my-two!', dependencies: [Hooks] }, class {
                constructor() {
                    this.name = 'my-two';
                }
                canLoad() { calledHooks.push(`VM:${this.name}:canLoad`); return config.Two_canLoad; }
                loading() { calledHooks.push(`VM:${this.name}:loading`); }
                canUnload() { calledHooks.push(`VM:${this.name}:canUnload`); return config.Two_canUnload; }
                unloading() { calledHooks.push(`VM:${this.name}:unloading`); }
                binding() { calledHooks.push(`VM:${this.name}:binding`); }
            });
            return { Hooks, One, Two };
        }
        const configs = [
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: false, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: false, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: false, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: false, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: false, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: false },
        ];
        function _falses($config) {
            const falses = [];
            for (const [key, value] of Object.entries($config)) {
                if (!value) {
                    falses.push(key);
                }
            }
            return falses.join(', ');
        }
        for (const config of configs) {
            const calledHooks = [];
            const { Hooks, One, Two } = _elements(config, calledHooks);
            function _expected($config) {
                let oneLoaded = false;
                let twoChecked = false;
                let twoLoaded = false;
                const expected = [];
                expected.push('Hooks:my-one:canLoad');
                if (!$config.Hooks_canLoad) {
                    expected.push('Hooks:my-two:canLoad');
                    return expected;
                }
                expected.push('VM:my-one:canLoad');
                if ($config.One_canLoad) {
                    expected.push('Hooks:my-one:loading', 'VM:my-one:loading', 'VM:my-one:binding');
                    oneLoaded = true;
                    expected.push('Hooks:my-one:canUnload');
                    if (!$config.Hooks_canUnload) {
                        expected.push('Hooks:my-one:canUnload');
                        return expected;
                    }
                    expected.push('VM:my-one:canUnload');
                    if (!$config.One_canUnload) {
                        expected.push('Hooks:my-one:canUnload');
                        expected.push('VM:my-one:canUnload');
                        return expected;
                    }
                    expected.push('Hooks:my-two:canLoad');
                    expected.push('VM:my-two:canLoad');
                    twoChecked = true;
                    if ($config.Two_canLoad) {
                        expected.push('Hooks:my-one:unloading', 'VM:my-one:unloading');
                        // one = false;
                        expected.push('Hooks:my-two:loading', 'VM:my-two:loading', 'VM:my-two:binding');
                        twoLoaded = true;
                        expected.push('Hooks:my-two:canUnload');
                        expected.push('VM:my-two:canUnload');
                        if ($config.Two_canUnload) {
                            expected.push('Hooks:my-two:unloading', 'VM:my-two:unloading');
                            // two = false;
                        }
                    }
                }
                if (!oneLoaded && !twoChecked) {
                    expected.push('Hooks:my-two:canLoad');
                    expected.push('VM:my-two:canLoad');
                    if ($config.Two_canLoad) {
                        expected.push('Hooks:my-two:loading', 'VM:my-two:loading', 'VM:my-two:binding');
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        twoLoaded = true;
                        expected.push('Hooks:my-two:canUnload');
                        if ($config.Hooks_canUnload) {
                            expected.push('VM:my-two:canUnload');
                            if ($config.Two_canUnload) {
                                expected.push('Hooks:my-two:unloading', 'VM:my-two:unloading');
                                // two = false;
                            }
                        }
                    }
                }
                return expected;
            }
            it(`with hook and vm (falses: ${_falses(config)})`, async function () {
                const { platform, router, $teardown } = await $setup({}, [Hooks, One, Two]);
                const expected = _expected(config);
                await $load('/my-one', router, platform);
                await $load('/my-two', router, platform);
                await $load('-', router, platform);
                assert.strictEqual(calledHooks.join('|'), expected.join('|'), `calledHooks`);
                await $teardown();
            });
        }
        for (const config of configs) {
            const calledHooks = [];
            const { Hooks, One, Two } = _elements(config, calledHooks);
            function _expected(config) {
                const expected = ['Hooks:my-one:canLoad'];
                if (!config.Hooks_canLoad)
                    return expected;
                expected.push('VM:my-one:canLoad');
                if (!config.One_canLoad)
                    return expected;
                expected.push('Hooks:my-one:loading', 'VM:my-one:loading', 'VM:my-one:binding', 'Hooks:my-two:canLoad');
                expected.push('VM:my-two:canLoad');
                if (!config.Two_canLoad) {
                    expected.push('Hooks:my-one:canUnload', 'VM:my-one:canUnload', 'Hooks:my-one:unloading', 'VM:my-one:unloading');
                    return expected;
                }
                expected.push('Hooks:my-two:loading', 'VM:my-two:loading', 'VM:my-two:binding');
                expected.push('Hooks:my-two:canUnload');
                if (!config.Hooks_canUnload)
                    return expected;
                expected.push('VM:my-two:canUnload');
                if (!config.Two_canUnload)
                    return expected;
                expected.push('Hooks:my-one:canUnload');
                expected.push('VM:my-one:canUnload');
                if (!config.One_canUnload)
                    return expected;
                expected.push('Hooks:my-two:unloading', 'VM:my-two:unloading', 'Hooks:my-one:unloading', 'VM:my-one:unloading');
                return expected;
            }
            it(`in parent-child with hook and vm (falses: ${_falses(config)})`, async function () {
                const { platform, router, $teardown } = await $setup({}, [Hooks, One, Two]);
                await $load('/my-one/my-two', router, platform);
                await $load('-', router, platform);
                const expected = _expected(config);
                assert.strictEqual(calledHooks.join('|'), expected.join('|'), `calledHooks`);
                await $teardown();
            });
        }
    });
    describe('[async] lifecycleHooks', function () {
        this.timeout(30000);
        function _elements(config, calledHooks) {
            let Hooks = class Hooks {
                constructor() {
                    this.name = 'Hooks';
                    // TODO: Put these in once core supports them
                    // public binding(vm) { calledHooks.push(`${this.name}:${vm.name}:binding`); }
                    // public bound(vm) { calledHooks.push(`${this.name}:${vm.name}:bound`); }
                    // public attaching(vm) { calledHooks.push(`${this.name}:${vm.name}:attaching`); }
                    // public attached(vm) { calledHooks.push(`${this.name}:${vm.name}:attached`); }
                }
                async canLoad(vm) { calledHooks.push(`${this.name}:${vm.name}:canLoad`); /* return config.Hooks_canLoad; */ /* return config.Hooks_canLoad; */ return new Promise((res) => { setTimeout(() => res(config.Hooks_canLoad), 100); }); }
                async loading(vm) { calledHooks.push(`${this.name}:${vm.name}:loading`); return new Promise((res) => { setTimeout(() => res(void 0), 75); }); }
                async canUnload(vm) { calledHooks.push(`${this.name}:${vm.name}:canUnload`); /* return config.Hooks_canUnload; */ /* return config.Hooks_canUnload; */ return new Promise((res) => { setTimeout(() => res(config.Hooks_canUnload), 100); }); }
                async unloading(vm) { calledHooks.push(`${this.name}:${vm.name}:unloading`); return new Promise((res) => { setTimeout(() => res(void 0), 75); }); }
            };
            Hooks = __decorate([
                lifecycleHooks()
            ], Hooks);
            const One = CustomElement.define({ name: 'my-one', template: '!my-one!<au-viewport></au-viewport>', dependencies: [Hooks] }, class {
                constructor() {
                    this.name = 'my-one';
                }
                canLoad() { calledHooks.push(`VM:${this.name}:canLoad`); /* return config.One_canLoad; */ /* return config.One_canLoad; */ return new Promise((res) => { setTimeout(() => res(config.One_canLoad), 100); }); }
                loading() { calledHooks.push(`VM:${this.name}:loading`); return new Promise((res) => { setTimeout(() => res(void 0), 50); }); }
                canUnload() { calledHooks.push(`VM:${this.name}:canUnload`); /* return config.One_canUnload; */ /* return config.One_canUnload; */ return new Promise((res) => { setTimeout(() => res(config.One_canUnload), 100); }); }
                unloading() { calledHooks.push(`VM:${this.name}:unloading`); return new Promise((res) => { setTimeout(() => res(void 0), 50); }); }
                binding() { calledHooks.push(`VM:${this.name}:binding`); }
            });
            const Two = CustomElement.define({ name: 'my-two', template: '!my-two!', dependencies: [Hooks] }, class {
                constructor() {
                    this.name = 'my-two';
                }
                canLoad() { calledHooks.push(`VM:${this.name}:canLoad`); /* return config.Two_canLoad; */ /* return config.Two_canLoad; */ return new Promise((res) => { setTimeout(() => res(config.Two_canLoad), 100); }); }
                loading() { calledHooks.push(`VM:${this.name}:loading`); return new Promise((res) => { setTimeout(() => res(void 0), 50); }); }
                canUnload() { calledHooks.push(`VM:${this.name}:canUnload`); /* return config.Two_canUnload; */ /* return config.Two_canUnload; */ return new Promise((res) => { setTimeout(() => res(config.Two_canUnload), 100); }); }
                unloading() { calledHooks.push(`VM:${this.name}:unloading`); return new Promise((res) => { setTimeout(() => res(void 0), 50); }); }
                binding() { calledHooks.push(`VM:${this.name}:binding`); }
            });
            return { Hooks, One, Two };
        }
        const configs = [
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: false, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: false, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: false, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: false, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: false, Two_canLoad: true, Two_canUnload: true },
            { Hooks_canLoad: true, Hooks_canUnload: true, One_canLoad: true, One_canUnload: true, Two_canLoad: true, Two_canUnload: false },
        ];
        function _falses(config) {
            const falses = [];
            for (const [key, value] of Object.entries(config)) {
                if (!value) {
                    falses.push(key);
                }
            }
            return falses.join(', ');
        }
        for (const config of configs) {
            const calledHooks = [];
            const { Hooks, One, Two } = _elements(config, calledHooks);
            function _expected(config) {
                let oneLoaded = false;
                let twoChecked = false;
                // let twoLoaded = false;
                const expected = [];
                expected.push('Hooks:my-one:canLoad');
                if (!config.Hooks_canLoad) {
                    expected.push('Hooks:my-two:canLoad');
                    return expected;
                }
                expected.push('VM:my-one:canLoad');
                if (config.One_canLoad) {
                    expected.push('Hooks:my-one:loading', 'VM:my-one:loading', 'VM:my-one:binding');
                    oneLoaded = true;
                    expected.push('Hooks:my-one:canUnload');
                    if (!config.Hooks_canUnload) {
                        expected.push('Hooks:my-one:canUnload');
                        return expected;
                    }
                    expected.push('VM:my-one:canUnload');
                    if (!config.One_canUnload) {
                        expected.push('Hooks:my-one:canUnload');
                        expected.push('VM:my-one:canUnload');
                        return expected;
                    }
                    expected.push('Hooks:my-two:canLoad');
                    expected.push('VM:my-two:canLoad');
                    twoChecked = true;
                    if (config.Two_canLoad) {
                        expected.push('Hooks:my-one:unloading', 'VM:my-one:unloading');
                        // one = false;
                        expected.push('Hooks:my-two:loading', 'VM:my-two:loading', 'VM:my-two:binding');
                        // twoLoaded = true;
                        expected.push('Hooks:my-two:canUnload');
                        expected.push('VM:my-two:canUnload');
                        if (config.Two_canUnload) {
                            expected.push('Hooks:my-two:unloading', 'VM:my-two:unloading');
                            // two = false;
                        }
                        // if (config.Hooks_canUnload) {
                        // }
                    }
                    // if (config.Hooks_canLoad) {
                    // }
                }
                if (!oneLoaded && !twoChecked) {
                    expected.push('Hooks:my-two:canLoad');
                    expected.push('VM:my-two:canLoad');
                    if (config.Two_canLoad) {
                        expected.push('Hooks:my-two:loading', 'VM:my-two:loading', 'VM:my-two:binding');
                        // twoLoaded = true;
                        expected.push('Hooks:my-two:canUnload');
                        if (config.Hooks_canUnload) {
                            expected.push('VM:my-two:canUnload');
                            if (config.Two_canUnload) {
                                expected.push('Hooks:my-two:unloading', 'VM:my-two:unloading');
                                // two = false;
                            }
                        }
                    }
                    // if (config.Hooks_canLoad) {
                    // }
                }
                return expected;
            }
            it(`with hook and vm (falses: ${_falses(config)})`, async function () {
                const { platform, router, $teardown } = await $setup({}, [Hooks, One, Two]);
                const expected = _expected(config);
                await $load('/my-one', router, platform);
                await $load('/my-two', router, platform);
                await $load('-', router, platform);
                assert.strictEqual(calledHooks.join('|'), expected.join('|'), `calledHooks`);
                await $teardown();
            });
        }
        for (const config of configs) {
            const calledHooks = [];
            const { Hooks, One, Two } = _elements(config, calledHooks);
            function _expected(config) {
                const expected = ['Hooks:my-one:canLoad'];
                if (!config.Hooks_canLoad)
                    return expected;
                expected.push('VM:my-one:canLoad');
                if (!config.One_canLoad)
                    return expected;
                expected.push('Hooks:my-one:loading', 'VM:my-one:loading', 'VM:my-one:binding', 'Hooks:my-two:canLoad');
                // if (!config.Hooks_canLoad) return expected;
                expected.push('VM:my-two:canLoad');
                if (!config.Two_canLoad) {
                    expected.push('Hooks:my-one:canUnload', 'VM:my-one:canUnload', 'Hooks:my-one:unloading', 'VM:my-one:unloading');
                    return expected;
                }
                expected.push('Hooks:my-two:loading', 'VM:my-two:loading', 'VM:my-two:binding');
                expected.push('Hooks:my-two:canUnload');
                if (!config.Hooks_canUnload)
                    return expected;
                expected.push('VM:my-two:canUnload');
                if (!config.Two_canUnload)
                    return expected;
                expected.push('Hooks:my-one:canUnload');
                // if (!config.Hooks_canUnload) return expected;
                expected.push('VM:my-one:canUnload');
                if (!config.One_canUnload)
                    return expected;
                expected.push('Hooks:my-two:unloading', 'VM:my-two:unloading', 'Hooks:my-one:unloading', 'VM:my-one:unloading');
                return expected;
            }
            it(`in parent-child with hook and vm (falses: ${_falses(config)})`, async function () {
                const { platform, router, $teardown } = await $setup({}, [Hooks, One, Two]);
                await $load('/my-one/my-two', router, platform);
                await $load('-', router, platform);
                const expected = _expected(config);
                assert.strictEqual(calledHooks.join('|'), expected.join('|'), `calledHooks`);
                await $teardown();
            });
        }
    });
});
const $load = async (path, router, platform) => {
    await router.load(path);
    platform.domWriteQueue.flush();
};
//# sourceMappingURL=router.lifecycle-hooks.spec.js.map