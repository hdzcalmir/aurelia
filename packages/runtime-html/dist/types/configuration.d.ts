import { IContainer } from '@aurelia/kernel';
import { DirtyChecker, ICoercionConfiguration } from '@aurelia/runtime';
import { AtPrefixedTriggerAttributePattern, ColonPrefixedBindAttributePattern, SpreadAttributePattern, DotSeparatedAttributePattern, RefAttributePattern, EventAttributePattern } from './resources/attribute-pattern';
import { OneTimeBindingCommand, TriggerBindingCommand } from './resources/binding-command';
import { TemplateCompiler } from './compiler/template-compiler';
import { CustomAttributeRenderer, CustomElementRenderer, InterpolationBindingRenderer, IteratorBindingRenderer, LetElementRenderer, PropertyBindingRenderer, RefBindingRenderer, SetPropertyRenderer, TemplateControllerRenderer, AttributeBindingRenderer, ListenerBindingRenderer, SetAttributeRenderer, StylePropertyBindingRenderer, TextBindingRenderer, SetClassAttributeRenderer, SetStyleAttributeRenderer, SpreadRenderer } from './renderer';
import { DebounceBindingBehavior } from './resources/binding-behaviors/debounce';
import { SignalBindingBehavior } from './resources/binding-behaviors/signals';
import { ThrottleBindingBehavior } from './resources/binding-behaviors/throttle';
import { AttrBindingBehavior } from './resources/binding-behaviors/attr';
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
import { NodeObserverLocator } from './observation/observer-locator';
/**
 * Default HTML-specific (but environment-agnostic) implementations for the following interfaces:
 * - `ITemplateCompiler`
 * - `ITargetAccessorLocator`
 * - `ITargetObserverLocator`
 */
export declare const DefaultComponents: (typeof NodeObserverLocator | typeof TemplateCompiler | typeof DirtyChecker)[];
/**
 * Default binding syntax for the following attribute name patterns:
 * - `ref`
 * - `target.command` (dot-separated)
 */
export declare const DefaultBindingSyntax: ({
    register(c: IContainer): void;
} | typeof DotSeparatedAttributePattern | typeof RefAttributePattern | typeof EventAttributePattern | typeof SpreadAttributePattern)[];
/**
 * Binding syntax for short-hand attribute name patterns:
 * - `@target` (short-hand for `target.trigger`)
 * - `:target` (short-hand for `target.bind`)
 */
export declare const ShortHandBindingSyntax: (typeof ColonPrefixedBindAttributePattern | typeof AtPrefixedTriggerAttributePattern)[];
/**
 * Default HTML-specific (but environment-agnostic) binding commands:
 * - Property observation: `.bind`, `.one-time`, `.from-view`, `.to-view`, `.two-way
 * - Collection observation: `.for`
 * - Event listeners: `.trigger`, `.capture`
 */
export declare const DefaultBindingLanguage: (typeof OneTimeBindingCommand | typeof TriggerBindingCommand)[];
/**
 * Default HTML-specific (but environment-agnostic) resources:
 * - Binding Behaviors: `oneTime`, `toView`, `fromView`, `twoWay`, `signal`, `debounce`, `throttle`, `attr`, `self`, `updateTrigger`
 * - Custom Elements: `au-compose`, `au-slot`
 * - Custom Attributes: `blur`, `focus`, `portal`
 * - Template controllers: `if`/`else`, `repeat`, `with`
 * - Value Converters: `sanitize`
 */
export declare const DefaultResources: (typeof DebounceBindingBehavior | typeof SignalBindingBehavior | typeof ThrottleBindingBehavior | typeof AttrBindingBehavior | typeof UpdateTriggerBindingBehavior | typeof Focus | typeof Show | typeof Portal | typeof If | typeof Else | typeof Repeat | typeof With | typeof Switch | typeof Case | typeof PromiseTemplateController | typeof PendingTemplateController | typeof FulfilledTemplateController | typeof RejectedTemplateController | typeof PromiseAttributePattern | typeof FulfilledAttributePattern | typeof RejectedAttributePattern | typeof AuCompose | typeof AuSlot | typeof SanitizeValueConverter)[];
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
export declare const DefaultRenderers: (typeof SetPropertyRenderer | typeof CustomElementRenderer | typeof CustomAttributeRenderer | typeof TemplateControllerRenderer | typeof LetElementRenderer | typeof RefBindingRenderer | typeof InterpolationBindingRenderer | typeof PropertyBindingRenderer | typeof IteratorBindingRenderer | typeof TextBindingRenderer | typeof ListenerBindingRenderer | typeof SetAttributeRenderer | typeof SetClassAttributeRenderer | typeof SetStyleAttributeRenderer | typeof StylePropertyBindingRenderer | typeof AttributeBindingRenderer | typeof SpreadRenderer)[];
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