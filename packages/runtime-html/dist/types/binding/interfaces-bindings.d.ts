import { State } from '../templating/controller';
/**
 * Mode of a binding to operate
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
//# sourceMappingURL=interfaces-bindings.d.ts.map