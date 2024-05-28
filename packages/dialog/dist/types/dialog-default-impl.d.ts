import { IDialogDomRenderer, IDialogDom, IDialogGlobalSettings, IDialogLoadedSettings, IDialogDomAnimator } from './dialog-interfaces';
import { IContainer } from '@aurelia/kernel';
export declare class DefaultDialogGlobalSettings implements IDialogGlobalSettings {
    static register(container: IContainer): void;
    lock: boolean;
    startingZIndex: number;
    rejectOnCancel: boolean;
}
export declare class DefaultDialogDomRenderer implements IDialogDomRenderer {
    static register(container: IContainer): void;
    private readonly p;
    private readonly overlayCss;
    private readonly wrapperCss;
    private readonly hostCss;
    render(dialogHost: HTMLElement, settings: IDialogLoadedSettings): IDialogDom;
}
export declare class DefaultDialogDom implements IDialogDom {
    readonly wrapper: HTMLElement;
    readonly overlay: HTMLElement;
    readonly contentHost: HTMLElement;
    constructor(wrapper: HTMLElement, overlay: HTMLElement, contentHost: HTMLElement, animator?: IDialogDomAnimator);
    show(): void | Promise<void> | undefined;
    hide(): void | Promise<void>;
    dispose(): void;
}
//# sourceMappingURL=dialog-default-impl.d.ts.map