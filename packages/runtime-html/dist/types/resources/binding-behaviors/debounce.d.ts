import { BindingBehaviorStaticAuDefinition } from '../binding-behavior';
import { type BindingBehaviorInstance, type IBinding, type Scope } from '@aurelia/runtime';
export declare class DebounceBindingBehavior implements BindingBehaviorInstance {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    bind(scope: Scope, binding: IBinding, delay?: number, signals?: string | string[]): void;
    unbind(scope: Scope, binding: IBinding): void;
}
//# sourceMappingURL=debounce.d.ts.map