import { type IBinding, IAstEvaluator, IConnectableBinding } from '@aurelia/runtime';
import { BindingMode } from './interfaces-bindings';
import type { TaskQueue } from '@aurelia/platform';
import type { IServiceLocator } from '@aurelia/kernel';
import type { ForOfStatement, IObserverLocator, IsBindingBehavior, Scope } from '@aurelia/runtime';
import type { INode } from '../dom';
import type { IBindingController } from './interfaces-bindings';
export interface AttributeBinding extends IAstEvaluator, IConnectableBinding {
}
/**
 * Attribute binding. Handle attribute binding betwen view/view model. Understand Html special attributes
 */
export declare class AttributeBinding implements IBinding {
    targetAttribute: string;
    targetProperty: string;
    mode: BindingMode;
    isBound: boolean;
    target: Element;
    ast: IsBindingBehavior | ForOfStatement;
    constructor(controller: IBindingController, locator: IServiceLocator, observerLocator: IObserverLocator, taskQueue: TaskQueue, ast: IsBindingBehavior | ForOfStatement, target: INode, targetAttribute: string, targetProperty: string, mode: BindingMode);
    updateTarget(value: unknown): void;
    handleChange(): void;
    handleCollectionChange(): void;
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=attribute.d.ts.map