import { IContainer, IDisposable } from '@aurelia/kernel';
import { IDialogController, IDialogEventManager, IDialogDom } from './dialog-interfaces';
export declare class DefaultDialogEventManager implements IDialogEventManager {
    static register(container: IContainer): void;
    private readonly ctrls;
    private readonly w;
    add(controller: IDialogController, dom: IDialogDom): IDisposable;
}
//# sourceMappingURL=dialog-event-manager.d.ts.map