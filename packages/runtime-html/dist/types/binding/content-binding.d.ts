import { IAstEvaluator, IConnectableBinding } from '@aurelia/runtime';
import { BindingMode } from './interfaces-bindings';
import type { IServiceLocator } from '@aurelia/kernel';
import type { TaskQueue } from '@aurelia/platform';
import type { IBinding, ICollectionSubscriber, IObserverLocator, IsExpression, Scope } from '@aurelia/runtime';
import type { IPlatform } from '../platform';
import type { IBindingController } from './interfaces-bindings';
export interface ContentBinding extends IAstEvaluator, IConnectableBinding {
}
/**
 * A binding for handling the element content interpolation
 */
export declare class ContentBinding implements IBinding, ICollectionSubscriber {
    private readonly p;
    readonly ast: IsExpression;
    readonly target: Text;
    readonly strict: boolean;
    isBound: boolean;
    readonly mode: BindingMode;
    constructor(controller: IBindingController, locator: IServiceLocator, observerLocator: IObserverLocator, taskQueue: TaskQueue, p: IPlatform, ast: IsExpression, target: Text, strict: boolean);
    updateTarget(value: unknown): void;
    handleChange(): void;
    handleCollectionChange(): void;
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=content-binding.d.ts.map