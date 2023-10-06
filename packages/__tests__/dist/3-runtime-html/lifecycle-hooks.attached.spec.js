var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.attached.spec.ts', function () {
    describe('[synchronous]', function () {
        const hookSymbol = Symbol();
        class LifeycyleTracker {
            constructor() {
                this.attached = 0;
                this.controllers = [];
            }
        }
        let tracker = null;
        this.beforeEach(function () {
            tracker = new LifeycyleTracker();
        });
        let AttachedLoggingHook = class AttachedLoggingHook {
            attached(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.attached++;
                tracker.controllers.push(initiator);
            }
        };
        AttachedLoggingHook = __decorate([
            lifecycleHooks()
        ], AttachedLoggingHook);
        it('invokes global attached hooks', async function () {
            const { component } = await createFixture
                .html `\${message}`
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.attached, 1);
        });
        it('invokes when registered both globally and locally', async function () {
            const { component } = await createFixture
                .component(CustomElement.define({ name: 'app', dependencies: [AttachedLoggingHook] }))
                .html `\${message}`
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.attached, 2);
            assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
        });
        it('invokes before the view model lifecycle', async function () {
            let attachedCallCount = 0;
            await createFixture
                .component(class App {
                attached() {
                    assert.strictEqual(this[hookSymbol], hookSymbol);
                    attachedCallCount++;
                }
            })
                .html ``
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(attachedCallCount, 1);
        });
        it('invokes global attached hooks for Custom attribute controller', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            await createFixture
                .html `<div square>`
                .deps(AttachedLoggingHook, Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.attached, 2);
        });
        it('invokes attached hooks on Custom attribute', async function () {
            let current = null;
            let Square = class Square {
                created() { current = this; }
            };
            Square = __decorate([
                customAttribute({ name: 'square', dependencies: [AttachedLoggingHook] })
            ], Square);
            await createFixture
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(tracker.attached, 1);
        });
        it('does not invokes attached hooks on synthetic controller of repeat', async function () {
            await createFixture
                .html('<div repeat.for="i of 2">')
                .deps(AttachedLoggingHook)
                .build().started;
            assert.strictEqual(tracker.attached, /* root CE + repeat CA */ 2);
        });
    });
    describe('[asynchronous]', function () {
        const hookSymbol = Symbol();
        let tracker = null;
        this.beforeEach(function () {
            tracker = new AsyncLifeycyleTracker();
        });
        let AttachedLoggingHook = class AttachedLoggingHook {
            async attached(vm, initiator) {
                vm[hookSymbol] = initiator[hookSymbol] = hookSymbol;
                tracker.trace('lch.start');
                return waitForTicks(5).then(() => tracker.trace('lch.end'));
            }
        };
        AttachedLoggingHook = __decorate([
            lifecycleHooks()
        ], AttachedLoggingHook);
        it('invokes global hook in parallel', async function () {
            await createFixture
                .component(class {
                attached() {
                    tracker.trace('comp.start');
                    return waitForTicks(1).then(() => tracker.trace('comp.end'));
                }
            })
                .html ``
                .deps(AttachedLoggingHook)
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
                    attached() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [AttachedLoggingHook],
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
                attached() {
                    tracker.trace('square.start');
                    return waitForTicks(1).then(() => tracker.trace('square.end'));
                }
            };
            Square = __decorate([
                customAttribute('square')
            ], Square);
            await createFixture
                .component((_a = class {
                    attached() {
                        tracker.trace('comp.start');
                        return waitForTicks(1).then(() => tracker.trace('comp.end'));
                    }
                },
                _a.dependencies = [AttachedLoggingHook],
                _a))
                .html `<div square>`
                .deps(Square)
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                // parents (root component) attached should
                // only be called after all children attached (square attr)
                // have been called
                'square.start',
                'square.end',
                // then at the root level
                // lch and component are started in parallel
                'lch.start',
                'comp.start',
                'comp.end',
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
//# sourceMappingURL=lifecycle-hooks.attached.spec.js.map