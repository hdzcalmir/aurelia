import { IContainer, ILogger } from '@aurelia/kernel';
import { IActionHandler, IStore, IStoreSubscriber } from './interfaces';
export declare class Store<T extends object, TAction = unknown> implements IStore<T> {
    static register(c: IContainer): void;
    constructor(initialState: T | null, actionHandlers: IActionHandler<T>[], logger: ILogger);
    subscribe(subscriber: IStoreSubscriber<T>): void;
    unsubscribe(subscriber: IStoreSubscriber<T>): void;
    getState(): T;
    dispatch(action: TAction): void | Promise<void>;
}
//# sourceMappingURL=store.d.ts.map