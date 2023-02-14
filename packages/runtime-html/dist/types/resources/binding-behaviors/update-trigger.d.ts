import { IBinding, INodeObserverLocator, IObserverLocator, type BindingBehaviorInstance, type Scope } from '@aurelia/runtime';
export declare class UpdateTriggerBindingBehavior implements BindingBehaviorInstance {
    constructor(observerLocator: IObserverLocator, nodeObserverLocator: INodeObserverLocator);
    bind(_scope: Scope, binding: IBinding, ...events: string[]): void;
}
//# sourceMappingURL=update-trigger.d.ts.map