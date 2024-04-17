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
import { subscriberCollection } from '@aurelia/runtime';
import { createSpy, assert } from '@aurelia/testing';
let Test = (() => {
    let _classDecorators = [subscriberCollection()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Test = _classThis = class {
    };
    __setFunctionName(_classThis, "Test");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Test = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Test = _classThis;
})();
describe('2-runtime/subscriber-collection.spec.ts', function () {
    it('[UNIT] calls subscribers', function () {
        const observer = new Test();
        const observer2 = new Test();
        const callable1 = { handleChange: createSpy() };
        observer.subs.add(callable1);
        const callable2 = { handleChange: createSpy() };
        observer.subs.add(callable2);
        const callable3 = { handleChange: createSpy() };
        observer.subs.add(callable3);
        const callable4 = {
            handleChange: createSpy(() => observer2.subs.notify('new value2', 'old value2'))
        };
        observer.subs.add(callable4);
        const callable5 = { handleChange: createSpy() };
        observer.subs.add(callable5);
        const callable6 = { handleChange: createSpy() };
        observer2.subs.add(callable6);
        const callable7 = { handleChange: createSpy() };
        observer2.subs.add(callable7);
        const callable8 = { handleChange: createSpy() };
        observer2.subs.add(callable8);
        const callable9 = { handleChange: createSpy() };
        observer2.subs.add(callable9);
        const callable10 = { handleChange: createSpy() };
        observer2.subs.add(callable10);
        observer.subs.notify('new value', 'old value');
        assert.deepStrictEqual(callable1.handleChange.calls, [
            ['new value', 'old value'],
        ], `callable1.handleChange`);
        assert.deepStrictEqual(callable2.handleChange.calls, [
            ['new value', 'old value'],
        ], `callable2.handleChange`);
        assert.deepStrictEqual(callable3.handleChange.calls, [
            ['new value', 'old value'],
        ], `callable3.handleChange`);
        assert.deepStrictEqual(callable4.handleChange.calls, [
            ['new value', 'old value'],
        ], `callable4.handleChange`);
        assert.deepStrictEqual(callable5.handleChange.calls, [
            ['new value', 'old value'],
        ], `callable5.handleChange`);
        assert.deepStrictEqual(callable6.handleChange.calls, [
            ['new value2', 'old value2'],
        ], `callable6.handleChange`);
        assert.deepStrictEqual(callable7.handleChange.calls, [
            ['new value2', 'old value2'],
        ], `callable7.handleChange`);
        assert.deepStrictEqual(callable8.handleChange.calls, [
            ['new value2', 'old value2'],
        ], `callable8.handleChange`);
        assert.deepStrictEqual(callable9.handleChange.calls, [
            ['new value2', 'old value2'],
        ], `callable9.handleChange`);
        assert.deepStrictEqual(callable10.handleChange.calls, [
            ['new value2', 'old value2'],
        ], `callable10.handleChange`);
    });
    it('removes subscribers', function () {
        const observer = new Test();
        const subscribers = [];
        for (let i = 0, ii = 100; ii > i; ++i) {
            observer.subs.add((subscribers[i] = { i }));
        }
        let removalCount = 0;
        for (let i = 4, ii = subscribers.length; ii > i; i += 5) {
            observer.subs.remove(subscribers[i]);
            removalCount++;
        }
        assert.strictEqual(removalCount, 20);
        assert.strictEqual(observer.subs.count, subscribers.length - removalCount, `observer.subs.count`);
        assert.strictEqual(observer.subs.remove({}), false, `observer.subs.remove({} as any)`);
    });
});
//# sourceMappingURL=subscriber-collection.spec.js.map