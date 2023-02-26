import { IDisposable } from '@aurelia/kernel';
import { Collection, IExpressionParser, IndexMap, IObserverLocator } from '@aurelia/runtime';
export declare class BindingEngine {
    readonly parser: IExpressionParser;
    readonly observerLocator: IObserverLocator;
    constructor(parser: IExpressionParser, observerLocator: IObserverLocator);
    propertyObserver(object: {}, prop: PropertyKey): IBindingEnginePropertyObserver;
    collectionObserver(collection: Collection): IBindingEngineCollectionObserver;
    expressionObserver(bindingContext: {}, expression: string): IBindingEngineExpressionObserver;
}
export type IBindingEnginePropertyObserverCallback = (newValue: unknown, oldValue: unknown) => unknown;
export interface IBindingEnginePropertyObserver {
    subscribe: (callback: IBindingEnginePropertyObserverCallback) => IDisposable;
}
export type IBindingEngineCollectionObserverCallback = (collection: Collection, indexMap: IndexMap) => unknown;
export interface IBindingEngineCollectionObserver {
    subscribe: (callback: IBindingEngineCollectionObserverCallback) => IDisposable;
}
export type IBindingEngineExpressionObserverCallback = (newValue: unknown, oldValue: unknown) => unknown;
export interface IBindingEngineExpressionObserver {
    subscribe: (callback: IBindingEngineExpressionObserverCallback) => IDisposable;
}
//# sourceMappingURL=compat-binding-engine.d.ts.map