var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { kebabCase, } from '@aurelia/kernel';
import { assert, } from '@aurelia/testing';
import { Router, } from '@aurelia/router';
import { customElement, CustomElement, } from '@aurelia/runtime-html';
import { createFixture, translateOptions } from './_shared/create-fixture.js';
function vp(count, name = '') {
    if (count === 1) {
        return `<au-viewport${name.length > 0 ? ` name="${name}"` : ''}></au-viewport>`;
    }
    let template = '';
    for (let i = 0; i < count; ++i) {
        template = `${template}<au-viewport name="${name}$${i}"></au-viewport>`;
    }
    return template;
}
function name(type) {
    return kebabCase(type.name);
}
function getDefaultHIAConfig() {
    return {
        resolveTimeoutMs: 100,
        resolveLabels: [],
    };
}
function getText(spec) {
    return spec.map(function (x) {
        if (x instanceof Array) {
            return getText(x);
        }
        return kebabCase(x.name);
    }).join('');
}
function assertComponentsVisible(host, spec, msg = '') {
    assert.strictEqual(host.textContent, getText(spec), msg);
}
function assertIsActive(router, instruction, options, expected, assertId) {
    if (options instanceof Router) {
        options = {};
    }
    const isActive = router.checkActive(instruction, options);
    assert.strictEqual(isActive, expected, `expected isActive to return ${expected} (assertId ${assertId})`);
}
describe('router/smoke-tests.spec.ts', function () {
    describe('without any configuration, deps registered globally', function () {
        var A01_1, A02_1, Root1_1, A11_1, A12_1, Root2_1, A21_1, A22_1;
        let A01 = A01_1 = class A01 {
        };
        A01 = A01_1 = __decorate([
            customElement({ name: name(A01_1), template: `${name(A01_1)}${vp(0)}` })
        ], A01);
        let A02 = A02_1 = class A02 {
        };
        A02 = A02_1 = __decorate([
            customElement({ name: name(A02_1), template: `${name(A02_1)}${vp(0)}` })
        ], A02);
        const A0 = [A01, A02];
        let Root1 = Root1_1 = class Root1 {
        };
        Root1 = Root1_1 = __decorate([
            customElement({ name: name(Root1_1), template: `${name(Root1_1)}${vp(1)}` })
        ], Root1);
        let A11 = A11_1 = class A11 {
        };
        A11 = A11_1 = __decorate([
            customElement({ name: name(A11_1), template: `${name(A11_1)}${vp(1)}` })
        ], A11);
        let A12 = A12_1 = class A12 {
        };
        A12 = A12_1 = __decorate([
            customElement({ name: name(A12_1), template: `${name(A12_1)}${vp(1)}` })
        ], A12);
        const A1 = [A11, A12];
        let Root2 = Root2_1 = class Root2 {
        };
        Root2 = Root2_1 = __decorate([
            customElement({ name: name(Root2_1), template: `${name(Root2_1)}${vp(2)}` })
        ], Root2);
        let A21 = A21_1 = class A21 {
        };
        A21 = A21_1 = __decorate([
            customElement({ name: name(A21_1), template: `${name(A21_1)}${vp(2)}` })
        ], A21);
        let A22 = A22_1 = class A22 {
        };
        A22 = A22_1 = __decorate([
            customElement({ name: name(A22_1), template: `${name(A22_1)}${vp(2)}` })
        ], A22);
        const A2 = [A21, A22];
        const A = [...A0, ...A1, ...A2];
        let B01 = class B01 {
            async canUnload(_params, _instruction, _navigation) {
                await new Promise(function (resolve) { setTimeout(resolve, 0); });
                return true;
            }
        };
        B01 = __decorate([
            customElement({ name: 'b01', template: `b01${vp(0)}` })
        ], B01);
        let B02 = class B02 {
            async canUnload(_params, _instruction, _navigation) {
                await new Promise(function (resolve) { setTimeout(resolve, 0); });
                return false;
            }
        };
        B02 = __decorate([
            customElement({ name: 'b02', template: `b02${vp(0)}` })
        ], B02);
        const B0 = [B01, B02];
        let B11 = class B11 {
            async canUnload(_params, _instruction, _navigation) {
                await new Promise(function (resolve) { setTimeout(resolve, 0); });
                return true;
            }
        };
        B11 = __decorate([
            customElement({ name: 'b11', template: `b11${vp(1)}` })
        ], B11);
        let B12 = class B12 {
            async canUnload(_params, _instruction, _navigation) {
                await new Promise(function (resolve) { setTimeout(resolve, 0); });
                return false;
            }
        };
        B12 = __decorate([
            customElement({ name: 'b12', template: `b12${vp(1)}` })
        ], B12);
        const B1 = [B11, B12];
        const B = [...B0, ...B1];
        const Z = [...A, ...B];
        const getRouterOptions = () => translateOptions({});
        // Start with a broad sample of non-generated tests that are easy to debug and mess around with.
        it(`${name(Root1)} can load ${name(A01)} as a string and can determine if it's active`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load('a01');
            assertComponentsVisible(host, [Root1, A01]);
            assertIsActive(router, A01, {}, true, 1);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A01)} as a type and can determine if it's active`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(A01);
            assertComponentsVisible(host, [Root1, A01]);
            assertIsActive(router, A01, {}, true, 1);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A01)} as a RoutingInstruction and can determine if it's active`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load({ component: A01 });
            assertComponentsVisible(host, [Root1, A01]);
            assertIsActive(router, { component: A01 }, {}, true, 1);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A01)} as a CustomElementDefinition and can determine if it's active`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(CustomElement.getDefinition(A01));
            assertComponentsVisible(host, [Root1, A01]);
            assertIsActive(router, CustomElement.getDefinition(A01), {}, true, 1);
            await tearDown();
        });
        it(`${name(Root1)} can load ({ name: 'a31', template: \`A31\${vp(0)}\` } as an object and can determine if it's active`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            const def = { name: 'a31', template: `a31${vp(0)}` };
            await router.load(def);
            const A31 = CustomElement.define(def);
            assertComponentsVisible(host, [Root1, A31]);
            assertIsActive(router, CustomElement.getDefinition(A31), {}, true, 1);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A01)},${name(A02)} in order and can determine if it's active`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load('a01');
            assertComponentsVisible(host, [Root1, A01]);
            assertIsActive(router, A01, {}, true, 1);
            await router.load('a02');
            assertComponentsVisible(host, [Root1, A02]);
            assertIsActive(router, A02, {}, true, 2);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A11)},${name(A11)}/${name(A02)} in order with context and can determine if it's active`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(A11);
            assertComponentsVisible(host, [Root1, A11]);
            assertIsActive(router, A11, {}, true, 1);
            const loadOptions = { origin: router.allEndpoints('Viewport')[0].getContent().componentInstance }; // A11 view model
            await router.load(A02, loadOptions);
            assertComponentsVisible(host, [Root1, A11, A02]);
            assertIsActive(router, A02, loadOptions, true, 2);
            assertIsActive(router, A02, {}, false, 3);
            assertIsActive(router, A11, {}, true, 3);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A11)}/${name(A01)},${name(A11)}/${name(A02)} in order with context`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load({ component: A11, children: [A01] });
            assertComponentsVisible(host, [Root1, A11, A01]);
            const loadOptions = { origin: router.allEndpoints('Viewport')[0].getContent().componentInstance }; // A11 view model
            await router.load(A02, loadOptions);
            assertComponentsVisible(host, [Root1, A11, A02]);
            await tearDown();
        });
        it(`${name(Root1)} correctly handles canUnload with load ${name(B01)},${name(A01)} in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            let result = await router.load(B01);
            assertComponentsVisible(host, [Root1, B01]);
            assert.strictEqual(result, true, '#1 result===true');
            result = await router.load(A01);
            assertComponentsVisible(host, [Root1, A01]);
            assert.strictEqual(result, true, '#2 result===true');
            await tearDown();
        });
        it(`${name(Root1)} correctly handles canUnload with load ${name(B02)},${name(A01)} in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            let result = await router.load(B02);
            assertComponentsVisible(host, [Root1, B02]);
            assert.strictEqual(result, true, '#1 result===true');
            result = await router.load(A01);
            assertComponentsVisible(host, [Root1, B02]);
            assert.strictEqual(result, false, '#2 result===false');
            await tearDown();
        });
        it(`${name(Root1)} correctly handles canUnload with load ${name(B02)},${name(A01)},${name(A02)} in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            let result = await router.load(B02);
            assertComponentsVisible(host, [Root1, B02], '#1');
            assert.strictEqual(result, true, '#1 result===true');
            result = await router.load(A01);
            assertComponentsVisible(host, [Root1, B02], '#2');
            assert.strictEqual(result, false, '#2 result===false');
            result = await router.load(A02);
            assertComponentsVisible(host, [Root1, B02], '#3');
            assert.strictEqual(result, false, '#3 result===false');
            await tearDown();
        });
        it(`${name(Root1)} correctly handles canUnload with load ${name(B11)}/${name(B02)},${name(B11)}/${name(A02)} in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            let result = await router.load(`b11/b02`);
            assertComponentsVisible(host, [Root1, B11, [B02]]);
            assert.strictEqual(result, true, '#1 result===true');
            result = await router.load(`b11/a02`);
            assertComponentsVisible(host, [Root1, B11, [B02]]);
            assert.strictEqual(result, false, '#2 result===false');
            await tearDown();
        });
        it(`${name(Root1)} correctly handles canUnload with load ${name(B12)}/${name(B01)},${name(B11)}/${name(B01)} in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            let result = await router.load(`b12/b01`);
            assertComponentsVisible(host, [Root1, B12, [B01]]);
            assert.strictEqual(result, true, '#1 result===true');
            result = await router.load(`b11/b01`);
            assertComponentsVisible(host, [Root1, B12, [B01]]);
            assert.strictEqual(result, false, '#2 result===false');
            await tearDown();
        });
        it(`${name(Root1)} correctly handles canUnload with load ${name(B12)}/${name(B01)},${name(B12)}/${name(A01)} in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            let result = await router.load(`b12/b01`);
            assertComponentsVisible(host, [Root1, B12, [B01]]);
            assert.strictEqual(result, true, '#1 result===true');
            result = await router.load(`b12/a01`);
            assertComponentsVisible(host, [Root1, B12, [A01]]);
            assert.strictEqual(result, true, '#2 result===true');
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A11)}/${name(A01)} as a string`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(`a11/a01`);
            assertComponentsVisible(host, [Root1, A11, A01]);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A11)}/${name(A01)} as a RoutingInstruction`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load({ component: A11, children: [A01] });
            assertComponentsVisible(host, [Root1, A11, A01]);
            await tearDown();
        });
        it(`${name(Root1)} can load ${name(A11)}/${name(A01)},${name(A11)}/${name(A02)} in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(`a11/a01`);
            assertComponentsVisible(host, [Root1, A11, A01]);
            await router.load(`a11/a02`);
            assertComponentsVisible(host, [Root1, A11, A02]);
            await tearDown();
        });
        it(`${name(Root2)} can load ${name(A01)}@$0+${name(A02)}@$1 as a string`, async function () {
            const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(`${name(A01)}@$0+${name(A02)}@$1`);
            assertComponentsVisible(host, [Root2, A01, A02]);
            await tearDown();
        });
        it(`${name(Root2)} can load ${name(A01)}@$0+${name(A02)}@$1 as an array of strings`, async function () {
            const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load([`${name(A01)}@$0`, `${name(A02)}@$1`]);
            assertComponentsVisible(host, [Root2, A01, A02]);
            await tearDown();
        });
        it(`${name(Root2)} can load ${name(A01)}@$0+${name(A02)}@$1 as an array of types`, async function () {
            const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load([{ component: A01, viewport: '$0' }, { component: A02, viewport: '$1' }]);
            assertComponentsVisible(host, [Root2, A01, A02]);
            await tearDown();
        });
        it(`${name(Root2)} can load ${name(A01)}@$0+${name(A02)}@$1 as a mixed array type and string`, async function () {
            const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load([{ component: A01, viewport: '$0' }, `${name(A02)}@$1`]);
            assertComponentsVisible(host, [Root2, A01, A02]);
            await tearDown();
        });
        it(`${name(Root2)} can load ${name(A01)}@$0+${name(A02)}@$1,${name(A02)}@$0+${name(A01)}@$1 in order`, async function () {
            const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(`${name(A01)}@$0+${name(A02)}@$1`);
            assertComponentsVisible(host, [Root2, A01, A02]);
            await router.load(`${name(A02)}@$0+${name(A01)}@$1`);
            assertComponentsVisible(host, [Root2, A02, A01]);
            await tearDown();
        });
        it(`${name(Root2)} can load ${name(A11)}@$0/${name(A12)}/${name(A01)}+${name(A12)}@$1/${name(A01)},${name(A11)}@$0/${name(A12)}/${name(A01)}+${name(A12)}@$1/${name(A11)}/${name(A01)},${name(A11)}@$0/${name(A12)}/${name(A02)}+${name(A12)}@$1/${name(A11)}/${name(A01)} in order with context`, async function () {
            const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
            await router.load(`${name(A11)}@$0/${name(A12)}/${name(A01)}+${name(A12)}@$1/${name(A01)}`);
            assertComponentsVisible(host, [Root2, [A11, [A12, [A01]]], [A12, [A01]]], '#1');
            let loadOptions = { origin: router.allEndpoints('Viewport')[1].getContent().componentInstance }; // Top A12 view model
            await router.load(`${name(A11)}@$0/${name(A01)}`, loadOptions);
            assertComponentsVisible(host, [Root2, [A11, [A12, [A01]]], [A12, [A11, [A01]]]], '#2');
            loadOptions = { origin: router.allEndpoints('Viewport')[2].getContent().componentInstance }; // Second level A12 view model
            await router.load(`${name(A02)}`, loadOptions);
            assertComponentsVisible(host, [Root2, [A11, [A12, [A02]]], [A12, [A11, [A01]]]], '#3');
            await tearDown();
        });
        // Now generate stuff
        const $1vp = {
            // [x]
            [`a01`]: [A01],
            [`a02`]: [A02],
            // [x/x]
            [`a11/a01`]: [A11, [A01]],
            [`a11/a02`]: [A11, [A02]],
            [`a12/a01`]: [A12, [A01]],
            [`a12/a02`]: [A12, [A02]],
            // [x/x/x]
            [`a11/a12/a01`]: [A11, [A12, [A01]]],
            [`a11/a12/a02`]: [A11, [A12, [A02]]],
            [`a12/a11/a01`]: [A12, [A11, [A01]]],
            [`a12/a11/a02`]: [A12, [A11, [A02]]],
        };
        const $2vps = {
            // [x+x]
            [`${name(A01)}@$0+${name(A02)}@$1`]: [[A01], [A02]],
            [`${name(A02)}@$0+${name(A01)}@$1`]: [[A02], [A01]],
            // [x/x+x]
            [`${name(A11)}@$0/${name(A01)}+${name(A02)}@$1`]: [[A11, [A01]], [A02]],
            [`${name(A11)}@$0/${name(A02)}+${name(A01)}@$1`]: [[A11, [A02]], [A01]],
            [`${name(A12)}@$0/${name(A01)}+${name(A02)}@$1`]: [[A12, [A01]], [A02]],
            [`${name(A12)}@$0/${name(A02)}+${name(A01)}@$1`]: [[A12, [A02]], [A01]],
            // [x+x/x]
            [`${name(A01)}@$0+${name(A11)}@$1/${name(A02)}`]: [[A01], [A11, [A02]]],
            [`${name(A02)}@$0+${name(A11)}@$1/${name(A01)}`]: [[A02], [A11, [A01]]],
            [`${name(A01)}@$0+${name(A12)}@$1/${name(A02)}`]: [[A01], [A12, [A02]]],
            [`${name(A02)}@$0+${name(A12)}@$1/${name(A01)}`]: [[A02], [A12, [A01]]],
            // [x/x+x/x]
            [`${name(A11)}@$0/${name(A01)}+${name(A12)}@$1/${name(A02)}`]: [[A11, [A01]], [A12, [A02]]],
            [`${name(A11)}@$0/${name(A02)}+${name(A12)}@$1/${name(A01)}`]: [[A11, [A02]], [A12, [A01]]],
            [`${name(A12)}@$0/${name(A01)}+${name(A11)}@$1/${name(A02)}`]: [[A12, [A01]], [A11, [A02]]],
            [`${name(A12)}@$0/${name(A02)}+${name(A11)}@$1/${name(A01)}`]: [[A12, [A02]], [A11, [A01]]],
        };
        const $1vpKeys = Object.keys($1vp);
        for (let i = 0, ii = $1vpKeys.length; i < ii; ++i) {
            const key11 = $1vpKeys[i];
            const value11 = $1vp[key11];
            it(`${name(Root1)} can load ${key11}`, async function () {
                const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
                await router.load(key11);
                assertComponentsVisible(host, [Root1, value11]);
                await tearDown();
            });
            if (i >= 1) {
                const key11prev = $1vpKeys[i - 1];
                const value11prev = $1vp[key11prev];
                it(`${name(Root1)} can load ${key11prev},${key11} in order`, async function () {
                    const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
                    await router.load(key11prev);
                    assertComponentsVisible(host, [Root1, value11prev]);
                    await router.load(key11);
                    assertComponentsVisible(host, [Root1, value11]);
                    await tearDown();
                });
                it(`${name(Root1)} can load ${key11},${key11prev} in order`, async function () {
                    const { router, host, tearDown } = await createFixture(Root1, Z, getDefaultHIAConfig, getRouterOptions);
                    await router.load(key11);
                    assertComponentsVisible(host, [Root1, value11]);
                    await router.load(key11prev);
                    assertComponentsVisible(host, [Root1, value11prev]);
                    await tearDown();
                });
            }
        }
        const $2vpsKeys = Object.keys($2vps);
        for (let i = 0, ii = $2vpsKeys.length; i < ii; ++i) {
            const key21 = $2vpsKeys[i];
            const value21 = $2vps[key21];
            it(`${name(Root2)} can load ${key21}`, async function () {
                const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
                await router.load(key21);
                assertComponentsVisible(host, [Root2, value21]);
                await tearDown();
            });
            if (i >= 1) {
                const key21prev = $2vpsKeys[i - 1];
                const value21prev = $2vps[key21prev];
                it(`${name(Root2)} can load ${key21prev},${key21} in order`, async function () {
                    const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
                    await router.load(key21prev);
                    assertComponentsVisible(host, [Root2, value21prev]);
                    await router.load(key21);
                    assertComponentsVisible(host, [Root2, value21]);
                    await tearDown();
                });
                it(`${name(Root2)} can load ${key21},${key21prev} in order`, async function () {
                    const { router, host, tearDown } = await createFixture(Root2, Z, getDefaultHIAConfig, getRouterOptions);
                    await router.load(key21);
                    assertComponentsVisible(host, [Root2, value21]);
                    await router.load(key21prev);
                    assertComponentsVisible(host, [Root2, value21prev]);
                    await tearDown();
                });
            }
        }
    });
});
//# sourceMappingURL=smoke-tests.spec.js.map