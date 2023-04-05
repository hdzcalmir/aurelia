import type { ICustomElementController, ICustomElementViewModel } from '@aurelia/runtime-html';
import type { RouteNode } from './route-tree';
import { IRouteContext } from './route-context';
import { Params, NavigationInstruction } from './instructions';
import type { RouterOptions, IRouteConfig } from './options';
export interface IRouteViewModel extends ICustomElementViewModel {
    getRouteConfig?(parentConfig: IRouteConfig | null, routeNode: RouteNode | null): IRouteConfig | Promise<IRouteConfig>;
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
    readonly routeNode: RouteNode;
    readonly ctx: IRouteContext;
    private readonly routerOptions;
    constructor(instance: T, controller: ICustomElementController<T>, routeNode: RouteNode, ctx: IRouteContext, routerOptions: RouterOptions);
}
//# sourceMappingURL=component-agent.d.ts.map