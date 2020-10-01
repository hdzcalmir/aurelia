import { CustomElementType } from '@aurelia/runtime';
import { IRoute, NavigationInstruction } from './interfaces';
import { IRouter } from './router';
import { ViewportInstruction } from './viewport-instruction';
import { IScopeOwner, IScopeOwnerOptions, NextContentAction, Scope } from './scope';
import { Navigation } from './navigation';
import { IConnectedCustomElement } from './resources/viewport';
import { NavigationCoordinator } from './navigation-coordinator';
export interface IViewportScopeOptions extends IScopeOwnerOptions {
    catches?: string | string[];
    collection?: boolean;
    source?: unknown[] | null;
}
export declare class ViewportScope implements IScopeOwner {
    name: string;
    readonly router: IRouter;
    connectedCE: IConnectedCustomElement | null;
    rootComponentType: CustomElementType | null;
    options: IViewportScopeOptions;
    connectedScope: Scope;
    path: string | null;
    content: ViewportInstruction | null;
    nextContent: ViewportInstruction | null;
    available: boolean;
    sourceItem: unknown | null;
    sourceItemIndex: number;
    private remove;
    private add;
    constructor(name: string, router: IRouter, connectedCE: IConnectedCustomElement | null, owningScope: Scope | null, scope: boolean, rootComponentType?: CustomElementType | null, // temporary. Metadata will probably eliminate it
    options?: IViewportScopeOptions);
    get scope(): Scope;
    get owningScope(): Scope;
    get enabled(): boolean;
    set enabled(enabled: boolean);
    get isViewport(): boolean;
    get isViewportScope(): boolean;
    get isEmpty(): boolean;
    get passThroughScope(): boolean;
    get siblings(): ViewportScope[];
    get source(): unknown[] | null;
    get catches(): string[];
    get default(): string | undefined;
    get nextContentActivated(): boolean;
    get parentNextContentActivated(): boolean;
    get nextContentAction(): NextContentAction;
    toString(): string;
    setNextContent(viewportInstruction: ViewportInstruction, navigation: Navigation): NextContentAction;
    transition(coordinator: NavigationCoordinator): void;
    canUnload(): boolean | Promise<boolean>;
    canLoad(): boolean | NavigationInstruction | NavigationInstruction[] | Promise<boolean | NavigationInstruction | NavigationInstruction[]>;
    unload(): void | Promise<void>;
    load(): void | Promise<void>;
    finalizeContentChange(): void;
    abortContentChange(): Promise<void>;
    acceptSegment(segment: string): boolean;
    beforeBind(): void;
    beforeUnbind(): void;
    getAvailableSourceItem(): unknown | null;
    addSourceItem(): unknown;
    removeSourceItem(): void;
    getRoutes(): IRoute[] | null;
}
//# sourceMappingURL=viewport-scope.d.ts.map