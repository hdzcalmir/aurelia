var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { pluck, distinctUntilChanged } from "rxjs/operators";
import { customElement, IWindow } from '@aurelia/runtime-html';
import { assert } from "@aurelia/testing";
import { DI, Registration } from '@aurelia/kernel';
import { STORE, Store, connectTo } from '@aurelia/store-v1';
import { createCallCounter, createDI } from "./helpers.js";
function arrange(Component) {
    const initialState = { foo: 'Lorem', bar: 'Ipsum' };
    const container = DI.createContainer();
    const { logger, storeWindow } = createDI();
    const store = new Store(initialState, logger, storeWindow);
    container.register(Registration.instance(Store, store), Registration.instance(IWindow, storeWindow));
    STORE.container = container;
    const sut = new Component();
    return { initialState, store, sut };
}
describe("store-v1/decorator.spec.ts", function () {
    it("should lazy load the store inside the decorator", function () {
        let ConnectToVm = class ConnectToVm {
        };
        ConnectToVm = __decorate([
            customElement({
                name: 'connect-to-vm',
                template: `<template></template>`
            }),
            connectTo()
        ], ConnectToVm);
        const { sut } = arrange(ConnectToVm);
        assert.equal(typeof sut.binding, "function");
    });
    it("should be possible to decorate a class and assign the subscribed result to the state property", function () {
        let DemoStoreConsumer = class DemoStoreConsumer {
        };
        DemoStoreConsumer = __decorate([
            connectTo()
        ], DemoStoreConsumer);
        const { initialState, sut } = arrange(DemoStoreConsumer);
        assert.equal(sut.state, undefined);
        sut.binding();
        assert.equal(sut.state, initialState);
        assert.notEqual(sut._stateSubscriptions, undefined);
    });
    it("should be possible to provide a state selector", function () {
        let DemoStoreConsumer = class DemoStoreConsumer {
        };
        DemoStoreConsumer = __decorate([
            connectTo((store) => store.state.pipe(pluck("bar")))
        ], DemoStoreConsumer);
        const { initialState, sut } = arrange(DemoStoreConsumer);
        assert.equal(sut.state, undefined);
        sut.binding();
        assert.equal(sut.state, initialState.bar);
    });
    describe("with a complex settings object", function () {
        it("should be possible to provide a selector", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: (store) => store.state.pipe(pluck("bar"))
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            assert.equal(sut.state, initialState.bar);
        });
        it("should be possible to provide an undefined selector and still get the state property", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: undefined
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            assert.equal(sut.state, initialState);
        });
        it("should be possible to provide an object with multiple selectors", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: {
                        barTarget: (store) => store.state.pipe(pluck("bar")),
                        fooTarget: (store) => store.state.pipe(pluck("foo"))
                    }
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.state, undefined);
            assert.equal(sut.barTarget, initialState.bar);
            assert.equal(sut.fooTarget, initialState.foo);
        });
        it("should use the default state observable if selector does not return an observable", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: () => "foobar"
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            assert.equal(sut.state, initialState);
        });
        it("should be possible to override the target property", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: (store) => store.state.pipe(pluck("bar")),
                    target: "foo"
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.foo, undefined);
            sut.binding();
            assert.equal(sut['state'], undefined);
            assert.equal(sut.foo, initialState.bar);
        });
        it("should be possible to use the target as the parent object for the multiple selector targets", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: {
                        barTarget: (store) => store.state.pipe(pluck("bar")),
                        fooTarget: (store) => store.state.pipe(pluck("foo"))
                    },
                    target: "foo"
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.foo, undefined);
            sut.binding();
            assert.equal(sut['state'], undefined);
            assert.notEqual(sut.foo, undefined);
            assert.notEqual(sut.foo['barTarget'], undefined);
            assert.notEqual(sut.foo['fooTarget'], undefined);
            assert.equal(sut.foo['barTarget'], initialState.bar);
            assert.equal(sut.foo['fooTarget'], initialState.foo);
        });
    });
    it("should apply original binding method after patch", function () {
        let DemoStoreConsumer = class DemoStoreConsumer {
            constructor() {
                this.test = "";
            }
            binding() {
                this.test = "foobar";
            }
        };
        DemoStoreConsumer = __decorate([
            connectTo()
        ], DemoStoreConsumer);
        const { initialState, sut } = arrange(DemoStoreConsumer);
        sut.binding();
        assert.equal(sut.state, initialState);
        assert.equal(sut.test, "foobar");
    });
    describe("the unbinding lifecycle-method", function () {
        it("should apply original unbinding method after patch", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
                constructor() {
                    this.test = "";
                }
                unbinding() {
                    this.test = "foobar";
                }
            };
            DemoStoreConsumer = __decorate([
                connectTo()
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.state, initialState);
            sut.unbinding();
            assert.equal(sut.test, "foobar");
        });
        it("should automatically unsubscribe when unbinding is called", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo()
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            const subscriptions = sut._stateSubscriptions;
            assert.equal(subscriptions.length, 1);
            const subscription = subscriptions[0];
            const { spyObj } = createCallCounter(subscription, "unsubscribe");
            assert.equal(sut.state, initialState);
            assert.equal(subscription.closed, false);
            sut.unbinding();
            assert.notEqual(subscription, undefined);
            assert.equal(subscription.closed, true);
            assert.greaterThanOrEqualTo(spyObj.callCounter, 1);
        });
        it("should automatically unsubscribe from all sources when unbinding is called", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: {
                        barTarget: (store) => store.state.pipe(pluck("bar")),
                        stateTarget: () => "foo"
                    }
                })
            ], DemoStoreConsumer);
            const { sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            const subscriptions = sut._stateSubscriptions;
            assert.equal(subscriptions.length, 2);
            const { spyObj: spyObj1 } = createCallCounter(subscriptions[0], "unsubscribe");
            const { spyObj: spyObj2 } = createCallCounter(subscriptions[1], "unsubscribe");
            assert.equal(subscriptions[0].closed, false);
            assert.equal(subscriptions[1].closed, false);
            sut.unbinding();
            assert.notEqual(subscriptions[0], undefined);
            assert.notEqual(subscriptions[1], undefined);
            assert.equal(subscriptions[0].closed, true);
            assert.equal(subscriptions[1].closed, true);
            assert.greaterThanOrEqualTo(spyObj1.callCounter, 1);
            assert.greaterThanOrEqualTo(spyObj2.callCounter, 1);
        });
        it("should not unsubscribe if subscription is already closed", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo()
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            const subscriptions = sut._stateSubscriptions;
            assert.equal(subscriptions.length, 1);
            const subscription = subscriptions[0];
            subscription.unsubscribe();
            assert.equal(sut.state, initialState);
            assert.equal(subscription.closed, true);
            const { spyObj } = createCallCounter(subscription, "unsubscribe");
            sut.unbinding();
            assert.notEqual(subscription, undefined);
            assert.equal(spyObj.callCounter, 0);
        });
        [null, {}].forEach((stateSubscription) => {
            it("should not unsubscribe if state subscription changes and is not an array", function () {
                let DemoStoreConsumer = class DemoStoreConsumer {
                };
                DemoStoreConsumer = __decorate([
                    connectTo()
                ], DemoStoreConsumer);
                const { sut } = arrange(DemoStoreConsumer);
                assert.equal(sut.state, undefined);
                sut.binding();
                const subscriptions = sut._stateSubscriptions;
                sut._stateSubscriptions = stateSubscription;
                const subscription = subscriptions[0];
                const { spyObj } = createCallCounter(subscription, "unsubscribe");
                sut.unbinding();
                assert.notEqual(subscription, undefined);
                assert.equal(spyObj.callCounter, 0);
            });
        });
    });
    describe("with custom setup and teardown settings", function () {
        it("should return the value from the original setup / teardown functions", function () {
            const expectedbindingResult = "foo";
            const expectedunbindingResult = "bar";
            let DemoStoreConsumer = class DemoStoreConsumer {
                binding() {
                    return expectedbindingResult;
                }
                unbinding() {
                    return expectedunbindingResult;
                }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: (store) => store.state
                })
            ], DemoStoreConsumer);
            const { sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.binding(), expectedbindingResult);
            assert.equal(sut.unbinding(), expectedunbindingResult);
        });
        it("should allow to specify a lifecycle hook for the subscription", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: (store) => store.state,
                    setup: "created"
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.notEqual(sut.created, undefined);
            sut.created();
            assert.equal(sut.state, initialState);
            assert.notEqual(sut._stateSubscriptions, undefined);
        });
        it("should allow to specify a lifecycle hook for the unsubscription", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: (store) => store.state,
                    teardown: "detached"
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            const subscriptions = sut._stateSubscriptions;
            assert.equal(subscriptions.length, 1);
            const subscription = subscriptions[0];
            const { spyObj } = createCallCounter(subscription, "unsubscribe");
            assert.equal(sut.state, initialState);
            assert.equal(subscription.closed, false);
            assert.notEqual(sut.detached, undefined);
            sut.detached();
            assert.notEqual(subscription, undefined);
            assert.equal(subscription.closed, true);
            assert.greaterThanOrEqualTo(spyObj.callCounter, 1);
        });
    });
    describe("with handling changes", function () {
        it("should call stateChanged when exists on VM by default", function () {
            const oldState = { foo: "a", bar: "b" };
            let DemoStoreConsumer = class DemoStoreConsumer {
                constructor() {
                    this.state = oldState;
                }
                stateChanged(state) { return state; }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: (store) => store.state,
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            const { spyObj } = createCallCounter(sut, "stateChanged");
            sut.binding();
            assert.equal(sut.state, initialState);
            assert.equal(spyObj.callCounter, 1);
            assert.equal(spyObj.lastArgs[0], initialState);
            assert.equal(spyObj.lastArgs[1], oldState);
        });
        it("should accept a string for onChanged and call the respective handler passing the new state", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
                stateChanged(state) { return state; }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    onChanged: "stateChanged",
                    selector: (store) => store.state,
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            const { spyObj } = createCallCounter(sut, "stateChanged");
            sut.binding();
            assert.equal(sut.state, initialState);
            assert.equal(spyObj.callCounter, 1);
            assert.equal(spyObj.lastArgs[0], initialState);
            assert.equal(spyObj.lastArgs[1], undefined);
        });
        it("should be called before assigning the new state, so there is still access to the previous state", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
                stateChanged(state) {
                    assert.equal(sut.state, undefined);
                    assert.equal(state, initialState);
                }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    onChanged: "stateChanged",
                    selector: (store) => store.state,
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
        });
        it("should call the targetChanged handler on the VM, if existing, with the new and old state", function () {
            let targetValOnChange = null;
            let DemoStoreConsumer = class DemoStoreConsumer {
                constructor() {
                    this.targetProp = "foobar";
                }
                targetPropChanged() {
                    targetValOnChange = sut.targetProp;
                }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: {
                        targetProp: (store) => store.state
                    }
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            const { spyObj } = createCallCounter(sut, "targetPropChanged");
            sut.binding();
            assert.equal(targetValOnChange, "foobar");
            assert.equal(sut.targetProp, initialState);
            assert.equal(spyObj.callCounter, 1);
            assert.equal(spyObj.lastArgs[0], initialState);
            assert.equal(spyObj.lastArgs[1], "foobar");
            spyObj.reset();
        });
        it("should call the propertyChanged handler on the VM, if existing, with the new and old state", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
                constructor() {
                    this.targetProp = "foobar";
                }
                propertyChanged(prop, state, value) {
                    assert.equal(initialState, state);
                    assert.equal(prop, "targetProp");
                    assert.equal(value, "foobar");
                }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: {
                        targetProp: (store) => store.state
                    }
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.targetProp, initialState);
        });
        it("should call all change handlers on the VM, if existing, in order and with the correct args", function () {
            const calledHandlersInOrder = [];
            let DemoStoreConsumer = class DemoStoreConsumer {
                constructor() {
                    this.targetProp = "foobar";
                }
                customHandler(state, value) {
                    calledHandlersInOrder.push("customHandler");
                    assert.equal(initialState, state);
                    assert.equal(value, "foobar");
                }
                targetPropChanged(state, value) {
                    calledHandlersInOrder.push("targetPropChanged");
                    assert.equal(initialState, state);
                    assert.equal(value, "foobar");
                }
                propertyChanged(targetProp, state, value) {
                    calledHandlersInOrder.push("propertyChanged");
                    assert.equal(targetProp, "targetProp");
                    assert.equal(initialState, state);
                    assert.equal(value, "foobar");
                }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    onChanged: "customHandler",
                    selector: {
                        targetProp: (store) => store.state
                    }
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.targetProp, initialState);
            assert.deepEqual(calledHandlersInOrder, ["customHandler", "targetPropChanged", "propertyChanged"]);
        });
        it("should call the targetOnChanged handler and not each multiple selector, if existing, with the 3 args", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
                constructor() {
                    this.foo = {
                        targetProp: "foobar"
                    };
                }
                targetPropChanged() { }
                fooChanged(targetProp, state, value) {
                    assert.equal(targetProp, "targetProp");
                    assert.equal(initialState, state);
                    assert.equal(value, "foobar");
                }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    target: "foo",
                    selector: {
                        targetProp: (store) => store.state
                    }
                })
            ], DemoStoreConsumer);
            const { initialState, sut } = arrange(DemoStoreConsumer);
            const { spyObj } = createCallCounter(sut, "targetPropChanged");
            sut.binding();
            assert.equal(sut.foo.targetProp, initialState);
            assert.equal(spyObj.callCounter, 0);
        });
        it("should call changed handler for multiple selectors only when their state slice is affected", async function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
                constructor() {
                    this.barCalls = 0;
                    this.fooCalls = 0;
                }
                barChanged() { this.barCalls++; }
                fooChanged() { this.fooCalls++; }
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    selector: {
                        foo: (pStore) => pStore.state.pipe(pluck("foo"), distinctUntilChanged()),
                        bar: (pStore) => pStore.state.pipe(pluck("bar"), distinctUntilChanged())
                    }
                })
            ], DemoStoreConsumer);
            const { store, sut } = arrange(DemoStoreConsumer);
            const changeOnlyBar = (state) => ({ ...state, bar: "changed" });
            store.registerAction("changeOnlyBar", changeOnlyBar);
            sut.binding();
            await store.dispatch(changeOnlyBar);
            assert.equal(sut.barCalls, 2);
            assert.equal(sut.fooCalls, 1);
        });
        it("should check whether the method exists before calling it and throw a meaningful error", function () {
            let DemoStoreConsumer = class DemoStoreConsumer {
            };
            DemoStoreConsumer = __decorate([
                connectTo({
                    onChanged: "stateChanged",
                    selector: (store) => store.state,
                })
            ], DemoStoreConsumer);
            const { sut } = arrange(DemoStoreConsumer);
            assert.throws(() => sut.binding());
        });
    });
});
//# sourceMappingURL=decorator.spec.js.map