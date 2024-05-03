import { IObserverLocator } from '@aurelia/runtime';
import { IExpressionParser, CustomExpression, IsBindingBehavior } from '@aurelia/expression-parser';
import { IHydratableController, IPlatform } from '@aurelia/runtime-html';
import { AttrSyntax, type IAttrMapper, type ICommandBuildInfo, type BindingCommandInstance } from '@aurelia/template-compiler';
import type { BindingMode } from '@aurelia/runtime-html';
export declare const TranslationInstructionType = "tt";
export declare class TranslationAttributePattern {
    [key: string]: ((rawName: string, rawValue: string, parts: readonly string[]) => AttrSyntax);
    static registerAlias(alias: string): void;
}
export declare class TranslationBindingInstruction {
    from: CustomExpression | IsBindingBehavior;
    to: string;
    readonly type: string;
    mode: typeof BindingMode.toView;
    constructor(from: CustomExpression | IsBindingBehavior, to: string);
}
export declare class TranslationBindingCommand implements BindingCommandInstance {
    readonly ignoreAttr = false;
    build(info: ICommandBuildInfo, parser: IExpressionParser, attrMapper: IAttrMapper): TranslationBindingInstruction;
}
export declare const TranslationBindingRenderer: {
    new (): {
        readonly target: "tt";
        render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: TranslationBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
    };
};
export declare const TranslationBindInstructionType = "tbt";
export declare class TranslationBindAttributePattern {
    [key: string]: ((rawName: string, rawValue: string, parts: readonly string[]) => AttrSyntax);
    static registerAlias(alias: string): void;
}
export declare class TranslationBindBindingInstruction {
    from: IsBindingBehavior;
    to: string;
    readonly type: string;
    mode: typeof BindingMode.toView;
    constructor(from: IsBindingBehavior, to: string);
}
export declare class TranslationBindBindingCommand implements BindingCommandInstance {
    readonly ignoreAttr = false;
    build(info: ICommandBuildInfo, exprParser: IExpressionParser, attrMapper: IAttrMapper): TranslationBindingInstruction;
}
export declare const TranslationBindBindingRenderer: {
    new (): {
        target: string;
        render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: TranslationBindBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
    };
};
//# sourceMappingURL=translation-renderer.d.ts.map