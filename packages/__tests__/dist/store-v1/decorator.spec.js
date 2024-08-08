var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { map, distinctUntilChanged } from "rxjs/operators";
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
        let ConnectToVm = (() => {
            let _classDecorators = [customElement({
                    name: 'connect-to-vm',
                    template: `<template></template>`
                }), connectTo()];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var ConnectToVm = _classThis = class {
            };
            __setFunctionName(_classThis, "ConnectToVm");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ConnectToVm = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return ConnectToVm = _classThis;
        })();
        const { sut } = arrange(ConnectToVm);
        assert.equal(typeof sut.binding, "function");
    });
    it("should be possible to decorate a class and assign the subscribed result to the state property", function () {
        let DemoStoreConsumer = (() => {
            let _classDecorators = [connectTo()];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var DemoStoreConsumer = _classThis = class {
            };
            __setFunctionName(_classThis, "DemoStoreConsumer");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                DemoStoreConsumer = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return DemoStoreConsumer = _classThis;
        })();
        const { initialState, sut } = arrange(DemoStoreConsumer);
        assert.equal(sut.state, undefined);
        sut.binding();
        assert.equal(sut.state, initialState);
        assert.notEqual(sut._stateSubscriptions, undefined);
    });
    it("should be possible to provide a state selector", function () {
        let DemoStoreConsumer = (() => {
            let _classDecorators = [connectTo((store) => store.state.pipe(map(x => x.bar)))];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var DemoStoreConsumer = _classThis = class {
            };
            __setFunctionName(_classThis, "DemoStoreConsumer");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                DemoStoreConsumer = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return DemoStoreConsumer = _classThis;
        })();
        const { initialState, sut } = arrange(DemoStoreConsumer);
        assert.equal(sut.state, undefined);
        sut.binding();
        assert.equal(sut.state, initialState.bar);
    });
    describe("with a complex settings object", function () {
        it("should be possible to provide a selector", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: (store) => store.state.pipe(map(x => x.bar))
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            assert.equal(sut.state, initialState.bar);
        });
        it("should be possible to provide an undefined selector and still get the state property", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: undefined
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            assert.equal(sut.state, initialState);
        });
        it("should be possible to provide an object with multiple selectors", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: {
                            barTarget: (store) => store.state.pipe(map(x => x.bar)),
                            fooTarget: (store) => store.state.pipe(map(x => x.foo))
                        }
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.state, undefined);
            assert.equal(sut.barTarget, initialState.bar);
            assert.equal(sut.fooTarget, initialState.foo);
        });
        it("should use the default state observable if selector does not return an observable", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: () => "foobar"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.state, undefined);
            sut.binding();
            assert.equal(sut.state, initialState);
        });
        it("should be possible to override the target property", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: (store) => store.state.pipe(map(x => x.bar)),
                        target: "foo"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.foo, undefined);
            sut.binding();
            assert.equal(sut['state'], undefined);
            assert.equal(sut.foo, initialState.bar);
        });
        it("should be possible to use the target as the parent object for the multiple selector targets", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: {
                            barTarget: (store) => store.state.pipe(map(x => x.bar)),
                            fooTarget: (store) => store.state.pipe(map(x => x.foo))
                        },
                        target: "foo"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
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
        let DemoStoreConsumer = (() => {
            let _classDecorators = [connectTo()];
            let _classDescriptor;
            let _classExtraInitializers = [];
            let _classThis;
            var DemoStoreConsumer = _classThis = class {
                constructor() {
                    this.test = "";
                }
                binding() {
                    this.test = "foobar";
                }
            };
            __setFunctionName(_classThis, "DemoStoreConsumer");
            (() => {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                DemoStoreConsumer = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            })();
            return DemoStoreConsumer = _classThis;
        })();
        const { initialState, sut } = arrange(DemoStoreConsumer);
        sut.binding();
        assert.equal(sut.state, initialState);
        assert.equal(sut.test, "foobar");
    });
    describe("the unbinding lifecycle-method", function () {
        it("should apply original unbinding method after patch", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    constructor() {
                        this.test = "";
                    }
                    unbinding() {
                        this.test = "foobar";
                    }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.state, initialState);
            sut.unbinding();
            assert.equal(sut.test, "foobar");
        });
        it("should automatically unsubscribe when unbinding is called", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
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
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: {
                            barTarget: (store) => store.state.pipe(map(x => x.bar)),
                            stateTarget: () => "foo"
                        }
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
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
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo()];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
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
                let DemoStoreConsumer = (() => {
                    let _classDecorators = [connectTo()];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    var DemoStoreConsumer = _classThis = class {
                    };
                    __setFunctionName(_classThis, "DemoStoreConsumer");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        DemoStoreConsumer = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return DemoStoreConsumer = _classThis;
                })();
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
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: (store) => store.state
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    binding() {
                        return expectedbindingResult;
                    }
                    unbinding() {
                        return expectedunbindingResult;
                    }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { sut } = arrange(DemoStoreConsumer);
            assert.equal(sut.binding(), expectedbindingResult);
            assert.equal(sut.unbinding(), expectedunbindingResult);
        });
        it("should allow to specify a lifecycle hook for the subscription", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: (store) => store.state,
                        setup: "created"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            assert.notEqual(sut.created, undefined);
            sut.created();
            assert.equal(sut.state, initialState);
            assert.notEqual(sut._stateSubscriptions, undefined);
        });
        it("should allow to specify a lifecycle hook for the unsubscription", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: (store) => store.state,
                        teardown: "detached"
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
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
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: (store) => store.state,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    constructor() {
                        this.state = oldState;
                    }
                    stateChanged(state) { return state; }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            const { spyObj } = createCallCounter(sut, "stateChanged");
            sut.binding();
            assert.equal(sut.state, initialState);
            assert.equal(spyObj.callCounter, 1);
            assert.equal(spyObj.lastArgs[0], initialState);
            assert.equal(spyObj.lastArgs[1], oldState);
        });
        it("should accept a string for onChanged and call the respective handler passing the new state", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        onChanged: "stateChanged",
                        selector: (store) => store.state,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    stateChanged(state) { return state; }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            const { spyObj } = createCallCounter(sut, "stateChanged");
            sut.binding();
            assert.equal(sut.state, initialState);
            assert.equal(spyObj.callCounter, 1);
            assert.equal(spyObj.lastArgs[0], initialState);
            assert.equal(spyObj.lastArgs[1], undefined);
        });
        it("should be called before assigning the new state, so there is still access to the previous state", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        onChanged: "stateChanged",
                        selector: (store) => store.state,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    stateChanged(state) {
                        assert.equal(sut.state, undefined);
                        assert.equal(state, initialState);
                    }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
        });
        it("should call the targetChanged handler on the VM, if existing, with the new and old state", function () {
            let targetValOnChange = null;
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: {
                            targetProp: (store) => store.state
                        }
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    constructor() {
                        this.targetProp = "foobar";
                    }
                    targetPropChanged() {
                        targetValOnChange = sut.targetProp;
                    }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
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
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: {
                            targetProp: (store) => store.state
                        }
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    constructor() {
                        this.targetProp = "foobar";
                    }
                    propertyChanged(prop, state, value) {
                        assert.equal(initialState, state);
                        assert.equal(prop, "targetProp");
                        assert.equal(value, "foobar");
                    }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.targetProp, initialState);
        });
        it("should call all change handlers on the VM, if existing, in order and with the correct args", function () {
            const calledHandlersInOrder = [];
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        onChanged: "customHandler",
                        selector: {
                            targetProp: (store) => store.state
                        }
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
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
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            sut.binding();
            assert.equal(sut.targetProp, initialState);
            assert.deepEqual(calledHandlersInOrder, ["customHandler", "targetPropChanged", "propertyChanged"]);
        });
        it("should call the targetOnChanged handler and not each multiple selector, if existing, with the 3 args", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        target: "foo",
                        selector: {
                            targetProp: (store) => store.state
                        }
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
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
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { initialState, sut } = arrange(DemoStoreConsumer);
            const { spyObj } = createCallCounter(sut, "targetPropChanged");
            sut.binding();
            assert.equal(sut.foo.targetProp, initialState);
            assert.equal(spyObj.callCounter, 0);
        });
        it("should call changed handler for multiple selectors only when their state slice is affected", async function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        selector: {
                            foo: (pStore) => pStore.state.pipe(map(x => x.foo), distinctUntilChanged()),
                            bar: (pStore) => pStore.state.pipe(map(x => x.bar), distinctUntilChanged())
                        }
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                    constructor() {
                        this.barCalls = 0;
                        this.fooCalls = 0;
                    }
                    barChanged() { this.barCalls++; }
                    fooChanged() { this.fooCalls++; }
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { store, sut } = arrange(DemoStoreConsumer);
            const changeOnlyBar = (state) => ({ ...state, bar: "changed" });
            store.registerAction("changeOnlyBar", changeOnlyBar);
            sut.binding();
            await store.dispatch(changeOnlyBar);
            assert.equal(sut.barCalls, 2);
            assert.equal(sut.fooCalls, 1);
        });
        it("should check whether the method exists before calling it and throw a meaningful error", function () {
            let DemoStoreConsumer = (() => {
                let _classDecorators = [connectTo({
                        onChanged: "stateChanged",
                        selector: (store) => store.state,
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var DemoStoreConsumer = _classThis = class {
                };
                __setFunctionName(_classThis, "DemoStoreConsumer");
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                    DemoStoreConsumer = _classThis = _classDescriptor.value;
                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return DemoStoreConsumer = _classThis;
            })();
            const { sut } = arrange(DemoStoreConsumer);
            assert.throws(() => sut.binding());
        });
    });
});
//# sourceMappingURL=decorator.spec.js.map