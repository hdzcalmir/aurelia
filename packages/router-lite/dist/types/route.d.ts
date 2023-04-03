import { Constructable, ResourceType, IContainer } from '@aurelia/kernel';
import { RouteableComponent } from './instructions';
import type { RouteNode } from './route-tree';
import { FallbackFunction } from './resources/viewport';
export declare const noRoutes: readonly Routeable[];
/**
 * Either a `RouteableComponent` or a name/config that can be resolved to a one:
 * - `string`: a string representing the component name. Must be resolveable via DI from the context of the component relative to which the navigation occurs (specified in the `dependencies` array, `<import>`ed in the view, declared as an inline template, or registered globally)
 * - `IChildRouteConfig`: a standalone child route config object.
 * - `RouteableComponent`: see `RouteableComponent`.
 *
 * NOTE: differs from `NavigationInstruction` only in having `IChildRouteConfig` instead of `IViewportIntruction`
 * (which in turn are quite similar, but do have a few minor but important differences that make them non-interchangeable)
 * as well as `IRedirectRouteConfig`
 */
export type Routeable = string | IChildRouteConfig | IRedirectRouteConfig | RouteableComponent;
export interface IRouteConfig {
    /**
     * The id for this route, which can be used in the view for generating hrefs.
     */
    readonly id?: string | null;
    /**
     * The path to match against the url.
     *
     * If left blank, the path will be derived from the component's static `path` property (if it exists).
     */
    readonly path?: string | string[] | null;
    /**
     * The title to use for this route when matched.
     *
     * If left blank, this route will not contribute to the generated title.
     */
    readonly title?: string | ((node: RouteNode) => string | null) | null;
    /**
     * The path to which to redirect when the url matches the path in this config.
     */
    readonly redirectTo?: string | null;
    /**
     * Whether the `path` should be case sensitive.
     */
    readonly caseSensitive?: boolean;
    /**
     * How to behave when this component scheduled to be loaded again in the same viewport:
     *
     * - `replace`: completely removes the current component and creates a new one, behaving as if the component changed  (default if only the parameters have changed).
     * - `invoke-lifecycles`: calls `canUnload`, `canLoad`, `unloading` and `loading`.
     * - `none`: does nothing (default if nothing has changed for the viewport).
     */
    readonly transitionPlan?: TransitionPlanOrFunc | null;
    /**
     * The name of the viewport this component should be loaded into.
     */
    readonly viewport?: string | null;
    /**
     * Any custom data that should be accessible to matched components or hooks.
     */
    readonly data?: Record<string, unknown>;
    /**
     * The child routes that can be navigated to from this route. See `Routeable` for more information.
     */
    readonly routes?: readonly Routeable[];
    /**
     * When set, will be used to redirect unknown/unconfigured routes to this route.
     * Can be a route-id, route-path (route), or a custom element name; this is also the resolution/fallback order.
     */
    readonly fallback?: string | FallbackFunction | null;
    /**
     * When set to `false`, the routes won't be included in the navigation model.
     *
     * @default true
     */
    readonly nav?: boolean;
}
export interface IChildRouteConfig extends IRouteConfig {
    /**
     * The component to load when this route is matched.
     */
    readonly component: Routeable;
}
export interface IRedirectRouteConfig extends Pick<IRouteConfig, 'caseSensitive' | 'redirectTo' | 'path'> {
}
export type TransitionPlan = 'none' | 'replace' | 'invoke-lifecycles';
export type TransitionPlanOrFunc = TransitionPlan | ((current: RouteNode, next: RouteNode) => TransitionPlan);
export declare class RouteConfig implements IRouteConfig, IChildRouteConfig {
    readonly id: string;
    readonly title: string | ((node: RouteNode) => string | null) | null;
    readonly redirectTo: string | null;
    readonly caseSensitive: boolean;
    readonly transitionPlan: TransitionPlanOrFunc | null;
    readonly viewport: string;
    readonly data: Record<string, unknown>;
    readonly routes: readonly Routeable[];
    readonly fallback: string | FallbackFunction | null;
    readonly component: Routeable;
    readonly nav: boolean;
    get path(): string[];
    private constructor();
    getTransitionPlan(cur: RouteNode, next: RouteNode): TransitionPlan;
    register(container: IContainer): void;
}
export declare const Route: {
    name: string;
    /**
     * Returns `true` if the specified type has any static route configuration (either via static properties or a &#64;route decorator)
     */
    isConfigured(Type: RouteType): boolean;
    /**
     * Apply the specified configuration to the specified type, overwriting any existing configuration.
     */
    configure<T extends RouteType<Constructable>>(configOrPath: IRouteConfig | IChildRouteConfig | string | string[], Type: T): T;
    /**
     * Get the `RouteConfig` associated with the specified type, creating a new one if it does not yet exist.
     */
    getConfig(Type: RouteType): RouteConfig;
};
export type RouteType<T extends Constructable = Constructable> = ResourceType<T, InstanceType<T>, IRouteConfig>;
export type RouteDecorator = <T extends Constructable>(Type: T) => T;
/**
 * Associate a static route configuration with this type.
 *
 * @param config - The route config
 */
export declare function route(config: IRouteConfig): RouteDecorator;
/**
 * Associate a static route configuration with this type.
 *
 * @param path - The path to match against.
 *
 * (TODO: improve the formatting, better examples, etc)
 *
 * ```
 * &#64;route('home')
 * export class Home {}
 * ```
 *
 * ```
 * &#64;route(':id')
 * export class ProductDetail {}
 * ```
 */
export declare function route(path: string | string[]): RouteDecorator;
//# sourceMappingURL=route.d.ts.map