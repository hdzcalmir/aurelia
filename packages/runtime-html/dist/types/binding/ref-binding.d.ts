import type { IServiceLocator } from '@aurelia/kernel';
import { IAstEvaluator, IBinding, IConnectableBinding, type IsBindingBehavior, type Scope } from '@aurelia/runtime';
export interface RefBinding extends IAstEvaluator, IConnectableBinding {
}
export declare class RefBinding implements IBinding {
    ast: IsBindingBehavior;
    target: object;
    isBound: boolean;
    constructor(locator: IServiceLocator, ast: IsBindingBehavior, target: object);
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=ref-binding.d.ts.map