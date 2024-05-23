import { IIndexable } from '@aurelia/kernel';
import { CollectionSizeObserver } from './collection-length-observer';
import { atObserver, createIndexMap, type AccessorType, type ICollectionObserver, type ICollectionSubscriberCollection } from './interfaces';
import { addCollectionBatch, batching } from './subscriber-batch';
import { subscriberCollection } from './subscriber-collection';
import { rtDefineHiddenProp } from './utilities';

export interface SetObserver extends ICollectionObserver<'set'>, ICollectionSubscriberCollection { }

export const getSetObserver = /*@__PURE__*/ (() => {
  // multiple applications of Aurelia wouldn't have different observers for the same Set object
  const lookupMetadataKey = Symbol.for('__au_set_obs__');
  const observerLookup = ((Set as IIndexable<typeof Set>)[lookupMetadataKey]
    ?? rtDefineHiddenProp(Set, lookupMetadataKey, new WeakMap())
  ) as WeakMap<Set<unknown>, SetObserverImpl>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { add: $add, clear: $clear, delete: $delete } = Set.prototype as { [K in keyof Set<any>]: Set<any>[K] & { observing?: boolean } };

  const methods: ['add', 'clear', 'delete'] = ['add', 'clear', 'delete'];

  // note: we can't really do much with Set due to the internal data structure not being accessible so we're just using the native calls
  // fortunately, add/delete/clear are easy to reconstruct for the indexMap

  const observe = {
    // https://tc39.github.io/ecma262/#sec-set.prototype.add
    add: function (this: Set<unknown>, value: unknown): ReturnType<typeof $add> {
      const o = observerLookup.get(this);
      if (o === undefined) {
        $add.call(this, value);
        return this;
      }
      const oldSize = this.size;
      $add.call(this, value);
      const newSize = this.size;
      if (newSize === oldSize) {
        return this;
      }
      o.indexMap[oldSize] = -2;
      o.notify();
      return this;
    },
    // https://tc39.github.io/ecma262/#sec-set.prototype.clear
    clear: function (this: Set<unknown>): ReturnType<typeof $clear> {
      const o = observerLookup.get(this);
      if (o === undefined) {
        return $clear.call(this);
      }
      const size = this.size;
      if (size > 0) {
        const indexMap = o.indexMap;
        let i = 0;
        // deepscan-disable-next-line
        for (const key of this.keys()) {
          if (indexMap[i] > -1) {
            indexMap.deletedIndices.push(indexMap[i]);
            indexMap.deletedItems.push(key);
          }
          i++;
        }
        $clear.call(this);
        indexMap.length = 0;
        o.notify();
      }
      return undefined;
    },
    // https://tc39.github.io/ecma262/#sec-set.prototype.delete
    delete: function (this: Set<unknown>, value: unknown): ReturnType<typeof $delete> {
      const o = observerLookup.get(this);
      if (o === undefined) {
        return $delete.call(this, value);
      }
      const size = this.size;
      if (size === 0) {
        return false;
      }
      let i = 0;
      const indexMap = o.indexMap;
      for (const entry of this.keys()) {
        if (entry === value) {
          if (indexMap[i] > -1) {
            indexMap.deletedIndices.push(indexMap[i]);
            indexMap.deletedItems.push(entry);
          }
          indexMap.splice(i, 1);
          const deleteResult = $delete.call(this, value);
          if (deleteResult === true) {
            o.notify();
          }
          return deleteResult;
        }
        i++;
      }
      return false;
    }
  };

  function enableSetObservation(set: Set<unknown>): void {
    for (const method of methods) {
      rtDefineHiddenProp(set, method, observe[method]);
    }
  }

  // function disableSetObservation(): void {
  //   for (const method of methods) {
  //     if (proto[method].observing === true) {
  //       rtDef(proto, method, { ...descriptorProps, value: native[method] });
  //     }
  //   }
  // }

  interface SetObserverImpl extends SetObserver {}
  class SetObserverImpl {
    public type: AccessorType = atObserver;
    private lenObs?: CollectionSizeObserver;

    public constructor(observedSet: Set<unknown>) {
      this.collection = observedSet;
      this.indexMap = createIndexMap(observedSet.size);
      this.lenObs = void 0;
    }

    public notify(): void {
      const subs = this.subs;
      const indexMap = this.indexMap;
      if (batching) {
        addCollectionBatch(subs, this.collection, indexMap);
        return;
      }

      const set = this.collection;
      const size = set.size;

      this.indexMap = createIndexMap(size);
      this.subs.notifyCollection(set, indexMap);
    }

    public getLengthObserver(): CollectionSizeObserver {
      return this.lenObs ??= new CollectionSizeObserver(this);
    }
  }
  subscriberCollection(SetObserverImpl, null!);

  return function getSetObserver(set: Set<unknown>): SetObserver {
    let observer = observerLookup.get(set);
    if (observer === void 0) {
      observerLookup.set(set, observer = new SetObserverImpl(set));
      enableSetObservation(set);
    }
    return observer;
  };
})();
