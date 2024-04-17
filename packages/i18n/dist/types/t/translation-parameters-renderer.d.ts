import { IObserverLocator } from '@aurelia/runtime';
import { IExpressionParser, type IsBindingBehavior } from '@aurelia/expression-parser';
import { IHydratableController, AttrSyntax, IPlatform, IAttrMapper, ICommandBuildInfo } from '@aurelia/runtime-html';
import type { BindingMode, BindingCommandInstance, BindingCommandStaticAuDefinition } from '@aurelia/runtime-html';
export declare const TranslationParametersInstructionType = "tpt";
export declare const TranslationParametersAttributePattern: {
    new (): {
        "t-params.bind"(rawName: string, rawValue: string): AttrSyntax;
    };
};
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
//# sourceMappingURL=translation-parameters-renderer.d.ts.map