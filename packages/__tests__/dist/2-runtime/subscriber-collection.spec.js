var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { subscriberCollection } from '@aurelia/runtime';
import { createSpy, assert } from '@aurelia/testing';
let Test = class Test {
};
Test = __decorate([
    subscriberCollection()
], Test);
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