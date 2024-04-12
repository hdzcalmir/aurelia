import { BindingBehaviorInstance, type IBinding, type Scope } from '@aurelia/runtime';
import { BindingBehaviorStaticAuDefinition } from '../binding-behavior';
export declare class ThrottleBindingBehavior implements BindingBehaviorInstance {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    constructor();
    bind(scope: Scope, binding: IBinding, delay?: number, signals?: string | string[]): void;
    unbind(scope: Scope, binding: IBinding): void;
}
//# sourceMappingURL=throttle.d.ts.map