import { DI, Registration } from '../../../@aurelia/kernel/dist/native-modules/index.mjs';
export { ConsoleSink, DI, EventAggregator, IContainer, IEventAggregator, ILogger, IServiceLocator, InstanceProvider, LogLevel, LoggerConfiguration, Registration, all, bound, camelCase, emptyArray, emptyObject, inject, isArrayIndex, kebabCase, lazy, noop, optional, pascalCase, resolve, singleton, toArray, transient } from '../../../@aurelia/kernel/dist/native-modules/index.mjs';
import { Aurelia as Aurelia$1, CustomElement, IPlatform, StandardConfiguration } from '../../../@aurelia/runtime-html/dist/native-modules/index.mjs';
export { AppTask, AuSlotsInfo, Bindable, BindingBehavior, BindingMode, ChildrenBinding, Controller, CustomAttribute, CustomElement, FlushQueue, IAppRoot, IAttrMapper, IAttributePattern, IAuSlotWatcher, IAuSlotsInfo, IAurelia, IEventModifier, IEventTarget, IFlushQueue, IKeyMapping, ILifecycleHooks, IModifiedEventHandlerCreator, INode, IPlatform, IRenderLocation, ITemplateCompiler, ITemplateCompilerHooks, LifecycleHooks, NodeObserverLocator, ShortHandBindingSyntax, StyleConfiguration, TemplateCompilerHooks, ValueConverter, ViewFactory, alias, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, cssModules, customAttribute, customElement, lifecycleHooks, processContent, registerAliases, renderer, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch } from '../../../@aurelia/runtime-html/dist/native-modules/index.mjs';
import { BrowserPlatform } from '../../../@aurelia/platform-browser/dist/native-modules/index.mjs';
export { HttpClient, HttpClientConfiguration, IFetchFn, IHttpClient, json } from '../../../@aurelia/fetch-client/dist/native-modules/index.mjs';
export { Metadata } from '../../../@aurelia/metadata/dist/native-modules/index.mjs';
export { Platform, Task, TaskAbortError, TaskQueue } from '../../../@aurelia/platform/dist/native-modules/index.mjs';
export { ComputedObserver, IObserverLocator, ISignaler, batch, observable, subscriberCollection } from '../../../@aurelia/runtime/dist/native-modules/index.mjs';

const PLATFORM = BrowserPlatform.getOrCreate(globalThis);
function createContainer() {
    return DI.createContainer()
        .register(Registration.instance(IPlatform, PLATFORM), StandardConfiguration);
}
class Aurelia extends Aurelia$1 {
    constructor(container = createContainer()) {
        super(container);
    }
    static start(root) {
        return new Aurelia().start(root);
    }
    static app(config) {
        return new Aurelia().app(config);
    }
    static enhance(config) {
        return new Aurelia().enhance(config);
    }
    static register(...params) {
        return new Aurelia().register(...params);
    }
    app(config) {
        if (CustomElement.isType(config)) {
            // Default to custom element element name
            const definition = CustomElement.getDefinition(config);
            let host = document.querySelector(definition.name);
            if (host === null) {
                // When no target is found, default to body.
                // For example, when user forgot to write <my-app></my-app> in html.
                host = document.body;
            }
            return super.app({
                host: host,
                component: config
            });
        }
        return super.app(config);
    }
}

export { Aurelia, PLATFORM, Aurelia as default };
//# sourceMappingURL=index.dev.mjs.map
