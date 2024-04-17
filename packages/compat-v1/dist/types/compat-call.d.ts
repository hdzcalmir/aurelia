import { type IContainer, type IServiceLocator } from '@aurelia/kernel';
import { IAccessor, IObserverLocator, IObserverLocatorBasedConnectable } from '@aurelia/runtime';
import { type BindingCommandInstance, ICommandBuildInfo, IController, IHydratableController, IInstruction, IPlatform, type IAstEvaluator, type IBinding, Scope } from '@aurelia/runtime-html';
import { BindingCommandStaticAuDefinition } from '@aurelia/runtime-html/dist/types/resources/binding-command';
import { IExpressionParser, IsBindingBehavior } from '@aurelia/expression-parser';
export declare const callSyntax: {
    register(container: IContainer): void;
};
export declare class CallBindingInstruction {
    from: string | IsBindingBehavior;
    to: string;
    readonly type = "rh";
    constructor(from: string | IsBindingBehavior, to: string);
}
export declare class CallBindingCommand implements BindingCommandInstance {
    static readonly $au: BindingCommandStaticAuDefinition;
    get ignoreAttr(): boolean;
    build(info: ICommandBuildInfo, exprParser: IExpressionParser): IInstruction;
}
export declare const CallBindingRenderer: {
    new (): {
        readonly target: "rh";
        render(renderingCtrl: IHydratableController, target: IController, instruction: CallBindingInstruction, platform: IPlatform, exprParser: IExpressionParser, observerLocator: IObserverLocator): void;
    };
};
/**
 * A binding for handling .call syntax
 */
export interface CallBinding extends IAstEvaluator, IObserverLocatorBasedConnectable, IServiceLocator {
}
export declare class CallBinding implements IBinding {
    ast: IsBindingBehavior;
    readonly target: object;
    readonly targetProperty: string;
    isBound: boolean;
    targetObserver: IAccessor;
    constructor(locator: IServiceLocator, observerLocator: IObserverLocator, ast: IsBindingBehavior, target: object, targetProperty: string);
    callSource(args: object): unknown;
    bind(_scope: Scope): void;
    unbind(): void;
}
//# sourceMappingURL=compat-call.d.ts.map