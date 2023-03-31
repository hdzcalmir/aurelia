import type { Params, RouteContextLike, ViewportInstructionTree } from './instructions';
import { TransitionPlan } from './route';
import type { RouteNode } from './route-tree';
import type { Transition } from './router';
export type HistoryStrategy = 'none' | 'replace' | 'push';
export type ValueOrFunc<T extends string> = T | ((instructions: ViewportInstructionTree) => T);
export declare const IRouterOptions: import("@aurelia/kernel").InterfaceSymbol<Readonly<RouterOptions>>;
export interface IRouterOptions extends Partial<RouterOptions> {
}
export declare class RouterOptions {
    readonly useUrlFragmentHash: boolean;
    readonly useHref: boolean;
    /**
     * The strategy to use for interacting with the browser's `history` object (if applicable).
     *
     * - `none`: do not interact with the `history` object at all.
     * - `replace`: replace the current state in history
     * - `push`: push a new state onto the history (default)
     * - A function that returns one of the 3 above values based on the navigation.
     *
     * Default: `push`
     */
    readonly historyStrategy: ValueOrFunc<HistoryStrategy>;
    /**
     * An optional handler to build the title.
     * When configured, the work of building the title string is completely handed over to this function.
     * If this function returns `null`, the title is not updated.
     */
    readonly buildTitle: ((transition: Transition) => string | null) | null;
    /**
     * When set to `false`, the navigation model won't be generated.
     * The default value is `true`.
     */
    readonly useNavigationModel: boolean;
    protected constructor(useUrlFragmentHash: boolean, useHref: boolean, 
    /**
     * The strategy to use for interacting with the browser's `history` object (if applicable).
     *
     * - `none`: do not interact with the `history` object at all.
     * - `replace`: replace the current state in history
     * - `push`: push a new state onto the history (default)
     * - A function that returns one of the 3 above values based on the navigation.
     *
     * Default: `push`
     */
    historyStrategy: ValueOrFunc<HistoryStrategy>, 
    /**
     * An optional handler to build the title.
     * When configured, the work of building the title string is completely handed over to this function.
     * If this function returns `null`, the title is not updated.
     */
    buildTitle: ((transition: Transition) => string | null) | null, 
    /**
     * When set to `false`, the navigation model won't be generated.
     * The default value is `true`.
     */
    useNavigationModel: boolean);
    static create(input: IRouterOptions): RouterOptions;
    toString(): string;
}
export interface INavigationOptions extends Partial<NavigationOptions> {
}
export declare class NavigationOptions implements INavigationOptions {
    /**
     * Same as `RouterOptions#historyStrategy`.
     */
    readonly historyStrategy: ValueOrFunc<HistoryStrategy>;
    readonly title: string | ((node: RouteNode) => string | null) | null;
    readonly titleSeparator: string;
    /**
     * Specify a context to use for relative navigation.
     *
     * - `null` (or empty): navigate relative to the root (absolute navigation)
     * - `IRouteContext`: navigate relative to specifically this RouteContext (advanced users).
     * - `HTMLElement`: navigate relative to the routeable component (page) that directly or indirectly contains this element.
     * - `ICustomElementViewModel` (the `this` object when working from inside a view model): navigate relative to this component (if it was loaded as a route), or the routeable component (page) directly or indirectly containing it.
     * - `ICustomElementController`: same as `ICustomElementViewModel`, but using the controller object instead of the view model object (advanced users).
     */
    readonly context: RouteContextLike | null;
    /**
     * Specify an object to be serialized to a query string, and then set to the query string of the new URL.
     */
    readonly queryParams: Params | null;
    /**
     * Specify the hash fragment for the new URL.
     */
    readonly fragment: string;
    /**
     * Specify any kind of state to be stored together with the history entry for this navigation.
     */
    readonly state: Params | null;
    readonly transitionPlan: TransitionPlan | null;
    private constructor();
    static create(routerOptions: RouterOptions, input: INavigationOptions): NavigationOptions;
    clone(): NavigationOptions;
}
//# sourceMappingURL=options.d.ts.map