import { startup } from './app/startup.js';
import { ProxyObservable } from '@aurelia/runtime';
import { CustomElement } from '@aurelia/runtime-html';
import { assert, fail } from '@aurelia/testing';
export function createTestFunction(testFunction, startupConfiguration) {
    return async function () {
        const ctx = await startup(startupConfiguration);
        try {
            await testFunction(ctx);
        }
        catch (e) {
            fail(e);
        }
        finally {
            await ctx.tearDown();
        }
    };
}
export function $it(title, testFunction, startupConfiguration) {
    it(title, createTestFunction(testFunction, startupConfiguration));
}
$it.skip = function (title, testFunction, startupConfiguration) {
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip(title, createTestFunction(testFunction, startupConfiguration));
};
$it.only = function (title, testFunction, startupConfiguration) {
    // eslint-disable-next-line mocha/no-exclusive-tests
    it.only(title, createTestFunction(testFunction, startupConfiguration));
};
export function getViewModel(element) {
    const { viewModel } = CustomElement.for(element);
    return viewModel;
}
export function assertCalls(calls, fromIndex, instance, expectedCalls, unexpectedCalls, message) {
    const recentCalls = new Set(calls.slice(fromIndex).map(c => Object.is(ProxyObservable.unwrap(c.instance), instance) && c.method));
    for (const expectedCall of expectedCalls) {
        assert.equal(recentCalls.has(expectedCall), true, `${message || ''} expected ${expectedCall}`);
    }
    for (const expectedCall of unexpectedCalls) {
        assert.equal(recentCalls.has(expectedCall), false, `${message || ''} not expected ${expectedCall}`);
    }
}
//# sourceMappingURL=util.js.map