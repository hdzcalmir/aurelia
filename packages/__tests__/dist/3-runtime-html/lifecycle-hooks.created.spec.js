var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customAttribute, CustomElement, lifecycleHooks, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/lifecycle-hooks.created.spec.ts', function () {
    const hookSymbol = Symbol();
    let tracker = null;
    this.beforeEach(function () {
        tracker = new LifeycyleTracker();
    });
    let CreatedLoggingHook = class CreatedLoggingHook {
        created(vm, controller) {
            vm[hookSymbol] = controller[hookSymbol] = hookSymbol;
            tracker.created++;
            tracker.controllers.push(controller);
        }
    };
    CreatedLoggingHook = __decorate([
        lifecycleHooks()
    ], CreatedLoggingHook);
    describe('custom elements', function () {
        it('invokes global created hooks', async function () {
            const { component } = await createFixture
                .html `\${message}`
                .deps(CreatedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.created, 1);
        });
        it('invokes when registered both globally and locally', async function () {
            const { component } = await createFixture
                .component(CustomElement.define({ name: 'app', dependencies: [CreatedLoggingHook] }))
                .html `\${message}`
                .deps(CreatedLoggingHook)
                .build().started;
            assert.strictEqual(component[hookSymbol], hookSymbol);
            assert.strictEqual(component.$controller[hookSymbol], hookSymbol);
            assert.strictEqual(tracker.created, 2);
            assert.deepStrictEqual(tracker.controllers, [component.$controller, component.$controller]);
        });
        it('invokes before the view model lifecycle', async function () {
            let createdCall = 0;
            await createFixture
                .component(class App {
                created() {
                    assert.strictEqual(this[hookSymbol], hookSymbol);
                    createdCall++;
                }
            })
                .html ``
                .deps(CreatedLoggingHook)
                .build().started;
            assert.strictEqual(createdCall, 1);
        });
    });
    describe('custom attributes', function () {
        const caHooksSymbol = Symbol();
        let current = null;
        this.beforeEach(function () {
            current = null;
        });
        let Square = class Square {
            created() {
                this[caHooksSymbol] = true;
                current = this;
            }
        };
        Square = __decorate([
            customAttribute('square')
        ], Square);
        it('invokes global created hooks', async function () {
            await createFixture
                .html `<div square>`
                .deps(Square, CreatedLoggingHook)
                .build().started;
            assert.instanceOf(current, Square);
            assert.strictEqual(current[hookSymbol], hookSymbol);
            assert.strictEqual(current?.[caHooksSymbol], true);
        });
        it('does not invokes created hooks on owning CE', async function () {
            await createFixture
                .html `<square>`
                .deps(CustomElement.define({
                name: 'square',
                template: '<div square>',
                dependencies: [Square]
            }))
                .build().started;
            assert.instanceOf(current, Square);
            assert.notStrictEqual(current[hookSymbol], hookSymbol);
            assert.strictEqual(current?.[caHooksSymbol], true);
        });
        it('invokes own created hooks deps', async function () {
            let attr;
            let Attr = class Attr {
                created() {
                    attr = this;
                }
            };
            Attr = __decorate([
                customAttribute({
                    name: 'attr',
                    dependencies: [CreatedLoggingHook]
                })
            ], Attr);
            await createFixture
                .html `<div attr>`
                .deps(Attr)
                .build().started;
            assert.instanceOf(attr, Attr);
            assert.strictEqual(attr[hookSymbol], hookSymbol);
        });
    });
    class LifeycyleTracker {
        constructor() {
            this.created = 0;
            this.controllers = [];
        }
    }
});
//# sourceMappingURL=lifecycle-hooks.created.spec.js.map