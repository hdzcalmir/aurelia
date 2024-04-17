import type { Class } from '@aurelia/kernel';
import type { IConnectable, ISubscribable, ISubscriber, ICollectionSubscriber, ICollectionSubscribable } from '../observation';
import type { IObserverLocator } from './observer-locator';
export interface IObserverLocatorBasedConnectable extends IConnectable, ISubscriber, ICollectionSubscriber {
    oL: IObserverLocator;
    /**
     * A record storing observers that are currently subscribed to by this binding
     */
    obs: BindingObserverRecord;
}
export declare class BindingObserverRecord {
    version: number;
    count: number;
    constructor(b: IObserverLocatorBasedConnectable);
    /**
     * Add, and subscribe to a given observer
     */
    add(observer: ISubscribable | ICollectionSubscribable): void;
    /**
     * Unsubscribe the observers that are not up to date with the record version
     */
    clear(): void;
    clearAll(): void;
}
type Connectable = {
    oL: IObserverLocator;
} & IConnectable & Partial<ISubscriber & ICollectionSubscriber>;
type DecoratableConnectable<TProto, TClass> = Class<TProto & Connectable, TClass>;
type DecoratedConnectable<TProto, TClass> = Class<TProto & Connectable, TClass>;
declare const connectableDecorator: <TProto, TClass>(target: DecoratableConnectable<TProto, TClass>, _context: ClassDecoratorContext<DecoratableConnectable<TProto, TClass>>) => DecoratedConnectable<TProto, TClass>;
export declare function connectable(): typeof connectableDecorator;
export declare function connectable<TProto, TClass>(target: DecoratableConnectable<TProto, TClass>, context: ClassDecoratorContext<DecoratableConnectable<TProto, TClass>>): DecoratedConnectable<TProto, TClass>;
export {};
//# sourceMappingURL=connectable.d.ts.map