var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ProxyObservable } from '@aurelia/runtime';
import { bindable, ComputedWatcher, customAttribute, customElement, watch, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/decorator-watch.computed.spec.ts', function () {
    it('typings work', function () {
        const symbolMethod = Symbol();
        let App = class App {
            someMethod(_n, _o, _app) { }
            [symbolMethod](_n, _o, _app) { }
            5(_n, _o, _app) { }
        };
        __decorate([
            watch(app => app.col.has(Symbol)),
            watch((app) => app.col.has(Symbol)),
            watch('some.expression'),
            watch(Symbol()),
            watch(5),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object, App]),
            __metadata("design:returntype", void 0)
        ], App.prototype, "someMethod", null);
        App = __decorate([
            watch(app => app.col.has(Symbol), 5),
            watch(app => app.col.has(Symbol), 'someMethod'),
            watch(app => app.col.has(Symbol), symbolMethod),
            watch(app => app.col.has(Symbol), (v, o, a) => a.someMethod(v, o, a)),
            watch((app) => app.col.has(Symbol), 5),
            watch((app) => app.col.has(Symbol), 'someMethod'),
            watch((app) => app.col.has(Symbol), symbolMethod),
            watch((app) => app.col.has(Symbol), (v, o, a) => a.someMethod(v, o, a)),
            watch('some.expression', 5),
            watch('some.expression', 'someMethod'),
            watch('some.expression', symbolMethod),
            watch('some.expression', (v, o, a) => a.someMethod(v, o, a)),
            watch('some.expression', function (v, o, a) { a.someMethod(v, o, a); }),
            watch(Symbol(), 5),
            watch(Symbol(), 'someMethod'),
            watch(Symbol(), symbolMethod),
            watch(Symbol(), (v, o, a) => a.someMethod(v, o, a)),
            watch(Symbol(), function (v, o, a) { a.someMethod(v, o, a); })
        ], App);
        const app = new App();
        assert.strictEqual(app.col, undefined);
    });
    for (const methodName of [Symbol('method'), 'bla', 5]) {
        it(`validates method "${String(methodName)}" not found when decorating on class`, function () {
            assert.throws(() => {
                let App = class App {
                };
                App = __decorate([
                    watch('..', methodName)
                ], App);
                return new App();
            }, 
            // /Invalid change handler config/
            /AUR0773/);
        });
    }
    it('works in basic scenario', function () {
        let callCount = 0;
        class App {
            constructor() {
                this.person = {
                    first: 'bi',
                    last: 'go',
                    phone: '0134',
                    address: '1/34'
                };
                this.name = '';
            }
            phoneChanged(phoneValue) {
                callCount++;
                this.name = phoneValue;
            }
        }
        __decorate([
            watch((test) => test.person.phone),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String]),
            __metadata("design:returntype", void 0)
        ], App.prototype, "phoneChanged", null);
        const { ctx, component, appHost, tearDown } = createFixture(`\${name}`, App);
        // with TS, initialization of class field are in constructor
        assert.strictEqual(callCount, 0);
        component.person.first = 'bi ';
        assert.strictEqual(callCount, 0);
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(appHost.textContent, '');
        component.person.phone = '0413';
        assert.strictEqual(callCount, 1);
        assert.strictEqual(appHost.textContent, '');
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(appHost.textContent, '0413');
        void tearDown();
    });
    it('watches deep', function () {
        let callCount = 0;
        class App {
            constructor() {
                this.person = {
                    first: 'bi',
                    last: 'go',
                    phone: '0134',
                    addresses: [
                        {
                            primary: false,
                            number: 3,
                            strName: 'Aus',
                            state: 'ACT'
                        },
                        {
                            primary: true,
                            number: 3,
                            strName: 'Aus',
                            state: 'VIC'
                        }
                    ]
                };
                this.name = '';
            }
            phoneChanged(strName) {
                callCount++;
                this.name = strName;
            }
        }
        __decorate([
            watch((app) => app.person.addresses.find(addr => addr.primary).strName),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [String]),
            __metadata("design:returntype", void 0)
        ], App.prototype, "phoneChanged", null);
        const { ctx, component, appHost, tearDown } = createFixture(`<div>\${name}</div>`, App);
        const textNode = appHost.querySelector('div');
        // with TS, initialization of class field are in constructor
        assert.strictEqual(callCount, 0);
        component.person.addresses[1].state = 'QLD';
        assert.strictEqual(callCount, 0);
        component.person.addresses[1].strName = '3cp';
        assert.strictEqual(callCount, 1);
        assert.strictEqual(textNode.textContent, '');
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, '3cp');
        void tearDown();
        component.person.addresses[1].strName = 'Chunpeng Huo';
        assert.strictEqual(textNode.textContent, '3cp');
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, '3cp');
    });
    describe('timing', function () {
        it('ensures proper timing with custom elements', async function () {
            let childBindingCallCount = 0;
            let childBoundCallCount = 0;
            let childUnbindingCallCount = 0;
            let appBindingCallCount = 0;
            let appBoundCallCount = 0;
            let appUnbindingCallCount = 0;
            let Child = class Child {
                constructor() {
                    this.prop = 0;
                    this.logCallCount = 0;
                }
                log() {
                    this.logCallCount++;
                }
                binding() {
                    childBindingCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 0);
                }
                bound() {
                    childBoundCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 1);
                }
                unbinding() {
                    childUnbindingCallCount++;
                    // test body prop changed, callCount++
                    assert.strictEqual(this.logCallCount, 2);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 3);
                }
            };
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], Child.prototype, "prop", void 0);
            __decorate([
                watch((child) => child.prop),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], Child.prototype, "log", null);
            Child = __decorate([
                customElement({ name: 'child', template: `\${prop}` })
            ], Child);
            class App {
                constructor() {
                    this.prop = 1;
                    this.logCallCount = 0;
                }
                log() {
                    this.logCallCount++;
                }
                binding() {
                    appBindingCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 0);
                }
                bound() {
                    appBoundCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    assert.strictEqual(this.child.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 1);
                    // child bound hasn't been called yet,
                    // so watcher won't be activated and thus, no log call
                    assert.strictEqual(this.child.logCallCount, 0);
                }
                unbinding() {
                    appUnbindingCallCount++;
                    // already got the modification in the code below, so it starts at 2
                    assert.strictEqual(this.logCallCount, 2);
                    // child unbinding is called before app unbinding
                    assert.strictEqual(this.child.logCallCount, 3);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 3);
                }
            }
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], App.prototype, "prop", void 0);
            __decorate([
                watch((child) => child.prop),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], App.prototype, "log", null);
            const { component, startPromise, tearDown } = createFixture('<child component.ref="child" prop.bind=prop>', App, [Child]);
            await startPromise;
            assert.strictEqual(appBindingCallCount, 1);
            assert.strictEqual(appBoundCallCount, 1);
            assert.strictEqual(appUnbindingCallCount, 0);
            assert.strictEqual(childBindingCallCount, 1);
            assert.strictEqual(childBoundCallCount, 1);
            assert.strictEqual(component.logCallCount, 1);
            assert.strictEqual(component.child.logCallCount, 1);
            component.prop++;
            assert.strictEqual(component.logCallCount, 2);
            assert.strictEqual(component.child.logCallCount, 2);
            const bindings = component.$controller.bindings;
            assert.strictEqual(bindings.length, 3);
            // watcher should be created before all else
            assert.instanceOf(bindings[0], ComputedWatcher);
            const child = component.child;
            const childBindings = child.$controller.bindings;
            assert.strictEqual(childBindings.length, 2);
            // watcher should be created before all else
            assert.instanceOf(childBindings[0], ComputedWatcher);
            await tearDown();
            assert.strictEqual(appBindingCallCount, 1);
            assert.strictEqual(appBoundCallCount, 1);
            assert.strictEqual(appUnbindingCallCount, 1);
            assert.strictEqual(childBindingCallCount, 1);
            assert.strictEqual(childBoundCallCount, 1);
            assert.strictEqual(childUnbindingCallCount, 1);
            assert.strictEqual(component.logCallCount, 3);
            assert.strictEqual(child.logCallCount, 3);
            component.prop++;
            assert.strictEqual(component.logCallCount, 3);
            assert.strictEqual(child.logCallCount, 3);
        });
        it('ensures proper timing with custom attribute', async function () {
            let childBindingCallCount = 0;
            let childBoundCallCount = 0;
            let childUnbindingCallCount = 0;
            let appBindingCallCount = 0;
            let appBoundCallCount = 0;
            let appUnbindingCallCount = 0;
            let Child = class Child {
                constructor() {
                    this.prop = 0;
                    this.logCallCount = 0;
                }
                log() {
                    this.logCallCount++;
                }
                binding() {
                    childBindingCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 0);
                }
                bound() {
                    childBoundCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 1);
                }
                unbinding() {
                    childUnbindingCallCount++;
                    // test body prop changed, callCount++
                    assert.strictEqual(this.logCallCount, 2);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 3);
                }
            };
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], Child.prototype, "prop", void 0);
            __decorate([
                watch((child) => child.prop),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], Child.prototype, "log", null);
            Child = __decorate([
                customAttribute({ name: 'child' })
            ], Child);
            class App {
                constructor() {
                    this.prop = 1;
                    this.logCallCount = 0;
                }
                log() {
                    this.logCallCount++;
                }
                binding() {
                    appBindingCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 0);
                }
                bound() {
                    appBoundCallCount++;
                    assert.strictEqual(this.logCallCount, 0);
                    assert.strictEqual(this.child.logCallCount, 0);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 1);
                    // child after bind hasn't been called yet,
                    // so watcher won't be activated and thus, no log call
                    assert.strictEqual(this.child.logCallCount, 0);
                }
                unbinding() {
                    appUnbindingCallCount++;
                    // already got the modification in the code below, so it starts at 2
                    assert.strictEqual(this.logCallCount, 2);
                    // child unbinding is aclled before this unbinding
                    assert.strictEqual(this.child.logCallCount, 3);
                    this.prop++;
                    assert.strictEqual(this.logCallCount, 3);
                }
            }
            __decorate([
                bindable(),
                __metadata("design:type", Object)
            ], App.prototype, "prop", void 0);
            __decorate([
                watch((child) => child.prop),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], App.prototype, "log", null);
            const { component, startPromise, tearDown } = createFixture('<div child.bind="prop" child.ref="child">', App, [Child]);
            await startPromise;
            assert.strictEqual(appBindingCallCount, 1);
            assert.strictEqual(appBoundCallCount, 1);
            assert.strictEqual(appUnbindingCallCount, 0);
            assert.strictEqual(childBindingCallCount, 1);
            assert.strictEqual(childBoundCallCount, 1);
            assert.strictEqual(component.logCallCount, 1);
            assert.strictEqual(component.child.logCallCount, 1);
            component.prop++;
            assert.strictEqual(component.logCallCount, 2);
            assert.strictEqual(component.child.logCallCount, 2);
            const bindings = component.$controller.bindings;
            assert.strictEqual(bindings.length, 3);
            // watcher should be created before all else
            assert.instanceOf(bindings[0], ComputedWatcher);
            const child = component.child;
            const childBindings = child.$controller.bindings;
            assert.strictEqual(childBindings.length, 1);
            // watcher should be created before all else
            assert.instanceOf(childBindings[0], ComputedWatcher);
            await tearDown();
            assert.strictEqual(appBindingCallCount, 1);
            assert.strictEqual(appBoundCallCount, 1);
            assert.strictEqual(appUnbindingCallCount, 1);
            assert.strictEqual(childBindingCallCount, 1);
            assert.strictEqual(childBoundCallCount, 1);
            assert.strictEqual(childUnbindingCallCount, 1);
            assert.strictEqual(component.logCallCount, 3);
            assert.strictEqual(child.logCallCount, 3);
            component.prop++;
            assert.strictEqual(component.logCallCount, 3);
            assert.strictEqual(child.logCallCount, 3);
        });
    });
    it('observes collection', function () {
        let callCount = 0;
        class PostOffice {
            constructor() {
                this.storage = [
                    { id: 1, name: 'box', delivered: false },
                    { id: 2, name: 'toy', delivered: true },
                    { id: 3, name: 'letter', delivered: false },
                ];
                (this.deliveries = [this.storage[1]]).toString = function () {
                    return json(this);
                };
            }
            newDelivery(delivery) {
                this.storage.push(delivery);
            }
            delivered(id) {
                const delivery = this.storage.find(delivery => delivery.id === id);
                if (delivery != null) {
                    delivery.delivered = true;
                }
            }
            onDelivered(deliveries) {
                callCount++;
                deliveries.toString = function () {
                    return json(this);
                };
                this.deliveries = deliveries;
            }
        }
        __decorate([
            watch((postOffice) => postOffice.storage.filter(d => d.delivered)),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Array]),
            __metadata("design:returntype", void 0)
        ], PostOffice.prototype, "onDelivered", null);
        const { ctx, component, appHost, tearDown } = createFixture(`<div>\${deliveries}</div>`, PostOffice);
        const textNode = appHost.querySelector('div');
        assert.strictEqual(callCount, 0);
        assert.strictEqual(textNode.textContent, json([{ id: 2, name: 'toy', delivered: true }]));
        component.newDelivery({ id: 4, name: 'cookware', delivered: false });
        assert.strictEqual(callCount, 1);
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, json([{ id: 2, name: 'toy', delivered: true }]));
        component.delivered(1);
        assert.strictEqual(callCount, 2);
        assert.strictEqual(textNode.textContent, json([{ id: 2, name: 'toy', delivered: true }]));
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, json([
            { id: 1, name: 'box', delivered: true },
            { id: 2, name: 'toy', delivered: true }
        ]));
        void tearDown();
        assert.strictEqual(appHost.textContent, '');
        component.newDelivery({ id: 5, name: 'gardenware', delivered: true });
        component.delivered(3);
        assert.strictEqual(textNode.textContent, json([
            { id: 1, name: 'box', delivered: true },
            { id: 2, name: 'toy', delivered: true }
        ]));
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, json([
            { id: 1, name: 'box', delivered: true },
            { id: 2, name: 'toy', delivered: true }
        ]));
        assert.strictEqual(appHost.textContent, '');
    });
    it('observes chain lighting', function () {
        let callCount = 0;
        class PostOffice {
            constructor() {
                this.storage = [
                    { id: 1, name: 'box', delivered: false },
                    { id: 2, name: 'toy', delivered: true },
                    { id: 3, name: 'letter', delivered: false },
                ];
                this.deliveries = 0;
            }
            newDelivery(delivery) {
                this.storage.push(delivery);
            }
            delivered(id) {
                const delivery = this.storage.find(delivery => delivery.id === id);
                if (delivery != null) {
                    delivery.delivered = true;
                }
            }
            boxDelivered(deliveries) {
                callCount++;
                this.deliveries = deliveries;
            }
        }
        __decorate([
            watch((postOffice) => postOffice
                .storage
                .filter(d => d.delivered)
                .filter(d => d.name === 'box')
                .length),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Number]),
            __metadata("design:returntype", void 0)
        ], PostOffice.prototype, "boxDelivered", null);
        const { ctx, component, appHost, tearDown } = createFixture(`<div>\${deliveries}</div>`, PostOffice);
        const textNode = appHost.querySelector('div');
        assert.strictEqual(callCount, 0);
        assert.strictEqual(textNode.textContent, '0');
        component.newDelivery({ id: 4, name: 'cookware', delivered: false });
        assert.strictEqual(callCount, 0);
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, '0');
        component.delivered(1);
        assert.strictEqual(callCount, 1);
        assert.strictEqual(textNode.textContent, '0');
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, '1');
        void tearDown();
        component.newDelivery({ id: 5, name: 'gardenware', delivered: true });
        component.delivered(3);
        assert.strictEqual(textNode.textContent, '1');
        assert.strictEqual(callCount, 1);
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, '1');
        component.newDelivery({ id: 6, name: 'box', delivered: true });
        ctx.platform.domWriteQueue.flush();
        assert.strictEqual(textNode.textContent, '1');
    });
    describe('Array', function () {
        const testCases = [
            ...[
                ['.push()', (post) => post.packages.push({ id: 10, name: 'box 10', delivered: true })],
                ['.pop()', (post) => post.packages.pop()],
                ['.shift()', (post) => post.packages.shift()],
                ['.unshift()', (post) => post.packages.unshift({ id: 10, name: 'box 10', delivered: true })],
                ['.splice()', (post) => post.packages.splice(0, 1, { id: 10, name: 'box 10', delivered: true })],
                ['.reverse()', (post) => post.packages.reverse()],
            ].map(([name, getter]) => ({
                title: `does NOT observe mutation method ${name}`,
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: getter,
                created: post => {
                    assert.strictEqual(post.callCount, 0);
                    post.newDelivery(4, 'box 4');
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 0);
                    post.newDelivery(5, 'box 5');
                    assert.strictEqual(post.callCount, 0);
                },
                disposed: post => {
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(2);
                    assert.strictEqual(post.callCount, 0);
                },
            })),
            {
                title: 'observes .filter()',
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: post => post.packages.filter(d => d.delivered).length,
                created: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 0);
                    post.newDelivery(4, 'box 4');
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.newDelivery(5, 'box 5');
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                },
                disposed: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.delivered(2);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                },
            },
            {
                title: 'observes .find()',
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: post => post.packages.find(d => d.delivered),
                created: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 0);
                    post.newDelivery(4, 'box 4');
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.undelivered(4);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.undelivered(1);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                },
                disposed: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                },
            },
            ...[
                ['.indexOf()', (post) => post.packages.indexOf(post.selected)],
                ['.findIndex()', (post) => post.packages.findIndex(v => v === post.selected)],
                ['.lastIndexOf()', (post) => post.packages.lastIndexOf(post.selected)],
                ['.includes()', (post) => post.packages.includes(post.selected)],
            ].map(([name, getter]) => ({
                title: `observes ${name}`,
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: getter,
                created: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 0);
                    post.selected = post.packages[2];
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.selected = null;
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.selected = post.packages[1];
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                },
                disposed: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                    post.selected = post.packages[1];
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                },
            })),
            {
                title: 'observes .some()',
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: post => post.packages.some(d => d.delivered),
                created: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 0);
                    post.newDelivery(4, 'box 4');
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.undelivered(4);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.undelivered(1);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                },
                disposed: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                },
            },
            {
                title: 'observes .every()',
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: post => post.packages.every(d => d.delivered),
                created: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(2);
                    assert.strictEqual(post.callCount, 0);
                    post.delivered(3);
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.newDelivery(4, 'box 4');
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                },
                disposed: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                },
            },
            ...[
                ['.slice()', (post) => post.packages.slice(0).map(d => d.delivered).join(', ')],
                ['.map()', (post) => post.packages.map(d => d.delivered).join(', ')],
                ['.flat()', (post) => post.packages.flat().map(d => d.delivered).join(', ')],
                ['.flatMap()', (post) => post.packages.flatMap(d => [d.id, d.delivered]).join(', ')],
                ['for..in', (post) => {
                        const results = [];
                        const packages = post.packages;
                        // eslint-disable-next-line
                        for (const i in packages) {
                            results.push(packages[i].delivered);
                        }
                        return results.join(', ');
                    }],
                ['.reduce()', (post) => post
                        .packages
                        .reduce((str, d, idx, arr) => `${str}${idx === arr.length - 1 ? d.delivered : `, ${d.delivered}`}`, ''),
                ],
                ['.reduceRight()', (post) => post
                        .packages
                        .reduceRight((str, d, idx, arr) => `${str}${idx === arr.length - 1 ? d.delivered : `, ${d.delivered}`}`, ''),
                ],
            ].map(([name, getter]) => ({
                title: `observes ${name}`,
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: getter,
                created: (post) => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 0);
                    post.newDelivery(4, 'box 4');
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                    post.newDelivery(5, 'box 5');
                    assert.strictEqual(post.callCount, 4 * decoratorCount);
                    post.packages[0].name = 'h';
                    assert.strictEqual(post.callCount, 4 * decoratorCount);
                },
                disposed: post => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 4 * decoratorCount);
                    post.delivered(2);
                    assert.strictEqual(post.callCount, 4 * decoratorCount);
                },
            })),
            ...[
                ['for..of', (post) => {
                        const result = [];
                        for (const p of post.packages) {
                            result.push(p.delivered);
                        }
                        return result.join(', ');
                    }],
                ['.entries()', (post) => {
                        const result = [];
                        for (const p of post.packages.entries()) {
                            result.push(p[1].delivered);
                        }
                        return result.join(', ');
                    }],
                ['.values()', (post) => {
                        const result = [];
                        for (const p of post.packages.values()) {
                            result.push(p.delivered);
                        }
                        return result.join(', ');
                    }],
                ['.keys()', (post) => {
                        const result = [];
                        for (const index of post.packages.keys()) {
                            result.push(post.packages[index].delivered);
                        }
                        return result.join(', ');
                    }],
            ].map(([name, getter]) => ({
                title: `observers ${name}`,
                init: () => Array.from({ length: 3 }, (_, idx) => ({ id: idx + 1, name: `box ${idx + 1}`, delivered: false })),
                get: getter,
                created: (post) => {
                    const decoratorCount = post.decoratorCount;
                    assert.strictEqual(post.callCount, 0);
                    // mutate                       // assert the effect
                    post.newDelivery(4, 'box 4');
                    assert.strictEqual(post.callCount, 1 * decoratorCount);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 2 * decoratorCount);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                },
                disposed: (post) => {
                    const decoratorCount = post.decoratorCount;
                    post.newDelivery(5, 'box 5');
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                    post.delivered(4);
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                    post.delivered(1);
                    assert.strictEqual(post.callCount, 3 * decoratorCount);
                },
            })),
        ];
        for (const { title, only, init, get, created, disposed } of testCases) {
            const $it = only ? it.only : it;
            $it(`${title} on class`, async function () {
                let App = class App {
                    constructor() {
                        this.decoratorCount = 1;
                        this.packages = init?.() ?? [];
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    delivered(id) {
                        const p = this.packages.find(p => p.id === id);
                        if (p) {
                            p.delivered = true;
                        }
                    }
                    undelivered(id) {
                        const p = this.packages.find(p => p.id === id);
                        if (p) {
                            p.delivered = false;
                        }
                    }
                    newDelivery(id, name, delivered = false) {
                        this.packages.push({ id, name, delivered });
                    }
                    log() {
                        this.callCount++;
                    }
                };
                App = __decorate([
                    watch(get, 'log')
                ], App);
                const { component, ctx, startPromise, tearDown } = createFixture('', App);
                await startPromise;
                created(component, ctx, 1);
                await tearDown();
                disposed?.(component, ctx, 1);
            });
            $it(`${title} on method`, async function () {
                class App {
                    constructor() {
                        this.decoratorCount = 1;
                        this.packages = init?.() ?? [];
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    delivered(id) {
                        const p = this.packages.find(p => p.id === id);
                        if (p) {
                            p.delivered = true;
                        }
                    }
                    undelivered(id) {
                        const p = this.packages.find(p => p.id === id);
                        if (p) {
                            p.delivered = false;
                        }
                    }
                    newDelivery(id, name, delivered = false) {
                        this.packages.push({ id, name, delivered });
                    }
                    log() {
                        this.callCount++;
                    }
                }
                __decorate([
                    watch(get),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], App.prototype, "log", null);
                const { component, ctx, startPromise, tearDown } = createFixture('', App);
                await startPromise;
                created(component, ctx, 1);
                await tearDown();
                disposed?.(component, ctx, 1);
            });
            $it(`${title} on both class and method`, async function () {
                let App = class App {
                    constructor() {
                        this.decoratorCount = 2;
                        this.packages = init?.() ?? [];
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    delivered(id) {
                        const p = this.packages.find(p => p.id === id);
                        if (p) {
                            p.delivered = true;
                        }
                    }
                    undelivered(id) {
                        const p = this.packages.find(p => p.id === id);
                        if (p) {
                            p.delivered = false;
                        }
                    }
                    newDelivery(id, name, delivered = false) {
                        this.packages.push({ id, name, delivered });
                    }
                    log() {
                        this.callCount++;
                    }
                };
                __decorate([
                    watch(get),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], App.prototype, "log", null);
                App = __decorate([
                    watch(get, 'log')
                ], App);
                const { component, ctx, startPromise, tearDown } = createFixture('', App);
                await startPromise;
                created(component, ctx, 1);
                await tearDown();
                disposed?.(component, ctx, 1);
            });
        }
    });
    describe('Map', function () {
        const symbol = Symbol();
        const testCases = [
            {
                title: 'observes .get()',
                get: (app) => app.map.get(symbol),
                created: (app) => {
                    app.map.set(symbol, 0);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.map.delete(symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                },
                disposed: (app) => {
                    app.map.set(symbol, 'a');
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount, 'after disposed');
                },
            },
            {
                title: 'observes .has()',
                get: app => app.map.has(symbol) ? ++ProxyObservable.getRaw(app).counter : 0,
                created: (app) => {
                    assert.strictEqual(app.counter, 0);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(symbol, '');
                    assert.strictEqual(app.counter, app.decoratorCount);
                    assert.strictEqual(app.callCount, app.decoratorCount);
                },
                disposed: (app) => {
                    assert.strictEqual(app.counter, app.decoratorCount);
                    assert.strictEqual(app.callCount, app.decoratorCount);
                    app.map.set(symbol, '');
                    assert.strictEqual(app.counter, app.decoratorCount);
                    assert.strictEqual(app.callCount, app.decoratorCount);
                },
            },
            {
                title: 'observes .keys()',
                get: app => Array.from(app.map.keys()).filter(k => k === symbol).length,
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.map.set('a', 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(symbol, '1');
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                },
            },
            {
                title: 'observers .values()',
                get: app => Array.from(app.map.values()).filter(v => v === symbol).length,
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    // mutate                     // assert the effect
                    app.map.set('a', 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set('a', symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.map.set('b', symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                },
            },
            {
                title: 'observers @@Symbol.iterator',
                get: app => {
                    let count = 0;
                    for (const [, value] of app.map) {
                        if (value === symbol)
                            count++;
                    }
                    return count;
                },
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    // mutate                     // assert the effect
                    app.map.set('a', 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set('a', symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.map.set('b', symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                },
            },
            {
                title: 'observers .entries()',
                get: app => {
                    let count = 0;
                    for (const [, value] of app.map.entries()) {
                        if (value === symbol)
                            count++;
                    }
                    return count;
                },
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    // mutate                     // assert the effect
                    app.map.set('a', 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set('a', symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.map.set('b', symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                },
            },
            {
                title: 'observes .size',
                get: app => app.map.size,
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(symbol, 2);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.map.set(symbol, 1);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.map.set(1, symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                },
            },
            {
                title: 'does not observe mutation by .set()',
                get: app => app.map.set(symbol, 1),
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(symbol, 2);
                    app.map.set(1, symbol);
                    assert.strictEqual(app.callCount, 0);
                },
            },
            {
                title: 'does not observe mutation by .delete()',
                get: app => app.map.delete(symbol),
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(symbol, 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(1, 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(1, symbol);
                    assert.strictEqual(app.callCount, 0);
                },
            },
            {
                title: 'does not observe mutation by .clear()',
                get: app => app.map.clear(),
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(symbol, 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(1, 2);
                    assert.strictEqual(app.callCount, 0);
                    app.map.set(1, symbol);
                    assert.strictEqual(app.callCount, 0);
                },
            },
            {
                title: 'watcher callback is not invoked when getter throws error',
                get: app => {
                    // track
                    // eslint-disable-next-line
                    app.counter;
                    if (ProxyObservable.getRaw(app).started) {
                        throw new Error('err');
                    }
                },
                created: app => {
                    app.started = true;
                    assert.strictEqual(app.callCount, 0);
                    let ex;
                    try {
                        app.counter++;
                    }
                    catch (e) {
                        ex = e;
                    }
                    assert.strictEqual(app.callCount, 0);
                    assert.instanceOf(ex, Error);
                    assert.strictEqual(ex.message, 'err');
                },
            },
            {
                title: 'works with ===',
                get: app => {
                    let has = false;
                    app.map.forEach(v => {
                        if (v === app.selectedItem) {
                            has = true;
                        }
                    });
                    return has;
                },
                created: app => {
                    assert.strictEqual(app.callCount, 0, '=== #1');
                    const item1 = {};
                    const item2 = {};
                    app.map = new Map([[1, item1], [2, item2]]);
                    assert.strictEqual(app.callCount, 0, '=== #2');
                    app.selectedItem = item1;
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount, '=== #3');
                },
            },
            {
                title: 'works with Object.is()',
                get: app => {
                    let has = false;
                    app.map.forEach(v => {
                        if (Object.is(v, app.selectedItem)) {
                            has = true;
                        }
                    });
                    return has;
                },
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    const item1 = {};
                    const item2 = {};
                    app.map = new Map([[1, item1], [2, item2]]);
                    assert.strictEqual(app.callCount, 0);
                    app.selectedItem = item1;
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                },
            }
        ];
        for (const { title, only = false, get, created, disposed } of testCases) {
            const $it = only ? it.only : it;
            $it(`${title} on method`, async function () {
                class App {
                    constructor() {
                        this.started = false;
                        this.decoratorCount = 1;
                        this.map = new Map();
                        this.selectedItem = void 0;
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    log() {
                        this.callCount++;
                    }
                }
                __decorate([
                    watch(get),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], App.prototype, "log", null);
                const { ctx, component, startPromise, tearDown } = createFixture('', App);
                await startPromise;
                created(component, ctx, 1);
                await tearDown();
                disposed?.(component, ctx, 1);
            });
            $it(`${title} on class`, async function () {
                let App = class App {
                    constructor() {
                        this.started = false;
                        this.decoratorCount = 1;
                        this.map = new Map();
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    log() {
                        this.callCount++;
                    }
                };
                App = __decorate([
                    watch(get, (_v, _o, a) => a.log())
                ], App);
                const { ctx, component, tearDown, startPromise } = createFixture('', App);
                await startPromise;
                created(component, ctx, 1);
                await tearDown();
                disposed?.(component, ctx, 1);
            });
            $it(`${title} on both class and method`, async function () {
                let App = class App {
                    constructor() {
                        this.started = false;
                        this.decoratorCount = 2;
                        this.map = new Map();
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    log() {
                        this.callCount++;
                    }
                };
                __decorate([
                    watch(get),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], App.prototype, "log", null);
                App = __decorate([
                    watch(get, (_v, _o, a) => a.log())
                ], App);
                const { ctx, component, startPromise, tearDown } = createFixture('', App);
                await startPromise;
                created(component, ctx, 2);
                await tearDown();
                disposed?.(component, ctx, 2);
            });
        }
    });
    describe('Set', function () {
        const symbol = Symbol();
        const testCases = [
            {
                title: 'observes .has()',
                get: app => app.set.has(symbol),
                created: (app) => {
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.set.delete(symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                },
                disposed: (app) => {
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                    app.set.delete(symbol);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                },
            },
            {
                title: 'observes .keys()',
                get: app => Array.from(app.set.keys()).filter(k => k === symbol).length,
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.set.add('a');
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                },
            },
            {
                title: 'observers .values()',
                get: app => Array.from(app.set.values()).filter(v => v === symbol).length,
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    // mutate                 // assert the effect
                    app.set.add('a');
                    assert.strictEqual(app.callCount, 0);
                    app.set.add('b');
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                },
            },
            {
                title: 'observers @@Symbol.iterator',
                get: app => {
                    let count = 0;
                    for (const value of app.set) {
                        if (value === symbol)
                            count++;
                    }
                    return count;
                },
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    // mutate                 // assert the effect
                    app.set.add('a');
                    assert.strictEqual(app.callCount, 0);
                    app.set.add('b');
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                },
            },
            {
                title: 'observers .entries()',
                get: app => {
                    let count = 0;
                    for (const [, value] of app.set.entries()) {
                        if (value === symbol)
                            count++;
                    }
                    return count;
                },
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    // mutate                 // assert the effect
                    app.set.add('a');
                    assert.strictEqual(app.callCount, 0);
                    app.set.add('b');
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                },
            },
            {
                title: 'observes .size',
                get: app => app.set.size,
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                    app.set.add(2);
                    assert.strictEqual(app.callCount, 2 * app.decoratorCount);
                    app.set.add(1);
                    assert.strictEqual(app.callCount, 3 * app.decoratorCount);
                },
            },
            {
                title: 'does not observe mutation by .add()',
                get: app => app.set.add(symbol),
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(1);
                    app.set.add(2);
                    assert.strictEqual(app.callCount, 0);
                },
            },
            {
                title: 'does not observe mutation by .delete()',
                get: app => app.set.delete(symbol),
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(1);
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(2);
                    assert.strictEqual(app.callCount, 0);
                },
            },
            {
                title: 'does not observe mutation by .clear()',
                get: app => app.set.clear(),
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(symbol);
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(1);
                    assert.strictEqual(app.callCount, 0);
                    app.set.add(2);
                    assert.strictEqual(app.callCount, 0);
                },
            },
            {
                title: 'watcher callback is not invoked when getter throws error',
                get: app => {
                    // track
                    // eslint-disable-next-line
                    app.counter;
                    if (ProxyObservable.getRaw(app).started) {
                        throw new Error('err');
                    }
                    return 0;
                },
                created: app => {
                    app.started = true;
                    assert.strictEqual(app.callCount, 0);
                    let ex;
                    try {
                        app.counter++;
                    }
                    catch (e) {
                        ex = e;
                    }
                    assert.strictEqual(app.callCount, 0);
                    assert.instanceOf(ex, Error);
                    assert.strictEqual(ex.message, 'err');
                },
            },
            {
                title: 'works with ===',
                get: app => {
                    let has = false;
                    app.set.forEach(v => {
                        if (v === app.selectedItem) {
                            has = true;
                        }
                    });
                    return has;
                },
                created: app => {
                    app.started = true;
                    assert.strictEqual(app.callCount, 0, 'Set === #1');
                    const item1 = {};
                    const item2 = {};
                    app.set = new Set([item1, item2]);
                    assert.strictEqual(app.callCount, 0, 'Set === #2');
                    app.selectedItem = item1;
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount, 'Set === #3');
                },
            },
            {
                title: 'works with Object.is()',
                get: app => {
                    let has = false;
                    app.set.forEach(v => {
                        if (Object.is(v, app.selectedItem)) {
                            has = true;
                        }
                    });
                    return has;
                },
                created: app => {
                    assert.strictEqual(app.callCount, 0);
                    const item1 = {};
                    const item2 = {};
                    app.set = new Set([item1, item2]);
                    assert.strictEqual(app.callCount, 0);
                    app.selectedItem = item1;
                    assert.strictEqual(app.callCount, 1 * app.decoratorCount);
                },
            }
        ];
        for (const { title, only = false, get, created, disposed } of testCases) {
            const $it = only ? it.only : it;
            $it(`${title} on method`, async function () {
                class App {
                    constructor() {
                        this.started = false;
                        this.decoratorCount = 1;
                        this.set = new Set();
                        this.selectedItem = void 0;
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    log() {
                        this.callCount++;
                    }
                }
                __decorate([
                    watch(get),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], App.prototype, "log", null);
                const { ctx, component, startPromise, tearDown } = createFixture('', App);
                try {
                    await startPromise;
                    created(component, ctx, 1);
                }
                finally {
                    await tearDown();
                    disposed?.(component, ctx, 1);
                }
            });
            $it(`${title} on class`, async function () {
                let App = class App {
                    constructor() {
                        this.started = false;
                        this.decoratorCount = 1;
                        this.set = new Set();
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    log() {
                        this.callCount++;
                    }
                };
                App = __decorate([
                    watch(get, (_v, _o, a) => a.log())
                ], App);
                const { ctx, component, tearDown, startPromise } = createFixture('', App);
                try {
                    await startPromise;
                    created(component, ctx, 1);
                }
                finally {
                    await tearDown();
                    disposed?.(component, ctx, 1);
                }
            });
            $it(`${title} on both class and method`, async function () {
                let App = class App {
                    constructor() {
                        this.started = false;
                        this.decoratorCount = 2;
                        this.set = new Set();
                        this.counter = 0;
                        this.callCount = 0;
                    }
                    log() {
                        this.callCount++;
                    }
                };
                __decorate([
                    watch(get),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], App.prototype, "log", null);
                App = __decorate([
                    watch(get, (_v, _o, a) => a.log())
                ], App);
                const { ctx, component, startPromise, tearDown } = createFixture('', App);
                try {
                    await startPromise;
                    created(component, ctx, 2);
                }
                finally {
                    await tearDown();
                    disposed?.(component, ctx, 2);
                }
            });
        }
    });
    function json(d) {
        return JSON.stringify(d);
    }
});
//# sourceMappingURL=decorator-watch.computed.spec.js.map