import { IContainer } from '@aurelia/kernel';
import { ICoercionConfiguration } from '@aurelia/runtime';
import { DefaultBindingCommand, ForBindingCommand } from '@aurelia/template-compiler';
import { DebounceBindingBehavior } from './resources/binding-behaviors/debounce';
import { SignalBindingBehavior } from './resources/binding-behaviors/signals';
import { ThrottleBindingBehavior } from './resources/binding-behaviors/throttle';
import { AttrBindingBehavior } from './resources/binding-behaviors/attr';
import { SelfBindingBehavior } from './resources/binding-behaviors/self';
import { UpdateTriggerBindingBehavior } from './resources/binding-behaviors/update-trigger';
import { Focus } from './resources/custom-attributes/focus';
import { Show } from './resources/custom-attributes/show';
import { Portal } from './resources/template-controllers/portal';
import { Else, If } from './resources/template-controllers/if';
import { Repeat } from './resources/template-controllers/repeat';
import { With } from './resources/template-controllers/with';
import { Switch, Case } from './resources/template-controllers/switch';
import { PromiseTemplateController, PendingTemplateController, FulfilledTemplateController, RejectedTemplateController, PromiseAttributePattern, FulfilledAttributePattern, RejectedAttributePattern } from './resources/template-controllers/promise';
import { AuCompose } from './resources/custom-elements/au-compose';
import { AuSlot } from './resources/custom-elements/au-slot';
import { SanitizeValueConverter } from './resources/value-converters/sanitize';
/**
 * Default HTML-specific (but environment-agnostic) implementations for the following interfaces:
 * - `ITemplateCompiler`
 * - `ITargetAccessorLocator`
 * - `ITargetObserverLocator`
 */
export declare const DefaultComponents: import("@aurelia/kernel").IRegistry[];
/**
 * Default binding syntax for the following attribute name patterns:
 * - `ref`
 * - `target.command` (dot-separated)
 */
