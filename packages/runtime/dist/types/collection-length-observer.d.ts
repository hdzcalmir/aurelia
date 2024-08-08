import { Collection, IObserver } from './interfaces';
import type { AccessorType, ICollectionObserver, IndexMap, ISubscriberCollection, ICollectionSubscriber } from './interfaces';
export interface CollectionLengthObserver extends ISubscriberCollection {
}
export declare class CollectionLengthObserver implements IObserver, ICollectionSubscriber {
    readonly owner: ICollectionObserver<'array'>;
    readonly type: AccessorType;
    constructor(owner: ICollectionObserver<'array'>);
    getValue(): number;
    setValue(newValue: number): void;
    handleDirty(): void;
    handleCollectionChange(_arr: unknown[], _: IndexMap): void;
}
export interface CollectionSizeObserver extends ISubscriberCollection {
}
export declare class CollectionSizeObserver implements ICollectionSubscriber {
    readonly owner: ICollectionObserver<'map' | 'set'>;
    readonly type: AccessorType;
    constructor(owner: ICollectionObserver<'map' | 'set'>);
    getValue(): number;
    setValue(): void;
    handleDirty(): void;
    handleCollectionChange(_collection: Collection, _: IndexMap): void;
}
//# sourceMappingURL=collection-length-observer.d.ts.map