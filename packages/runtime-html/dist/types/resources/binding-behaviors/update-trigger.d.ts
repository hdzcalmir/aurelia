import { type Scope } from '../../binding/scope';
import { type IBinding } from '../../binding/interfaces-bindings';
import { type BindingBehaviorInstance, type BindingBehaviorStaticAuDefinition } from '../binding-behavior';
export declare class UpdateTriggerBindingBehavior implements BindingBehaviorInstance {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    bind(_scope: Scope, binding: IBinding, ...events: string[]): void;
}
//# sourceMappingURL=update-trigger.d.ts.map