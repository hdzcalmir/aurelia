var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { IObservation, observable } from '@aurelia/runtime';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/effect.spec.ts', function () {
    it('runs effect with @observable', async function () {
        const { ctx, component, startPromise, tearDown } = createFixture('<div ref="div"></div>', class App {
        });
        await startPromise;
        let MouseTracker = (() => {
            var _a;
            let _coord_decorators;
            let _coord_initializers = [];
            let _coord_extraInitializers = [];
            return _a = class MouseTracker {
                    pretendMouseMove(x, y) {
                        this.coord = [x, y];
                    }
                    constructor() {
                        this.coord = __runInitializers(this, _coord_initializers, [0, 0]);
                        __runInitializers(this, _coord_extraInitializers);
                    }
                },
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _coord_decorators = [observable()];
                    __esDecorate(null, null, _coord_decorators, { kind: "field", name: "coord", static: false, private: false, access: { has: obj => "coord" in obj, get: obj => obj.coord, set: (obj, value) => { obj.coord = value; } }, metadata: _metadata }, _coord_initializers, _coord_extraInitializers);
                    if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                })(),
                _a;
        })();
        assert.instanceOf(component.div, ctx.Element);
        let runCount = 0;
        const div = component.div;
        const observation = ctx.container.get(IObservation);
        const mouseTracker = new MouseTracker();
        const effect = observation.run(() => {
            runCount++;
            div.textContent = mouseTracker.coord.join(', ');
        });
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
        mouseTracker.pretendMouseMove(1, 2);
        assert.strictEqual(runCount, 2);
        assert.strictEqual(div.textContent, '1, 2');
        effect.stop();
        mouseTracker.pretendMouseMove(3, 4);
        assert.strictEqual(runCount, 2);
        assert.strictEqual(div.textContent, '1, 2');
        await tearDown();
        mouseTracker.pretendMouseMove(5, 6);
        assert.strictEqual(runCount, 2);
        assert.strictEqual(div.textContent, '1, 2');
    });
    it('does not track @observable accessed outside of effect', async function () {
        const { ctx, component, startPromise, tearDown } = createFixture('<div ref="div"></div>', class App {
        });
        await startPromise;
        let MouseTracker = (() => {
            var _a;
            let _coord_decorators;
            let _coord_initializers = [];
            let _coord_extraInitializers = [];
            return _a = class MouseTracker {
                    pretendMouseMove(x, y) {
                        this.coord = [x, y];
                    }
                    constructor() {
                        this.coord = __runInitializers(this, _coord_initializers, [0, 0]);
                        __runInitializers(this, _coord_extraInitializers);
                    }
                },
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _coord_decorators = [observable()];
                    __esDecorate(null, null, _coord_decorators, { kind: "field", name: "coord", static: false, private: false, access: { has: obj => "coord" in obj, get: obj => obj.coord, set: (obj, value) => { obj.coord = value; } }, metadata: _metadata }, _coord_initializers, _coord_extraInitializers);
                    if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                })(),
                _a;
        })();
        assert.instanceOf(component.div, ctx.Element);
        let runCount = 0;
        const div = component.div;
        const observation = ctx.container.get(IObservation);
        const mouseTracker = new MouseTracker();
        const { coord } = mouseTracker;
        const effect = observation.run(() => {
            runCount++;
            div.textContent = coord.join(', ');
        });
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
        mouseTracker.pretendMouseMove(1, 2);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
        effect.stop();
        mouseTracker.pretendMouseMove(3, 4);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
        await tearDown();
        mouseTracker.pretendMouseMove(5, 6);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
    });
    it('does not track @observable accessed inside a promise inside an effect', async function () {
        const { ctx, component, startPromise, tearDown } = createFixture('<div ref="div"></div>', class App {
        });
        await startPromise;
        let MouseTracker = (() => {
            var _a;
            let _coord_decorators;
            let _coord_initializers = [];
            let _coord_extraInitializers = [];
            return _a = class MouseTracker {
                    pretendMouseMove(x, y) {
                        this.coord = [x, y];
                    }
                    constructor() {
                        this.coord = __runInitializers(this, _coord_initializers, [0, 0]);
                        __runInitializers(this, _coord_extraInitializers);
                    }
                },
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _coord_decorators = [observable()];
                    __esDecorate(null, null, _coord_decorators, { kind: "field", name: "coord", static: false, private: false, access: { has: obj => "coord" in obj, get: obj => obj.coord, set: (obj, value) => { obj.coord = value; } }, metadata: _metadata }, _coord_initializers, _coord_extraInitializers);
                    if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                })(),
                _a;
        })();
        assert.instanceOf(component.div, ctx.Element);
        let runCount = 0;
        const div = component.div;
        const observation = ctx.container.get(IObservation);
        const mouseTracker = new MouseTracker();
        const effect = observation.run(() => {
            runCount++;
            Promise.resolve().then(() => {
                div.textContent = mouseTracker.coord.join(', ');
            }).catch(ex => {
                div.textContent = String(ex);
            });
        });
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '');
        await Promise.resolve();
        assert.strictEqual(div.textContent, '0, 0');
        mouseTracker.pretendMouseMove(1, 2);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
        await Promise.resolve();
        assert.strictEqual(div.textContent, '0, 0');
        effect.stop();
        mouseTracker.pretendMouseMove(3, 4);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
        await Promise.resolve();
        assert.strictEqual(div.textContent, '0, 0');
        await tearDown();
        mouseTracker.pretendMouseMove(5, 6);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '0, 0');
        await Promise.resolve();
        assert.strictEqual(div.textContent, '0, 0');
    });
    it('runs recursive effect with @observable', async function () {
        const { ctx, component, startPromise, tearDown } = createFixture('<div ref="div"></div>', class App {
        });
        await startPromise;
        let MouseTracker = (() => {
            var _a;
            let _coord_decorators;
            let _coord_initializers = [];
            let _coord_extraInitializers = [];
            return _a = class MouseTracker {
                    pretendMouseMove(x, y) {
                        this.coord = [x, y];
                    }
                    constructor() {
                        this.coord = __runInitializers(this, _coord_initializers, [0, 0]);
                        __runInitializers(this, _coord_extraInitializers);
                    }
                },
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _coord_decorators = [observable()];
                    __esDecorate(null, null, _coord_decorators, { kind: "field", name: "coord", static: false, private: false, access: { has: obj => "coord" in obj, get: obj => obj.coord, set: (obj, value) => { obj.coord = value; } }, metadata: _metadata }, _coord_initializers, _coord_extraInitializers);
                    if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                })(),
                _a;
        })();
        assert.instanceOf(component.div, ctx.Element);
        let runCount = 0;
        const div = component.div;
        const observation = ctx.container.get(IObservation);
        const mouseTracker = new MouseTracker();
        const effect = observation.run(() => {
            runCount++;
            div.textContent = mouseTracker.coord.join(', ');
            if (runCount < 10) {
                mouseTracker.coord = [runCount, runCount];
            }
            else {
                runCount = 0;
            }
        });
        assert.strictEqual(runCount, 0);
        assert.strictEqual(div.textContent, '9, 9');
        mouseTracker.pretendMouseMove(1, 2);
        assert.strictEqual(runCount, 0);
        assert.strictEqual(div.textContent, '9, 9');
        effect.stop();
        runCount = 1;
        mouseTracker.pretendMouseMove(3, 4);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '9, 9');
        await tearDown();
        mouseTracker.pretendMouseMove(5, 6);
        assert.strictEqual(runCount, 1);
        assert.strictEqual(div.textContent, '9, 9');
    });
    it('runs recursive effect with @observable until max', async function () {
        const { ctx, component, startPromise, tearDown } = createFixture('<div ref="div"></div>', class App {
        });
        await startPromise;
        let MouseTracker = (() => {
            var _a;
            let _coord_decorators;
            let _coord_initializers = [];
            let _coord_extraInitializers = [];
            return _a = class MouseTracker {
                    pretendMouseMove(x, y) {
                        this.coord = [x, y];
                    }
                    constructor() {
                        this.coord = __runInitializers(this, _coord_initializers, [0, 0]);
                        __runInitializers(this, _coord_extraInitializers);
                    }
                },
                (() => {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                    _coord_decorators = [observable()];
                    __esDecorate(null, null, _coord_decorators, { kind: "field", name: "coord", static: false, private: false, access: { has: obj => "coord" in obj, get: obj => obj.coord, set: (obj, value) => { obj.coord = value; } }, metadata: _metadata }, _coord_initializers, _coord_extraInitializers);
                    if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                })(),
                _a;
        })();
        let runCount = 0;
        let errorCaught = null;
        const div = component.div;
        const observation = ctx.container.get(IObservation);
        const mouseTracker = new MouseTracker();
        const tryRun = (fn) => {
            try {
                fn();
            }
            catch (ex) {
                errorCaught = ex;
            }
        };
        tryRun(() => {
            observation.run(() => {
                runCount++;
                div.textContent = mouseTracker.coord.join(', ');
                if (runCount < 20) {
                    mouseTracker.coord = [runCount, runCount];
                }
                else {
                    runCount = 0;
                }
            });
        });
        assert.instanceOf(errorCaught, Error);
        // 11 because effect only run recursively 10 items max
        assert.strictEqual(runCount, 11);
        assert.strictEqual(div.textContent, '10, 10');
        runCount = 0;
        errorCaught = null;
        tryRun(() => {
            mouseTracker.pretendMouseMove(1, 2);
        });
        assert.instanceOf(errorCaught, Error);
        assert.strictEqual(runCount, 11);
        assert.strictEqual(div.textContent, '10, 10');
        await tearDown();
        // effect are independent of application
        // so even after app torn down, it still runs
        // can only stop it via `effect.stop()`
        runCount = 10;
        errorCaught = null;
        tryRun(() => {
            mouseTracker.pretendMouseMove(1, 2);
        });
        // runCount starts at 10
        // so there won't be any over run error thrown
        assert.strictEqual(errorCaught, null);
        assert.strictEqual(runCount, 0);
        assert.strictEqual(div.textContent, '19, 19');
    });
    describe('watch effect', function () {
        let observation;
        let tearDown;
        beforeEach(function () {
            const { container, tearDown: $tearDown } = createFixture('');
            tearDown = $tearDown;
            observation = container.get(IObservation);
        });
        it('runs immediately', function () {
            let v = 0;
            observation.watch({ a: 1 }, o => o.a, vv => v = vv);
            assert.strictEqual(v, 1);
        });
        it('does not run immediately', function () {
            let v = 0;
            const { run } = observation.watch({ a: 1 }, o => o.a, vv => v = vv, { immediate: false });
            assert.strictEqual(v, 0);
            run();
            assert.strictEqual(v, 1);
        });
        it('does not run after stopped', function () {
            let v = 0;
            const obj = { a: 1 };
            const { stop } = observation.watch(obj, o => o.a, vv => v = vv);
            stop();
            obj.a = 2;
            assert.strictEqual(v, 1);
        });
        it('runs can be called again', function () {
            let v = 0;
            const { run } = observation.watch({ a: 1 }, o => o.a, _ => v++);
            run();
            assert.strictEqual(v, 2);
        });
        it('runs independently with owning application', function () {
            let v = 0;
            const obj = { a: 1 };
            const { run } = observation.watch(obj, o => o.a, _ => v++);
            run();
            assert.strictEqual(v, 2);
            tearDown();
            obj.a = 2;
            assert.strictEqual(v, 3);
        });
    });
});
//# sourceMappingURL=effect.spec.js.map