import { IAppRoot } from './app-root';
import type { Constructable, IContainer, IDisposable } from '@aurelia/kernel';
export interface IAurelia extends Aurelia {
}
export declare const IAurelia: import("@aurelia/kernel").InterfaceSymbol<IAurelia>;
export declare class Aurelia implements IDisposable {
    readonly container: IContainer;
    get isRunning(): boolean;
    get isStarting(): boolean;
    get isStopping(): boolean;
    get root(): IAppRoot;
    private next;
    constructor(container?: IContainer);
    register(...params: unknown[]): this;
    app(config: ISinglePageAppConfig<object>): Omit<this, 'register' | 'app' | 'enhance'>;
    /**
     * @param parentController - The owning controller of the view created by this enhance call
     */
    enhance<T extends object>(config: IEnhancementConfig<T>): IAppRoot<T> | Promise<IAppRoot<T>>;
    waitForIdle(): Promise<void>;
    start(root?: IAppRoot | undefined): void | Promise<void>;
    stop(dispose?: boolean): void | Promise<void>;
    dispose(): void;
}
export interface ISinglePageAppConfig<T = unknown> {
    /**
     * The host element of the app
     */
    host: HTMLElement;
    /**
     * The root component of the app
     */
    component: T | Constructable<T>;
    /**
     * When a HTML form is submitted, the default behavior is to "redirect" the page to the action of the form
     * This is not desirable for SPA applications, so by default, this behavior is prevented.
     *
     * This option re-enables the default behavior of HTML forms.
     */
    allowActionlessForm?: boolean;
}
export interface IEnhancementConfig<T> {
    host: Element;
    /**
     * The binding context of the enhancement. Will be instantiate by DI if a constructor is given
     */
    component: T | Constructable<T>;
    /**
     * A predefined container for the enhanced view.
     */
    container?: IContainer;
    /**
     * When a HTML form is submitted, the default behavior is to "redirect" the page to the action of the form
     * This is not desirable for SPA applications, so by default, this behavior is prevented.
     *
     * This option re-enables the default behavior of HTML forms.
     */
    allowActionlessForm?: boolean;
}
//# sourceMappingURL=aurelia.d.ts.map