import { AccessorType, IObserver } from '../observation';
import type { ISubscriber, ICollectionSubscriber, ISubscriberCollection, IConnectable } from '../observation';
import type { IConnectableBinding } from '../binding/connectable';
import type { IObserverLocator } from './observer-locator';
export interface ComputedObserver extends IConnectableBinding, ISubscriberCollection {
}
export declare class ComputedObserver implements IObserver, IConnectableBinding, ISubscriber, ICollectionSubscriber, ISubscriberCollection {
    static create(obj: object, key: PropertyKey, descriptor: PropertyDescriptor, observerLocator: IObserverLocator, useProxy: boolean): ComputedObserver;
    type: AccessorType;
    /**
     * The getter this observer is wrapping
     */
    readonly $get: (watcher: IConnectable) => unknown;
    /**
     * The setter this observer is wrapping
     */
    readonly $set: undefined | ((v: unknown) => void);
    /**
     * A semi-private property used by connectable mixin
     */
    readonly oL: IObserverLocator;
    constructor(obj: object, get: (watcher: IConnectable) => unknown, set: undefined | ((v: unknown) => void), useProxy: boolean, observerLocator: IObserverLocator);
    getValue(): unknown;
    setValue(v: unknown): void;
    handleChange(): void;
    handleCollectionChange(): void;
    subscribe(subscriber: ISubscriber): void;
    unsubscribe(subscriber: ISubscriber): void;
    private run;
    private compute;
}
//# sourceMappingURL=computed-observer.d.ts.map