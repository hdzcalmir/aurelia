var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Aurelia, customElement, IPlatform, Controller, CustomElement, } from '@aurelia/runtime-html';
import { assert, TestContext } from '@aurelia/testing';
describe('3-runtime-html/controller.host-sharing.integration.spec.ts', function () {
    function createFixture() {
        const ctx = TestContext.create();
        const { container } = ctx;
        const p = container.get(IPlatform);
        const host = ctx.createElement('div');
        const au = new Aurelia(container);
        return { p, au, host };
    }
    const specs = [
        {
            // nothing (control test)
            toString() { return `nothing`; },
        },
        {
            shadowOptions: { mode: 'open' },
            toString() { return `shadowOptions: { mode: 'open' }`; },
        },
        {
            shadowOptions: { mode: 'closed' },
            toString() { return `shadowOptions: { mode: 'closed' }`; },
        },
        {
            containerless: true,
            toString() { return `containerless: true`; },
        },
    ];
    for (const parentSpec of specs) {
        describe(`parentSpec: ${parentSpec}`, function () {
            for (const childSpec of specs) {
                describe(`childSpec: ${childSpec}`, function () {
                    it(`can activate/deactivate twice with the same outcomes`, async function () {
                        const { au, host } = createFixture();
                        let TheChild = class TheChild {
                        };
                        TheChild = __decorate([
                            customElement({ ...childSpec, name: 'the-child', template: `child` })
                        ], TheChild);
                        let TheParent = class TheParent {
                            created(controller) {
                                const container = controller.container;
                                this.childController = Controller.$el(container, container.get(CustomElement.keyFrom('the-child')), controller.host, null);
                            }
                            attaching(initiator) {
                                // No async hooks so all of these are synchronous.
                                void this.childController.activate(initiator, this.$controller);
                            }
                            detaching(initiator) {
                                void this.childController.deactivate(initiator, this.$controller);
                            }
                            activateChild() {
                                void this.childController.activate(this.childController, this.$controller);
                            }
                            deactivateChild() {
                                void this.childController.deactivate(this.childController, this.$controller);
                            }
                        };
                        TheParent = __decorate([
                            customElement({ ...parentSpec, name: 'the-parent', template: `parent`, dependencies: [TheChild] })
                        ], TheParent);
                        let TheApp = class TheApp {
                        };
                        TheApp = __decorate([
                            customElement({ name: 'the-app', template: `<the-parent></the-parent>`, dependencies: [TheParent] })
                        ], TheApp);
                        au.app({ host, component: TheApp });
                        const theApp = au.root.controller.children[0].viewModel;
                        await au.start();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after start() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #1`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #2`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #2`);
                        await au.stop();
                        assert.visibleTextEqual(host, ``, `visible text after stop() #1`);
                        await au.start();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after start() #2`);
                        assert.visibleTextEqual(host, `parentchild`, `visible text after start() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #1`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #1`);
                        theApp.deactivateChild();
                        assert.visibleTextEqual(host, `parent`, `visible text after deactivateChild() #2`);
                        theApp.activateChild();
                        assert.visibleTextEqual(host, `parentchild`, `visible text after activateChild() #2`);
                        await au.stop(true);
                    });
                });
            }
        });
    }
});
//# sourceMappingURL=controller.host-sharing.integration.spec.js.map