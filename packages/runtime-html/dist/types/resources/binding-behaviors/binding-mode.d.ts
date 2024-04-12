import { BindingBehaviorInstance, IBinding } from '@aurelia/runtime';
import { type BindingMode } from '../../binding/interfaces-bindings';
import { type BindingBehaviorStaticAuDefinition } from '../binding-behavior';
import type { Scope } from '@aurelia/runtime';
export declare abstract class BindingModeBehavior implements BindingBehaviorInstance {
    abstract readonly mode: BindingMode;
    bind(scope: Scope, binding: IBinding & {
        mode: BindingMode;
    }): void;
    unbind(scope: Scope, binding: IBinding & {
        mode: BindingMode;
    }): void;
}
export declare class OneTimeBindingBehavior extends BindingModeBehavior {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    get mode(): typeof BindingMode.oneTime;
}
export declare class ToViewBindingBehavior extends BindingModeBehavior {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    get mode(): typeof BindingMode.toView;
}
export declare class FromViewBindingBehavior extends BindingModeBehavior {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    get mode(): typeof BindingMode.fromView;
}
export declare class TwoWayBindingBehavior extends BindingModeBehavior {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    get mode(): typeof BindingMode.twoWay;
}
//# sourceMappingURL=binding-mode.d.ts.map