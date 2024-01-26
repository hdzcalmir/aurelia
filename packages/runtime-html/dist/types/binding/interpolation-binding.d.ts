import { IAstEvaluator, IConnectableBinding } from '@aurelia/runtime';
import type { IServiceLocator } from '@aurelia/kernel';
import type { ITask, TaskQueue } from '@aurelia/platform';
import type { IBinding, ICollectionSubscriber, Interpolation, IObserverLocator, IsExpression, Scope } from '@aurelia/runtime';
import type { BindingMode, IBindingController } from './interfaces-bindings';
export interface InterpolationBinding extends IBinding {
}
export declare class InterpolationBinding implements IBinding {
    ast: Interpolation;
    target: object;
    targetProperty: string;
    mode: BindingMode;
    isBound: boolean;
    partBindings: InterpolationPartBinding[];
    constructor(controller: IBindingController, locator: IServiceLocator, observerLocator: IObserverLocator, taskQueue: TaskQueue, ast: Interpolation, target: object, targetProperty: string, mode: BindingMode);
    updateTarget(): void;
    bind(_scope: Scope): void;
    unbind(): void;
}
export interface InterpolationPartBinding extends IAstEvaluator, IConnectableBinding {
}
export declare class InterpolationPartBinding implements IBinding, ICollectionSubscriber {
    readonly ast: IsExpression;
    readonly target: object;
    readonly targetProperty: string;
    readonly owner: InterpolationBinding;
    readonly mode: BindingMode;
    _scope?: Scope;
    task: ITask | null;
    isBound: boolean;
    constructor(ast: IsExpression, target: object, targetProperty: string, locator: IServiceLocator, observerLocator: IObserverLocator, owner: InterpolationBinding);
    updateTarget(): void;
    handleChange(): void;
    handleCollectionChange(): void;
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=interpolation-binding.d.ts.map