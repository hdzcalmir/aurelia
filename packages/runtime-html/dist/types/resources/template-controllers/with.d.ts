import { IRenderLocation } from '../../dom';
import { IViewFactory } from '../../templating/view';
import type { ISyntheticView, ICustomAttributeController, ICustomAttributeViewModel, IHydratedController, IHydratedParentController, ControllerVisitor } from '../../templating/controller';
export declare class With implements ICustomAttributeViewModel {
    view: ISyntheticView;
    readonly $controller: ICustomAttributeController<this>;
    value?: object;
    constructor(factory: IViewFactory, location: IRenderLocation);
    valueChanged(newValue: unknown, _oldValue: unknown): void;
    attaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    detaching(initiator: IHydratedController, _parent: IHydratedParentController): void | Promise<void>;
    dispose(): void;
    accept(visitor: ControllerVisitor): void | true;
}
//# sourceMappingURL=with.d.ts.map