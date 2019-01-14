import {
  DI,
  IContainer
} from '@aurelia/kernel';
import { expect } from 'chai';
import {
  Binding,
  BindingMode,
  FromViewBindingBehavior,
  OneTimeBindingBehavior,
  ToViewBindingBehavior,
  TwoWayBindingBehavior
} from '../../../src/index';

const tests = [
  { Behavior: OneTimeBindingBehavior, mode: BindingMode.oneTime },
  { Behavior: ToViewBindingBehavior, mode: BindingMode.toView },
  { Behavior: FromViewBindingBehavior, mode: BindingMode.fromView },
  { Behavior: TwoWayBindingBehavior, mode: BindingMode.twoWay }
];

describe('BindingModeBehavior', () => {
  const container: IContainer = DI.createContainer();
  let sut: OneTimeBindingBehavior;
  let binding: Binding;

  for (const { Behavior, mode } of tests) {
    const initModeArr = [BindingMode.oneTime, BindingMode.toView, BindingMode.fromView, BindingMode.twoWay, BindingMode.default];

    for (const initMode of initModeArr) {
      describe(Behavior.name, () => {
        beforeEach(() => {
          sut = new Behavior();
          binding = new Binding(undefined, undefined, undefined, initMode, undefined, container as any);
          sut.bind(undefined, undefined, binding);
        });

        it(`bind()   should apply  bindingMode ${mode}`, () => {
          expect(binding.mode).to.equal(mode);
        });

        it(`unbind() should revert bindingMode ${initMode}`, () => {
          sut.unbind(undefined, undefined, binding);
          expect(binding.mode).to.equal(initMode);
        });
      });
    }
  }
});
