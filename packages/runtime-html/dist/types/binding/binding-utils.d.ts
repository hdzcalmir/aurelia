import { type IServiceLocator, type Constructable } from '@aurelia/kernel';
import { type ISubscriber } from '@aurelia/runtime';
import { type IBinding, type IRateLimitOptions } from './interfaces-bindings';
import { PropertyBinding } from './property-binding';
import { type Scope } from './scope';
/**
 * A subscriber that is used for subcribing to target observer & invoking `updateSource` on a binding
 */
export declare class BindingTargetSubscriber implements ISubscriber {
    constructor(b: PropertyBinding, flushQueue: IFlushQueue);
    flush(): void;
    handleChange(value: unknown, _: unknown): void;
}
/**
 * Implement method `useScope` in a common way for a binding. For internal use only for size saving.
 */
export declare const mixinUseScope: <T extends {
    _scope?: Scope;
}>(target: Constructable<T>) => void;
/**
 * Turns a class into AST evaluator. For internal use only
 *
 * @param strict - whether the evaluation of AST nodes will be in strict mode
 */
export declare const mixinAstEvaluator: (strict?: boolean | undefined, strictFnCall?: boolean) => <T extends {
    l: IServiceLocator;
}>(target: Constructable<T>) => void;
export interface IFlushable {
    flush(): void;
}
export declare const IFlushQueue: import("@aurelia/kernel").InterfaceSymbol<IFlushQueue>;
export interface IFlushQueue {
    get count(): number;
    add(flushable: IFlushable): void;
}
export declare class FlushQueue implements IFlushQueue {
    get count(): number;
    add(flushable: IFlushable): void;
    clear(): void;
}
/**
 * A mixing for bindings to implement a set of default behvaviors for rate limiting their calls.
 *
 * For internal use only
 */
export declare const mixingBindingLimited: <T extends IBinding>(target: Constructable<T>, getMethodName: (binding: T, opts: IRateLimitOptions) => keyof T) => void;
export declare const createPrototypeMixer: (mixer: () => void) => <T extends Constructable<IBinding>>(this: T) => void;
//# sourceMappingURL=binding-utils.d.ts.map