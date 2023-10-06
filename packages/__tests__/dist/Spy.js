import { assert } from '@aurelia/testing';
export class Spy {
    constructor() {
        this.callRecords = new Map();
    }
    getMock(objectToMock) {
        const spy = this;
        return new Proxy(objectToMock, {
            get(target, propertyKey, _receiver) {
                const original = target[propertyKey];
                return typeof original !== 'function'
                    ? original
                    : function (...args) {
                        spy.setCallRecord(propertyKey, args);
                        return original.apply(this, args);
                    };
            }
        });
    }
    setCallRecord(methodName, args) {
        let record = this.callRecords.get(methodName);
        if (record) {
            record.push(args);
        }
        else {
            record = [args];
        }
        this.callRecords.set(methodName, record);
    }
    clearCallRecords() { this.callRecords.clear(); }
    methodCalledTimes(methodName, times) {
        const calls = this.callRecords.get(methodName);
        if (times !== 0) {
            assert.notEqual(calls, undefined);
            assert.equal(calls.length, times);
        }
        else {
            assert.equal(calls, undefined);
        }
    }
    methodCalledOnceWith(methodName, expectedArgs) {
        this.methodCalledTimes(methodName, 1);
        this.methodCalledNthTimeWith(methodName, 1, expectedArgs);
    }
    methodCalledNthTimeWith(methodName, n, expectedArgs) {
        const calls = this.callRecords.get(methodName);
        assert.deepEqual(calls[n - 1], expectedArgs);
    }
}
//# sourceMappingURL=Spy.js.map