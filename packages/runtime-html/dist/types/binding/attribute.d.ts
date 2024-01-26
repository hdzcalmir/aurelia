import { type IBinding, IAstEvaluator, IConnectableBinding, type ForOfStatement, type IObserverLocator, type IsBindingBehavior, type Scope } from '@aurelia/runtime';
import type { TaskQueue } from '@aurelia/platform';
import type { IServiceLocator } from '@aurelia/kernel';
import type { INode } from '../dom';
import type { BindingMode, IBindingController } from './interfaces-bindings';
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