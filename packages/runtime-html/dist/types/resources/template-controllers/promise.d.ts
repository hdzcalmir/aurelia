import { Scope } from '@aurelia/runtime';
import { INode } from '../../dom';
import { IInstruction } from '../../renderer';
import { ICustomAttributeController, ICustomAttributeViewModel, IHydratableController, IHydratedController, IHydratedParentController, ISyntheticView } from '../../templating/controller';
import { AttrSyntax } from '../attribute-pattern';
export declare class PromiseTemplateController implements ICustomAttributeViewModel {
    readonly $controller: ICustomAttributeController<this>;
    private view;
    value: Promise<unknown>;
    pending?: PendingTemplateController;
    fulfilled?: FulfilledTemplateController;
    rejected?: RejectedTemplateController;
    private viewScope;
    private preSettledTask;
    private postSettledTask;
    private postSettlePromise;
    link(_controller: IHydratableController, _childController: ICustomAttributeController, _target: INode, _instruction: IInstruction): void;
    attaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    valueChanged(_newValue: boolean, _oldValue: boolean): void;
    private swap;
    detaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    dispose(): void;
}
export declare class PendingTemplateController implements ICustomAttributeViewModel {
    readonly $controller: ICustomAttributeController<this>;
    value: Promise<unknown>;
    view: ISyntheticView | undefined;
    link(controller: IHydratableController, _childController: ICustomAttributeController, _target: INode, _instruction: IInstruction): void;
    activate(initiator: IHydratedController | null, scope: Scope): void | Promise<void>;
    deactivate(_initiator: IHydratedController | null): void | Promise<void>;
    detaching(initiator: IHydratedController): void | Promise<void>;
    dispose(): void;
}
export declare class FulfilledTemplateController implements ICustomAttributeViewModel {
    readonly $controller: ICustomAttributeController<this>;
    value: unknown;
    view: ISyntheticView | undefined;
    link(controller: IHydratableController, _childController: ICustomAttributeController, _target: INode, _instruction: IInstruction): void;
    activate(initiator: IHydratedController | null, scope: Scope, resolvedValue: unknown): void | Promise<void>;
    deactivate(_initiator: IHydratedController | null): void | Promise<void>;
    detaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    dispose(): void;
}
export declare class RejectedTemplateController implements ICustomAttributeViewModel {
    readonly $controller: ICustomAttributeController<this>;
    value: unknown;
    view: ISyntheticView | undefined;
    link(controller: IHydratableController, _childController: ICustomAttributeController, _target: INode, _instruction: IInstruction): void;
    activate(initiator: IHydratedController | null, scope: Scope, error: unknown): void | Promise<void>;
    deactivate(_initiator: IHydratedController | null): void | Promise<void>;
    detaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    dispose(): void;
}
export declare class PromiseAttributePattern {
    'promise.resolve'(name: string, value: string, _parts: string[]): AttrSyntax;
}
export declare class FulfilledAttributePattern {
    'then'(name: string, value: string, _parts: string[]): AttrSyntax;
}
export declare class RejectedAttributePattern {
    'catch'(name: string, value: string, _parts: string[]): AttrSyntax;
}
//# sourceMappingURL=promise.d.ts.map