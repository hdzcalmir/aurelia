import { ICollectionSubscriber, IndexMap, Collection } from '@aurelia/runtime';
export declare class SynchronizingCollectionSubscriber implements ICollectionSubscriber {
    readonly oldArr: unknown[];
    readonly newArr: unknown[];
    constructor(oldArr: unknown[], newArr: unknown[]);
    handleCollectionChange(collection: Collection, indexMap: IndexMap): void;
}
//# sourceMappingURL=array-observer.spec.d.ts.map