import { ComputedObserver, IDirtyChecker, IObserverLocator } from '@aurelia/runtime';
import { assert, createFixture, eachCartesianJoin, } from '@aurelia/testing';
describe('3-runtime-html/computed-observer.spec.ts', function () {
    const computedObserverTestCases = [
        {
            title: 'works in basic scenario',
            template: `\${total}`,
            ViewModel: class TestClass {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1 };
                    });
                }
                get total() {
                    return this.items.reduce((total, item) => total + (item.value > 5 ? item.value : 0), 0);
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '40');
                component.items[0].value = 100;
                assert.strictEqual(host.textContent, '40');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '140');
                component.items.splice(1, 1, { name: 'item - 1', value: 100 });
                // todo: this scenario
                // component.items[1] = { name: 'item - 1', value: 100 };
                assert.strictEqual(host.textContent, '140');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '240');
            },
        },
        {
            title: 'works with [].filter https://github.com/aurelia/aurelia/issues/534',
            template: `\${total}`,
            ViewModel: class App {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1, isDone: idx % 2 === 0 };
                    });
                }
                get total() {
                    return this.items.filter(item => item.isDone).length;
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '5');
                component.items[1].isDone = true;
                assert.strictEqual(host.textContent, '5');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '6');
            },
        },
        {
            title: 'works with multiple layers of fn call',
            template: `\${total}`,
            ViewModel: class App {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1, isDone: idx % 2 === 0 };
                    });
                }
                get total() {
                    return this
                        .items
                        .filter(item => item.isDone)
                        .filter(item => item.value > 1)
                        .length;
                }
            },
            assertFn: (ctx, host, component) => {
                assert.html.textContent(host, '4');
                component.items[1].isDone = true;
                assert.html.textContent(host, '4');
                ctx.platform.domWriteQueue.flush();
                assert.html.textContent(host, '5');
            },
        },
        {
            title: 'works with Map.size',
            template: `\${total}`,
            ViewModel: class App {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1, isDone: idx % 2 === 0 };
                    });
                    this.itemMap = new Map([1, 2, 3].map(i => [`item - ${i}`, i]));
                }
                get total() {
                    return this.itemMap.size;
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '3');
                component.itemMap.set(`item - 4`, 10);
                assert.strictEqual(host.textContent, '3');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '4');
            },
        },
        {
            title: 'works with multiple computed dependencies',
            template: `\${total}`,
            ViewModel: class App {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1, isDone: idx % 2 === 0 };
                    });
                }
                get activeItems() {
                    return this.items.filter(i => !i.isDone);
                }
                get total() {
                    return this.activeItems.reduce((total, item) => total + item.value, 0);
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '30' /* idx 0, 2, 4, 6, 8 only */);
                component.items[0].isDone = false;
                assert.strictEqual(component.activeItems.length, 6);
                assert.strictEqual(host.textContent, '30');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '31');
            },
        },
        {
            title: 'works with array index',
            template: `\${total}`,
            ViewModel: class AppBase {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1, isDone: idx % 2 === 0 };
                    });
                }
                get total() {
                    return this.items[0].value;
                }
            },
            assertFn: (ctx, host, component) => {
                const dirtyChecker = ctx.container.get(IDirtyChecker);
                assert.strictEqual(dirtyChecker.tracked.length, 0, 'Should have had no dirty checking');
                assert.html.textContent(host, '1');
                component.items.splice(0, 1, { name: 'mock', value: 1000 });
                assert.html.textContent(host, '1');
                ctx.platform.domWriteQueue.flush();
                assert.html.textContent(host, '1000');
            },
        },
        {
            title: 'Works with <let/>',
            template: `<let real-total.bind="total * 2"></let>\${realTotal}`,
            ViewModel: class App {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1, isDone: idx % 2 === 0 };
                    });
                }
                get total() {
                    return this.items.reduce((total, item) => total + item.value, 0);
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '110');
                component.items[0].value = 100;
                assert.strictEqual(host.textContent, '110');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '308');
            },
        },
        {
            title: 'Works with [repeat]',
            template: `<div repeat.for="item of activeItems">\${item.value}.</div>`,
            ViewModel: class App {
                constructor() {
                    this.items = Array.from({ length: 10 }, (_, idx) => {
                        return { name: `i-${idx}`, value: idx + 1, isDone: idx % 2 === 0 };
                    });
                }
                get activeItems() {
                    return this.items.filter(i => !i.isDone);
                }
                get total() {
                    return this.activeItems.reduce((total, item) => total + item.value, 0);
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '2.4.6.8.10.');
                component.items[1].isDone = true;
                // todo: why so eagerly?
                assert.strictEqual(host.textContent, '4.6.8.10.');
            },
        },
        {
            title: 'Works with set/get (class property)',
            template: `<input value.bind="nameProp.value">\${nameProp.value}`,
            ViewModel: class App {
                constructor() {
                    this.items = [];
                    this.total = 0;
                    this.nameProp = new Property('value', '');
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '');
                const inputEl = host.querySelector('input');
                inputEl.value = '50';
                inputEl.dispatchEvent(new ctx.CustomEvent('input'));
                assert.strictEqual(host.textContent, '');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '50');
                assert.strictEqual(component.nameProp.value, '50');
                assert.strictEqual(component.nameProp._value, '50');
                const observerLocator = ctx.container.get(IObserverLocator);
                const namePropValueObserver = observerLocator
                    .getObserver(component.nameProp, 'value');
                assert.instanceOf(namePropValueObserver, ComputedObserver);
                assert.strictEqual(namePropValueObserver.$get, Object.getOwnPropertyDescriptor(Property.prototype, 'value').get, 'It should have kept information about the original descriptor [[get]]');
                assert.strictEqual(namePropValueObserver.$set, Object.getOwnPropertyDescriptor(Property.prototype, 'value').set, 'It should have kept information about the original descriptor [[set]]');
            },
        },
        {
            title: 'Works with set/get (object literal property)',
            template: `<input value.bind="nameProp.value">\${nameProp.value}`,
            ViewModel: class App {
                constructor() {
                    this.items = [];
                    this.total = 0;
                    this.nameProp = {
                        _value: '',
                        get value() {
                            return this._value;
                        },
                        set value(v) {
                            this._value = v;
                            this.valueChanged.publish();
                        },
                        valueChanged: {
                            publish() { },
                        },
                    };
                }
            },
            assertFn: (ctx, host, component) => {
                assert.strictEqual(host.textContent, '');
                const inputEl = host.querySelector('input');
                inputEl.value = '50';
                inputEl.dispatchEvent(new ctx.CustomEvent('input'));
                assert.strictEqual(host.textContent, '');
                ctx.platform.domWriteQueue.flush();
                assert.strictEqual(host.textContent, '50');
                assert.strictEqual(component.nameProp.value, '50');
                assert.strictEqual(component.nameProp._value, '50');
                const observerLocator = ctx.container.get(IObserverLocator);
                const namePropValueObserver = observerLocator
                    .getObserver(component.nameProp, 'value');
                assert.instanceOf(namePropValueObserver, ComputedObserver);
            },
        },
        /* eslint-disable */
        ...[
            ['ArrayBuffer', () => new ArrayBuffer(0)],
            ['Boolean', () => new Boolean()],
            ['DataView', () => new DataView(new ArrayBuffer(0))],
            ['Date', () => new Date()],
            ['Error', () => new Error()],
            ['EvalError', () => new EvalError()],
            ['Float32Array', () => new Float32Array()],
            ['Float64Array', () => new Float64Array()],
            ['Function', () => new Function('')],
            ['Int8Array', () => new Int8Array()],
            ['Int16Array', () => new Int16Array()],
            ['Int64Array', () => new Int32Array()],
            ['Number', () => new Number()],
            ['Promise', () => new Promise(r => r())],
            ['RangeError', () => new RangeError()],
            ['ReferenceError', () => new ReferenceError()],
            ['RegExp', () => new RegExp('a')],
            // ideally, properties on Map & Set that are not special (methods & 'size')
            // should be treated as normal properties, and should be observable by getter/setter
            // though probably it's good to start with not observing unless there's a need for it
            // example: Map/Set subclasses that have special properties.
            // todo: add connectable.observe(target, key) in proxy-observation.ts
            ['Map', () => new Map()],
            ['Set', () => new Set()],
            ['SharedArrayBuffer', () => new SharedArrayBuffer(0)],
            ['String', () => new String()],
            ['SyntaxError', () => new SyntaxError()],
            ['TypeError', () => new TypeError()],
            ['Uint8Array', () => new Uint8Array()],
            ['Uint8ClampedArray', () => new Uint8ClampedArray()],
            ['Uint16Array', () => new Uint16Array()],
            ['Uint32Array', () => new Uint32Array()],
            ['URIError', () => new URIError()],
            ['WeakMap', () => new WeakMap()],
            ['WeakSet', () => new WeakSet()],
            ['Math', () => Math],
            ['JSON', () => JSON],
            ['Reflect', () => Reflect],
            ['Atomics', () => Atomics],
        ].filter(([title, createInstrinsic]) => {
            try {
                switch (Object.prototype.toString.call(createInstrinsic())) {
                    case '[object Object]':
                    case '[object Array]':
                    case '[object Set]':
                    case '[object Map]':
                        return false;
                    default:
                        return true;
                }
            }
            catch {
                return false;
            }
        }).map(([title, createInstrinsic]) => {
            return {
                title: `does not observe ${title}`,
                template: `<div>\${someProp || 'no value'}</div>`,
                ViewModel: class App {
                    constructor() {
                        this.items = [];
                        this.total = 0;
                        this.instrinsic = createInstrinsic();
                    }
                    get someProp() {
                        return this.instrinsic.someProp;
                    }
                },
                assertFn: (ctx, host, component) => {
                    assert.strictEqual(host.textContent, 'no value');
                    component.instrinsic.someProp = 'value';
                    assert.strictEqual(host.textContent, 'no value');
                    ctx.platform.domWriteQueue.flush();
                    assert.strictEqual(host.textContent, 'no value');
                    component.instrinsic = { someProp: 'has value' };
                    assert.strictEqual(host.textContent, 'no value');
                    ctx.platform.domWriteQueue.flush();
                    assert.strictEqual(host.textContent, 'has value');
                },
            };
        }),
        /* eslint-enable */
    ];
    eachCartesianJoin([computedObserverTestCases], ({ only, title, template, ViewModel, assertFn }) => {
        // eslint-disable-next-line mocha/no-exclusive-tests
        const $it = (title_, fn) => only ? it.only(title_, fn) : it(title_, fn);
        $it(title, async function () {
            const { ctx, component, testHost, tearDown } = createFixture(template, ViewModel);
            await assertFn(ctx, testHost, component);
            // test cases could be sharing the same context document
            // so wait a bit before running the next test
            await tearDown();
        });
    });
    it('works with two layers of getter', async function () {
        const { assertText } = createFixture(`\${msg}`, class MyApp {
            get one() {
                return 'One';
            }
            get onetwo() {
                return `${this.one} two`;
            }
            get msg() {
                return this.onetwo;
            }
        });
        assertText('One two');
    });
    it('observers property in 2nd layer getter', async function () {
        const { component, assertText, flush } = createFixture(`\${msg}`, class MyApp {
            constructor() {
                this.message = 'One';
            }
            get one() {
                return this.message;
            }
            get onetwo() {
                return `${this.one} two`;
            }
            get msg() {
                return this.onetwo;
            }
        });
        assertText('One two');
        component.message = '1';
        flush();
        assertText('1 two');
    });
    class Property {
        constructor(name, value) {
            this.name = name;
            this._value = value;
            this.valueChanged = {
                publish: () => {
                    // todo
                }
            };
        }
        get value() {
            return this._value;
        }
        set value(value) {
            this._value = value;
            this.valueChanged.publish();
        }
    }
});
//# sourceMappingURL=computed-observer.spec.js.map