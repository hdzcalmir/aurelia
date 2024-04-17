import { type IServiceLocator } from '@aurelia/kernel';
import { IObserverLocatorBasedConnectable } from '@aurelia/runtime';
import { IBinding, IAstEvaluator, type Scope } from '@aurelia/runtime-html';
import { IStoreSubscriber, type IStore } from './interfaces';
import { IsBindingBehavior } from '@aurelia/expression-parser';
/**
 * A binding that handles the connection of the global state to a property of a target object
 */
export interface StateDispatchBinding extends IAstEvaluator, IObserverLocatorBasedConnectable, IServiceLocator {
}
export declare class StateDispatchBinding implements IBinding, IStoreSubscriber<object> {
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