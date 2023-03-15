import type { ICustomElementController, IHydratedController, ICustomElementViewModel, ILifecycleHooks } from '@aurelia/runtime-html';
import type { RouteDefinition } from './route-definition';
import type { RouteNode } from './route-tree';
import { IRouteContext } from './route-context';
import { Params, NavigationInstruction } from './instructions';
import type { Transition } from './router';
import { Batch } from './util';
import { IRouteConfig } from './route';
import type { RouterOptions } from './options';
export interface IRouteViewModel extends ICustomElementViewModel {
    getRouteConfig?(parentDefinition: RouteDefinition | null, routeNode: RouteNode | null): IRouteConfig | Promise<IRouteConfig>;
    canLoad?(params: Params, next: RouteNode, current: RouteNode | null): boolean | NavigationInstruction | NavigationInstruction[] | Promise<boolean | NavigationInstruction | NavigationInstruction[]>;
    loading?(params: Params, next: RouteNode, current: RouteNode | null): void | Promise<void>;
    canUnload?(next: RouteNode | null, current: RouteNode): boolean | Promise<boolean>;
    unloading?(next: RouteNode | null, current: RouteNode): void | Promise<void>;
}
/**
 * A component agent handles an instance of a routed view-model (a component).
 * It deals with invoking the hooks (`canLoad`, `loading`, `canUnload`, `unloading`),
 * and activating, deactivating, and disposing the component (via the associated controller).
 */
export declare class ComponentAgent<T extends IRouteViewModel = IRouteViewModel> {
    readonly instance: T;
    readonly controller: ICustomElementController<T>;
    readonly definition: RouteDefinition;
    readonly routeNode: RouteNode;
    readonly ctx: IRouteContext;
    private readonly routerOptions;
    readonly canLoadHooks: readonly ILifecycleHooks<IRouteViewModel, 'canLoad'>[];
    readonly loadHooks: readonly ILifecycleHooks<IRouteViewModel, 'loading'>[];
    readonly canUnloadHooks: readonly ILifecycleHooks<IRouteViewModel, 'canUnload'>[];
    readonly unloadHooks: readonly ILifecycleHooks<IRouteViewModel, 'unloading'>[];
    constructor(instance: T, controller: ICustomElementController<T>, definition: RouteDefinition, routeNode: RouteNode, ctx: IRouteContext, routerOptions: RouterOptions);
    activate(initiator: IHydratedController | null, parent: IHydratedController): void | Promise<void>;
    deactivate(initiator: IHydratedController | null, parent: IHydratedController): void | Promise<void>;
    dispose(): void;
    canUnload(tr: Transition, next: RouteNode | null, b: Batch): void;
    canLoad(tr: Transition, next: RouteNode, b: Batch): void;
    unloading(tr: Transition, next: RouteNode | null, b: Batch): void;
    loading(tr: Transition, next: RouteNode, b: Batch): void;
    toString(): string;
}
//# sourceMappingURL=component-agent.d.ts.map