import { registrableMetadataKey } from '@aurelia/kernel';
import { IObserverLocator } from '@aurelia/runtime';
import { IExpressionParser, type IsBindingBehavior } from '@aurelia/expression-parser';
import { IHydratableController, IPlatform } from '@aurelia/runtime-html';
import { AttrSyntax, type IAttrMapper, type ICommandBuildInfo, type BindingCommandInstance, type BindingCommandStaticAuDefinition } from '@aurelia/template-compiler';
import type { BindingMode } from '@aurelia/runtime-html';
export declare const TranslationParametersInstructionType = "tpt";
declare const attribute = "t-params.bind";
export declare class TranslationParametersAttributePattern {
    static [Symbol.metadata]: {
        [registrableMetadataKey]: import("@aurelia/kernel").IRegistry;
    };
    [attribute](rawName: string, rawValue: string): AttrSyntax;
}
export declare class TranslationParametersBindingInstruction {
    from: IsBindingBehavior;
    to: string;
    readonly type: string;
    mode: typeof BindingMode.toView;
    constructor(from: IsBindingBehavior, to: string);
}
export declare class TranslationParametersBindingCommand implements BindingCommandInstance {
    static readonly $au: BindingCommandStaticAuDefinition;
    readonly ignoreAttr = false;
    build(info: ICommandBuildInfo, exprParser: IExpressionParser, attrMapper: IAttrMapper): TranslationParametersBindingInstruction;
}
export declare const TranslationParametersBindingRenderer: {
    new (): {
        readonly target: "tpt";
        render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: TranslationParametersBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
    };
};
export {};
//# sourceMappingURL=translation-parameters-renderer.d.ts.map