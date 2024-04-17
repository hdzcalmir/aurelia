import { type IServiceLocator } from '@aurelia/kernel';
import { TaskQueue } from '@aurelia/platform';
import { type Scope, type IObserverLocator, type IObserverLocatorBasedConnectable, ISubscriber } from '@aurelia/runtime';
import { BindingMode, type IBindingController, IAstEvaluator, IBinding } from '@aurelia/runtime-html';
import { IStore, type IStoreSubscriber } from './interfaces';
import { IsBindingBehavior } from '@aurelia/expression-parser';
/**
 * A binding that handles the connection of the global state to a property of a target object
 */
export interface StateBinding extends IAstEvaluator, IObserverLocatorBasedConnectable, IServiceLocator {
}
export declare class StateBinding implements IBinding, ISubscriber, IStoreSubscriber<object> {
    isBound: boolean;
    ast: IsBindingBehavior;
    private readonly target;
    private readonly targetProperty;
    mode: BindingMode;
    constructor(controller: IBindingController, locator: IServiceLocator, observerLocator: IObserverLocator, taskQueue: TaskQueue, ast: IsBindingBehavior, target: object, prop: PropertyKey, store: IStore<object>);
    updateTarget(value: unknown): void;
    bind(_scope: Scope): void;
    unbind(): void;
    handleChange(newValue: unknown): void;
    handleStateChange(): void;
}
//# sourceMappingURL=state-binding.d.ts.map