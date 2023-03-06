var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.bound.spec.ts', function () {
    describe('[synchronous]', function () {
        const hookSymbol = Symbol();
        let tracker = null;
        this.beforeEach(function () {
            tracker = new LifeycyleTracker();
        });
        let BoundLoggingHook = class BoundLoggingHook {
            bound(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.bound++;
                tracker.controllers.push(initiator);
            }
        };
        BoundLoggingHook = __decorate([
            lifecycleHooks()
        ], BoundLoggingHook);
        it('invokes global bound hooks', async function () {
            const { component } = await createFixture
                .html `\${message}`
                .deps(BoundLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.bound, 1);
        });
        it('invokes when registered both globally and locally', async function () {
            const { component } = await createFixture
                .component(CustomElement.define({ name: 'app', dependencies: [BoundLoggingHook] }))
                .html `\${message}`
                .deps(BoundLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.bound, 2);
            assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
        });
        it('invokes before the view model lifecycle', async function () {
            let boundCallCount = 0;
            await createFixture
                .component(class App {
                bound() {
                    assert.strictEqual(this[hookSymbol], hookSymbol);
                    boundCallCount++;
                }
            })
                .html ``
                .deps(BoundLoggingHook)
                .build().started;
            assert.strictEqual(boundCallCount, 1);
        });
        it('invokes global bound hooks for Custom attribute controller', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            await createFixture
                .html `<div square>`
                .deps(BoundLoggingHook, Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.bound, 2);
        });
        it('invokes bound hooks on Custom attribute', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute({ name: 'square', dependencies: [BoundLoggingHook] })
            ], Square);
            await createFixture
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.bound, 1);
        });
        it('does not invokes bound hooks on synthetic controller of repeat', async function () {
            await createFixture
                .html('<div repeat.for="i of 2">')
                .deps(BoundLoggingHook)
                .build().started;
            assert.strictEqual(tracker.bound, /* root CE + repeat CA */ 2);
        });
        class LifeycyleTracker {
            constructor() {
                this.bound = 0;
                this.controllers = [];
            }
        }
    });
    describe('[asynchronous]', function () {
        const hookSymbol = Symbol();
        let tracker = null;
        this.beforeEach(function () {
            tracker = new AsyncLifeycyleTracker();
        });
        let boundLoggingHook = class boundLoggingHook {
            bound(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.trace('lch.start');
                return waitForTicks(5).then(() => tracker.trace('lch.end'));
            }
        };
        boundLoggingHook = __decorate([
            lifecycleHooks()
        ], boundLoggingHook);
        it('invokes global hook in parallel', async function () {
            await createFixture
                .component(class {
                bound() {
                    tracker.trace('comp.start');
                    return waitForTicks(1).then(() => tracker.trace('comp.end'));
                }
            })
                .html ``
                .deps(boundLoggingHook)
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
            ]);
        });
        it('invokes local hooks in parallel', async function () {
            var _a;
            await createFixture
                .component((_a = class {
                    bound() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [boundLoggingHook],
                _a))
                .html ``
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
            ]);
        });
        it('invokes global hooks in parallel for CA', async function () {
            var _a;
            let Square = class Square {
                bound() {
                    tracker.trace('square.start');
                    return waitForTicks(1).then(() => tracker.trace('square.end'));
                }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            await createFixture
                .component((_a = class {
                    bound() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [boundLoggingHook],
                _a))
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                // bound lifecycle resolves top down sequentially similiarly like binding
                // means children (square CA) will only be invoked
                // after parent (hooks + root CE) have been resolved
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
                'square.start',
                'square.end',
            ]);
        });
        const waitForTicks = async (count) => {
            while (count-- > 0) {
                await Promise.resolve();
            }
        };
        class AsyncLifeycyleTracker {
            constructor() {
                this.logs = [];
            }
            trace(msg) {
                this.logs.push(msg);
            }
        }
    });
});
//# sourceMappingURL=lifecycle-hooks.bound.spec.js.map