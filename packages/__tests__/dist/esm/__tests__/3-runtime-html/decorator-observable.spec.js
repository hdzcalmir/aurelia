var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { observable, SetterObserver, IObserverLocator } from '@aurelia/runtime';
import { assert, createFixture } from '@aurelia/testing';
import { noop } from '@aurelia/kernel';
import { ValueConverter } from '@aurelia/runtime-html';
describe('3-runtime-html/decorator-observable.spec.ts', function () {
    const oldValue = 'old';
    const newValue = 'new';
    // [UNIT] tests needed:         change handler, symbol key, symbol change handler
    // todo: define the spec how it should behave for:
    // [INTEGRATION] tests needed:  <select 2 way /> <radio 2 way />
    it('initializes with TS', function () {
        let callCount = 0;
        class Test {
            constructor() {
                this.value = oldValue;
            }
            valueChanged() {
                callCount++;
            }
        }
        __decorate([
            observable,
            __metadata("design:type", Object)
        ], Test.prototype, "value", void 0);
        const instance = new Test();
        // with TS, initialization of class field are in constructor
        assert.strictEqual(callCount, 1);
        assert.strictEqual(instance.value, oldValue);
        assert.notInstanceOf(instance.$observers['value'], SetterObserver);
        instance.value = newValue;
        assert.strictEqual(callCount, 2);
        assert.strictEqual(instance.value, newValue);
    });
    it('should not call valueChanged when property is assigned the same value', function () {
        let callCount = 0;
        class Test {
            constructor() {
                this.value = oldValue;
            }
            valueChanged() {
                callCount++;
            }
        }
        __decorate([
            observable,
            __metadata("design:type", Object)
        ], Test.prototype, "value", void 0);
        const instance = new Test();
        assert.strictEqual(callCount, 1);
        instance.value = oldValue;
        assert.strictEqual(callCount, 1);
    });
    it('initialize with Babel property decorator', function () {
        let callCount = 0;
        class Test {
            valueChanged() {
                callCount++;
            }
        }
        Object.defineProperty(Test.prototype, 'value', observable(Test.prototype, 'value', {
            configurable: true,
            writable: true,
            initializer: () => oldValue
        }));
        const instance = new Test();
        assert.strictEqual(callCount, 0);
        assert.strictEqual(instance.value, oldValue);
        instance.value = oldValue;
        assert.strictEqual(callCount, 0);
        instance.value = newValue;
        assert.strictEqual(callCount, 1);
    });
    it('should call customHandler when changing the property', function () {
        let callCount = 0;
        class Test {
            constructor() {
                this.value = oldValue;
            }
            customHandler() {
                callCount++;
            }
        }
        __decorate([
            observable({ callback: 'customHandler' }),
            __metadata("design:type", Object)
        ], Test.prototype, "value", void 0);
        const instance = new Test();
        assert.strictEqual(callCount, 1);
        instance.value = newValue;
        assert.strictEqual(callCount, 2);
        instance.customHandler = noop;
        instance.value = oldValue;
        // change handler is resolved once
        assert.strictEqual(callCount, 3);
    });
    describe('with normal app', function () {
        it('works in basic scenario', async function () {
            const noValue = {};
            let $div = noValue;
            class App {
                divChanged(div) {
                    $div = div;
                }
            }
            __decorate([
                observable,
                __metadata("design:type", Object)
            ], App.prototype, "div", void 0);
            const { component, platform, testHost, tearDown, startPromise } = createFixture(`<div ref="div"></div>\${div.tagName}`, App);
            await startPromise;
            assert.notDeepStrictEqual($div, noValue);
            assert.strictEqual(testHost.textContent, 'DIV');
            component.div = { tagName: 'hello' };
            platform.domWriteQueue.flush();
            assert.strictEqual(testHost.textContent, 'hello');
            await tearDown();
        });
        it('works for 2 way binding', async function () {
            let changeCount = 0;
            class App {
                vChanged(_input) {
                    changeCount++;
                }
            }
            __decorate([
                observable,
                __metadata("design:type", Object)
            ], App.prototype, "v", void 0);
            const { ctx, component, platform, testHost, tearDown, startPromise } = createFixture('<input value.bind="v">', App);
            await startPromise;
            const input = testHost.querySelector('input');
            assert.strictEqual(input.value, '');
            component.v = 'v';
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, '');
            platform.domWriteQueue.flush();
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, 'v');
            input.value = 'vv';
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 'vv');
            assert.strictEqual(changeCount, 2);
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 'vv');
            assert.strictEqual(changeCount, 2);
            await tearDown();
        });
        it('works with 2 way binding and converter', async function () {
            let changeCount = 0;
            class App {
                vChanged(_input) {
                    changeCount++;
                }
            }
            __decorate([
                observable({
                    set: v => Number(v) || 0
                }),
                __metadata("design:type", Object)
            ], App.prototype, "v", void 0);
            const { ctx, component, platform, testHost, tearDown, startPromise } = createFixture('<input value.bind="v">', App);
            await startPromise;
            const input = testHost.querySelector('input');
            assert.strictEqual(input.value, '');
            component.v = 'v';
            assert.strictEqual(component.v, 0);
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, '');
            platform.domWriteQueue.flush();
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, '0');
            input.value = 'vv';
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 0);
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, 'vv');
            platform.domWriteQueue.flush();
            // for this assignment, the component.v still 0
            // so there was no change, and it's not propagated back to the input
            assert.strictEqual(input.value, 'vv');
            assert.strictEqual(component.v, 0);
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 0);
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, 'vv');
            platform.domWriteQueue.flush();
            assert.strictEqual(input.value, 'vv');
            assert.strictEqual(component.v, 0);
            // real valid input assertion
            input.value = '1';
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 1);
            assert.strictEqual(changeCount, 2);
            platform.domWriteQueue.flush();
            assert.strictEqual(input.value, '1');
            await tearDown();
        });
        it('works with 2 way binding and value converter', async function () {
            let changeCount = 0;
            class App {
                vChanged(_input) {
                    changeCount++;
                }
            }
            __decorate([
                observable({
                    set: v => Number(v) || 0
                }),
                __metadata("design:type", Object)
            ], App.prototype, "v", void 0);
            const { ctx, component, platform, testHost, tearDown, startPromise } = createFixture('<input value.bind="v | two">', App, [ValueConverter.define('two', class {
                    fromView(v) {
                        // converting back and forth with number
                        // so prefixing with '0' to avoid infinite loop
                        return `0${v}`;
                    }
                    toView(v) {
                        return v;
                    }
                })]);
            await startPromise;
            const input = testHost.querySelector('input');
            assert.strictEqual(input.value, '');
            component.v = 'v';
            assert.strictEqual(component.v, 0);
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, '');
            platform.domWriteQueue.flush();
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, '0');
            input.value = 'vv';
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 0);
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, 'vv');
            platform.domWriteQueue.flush();
            // for this assignment, the component.v still 0
            // so there was no change, and it's not propagated back to the input
            assert.strictEqual(input.value, 'vv');
            assert.strictEqual(component.v, 0);
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 0);
            assert.strictEqual(changeCount, 1);
            assert.strictEqual(input.value, 'vv');
            platform.domWriteQueue.flush();
            assert.strictEqual(input.value, 'vv');
            assert.strictEqual(component.v, 0);
            // real valid input assertion
            input.value = '1';
            input.dispatchEvent(new ctx.CustomEvent('input'));
            assert.strictEqual(component.v, 1);
            assert.strictEqual(changeCount, 2);
            platform.domWriteQueue.flush();
            assert.strictEqual(input.value, '1');
            await tearDown();
        });
    });
    it('handle recursive changes', async function () {
        const { component, appHost, startPromise, tearDown } = createFixture(`
      <button click.trigger="incr()">Incr()</button>
      <button click.trigger="decr()">Decr()</button>
      <div id="logs"><div repeat.for="log of logs">\${log}</div></div>
    `, MyApp);
        await startPromise;
        // from TS code compilation, field initializer is compiled to assignment in ctor
        assert.deepStrictEqual(component.logs, [['P.1. countChanged()', 0]]);
        component.logs.splice(0);
        const [incrButton, decrButton] = Array.from(appHost.querySelectorAll('button'));
        incrButton.click();
        assert.deepStrictEqual(component.logs, Array
            .from({ length: 9 })
            .reduce((acc, _, idx) => {
            acc.push(['P.1. countChanged()', idx + 1], ['S.1. handleChange()', idx + 1]);
            return acc;
        }, [])
            .concat([
            ['P.1. countChanged()', 10],
            ['After incr()', 10]
        ]));
        decrButton.click();
        const logs = Array
            .from({ length: 9 })
            .reduce((acc, _, idx) => {
            acc.push(['P.1. countChanged()', idx + 1], ['S.1. handleChange()', idx + 1]);
            return acc;
        }, [])
            .concat([
            ['P.1. countChanged()', 10],
            ['After incr()', 10]
        ]);
        assert.deepStrictEqual(component.logs, logs
            .concat(Array
            .from({ length: 9 })
            .reduce((acc, _, idx) => {
            // start at 10 when click, but the first value log will be after the substraction of 1, which is 10 - 1
            acc.push(['P.1. countChanged()', 9 - idx], ['S.1. handleChange()', 9 - idx]);
            return acc;
        }, []))
            .concat([
            ['P.1. countChanged()', 0],
            ['After decr()', 0]
        ]));
        await tearDown();
    });
    class MyApp {
        constructor() {
            this.message = 'Hello Aurelia 2!';
            this.logs = [];
            this.count = 0;
        }
        created() {
            this.countObs = this['$controller'].container.get(IObserverLocator).getObserver(this, 'count');
            this.countObs.subscribe({
                handleChange: (value, oldValue) => {
                    if (value > 0 && value < 10) {
                        this.log('S.1. handleChange()', value);
                        if (value > oldValue) {
                            this.count++;
                        }
                        else {
                            this.count--;
                        }
                    }
                }
            });
        }
        countChanged(value) {
            this.log('P.1. countChanged()', value);
        }
        incr() {
            if (this.count < 10) {
                this.count++;
                this.log('After incr()', this.count);
                // console.assert(this.count, 9);
            }
        }
        decr() {
            if (this.count > 0) {
                this.count--;
                this.log('After decr()', this.count);
                // console.assert(this.count, 1);
            }
        }
        log(...msgs) {
            this.logs.push(msgs);
        }
    }
    __decorate([
        observable,
        __metadata("design:type", Number)
    ], MyApp.prototype, "count", void 0);
});
//# sourceMappingURL=decorator-observable.spec.js.map