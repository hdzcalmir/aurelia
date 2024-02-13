import { IContainer } from '@aurelia/kernel';
import { IStore, IStoreSubscriber } from './interfaces';
import { IDevToolsOptions } from './interfaces-devtools';
export declare class Store<T extends object, TAction = unknown> implements IStore<T> {
    static register(c: IContainer): void;
    constructor();
    subscribe(subscriber: IStoreSubscriber<T>): void;
    unsubscribe(subscriber: IStoreSubscriber<T>): void;
    getState(): T;
    dispatch(action: TAction): void | Promise<void>;
    connectDevTools(options: IDevToolsOptions): void;
}
//# sourceMappingURL=store.d.ts.map