export declare const DefaultBindingSyntax: ({
    register(c: IContainer): void;
} | (new () => {
    ref(rawName: string, rawValue: string, _parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
    'PART.ref'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
}) | (new () => {
    'PART.PART'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
    'PART.PART.PART'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
}) | (new () => {
    '...$attrs'(rawName: string, rawValue: string, _parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
}) | (new () => {
    'PART.trigger:PART'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
    'PART.capture:PART'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
}))[];
/**
 * Binding syntax for short-hand attribute name patterns:
 * - `@target` (short-hand for `target.trigger`)
 * - `:target` (short-hand for `target.bind`)
 */
export declare const ShortHandBindingSyntax: ((new () => {
    '@PART'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
    '@PART:PART'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
}) | (new () => {
    ':PART'(rawName: string, rawValue: string, parts: readonly string[]): import("@aurelia/template-compiler").AttrSyntax;
}))[];
/**
 * Default HTML-specific (but environment-agnostic) binding commands:
 * - Property observation: `.bind`, `.one-time`, `.from-view`, `.to-view`, `.two-way
 * - Collection observation: `.for`
 * - Event listeners: `.trigger`, `.capture`
 */
export declare const DefaultBindingLanguage: (typeof DefaultBindingCommand | typeof ForBindingCommand)[];
/**
 * Default HTML-specific (but environment-agnostic) resources:
 * - Binding Behaviors: `oneTime`, `toView`, `fromView`, `twoWay`, `signal`, `debounce`, `throttle`, `attr`, `self`, `updateTrigger`
 * - Custom Elements: `au-compose`, `au-slot`
 * - Custom Attributes: `blur`, `focus`, `portal`
 * - Template controllers: `if`/`else`, `repeat`, `with`
 * - Value Converters: `sanitize`
 */
export declare const DefaultResources: (typeof DebounceBindingBehavior | typeof SignalBindingBehavior | typeof ThrottleBindingBehavior | typeof AttrBindingBehavior | typeof SelfBindingBehavior | typeof UpdateTriggerBindingBehavior | typeof Focus | typeof Show | typeof Portal | typeof If | typeof Else | typeof Repeat | typeof With | typeof Switch | typeof Case | typeof PromiseTemplateController | typeof PendingTemplateController | typeof FulfilledTemplateController | typeof RejectedTemplateController | typeof PromiseAttributePattern | typeof FulfilledAttributePattern | typeof RejectedAttributePattern | typeof AuCompose | typeof AuSlot | typeof SanitizeValueConverter)[];
/**
 * Default renderers for:
 * - PropertyBinding: `bind`, `one-time`, `to-view`, `from-view`, `two-way`
 * - IteratorBinding: `for`
 * - CallBinding: `call`
 * - RefBinding: `ref`
 * - InterpolationBinding: `${}`
 * - SetProperty
 * - `customElement` hydration
 * - `customAttribute` hydration
 * - `templateController` hydration
 * - `let` element hydration
 * - Listener Bindings: `trigger`, `capture`, `delegate`
 * - SetAttribute
 * - StyleProperty: `style`, `css`
 * - TextBinding: `${}`
 */
export declare const DefaultRenderers: ({
    new (): {
        readonly target: "re";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: import(".").IController<import(".").IViewModel>, instruction: import("@aurelia/template-compiler").SetPropertyInstruction): void;
    };
} | {
    new (): {
        readonly _rendering: import(".").IRendering;
        readonly target: "ra";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").HydrateElementInstruction<Record<PropertyKey, unknown>, import(".").CustomElementDefinition<import("@aurelia/kernel").Constructable>>, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly _rendering: import(".").IRendering;
        readonly target: "rb";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").HydrateAttributeInstruction<import(".").CustomAttributeDefinition<import("@aurelia/kernel").Constructable>>, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly _rendering: import(".").IRendering;
        readonly target: "rc";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").HydrateTemplateController<import(".").CustomAttributeDefinition<import("@aurelia/kernel").Constructable>>, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly target: "rd";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: Node & ChildNode, instruction: import("@aurelia/template-compiler").HydrateLetElementInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly target: "rj";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: import("./dom").INode, instruction: import("@aurelia/template-compiler").RefBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>): void;
    };
} | {
    new (): {
        readonly target: "rf";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: import(".").IController<import(".").IViewModel>, instruction: import("@aurelia/template-compiler").InterpolationInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly target: "rg";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: import(".").IController<import(".").IViewModel>, instruction: import("@aurelia/template-compiler").PropertyBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly target: "rk";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: import(".").IController<import(".").IViewModel>, instruction: import("@aurelia/template-compiler").IteratorBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly target: "ha";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: ChildNode, instruction: import("@aurelia/template-compiler").TextBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly target: "hb";
        readonly _modifierHandler: import("./binding/listener-binding").IEventModifier;
        readonly _defaultOptions: import("./renderer").IListenerBindingOptions;
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").ListenerBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>): void;
    };
} | {
    new (): {
        readonly target: "he";
        render(_: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").SetAttributeInstruction): void;
    };
} | {
    new (): {
        readonly target: "hf";
        render(_: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").SetClassAttributeInstruction): void;
    };
} | {
    new (): {
        readonly target: "hg";
        render(_: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").SetStyleAttributeInstruction): void;
    };
} | {
    new (): {
        readonly target: "hd";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").StylePropertyBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly target: "hc";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, instruction: import("@aurelia/template-compiler").AttributeBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
} | {
    new (): {
        readonly _compiler: import("@aurelia/template-compiler").ITemplateCompiler;
        readonly _rendering: import(".").IRendering;
        readonly target: "hs";
        render(renderingCtrl: import(".").IHydratableController<import(".").IViewModel>, target: HTMLElement, _instruction: import("@aurelia/template-compiler").SpreadBindingInstruction, platform: import("./platform").IPlatform, exprParser: import("@aurelia/expression-parser").IExpressionParser<import("@aurelia/expression-parser").CustomExpression>, observerLocator: import("@aurelia/runtime").IObserverLocator): void;
    };
})[];
export declare const StandardConfiguration: {
    optionsProvider: ConfigurationOptionsProvider;
    /**
     * Apply this configuration to the provided container.
     */
    register(container: IContainer): IContainer;
    customize(cb?: ConfigurationOptionsProvider): any;
};
export type ConfigurationOptionsProvider = (options: IRuntimeHtmlConfigurationOptions) => void;
interface IRuntimeHtmlConfigurationOptions {
    coercingOptions: ICoercionConfiguration;
}
export {};
//# sourceMappingURL=configuration.d.ts.map