var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Aurelia, customElement } from '@aurelia/runtime-html';
import { assert, TestContext } from '@aurelia/testing';
function createFixture() {
    const ctx = TestContext.create();
    const au = new Aurelia(ctx.container);
    const host = ctx.createElement('div');
    const p = ctx.platform;
    return { au, host, p };
}
describe('3-runtime-html/show.integration.spec.ts', function () {
    describe('show/hide alias works properly', function () {
        it('show + hide', async function () {
            const { au, host, p } = createFixture();
            let App = class App {
                constructor() {
                    this.show = true;
                    this.appliedShow = true;
                    this.hide = false;
                    this.appliedHide = false;
                }
                created() {
                    this.showDiv = this.$controller.nodes.firstChild;
                    this.hideDiv = this.$controller.nodes.lastChild;
                }
                assert(label) {
                    if (this.appliedShow) {
                        assert.strictEqual(this.showDiv.style.getPropertyValue('display'), '', `display should be '' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                        assert.strictEqual(this.showDiv.style.getPropertyPriority('display'), '', `priority should be '' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                    }
                    else {
                        assert.strictEqual(this.showDiv.style.getPropertyValue('display'), 'none', `display should be 'none' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                        assert.strictEqual(this.showDiv.style.getPropertyPriority('display'), 'important', `priority should be 'important' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                    }
                    if (this.appliedHide) {
                        assert.strictEqual(this.hideDiv.style.getPropertyValue('display'), 'none', `display should be 'none' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                        assert.strictEqual(this.hideDiv.style.getPropertyPriority('display'), 'important', `priority should be 'important' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                    }
                    else {
                        assert.strictEqual(this.hideDiv.style.getPropertyValue('display'), '', `display should be '' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                        assert.strictEqual(this.hideDiv.style.getPropertyPriority('display'), '', `priority should be '' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                    }
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: '<div show.bind="show"></div><div hide.bind="hide"></div>' })
            ], App);
            const component = new App();
            au.app({ host, component });
            await au.start();
            component.show = false;
            component.hide = true;
            component.assert(`started after mutating`);
            p.domWriteQueue.flush();
            component.appliedShow = false;
            component.appliedHide = true;
            component.assert(`started after flushing dom writes`);
            await au.stop();
        });
        it('hide + show', async function () {
            const { au, host, p } = createFixture();
            let App = class App {
                constructor() {
                    this.show = true;
                    this.appliedShow = true;
                    this.hide = false;
                    this.appliedHide = false;
                }
                created() {
                    this.hideDiv = this.$controller.nodes.firstChild;
                    this.showDiv = this.$controller.nodes.lastChild;
                }
                assert(label) {
                    if (this.appliedShow) {
                        assert.strictEqual(this.showDiv.style.getPropertyValue('display'), '', `display should be '' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                        assert.strictEqual(this.showDiv.style.getPropertyPriority('display'), '', `priority should be '' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                    }
                    else {
                        assert.strictEqual(this.showDiv.style.getPropertyValue('display'), 'none', `display should be 'none' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                        assert.strictEqual(this.showDiv.style.getPropertyPriority('display'), 'important', `priority should be 'important' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                    }
                    if (this.appliedHide) {
                        assert.strictEqual(this.hideDiv.style.getPropertyValue('display'), 'none', `display should be 'none' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                        assert.strictEqual(this.hideDiv.style.getPropertyPriority('display'), 'important', `priority should be 'important' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                    }
                    else {
                        assert.strictEqual(this.hideDiv.style.getPropertyValue('display'), '', `display should be '' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                        assert.strictEqual(this.hideDiv.style.getPropertyPriority('display'), '', `priority should be '' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                    }
                }
            };
            App = __decorate([
                customElement({ name: 'app', template: '<div hide.bind="hide"></div><div show.bind="show"></div>' })
            ], App);
            const component = new App();
            au.app({ host, component });
            await au.start();
            component.show = false;
            component.hide = true;
            component.assert(`started after mutating`);
            p.domWriteQueue.flush();
            component.appliedShow = false;
            component.appliedHide = true;
            component.assert(`started after flushing dom writes`);
            await au.stop();
        });
    });
    for (const style of [
        {
            tag: 'style="display:block"',
            display: 'block',
        },
        {
            tag: '',
            display: '',
        }
    ]) {
        // Invert value during 'attaching' hook
        for (const attaching of [true, false]) {
            // Invert value during 'attached' hook
            for (const attached of [true, false]) {
                // Invert value during 'detaching' hook
                for (const detaching of [true, false]) {
                    // Invert value during 'unbinding' hook
                    for (const unbinding of [true, false]) {
                        describe('show', function () {
                            // Initial value
                            for (const show of [true, false]) {
                                it(`display:'${style.display}',show:${show},attaching:${attaching},attached:${attached},detaching:${detaching},unbinding:${unbinding}`, async function () {
                                    const { au, host, p } = createFixture();
                                    let run = 1;
                                    let App = class App {
                                        constructor() {
                                            this.show = show;
                                            this.appliedShow = true;
                                        }
                                        created() {
                                            this.div = this.$controller.nodes.firstChild;
                                        }
                                        // No need to invert during 'binding' or 'bound' because child controller activation happens after 'attaching',
                                        // so these would never affect the test outcomes.
                                        binding() {
                                            this.assert(`binding (run ${run})`);
                                        }
                                        bound() {
                                            this.assert(`bound (run ${run})`);
                                        }
                                        attaching() {
                                            this.assert(`attaching initial (run ${run})`);
                                            if (attaching) {
                                                this.show = !this.show;
                                                this.assert(`attaching after mutating (run ${run})`);
                                            }
                                        }
                                        attached() {
                                            this.appliedShow = this.show;
                                            this.assert(`attached initial (run ${run})`);
                                            if (attached) {
                                                this.show = !this.show;
                                                this.assert(`attached after mutating (run ${run})`);
                                            }
                                            p.domWriteQueue.flush();
                                            this.appliedShow = this.show;
                                            this.assert(`attached after flushing dom writes (run ${run})`);
                                        }
                                        detaching() {
                                            this.assert(`detaching initial (run ${run})`);
                                            if (detaching) {
                                                this.show = !this.show;
                                                this.assert(`detaching after mutating (run ${run})`);
                                            }
                                        }
                                        unbinding() {
                                            this.assert(`unbinding initial (run ${run})`);
                                            if (unbinding) {
                                                this.show = !this.show;
                                                this.assert(`unbinding after mutating (run ${run})`);
                                            }
                                        }
                                        assert(label) {
                                            if (this.appliedShow) {
                                                assert.strictEqual(this.div.style.getPropertyValue('display'), style.display, `display should be '' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                                                assert.strictEqual(this.div.style.getPropertyPriority('display'), '', `priority should be '' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                                            }
                                            else {
                                                assert.strictEqual(this.div.style.getPropertyValue('display'), 'none', `display should be 'none' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                                                assert.strictEqual(this.div.style.getPropertyPriority('display'), 'important', `priority should be 'important' at ${label} (show is ${this.show}, appliedShow is ${this.appliedShow})`);
                                            }
                                        }
                                    };
                                    App = __decorate([
                                        customElement({ name: 'app', template: `<div ${style.tag} show.bind="show"></div>` })
                                    ], App);
                                    const component = new App();
                                    au.app({ host, component });
                                    await au.start();
                                    component.show = !component.show;
                                    component.assert(`started after mutating (run ${run})`);
                                    p.domWriteQueue.flush();
                                    component.appliedShow = component.show;
                                    component.assert(`started after flushing dom writes (run ${run})`);
                                    await au.stop();
                                    ++run;
                                    await au.start();
                                    component.show = !component.show;
                                    component.assert(`started after mutating (run ${run})`);
                                    p.domWriteQueue.flush();
                                    component.appliedShow = component.show;
                                    component.assert(`started after flushing dom writes (run ${run})`);
                                    await au.stop();
                                });
                            }
                        });
                        describe('hide', function () {
                            for (const hide of [true, false]) {
                                it(`display:'${style.display}',hide:${hide},attaching:${attaching},attached:${attached},detaching:${detaching},unbinding:${unbinding}`, async function () {
                                    const { au, host, p } = createFixture();
                                    let run = 1;
                                    let App = class App {
                                        constructor() {
                                            this.hide = hide;
                                            this.appliedHide = false;
                                        }
                                        created() {
                                            this.div = this.$controller.nodes.firstChild;
                                        }
                                        // No need to invert during 'binding' or 'bound' because child controller activation happens after 'attaching',
                                        // so these would never affect the test outcomes.
                                        binding() {
                                            this.assert(`binding (run ${run})`);
                                        }
                                        bound() {
                                            this.assert(`bound (run ${run})`);
                                        }
                                        attaching() {
                                            this.assert(`attaching initial (run ${run})`);
                                            if (attaching) {
                                                this.hide = !this.hide;
                                                this.assert(`attaching after mutating (run ${run})`);
                                            }
                                        }
                                        attached() {
                                            this.appliedHide = this.hide;
                                            this.assert(`attached initial (run ${run})`);
                                            if (attached) {
                                                this.hide = !this.hide;
                                                this.assert(`attached after mutating (run ${run})`);
                                            }
                                            p.domWriteQueue.flush();
                                            this.appliedHide = this.hide;
                                            this.assert(`attached after flushing dom writes (run ${run})`);
                                        }
                                        detaching() {
                                            this.assert(`detaching initial (run ${run})`);
                                            if (detaching) {
                                                this.hide = !this.hide;
                                                this.assert(`detaching after mutating (run ${run})`);
                                            }
                                        }
                                        unbinding() {
                                            this.assert(`unbinding initial (run ${run})`);
                                            if (unbinding) {
                                                this.hide = !this.hide;
                                                this.assert(`unbinding after mutating (run ${run})`);
                                            }
                                        }
                                        assert(label) {
                                            if (this.appliedHide) {
                                                assert.strictEqual(this.div.style.getPropertyValue('display'), 'none', `display should be 'none' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                                                assert.strictEqual(this.div.style.getPropertyPriority('display'), 'important', `priority should be 'important' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                                            }
                                            else {
                                                assert.strictEqual(this.div.style.getPropertyValue('display'), style.display, `display should be '' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                                                assert.strictEqual(this.div.style.getPropertyPriority('display'), '', `priority should be '' at ${label} (hide is ${this.hide}, appliedHide is ${this.appliedHide})`);
                                            }
                                        }
                                    };
                                    App = __decorate([
                                        customElement({ name: 'app', template: `<div ${style.tag} hide.bind="hide"></div>` })
                                    ], App);
                                    const component = new App();
                                    au.app({ host, component });
                                    await au.start();
                                    component.hide = !component.hide;
                                    component.assert(`started after mutating (run ${run})`);
                                    p.domWriteQueue.flush();
                                    component.appliedHide = component.hide;
                                    component.assert(`started after flushing dom writes (run ${run})`);
                                    await au.stop();
                                    ++run;
                                    await au.start();
                                    component.hide = !component.hide;
                                    component.assert(`started after mutating (run ${run})`);
                                    p.domWriteQueue.flush();
                                    component.appliedHide = component.hide;
                                    component.assert(`started after flushing dom writes (run ${run})`);
                                    await au.stop();
                                });
                            }
                        });
                    }
                }
            }
        }
    }
    // it.only('test', async function () {
    //   const ctx = TestContext.create();
    //   const { container } = ctx;
    //   const child = container.createChild();
    // });
});
//# sourceMappingURL=show.integration.spec.js.map