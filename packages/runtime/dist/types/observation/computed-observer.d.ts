import { AccessorType, IObserver } from '../observation';
import type { ISubscriber, ICollectionSubscriber, ISubscriberCollection, IConnectable } from '../observation';
import type { IConnectableBinding } from '../binding/connectable';
import type { IObserverLocator } from './observer-locator';
export type ComputedGetterFn<T = any, R = any> = (this: T, obj: T, observer: IConnectable) => R;
export interface ComputedObserver<T extends object> extends IConnectableBinding, ISubscriberCollection {
}
export declare class ComputedObserver<T extends object> implements IObserver, IConnectableBinding, ISubscriber, ICollectionSubscriber, ISubscriberCollection {
    type: AccessorType;
    /**
     * The getter this observer is wrapping
     */
    readonly $get: ComputedGetterFn<T>;
    /**
     * The setter this observer is wrapping
     */
    readonly $set: undefined | ((v: unknown) => void);
    /**
     * A semi-private property used by connectable mixin
     */
    readonly oL: IObserverLocator;
    constructor(obj: T, get: ComputedGetterFn<T>, set: undefined | ((v: unknown) => void), observerLocator: IObserverLocator, useProxy: boolean);
    getValue(): any;
    setValue(v: unknown): void;
    handleChange(): void;
    handleCollectionChange(): void;
    subscribe(subscriber: ISubscriber): void;
    unsubscribe(subscriber: ISubscriber): void;
    private run;
    private compute;
}
//# sourceMappingURL=computed-observer.d.ts.map