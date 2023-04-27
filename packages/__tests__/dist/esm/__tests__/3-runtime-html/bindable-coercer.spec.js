var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DI, noop, Registration } from '@aurelia/kernel';
import { Aurelia, bindable, customElement, CustomElement, IPlatform, coercer, customAttribute, CustomAttribute, StandardConfiguration } from '@aurelia/runtime-html';
import { assert, PLATFORMRegistration, TestContext } from '@aurelia/testing';
import { createSpecFunction } from '../util.js';
describe('3-runtime-html/bindable-coercer.spec.ts', function () {
    const $it = createSpecFunction(testRepeatForCustomElement);
    async function testRepeatForCustomElement(testFunction, { template, registrations = [], app, enableCoercion = true, coerceNullish = false, }) {
        const ctx = TestContext.create();
        const host = ctx.doc.createElement('div');
        ctx.doc.body.appendChild(host);
        const container = ctx['_container'] = DI.createContainer();
        container.register(StandardConfiguration
            .customize((opt) => {
            opt.coercingOptions.enableCoercion = enableCoercion;
            opt.coercingOptions.coerceNullish = coerceNullish;
        }), Registration.instance(TestContext, ctx), ...registrations);
        if (container.has(IPlatform, true) === false) {
            container.register(PLATFORMRegistration);
        }
        const au = new Aurelia(container);
        await au
            .app({
            host,
            component: CustomElement.define({ name: 'app', isStrictBinding: true, template }, app ?? class {
            })
        })
            .start();
        const component = au.root.controller.viewModel;
        await testFunction({ app: component, container, ctx, host, platform: container.get(IPlatform) });
        await au.stop();
        assert.strictEqual(host.textContent, '', `host.textContent`);
        ctx.doc.body.removeChild(host);
    }
    function getTypeSpecification(type) {
        return type === undefined ? 'implicit type from TS metadata' : 'explicit type';
    }
    for (const type of [undefined, Number]) {
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ type }),
                __metadata("design:type", Number)
            ], MyEl.prototype, "num", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
            }
            $it(`number - numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 42);
            }, { app: App, template: `<my-el view-model.ref="myEl" num="42"></my-el>`, registrations: [MyEl] });
            $it(`number - numeric string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 42);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`number - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 42);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`number - non-numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(Number.isNaN(ctx.app.myEl.num), true);
            }, { app: App, template: `<my-el view-model.ref="myEl" num="forty-two"></my-el>`, registrations: [MyEl] });
            $it(`number - non-numeric string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(Number.isNaN(ctx.app.myEl.num), true);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="'forty-two'"></my-el>`, registrations: [MyEl] });
            $it(`number - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 1);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`number - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, 0);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`number - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, undefined);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`number - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, null);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`number - object - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(Number.isNaN(ctx.app.myEl.num), true);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="{}"></my-el>`, registrations: [MyEl] });
            $it(`number - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.num, undefined);
                app.prop = null;
                assert.strictEqual(myEl.num, null);
                app.prop = '0';
                assert.strictEqual(myEl.num, 0);
                app.prop = '42';
                assert.strictEqual(myEl.num, 42);
                app.prop = 0;
                assert.strictEqual(myEl.num, 0);
                app.prop = 84;
                assert.strictEqual(myEl.num, 84);
                app.prop = true;
                assert.strictEqual(myEl.num, 1);
                app.prop = 'true';
                assert.strictEqual(Number.isNaN(myEl.num), true);
                app.prop = {};
                assert.strictEqual(Number.isNaN(myEl.num), true);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ nullable: false, type }),
                __metadata("design:type", Number)
            ], MyEl.prototype, "num", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
            }
            $it(`not-nullable number - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(Number.isNaN(myEl.num), true);
                app.prop = null;
                assert.strictEqual(myEl.num, 0);
                app.prop = '42';
                assert.strictEqual(myEl.num, 42);
                app.prop = 0;
                assert.strictEqual(myEl.num, 0);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    for (const type of [undefined, String]) {
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ type }),
                __metadata("design:type", String)
            ], MyEl.prototype, "str", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
            }
            $it(`string - string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '42');
            }, { app: App, template: `<my-el view-model.ref="myEl" str="42"></my-el>`, registrations: [MyEl] });
            $it(`string - string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '42');
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`string - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '42');
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, 'true');
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, 'false');
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`string - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, undefined);
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`string - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, null);
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`string - object - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.str, '[object Object]');
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="{}"></my-el>`, registrations: [MyEl] });
            $it(`string - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.str, undefined);
                app.prop = null;
                assert.strictEqual(myEl.str, null);
                app.prop = '0';
                assert.strictEqual(myEl.str, '0');
                app.prop = '42';
                assert.strictEqual(myEl.str, '42');
                app.prop = 0;
                assert.strictEqual(myEl.str, '0');
                app.prop = 42;
                assert.strictEqual(myEl.str, '42');
                app.prop = true;
                assert.strictEqual(myEl.str, 'true');
                app.prop = false;
                assert.strictEqual(myEl.str, 'false');
                app.prop = {};
                assert.strictEqual(myEl.str, '[object Object]');
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ nullable: false, type }),
                __metadata("design:type", String)
            ], MyEl.prototype, "str", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
            }
            $it(`not-nullable string - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.str, 'undefined');
                app.prop = null;
                assert.strictEqual(myEl.str, 'null');
                app.prop = '42';
                assert.strictEqual(myEl.str, '42');
                app.prop = 0;
                assert.strictEqual(myEl.str, '0');
            }, { app: App, template: `<my-el view-model.ref="myEl" str.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    for (const type of [undefined, Boolean]) {
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ type }),
                __metadata("design:type", Boolean)
            ], MyEl.prototype, "bool", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
            }
            $it(`string - boolean true string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool="true"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean false string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool="false"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean true string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`string - boolean false string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, false);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`string - number 1 literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="1"></my-el>`, registrations: [MyEl] });
            $it(`string -number 0 literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, false);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="0"></my-el>`, registrations: [MyEl] });
            $it(`string - numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool="42"></my-el>`, registrations: [MyEl] });
            $it(`string - string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`string - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`string - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, undefined);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`string - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, null);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`string - object - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="{}"></my-el>`, registrations: [MyEl] });
            $it(`string - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.bool, undefined);
                app.prop = null;
                assert.strictEqual(myEl.bool, null);
                app.prop = '0';
                assert.strictEqual(myEl.bool, true);
                app.prop = '1';
                assert.strictEqual(myEl.bool, true);
                app.prop = '42';
                assert.strictEqual(myEl.bool, true);
                app.prop = 0;
                assert.strictEqual(myEl.bool, false);
                app.prop = 1;
                assert.strictEqual(myEl.bool, true);
                app.prop = 42;
                assert.strictEqual(myEl.bool, true);
                app.prop = true;
                assert.strictEqual(myEl.bool, true);
                app.prop = false;
                assert.strictEqual(myEl.bool, false);
                app.prop = 'true';
                assert.strictEqual(myEl.bool, true);
                app.prop = 'false';
                assert.strictEqual(myEl.bool, true);
                app.prop = {};
                assert.strictEqual(myEl.bool, true);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ nullable: false, type }),
                __metadata("design:type", Boolean)
            ], MyEl.prototype, "bool", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
            }
            $it(`not-nullable boolean - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.bool, false);
                app.prop = null;
                assert.strictEqual(myEl.bool, false);
                app.prop = '42';
                assert.strictEqual(myEl.bool, true);
                app.prop = 0;
                assert.strictEqual(myEl.bool, false);
            }, { app: App, template: `<my-el view-model.ref="myEl" bool.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    for (const type of [undefined, BigInt]) {
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ type }),
                __metadata("design:type", BigInt)
            ], MyEl.prototype, "num", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
            }
            $it(`bigint - numeric string literal - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(42));
            }, { app: App, template: `<my-el view-model.ref="myEl" num="42"></my-el>`, registrations: [MyEl] });
            $it(`bigint - numeric string literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(42));
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="'42'"></my-el>`, registrations: [MyEl] });
            $it(`bigint - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(42));
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="42"></my-el>`, registrations: [MyEl] });
            $it(`bigint - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(1));
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="true"></my-el>`, registrations: [MyEl] });
            $it(`bigint - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, BigInt(0));
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="false"></my-el>`, registrations: [MyEl] });
            $it(`bigint - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, undefined);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="undefined"></my-el>`, registrations: [MyEl] });
            $it(`bigint - null - ${getTypeSpecification(type)}`, function (ctx) {
                assert.strictEqual(ctx.app.myEl.num, null);
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="null"></my-el>`, registrations: [MyEl] });
            $it(`bigint - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.num, undefined);
                app.prop = null;
                assert.strictEqual(myEl.num, null);
                app.prop = '0';
                assert.strictEqual(myEl.num, BigInt(0));
                app.prop = '42';
                assert.strictEqual(myEl.num, BigInt(42));
                app.prop = 0;
                assert.strictEqual(myEl.num, BigInt(0));
                app.prop = 84;
                assert.strictEqual(myEl.num, BigInt(84));
                app.prop = true;
                assert.strictEqual(myEl.num, BigInt(1));
                assert.throws(() => {
                    app.prop = 'true';
                });
                assert.throws(() => {
                    app.prop = {};
                });
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ nullable: false, type }),
                __metadata("design:type", BigInt)
            ], MyEl.prototype, "num", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
                constructor() {
                    this.prop = 42;
                }
            }
            $it(`not-nullable number - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.strictEqual(myEl.num, BigInt(42));
                assert.throws(() => {
                    app.prop = null;
                });
                assert.throws(() => {
                    app.prop = undefined;
                });
                app.prop = 0;
                assert.strictEqual(myEl.num, BigInt(0));
            }, { app: App, template: `<my-el view-model.ref="myEl" num.bind="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }
    }
    Person.coerced = 0;
    function createPerson(value) {
        if (value instanceof this)
            return value;
        this.coerced++;
        if (typeof value === 'string') {
            try {
                const json = JSON.parse(value);
                return new this(json.name, json.age);
            }
            catch {
                return new this(value, null);
            }
        }
        if (typeof value === 'number') {
            return new this(null, value);
        }
        if (typeof value === 'object' && value != null) {
            return new this(value.name, value.age);
        }
        return new this(null, null);
    }
    /* eslint-disable no-useless-escape */
    {
        class Person1 extends Person {
        }
        Person1.coerce = createPerson.bind(Person1);
        for (const type of [undefined, Person1]) {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ type }),
                __metadata("design:type", Person1)
            ], MyEl.prototype, "person", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            {
                class App {
                }
                $it(`class with static coercer - string literal - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1('john', null));
                }, { app: App, template: `<my-el view-model.ref="myEl" person="john"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(null, 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="42"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - json string - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person='{\"name\":\"john\",\"age\":42}'></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - object literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="{name:'john',age:42}"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(null, null));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="true"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(null, null));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="false"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, undefined);
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="undefined"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - null - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, null);
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="null"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - object - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person1(void 0, void 0));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="{}"></my-el>`, registrations: [MyEl] });
                $it(`class with static coercer - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.strictEqual(myEl.person, undefined);
                    app.prop = null;
                    assert.strictEqual(myEl.person, null);
                    app.prop = 'john';
                    assert.deepStrictEqual(myEl.person, new Person1('john', null));
                    app.prop = JSON.stringify(new Person1('john', 42));
                    assert.deepStrictEqual(myEl.person, new Person1('john', 42));
                    app.prop = 42;
                    assert.deepStrictEqual(myEl.person, new Person1(null, 42));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
            {
                let MyEl = class MyEl {
                };
                __decorate([
                    bindable({ nullable: false, type }),
                    __metadata("design:type", Person1)
                ], MyEl.prototype, "person", void 0);
                MyEl = __decorate([
                    customElement({ name: 'my-el', template: 'irrelevant' })
                ], MyEl);
                class App {
                }
                $it(`not-nullable - class with static coercer - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.deepStrictEqual(myEl.person, new Person1(null, null));
                    app.prop = null;
                    assert.deepStrictEqual(myEl.person, new Person1(null, null));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person1('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
        }
    }
    {
        beforeEach(function () { Person2.coerced = 0; });
        class Person2 extends Person {
            static createPerson(value) { return createPerson.bind(Person2)(value); }
        }
        __decorate([
            coercer,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object]),
            __metadata("design:returntype", void 0)
        ], Person2, "createPerson", null);
        for (const type of [undefined, Person2]) {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable({ type }),
                __metadata("design:type", Person2)
            ], MyEl.prototype, "person", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            {
                class App {
                }
                $it(`class with coercer decorator - string literal - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2('john', null));
                }, { app: App, template: `<my-el view-model.ref="myEl" person="john"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - numeric literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(null, 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="42"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - json string - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person='{\"name\":\"john\",\"age\":42}'></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - object literal bind - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="{name:'john',age:42}"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - boolean true - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(null, null));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="true"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - boolean false - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(null, null));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="false"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - undefined - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, undefined);
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="undefined"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - null - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, null);
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="null"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - object - ${getTypeSpecification(type)}`, function (ctx) {
                    assert.deepStrictEqual(ctx.app.myEl.person, new Person2(void 0, void 0));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="{}"></my-el>`, registrations: [MyEl] });
                $it(`class with coercer decorator - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.strictEqual(myEl.person, undefined);
                    app.prop = null;
                    assert.strictEqual(myEl.person, null);
                    app.prop = 'john';
                    assert.deepStrictEqual(myEl.person, new Person2('john', null));
                    app.prop = JSON.stringify(new Person2('john', 42));
                    assert.deepStrictEqual(myEl.person, new Person2('john', 42));
                    app.prop = 42;
                    assert.deepStrictEqual(myEl.person, new Person2(null, 42));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
            {
                let MyEl = class MyEl {
                };
                __decorate([
                    bindable({ nullable: false, type }),
                    __metadata("design:type", Person2)
                ], MyEl.prototype, "person", void 0);
                MyEl = __decorate([
                    customElement({ name: 'my-el', template: 'irrelevant' })
                ], MyEl);
                class App {
                }
                $it(`not-nullable - class with coercer decorator - bound property - ${getTypeSpecification(type)}`, async function (ctx) {
                    const app = ctx.app;
                    const myEl = app.myEl;
                    assert.deepStrictEqual(myEl.person, new Person2(null, null));
                    app.prop = null;
                    assert.deepStrictEqual(myEl.person, new Person2(null, null));
                    app.prop = { name: 'john', age: 42 };
                    assert.deepStrictEqual(myEl.person, new Person2('john', 42));
                }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
            }
        }
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable,
                __metadata("design:type", Person2)
            ], MyEl.prototype, "person", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
                constructor() {
                    this.prop = { name: 'john', age: 42 };
                }
            }
            $it(`change propagation - class`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.deepStrictEqual(myEl.person, new Person2('john', 42), 'error1');
                assert.strictEqual(Person2.coerced, 1, 'error2');
                app.prop.age = 84;
                assert.deepStrictEqual(myEl.person, new Person2('john', 42), 'error3');
                assert.strictEqual(Person2.coerced, 1, 'error4');
                const person = app.prop = new Person2('john', 84);
                assert.strictEqual(myEl.person, person, 'error5');
                assert.strictEqual(Person2.coerced, 1, 'error6');
                person.age = 42;
                assert.strictEqual(myEl.person.age, 42, 'error7');
                assert.strictEqual(Person2.coerced, 1, 'error8');
            }, { app: App, template: `<my-el view-model.ref="myEl" person.bind="prop"></my-el>`, registrations: [MyEl] });
        }
        {
            let MyEl = class MyEl {
            };
            __decorate([
                bindable,
                __metadata("design:type", Person2)
            ], MyEl.prototype, "person", void 0);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: 'irrelevant' })
            ], MyEl);
            class App {
                constructor() {
                    this.prop = { name: 'john', age: 42 };
                }
            }
            $it(`change propagation - class - two-way`, async function (ctx) {
                const app = ctx.app;
                const myEl = app.myEl;
                assert.deepStrictEqual(myEl.person, new Person2('john', 42), 'error1');
                assert.strictEqual(Person2.coerced, 1, 'error2');
                assert.notInstanceOf(app.prop, Person2);
                const person = myEl.person = new Person2('foo', 42);
                assert.strictEqual(app.prop, person);
            }, { app: App, template: `<my-el view-model.ref="myEl" person.two-way="prop"></my-el>`, registrations: [MyEl] });
        }
    }
    /* eslint-enable no-useless-escape */
    {
        let MyEl = class MyEl {
        };
        __decorate([
            bindable,
            __metadata("design:type", Object)
        ], MyEl.prototype, "prop", void 0);
        MyEl = __decorate([
            customElement({ name: 'my-el', template: 'irrelevant' })
        ], MyEl);
        class App {
        }
        $it('auto-coercing does not work for type union', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: `<my-el view-model.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = class MyEl {
        };
        __decorate([
            bindable({ type: Number }),
            __metadata("design:type", Object)
        ], MyEl.prototype, "prop", void 0);
        MyEl = __decorate([
            customElement({ name: 'my-el', template: 'irrelevant' })
        ], MyEl);
        class App {
        }
        $it('auto-coercing can be coerced with explicit type for type union', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, 1);
        }, { app: App, template: `<my-el view-model.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = class MyEl {
        };
        __decorate([
            bindable({ type: Object }),
            __metadata("design:type", Number)
        ], MyEl.prototype, "prop", void 0);
        MyEl = __decorate([
            customElement({ name: 'my-el', template: 'irrelevant' })
        ], MyEl);
        class App {
        }
        $it('auto-coercing can be disabled with explicit Object type', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: `<my-el view-model.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = class MyEl {
        };
        __decorate([
            bindable({ set: noop }),
            __metadata("design:type", Number)
        ], MyEl.prototype, "prop", void 0);
        MyEl = __decorate([
            customElement({ name: 'my-el', template: 'irrelevant' })
        ], MyEl);
        class App {
        }
        $it('auto-coercing can be disabled with explicit noop set interceptor function', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: `<my-el view-model.ref="myEl" prop.bind="true"></my-el>`, registrations: [MyEl] });
    }
    {
        let MyEl = class MyEl {
        };
        __decorate([
            bindable({ type: Number }),
            __metadata("design:type", Number)
        ], MyEl.prototype, "prop", void 0);
        MyEl = __decorate([
            customElement({ name: 'my-el', template: 'irrelevant' })
        ], MyEl);
        class App {
        }
        $it('auto-coercion can be disabled globally', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, true);
        }, { app: App, template: '<my-el view-model.ref="myEl" prop.bind="true"></my-el>', registrations: [MyEl], enableCoercion: false });
    }
    {
        let MyEl = class MyEl {
        };
        __decorate([
            bindable({ type: Number }),
            __metadata("design:type", Number)
        ], MyEl.prototype, "prop", void 0);
        MyEl = __decorate([
            customElement({ name: 'my-el', template: 'irrelevant' })
        ], MyEl);
        class App {
        }
        $it('auto-coercion of null-like values can be enforced globally', async function (ctx) {
            assert.strictEqual(ctx.app.myEl.prop, 0);
        }, { app: App, template: '<my-el view-model.ref="myEl" prop.bind="null"></my-el>', registrations: [MyEl], coerceNullish: true });
    }
    {
        let MyAttr = class MyAttr {
        };
        __decorate([
            bindable,
            __metadata("design:type", Number)
        ], MyAttr.prototype, "value", void 0);
        MyAttr = __decorate([
            customAttribute({ name: 'my-attr' })
        ], MyAttr);
        class App {
        }
        $it('auto-coercion works for custom element', async function (ctx) {
            const myAttr = CustomAttribute.for(ctx.host.querySelector('div'), 'my-attr').viewModel;
            assert.strictEqual(myAttr.value, 42);
        }, { app: App, template: `<div my-attr="42"></div>`, registrations: [MyAttr] });
    }
});
//# sourceMappingURL=bindable-coercer.spec.js.map