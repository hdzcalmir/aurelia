import { type IAstEvaluator, type IBinding, type IConnectableBinding } from '@aurelia/runtime';
import type { IIndexable, IServiceLocator } from '@aurelia/kernel';
import type { IObservable, IObserverLocator, IsExpression, Scope } from '@aurelia/runtime';
export interface LetBinding extends IAstEvaluator, IConnectableBinding {
}
export declare class LetBinding implements IBinding {
    ast: IsExpression;
    targetProperty: string;
    isBound: boolean;
    target: (IObservable & IIndexable) | null;
    constructor(locator: IServiceLocator, observerLocator: IObserverLocator, ast: IsExpression, targetProperty: string, toBindingContext?: boolean);
    updateTarget(): void;
    handleChange(): void;
    handleCollectionChange(): void;
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=let-binding.d.ts.map