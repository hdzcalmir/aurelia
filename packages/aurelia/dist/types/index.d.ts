import { IContainer } from '@aurelia/kernel';
import { Aurelia as $Aurelia, IPlatform, IAppRoot, CustomElementType, IHydratedParentController, ICustomElementViewModel } from '@aurelia/runtime-html';
import { BrowserPlatform } from '@aurelia/platform-browser';
import type { ISinglePageApp, IEnhancementConfig } from '@aurelia/runtime-html';
export declare const PLATFORM: BrowserPlatform<typeof globalThis>;
export { IPlatform };
export declare class Aurelia extends $Aurelia {
    constructor(container?: IContainer);
    static start(root: IAppRoot | undefined): void | Promise<void>;
    static app(config: ISinglePageApp | CustomElementType): Omit<Aurelia, 'register' | 'app' | 'enhance'>;
    static enhance<T extends ICustomElementViewModel>(config: IEnhancementConfig<T>, parentController?: IHydratedParentController): ReturnType<$Aurelia['enhance']>;
    static register(...params: readonly unknown[]): Aurelia;
    app(config: ISinglePageApp | CustomElementType): Omit<this, 'register' | 'app' | 'enhance'>;
}
export default Aurelia;
export { type Interceptor, json, HttpClientConfiguration, HttpClient, IHttpClient, } from '@aurelia/fetch-client';
export { Metadata, } from '@aurelia/metadata';
export { type ITask, Platform, type QueueTaskOptions, Task, TaskAbortError, TaskQueue, type TaskStatus } from '@aurelia/platform';
export { all, DI, IContainer, inject, resolve, type IRegistration, type IRegistry, type IResolver, IServiceLocator, type Key, lazy, optional, Registration, singleton, transient, InstanceProvider, type Resolved, type Class, type Constructable, type ConstructableClass, type IDisposable, type IIndexable, type ColorOptions, ILogger, ConsoleSink, LoggerConfiguration, emptyArray, emptyObject, noop, LogLevel, EventAggregator, IEventAggregator, isArrayIndex, camelCase, kebabCase, pascalCase, toArray, bound, } from '@aurelia/kernel';
export { type CollectionKind, batch, ComputedObserver, IObserverLocator, ISignaler, subscriberCollection, type BindingBehaviorInstance, observable, type ValueConverterInstance, type IndexMap, } from '@aurelia/runtime';
export { customAttribute, CustomAttribute, templateController, containerless, customElement, CustomElement, capture, useShadowDOM, AppTask, BindingMode, bindable, type PartialBindableDefinition, Bindable, coercer, PartialChildrenDefinition, children, Controller, ViewFactory, IAppRoot, INode, IEventTarget, IRenderLocation, type ICustomAttributeViewModel, type ICustomElementViewModel, IFlushQueue, FlushQueue, IFlushable, renderer, IAurelia, NodeObserverLocator, IAuSlot, IAuSlotsInfo, AuSlotsInfo, IAuSlotWatcher, slotted, ChildrenBinding, ITemplateCompiler, ITemplateCompilerHooks, TemplateCompilerHooks, templateCompilerHooks, attributePattern, IAttributePattern, IAttrMapper, alias, registerAliases, bindingBehavior, BindingBehavior, valueConverter, ValueConverter, bindingCommand, type BindingCommandInstance, type IEnhancementConfig, type IHydratedParentController, ShortHandBindingSyntax, StyleConfiguration, type IShadowDOMConfiguration, cssModules, shadowCSS, ILifecycleHooks, type LifecycleHook, LifecycleHooks, lifecycleHooks, } from '@aurelia/runtime-html';
//# sourceMappingURL=index.d.ts.map