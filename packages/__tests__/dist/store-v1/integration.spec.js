var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Aurelia, customElement } from '@aurelia/runtime-html';
import { TestContext, assert } from '@aurelia/testing';
import { StoreConfiguration, Store, connectTo, dispatchify } from "@aurelia/store-v1";
async function createFixture({ component, options, initialState }) {
    const ctx = TestContext.create();
    const host = ctx.platform.document.createElement('app');
    const au = new Aurelia(ctx.container);
    const actualState = typeof initialState === "undefined"
        ? {
            foo: "bar",
            bar: "whatever"
        }
        : initialState;
    await au.register(StoreConfiguration.withInitialState(actualState)
        .withOptions(options))
        .app({ host, component })
        .start();
    const store = au.container.get(Store);
    return {
        container: au.container,
        ctx,
        initialState: actualState,
        store,
        host,
        tearDown: async () => {
            await au.stop();
        }
    };
}
describe("store-v1/integration.spec.ts", function () {
    this.timeout(100);
    it("should allow to use the store without any options by using defaults", async function () {
        let App = class App {
            constructor(store) {
                this.store = store;
                this.storeSubscription = this.store.state.subscribe((state) => this.state = state);
            }
            unbinding() {
                this.storeSubscription.unsubscribe();
            }
        };
        App.inject = [Store];
        App = __decorate([
            customElement({ name: 'app', template: `<span id="sut">\${state.foo}</span>` }),
            __metadata("design:paramtypes", [Store])
        ], App);
        const { store, tearDown, host } = await createFixture({ component: App });
        assert.equal(host.querySelector("#sut").textContent, "bar");
        assert.equal(store['_state'].getValue().foo, "bar");
        await tearDown();
    });
    it("should throw if no initial state was provided", function () {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span id="sut">\${state.foo}</span>` })
        ], App);
        return assert.rejects(() => createFixture({ component: App, initialState: null }));
    });
    it("should inject the proper store for connectTo", async function () {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span id="sut">\${state.foo}</span>` }),
            connectTo()
        ], App);
        const { store, tearDown, host } = await createFixture({ component: App });
        assert.equal(host.querySelector("#sut").textContent, "bar");
        assert.equal(store['_state'].getValue().foo, "bar");
        await tearDown();
    });
    it("should create a proper default state history if option enabled but simple state given", async function () {
        let App = class App {
        };
        App = __decorate([
            customElement({ name: 'app', template: `<span id="sut">\${state.present.foo}</span>` }),
            connectTo()
        ], App);
        const { initialState, store, tearDown, host } = await createFixture({
            component: App,
            options: { history: { undoable: true } }
        });
        assert.equal(host.querySelector("#sut").textContent, "bar");
        assert.deepEqual(store['_state'].getValue(), {
            past: [], present: initialState, future: []
        });
        await tearDown();
    });
    it("should be possible to quickly create dispatchable actions with dispatchify", async function () {
        const changeFoo = (state, newFoo) => {
            return { ...state, foo: newFoo };
        };
        let App = class App {
            constructor(store) {
                this.store = store;
                this.storeSubscription = this.store.state.subscribe((state) => this.state = state);
                this.store.registerAction("changeFoo", changeFoo);
            }
            async changeFoo() {
                await dispatchify(changeFoo)("foobar");
            }
            unbinding() {
                this.storeSubscription.unsubscribe();
            }
        };
        App.inject = [Store];
        App = __decorate([
            customElement({ name: 'app', template: `<span id="sut">\${state.foo}</span>` }),
            __metadata("design:paramtypes", [Store])
        ], App);
        const { host, store, ctx, tearDown } = await createFixture({ component: App });
        assert.equal(host.querySelector("#sut").textContent, "bar");
        assert.equal(store['_state'].getValue().foo, "bar");
        const sut = ctx.container.get(App);
        await sut.changeFoo();
        ctx.platform.domWriteQueue.flush();
        assert.equal(host.querySelector("#sut").textContent, "foobar");
        assert.equal(store['_state'].getValue().foo, "foobar");
        await tearDown();
    });
});
//# sourceMappingURL=integration.spec.js.map