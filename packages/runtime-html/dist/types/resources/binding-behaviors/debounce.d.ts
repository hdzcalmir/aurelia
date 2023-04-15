import { IPlatform } from '@aurelia/kernel';
import { type BindingBehaviorInstance, type IBinding, type Scope } from '@aurelia/runtime';
export declare class DebounceBindingBehavior implements BindingBehaviorInstance {
    constructor(platform: IPlatform);
    bind(scope: Scope, binding: IBinding, delay?: number, signals?: string | string[]): void;
    unbind(scope: Scope, binding: IBinding): void;
}
//# sourceMappingURL=debounce.d.ts.map