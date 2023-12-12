var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { resolve } from '@aurelia/kernel';
import { alias, bindable, customAttribute, INode, CustomAttribute, IAurelia } from '@aurelia/runtime-html';
import { assert, eachCartesianJoin, createFixture } from '@aurelia/testing';
describe('3-runtime-html/custom-attributes.spec.ts', function () {
    // custom elements
    describe('01. Aliases', function () {
        let Fooatt5 = class Fooatt5 {
            constructor(element) {
                this.element = element;
            }
            bound() {
                this.element.setAttribute('test', this.value);
            }
        };
        __decorate([
            bindable({ primary: true }),
            __metadata("design:type", Object)
        ], Fooatt5.prototype, "value", void 0);
        Fooatt5 = __decorate([
            customAttribute({ name: 'foo5', aliases: ['foo53'] }),
            alias(...['foo51', 'foo52']),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], Fooatt5);
        let Fooatt4 = class Fooatt4 {
            constructor(element) {
                this.element = element;
            }
            bound() {
                this.element.setAttribute('test', this.value);
            }
        };
        __decorate([
            bindable({ primary: true }),
            __metadata("design:type", Object)
        ], Fooatt4.prototype, "value", void 0);
        Fooatt4 = __decorate([
            customAttribute({ name: 'foo4', aliases: ['foo43'] }),
            alias('foo41', 'foo42'),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], Fooatt4);
        let FooMultipleAlias = class FooMultipleAlias {
            constructor(element) {
                this.element = element;
            }
            bound() {
                this.element.setAttribute('test', this.value);
            }
        };
        __decorate([
            bindable({ primary: true }),
            __metadata("design:type", Object)
        ], FooMultipleAlias.prototype, "value", void 0);
        FooMultipleAlias = __decorate([
            customAttribute({ name: 'foo44', aliases: ['foo431'] }),
            alias('foo411', 'foo421'),
            alias('foo422', 'foo422'),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], FooMultipleAlias);
        const resources = [Fooatt4, Fooatt5, FooMultipleAlias];
        const app = class {
            constructor() {
                this.value = 'wOOt';
            }
        };
        it('Simple spread Alias doesn\'t break def alias works on custom attribute', async function () {
            const options = createFixture('<template> <div foo53.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('2 aliases and attribute alias original works', async function () {
            const options = createFixture('<template> <div foo44.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('2 aliases and attribute alias first alias deco works', async function () {
            const options = createFixture('<template> <div foo411.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('2 aliases and attribute alias def alias works', async function () {
            const options = createFixture('<template> <div foo431.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('2 aliases and attribute alias second alias works', async function () {
            const options = createFixture('<template> <div foo422.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('Simple spread Alias (1st position) works on custom attribute', async function () {
            const options = createFixture('<template> <div foo51.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('Simple spread Alias (2nd position) works on custom attribute', async function () {
            const options = createFixture('<template> <div foo52.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('Simple spread Alias doesn\'t break original custom attribute', async function () {
            const options = createFixture('<template> <div foo5.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('Simple Alias doesn\'t break def alias works on custom attribute', async function () {
            const options = createFixture('<template> <div foo43.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('Simple Alias (1st position) works on custom attribute', async function () {
            const options = createFixture('<template> <div foo41.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('Simple Alias (2nd position) works on custom attribute', async function () {
            const options = createFixture('<template> <div foo42.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
        it('Simple Alias doesn\'t break original custom attribute', async function () {
            const options = createFixture('<template> <div foo4.bind="value"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt');
            await options.tearDown();
        });
    });
    describe('0.2 Multiple bindings', function () {
        let Multi = class Multi {
            constructor(element) {
                this.element = element;
                this.element.innerHTML = 'Created';
            }
            bound() {
                this.aChanged();
                this.bChanged();
            }
            aChanged() {
                this.aResult = this.a;
                this.updateContent();
            }
            bChanged() {
                this.bResult = this.b;
                this.updateContent();
            }
            updateContent() {
                this.element.innerHTML = `a: ${this.aResult}, b: ${this.bResult}`;
            }
        };
        __decorate([
            bindable,
            __metadata("design:type", Boolean)
        ], Multi.prototype, "a", void 0);
        __decorate([
            bindable,
            __metadata("design:type", String)
        ], Multi.prototype, "b", void 0);
        Multi = __decorate([
            customAttribute('multi'),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], Multi);
        let Multi2 = class Multi2 {
            constructor(element) {
                this.element = element;
                this.element.innerHTML = 'Created';
            }
            bound() {
                this.aChanged();
                this.bChanged();
            }
            aChanged() {
                this.aResult = this.a;
                this.updateContent();
            }
            bChanged() {
                this.bResult = this.b;
                this.updateContent();
            }
            updateContent() {
                this.element.innerHTML = `a: ${this.aResult}, b: ${this.bResult}`;
            }
        };
        __decorate([
            bindable,
            __metadata("design:type", Boolean)
        ], Multi2.prototype, "a", void 0);
        __decorate([
            bindable({ primary: true }),
            __metadata("design:type", String)
        ], Multi2.prototype, "b", void 0);
        Multi2 = __decorate([
            customAttribute('multi2'),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], Multi2);
        const app = class {
            constructor() {
                this.value = 'bound';
            }
        };
        it('binds to multiple properties correctly', async function () {
            const options = createFixture('<template> <div multi="a.bind: true; b.bind: value">Initial</div> </template>', app, [Multi]);
            assert.strictEqual(options.appHost.firstElementChild.textContent, 'a: true, b: bound');
            await options.tearDown();
        });
        it('binds to multiple properties correctly when there’s a default property', async function () {
            const options = createFixture('<template> <div multi2="a.bind: true; b.bind: value">Initial</div> </template>', app, [Multi2]);
            assert.strictEqual(options.appHost.firstElementChild.textContent, 'a: true, b: bound');
            await options.tearDown();
        });
        it('binds to the default property correctly', async function () {
            const options = createFixture('<template> <div multi2.bind="value">Initial</div> </template>', app, [Multi2]);
            assert.strictEqual(options.appHost.firstElementChild.textContent, 'a: undefined, b: bound');
            await options.tearDown();
        });
        describe('with noMultiBindings: true', function () {
            let Multi3 = class Multi3 extends Multi2 {
            };
            Multi3 = __decorate([
                customAttribute({
                    name: 'multi3',
                    noMultiBindings: true,
                })
            ], Multi3);
            it('works with multi binding syntax', async function () {
                const options = createFixture('<template> <div multi3="a.bind: 5; b.bind: 6">Initial</div> </template>', app, [Multi3]);
                assert.strictEqual(options.appHost.firstElementChild.textContent, 'a: undefined, b: a.bind: 5; b.bind: 6');
                await options.tearDown();
            });
            it('works with URL value', async function () {
                const options = createFixture('<template> <div multi3="http://google.com">Initial</div> </template>', app, [Multi3]);
                assert.strictEqual(options.appHost.firstElementChild.textContent, 'a: undefined, b: http://google.com');
                await options.tearDown();
            });
            it('works with escaped colon', async function () {
                const options = createFixture('<template> <div multi3="http\\://google.com">Initial</div> </template>', app, [Multi3]);
                assert.strictEqual(options.appHost.firstElementChild.textContent, 'a: undefined, b: http\\://google.com');
                await options.tearDown();
            });
        });
    });
    describe('03. Change Handler', function () {
        let Foo = class Foo {
            constructor() {
                this.propChangedCallCount = 0;
            }
            propChanged() {
                this.propChangedCallCount++;
            }
        };
        __decorate([
            bindable(),
            __metadata("design:type", Object)
        ], Foo.prototype, "prop", void 0);
        Foo = __decorate([
            customAttribute('foo')
        ], Foo);
        it('does not invoke change handler when starts with plain usage', async function () {
            const { fooVm, tearDown } = setupChangeHandlerTest('<div foo="prop"></div>');
            assert.strictEqual(fooVm.propChangedCallCount, 0);
            fooVm.prop = '5';
            assert.strictEqual(fooVm.propChangedCallCount, 1);
            await tearDown();
        });
        it('does not invoke change handler when starts with commands', async function () {
            const { fooVm, tearDown } = setupChangeHandlerTest('<div foo.bind="prop"></foo>');
            assert.strictEqual(fooVm.propChangedCallCount, 0);
            fooVm.prop = '5';
            assert.strictEqual(fooVm.propChangedCallCount, 1);
            await tearDown();
        });
        it('does not invoke change handler when starts with interpolation', async function () {
            const { fooVm, tearDown } = setupChangeHandlerTest(`<div foo="\${prop}"></foo>`);
            assert.strictEqual(fooVm.propChangedCallCount, 0);
            fooVm.prop = '5';
            assert.strictEqual(fooVm.propChangedCallCount, 1);
            await tearDown();
        });
        it('does not invoke change handler when starts with two way binding', async function () {
            const { fooVm, tearDown } = setupChangeHandlerTest(`<div foo.two-way="prop"></foo>`);
            assert.strictEqual(fooVm.propChangedCallCount, 0, '#1 should have had 0 calls at start');
            fooVm.prop = '5';
            assert.strictEqual(fooVm.propChangedCallCount, 1, '#2 shoulda had 1 call after mutation');
            await tearDown();
        });
        function setupChangeHandlerTest(template) {
            const options = createFixture(template, class {
            }, [Foo]);
            const fooEl = options.appHost.querySelector('div');
            const fooVm = CustomAttribute.for(fooEl, 'foo').viewModel;
            return {
                fooVm: fooVm,
                tearDown: () => options.tearDown()
            };
        }
    });
    // in the tests here, we use a combination of change handler and property change handler
    // and assert that they work in the same way, the presence of one callback is equivalent with the other
    // foo1: has both normal change handler and all properties change handler
    // foo2: has only normal change handler
    // foo3: has only all properties change handler
    describe('04. Change handler with "propertyChanged" callback', function () {
        let Foo1 = class Foo1 {
            constructor() {
                this.propChangedCallCount = 0;
                this.propertyChangedCallCount = 0;
                this.propertyChangedCallArguments = [];
            }
            propChanged() {
                this.propChangedCallCount++;
            }
            propertyChanged(...args) {
                this.propertyChangedCallCount++;
                this.propertyChangedCallArguments.push(args);
            }
        };
        __decorate([
            bindable(),
            __metadata("design:type", Object)
        ], Foo1.prototype, "prop", void 0);
        Foo1 = __decorate([
            customAttribute('foo1')
        ], Foo1);
        let Foo2 = class Foo2 {
            constructor() {
                this.propChangedCallCount = 0;
                this.propertyChangedCallCount = 0;
                this.propertyChangedCallArguments = [];
            }
            propChanged() {
                this.propChangedCallCount++;
            }
        };
        __decorate([
            bindable(),
            __metadata("design:type", Object)
        ], Foo2.prototype, "prop", void 0);
        Foo2 = __decorate([
            customAttribute('foo2')
        ], Foo2);
        let Foo3 = class Foo3 {
            constructor() {
                this.propChangedCallCount = 0;
                this.propertyChangedCallCount = 0;
                this.propertyChangedCallArguments = [];
            }
            propertyChanged(...args) {
                this.propertyChangedCallCount++;
                this.propertyChangedCallArguments.push(args);
            }
        };
        __decorate([
            bindable(),
            __metadata("design:type", Object)
        ], Foo3.prototype, "prop", void 0);
        Foo3 = __decorate([
            customAttribute('foo3')
        ], Foo3);
        const templateUsages = [
            ['plain', '="prop"'],
            ['binding command', '.bind="prop"'],
            // ['two-way binding', '.two-way="prop"'],
            ['interpolation', `=\${prop}"`],
        ];
        const testCases = [
            {
                callCounts: [
                    /* foo1: has both normal change handler and all properties change handler */
                    [
                        /* normal change handler call count */ 1,
                        /* all properties change handler call count */ 1,
                        /* corresponding count of arguments of all properties change handler */ [3]
                    ],
                    /* foo2: has only normal change handler */
                    [
                        /* normal change handler call count */ 1,
                        /* all properties change handler call count */ 0,
                        /* corresponding count of arguments of all properties change handler */ []
                    ],
                    /* foo3: has only all properties change handler */
                    [
                        /* normal change handler call count */ 0,
                        /* all properties change handler call count */ 1,
                        /* corresponding count of arguments of all properties change handler */ [3]
                    ]
                ]
            }
        ];
        eachCartesianJoin([templateUsages, testCases], ([usageDesc, usageSyntax], testCase) => {
            it(`does not invoke change handler when starts with ${usageDesc} usage`, async function () {
                const template = `<div foo1${usageSyntax} foo2${usageSyntax} foo3${usageSyntax}></div>`;
                const { foos, tearDown } = setupChangeHandlerTest(template);
                const callCounts = testCase.callCounts;
                foos.forEach((fooVm, idx) => {
                    assert.strictEqual(fooVm.propChangedCallCount, 0, `#1 Foo${idx + 1} count`);
                    assert.strictEqual(fooVm.propertyChangedCallCount, 0, `#2 Foo${idx + 1} count`);
                    fooVm.prop = '5';
                });
                foos.forEach((fooVm, idx) => {
                    assert.strictEqual(fooVm.propChangedCallCount, callCounts[idx][0], `#3 callCounts[${idx}][0]`);
                    assert.strictEqual(fooVm.propertyChangedCallCount, callCounts[idx][1], `#4 callCounts[${idx}][1]`);
                    if (fooVm.propertyChangedCallCount > 0) {
                        for (let i = 0; fooVm.propertyChangedCallCount > i; ++i) {
                            assert.strictEqual(fooVm.propertyChangedCallArguments[i].length, callCounts[idx][2][i], `#5 callCounts[${idx}][2][${i}]`);
                        }
                    }
                });
                await tearDown();
            });
        });
        describe('04.1 + with two-way', function () {
            it('does not invoke change handler when starts with two-way usage', async function () {
                const template = `<div foo1.two-way="prop"></div>`;
                const options = createFixture(template, class {
                    constructor() {
                        this.prop = 'prop';
                    }
                }, [Foo1]);
                const fooEl = options.appHost.querySelector('div');
                const foo1Vm = CustomAttribute.for(fooEl, 'foo1').viewModel;
                assert.strictEqual(foo1Vm.propChangedCallCount, 0, `#1 Foo1 count`);
                assert.strictEqual(foo1Vm.propertyChangedCallCount, 0, `#2 Foo1 count`);
                assert.strictEqual(foo1Vm.prop, `prop`);
                const rootVm = options.au.root.controller.viewModel;
                // changing source value should trigger the change handler
                rootVm['prop'] = 5;
                assert.strictEqual(foo1Vm.propChangedCallCount, 1, '#3 Foo1 propChanged()');
                assert.strictEqual(foo1Vm.propertyChangedCallCount, 1, '#3 Foo1 propChanged()');
                assert.strictEqual(foo1Vm.prop, 5);
                // manually setting the value in the view model should also trigger the change handler
                foo1Vm.prop = 6;
                assert.strictEqual(foo1Vm.propChangedCallCount, 2, '#4 Foo1 propChanged()');
                assert.strictEqual(foo1Vm.propertyChangedCallCount, 2, '#4 Foo1 propChanged()');
                assert.strictEqual(foo1Vm.prop, 6);
                assert.strictEqual(rootVm['prop'], 6);
                await options.tearDown();
            });
            // Foo1 should cover both Foo2, and Foo3
            // but for completeness, should have tests for Foo2 & Foo3, similar like above
            // todo: test with Foo2, and Foo3
        });
        function setupChangeHandlerTest(template) {
            const options = createFixture(template, class {
            }, [Foo1, Foo2, Foo3]);
            const fooEl = options.appHost.querySelector('div');
            const foo1Vm = CustomAttribute.for(fooEl, 'foo1').viewModel;
            const foo2Vm = CustomAttribute.for(fooEl, 'foo2').viewModel;
            const foo3Vm = CustomAttribute.for(fooEl, 'foo3').viewModel;
            return {
                rootVm: options.component,
                fooVm: foo1Vm,
                foo2Vm,
                foo3Vm,
                foos: [foo1Vm, foo2Vm, foo3Vm],
                tearDown: () => options.tearDown()
            };
        }
    });
    describe('05. with setter', function () {
        /**
         * Specs:
         * - with setter coercing to string for "prop" property
         */
        let Foo1 = class Foo1 {
        };
        __decorate([
            bindable({
                set: String
            }),
            __metadata("design:type", Object)
        ], Foo1.prototype, "prop", void 0);
        Foo1 = __decorate([
            customAttribute('foo1')
        ], Foo1);
        /**
         * Specs:
         * - plain bindable "prop"
         */
        let Foo2 = class Foo2 {
        };
        __decorate([
            bindable(),
            __metadata("design:type", Object)
        ], Foo2.prototype, "prop", void 0);
        Foo2 = __decorate([
            customAttribute('foo2')
        ], Foo2);
        /**
         * Specs:
         * - with setter/getter coercing to string for "prop" property
         */
        let Foo3 = class Foo3 {
        };
        __decorate([
            bindable({
                set: String,
            }),
            __metadata("design:type", Object)
        ], Foo3.prototype, "prop", void 0);
        Foo3 = __decorate([
            customAttribute('foo3')
        ], Foo3);
        /**
         * Foo4 specs:
         * - with primary bindable with setter
         * - with setter coercing to number
         * - with change handler for "prop" property
         */
        let Foo4 = class Foo4 {
            constructor() {
                this.propChangedCallCount = 0;
                this.propHistory = [];
            }
            propChanged(newValue) {
                this.propHistory.push(newValue);
                this.propChangedCallCount++;
            }
        };
        __decorate([
            bindable(),
            __metadata("design:type", Object)
        ], Foo4.prototype, "prop1", void 0);
        __decorate([
            bindable({
                primary: true,
                set: (val) => Number(val) > 0 ? Number(val) : 0
            }),
            __metadata("design:type", Object)
        ], Foo4.prototype, "prop", void 0);
        Foo4 = __decorate([
            customAttribute('foo4')
        ], Foo4);
        let UsageType;
        (function (UsageType) {
            // plain = 1,
            UsageType[UsageType["command"] = 1] = "command";
            UsageType[UsageType["interpolation"] = 2] = "interpolation";
            UsageType[UsageType["multi"] = 4] = "multi";
            UsageType[UsageType["multiWithCommand"] = 5] = "multiWithCommand";
            UsageType[UsageType["multiWithInterpolation"] = 6] = "multiWithInterpolation";
        })(UsageType || (UsageType = {}));
        const templateUsages = [
            // [UsageType.plain, '="prop"'],
            [UsageType.command, '.bind="prop"'],
            // ['two-way binding', '.two-way="prop"'],
            [UsageType.interpolation, `="\${prop}"`],
            [UsageType.multiWithCommand, '="prop.bind: prop"'],
            [UsageType.multiWithInterpolation, `="prop: \${prop}"`],
        ];
        const testCases = [
            [
                5,
                () => /* foo1 has setter */ '5',
                (usageType) => (usageType & UsageType.interpolation) > 0 ? '5' : 5,
                () => '5',
                () => 5
            ],
            [
                'prop1',
                () => 'prop1',
                () => 'prop1',
                () => 'prop1',
                () => 0
            ],
            (() => {
                const date = new Date();
                return [
                    date,
                    () => String(date),
                    (usageType) => (usageType & UsageType.interpolation) > 0 ? date.toString() : date,
                    () => date.toString(),
                    (usageType) => (usageType & UsageType.interpolation) > 0
                        ? /* Number('...') -> 0 */ 0
                        : date.getTime(),
                ];
            })(),
            (() => {
                const values = [1, 2, 3, 4];
                return [
                    values,
                    () => `1,2,3,4`,
                    (usageType) => (usageType & UsageType.interpolation) > 0 ? '1,2,3,4' : values,
                    () => '1,2,3,4',
                    () => /* Number([...]) === NaN -> */ 0
                ];
            })(),
        ];
        eachCartesianJoin([templateUsages, testCases], ([usageType, usageSyntax], [mutationValue, ...getFooVmProps]) => {
            it(`does not invoke change handler when starts with ${UsageType[usageType]} usage`, async function () {
                const template = `<div
              foo1${usageSyntax}
              foo2${usageSyntax}
              foo3${usageSyntax}
              foo4${usageSyntax}></div>`;
                const { rootVm, foos, tearDown } = setupChangeHandlerTest(template);
                foos.forEach((fooVm, idx) => {
                    assert.strictEqual(fooVm.prop, fooVm instanceof Foo4 ? 0 : 'prop', `#1 asserting Foo${idx + 1} initial`);
                });
                rootVm.prop = mutationValue;
                foos.forEach((fooVm, idx) => {
                    assert.strictEqual(fooVm.prop, getFooVmProps[idx](usageType), `#2 asserting Foo${idx + 1}`);
                });
                await tearDown();
            });
        });
        function setupChangeHandlerTest(template) {
            const options = createFixture(template, class {
                constructor() {
                    this.prop = 'prop';
                }
            }, [Foo1, Foo2, Foo3, Foo4]);
            const fooEl = options.appHost.querySelector('div');
            const foo1Vm = CustomAttribute.for(fooEl, 'foo1').viewModel;
            const foo2Vm = CustomAttribute.for(fooEl, 'foo2').viewModel;
            const foo3Vm = CustomAttribute.for(fooEl, 'foo3').viewModel;
            const foo4Vm = CustomAttribute.for(fooEl, 'foo4').viewModel;
            return {
                rootVm: options.component,
                foo1Vm,
                foo2Vm,
                foo3Vm,
                foo4Vm,
                foos: [foo1Vm, foo2Vm, foo3Vm, foo4Vm],
                tearDown: () => options.tearDown()
            };
        }
        describe('05.1 + with two-way', function () {
            it('works properly when two-way binding with number setter interceptor', async function () {
                const template = `<div foo1.two-way="prop">\${prop}</div>`;
                const options = createFixture(template, class {
                    constructor() {
                        this.prop = 'prop';
                    }
                }, [Foo1, Foo2, Foo3, Foo4]);
                const fooEl = options.appHost.querySelector('div');
                const rootVm = options.au.root.controller.viewModel;
                const foo1Vm = CustomAttribute.for(fooEl, 'foo1').viewModel;
                assert.strictEqual(foo1Vm.prop, 'prop', '#1 <-> Foo1 initial');
                assert.strictEqual(rootVm.prop, 'prop', '#1 <-> RootVm initial');
                assert.strictEqual(options.appHost.textContent, 'prop');
                rootVm.prop = 5;
                assert.strictEqual(foo1Vm.prop, '5', '#2 <-> RootVm.prop << 5');
                assert.strictEqual(rootVm.prop, '5', '#2 <-> RootVm.prop << 5');
                options.platform.domWriteQueue.flush();
                assert.strictEqual(options.appHost.textContent, '5');
                const date = new Date();
                foo1Vm.prop = date;
                assert.strictEqual(foo1Vm.prop, date.toString(), '#3 <-> foo1Vm.prop << Date');
                assert.strictEqual(rootVm.prop, date.toString(), '#3 <-> foo1Vm.prop << Date');
                options.platform.domWriteQueue.flush();
                assert.strictEqual(options.appHost.textContent, date.toString());
                await options.tearDown();
            });
            it('does not result in overflow error when dealing with NaN', async function () {
                /**
                 * Specs:
                 * - With bindable with getter coerce to string, setter coerce to number for "prop" property
                 */
                let Foo5 = class Foo5 {
                };
                __decorate([
                    bindable({
                        set: Number,
                    }),
                    __metadata("design:type", Object)
                ], Foo5.prototype, "prop", void 0);
                Foo5 = __decorate([
                    customAttribute('foo5')
                ], Foo5);
                const template = `<div foo5.two-way="prop">\${prop}</div>`;
                const options = createFixture(template, class {
                    constructor() {
                        this.prop = 'prop';
                    }
                }, [Foo5]);
                const fooEl = options.appHost.querySelector('div');
                const rootVm = options.au.root.controller.viewModel;
                const foo5Vm = CustomAttribute.for(fooEl, 'foo5').viewModel;
                assert.strictEqual(foo5Vm.prop, NaN, '#1 <-> Foo1 initial');
                assert.strictEqual(rootVm.prop, 'prop', '#1 <-> RootVm initial');
                assert.strictEqual(options.appHost.textContent, 'prop');
                rootVm.prop = 5;
                assert.strictEqual(foo5Vm.prop, 5, '#2 <-> RootVm.prop << 5 -> foo5Vm');
                assert.strictEqual(foo5Vm.$observers.prop.getValue(), 5, '#2 Foo5.$observer.prop.getValue()');
                assert.strictEqual(rootVm.prop, 5, '#2 <-> RootVm.prop << 5 -> rootVm');
                options.platform.domWriteQueue.flush();
                assert.strictEqual(options.appHost.textContent, '5');
                const date = new Date();
                foo5Vm.prop = date;
                assert.strictEqual(foo5Vm.prop, date.getTime(), '#3 <-> foo1Vm.prop << Date');
                assert.strictEqual(rootVm.prop, date.getTime(), '#3 <-> foo1Vm.prop << Date');
                options.platform.domWriteQueue.flush();
                assert.strictEqual(options.appHost.textContent, date.getTime().toString());
                rootVm.prop = NaN;
                assert.strictEqual(Object.is(foo5Vm.prop, NaN), true, '#1 <-> Foo1 initial');
                assert.strictEqual(Object.is(rootVm.prop, NaN), true, '#1 <-> RootVm initial');
                options.platform.domWriteQueue.flush();
                assert.strictEqual(options.appHost.textContent, 'NaN');
                await options.tearDown();
            });
        });
    });
    describe('resolve', function () {
        afterEach(function () {
            assert.throws(() => resolve(class Abc {
            }));
        });
        it('works with resolve and inheritance', function () {
            class Base {
                constructor() {
                    this.au = resolve(IAurelia);
                }
            }
            let Attr = class Attr extends Base {
            };
            Attr = __decorate([
                customAttribute('attr')
            ], Attr);
            const { au, component } = createFixture('<div attr attr.ref="attr">', class App {
            }, [Attr]);
            assert.strictEqual(au, component.attr.au);
        });
    });
    describe('getter/[setter] bindable', function () {
        it('works in basic scenario', function () {
            const { assertText } = createFixture(`<div my-attr="hi">`, class App {
            }, [CustomAttribute.define({ name: 'my-attr', bindables: ['message'] }, class {
                    constructor() {
                        this._m = 'hey';
                        this.host = resolve(INode);
                    }
                    get message() {
                        return this._m;
                    }
                    set message(v) {
                        this._m = v;
                    }
                    attached() {
                        this.host.textContent = this._m;
                    }
                })]);
            assertText('hi');
        });
        it('works with readonly bindable + [from-view]', function () {
            const { assertText } = createFixture('<div my-attr.from-view="message">${message}', class App {
                constructor() {
                    this.message = '';
                }
            }, [CustomAttribute.define({ name: 'my-attr', bindables: ['_m', 'message'] }, class {
                    constructor() {
                        this._m = '2';
                    }
                    get message() {
                        return this._m;
                    }
                    binding() {
                        this._m = '2+';
                    }
                })]);
            assertText('2+');
        });
        it('works with coercer bindable', function () {
            let setCount = 0;
            const values = [];
            let MyAttr = class MyAttr {
                constructor() {
                    this._m = '';
                }
                get message() {
                    return this._m;
                }
                set message(v) {
                    this._m = v;
                }
            };
            __decorate([
                bindable({ set: v => {
                        setCount++;
                        v = Number(v);
                        values.push(v);
                        return v;
                    } }),
                __metadata("design:type", String),
                __metadata("design:paramtypes", [String])
            ], MyAttr.prototype, "message", null);
            MyAttr = __decorate([
                customAttribute('my-attr')
            ], MyAttr);
            const { component } = createFixture(`<div my-attr.bind="value">`, { value: '1' }, [MyAttr]);
            assert.strictEqual(setCount, 1);
            assert.deepStrictEqual(values, [1]);
            component.value = '2';
            assert.strictEqual(setCount, 2);
            assert.deepStrictEqual(values, [1, 2]);
        });
        it('works with array based computed bindable', function () {
            const MyAttr = CustomAttribute.define({
                name: 'my-attr',
                bindables: ['message']
            }, class {
                constructor() {
                    this._m = [{ v: 'hello' }, { v: 'world' }];
                }
                get message() {
                    return this._m.map(v => v.v).join(' ');
                }
            });
            const { component } = createFixture('<div my-attr.ref=attr my-attr.from-view="value">', class App {
            }, [MyAttr]);
            assert.strictEqual(component.value, 'hello world');
            component.attr._m[1].v = 'world+';
            assert.strictEqual(component.value, 'hello world+');
        });
    });
});
//# sourceMappingURL=custom-attributes.spec.js.map