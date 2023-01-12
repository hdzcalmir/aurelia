import { AccessorType } from '@aurelia/runtime';
import type { INode } from '../dom';
import type { IObserverLocator, ISubscriberCollection } from '@aurelia/runtime';
import { INodeObserver, INodeObserverConfigBase } from './observer-locator';
declare function defaultMatcher(a: unknown, b: unknown): boolean;
export interface ISelectElement extends HTMLSelectElement {
    options: HTMLCollectionOf<IOptionElement> & Pick<HTMLOptionsCollection, 'length' | 'selectedIndex' | 'add' | 'remove'>;
    matcher?: typeof defaultMatcher;
}
export interface IOptionElement extends HTMLOptionElement {
    model?: unknown;
}
export interface SelectValueObserver extends ISubscriberCollection {
}
export declare class SelectValueObserver implements INodeObserver {
    type: AccessorType;
    /**
     * Comes from mixin
     */
    useConfig: (config: INodeObserverConfigBase) => void;
    constructor(obj: INode, _key: PropertyKey, config: INodeObserverConfigBase, observerLocator: IObserverLocator);
    getValue(): unknown;
    setValue(newValue: unknown): void;
    handleCollectionChange(): void;
    syncOptions(): void;
    syncValue(): boolean;
    handleEvent(): void;
}
export {};
//# sourceMappingURL=select-value-observer.d.ts.map