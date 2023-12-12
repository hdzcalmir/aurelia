var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { lifecycleHooks } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.all-in-one.spec.ts', function () {
    describe('[synchronous]', function () {
        let tracker = null;
        this.beforeEach(function () {
            tracker = new LifeycyleTracker();
        });
        let LoggingHook = class LoggingHook {
            hydrating() {
                tracker.hydrating++;
            }
            hydrated() {
                tracker.hydrated++;
            }
            created() {
                tracker.created++;
            }
            binding() {
                tracker.binding++;
            }
            bound() {
                tracker.bound++;
            }
            attaching() {
                tracker.attaching++;
            }
            attached() {
                tracker.attached++;
            }
            detaching() {
                tracker.detaching++;
            }
            unbinding() {
                tracker.unbinding++;
            }
            define() {
                throw new Error('ni');
            }
            dispose() {
                throw new Error('ni');
            }
            accept() {
                throw new Error('ni');
            }
        };
        LoggingHook = __decorate([
            lifecycleHooks()
        ], LoggingHook);
        it('invokes global bound hooks', async function () {
            const { tearDown } = await createFixture
                .html `\${message}`
                .deps(LoggingHook)
                .build().started;
            assert.strictEqual(tracker.hydrating, 1);
            assert.strictEqual(tracker.hydrated, 1);
            assert.strictEqual(tracker.created, 1);
            assert.strictEqual(tracker.binding, 1);
            assert.strictEqual(tracker.bound, 1);
            assert.strictEqual(tracker.attaching, 1);
            assert.strictEqual(tracker.attached, 1);
            await tearDown();
            assert.strictEqual(tracker.hydrating, 1);
            assert.strictEqual(tracker.hydrated, 1);
            assert.strictEqual(tracker.created, 1);
            assert.strictEqual(tracker.binding, 1);
            assert.strictEqual(tracker.bound, 1);
            assert.strictEqual(tracker.attaching, 1);
            assert.strictEqual(tracker.attached, 1);
            assert.strictEqual(tracker.detaching, 1);
            assert.strictEqual(tracker.unbinding, 1);
        });
        class LifeycyleTracker {
            constructor() {
                this.hydrating = 0;
                this.hydrated = 0;
                this.created = 0;
                this.binding = 0;
                this.bound = 0;
                this.attaching = 0;
                this.attached = 0;
                this.detaching = 0;
                this.unbinding = 0;
                this.controllers = [];
            }
        }
    });
    describe('[asynchronous]', function () {
        let tracker = null;
        this.beforeEach(function () {
            tracker = new AsyncLifeycyleTracker();
        });
        let AllLoggingHook = class AllLoggingHook {
            hydrating() {
                tracker.trace('lch.hydrating');
            }
            hydrated() {
                tracker.trace('lch.hydrated');
            }
            created() {
                tracker.trace('lch.created');
            }
            binding() {
                return logAndWait('lch.binding');
            }
            bound() {
                return logAndWait('lch.bound');
            }
            attaching() {
                return logAndWait('lch.attaching');
            }
            attached() {
                return logAndWait('lch.attached');
            }
            detaching() {
                return logAndWait('lch.detaching');
            }
            unbinding() {
                return logAndWait('lch.unbinding');
            }
        };
        AllLoggingHook = __decorate([
            lifecycleHooks()
        ], AllLoggingHook);
        it('invokes global hook in the right order', async function () {
            const { tearDown } = await createFixture
                .component(class {
                hydrating() {
                    tracker.trace('comp.hydrating');
                }
                hydrated() {
                    tracker.trace('comp.hydrated');
                }
                created() {
                    tracker.trace('comp.created');
                }
                binding() {
                    return logAndWait('comp.binding');
                }
                bound() {
                    return logAndWait('comp.bound');
                }
                attaching() {
                    return logAndWait('comp.attaching');
                }
                attached() {
                    return logAndWait('comp.attached');
                }
                detaching() {
                    return logAndWait('comp.detaching');
                }
                unbinding() {
                    return logAndWait('comp.unbinding');
                }
            })
                .html ``
                .deps(AllLoggingHook)
                .build().started;
            assert.deepStrictEqual(tracker.logs, [
                'lch.hydrating',
                'comp.hydrating',
                'lch.hydrated',
                'comp.hydrated',
                'lch.created',
                'comp.created',
                'lch.binding.start',
                'comp.binding.start',
                'lch.binding.end',
                'comp.binding.end',
                'lch.bound.start',
                'comp.bound.start',
                'lch.bound.end',
                'comp.bound.end',
                'lch.attaching.start',
                'comp.attaching.start',
                'lch.attaching.end',
                'comp.attaching.end',
                'lch.attached.start',
                'comp.attached.start',
                'lch.attached.end',
                'comp.attached.end',
            ]);
            await tearDown();
            assert.deepStrictEqual(tracker.logs, [
                'lch.hydrating',
                'comp.hydrating',
                'lch.hydrated',
                'comp.hydrated',
                'lch.created',
                'comp.created',
                'lch.binding.start',
                'comp.binding.start',
                'lch.binding.end',
                'comp.binding.end',
                'lch.bound.start',
                'comp.bound.start',
                'lch.bound.end',
                'comp.bound.end',
                'lch.attaching.start',
                'comp.attaching.start',
                'lch.attaching.end',
                'comp.attaching.end',
                'lch.attached.start',
                'comp.attached.start',
                'lch.attached.end',
                'comp.attached.end',
                // tear down phases
                'lch.detaching.start',
                'comp.detaching.start',
                'lch.detaching.end',
                'comp.detaching.end',
                'lch.unbinding.start',
                'comp.unbinding.start',
                'lch.unbinding.end',
                'comp.unbinding.end',
            ]);
        });
        const waitForTicks = async (count) => {
            while (count-- > 0) {
                await Promise.resolve();
            }
        };
        const logAndWait = (name, count = 5) => {
            tracker.trace(`${name}.start`);
            return waitForTicks(count).then(() => tracker.trace(`${name}.end`));
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
//# sourceMappingURL=lifecycle-hooks.all-in-one.spec.js.map