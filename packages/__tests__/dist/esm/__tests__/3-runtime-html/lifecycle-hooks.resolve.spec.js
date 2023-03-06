var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, lifecycleHooks, LifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.resolve.spec.ts', function () {
    it('retrieves global hooks at root', async function () {
        class Hooks {
            attaching() { }
        }
        const { au, startPromise, tearDown } = createFixture(`\${message}`, class App {
        }, [LifecycleHooks.define({}, Hooks)]);
        await startPromise;
        const hooks = au.root.controller.lifecycleHooks;
        assert.strictEqual(hooks.attaching.length, 1);
        await tearDown();
    });
    it('retrieves global hooks at child', async function () {
        class Hooks {
            attaching() { }
        }
        const { au, component, startPromise, tearDown } = createFixture(`<el view-model.ref="el">`, class App {
        }, [
            CustomElement.define({
                name: 'el',
                dependencies: []
            }),
            LifecycleHooks.define({}, Hooks)
        ]);
        await startPromise;
        const hooks = au.root.controller.lifecycleHooks;
        assert.strictEqual(hooks.attaching.length, 1);
        const childHooks = component.el.$controller.lifecycleHooks;
        assert.strictEqual(childHooks.attaching.length, 1);
        await tearDown();
    });
    it('retrieves local hooks at child', async function () {
        class Hooks {
            attaching() { }
        }
        const { au, component, startPromise, tearDown } = createFixture(`<el view-model.ref="el">`, class App {
        }, [
            CustomElement.define({
                name: 'el',
                dependencies: [
                    LifecycleHooks.define({}, Hooks)
                ]
            }),
        ]);
        await startPromise;
        const hooks = au.root.controller.lifecycleHooks;
        assert.notStrictEqual(hooks.attaching?.length, 0);
        const childHooks = component.el.$controller.lifecycleHooks;
        assert.strictEqual(childHooks.attaching.length, 1);
        await tearDown();
    });
    describe('<App/> -> <Child/> -> <Grand Child/>', function () {
        it('does not retrieve hooks in the middle layer', async function () {
            class Hooks {
                attaching() {
                    // empty
                }
            }
            class Hooks2 {
                attaching() {
                    // empty
                }
            }
            class DifferentHooks {
                attaching() {
                    // empty
                }
            }
            class DifferentHooks2 {
                attaching() {
                    // empty
                }
            }
            const { au, component } = await createFixture(`<el view-model.ref="el">`, class App {
            }, [
                CustomElement.define({
                    name: 'el',
                    template: '<el-child view-model.ref="elChild">',
                    dependencies: [
                        LifecycleHooks.define({}, Hooks),
                        LifecycleHooks.define({}, Hooks2),
                        CustomElement.define({
                            name: 'el-child',
                            dependencies: [
                                LifecycleHooks.define({}, DifferentHooks),
                                LifecycleHooks.define({}, DifferentHooks2)
                            ]
                        })
                    ]
                }),
            ]).started;
            const hooks = au.root.controller.lifecycleHooks;
            assert.notStrictEqual(hooks.attaching?.length, 0);
            const childHooks = component.el.$controller.lifecycleHooks;
            assert.strictEqual(childHooks.attaching.length, 2);
            const grandChildHooks = component.el.elChild.$controller.lifecycleHooks;
            assert.strictEqual(grandChildHooks.attaching.length, 2);
            assert.strictEqual(childHooks.attaching.every(x => x.instance instanceof Hooks || x.instance instanceof Hooks2), true);
            assert.strictEqual(grandChildHooks.attaching.every(x => x.instance instanceof DifferentHooks || x.instance instanceof DifferentHooks2), true);
        });
        it('retrieves the same hooks Type twice as declaration', async function () {
            let Hooks = class Hooks {
                attaching() {
                    // empty
                }
            };
            Hooks = __decorate([
                lifecycleHooks()
            ], Hooks);
            let Hooks2 = class Hooks2 {
                attaching() {
                    // empty
                }
            };
            Hooks2 = __decorate([
                lifecycleHooks()
            ], Hooks2);
            let DifferentHooks = class DifferentHooks {
                attaching() {
                    // empty
                }
            };
            DifferentHooks = __decorate([
                lifecycleHooks()
            ], DifferentHooks);
            let DifferentHooks2 = class DifferentHooks2 {
                attaching() {
                    // empty
                }
            };
            DifferentHooks2 = __decorate([
                lifecycleHooks()
            ], DifferentHooks2);
            const { au, component } = await createFixture(`<el view-model.ref="el">`, class App {
            }, [
                CustomElement.define({
                    name: 'el',
                    template: '<el-child view-model.ref="elChild">',
                    dependencies: [
                        Hooks,
                        Hooks2,
                        Hooks,
                        Hooks2,
                        CustomElement.define({
                            name: 'el-child',
                            dependencies: [
                                DifferentHooks,
                                DifferentHooks2,
                                DifferentHooks,
                                DifferentHooks2,
                            ]
                        })
                    ]
                }),
            ]).started;
            const hooks = au.root.controller.lifecycleHooks;
            assert.notStrictEqual(hooks.attaching?.length, 0);
            const childHooks = component.el.$controller.lifecycleHooks;
            assert.strictEqual(childHooks.attaching.length, 4);
            const grandChildHooks = component.el.elChild.$controller.lifecycleHooks;
            assert.strictEqual(grandChildHooks.attaching.length, 4);
            assert.strictEqual(childHooks.attaching.every(x => x.instance instanceof Hooks || x.instance instanceof Hooks2), true);
            assert.strictEqual(grandChildHooks.attaching.every(x => x.instance instanceof DifferentHooks || x.instance instanceof DifferentHooks2), true);
        });
    });
});
//# sourceMappingURL=lifecycle-hooks.resolve.spec.js.map