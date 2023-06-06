import { Constructable } from '@aurelia/kernel';
import { IHydratedController } from '../../templating/controller';
/**
 * An optional interface describing the dialog activate convention.
 */
export interface IDynamicComponentActivate<T> {
    /**
     * Implement this hook if you want to perform custom logic just before the component is is composed.
     * The returned value is not used.
     */
    activate?(model?: T): unknown | Promise<unknown>;
}
type ChangeSource = keyof Pick<AuCompose, 'template' | 'component' | 'model' | 'scopeBehavior'>;
export declare class AuCompose {
    template?: string | Promise<string>;
    component?: Constructable | object | Promise<Constructable | object>;
    model?: unknown;
    /**
     * Control scoping behavior of the view created by the au-compose.
     * This only affects template-only composition. Does not have effects on custom element composition.
     *
     * auto = inherit parent scope
     * scoped = do not inherit parent scope
     */
    scopeBehavior: 'auto' | 'scoped';
    get pending(): Promise<void> | void;
    get composition(): ICompositionController | undefined;
    attaching(initiator: IHydratedController, _parent: IHydratedController): void | Promise<void>;
    detaching(initiator: IHydratedController): void | Promise<void>;
}
export interface ICompositionController {
    readonly controller: IHydratedController;
    readonly context: CompositionContext;
    activate(initiator?: IHydratedController): void | Promise<void>;
    deactivate(detachInitator?: IHydratedController): void | Promise<void>;
    update(model: unknown): void | Promise<void>;
}
declare class LoadedChangeInfo {
    readonly _template: string | undefined;
    readonly _component: Constructable | object | undefined;
    readonly _model: unknown | undefined;
    readonly _src: ChangeSource | undefined;
    constructor(_template: string | undefined, _component: Constructable | object | undefined, _model: unknown | undefined, _src: ChangeSource | undefined);
}
declare class CompositionContext {
    readonly id: number;
    readonly change: LoadedChangeInfo;
    constructor(id: number, change: LoadedChangeInfo);
}
export {};
//# sourceMappingURL=au-compose.d.ts.map