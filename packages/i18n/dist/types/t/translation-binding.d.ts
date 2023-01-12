import { IConnectableBinding, IAstEvaluator } from '@aurelia/runtime';
import { IPlatform, type IBindingController } from '@aurelia/runtime-html';
import i18next from 'i18next';
import type { IContainer, IServiceLocator } from '@aurelia/kernel';
import type { Scope, IsExpression, IExpressionParser, IObserverLocator } from '@aurelia/runtime';
import type { IHydratableController, INode } from '@aurelia/runtime-html';
import type { TranslationBindBindingInstruction, TranslationBindingInstruction } from './translation-renderer';
import type { TranslationParametersBindingInstruction } from './translation-parameters-renderer';
interface TranslationBindingCreationContext {
    parser: IExpressionParser;
    observerLocator: IObserverLocator;
    context: IContainer;
    controller: IHydratableController;
    target: HTMLElement;
    instruction: TranslationBindingInstruction | TranslationBindBindingInstruction | TranslationParametersBindingInstruction;
    platform: IPlatform;
    isParameterContext?: boolean;
}
export interface TranslationBinding extends IAstEvaluator, IConnectableBinding {
}
export declare class TranslationBinding implements IConnectableBinding {
    isBound: boolean;
    ast: IsExpression;
    private readonly i18n;
    target: HTMLElement;
    private parameter;
    /**
     * A semi-private property used by connectable mixin
     */
    readonly oL: IObserverLocator;
    constructor(controller: IBindingController, locator: IServiceLocator, observerLocator: IObserverLocator, platform: IPlatform, target: INode);
    static create({ parser, observerLocator, context, controller, target, instruction, platform, isParameterContext, }: TranslationBindingCreationContext): void;
    bind(_scope: Scope): void;
    unbind(): void;
    handleChange(newValue: string | i18next.TOptions, _previousValue: string | i18next.TOptions): void;
    handleLocaleChange(): void;
    useParameter(expr: IsExpression): void;
    updateTranslations(): void;
}
export {};
//# sourceMappingURL=translation-binding.d.ts.map