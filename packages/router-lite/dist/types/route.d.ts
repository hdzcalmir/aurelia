import { Constructable, ResourceType } from '@aurelia/kernel';
import type { RouteNode } from './route-tree';
import type { FallbackFunction, IChildRouteConfig, IRouteConfig, Routeable, TransitionPlanOrFunc } from './options';
export declare const noRoutes: RouteConfig["routes"];
export declare class RouteConfig implements IRouteConfig, IChildRouteConfig {
    readonly id: string;
    readonly title: string | ((node: RouteNode) => string | null) | null;
    readonly redirectTo: string | null;
    readonly caseSensitive: boolean;
    readonly transitionPlan: TransitionPlanOrFunc | null;
    readonly viewport: string;
    readonly data: Record<string, unknown>;
    readonly routes: readonly Routeable[];
    readonly fallback: Routeable | FallbackFunction | null;
    readonly component: Routeable;
    readonly nav: boolean;
    get path(): string[];
    private constructor();
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
    configure<T extends RouteType>(configOrPath: IRouteConfig | IChildRouteConfig | string | string[], Type: T): T;
    /**
     * Get the `RouteConfig` associated with the specified type, creating a new one if it does not yet exist.
     */
    getConfig(Type: RouteType): RouteConfig;
};
export type RouteType<T extends Constructable = Constructable> = ResourceType<T, InstanceType<T>, IRouteConfig>;
export type RouteDecorator = <T extends Constructable>(Type: T, context: ClassDecoratorContext<T>) => T;
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