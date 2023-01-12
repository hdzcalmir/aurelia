import { IAstEvaluator, IBinding, IConnectableBinding, ISubscriber } from '@aurelia/runtime';
import { BindingMode } from './interfaces-bindings';
import type { IServiceLocator } from '@aurelia/kernel';
import type { TaskQueue } from '@aurelia/platform';
import type { ForOfStatement, IObserver, IObserverLocator, IsBindingBehavior, Scope } from '@aurelia/runtime';
import type { IBindingController } from './interfaces-bindings';
export interface PropertyBinding extends IAstEvaluator, IConnectableBinding {
}
export declare class PropertyBinding implements IBinding {
    ast: IsBindingBehavior | ForOfStatement;
    target: object;
    targetProperty: string;
    mode: BindingMode;
    isBound: boolean;
    constructor(controller: IBindingController, locator: IServiceLocator, observerLocator: IObserverLocator, taskQueue: TaskQueue, ast: IsBindingBehavior | ForOfStatement, target: object, targetProperty: string, mode: BindingMode);
    updateTarget(value: unknown): void;
    updateSource(value: unknown): void;
    handleChange(): void;
    handleCollectionChange(): void;
    bind(scope: Scope): void;
    unbind(): void;
    /**
     * Start using a given observer to listen to changes on the target of this binding
     */
    useTargetObserver(observer: IObserver): void;
    /**
     * Provide a subscriber for target change observation.
     *
     * Binding behaviors can use this to setup custom observation handling during bind lifecycle
     * to alter the update source behavior during bind phase of this binding.
     */
    useTargetSubscriber(subscriber: ISubscriber): void;
}
//# sourceMappingURL=property-binding.d.ts.map