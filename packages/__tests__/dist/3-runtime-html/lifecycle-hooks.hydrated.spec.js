var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.hydrated.spec.ts', function () {
    const hookSymbol = Symbol();
    let tracker = null;
    this.beforeEach(function () {
        tracker = new LifeycyleTracker();
    });
    let HydratedLoggingHook = class HydratedLoggingHook {
        hydrated(vm, controller) {
            vm[hookSymbol] = controller[hookSymbol] = hookSymbol;
            tracker.hydrated++;
            tracker.controllers.push(controller);
        }
    };
    HydratedLoggingHook = __decorate([
        lifecycleHooks()
    ], HydratedLoggingHook);
    it('invokes global created hooks', async function () {
        const { component } = await createFixture
            .html `\${message}`
            .deps(HydratedLoggingHook)
            .build().started;
        assert.strictEqual(component[hookSymbol], hookSymbol);
        assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
        assert.strictEqual(tracker.hydrated, 1);
    });
    it('invokes when registered both globally and locally', async function () {
        const { component } = await createFixture
            .component(CustomElement.define({ name: 'app', dependencies: [HydratedLoggingHook] }))
            .html `\${message}`
            .deps(HydratedLoggingHook)
            .build().started;
        assert.strictEqual(component[hookSymbol], hookSymbol);
        assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
        assert.strictEqual(tracker.hydrated, 2);
        assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
    });
    it('invokes before the view model lifecycle', async function () {
        let hydratedCallCount = 0;
        await createFixture
            .component(class App {
            hydrated() {
                assert.strictEqual(this[hookSymbol], hookSymbol);
                hydratedCallCount++;
            }
        })
            .html ``
            .deps(HydratedLoggingHook)
            .build().started;
        assert.strictEqual(hydratedCallCount, 1);
    });
    it('does not invoke hydrated hooks on Custom attribute', async function () {
        let current = null;
        let Square = class Square {
            hydrated() {
                throw new Error('No hydrated lifecycle on CA');
            }
            created() {
                current = this;
            }
        };
        Square = __decorate([
            customAttribute('square')
        ], Square);
        await createFixture
            .html `<div square>`
            .deps(Square)
            .build().started;
        assert.instanceOf(current, Square);
        assert.strictEqual(tracker.hydrated, 0);
    });
    class LifeycyleTracker {
        constructor() {
            this.hydrated = 0;
            this.controllers = [];
        }
    }
});
//# sourceMappingURL=lifecycle-hooks.hydrated.spec.js.map