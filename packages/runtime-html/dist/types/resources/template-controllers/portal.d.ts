import { IRenderLocation } from '../../dom';
import { IPlatform } from '../../platform';
import { IViewFactory } from '../../templating/view';
import type { LifecycleFlags, ControllerVisitor, ICustomAttributeController, ICustomAttributeViewModel, IHydratedController, IHydratedParentController, ISyntheticView } from '../../templating/controller';
export declare type PortalTarget = string | Element | null | undefined;
export declare type PortalLifecycleCallback = (target: PortalTarget, view: ISyntheticView) => void | Promise<void>;
export declare class Portal implements ICustomAttributeViewModel {
    static inject: (import("@aurelia/kernel").InterfaceSymbol<IPlatform> | import("@aurelia/kernel").InterfaceSymbol<IViewFactory> | import("@aurelia/kernel").InterfaceSymbol<IRenderLocation<ChildNode>>)[];
    readonly $controller: ICustomAttributeController<this>;
    target: PortalTarget;
    position: InsertPosition;
    renderContext: PortalTarget;
    strict: boolean;
    deactivating?: PortalLifecycleCallback;
    activating?: PortalLifecycleCallback;
    deactivated?: PortalLifecycleCallback;
    activated?: PortalLifecycleCallback;
    callbackContext: unknown;
    view: ISyntheticView;
    constructor(factory: IViewFactory, originalLoc: IRenderLocation, p: IPlatform);
    attaching(initiator: IHydratedController, parent: IHydratedParentController, flags: LifecycleFlags): void | Promise<void>;
    detaching(initiator: IHydratedController, parent: IHydratedParentController, flags: LifecycleFlags): void | Promise<void>;
    targetChanged(): void;
    positionChanged(): void;
    dispose(): void;
    accept(visitor: ControllerVisitor): void | true;
}
//# sourceMappingURL=portal.d.ts.map