import { type ICustomElementController } from '@aurelia/runtime-html';
import type { IViewport } from './resources/viewport';
import type { IRouteContext } from './route-context';
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
    toString(): string;
}
//# sourceMappingURL=viewport-agent.d.ts.map