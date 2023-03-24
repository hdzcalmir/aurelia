import { DI, Registration, } from '@aurelia/kernel';
import { PropertyBinding, FromViewBindingBehavior, OneTimeBindingBehavior, ToViewBindingBehavior, TwoWayBindingBehavior, IPlatform, } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
const tests = [
    { Behavior: OneTimeBindingBehavior, mode: 1 /* BindingMode.oneTime */ },
    { Behavior: ToViewBindingBehavior, mode: 2 /* BindingMode.toView */ },
    { Behavior: FromViewBindingBehavior, mode: 4 /* BindingMode.fromView */ },
    { Behavior: TwoWayBindingBehavior, mode: 6 /* BindingMode.twoWay */ }
];
describe('2-runtime/binding-mode-behaviors.spec.ts', function () {
    const container = DI.createContainer();
    let sut;
    let binding;
    Registration.instance(IPlatform, {}).register(container);
    for (const { Behavior, mode } of tests) {
        const initModeArr = [1 /* BindingMode.oneTime */, 2 /* BindingMode.toView */, 4 /* BindingMode.fromView */, 6 /* BindingMode.twoWay */, 8 /* BindingMode.default */];
        for (const initMode of initModeArr) {
            describe(Behavior.name, function () {
                // eslint-disable-next-line mocha/no-hooks
                beforeEach(function () {
                    sut = new Behavior();
                    binding = new PropertyBinding({ state: 0 }, container, {}, undefined, undefined, undefined, undefined, initMode);
                    sut.bind(undefined, binding);
                });
                it(`bind()   should apply  bindingMode ${mode}`, function () {
                    assert.strictEqual(binding.mode, mode, `binding.mode`);
                });
                it(`unbind() should revert bindingMode ${initMode}`, function () {
                    sut.unbind(undefined, binding);
                    assert.strictEqual(binding.mode, initMode, `binding.mode`);
                });
            });
        }
    }
});
//# sourceMappingURL=binding-mode-behaviors.spec.js.map