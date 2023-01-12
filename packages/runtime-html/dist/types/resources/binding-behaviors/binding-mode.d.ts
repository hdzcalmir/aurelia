import { BindingBehaviorInstance, IBinding } from '@aurelia/runtime';
import { BindingMode } from '../../binding/interfaces-bindings';
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
    get mode(): BindingMode;
}
export declare class ToViewBindingBehavior extends BindingModeBehavior {
    get mode(): BindingMode;
}
export declare class FromViewBindingBehavior extends BindingModeBehavior {
    get mode(): BindingMode;
}
export declare class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode(): BindingMode;
}
//# sourceMappingURL=binding-mode.d.ts.map