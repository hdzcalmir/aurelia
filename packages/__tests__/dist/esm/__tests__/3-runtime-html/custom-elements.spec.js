var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Aurelia, bindable, customElement, CustomElement, IAurelia, ValueConverter } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
import { delegateSyntax } from '@aurelia/compat-v1';
import { resolve } from '@aurelia/kernel';
describe('3-runtime-html/custom-elements.spec.ts', function () {
    it('injects right aurelia instance', function () {
        const { component: { au, au1 } } = createFixture(``, class {
            constructor() {
                this.au = resolve(Aurelia);
                this.au1 = resolve(IAurelia);
            }
        });
        assert.strictEqual(au, au1);
    });
    it('works with multiple layers of change propagation & <input/>', function () {
        const { ctx, appHost } = createFixture(`<input value.bind="first_name | properCase">
      <form-input value.two-way="first_name | properCase"></form-input>`, class App {
            constructor() {
                this.message = 'Hello Aurelia 2!';
                this.first_name = '';
            }
        }, [
            CustomElement.define({
                name: 'form-input',
                template: '<input value.bind="value">',
                bindables: {
                    value: { mode: 6 /* BindingMode.twoWay */ }
                }
            }, class FormInput {
            }),
            ValueConverter.define('properCase', class ProperCase {
                toView(value) {
                    if (typeof value == 'string' && value) {
                        return value
                            .split(' ')
                            .map(m => m[0].toUpperCase() + m.substring(1).toLowerCase())
                            .join(' ');
                    }
                    return value;
                }
            }),
        ]);
        const [, nestedInputEl] = Array.from(appHost.querySelectorAll('input'));
        nestedInputEl.value = 'aa bb';
        nestedInputEl.dispatchEvent(new ctx.CustomEvent('input', { bubbles: true }));
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(nestedInputEl.value, 'Aa Bb');
    });
    it('renders containerless per element via "containerless" attribute', function () {
        const { appHost } = createFixture(`<my-el containerless message="hello world">`, class App {
        }, [CustomElement.define({
                name: 'my-el',
                template: '${message}',
                bindables: ['message']
            })]);
        assert.visibleTextEqual(appHost, 'hello world');
    });
    it('renders element with @customElement({ containerness: true })', function () {
        const { assertText } = createFixture(`<my-el message="hello world">`, class App {
        }, [CustomElement.define({
                name: 'my-el',
                template: '${message}',
                bindables: ['message'],
                containerless: true
            })
        ]);
        assertText('hello world');
    });
    it('renders elements with both "containerless" attribute and @customElement({ containerless: true })', function () {
        const { assertText } = createFixture(`<my-el containerless message="hello world">`, class App {
        }, [CustomElement.define({
                name: 'my-el',
                template: '${message}',
                bindables: ['message'],
                containerless: true,
            })]);
        assertText('hello world');
    });
    it('renders elements with template controller and containerless attribute on it', function () {
        const { assertText } = createFixture(`<my-el if.bind="true" containerless message="hello world">`, class App {
        }, [CustomElement.define({
                name: 'my-el',
                template: '${message}',
                bindables: ['message']
            })]);
        assertText('hello world');
    });
    it('works with multi layer reactive changes', function () {
        let TextToggler = class TextToggler {
            constructor() {
                this.rangeStart = 0;
                this.rangeEnd = 0;
                this.range = [0, 0];
            }
            rangeChanged(v) {
                this.rangeStart = v[0];
                this.rangeEnd = v[1];
            }
        };
        TextToggler = __decorate([
            customElement({
                name: 'text-toggler',
                template: '<textarea value.bind="value">',
                bindables: ['range']
            })
        ], TextToggler);
        const { trigger } = createFixture('<button click.trigger="random()">rando</button> <text-toggler range.bind="range">', class {
            constructor() {
                this.range = [0, 0];
            }
            random() {
                this.range = [Math.round(Math.random() * 10), 10 + Math.round(Math.random() * 20)];
            }
        }, [TextToggler]);
        trigger('button', 'click');
    });
    it('works with multi dot event name for trigger', function () {
        let clicked = 0;
        const { trigger } = createFixture('<button bs.open-modal.trigger="clicked()"></button>', { clicked: () => clicked = 1 });
        trigger('button', 'bs.open-modal');
        assert.strictEqual(clicked, 1);
    });
    it('works with multi dot event name for delegate', function () {
        let clicked = 0;
        const { trigger } = createFixture('<button bs.open-modal.delegate="clicked()"></button>', { clicked: () => clicked = 1 }, [delegateSyntax]);
        trigger('button', 'bs.open-modal', { bubbles: true });
        assert.strictEqual(clicked, 1);
    });
    it('works with multi dot event name for capture', function () {
        let clicked = 0;
        const { trigger } = createFixture('<button bs.open-modal.capture="clicked()"></button>', { clicked: () => clicked = 1 });
        trigger('button', 'bs.open-modal');
        assert.strictEqual(clicked, 1);
    });
    describe('resolve', function () {
        afterEach(function () {
            assert.throws(() => resolve(class Abc {
            }));
        });
        it('works basic', function () {
            const { au, component } = createFixture('', class App {
                constructor() {
                    this.au = resolve(IAurelia);
                }
            });
            assert.strictEqual(au, component.au);
        });
        it('works with inheritance', function () {
            class Base {
                constructor() {
                    this.au = resolve(IAurelia);
                }
            }
            let El = class El extends Base {
            };
            El = __decorate([
                customElement('el')
            ], El);
            const { au, component } = createFixture('<el view-model.ref="el">', class App {
            }, [El]);
            assert.strictEqual(au, component.el.au);
        });
    });
    describe('getter bindable', function () {
        it('works in basic scenario', function () {
            const { assertText, flush, trigger } = createFixture(`<my-el view-model.ref=el message="hello world">`, class App {
            }, [CustomElement.define({
                    name: 'my-el',
                    template: '<button click.trigger="_m = 1"></button>${message}',
                    bindables: ['message']
                }, class {
                    constructor() {
                        this._m = 'hey';
                    }
                    get message() {
                        return this._m;
                    }
                    set message(v) {
                        this._m = v;
                    }
                })]);
            assertText('hello world');
            trigger.click('button');
            flush();
            assertText('1');
        });
        it('works with readonly bindable', function () {
            const { assertText, flush, trigger } = createFixture(`<my-el view-model.ref=el message.from-view="message">`, class App {
                constructor() {
                    this.message = 'hello-world';
                }
            }, [CustomElement.define({
                    name: 'my-el',
                    template: '<button click.trigger="_m = 1"></button>${message}',
                    bindables: ['message']
                }, class {
                    constructor() {
                        this._m = 'hey';
                    }
                    get message() {
                        return this._m;
                    }
                })]);
            assertText('hey');
            trigger.click('button');
            flush();
            assertText('1');
        });
        it('works with coercer bindable', function () {
            let setCount = 0;
            const values = [];
            let MyEl = class MyEl {
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
            ], MyEl.prototype, "message", null);
            MyEl = __decorate([
                customElement('my-el')
            ], MyEl);
            const { component } = createFixture(`<my-el message.bind="value">`, { value: '1' }, [MyEl]);
            assert.strictEqual(setCount, 1);
            assert.deepStrictEqual(values, [1]);
            component.value = '2';
            assert.strictEqual(setCount, 2);
            assert.deepStrictEqual(values, [1, 2]);
        });
        it('works with array based computed bindable', function () {
            const { component, assertText, flush, trigger } = createFixture(`<my-el view-model.ref=el message.from-view="message">`, class App {
                constructor() {
                    this.message = '';
                }
            }, [CustomElement.define({
                    name: 'my-el',
                    template: '<button click.trigger="_m[0].v = `hey`"></button>${message}',
                    bindables: ['message']
                }, class {
                    constructor() {
                        this._m = [{ v: 'hello' }, { v: 'world' }];
                    }
                    get message() {
                        return this._m.map(v => v.v).join(' ');
                    }
                })]);
            assertText('hello world');
            assert.strictEqual(component.message, 'hello world');
            trigger.click('button');
            flush();
            assertText('hey world');
            assert.strictEqual(component.message, 'hey world');
        });
        it('works with change handler', function () {
            let count = 0;
            let MyEl = class MyEl {
                constructor() {
                    this._m = '';
                }
                get message() {
                    return this._m;
                }
                set message(v) {
                    this._m = v;
                }
                messageChanged() {
                    count = 1;
                }
            };
            __decorate([
                bindable,
                __metadata("design:type", String),
                __metadata("design:paramtypes", [String])
            ], MyEl.prototype, "message", null);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: '' })
            ], MyEl);
            const { component } = createFixture(`<my-el message.bind="value">`, { value: 'hey' }, [MyEl]);
            assert.strictEqual(count, 0);
            component.value = 'helo';
            assert.strictEqual(count, 1);
        });
        it('works with all change handler', function () {
            const calls = [];
            let MyEl = class MyEl {
                constructor() {
                    this._m = '';
                }
                get message() {
                    return this._m;
                }
                set message(v) {
                    this._m = v;
                }
                get m() {
                    return this._m;
                }
                set m(v) {
                    this._m = v;
                }
                propertyChanged(...args) {
                    calls.push(args);
                }
            };
            __decorate([
                bindable,
                __metadata("design:type", String),
                __metadata("design:paramtypes", [String])
            ], MyEl.prototype, "message", null);
            __decorate([
                bindable,
                __metadata("design:type", String),
                __metadata("design:paramtypes", [String])
            ], MyEl.prototype, "m", null);
            MyEl = __decorate([
                customElement({ name: 'my-el', template: '' })
            ], MyEl);
            const { component } = createFixture(`<my-el message.bind="value" m.bind="v">`, { value: 'hey', v: 'hey' }, [MyEl]);
            component.value = 'helo';
            assert.deepStrictEqual(calls, [['message', 'helo', 'hey']]);
            component.v = 'hi';
            assert.deepStrictEqual(calls, [
                ['message', 'helo', 'hey'],
                // this last argument is wrong, it should be hello
                // but because it doesn't eagerly observe the getter
                // so the computed observer of `m` still has the original value assigned during binding phase
                // leaving this like this for now, since it doesnt need to commit to observation early, also for the old value
                ['m', 'hi', 'hey']
            ]);
        });
    });
});
//# sourceMappingURL=custom-elements.spec.js.map