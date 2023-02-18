import { LifecycleFlags, type IHydratedController, type ICustomElementController } from '@aurelia/runtime-html';
import type { IViewport } from './resources/viewport';
import { type RouteNode } from './route-tree';
import type { IRouteContext } from './route-context';
import type { NavigationOptions } from './options';
import type { Transition } from './router';
import { Batch } from './util';
export declare class ViewportRequest {
    readonly viewportName: string;
    readonly componentName: string;
    constructor(viewportName: string, componentName: string);
    toString(): string;
}
export declare class ViewportAgent {
    readonly viewport: IViewport;
    readonly hostController: ICustomElementController;
    readonly ctx: IRouteContext;
    private readonly logger;
    private isActive;
    private curCA;
    private nextCA;
    private get $state();
    private state;
    private get currState();
    private set currState(value);
    private get nextState();
    private set nextState(value);
    private $plan;
    private currNode;
    private nextNode;
    private currTransition;
    constructor(viewport: IViewport, hostController: ICustomElementController, ctx: IRouteContext);
    static for(viewport: IViewport, ctx: IRouteContext): ViewportAgent;
    activateFromViewport(initiator: IHydratedController, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    deactivateFromViewport(initiator: IHydratedController, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    handles(req: ViewportRequest): boolean;
    isAvailable(): boolean;
    canUnload(tr: Transition, b: Batch): void;
    canLoad(tr: Transition, b: Batch): void;
    unloading(tr: Transition, b: Batch): void;
    loading(tr: Transition, b: Batch): void;
    deactivate(initiator: IHydratedController | null, tr: Transition, b: Batch): void;
    activate(initiator: IHydratedController | null, tr: Transition, b: Batch): void;
    swap(tr: Transition, b: Batch): void;
    private processDynamicChildren;
    scheduleUpdate(options: NavigationOptions, next: RouteNode): void;
    cancelUpdate(): void;
    endTransition(): void;
    toString(): string;
    dispose(): void;
    private unexpectedState;
}
//# sourceMappingURL=viewport-agent.d.ts.map