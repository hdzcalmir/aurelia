import { type MaybePromise, type IRegistry } from '@aurelia/kernel';
export declare const IActionHandler: import("@aurelia/kernel").InterfaceSymbol<IActionHandler<any>>;
export type IActionHandler<T = any> = (state: T, action: unknown, ...params: any) => MaybePromise<T>;
export declare const IStore: import("@aurelia/kernel").InterfaceSymbol<IStore<object>>;
export interface IStore<T extends object> {
    subscribe(subscriber: IStoreSubscriber<T>): void;
    unsubscribe(subscriber: IStoreSubscriber<T>): void;
    getState(): T;
    /**
     * Dispatch an action by name or the function itself. The action needs to be registered with the store.
     *
     * @param action - the name or the action to be dispatched
     * @param params - all the parameters to be called with the action
     */
    dispatch(action: unknown, ...params: any[]): void | Promise<void>;
}
export declare const IState: import("@aurelia/kernel").InterfaceSymbol<object>;
export type IRegistrableReducer = IActionHandler & IRegistry;
export interface IStoreSubscriber<T extends object> {
    handleStateChange(state: T, prevState: T): void;
}
export interface IAction {
    type: unknown;
    params?: unknown[];
}
//# sourceMappingURL=interfaces.d.ts.map