import { IDisposable, IServiceLocator } from '@aurelia/kernel';
import { State } from '../templating/controller';
import { Scope } from '@aurelia/runtime';
import { TaskQueue } from '@aurelia/platform';
/**
 * Mode of a binding to operate
 * - 1 / one time - bindings should only update the target once
 * - 2 / to view - bindings should update the target and observe the source for changes to update again
 * - 3 / from view - bindings should update the source and observe the target for changes to update again
 * - 6 / two way - bindings should observe both target and source for changes to update the other side
 * - 8 / default - undecided mode, bindings, depends on the circumstance, may decide what to do accordingly
 */
export declare const BindingMode: Readonly<{
    readonly oneTime: 1;
    readonly toView: 2;
    readonly fromView: 4;
    readonly twoWay: 6;
    /**
     * Unspecified mode, bindings may act differently with this mode
     */
    readonly default: 8;
}>;
export type BindingMode = typeof BindingMode[keyof typeof BindingMode];
export interface IBindingController {
    readonly state: State;
}
export interface IBinding {
    readonly isBound: boolean;
    bind(scope: Scope): void;
    unbind(): void;
    get: IServiceLocator['get'];
    useScope?(scope: Scope): void;
    limit?(opts: IRateLimitOptions): IDisposable;
}
export interface IRateLimitOptions {
    type: 'throttle' | 'debounce';
    delay: number;
    queue: TaskQueue;
    now: () => number;
    signals: string[];
}
//# sourceMappingURL=interfaces-bindings.d.ts.map