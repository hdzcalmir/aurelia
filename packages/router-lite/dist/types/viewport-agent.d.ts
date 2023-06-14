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
    private constructor();
    static for(viewport: IViewport, ctx: IRouteContext): ViewportAgent;
    toString(): string;
}
export declare const enum State {
    curr = 16256,
    currIsEmpty = 8192,
    currIsActive = 4096,
    currCanUnload = 2048,
    currCanUnloadDone = 1024,
    currUnload = 512,
    currUnloadDone = 256,
    currDeactivate = 128,
    next = 127,
    nextIsEmpty = 64,
    nextIsScheduled = 32,
    nextCanLoad = 16,
    nextCanLoadDone = 8,
    nextLoad = 4,
    nextLoadDone = 2,
    nextActivate = 1,
    bothAreEmpty = 8256
}
//# sourceMappingURL=viewport-agent.d.ts.map