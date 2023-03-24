import { ILogger } from '@aurelia/kernel';
import { ICustomElementViewModel, IHydratedController, ICompiledCustomElementController } from '@aurelia/runtime-html';
import { IRouteContext } from '../route-context';
import { type ViewportInstruction } from '../instructions';
import { type RouteNode } from '../route-tree';
export type FallbackFunction = (viewportInstruction: ViewportInstruction, routeNode: RouteNode, context: IRouteContext) => string | null;
export interface IViewport {
    readonly name: string;
    readonly usedBy: string;
    readonly default: string;
    readonly fallback: string | FallbackFunction;
}
export declare class ViewportCustomElement implements ICustomElementViewModel, IViewport {
    private readonly logger;
    private readonly ctx;
    name: string;
    usedBy: string;
    default: string;
    fallback: string | FallbackFunction;
    private agent;
    private controller;
    constructor(logger: ILogger, ctx: IRouteContext);
    hydrated(controller: ICompiledCustomElementController): void;
    attaching(initiator: IHydratedController, _parent: IHydratedController): void | Promise<void>;
    detaching(initiator: IHydratedController, _parent: IHydratedController): void | Promise<void>;
    dispose(): void;
    toString(): string;
}
//# sourceMappingURL=viewport.d.ts.map