import { type IServiceLocator } from '@aurelia/kernel';
import { Scope, type IsBindingBehavior, IBinding, IAstEvaluator, IConnectableBinding } from '@aurelia/runtime';
import { type IStore } from './interfaces';
/**
 * A binding that handles the connection of the global state to a property of a target object
 */
export interface StateDispatchBinding extends IAstEvaluator, IConnectableBinding {
}
export declare class StateDispatchBinding implements IBinding {
    isBound: boolean;
    ast: IsBindingBehavior;
    constructor(locator: IServiceLocator, expr: IsBindingBehavior, target: HTMLElement, prop: string, store: IStore<object>);
    callSource(e: Event): void;
    handleEvent(e: Event): void;
    bind(_scope: Scope): void;
    unbind(): void;
    handleStateChange(state: object): void;
}
//# sourceMappingURL=state-dispatch-binding.d.ts.map