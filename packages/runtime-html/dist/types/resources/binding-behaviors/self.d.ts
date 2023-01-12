import { type BindingBehaviorInstance } from '@aurelia/runtime';
import { ListenerBinding } from '../../binding/listener-binding';
import type { Scope } from '@aurelia/runtime';
export declare class SelfBindingBehavior implements BindingBehaviorInstance {
    bind(_scope: Scope, binding: ListenerBinding): void;
    unbind(_scope: Scope, binding: ListenerBinding): void;
}
//# sourceMappingURL=self.d.ts.map