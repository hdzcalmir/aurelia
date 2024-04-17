import { BindingBehaviorExpression } from '@aurelia/expression-parser';
import { IBinding } from '@aurelia/runtime-html';
export declare const Signals: {
    readonly I18N_EA_CHANNEL: "i18n:locale:changed";
    readonly I18N_SIGNAL: "aurelia-translation-signal";
    readonly RT_SIGNAL: "aurelia-relativetime-signal";
};
export type BindingWithBehavior = IBinding & {
    ast: BindingBehaviorExpression;
};
export declare function createIntlFormatValueConverterExpression(name: string, binding: BindingWithBehavior): void;
//# sourceMappingURL=utils.d.ts.map