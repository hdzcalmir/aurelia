import { IAstEvaluator } from '../ast.eval';
import type { IServiceLocator } from '@aurelia/kernel';
import type { ITask, TaskQueue } from '@aurelia/platform';
import type { ICollectionSubscriber, IObserverLocator, IObserverLocatorBasedConnectable, ISubscriber } from '@aurelia/runtime';
import { type Scope } from './scope';
import type { IBinding, BindingMode, IBindingController } from './interfaces-bindings';
import { type Interpolation, IsExpression } from '@aurelia/expression-parser';
export interface InterpolationBinding extends IObserverLocatorBasedConnectable, IAstEvaluator, IServiceLocator {
}
export declare class InterpolationBinding implements IBinding, ISubscriber, ICollectionSubscriber {
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
export interface InterpolationPartBinding extends IAstEvaluator, IObserverLocatorBasedConnectable, IServiceLocator {
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