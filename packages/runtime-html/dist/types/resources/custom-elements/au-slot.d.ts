import { IRenderLocation } from '../../dom';
import { IHydrationContext } from '../../templating/controller';
import { IRendering } from '../../templating/rendering';
import type { ControllerVisitor, ICustomElementController, ICustomElementViewModel, IHydratedController, IHydratedParentController, ISyntheticView } from '../../templating/controller';
import type { HydrateElementInstruction } from '../../renderer';
export declare class AuSlot implements ICustomElementViewModel {
    readonly view: ISyntheticView;
    readonly $controller: ICustomElementController<this>;
    expose: object | undefined;
    constructor(location: IRenderLocation, instruction: HydrateElementInstruction, hdrContext: IHydrationContext, rendering: IRendering);
    binding(_initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    attaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    detaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    exposeChanged(v: object): void;
    dispose(): void;
    accept(visitor: ControllerVisitor): void | true;
}
//# sourceMappingURL=au-slot.d.ts.map