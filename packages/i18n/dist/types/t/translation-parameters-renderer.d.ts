import { IExpressionParser, IObserverLocator, type IsBindingBehavior } from '@aurelia/runtime';
import { BindingMode, CommandType, IHydratableController, IRenderer, AttrSyntax, IPlatform, IAttrMapper, ICommandBuildInfo } from '@aurelia/runtime-html';
import type { BindingCommandInstance } from '@aurelia/runtime-html';
export declare const TranslationParametersInstructionType = "tpt";
declare const attribute = "t-params.bind";
export declare class TranslationParametersAttributePattern {
    [attribute](rawName: string, rawValue: string, _parts: string[]): AttrSyntax;
}
export declare class TranslationParametersBindingInstruction {
    from: IsBindingBehavior;
    to: string;
    readonly type: string;
    mode: BindingMode.toView;
    constructor(from: IsBindingBehavior, to: string);
}
export declare class TranslationParametersBindingCommand implements BindingCommandInstance {
    readonly type: CommandType.None;
    get name(): string;
    build(info: ICommandBuildInfo, exprParser: IExpressionParser, attrMapper: IAttrMapper): TranslationParametersBindingInstruction;
}
export declare class TranslationParametersBindingRenderer implements IRenderer {
    target: typeof TranslationParametersInstructionType;
    render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: TranslationParametersBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
}
export {};
//# sourceMappingURL=translation-parameters-renderer.d.ts.map