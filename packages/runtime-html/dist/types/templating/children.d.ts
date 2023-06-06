import { type IServiceLocator } from '@aurelia/kernel';
import { type IBinding, type ISubscriberCollection } from '@aurelia/runtime';
import { type ICustomElementViewModel, type ICustomElementController } from './controller';
import type { INode } from '../dom';
export type PartialChildrenDefinition = {
    callback?: PropertyKey;
    name?: PropertyKey;
    options?: MutationObserverInit;
    query?: (controller: ICustomElementController) => ArrayLike<Node>;
    filter?: (node: Node, controller?: ICustomElementController | null, viewModel?: ICustomElementViewModel) => boolean;
    map?: (node: Node, controller?: ICustomElementController | null, viewModel?: ICustomElementViewModel) => unknown;
};
/**
 * Decorator: Specifies custom behavior for an array children property that synchronizes its items with child content nodes of the element.
 *
 * @param config - The overrides
 */
export declare function children(config?: PartialChildrenDefinition): PropertyDecorator;
/**
 * Decorator: Specifies an array property on a class that synchronizes its items with child content nodes of the element.
 *
 * @param selector - The CSS element selector for filtering children
 */
export declare function children(selector: string): PropertyDecorator;
/**
 * Decorator: Decorator: Specifies an array property that synchronizes its items with child content nodes of the element.
 *
 * @param target - The class
 * @param prop - The property name
 */
export declare function children(target: {}, prop: string): void;
export interface ChildrenBinding extends ISubscriberCollection {
}
/**
 * A binding for observing & notifying the children of a custom element.
 */
export declare class ChildrenBinding implements IBinding {
    isBound: boolean;
    readonly obj: ICustomElementViewModel;
    constructor(controller: ICustomElementController, obj: ICustomElementViewModel, callback: undefined | (() => void), query?: (controller: ICustomElementController<ICustomElementViewModel>) => ArrayLike<INode>, filter?: (node: INode, controller?: ICustomElementController<ICustomElementViewModel> | null | undefined, viewModel?: any) => boolean, map?: (node: INode, controller?: ICustomElementController<ICustomElementViewModel> | null | undefined, viewModel?: any) => any, options?: MutationObserverInit);
    getValue(): unknown[];
    setValue(_value: unknown): void;
    bind(): void;
    unbind(): void;
    get(): ReturnType<IServiceLocator['get']>;
}
//# sourceMappingURL=children.d.ts.map