import type { IServiceLocator } from '@aurelia/kernel';
import { IBinding, Scope, type IsBindingBehavior } from '@aurelia/runtime';
import { type IAstBasedBinding } from './interfaces-bindings';
export declare class ListenerBindingOptions {
    readonly prevent: boolean;
    readonly capture: boolean;
    constructor(prevent: boolean, capture?: boolean);
}
export interface ListenerBinding extends IAstBasedBinding {
}
/**
 * Listener binding. Handle event binding between view and view model
 */
export declare class ListenerBinding implements IBinding {
    ast: IsBindingBehavior;
    target: Node;
    targetEvent: string;
    isBound: boolean;
    scope?: Scope;
    constructor(locator: IServiceLocator, ast: IsBindingBehavior, target: Node, targetEvent: string, options: ListenerBindingOptions);
    callSource(event: Event): unknown;
    handleEvent(event: Event): void;
    bind(scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=listener-binding.d.ts.map