var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.binding.spec.ts', function () {
    describe('[synchronous]', function () {
        const hookSymbol = Symbol();
        let tracker = null;
        this.beforeEach(function () {
            tracker = new LifeycyleTracker();
        });
        let BindingLoggingHook = class BindingLoggingHook {
            binding(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.binding++;
                tracker.controllers.push(initiator);
            }
        };
        BindingLoggingHook = __decorate([
            lifecycleHooks()
        ], BindingLoggingHook);
        it('invokes global binding hooks', async function () {
            const { component } = await createFixture
                .html `\${message}`
                .deps(BindingLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.binding, 1);
        });
        it('invokes when registered both globally and locally', async function () {
            const { component } = await createFixture
                .component(CustomElement.define({ name: 'app', dependencies: [BindingLoggingHook] }))
                .html `\${message}`
                .deps(BindingLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.binding, 2);
            assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
        });
        it('invokes before the view model lifecycle', async function () {
            let bindingCallCount = 0;
            await createFixture
                .component(class App {
                binding() {
                    assert.strictEqual(this[hookSymbol], hookSymbol);
                    bindingCallCount++;
                }
            })
                .html ``
                .deps(BindingLoggingHook)
                .build().started;
            assert.strictEqual(bindingCallCount, 1);
        });
        it('invokes global binding hooks for Custom attribute controller', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            await createFixture
                .html `<div square>`
                .deps(BindingLoggingHook, Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.binding, 2);
        });
        it('invokes binding hooks on Custom attribute', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute({ name: 'square', dependencies: [BindingLoggingHook] })
            ], Square);
            await createFixture
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.binding, 1);
        });
        it('does not invokes binding hooks on synthetic controller of repeat', async function () {
            await createFixture
                .html('<div repeat.for="i of 2">')
                .deps(BindingLoggingHook)
                .build().started;
            assert.strictEqual(tracker.binding, /* root CE + repeat CA */ 2);
        });
        class LifeycyleTracker {
            constructor() {
                this.binding = 0;
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
        let BindingLoggingHook = class BindingLoggingHook {
            binding(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.trace('lch.start');
                return waitForTicks(5).then(() => tracker.trace('lch.end'));
            }
        };
        BindingLoggingHook = __decorate([
            lifecycleHooks()
        ], BindingLoggingHook);
        it('invokes global hook in parallel', async function () {
            await createFixture
                .component(class {
                binding() {
                    tracker.trace('comp.start');
                    return waitForTicks(1).then(() => tracker.trace('comp.end'));
                }
            })
                .html ``
                .deps(BindingLoggingHook)
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
                    binding() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [BindingLoggingHook],
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
                binding() {
                    tracker.trace('square.start');
                    return waitForTicks(1).then(() => tracker.trace('square.end'));
                }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            await createFixture
                .component((_a = class {
                    binding() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [BindingLoggingHook],
                _a))
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                // binding lifecycle resolves top down sequentially
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
//# sourceMappingURL=lifecycle-hooks.binding.spec.js.map