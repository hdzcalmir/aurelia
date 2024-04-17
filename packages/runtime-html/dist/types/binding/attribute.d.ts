import { type IObserverLocator, IObserverLocatorBasedConnectable, ISubscriber, ICollectionSubscriber } from '@aurelia/runtime';
import { type Scope } from './scope';
import { IAstEvaluator } from '../ast.eval';
import type { TaskQueue } from '@aurelia/platform';
import type { IServiceLocator } from '@aurelia/kernel';
import type { INode } from '../dom';
import type { IBinding, BindingMode, IBindingController } from './interfaces-bindings';
import { ForOfStatement, IsBindingBehavior } from '@aurelia/expression-parser';
export interface AttributeBinding extends IAstEvaluator, IServiceLocator, IObserverLocatorBasedConnectable {
}
/**
 * Attribute binding. Handle attribute binding betwen view/view model. Understand Html special attributes
 */
export declare class AttributeBinding implements IBinding, ISubscriber, ICollectionSubscriber {
    targetAttribute: string;
    targetProperty: string;
    mode: BindingMode;
    isBound: boolean;
    target: HTMLElement;
    ast: IsBindingBehavior | ForOfStatement;
    constructor(controller: IBindingController, locator: IServiceLocator, observerLocator: IObserverLocator, taskQueue: TaskQueue, ast: IsBindingBehavior | ForOfStatement, target: INode, targetAttribute: string, targetProperty: string, mode: BindingMode);
    updateTarget(value: unknown): void;
    handleChange(): void;
    handleCollectionChange(): void;
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=attribute.d.ts.map