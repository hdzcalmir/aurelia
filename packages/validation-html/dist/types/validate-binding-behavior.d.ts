import { IServiceLocator } from '@aurelia/kernel';
import { BindingBehaviorInstance, IAstEvaluator, IBinding, IConnectable, IObserverLocator, Scope } from '@aurelia/runtime';
import { IPlatform } from '@aurelia/runtime-html';
/**
 * Validation triggers.
 */
export declare enum ValidationTrigger {
    /**
     * Manual validation.  Use the controller's `validate()` and  `reset()` methods to validate all bindings.
     */
    manual = "manual",
    /**
     * Validate the binding when the binding's target element fires a DOM 'blur' event.
     */
    blur = "blur",
    /**
     * Validate the binding when the binding's target element fires a DOM 'focusout' event.
     */
    focusout = "focusout",
    /**
     * Validate the binding when it updates the model due to a change in the source property (usually triggered by some change in view)
     */
    change = "change",
    /**
     * Validate the binding when the binding's target element fires a DOM 'blur' event and when it updates the model due to a change in the view.
     */
    changeOrBlur = "changeOrBlur",
    /**
     * Validate the binding when the binding's target element fires a DOM 'focusout' event and when it updates the model due to a change in the view.
     */
    changeOrFocusout = "changeOrFocusout"
}
export declare const IDefaultTrigger: import("@aurelia/kernel").InterfaceSymbol<ValidationTrigger>;
export declare class ValidateBindingBehavior implements BindingBehaviorInstance {
    protected static inject: (import("@aurelia/kernel").InterfaceSymbol<IPlatform> | import("@aurelia/kernel").InterfaceSymbol<IObserverLocator>)[];
    constructor(platform: IPlatform, observerLocator: IObserverLocator);
    bind(scope: Scope, binding: IBinding): void;
    unbind(scope: Scope, binding: IBinding): void;
}
declare type MediatedBinding<K extends string> = {
    [key in K]: (newValue: unknown, previousValue: unknown) => void;
};
export interface BindingMediator<K extends string> extends IConnectable, IAstEvaluator {
}
export declare class BindingMediator<K extends string> {
    readonly key: K;
    readonly binding: MediatedBinding<K>;
    oL: IObserverLocator;
    readonly l: IServiceLocator;
    constructor(key: K, binding: MediatedBinding<K>, oL: IObserverLocator, l: IServiceLocator);
    handleChange(newValue: unknown, previousValue: unknown): void;
}
export {};
//# sourceMappingURL=validate-binding-behavior.d.ts.map