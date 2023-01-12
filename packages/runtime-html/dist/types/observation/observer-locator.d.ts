import { IServiceLocator } from '@aurelia/kernel';
import { IDirtyChecker, INodeObserverLocator, IObserverLocator } from '@aurelia/runtime';
import { IPlatform } from '../platform';
import { ISVGAnalyzer } from './svg-analyzer';
import type { IContainer } from '@aurelia/kernel';
import type { IAccessor, IObserver, ICollectionObserver, CollectionKind } from '@aurelia/runtime';
import type { INode } from '../dom';
export interface INodeObserverConfigBase {
    /**
     * Indicates the list of events can be used to observe a particular property
     */
    readonly events: string[];
    /**
     * Indicates whether this property is readonly, so observer wont attempt to assign value
     * example: input.files
     */
    readonly readonly?: boolean;
    /**
     * A default value to assign to the corresponding property if the incoming value is null/undefined
     */
    readonly default?: unknown;
}
export interface INodeObserver extends IObserver {
    /**
     * Instruct this node observer event observation behavior
     */
    useConfig(config: INodeObserverConfigBase): void;
}
export declare type INodeObserverConstructor = new (el: INode, key: PropertyKey, config: INodeObserverConfig, observerLocator: IObserverLocator, locator: IServiceLocator) => INodeObserver;
export interface INodeObserverConfig {
    /**
     * The observer constructor to use
     */
    readonly type?: INodeObserverConstructor;
    /**
     * Indicates the list of events can be used to observe a particular property
     */
    readonly events: string[];
    /**
     * Indicates whether this property is readonly, so observer wont attempt to assign value
     * example: input.files
     */
    readonly readonly?: boolean;
    /**
     * A default value to assign to the corresponding property if the incoming value is null/undefined
     */
    readonly default?: unknown;
}
export declare class NodeObserverLocator implements INodeObserverLocator {
    private readonly locator;
    private readonly platform;
    private readonly dirtyChecker;
    private readonly svgAnalyzer;
    /**
     * Indicates whether the node observer will be allowed to use dirty checking for a property it doesn't know how to observe
     */
    allowDirtyCheck: boolean;
    constructor(locator: IServiceLocator, platform: IPlatform, dirtyChecker: IDirtyChecker, svgAnalyzer: ISVGAnalyzer);
    static register(container: IContainer): void;
    handles(obj: unknown, _key: PropertyKey): boolean;
    useConfig(config: Record<string, Record<string, INodeObserverConfig>>): void;
    useConfig(nodeName: string, key: PropertyKey, events: INodeObserverConfig): void;
    useConfigGlobal(config: Record<string, INodeObserverConfig>): void;
    useConfigGlobal(key: PropertyKey, events: INodeObserverConfig): void;
    getAccessor(obj: HTMLElement, key: PropertyKey, requestor: IObserverLocator): IAccessor | IObserver;
    /**
     * For a list of specific elements
     * compose a list of properties, based on different tag name,
     * indicating that an overser should be returned instead of an accessor in `.getAccessor()`
     */
    overrideAccessor(overrides: Record<string, string[]>): void;
    overrideAccessor(tagName: string, key: PropertyKey): void;
    /**
     * For all elements:
     * compose a list of properties,
     * to indicate that an overser should be returned instead of an accessor in `.getAccessor()`
     */
    overrideAccessorGlobal(...keys: string[]): void;
    getNodeObserverConfig(el: HTMLElement, key: PropertyKey): INodeObserverConfig | undefined;
    getNodeObserver(el: HTMLElement, key: PropertyKey, requestor: IObserverLocator): INodeObserver | null;
    getObserver(el: HTMLElement, key: PropertyKey, requestor: IObserverLocator): IAccessor | IObserver;
}
export declare function getCollectionObserver(collection: unknown, observerLocator: IObserverLocator): ICollectionObserver<CollectionKind> | undefined;
//# sourceMappingURL=observer-locator.d.ts.map