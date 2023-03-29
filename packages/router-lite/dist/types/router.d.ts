import { IContainer, ILogger } from '@aurelia/kernel';
import { CustomElementDefinition, IPlatform } from '@aurelia/runtime-html';
import { IRouteContext } from './route-context';
import { IRouterEvents, ManagedState, RoutingTrigger } from './router-events';
import { ILocationManager } from './location-manager';
import { RouteConfig, RouteType } from './route';
import { IRouteViewModel } from './component-agent';
import { RouteTree } from './route-tree';
import { IViewportInstruction, NavigationInstruction, RouteContextLike, ViewportInstructionTree } from './instructions';
import { UnwrapPromise } from './util';
import { type ViewportAgent } from './viewport-agent';
import { INavigationOptions, NavigationOptions, type RouterOptions } from './options';
export declare function isManagedState(state: {} | null): state is ManagedState;
export declare function toManagedState(state: {} | null, navId: number): ManagedState;
export declare class Transition {
    readonly id: number;
    readonly prevInstructions: ViewportInstructionTree;
    readonly instructions: ViewportInstructionTree;
    finalInstructions: ViewportInstructionTree;
    readonly instructionsChanged: boolean;
    readonly trigger: RoutingTrigger;
    readonly options: NavigationOptions;
    readonly managedState: ManagedState | null;
    readonly previousRouteTree: RouteTree;
    routeTree: RouteTree;
    readonly promise: Promise<boolean> | null;
    readonly resolve: ((success: boolean) => void) | null;
    readonly reject: ((err: unknown) => void) | null;
    guardsResult: boolean | ViewportInstructionTree;
    error: unknown;
    get erredWithUnknownRoute(): boolean;
    private constructor();
    static create(input: Omit<Transition, 'run' | 'handleError' | 'erredWithUnknownRoute'>): Transition;
    run<T>(cb: () => T, next: (value: UnwrapPromise<T>) => void): void;
    handleError(err: unknown): void;
    toString(): string;
}
export interface IRouter extends Router {
}
export declare const IRouter: import("@aurelia/kernel").InterfaceSymbol<IRouter>;
export declare class Router {
    private readonly container;
    private readonly p;
    private readonly logger;
    private readonly events;
    private readonly locationMgr;
    readonly options: Readonly<RouterOptions>;
    private _ctx;
    private get ctx();
    private _routeTree;
    get routeTree(): RouteTree;
    private _currentTr;
    get currentTr(): Transition;
    private set currentTr(value);
    private navigated;
    private navigationId;
    private instructions;
    private nextTr;
    private locationChangeSubscription;
    private _isNavigating;
    get isNavigating(): boolean;
    constructor(container: IContainer, p: IPlatform, logger: ILogger, events: IRouterEvents, locationMgr: ILocationManager, options: Readonly<RouterOptions>);
    /**
     * Get the closest RouteContext relative to the provided component, controller or node.
     *
     * @param context - The object from which to resolve the closest RouteContext.
     *
     * @returns when the value is:
     * - `null`: the root
     * - `IRouteContext`: the provided value (no-op)
     * - `HTMLElement`: the context of the routeable component (page) that directly or indirectly contains this element.
     * - `ICustomElementViewModel` (the `this` object when working from inside a view model): the context of this component (if it was loaded as a route), or the routeable component (page) directly or indirectly containing it.
     * - `ICustomElementController`: same as `ICustomElementViewModel`, but using the controller object instead of the view model object (advanced users).
     */
    resolveContext(context: RouteContextLike | null): IRouteContext;
    start(performInitialNavigation: boolean): void | Promise<boolean>;
    stop(): void;
    /**
     * Loads the provided path.
     *
     * Examples:
     *
     * ```ts
     * // Load the route 'product-detail', as a child of the current component, with child route '37'.
     * router.load('product-detail/37', { context: this });
     * ```
     */
    load(path: string, options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided paths as siblings.
     *
     * Examples:
     *
     * ```ts
     * router.load(['category/50/product/20', 'widget/30']);
     * ```
     */
    load(paths: readonly string[], options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided component type. Must be a custom element.
     *
     * Examples:
     *
     * ```ts
     * router.load(ProductList);
     * router.load(CustomElement.define({ name: 'greeter', template: 'Hello!' }));
     * ```
     */
    load(componentType: RouteType, options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided component types. Must be custom elements.
     *
     * Examples:
     *
     * ```ts
     * router.load([MemberList, OrganizationList]);
     * ```
     */
    load(componentTypes: readonly RouteType[], options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided component instance.
     *
     * Examples:
     *
     * ```ts
     * // Given an already defined custom element named Greeter
     * const greeter = new Greeter();
     * Controller.$el(container, greeter, host);
     * router.load(greeter);
     * ```
     */
    load(componentInstance: IRouteViewModel, options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided ViewportInstruction, with component specified in any of the ways as described
     * in the other method overloads, and optional additional properties.
     *
     * Examples:
     *
     * ```ts
     * router.load({ component: 'product-detail', parameters: { id: 37 } })
     * router.load({ component: ProductDetail, parameters: { id: 37 } })
     * router.load({ component: 'category', children: ['product(id=20)'] })
     * router.load({ component: 'category', children: [{ component: 'product', parameters: { id: 20 } }] })
     * ```
     */
    load(viewportInstruction: IViewportInstruction, options?: INavigationOptions): boolean | Promise<boolean>;
    load(instructionOrInstructions: NavigationInstruction | readonly NavigationInstruction[], options?: INavigationOptions): boolean | Promise<boolean>;
    isActive(instructionOrInstructions: NavigationInstruction | readonly NavigationInstruction[], context: RouteContextLike): boolean;
    private readonly vpaLookup;
    /**
     * Retrieve the RouteContext, which contains statically configured routes combined with the customElement metadata associated with a type.
     *
     * The customElement metadata is lazily associated with a type via the RouteContext the first time `getOrCreate` is called.
     *
     * @param viewportAgent - The ViewportAgent hosting the component associated with this RouteContext. If the RouteContext for the component+viewport combination already exists, the ViewportAgent will be updated in case it changed.
     * @param componentDefinition - The custom element definition.
     * @param container - The `controller.container` of the component hosting the viewport that the route will be loaded into.
     *
     */
    getRouteContext(viewportAgent: ViewportAgent | null, componentDefinition: CustomElementDefinition, componentInstance: IRouteViewModel | null, container: IContainer, parentRouteConfig: RouteConfig | null, parentContext: IRouteContext | null, $rdConfig: RouteConfig | null): IRouteContext | Promise<IRouteContext>;
    createViewportInstructions(instructionOrInstructions: NavigationInstruction | readonly NavigationInstruction[], options?: INavigationOptions): ViewportInstructionTree;
    /**
     * Enqueue an instruction tree to be processed as soon as possible.
     *
     * Will wait for any existing in-flight transition to finish, otherwise starts immediately.
     *
     * @param instructions - The instruction tree that determines the transition
     * @param trigger - `'popstate'` or `'hashchange'` if initiated by a browser event, or `'api'` for manually initiated transitions via the `load` api.
     * @param state - The state to restore, if any.
     * @param failedTr - If this is a redirect / fallback from a failed transition, the previous transition is passed forward to ensure the original promise resolves with the latest result.
     */
    private enqueue;
    private run;
    updateTitle(tr?: Transition): string;
    private cancelNavigation;
    private runNextTransition;
}
//# sourceMappingURL=router.d.ts.map