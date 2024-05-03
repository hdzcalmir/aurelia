import { IExpressionParser, type IsBindingBehavior } from '@aurelia/expression-parser';
import { IObserverLocator } from '@aurelia/runtime';
import { IHydratableController, IPlatform } from '@aurelia/runtime-html';
import { AttrSyntax, IAttrMapper, type BindingCommandInstance, type ICommandBuildInfo, type IInstruction, type BindingCommandStaticAuDefinition } from '@aurelia/template-compiler';
import { IStore } from './interfaces';
export declare class StateAttributePattern {
    'PART.state'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
}
export declare class DispatchAttributePattern {
    'PART.dispatch'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
}
export declare class StateBindingCommand implements BindingCommandInstance {
    static readonly $au: BindingCommandStaticAuDefinition;
    get ignoreAttr(): boolean;
    build(info: ICommandBuildInfo, parser: IExpressionParser, attrMapper: IAttrMapper): IInstruction;
}
export declare class DispatchBindingCommand implements BindingCommandInstance {
    static readonly $au: BindingCommandStaticAuDefinition;
    get ignoreAttr(): boolean;
    build(info: ICommandBuildInfo): IInstruction;
}
export declare class StateBindingInstruction {
    from: string | IsBindingBehavior;
    to: string;
    readonly type = "sb";
    constructor(from: string | IsBindingBehavior, to: string);
}
export declare class DispatchBindingInstruction {
    from: string;
    ast: string | IsBindingBehavior;
    readonly type = "sd";
    constructor(from: string, ast: string | IsBindingBehavior);
}
export declare const StateBindingInstructionRenderer: {
    new (): {
        readonly target: "sb";
        /** @internal */ readonly _stateContainer: IStore<object, unknown>;
        render(renderingCtrl: IHydratableController, target: object, instruction: StateBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
    };
};
export declare const DispatchBindingInstructionRenderer: {
    new (): {
        readonly target: "sd";
        /** @internal */ readonly _stateContainer: IStore<object, unknown>;
        render(renderingCtrl: IHydratableController, target: HTMLElement, instruction: DispatchBindingInstruction, platform: IPlatform, exprParser: IExpressionParser): void;
    };
};
//# sourceMappingURL=state-templating.d.ts.map