var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.unbinding.spec.ts', function () {
    describe('[synchronous]', function () {
        let tracker = null;
        this.beforeEach(function () {
            tracker = new LifeycyleTracker();
        });
        const hookSymbol = Symbol();
        let UnbindingLoggingHook = class UnbindingLoggingHook {
            unbinding(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.unbinding++;
                tracker.controllers.push(initiator);
            }
        };
        UnbindingLoggingHook = __decorate([
            lifecycleHooks()
        ], UnbindingLoggingHook);
        it('invokes global unbinding hooks', async function () {
            const { component, tearDown } = await createFixture
                .html `\${message}`
                .deps(UnbindingLoggingHook)
                .build().started;
            await tearDown();
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.unbinding, 1);
        });
        it('invokes when registered both globally and locally', async function () {
            const { component, tearDown } = await createFixture
                .component(CustomElement.define({ name: 'app', dependencies: [UnbindingLoggingHook] }))
                .html `\${message}`
                .deps(UnbindingLoggingHook)
                .build().started;
            await tearDown();
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.unbinding, 2);
            assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
        });
        it('invokes before the view model lifecycle', async function () {
            let unbindingCallCount = 0;
            const { tearDown } = await createFixture
                .component(class App {
                unbinding() {
                    assert.strictEqual(this[hookSymbol], hookSymbol);
                    unbindingCallCount++;
                }
            })
                .html ``
                .deps(UnbindingLoggingHook)
                .build().started;
            await tearDown();
            assert.strictEqual(unbindingCallCount, 1);
        });
        it('invokes global unbinding hooks for Custom attribute controller', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            const { tearDown } = await createFixture
                .html `<div square>`
                .deps(UnbindingLoggingHook, Square)
                .build().started;
            await tearDown();
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.unbinding, 2);
        });
        it('invokes unbinding hooks on Custom attribute', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute({ name: 'square', dependencies: [UnbindingLoggingHook] })
            ], Square);
            const { tearDown } = await createFixture
                .html `<div square>`
                .deps(Square)
                .build().started;
            await tearDown();
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.unbinding, 1);
        });
        it('does not invokes unbinding hooks on synthetic controller of repeat', async function () {
            const { tearDown } = await createFixture
                .html('<div repeat.for="i of 2">')
                .deps(UnbindingLoggingHook)
                .build().started;
            await tearDown();
            assert.strictEqual(tracker.unbinding, /* root CE + repeat CA */ 2);
        });
        class LifeycyleTracker {
            constructor() {
                this.unbinding = 0;
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
        let UnbindingLoggingHook = class UnbindingLoggingHook {
            unbinding(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.trace('lch.start');
                return waitForTicks(5).then(() => tracker.trace('lch.end'));
            }
        };
        UnbindingLoggingHook = __decorate([
            lifecycleHooks()
        ], UnbindingLoggingHook);
        let UnbindingLoggingHook2 = class UnbindingLoggingHook2 {
            unbinding(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.trace('lch2.start');
                return waitForTicks(5).then(() => tracker.trace('lch2.end'));
            }
        };
        UnbindingLoggingHook2 = __decorate([
            lifecycleHooks()
        ], UnbindingLoggingHook2);
        it('invokes global hook in parallel', async function () {
            const { tearDown } = await createFixture
                .component(class {
                unbinding() {
                    tracker.trace('comp.start');
                    return waitForTicks(1).then(() => tracker.trace('comp.end'));
                }
            })
                .html ``
                .deps(UnbindingLoggingHook)
                .build().started;
            await tearDown();
            assert.deepStrictEqual(tracker.logs, [
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
            ]);
        });
        it('invokes local hooks in parallel', async function () {
            var _a;
            const { tearDown } = await createFixture
                .component((_a = class {
                    unbinding() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [UnbindingLoggingHook],
                _a))
                .html ``
                .build().started;
            await tearDown();
            assert.deepStrictEqual(tracker.logs, [
                'lch.start',
                'comp.start',
                'comp.end',
                'lch.end',
            ]);
        });
        it('invokes global hooks in parallel for CA', async function () {
            let Square = class Square {
                unbinding() {
                    tracker.trace('square.start');
                    return waitForTicks(1).then(() => tracker.trace('square.end'));
                }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            const { tearDown } = await createFixture
                .component(class {
                unbinding() {
                    tracker.trace('comp.start');
                    return waitForTicks(1).then(() => tracker.trace('comp.end'));
                }
            })
                .html `<div square>`
                .deps(Square, UnbindingLoggingHook)
                .build().started;
            await tearDown();
            assert.deepStrictEqual(tracker.logs, [
                // unbinding starts bottom up
                'lch.start',
                'square.start',
                'lch.start',
                'comp.start',
                'square.end',
                'comp.end',
                'lch.end',
                'lch.end',
            ]);
        });
        it('invokes hooks in the same order with registration', async function () {
            var _a;
            const { tearDown } = await createFixture
                .component((_a = class {
                    unbinding() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [UnbindingLoggingHook2, UnbindingLoggingHook],
                _a))
                .html ``
                .build().started;
            await tearDown();
            assert.deepStrictEqual(tracker.logs, [
                'lch2.start',
                'lch.start',
                'comp.start',
                'comp.end',
                'lch2.end',
                'lch.end',
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
//# sourceMappingURL=lifecycle-hooks.unbinding.spec.js.map