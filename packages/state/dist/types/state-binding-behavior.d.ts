import { IBinding, Scope } from '@aurelia/runtime';
import { IStore } from './interfaces';
export declare class StateBindingBehavior {
    constructor(store: IStore<object>);
    bind(scope: Scope, binding: IBinding): void;
    unbind(scope: Scope, binding: IBinding): void;
}
//# sourceMappingURL=state-binding-behavior.d.ts.map