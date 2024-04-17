import type { IServiceLocator } from '@aurelia/kernel';
import { ICollectionSubscriber, IObserverLocatorBasedConnectable, ISubscriber, type Scope } from '@aurelia/runtime';
import { IAstEvaluator } from '../ast.eval';
import { type IsBindingBehavior } from '@aurelia/expression-parser';
import { IBinding } from './interfaces-bindings';
export interface RefBinding extends IAstEvaluator, IObserverLocatorBasedConnectable, IServiceLocator {
}
export declare class RefBinding implements IBinding, ISubscriber, ICollectionSubscriber {
    ast: IsBindingBehavior;
    target: object;
    isBound: boolean;
    constructor(locator: IServiceLocator, ast: IsBindingBehavior, target: object);
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=ref-binding.d.ts.map