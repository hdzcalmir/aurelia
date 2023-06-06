import { CustomAttribute, CustomElement, INode } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
// all the tests are using a common <my-input/> with a spreat on its internal <input/>
describe('3-runtime-html/spread.spec.ts', function () {
    const $it = (title, args) => runTest(title, args, false);
    $it.only = (title, args) => runTest(title, args, true);
    // eslint-disable-next-line mocha/no-skipped-tests
    $it.todo = (title, _args) => it.skip(title);
    $it('works single layer of ...attrs', {
        template: '<my-input value.bind="message">',
        component: { message: 'Aurelia' },
        assertFn: ({ appHost }) => {
            assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
        },
    });
    $it('preserves attr syntaxes', {
        template: '<my-input value.bind="message">',
        component: { message: 'Aurelia' },
        assertFn: ({ ctx, component, appHost }) => {
            ctx.type(appHost, 'input', 'hello');
            assert.strictEqual(component.message, 'hello');
            component.message = 'Aurelia';
            ctx.platform.domWriteQueue.flush();
            assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
        },
    });
    $it('does not throw when capture: false', {
        template: '<no-capture-input value.bind="message">',
        component: { message: 'Aurelia' },
        assertFn: ({ appHost }) => {
            assert.strictEqual(appHost.querySelector('input').value, '');
        },
    });
    $it('does not throw when there are nothing to capture', {
        template: '<my-input>',
        component: { message: 'Aurelia' },
        assertFn: ({ appHost }) => {
            assert.strictEqual(appHost.querySelector('input').value, '');
        },
    });
    $it('works with pass-through ...$attrs', {
        template: '<input-field value.bind="message">',
        component: { message: 'Aurelia' },
        registrations: [
            CustomElement.define({
                name: 'input-field',
                template: '<my-input ...$attrs>',
                capture: true,
            }),
        ],
        assertFn: ({ platform, component, appHost }) => {
            assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
            component.message = 'hello';
            platform.domWriteQueue.flush();
            assert.strictEqual(appHost.querySelector('input').value, 'hello');
        },
    });
    $it('does not capture template controller', {
        template: '<my-input value.bind="message" if.bind="hasInput">',
        component: { hasInput: false, message: 'Aurelia' },
        assertFn: ({ appHost }) => {
            assert.html.innerEqual(appHost, '');
        },
    });
    $it('does not apture slot', {
        template: '<my-input slot="a" value.bind="message">',
        component: { hasInput: false, message: 'Aurelia' },
        assertFn: ({ appHost }) => {
            assert.notEqual(appHost.querySelector('my-input[slot="a"]'), null);
        },
    });
    $it('only captures attr based on filter function', {
        template: '<filter-capture-input class="abc">',
        component: { message: 'hello' },
        assertFn: ({ appHost }) => {
            assert.includes(appHost.querySelector('filter-capture-input').className, 'abc');
        }
    });
    // away to support this is to change `.class` binding command to an attr pattern
    // PART.class pattern -> class.bind="expression ? PART : ''"
    // this would make it work maybe more consistently with the rest of the class binding
    // same for style binding command
    $it.todo('works with binding command that results in filtered out attr', {
        template: '<filter-capture-input abc.class="hasClass">',
        component: { hasClass: true },
        assertFn: ({ appHost }) => {
            assert.includes(appHost.querySelector('filter-capture-input').className, 'abc');
        }
    });
    $it('spreads event bindings', {
        template: '<my-input value.to-view="message" change.trigger="message = $event.target.value" focus.trigger="focused = true">',
        component: { message: 'Aurelia', focused: false },
        assertFn: ({ ctx, component, appHost }) => {
            assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
            ctx.type(appHost, 'input', 'hello');
            assert.strictEqual(component.message, 'hello');
            appHost.querySelector('input').dispatchEvent(new ctx.CustomEvent('focus'));
            assert.strictEqual(component.focused, true);
        },
    });
    $it('spreads interpolation', {
        template: `<my-input value="\${message}">`,
        component: { message: 'Aurelia', focused: false },
        assertFn: ({ ctx, component, appHost }) => {
            assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
            ctx.type(appHost, 'input', 'hello');
            assert.strictEqual(component.message, 'Aurelia');
        },
    });
    $it('spreads plain class attribute', {
        template: '<my-input class="abc">',
        component: { message: 'Aurelia', focused: false },
        assertFn: ({ appHost }) => {
            assert.strictEqual(appHost.querySelector('input').className, 'abc');
        },
    });
    $it('spreads plain style attribute', {
        template: '<my-input style="display: block;">',
        component: { message: 'Aurelia', focused: false },
        assertFn: ({ appHost }) => {
            assert.strictEqual(appHost.querySelector('input').style.display, 'block');
        },
    });
    $it('spreads plain attributes', {
        template: '<my-input size="20" aria-label="input">',
        component: { message: 'Aurelia', focused: false },
        assertFn: ({ appHost }) => {
            assert.strictEqual(appHost.querySelector('input').size, 20);
            assert.strictEqual(appHost.querySelector('input').getAttribute('aria-label'), 'input');
        },
    });
    describe('custom attribute', function () {
        var _a;
        const MyAttr = CustomAttribute.define({ name: 'my-attr', bindables: ['value'] }, (_a = class {
                constructor(host) {
                    this.host = host;
                }
                binding() {
                    this.host.setAttribute('size', this.value);
                }
            },
            _a.inject = [INode],
            _a));
        $it('spreads custom attribute (with literal value)', {
            template: '<my-input my-attr="20">',
            component: {},
            registrations: [MyAttr],
            assertFn: ({ appHost }) => {
                assert.strictEqual(appHost.querySelector('input').getAttribute('size'), '20');
                assert.strictEqual(appHost.querySelector('my-input').getAttribute('size'), null);
            }
        });
        $it('spreads custom attribute (with interpolation)', {
            template: `<my-input my-attr="\${size}">`,
            component: { size: 20 },
            registrations: [MyAttr],
            assertFn: ({ appHost }) => {
                assert.strictEqual(appHost.querySelector('input').getAttribute('size'), '20');
                assert.strictEqual(appHost.querySelector('my-input').getAttribute('size'), null);
            }
        });
        $it('spreads custom attribute (primary binding syntax)', {
            template: '<my-input my-attr.bind="size">',
            component: { size: 20 },
            registrations: [MyAttr],
            assertFn: ({ appHost }) => {
                assert.strictEqual(appHost.querySelector('input').getAttribute('size'), '20');
                assert.strictEqual(appHost.querySelector('my-input').getAttribute('size'), null);
            }
        });
        $it('spreads custom attribute (multi binding syntax)', {
            template: '<my-input my-attr="value.bind: size">',
            component: { size: 20 },
            registrations: [MyAttr],
            assertFn: ({ appHost }) => {
                assert.strictEqual(appHost.querySelector('input').getAttribute('size'), '20');
                assert.strictEqual(appHost.querySelector('my-input').getAttribute('size'), null);
            }
        });
    });
    describe('custom element', function () {
        const testElements = [
            CustomElement.define({
                name: 'form-field',
                template: '<form-input ...$attrs>',
                capture: true,
            }),
            CustomElement.define({
                name: 'form-input',
                template: '<input value.bind="value">',
                bindables: {
                    value: { property: 'value', attribute: 'value', mode: 6 /* BindingMode.twoWay */ }
                }
            }),
        ];
        $it('spreads plain binding to custom element bindable', {
            template: '<form-field value="Aurelia">',
            component: {},
            registrations: testElements,
            assertFn: ({ appHost }) => {
                assert.notStrictEqual(appHost.querySelector('form-input').value, 'Aurelia');
                assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
            },
        });
        $it('spreads binding to custom element bindables', {
            template: '<form-field value.bind="message">',
            component: { message: 'Aurelia' },
            registrations: testElements,
            assertFn: ({ appHost }) => {
                assert.notStrictEqual(appHost.querySelector('form-input').value, 'Aurelia');
                assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
            },
        });
        $it('spreads interpolation to custom element bindables', {
            template: `<form-field value="\${message}">`,
            component: { message: 'Aurelia' },
            registrations: testElements,
            assertFn: ({ appHost }) => {
                assert.notStrictEqual(appHost.querySelector('form-input').value, 'Aurelia');
                assert.strictEqual(appHost.querySelector('input').value, 'Aurelia');
            },
        });
        $it('spreads shorthand element bindable props', {
            template: '<form-field prop1.bind prop2.one-time prop3.to-view prop4.from-view>',
            component: { prop1: 'prop 1', prop2: 'prop 2', prop3: 'prop 3', prop4: 'prop 4' },
            registrations: [
                CustomElement.define({
                    name: 'form-field',
                    template: '<form-input ...$attrs>',
                    capture: true,
                }),
                CustomElement.define({
                    name: 'form-input',
                    template: '<input value.bind="prop1">',
                    bindables: ['prop1', 'prop2', 'prop3', 'prop4']
                }),
            ],
            assertFn: ({ component, appHost }) => {
                const formInput = CustomElement.for(appHost.querySelector('form-input')).viewModel;
                assert.strictEqual(formInput.prop1, 'prop 1');
                assert.strictEqual(formInput.prop2, 'prop 2');
                assert.strictEqual(formInput.prop3, 'prop 3');
                assert.strictEqual(formInput.prop4, undefined);
                formInput.prop4 = 'prop 5';
                assert.strictEqual(component.prop4, 'prop 5');
            },
        });
    });
    function runTest(title, { template, assertFn, component, registrations }, only) {
        return (only ? it.only : it)(title, async function () {
            const fixture = createFixture(template, (typeof component === 'object'
                ? class {
                    constructor() { Object.assign(this, component); }
                }
                : component), [
                ...(registrations ?? []),
                CustomElement.define({
                    name: 'my-input',
                    template: '<input ...$attrs>',
                    capture: true,
                }, class MyInput {
                }),
                CustomElement.define({
                    name: 'no-capture-input',
                    template: '<input ...$attrs>',
                    capture: false,
                }, class NoCaptureInput {
                }),
                CustomElement.define({
                    name: 'filter-capture-input',
                    template: '<input ...$attrs>',
                    capture: (attr) => attr !== 'class'
                }, class FilterCaptureInput {
                }),
            ]);
            const { startPromise, tearDown } = fixture;
            await startPromise;
            await assertFn(fixture);
            await tearDown();
        });
    }
});
//# sourceMappingURL=spread.spec.js.map