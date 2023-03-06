var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.hydrating.spec.ts', function () {
    const hookSymbol = Symbol();
    let tracker = null;
    this.beforeEach(function () {
        tracker = new LifeycyleTracker();
    });
    let HydratingLoggingHook = class HydratingLoggingHook {
        hydrating(vm, controller) {
            vm[hookSymbol] = controller[hookSymbol] = hookSymbol;
            tracker.hydrating++;
            tracker.controllers.push(controller);
        }
    };
    HydratingLoggingHook = __decorate([
        lifecycleHooks()
    ], HydratingLoggingHook);
    it('invokes global created hooks', async function () {
        const { component } = await createFixture
            .html `\${message}`
            .deps(HydratingLoggingHook)
            .build().started;
        assert.strictEqual(component[hookSymbol], hookSymbol);
        assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
        assert.strictEqual(tracker.hydrating, 1);
    });
    it('invokes when registered both globally and locally', async function () {
        const { component } = await createFixture
            .component(CustomElement.define({ name: 'app', dependencies: [HydratingLoggingHook] }))
            .html `\${message}`
            .deps(HydratingLoggingHook)
            .build().started;
        assert.strictEqual(component[hookSymbol], hookSymbol);
        assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
        assert.strictEqual(tracker.hydrating, 2);
        assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
    });
    it('invokes before the view model lifecycle', async function () {
        let hydratingCallCount = 0;
        await createFixture
            .component(class App {
            hydrating() {
                assert.strictEqual(this[hookSymbol], hookSymbol);
                hydratingCallCount++;
            }
        })
            .html ``
            .deps(HydratingLoggingHook)
            .build().started;
        assert.strictEqual(hydratingCallCount, 1);
    });
    it('does not invoke hydrating hooks on Custom attribute', async function () {
        let current = null;
        let Square = class Square {
            hydrating() {
                throw new Error('No hydrating lifecycle on CA');
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
        assert.strictEqual(tracker.hydrating, 0);
    });
    class LifeycyleTracker {
        constructor() {
            this.hydrating = 0;
            this.controllers = [];
        }
    }
});
//# sourceMappingURL=lifecycle-hooks.hydrating.spec.js.map