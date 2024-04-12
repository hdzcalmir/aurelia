import { BindingBehaviorStaticAuDefinition } from '../binding-behavior';
import type { BindingBehaviorInstance, IConnectableBinding, Scope } from '@aurelia/runtime';
export declare class SignalBindingBehavior implements BindingBehaviorInstance {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    bind(scope: Scope, binding: IConnectableBinding, ...names: string[]): void;
    unbind(scope: Scope, binding: IConnectableBinding): void;
}
//# sourceMappingURL=signals.d.ts.map