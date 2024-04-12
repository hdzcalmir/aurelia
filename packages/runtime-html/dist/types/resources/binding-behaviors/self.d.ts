import { type BindingBehaviorInstance, type Scope } from '@aurelia/runtime';
import { ListenerBinding } from '../../binding/listener-binding';
import { BindingBehaviorStaticAuDefinition } from '../binding-behavior';
export declare class SelfBindingBehavior implements BindingBehaviorInstance {
    static readonly $au: BindingBehaviorStaticAuDefinition;
    bind(_scope: Scope, binding: ListenerBinding): void;
    unbind(_scope: Scope, binding: ListenerBinding): void;
}
//# sourceMappingURL=self.d.ts.map