import { IRenderLocation } from '../../dom';
import { IHydrationContext } from '../../templating/controller';
import { IRendering } from '../../templating/rendering';
import type { ControllerVisitor, ICustomElementViewModel, IHydratedController, IHydratedParentController, ISyntheticView } from '../../templating/controller';
import type { HydrateElementInstruction } from '../../renderer';
import { type IAuSlot, type IAuSlotSubscriber } from '../../templating/controller.projection';
export declare class AuSlot implements ICustomElementViewModel, IAuSlot {
    readonly view: ISyntheticView;
    /**
     * The binding context that will be exposed to slotted content
     */
    expose: object | null;
    /**
     * A callback that will be called when the content of this slot changed
     */
    slotchange: ((name: string, nodes: readonly Node[]) => void) | null;
    constructor(location: IRenderLocation, instruction: HydrateElementInstruction, hdrContext: IHydrationContext, rendering: IRendering);
    readonly name: string;
    get nodes(): ChildNode[];
    subscribe(subscriber: IAuSlotSubscriber): void;
    unsubscribe(subscriber: IAuSlotSubscriber): void;
    binding(_initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    attaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    detaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    exposeChanged(v: object): void;
    dispose(): void;
    accept(visitor: ControllerVisitor): void | true;
}
//# sourceMappingURL=au-slot.d.ts.map