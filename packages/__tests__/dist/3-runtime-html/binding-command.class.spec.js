import { BindingMode, CustomElement } from '@aurelia/runtime-html';
import { assert, createFixture, eachCartesianJoin } from '@aurelia/testing';
import { ClassAttributePattern } from './attribute-pattern.js';
// TemplateCompiler - Binding Commands integration
describe('3-runtime-html/binding-command.class.spec.ts', function () {
    const falsyValues = [0, false, null, undefined, ''];
    const truthyValues = [1, '1', true, {}, [], Symbol(), function () { }, Number, new Proxy({}, {})];
    const classNameTests = [
        'background',
        'color',
        'background-color',
        'font-size',
        'font-family',
        '-webkit-user-select',
        'SOME_RIDI-COU@#$%-class',
        '1',
        '__1',
        '✔',
        '⛓',
        '🤷‍♂️', // double characters
        '🤯',
        ...[
            '@',
            '#',
            '$',
            '!',
            '^',
            '~',
            '&',
            '*',
            '(',
            ')',
            '+',
            // '=', // todo: better test for this scenario
            '*',
            // '/', // todo: better test for this scenario
            '\\',
            ':',
            '[',
            ']',
            '{',
            '}',
            '|',
            '<',
            // '>', // todo: better test for this scenario
            ',',
            '%'
        ].map(s => `${s}1`)
    ];
    const testCases = [
        {
            selector: 'button',
            title: (className, callIndex) => `${callIndex}. <button class.${encodeURI(className)}=value>`,
            template: (className) => {
                return `
        <button ${className}.class="value"></button>
        <button class.${className}="value"></button>
        <child value.bind="value"></child>
        <child repeat.for="i of 5" value.bind="value"></child>
      `;
            },
            assert: (au, platform, host, component, testCase, className) => {
                const childEls = host.querySelectorAll('child');
                assert.strictEqual(childEls.length, 6, `childEls.length`);
                eachCartesianJoin([falsyValues, truthyValues], (falsyValue, truthyValue) => {
                    for (let i = 0, ii = childEls.length; ii > i; ++i) {
                        const el = childEls[i];
                        assert.contains(el.classList, className.toLowerCase(), `[[truthy]]${el.className}.contains(${className}) 1`);
                    }
                    component.value = falsyValue;
                    platform.domQueue.flush();
                    for (let i = 0, ii = childEls.length; ii > i; ++i) {
                        const el = childEls[i];
                        assert.notContains(el.classList, className.toLowerCase(), `[${String(falsyValue)}]${el.className}.contains(${className}) 2`);
                    }
                    component.value = truthyValue;
                    platform.domQueue.flush();
                    for (let i = 0, ii = childEls.length; ii > i; ++i) {
                        const el = childEls[i];
                        assert.contains(el.classList, className.toLowerCase(), `[${String(truthyValue)}]${el.className}.contains(${className}) 3`);
                    }
                });
            }
        }
    ];
    /**
     * For each combination of class name and test case
     * Check the following:
     * 1. The element contains the class
     * 2. Each `value` of falsy values, set bound view model value to `value` and:
     * - wait for 1 promise tick
     * - the element does not contain the class
     *
     * 3. Each `value` of truthy values, set bound view model value to `value` and:
     * - wait for 1 promise tick
     * - the element does contain the class
     *
     * 4. TODO: assert class binding command on root surrogate once root surrogate composition is supported
     */
    eachCartesianJoin([classNameTests, testCases], (className, testCase, callIndex) => {
        it(`[UNIT] ${testCase.title(className, callIndex)}`, async function () {
            var _a;
            const { ctx, au, platform, appHost, component } = createFixture(testCase.template(className), class App {
                constructor() {
                    this.value = true;
                }
            }, [
                ClassAttributePattern,
                CustomElement.define({
                    name: 'child',
                    template: `<template ${className}.class="value"></template>`
                }, (_a = class Child {
                        constructor() {
                            this.value = true;
                        }
                    },
                    _a.bindables = {
                        value: { property: 'value', attribute: 'value', mode: BindingMode.twoWay }
                    },
                    _a))
            ]);
            const els = typeof testCase.selector === 'string'
                ? appHost.querySelectorAll(testCase.selector)
                : testCase.selector(ctx.doc);
            for (let i = 0, ii = els.length; ii > i; ++i) {
                const el = els[i];
                assert.contains(el.classList, className.toLowerCase(), `[true]${el.className}.contains(${className}) 1`);
            }
            eachCartesianJoin([falsyValues, truthyValues], (falsyValue, truthyValue) => {
                component.value = falsyValue;
                platform.domQueue.flush();
                for (let i = 0, ii = els.length; ii > i; ++i) {
                    const el = els[i];
                    assert.notContains(el.classList, className.toLowerCase(), `[${String(falsyValue)}]${el.className}.contains(${className}) 2`);
                }
                component.value = truthyValue;
                platform.domQueue.flush();
                for (let i = 0, ii = els.length; ii > i; ++i) {
                    const el = els[i];
                    assert.contains(el.classList, className.toLowerCase(), `[${String(truthyValue)}]${el.className}.contains(${className}) 3`);
                }
            });
            testCase.assert(au, platform, appHost, component, testCase, className);
        });
    });
});
//# sourceMappingURL=binding-command.class.spec.js.map